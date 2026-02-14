import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SanriyaSorPage.module.css";

import StarTrail from "../components/StarTrail";
import { unlockAudio, playSfx } from "../utils/sfx";
import { useLanguage } from "../contexts/LanguageContext";

const MODES = [
  { id: "mirror", tr: "Ayna", en: "Mirror" },
  { id: "dream", tr: "Rüya", en: "Dream" },
  { id: "divine", tr: "İlahi", en: "Divine" },
  { id: "shadow", tr: "Gölge", en: "Shadow" },
  { id: "light", tr: "Işık", en: "Light" },
];

const DOMAINS = [
  { id: "auto", tr: "Otomatik", en: "Auto" },
  { id: "awakened_cities", tr: "Uyanan Şehirler", en: "Awakened Cities" },
  { id: "consciousness_field", tr: "Bilinç Alanı", en: "Consciousness Field" },
  { id: "frequency_field", tr: "Frekans Alanı", en: "Frequency Field" },
  { id: "ritual_space", tr: "Ritüel Alanı", en: "Ritual Space" },
  { id: "library", tr: "Kütüphane", en: "Library" },
];

function parseQuery(search) {
  const sp = new URLSearchParams(search || "");
  return {
    mode: sp.get("mode") || "",
    domain: sp.get("domain") || "",
    prefill: sp.get("prefill") || "",
  };
}

