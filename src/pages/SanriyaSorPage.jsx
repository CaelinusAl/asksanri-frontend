import React, { useMemo, useRef, useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import BilincAlaniField from "../components/sanri/fields/BilincAlaniField";
import styles from "./SanriyaSorPage.module.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

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

export default function SanriyaSorPage() {
  const { language, setLanguage, t } = useLanguage();
  const isTR = language === "tr";

  // t bazen object bazen function → güvenli resolver
  const tr = (key, fallback = "") => {
    try {
      if (typeof t === "function") return t(key) ?? fallback;
      const val = key.split(".").reduce((acc, k) => acc?.[k], t);
      return val ?? fallback;
    } catch {
      return fallback;
    }
  };

  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");

  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [replyFull, setReplyFull] = useState("");
  const [replyShown, setReplyShown] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // voice
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const hint = useMemo(() => {
    const base = isTR
      ? "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar."
      : "Pause for a moment. Feel where your question resonates in your body.\nSANRI does not answer; it opens a door.";

    const perTR = {
      mirror: "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
      dream: "Rüyayı sahne gibi anlat. Simgeleri saklama.",
      divine: "Bir niyet yaz. Sonra tek soru sor.",
      shadow: "Rahatsız eden şeyi söyle. Kaçma. Abartma.",
      light: "Şu anki duygunu yaz. Yargısız.",
    };
    const perEN = {
      mirror: "Write one clear sentence. Not an answer—reflection will arrive.",
      dream: "Describe the dream like a scene. Don’t hide the symbols.",
      divine: "Write an intention. Then ask one question.",
      shadow: "Name what disturbs you. Don’t run. Don’t dramatize.",
      light: "Write the feeling you carry. Without judgment.",
    };

    const label = MODES.find((m) => m.id === mode)?.fallback ?? mode;
    return `${base}\n\n${isTR ? "Mod" : "Mode"}: ${label}\n${isTR ? perTR[mode] : perEN[mode]}`;
  }, [mode, isTR]);

  const FieldComponent = useMemo(() => {
    if (domain === "consciousness_field") return BilincAlaniField;
    return null;
  }, [domain]);

  const typeToScreen = (fullText, speed = 14) => {
    setIsTyping(true);
    setReplyShown("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setReplyShown(fullText.slice(0, i));
      if (i >= fullText.length) {
        window.clearInterval(id);
        setIsTyping(false);
      }
    }, speed);
    return () => window.clearInterval(id);
  };

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
    if (!rec) {
      typeToScreen(isTR ? "Tarayıcı ses tanımayı desteklemiyor." : "Speech recognition not supported.");
      return;
    }
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

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    };
  }, []);

  const handleReset = () => {
    setText("");
    setReplyFull("");
    setReplyShown("");
    setIsTyping(false);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    if (!API_URL) {
      typeToScreen(isTR ? "Backend URL yok. VITE_BACKEND_URL ayarla." : "Missing VITE_BACKEND_URL.");
      return;
    }

    setIsSending(true);
    setReplyFull("");
    setReplyShown("");

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mode, domain, text, language: isTR ? "tr" : "en" }),
      });

      const data = await res.json().catch(() => ({}));
      const answer = data?.answer || data?.message || (isTR ? "Yansıma boş döndü." : "Empty reflection.");

      setReplyFull(String(answer));
      setTimeout(() => typeToScreen(String(answer), 14), 220);
    } catch {
      typeToScreen(isTR ? "Bir şey koptu. Sonra tekrar dene." : "Something broke. Try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.sanriPage}>
      <div className={styles.sanriContainer}>
        <div className={styles.topbar}>
          <div className={styles.topbarRow}>
            <div className={styles.topbarLeft}>
              <span className={styles.tag}>CAELINUS AI</span>
              <span className={styles.small}>{isTR ? "Consciousness Mirror" : "Consciousness Mirror"}</span>
            </div>

            <div className={styles.topbarRight}>
              <button
                className={styles.langBtn}
                type="button"
                onClick={() => setLanguage(isTR ? "en" : "tr")}
              >
                {isTR ? "TR" : "EN"}
              </button>
              <span className={styles.small}>{isTR ? "SANRI • Soru Alanı" : "SANRI • Prompt Space"}</span>
            </div>
          </div>
        </div>

        <div className={styles.shell}>
          <div className={styles.card}>
            <div className={styles.small}>CAELINUS AI • {tr("sanri.subtitle", isTR ? "Bilinç Aynası" : "Consciousness Mirror")}</div>
            <div className={styles.sp} />
            <div className={styles.h1}>{tr("sanri.title", isTR ? "SANRI'ya Sor" : "Ask SANRI")}</div>
            <div className={styles.subtitleLine}>
              {isTR
                ? "Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın."
                : "This is not an answer. It is a reflection. You open the door."}
            </div>

            <div className={styles.grid}>
              <div className={styles.left}>
                <div className={styles.block}>
                  <div className={styles.label}>{isTR ? "Mod" : "Mode"}</div>
                  <select className={styles.select} value={mode} onChange={(e) => setMode(e.target.value)}>
                    {MODES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {tr(m.labelKey, m.fallback)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.block}>
                  <div className={styles.label}>{isTR ? "Domain (opsiyonel)" : "Domain (optional)"}</div>
                  <select className={styles.select} value={domain} onChange={(e) => setDomain(e.target.value)}>
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {tr(d.labelKey, d.fallback)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.rule}>
                  <div className={styles.label}>{isTR ? "Kılavuz" : "Guide"}</div>
                  <pre className={styles.hint}>{hint}</pre>
                </div>

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

              <div className={styles.right}>
                <div className={styles.panel}>
                  <div className={styles.label}>{isTR ? "Yansıma Akışı" : "Reflection Flow"}</div>

                  <textarea
                    className={styles.textarea}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tr("sanri.placeholder", isTR ? "Bir kelime, soru, rüya veya tarih yaz..." : "Write a word, question, dream or date...")}
                    disabled={isSending}
                  />

                  <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.ghost}`} type="button" onClick={handleReset}>
                      {isTR ? "Sıfırla" : "Reset"}
                    </button>

                    <button
                      className={`${styles.btn} ${styles.primary}`}
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSending || !text.trim()}
                      title="Ctrl+Enter"
                    >
                      {isSending ? (isTR ? "Yansıtılıyor…" : "Reflecting…") : isTR ? "Yansıt (Ctrl+Enter)" : "Reflect (Ctrl+Enter)"}
                    </button>

                    <div className={styles.grow} />

                    <button
                      className={`${styles.btn} ${styles.mic} ${isListening ? styles.live : ""}`}
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? (isTR ? "Durdur" : "Stop") : isTR ? "Sesle yaz" : "Voice input"}
                    </button>
                  </div>
                </div>

                <div className={`${styles.panel} ${styles.reply}`}>
                  <div className={styles.label}>{isTR ? "Yansıma" : "Reflection"}</div>
                  <div className={styles.replybox}>
                    {replyShown || (isSending || isTyping ? "" : isTR ? "Yansıma burada belirecek." : "Your reflection will appear here.")}
                  </div>
                </div>

                <div className={styles.footnote}>
                  {isTR
                    ? "Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir."
                    : "This space does not produce “knowledge”. It reflects meaning—shaped within you."}{" "}
                  © 2026 CaelinusAI • SANRI
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bgGlow} />
      </div>
    </div>
  );
}
