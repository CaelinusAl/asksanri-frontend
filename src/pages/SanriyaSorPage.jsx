import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SanriyaSorPage.module.css";
import { useLanguage } from "../contexts/LanguageContext";

// (opsiyonel) Eğer kapı dönüşünü hook’la yapıyorsan kullanırsın.
// yoksa sadece Home’a navigate edebilirsin.
import { useDoor } from "../contexts/DoorNavContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// UI seçenekleri
const MODES = [
  { id: "mirror", labelKey: "sanri.modes.mirror", fallback: "Ayna" },
  { id: "dream", labelKey: "sanri.modes.dream", fallback: "Rüya" },
  { id: "divine", labelKey: "sanri.modes.divine", fallback: "İlahi" },
  { id: "shadow", labelKey: "sanri.modes.shadow", fallback: "Gölge" },
  { id: "light", labelKey: "sanri.modes.light", fallback: "Işık" },
];

const DOMAINS = [
  { id: "auto", labelKey: "sanri.domains.auto", fallback: "Otomatik" },
  { id: "awakened_cities", labelKey: "sanri.domains.awakened_cities", fallback: "Uyanmış Şehirler" },
  { id: "consciousness_field", labelKey: "sanri.domains.consciousness_field", fallback: "Bilinç Alanı" },
  { id: "frequency_field", labelKey: "sanri.domains.frequency_field", fallback: "Frekans Alanı" },
  { id: "ritual_space", labelKey: "sanri.domains.ritual_space", fallback: "Ritüel Alanı" },
  { id: "neural_ecstasy", labelKey: "sanri.domains.neural_ecstasy", fallback: "Beyin Orgazmı" },
  { id: "book_112", labelKey: "sanri.domains.book_112", fallback: "112. Kitap" },
];

// Domain -> (opsiyonel) field bileşeni
// Şu an sadece Bilinç Alanı field'ını bağlamak istersen:
import BilincAlaniField from "../components/sanri/fields/BilincAlaniField";