function ThinkingDots({ label }) {
  return (
    <div className={styles.thinking}>
      <span className={styles.thinkingLabel}>{label}</span>
      <span className={styles.dots}>
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

export default function SanriyaSorPage() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const q = useMemo(() => parseQuery(location.search), [location.search]);

  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");
  const [text, setText] = useState("");
  const [replyFull, setReplyFull] = useState("");
  const [typedReply, setTypedReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const taRef = useRef(null);

  // SFX refs
  const hasIntroPlayedRef = useRef(false);
  const hasDoorVoicePlayedRef = useRef(false);

  // typing cancel
  const typingCancelRef = useRef({ alive: true });

  // SpeechRecognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const goBackToGates = useCallback(() => {
    navigate("/", { replace: false, state: { skipIntro: true } });
  }, [navigate]);

  // Query prefill
  useEffect(() => {
    if (q.mode) setMode(q.mode);
    if (q.domain) setDomain(q.domain);
    if (q.prefill) setText(String(q.prefill));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.mode, q.domain, q.prefill]);

  // Page enter SFX (ONLY ONCE)
  useEffect(() => {
    if (hasIntroPlayedRef.current) return;
    hasIntroPlayedRef.current = true;

    try {
      playSfx("/sfx/door-whoosh.mp3", { volume: 0.55 });
      window.setTimeout(() => {
        playSfx("/sfx/aura-chime.mp3", { volume: 0.22 });
      }, 450);
    } catch {}
  }, []);

  // Reply typing effect
  useEffect(() => {
    typingCancelRef.current.alive = false;
    typingCancelRef.current = { alive: true };
    const aliveRef = typingCancelRef.current;

    setTypedReply("");

    const full = String(replyFull || "");
    if (!full) return;

    let i = 0;
    const step = () => {
      if (!aliveRef.alive) return;
      i = Math.min(i + 1, full.length);
      setTypedReply(full.slice(0, i));

      const ch = full[i - 1] || "";
      const pause =
        ch === "\n" ? 120 :
        ch === "." || ch === "!" || ch === "?" ? 140 :
        ch === "," || ch === ";" || ch === ":" ? 80 :
        0;

      const base = 16;
      const jitter = Math.floor(Math.random() * 16);
      const delay = base + jitter + pause;

      if (i < full.length) window.setTimeout(step, delay);
    };

    window.setTimeout(step, 80);

    return () => {
      aliveRef.alive = false;
    };
  }, [replyFull]);

  const hint = useMemo(() => {
    if (isTR) {
      return [
        "Dur. Nefes al.",
        "Soru yazma: bir cümle yaz.",
        "Cevap bekleme: yansıma izle.",
        "",
        "Örnek:",
        "• “Bugün içimde neyi bastırıyorum?”",
        "• “Bu rüya bende neyi hatırlatıyor?”",
      ].join("\n");
    }
    return [
      "Pause. One breath.",
      "Don’t ask—write one clear sentence.",
      "Don’t demand an answer—observe the reflection.",
      "",
      "Examples:",
      "• “What am I suppressing today?”",
      "• “What is this dream reminding me of?”",
    ].join("\n");
  }, [isTR]);

  const title = isTR ? "SANRI’ya Sor" : "Ask SANRI";
  const subtitle = isTR
    ? "Bazı soruların cevabı yoktur. Bazı cevapların ise sorusu…"
    : "Some questions have no answer. Some answers have no question…";

  // Voice input
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(isTR ? "Sesle yazma desteklenmiyor. Chrome/Edge deneyin." : "Voice input not supported. Try Chrome/Edge.");
      return;
    }
    try { recognitionRef.current?.stop?.(); } catch {}

    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = isTR ? "tr-TR" : "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    let finalText = "";

    rec.onstart = () => setIsListening(true);
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) finalText += piece + " ";
        else interim += piece;
      }
      setText((prev) => {
        const base = (prev || "").trim();
        const merged = (base ? base + " " : "") + (finalText + interim).trim();
        return merged;
      });
    };

    rec.start();
  }, [isTR]);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop?.(); } catch {}
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop?.(); } catch {}
    };
  }, []);

  const handleReset = useCallback(() => {
    setText("");
    setReplyFull("");
    setTypedReply("");
    setErrorMsg("");
    setIsThinking(false);
    setIsSending(false);
    hasDoorVoicePlayedRef.current = false; // reset sonrası tekrar ilk soruda çalsın
    taRef.current?.focus?.();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, mode, domain, isTR, API_URL]
  );

  const handleSubmit = useCallback(async () => {
    unlockAudio();
    setErrorMsg("");

    const msg = String(text || "").trim();
    if (!msg || isSending) return;

    if (!API_URL) {
      setErrorMsg(isTR ? "VITE_BACKEND_URL eksik (Vercel env)." : "Missing VITE_BACKEND_URL (Vercel env).");
      return;
    }

    // Voice only once, on first submit (language-based)
    if (!hasDoorVoicePlayedRef.current) {
      hasDoorVoicePlayedRef.current = true;
      const doorVoice = isTR ? "/sfx/door-open.mp3" : "/sfx/door-open-en.mp3";
      try { playSfx(doorVoice, { volume: 0.30 }); } catch {}
    }

    setIsSending(true);
    setIsThinking(true);
    setReplyFull("");

    try {
      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          question: msg,
          session_id: "default",
          mode: mode || "mirror",
          domain: domain || "auto",
          lang: isTR ? "tr" : "en",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || (isTR ? "Sunucu hatası" : "Server error"));

      const answer = data?.answer || data?.response || data?.text || data?.message || "";
      setReplyFull(String(answer || "").trim());
    } catch (e) {
      const msgErr =
        String(e?.message || "") ||
        (isTR ? "Bağlantı/CORS hatası." : "Connection/CORS error.");
      setErrorMsg(msgErr);
    } finally {
      setIsThinking(false);
      setIsSending(false);
    }
  }, [API_URL, domain, isTR, isSending, mode, text]);

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brandPill}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>
            {isTR ? "Bilinç ve Anlam Zekası" : "Consciousness & Meaning Intelligence"}
          </span>
        </div>

        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={goBackToGates}>
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

      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</div>
          <div className={styles.h1}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>

          <div className={styles.grid}>
            <div className={styles.left}>
              <div className={styles.block}>
                <div className={styles.label}>{isTR ? "Mod" : "Mode"}</div>
                <select className={styles.select} value={mode} onChange={(e) => setMode(e.target.value)}>
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {isTR ? m.tr : m.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>{isTR ? "Domain (opsiyonel)" : "Domain (optional)"}</div>
                <select className={styles.select} value={domain} onChange={(e) => setDomain(e.target.value)}>
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {isTR ? d.tr : d.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.rule}>
                <div className={styles.label}>{isTR ? "Kılavuz" : "Guide"}</div>
                <pre className={styles.hint}>{hint}</pre>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.panel}>
                <div className={styles.panelLabel}>{isTR ? "Yansıma Akışı" : "Reflection Flow"}</div>

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
                    placeholder={isTR ? "Bir kelime, soru, rüya veya tarih yaz..." : "Write a word, question, dream or date..."}
                    disabled={isSending}
                  />

                  <div className={styles.actions}>
                    <button type="button" className={styles.btnGhost} onClick={handleReset}>
                      {isTR ? "Sıfırla" : "Reset"}
                    </button>

                    <button type="submit" className={styles.btnPrimary} disabled={isSending || !String(text || "").trim()}>
                      {isSending ? (isTR ? "Yansıtılıyor…" : "Reflecting…") : (isTR ? "Yansıt (Ctrl+Enter)" : "Reflect (Ctrl+Enter)")}
                    </button>

                    <div className={styles.grow} />

                    <button
                      type="button"
                      className={`${styles.micBtn} ${isListening ? styles.micLive : ""}`}
                      onClick={isListening ? stopListening : startListening}
                      disabled={isSending}
                    >
                      {isListening ? (isTR ? "Durdur" : "Stop") : (isTR ? "🎙 Sesle yaz" : "🎙 Voice")}
                    </button>
                  </div>
                </form>
              </div>

              <div className={`${styles.panel} ${styles.reply}`}>
                <div className={styles.panelLabel}>{isTR ? "Yansıma" : "Reflection"}</div>

                {errorMsg ? <div className={styles.error}>{errorMsg}</div> : null}

                <div className={styles.replybox}>
                  {isThinking || isSending ? (
                    <ThinkingDots label={isTR ? "Sanrı düşünüyor" : "SANRI is thinking"} />
                  ) : typedReply ? (
                    <div className={styles.replyText}>{typedReply}</div>
                  ) : (
                    <div className={styles.empty}>{isTR ? "Yansıma burada belirecek." : "Your reflection will appear here."}</div>
                  )}
                </div>

                <div className={styles.footnote}>
                  {isTR
                    ? "Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026 CaelinusAI • SANRI"
                    : "This space does not produce “knowledge”. It reflects meaning—shaped within you. © 2026 CaelinusAI • SANRI"}
                </div>
              </div>

              <div className={styles.bottomRow}>
                <button
                  type="button"
                  className={styles.askBtn}
                  onClick={() => {
                    taRef.current?.focus?.();
                    unlockAudio();
                    playSfx("/sfx/aura-chime.mp3", { volume: 0.18 });
                  }}
                >
                  Ask SANRI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
