// src/pages/SanriyaSorPage.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SanriyaSorPage.module.css";

import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio, playSfx } from "../utils/sfx";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MODES = [
  { id: "mirror", labelKey: "sanri.modes.mirror", fallbackTR: "Ayna", fallbackEN: "Mirror" },
  { id: "dream", labelKey: "sanri.modes.dream", fallbackTR: "Rüya", fallbackEN: "Dream" },
  { id: "divine", labelKey: "sanri.modes.divine", fallbackTR: "İlahi", fallbackEN: "Divine" },
  { id: "shadow", labelKey: "sanri.modes.shadow", fallbackTR: "Gölge", fallbackEN: "Shadow" },
  { id: "light", labelKey: "sanri.modes.light", fallbackTR: "Işık", fallbackEN: "Light" },
];

const DOMAINS = [
  { id: "auto", labelKey: "sanri.domains.auto", fallbackTR: "Otomatik", fallbackEN: "Auto" },
  { id: "awakened_cities", labelKey: "sanri.domains.awakened_cities", fallbackTR: "Uyanmış Şehirler", fallbackEN: "Awakened Cities" },
  { id: "consciousness_field", labelKey: "sanri.domains.consciousness_field", fallbackTR: "Bilinç Alanı", fallbackEN: "Consciousness Field" },
  { id: "frequency_field", labelKey: "sanri.domains.frequency_field", fallbackTR: "Frekans Alanı", fallbackEN: "Frequency Field" },
  { id: "ritual_space", labelKey: "sanri.domains.ritual_space", fallbackTR: "Ritüel Alanı", fallbackEN: "Ritual Space" },
  { id: "neural_ecstasy", labelKey: "sanri.domains.neural_ecstasy", fallbackTR: "Beyin Orgazmı", fallbackEN: "Neural Ecstasy" },
  { id: "book_112", labelKey: "sanri.domains.book_112", fallbackTR: "112. Kitap", fallbackEN: "Book 112" },
];

function getQuery(search) {
  const sp = new URLSearchParams(search);
  return {
    domain: sp.get("domain"),
    mode: sp.get("mode"),
    prefill: sp.get("prefill"),
  };
}