const DOMAIN_COMPONENTS = {
  consciousness_field: BilincAlaniField,
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SanriyaSorPage() {
  const { language, t } = useLanguage();
  const isTR = language === "tr";
  const { go } = useDoor?.() || { go: null }; // DoorNavContext yoksa kırılmasın

  const query = useQuery();

  // Querystring: ?domain=frequency_field&prefill=...
  const initialDomain = query.get("domain") || "auto";
  const initialPrefill = query.get("prefill") || "";

  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState(initialDomain);
  const [text, setText] = useState(initialPrefill);

  const [isSending, setIsSending] = useState(false);
  const [replyFull, setReplyFull] = useState("");
  const [replyShown, setReplyShown] = useState("");

  const taRef = useRef(null);

  // --- SpeechRecognition (opsiyonel)
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const ensureRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = isTR ? "tr-TR" : "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    return rec;
  };

  const startListening = () => {
    if (isListening) return;
    const rec = ensureRecognition();
    if (!rec) return;

    recognitionRef.current = rec;

    rec.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
      }
      if (finalText) setText((prev) => (prev ? prev + " " : "") + finalText.trim());
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    try {
      rec.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setIsListening(false);
  };

  // --- Reply typing effect
  useEffect(() => {
    if (!replyFull) {
      setReplyShown("");
      return;
    }
    let i = 0;
    const speed = 10;
    const id = window.setInterval(() => {
      i += 1;
      setReplyShown(replyFull.slice(0, i));
      if (i >= replyFull.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [replyFull]);

  // --- Domain Field
  const FieldComponent = DOMAIN_COMPONENTS[domain] || null;

  const hint = useMemo(() => {
    // burada istersen t() ile hint’leri çoğaltırız.
    const base = isTR
      ? "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar."
      : "Pause for a moment. Feel where your question resonates in your body.\nSANRI does not answer; it opens a door.";

    const modeLine = isTR ? `\n\nMod: ${MODES.find(m => m.id === mode)?.fallback || ""}` : `\n\nMode: ${MODES.find(m => m.id === mode)?.fallback || ""}`;
    const noteLine = isTR
      ? "\nNet bir cümle yaz. Cevap değil, yansıma gelecek."
      : "\nWrite one clear sentence. Not an answer—reflection will arrive.";

    return base + modeLine + noteLine;
  }, [isTR, mode]);

  // ✅ TEK handleSubmit (asla ikinci yok)
  const handleSubmit = async () => {
    if (!text.trim() || isSending) return;

    try {
      setIsSending(true);
      setReplyFull("");

      // backend endpoint: senin sisteminde hangi endpoint doğruysa burayı tek satır değiştiririz.
      // Örn: "/sanri/ask" veya "/ask" vs.
      const endpoint = "/ask";

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // backend'in beklediği alanlara göre: text/mode/domain/lang
        body: JSON.stringify({
          text,
          mode,
          domain,
          language: isTR ? "tr" : "en",
        }),
      });

      const data = await res.json();

      // backend cevabı: { answer } ya da { reply } olabilir
      const answer = data?.answer || data?.reply || data?.message || JSON.stringify(data);
      setReplyFull(String(answer || ""));
    } catch (e) {
      setReplyFull(isTR ? "Bağlantı hatası. Tekrar dene." : "Connection error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setText("");
    setReplyFull("");
    setReplyShown("");
    taRef.current?.focus?.();
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const goBackHome = () => {
    // Door system varsa onu kullan
    if (go) return go("/");
    // yoksa klasik:
    window.location.href = "/";
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.brand}>CAELINUS AI</span>
            <span className={styles.topbarSubtitle}>
              {isTR ? "Bilinç ve Anlam Zekası" : "Consciousness & Meaning Intelligence"}
            </span>
          </div>

          <div className={styles.topbarRight}>
            <button type="button" className={styles.backBtn} onClick={goBackHome}>
              {isTR ? "← Kapılara Dön" : "← Back to Gates"}
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</div>
          <div className={styles.h1}>{t?.("sanri.title") || (isTR ? "SANRI’ya Sor" : "Ask SANRI")}</div>
          <div className={styles.subtitle}>
            {t?.("sanri.subtitleLine") || (isTR ? "Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın." : "This is not an answer. It is a reflection. You open the door.")}
          </div>

          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.left}>
              <div className={styles.block}>
                <div className={styles.label}>{t?.("common.mode") || (isTR ? "Mod" : "Mode")}</div>
                <select className={styles.select} value={mode} onChange={(e) => setMode(e.target.value)}>
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {t?.(m.labelKey) || m.fallback}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>{t?.("common.domain") || (isTR ? "Domain (opsiyonel)" : "Domain (optional)")}</div>
                <select className={styles.select} value={domain} onChange={(e) => setDomain(e.target.value)}>
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {t?.(d.labelKey) || d.fallback}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.rule}>
                <div className={styles.label}>{t?.("common.guide") || (isTR ? "Kılavuz" : "Guide")}</div>
                <pre className={styles.hint}>{hint}</pre>
              </div>

              {/* Domain field */}
              {FieldComponent ? (
                <div className={styles.panel}>
                  <div className={styles.label}>{isTR ? "Bilinç Alanı" : "Consciousness Field"}</div>
                  <FieldComponent
                    language={isTR ? "tr" : "en"}
                    onInsert={(txt) => setText((prev) => (prev ? prev + "\n\n" : "") + String(txt || ""))}
                  />
                </div>
              ) : null}
            </div>

            {/* RIGHT */}
            <div className={styles.right}>
              <div className={styles.panel}>
                <div className={styles.label}>
                  {t?.("common.reflectionFlow") || (isTR ? "Yansıma Akışı" : "Reflection Flow")}
                </div>

                <textarea
                  ref={taRef}
                  className={styles.textarea}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t?.("sanri.placeholder") || (isTR ? "Bir kelime, soru, rüya veya tarih yaz..." : "Write a word, question, dream or date...")}
                  disabled={isSending}
                />

                <div className={styles.actions}>
                  <button type="button" className={styles.btnGhost} onClick={handleReset}>
                    {t?.("common.reset") || (isTR ? "Sıfırla" : "Reset")}
                  </button>

                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleSubmit}
                    disabled={isSending || !text.trim()}
                    title="Ctrl+Enter"
                  >
                    {isSending ? (t?.("common.reflecting") || (isTR ? "Yansıtılıyor…" : "Reflecting…")) : (t?.("common.reflect") || (isTR ? "Yansıt (Ctrl+Enter)" : "Reflect (Ctrl+Enter)"))}
                  </button>

                  <div className={styles.grow} />

                  <button
                    type="button"
                    className={`${styles.btnMic} ${isListening ? styles.live : ""}`}
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? (t?.("common.stop") || (isTR ? "Durdur" : "Stop")) : (t?.("common.voiceInput") || (isTR ? "Sesle yaz" : "Voice input"))}
                  </button>
                </div>
              </div>

              <div className={`${styles.panel} ${styles.reply}`}>
                <div className={styles.label}>{t?.("common.reflection") || (isTR ? "Yansıma" : "Reflection")}</div>
                <div className={styles.replybox}>
                  {replyShown || (!replyFull && !isSending ? (t?.("common.reflectionEmpty") || (isTR ? "Yansıma burada belirecek." : "Your reflection will appear here.")) : "")}
                </div>
              </div>

              <div className={styles.footnote}>
                {isTR
                  ? "Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026 CaelinusAI • SANRI"
                  : "This space does not produce “knowledge”. It reflects meaning—shaped within you. © 2026 CaelinusAI • SANRI"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