export default function SanriyaSorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { language, setLanguage, t } = useLanguage();
  const isTR = language === "tr";

  const q = useMemo(() => getQuery(location.search), [location.search]);

  const [mode, setMode] = useState(q.mode || "mirror");
  const [domain, setDomain] = useState(q.domain || "auto");
  const [text, setText] = useState(q.prefill ? String(q.prefill) : "");
  const [isSending, setIsSending] = useState(false);

  const [replyFull, setReplyFull] = useState("");
  const [replyShown, setReplyShown] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const taRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Query değişirse (kapıdan prefill ile gelince) state güncelle
  useEffect(() => {
    if (q.mode) setMode(q.mode);
    if (q.domain) setDomain(q.domain);
    if (q.prefill) setText(String(q.prefill));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.mode, q.domain, q.prefill]);

  const tt = useCallback(
    (key, fallback) => {
      try {
        const v = t?.(key);
        if (!v || v === key) return fallback;
        return v;
      } catch {
        return fallback;
      }
    },
    [t]
  );

  const hint = useMemo(() => {
    const base = isTR
      ? "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.\n"
      : "Pause for a moment. Feel where your question resonates in your body.\nSANRI does not answer; it opens a door.\n";

    const modeLine = isTR ? `\nMod: ${mode}\nNet bir cümle yaz. Cevap değil; yansıma gelecek.` : `\nMode: ${mode}\nWrite one clear sentence. Not an answer—reflection will arrive.`;
    return base + modeLine;
  }, [isTR, mode]);

  const goBackHome = () => {
    unlockAudio();
    playSfx("/sfx/door-whoosh.mp3", { volume: 0.55 });
    navigate("/");
  };

  const handleReset = () => {
    setText("");
    setReplyFull("");
    setReplyShown("");
    setErrorMsg("");
    window.setTimeout(() => taRef.current?.focus?.(), 0);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
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
    unlockAudio();
    if (isListening) return;
    const rec = ensureRecognition();
    if (!rec) {
      setErrorMsg(isTR ? "Tarayıcı ses tanımayı desteklemiyor." : "Speech recognition not supported.");
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

  // Typewriter-ish reveal (lightweight)
  useEffect(() => {
    if (!replyFull) return;
    setReplyShown("");
    let i = 0;
    const timer = window.setInterval(() => {
      i += 2;
      setReplyShown(replyFull.slice(0, i));
      if (i >= replyFull.length) window.clearInterval(timer);
    }, 14);
    return () => window.clearInterval(timer);
  }, [replyFull]);

  const handleSubmit = useCallback(async () => {
    unlockAudio();
    setErrorMsg("");

    const payloadText = String(text || "").trim();
    if (!payloadText || isSending) return;

    if (!API_URL) {
      setErrorMsg(isTR ? "VITE_BACKEND_URL tanımlı değil (Vercel env)." : "VITE_BACKEND_URL is missing (Vercel env).");
      return;
    }

    setIsSending(true);
    setReplyFull("");
    setReplyShown("");

    // küçük aura chime (çok düşük)
    playSfx("/sfx/aura-chime.mp3", { volume: 0.22 });

    try {
      const response = await fetch(`${API_URL}/bilinc-alani/ask`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: text,
    mode: "mirror",
    domain: selectedDomain,
  }),
});

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.detail || data?.error || (isTR ? "Bir hata oluştu." : "An error occurred.");
        setErrorMsg(String(msg));
        setIsSending(false);
        return;
      }

      const answer = data?.response ?? data?.reply ?? data?.text ?? "";
      setReplyFull(String(answer || ""));
      setIsSending(false);
    } catch (err) {
      setErrorMsg(isTR ? "Bağlantı hatası." : "Network error.");
      setIsSending(false);
    }
  }, [text, isSending, mode, domain, language, isTR]);

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      {/* TOPBAR */}
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

          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title={isTR ? "EN" : "TR"}
            aria-label="Language toggle"
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      {/* CARD */}
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</div>

          <div className={styles.h1}>
            {tt("sanri.title", isTR ? "SANRI’ya Sor" : "Ask SANRI")}
          </div>

          <div className={styles.subtitle}>
            {tt(
              "sanri.subtitleLine",
              isTR ? "Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın." : "This is not an answer. It is a reflection. You open the door."
            )}
          </div>

          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.left}>
              <div className={styles.block}>
                <div className={styles.label}>{tt("common.mode", isTR ? "Mod" : "Mode")}</div>
                <select className={styles.select} value={mode} onChange={(e) => setMode(e.target.value)}>
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {tt(m.labelKey, isTR ? m.fallbackTR : m.fallbackEN)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>{tt("common.domain", isTR ? "Domain (opsiyonel)" : "Domain (optional)")}</div>
                <select className={styles.select} value={domain} onChange={(e) => setDomain(e.target.value)}>
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {tt(d.labelKey, isTR ? d.fallbackTR : d.fallbackEN)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.rule}>
                <div className={styles.label}>{tt("common.guide", isTR ? "Kılavuz" : "Guide")}</div>
                <pre className={styles.hint}>{hint}</pre>
              </div>
            </div>

            {/* RIGHT */}
            <div className={styles.right}>
              <div className={styles.panel}>
                <div className={styles.label}>
                  {tt("common.reflectionFlow", isTR ? "Yansıma Akışı" : "Reflection Flow")}
                </div>

                {/* FORM = garanti submit */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <textarea
                    ref={taRef}
                    className={styles.textarea}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tt(
                      "sanri.placeholder",
                      isTR ? "Bir kelime, soru, rüya veya tarih yaz..." : "Write a word, question, dream or date..."
                    )}
                    disabled={isSending}
                  />

                  <div className={styles.actions}>
                    <button type="button" className={styles.btnGhost} onClick={handleReset}>
                      {tt("common.reset", isTR ? "Sıfırla" : "Reset")}
                    </button>

                    <button
                      type="submit"
                      className={styles.btnPrimary}
                      disabled={isSending || !String(text || "").trim()}
                      title="Ctrl+Enter"
                    >
                      {isSending ? tt("common.reflecting", isTR ? "Yansıtılıyor…" : "Reflecting…") : tt("common.reflect", isTR ? "Yansıt (Ctrl+Enter)" : "Reflect (Ctrl+Enter)")}
                    </button>

                    <div className={styles.grow} />

                    <button
                      type="button"
                      className={`${styles.micBtn} ${isListening ? styles.live : ""}`}
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? tt("common.stop", isTR ? "Durdur" : "Stop") : tt("common.voiceInput", isTR ? "Sesle yaz" : "Voice input")}
                    </button>
                  </div>
                </form>
              </div>

              <div className={`${styles.panel} ${styles.reply}`}>
                <div className={styles.label}>{tt("common.reflection", isTR ? "Yansıma" : "Reflection")}</div>

                {errorMsg ? <div className={styles.error}>{errorMsg}</div> : null}

                <div className={styles.replybox}>
                  {replyShown ||
                    (!replyFull && !isSending
                      ? tt("common.reflectionEmpty", isTR ? "Yansıma burada belirecek." : "Your reflection will appear here.")
                      : "")}
                </div>
              </div>

              <div className={styles.footnote}>
                {tt(
                  "common.footnote",
                  isTR
                    ? "Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026 CaelinusAI • SANRI"
                    : "This space does not produce “knowledge”. It reflects meaning—shaped within you. © 2026 CaelinusAI • SANRI"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}