// src/pages/SanriyaSorPage.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SanriyaSorPage.module.css";

import StarTrail from "../components/StarTrail";
import { unlockAudio, playSfx } from "../utils/sfx";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

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
  const API_URL =
    (import.meta?.env?.VITE_BACKEND_URL &&
      String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
    "https://api.asksanri.com";

  const navigate = useNavigate();
  const location = useLocation();
  const q = useMemo(() => parseQuery(location.search), [location.search]);

  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const { token, user } = useAuth();

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
  const gestureLockRef = useRef(false);

  // typing cancel
  const typingCancelRef = useRef({ alive: true });

  // SpeechRecognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const goBackToGates = useCallback(() => {
    navigate("/", { replace: false, state: { skipIntro: true } });
  }, [navigate]);

  const ensureIntroOnce = useCallback(() => {
    if (hasIntroPlayedRef.current) return;
    hasIntroPlayedRef.current = true;

    try {
      const enterSound = isTR ? "/sfx/door-whoosh.mp3" : "/sfx/door-open-en.mp3";
      playSfx(enterSound, { volume: 0.45 });

      window.setTimeout(() => {
        playSfx("/sfx/aura-chime.mp3", { volume: 0.22 });
      }, 550);
    } catch {}
  }, [isTR]);

  const onUserGesture = useCallback(() => {
    if (gestureLockRef.current) return;
    gestureLockRef.current = true;

    unlockAudio();
    ensureIntroOnce();

    window.setTimeout(() => {
      gestureLockRef.current = false;
    }, 300);
  }, [ensureIntroOnce]);

  // Query prefill
  useEffect(() => {
    if (q.mode) setMode(q.mode);
    if (q.domain) setDomain(q.domain);
    if (q.prefill) setText(String(q.prefill));
  }, [q.mode, q.domain, q.prefill]);

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
        ch === "\n"
          ? 120
          : ch === "." || ch === "!" || ch === "?"
          ? 140
          : ch === "," || ch === ";" || ch === ":"
          ? 80
          : 0;

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
      alert(
        isTR
          ? "Sesle yazma desteklenmiyor. Chrome/Edge deneyin."
          : "Voice input not supported. Try Chrome/Edge."
      );
      return;
    }
    try {
      recognitionRef.current?.stop?.();
    } catch {}

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
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    };
  }, []);

  const handleReset = useCallback(() => {
    setText("");
    setReplyFull("");
    setTypedReply("");
    setErrorMsg("");
    setIsThinking(false);
    setIsSending(false);
    hasDoorVoicePlayedRef.current = false;
    taRef.current?.focus?.();
  }, []);

  const handleSubmit = useCallback(async () => {
    onUserGesture();
    setErrorMsg("");

    const msg = String(text || "").trim();
    if (!msg || isSending) return;

    // Voice only once, on first submit
    if (!hasDoorVoicePlayedRef.current) {
      hasDoorVoicePlayedRef.current = true;
      const doorVoice = isTR ? "/sfx/door-open.mp3" : "/sfx/door-open-en.mp3";
      try {
        playSfx(doorVoice, { volume: 0.30 });
      } catch {}
    }

    setIsSending(true);
    setIsThinking(true);
    setReplyFull("");

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (user?.id) headers["X-User-Id"] = String(user.id);

      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers,
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

      const answer =
        data?.answer || data?.response || data?.text || data?.message || "";
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
  }, [API_URL, domain, isTR, isSending, mode, onUserGesture, text]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitRef.current?.();
    }
  }, []);

  return (
    <div className={styles.page} onPointerDown={onUserGesture}>
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
            {/* LEFT */}
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

            {/* RIGHT */}
            <div className={styles.right}>
              {/* INPUT PANEL */}
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
                      {isSending
                        ? (isTR ? "Yansıtılıyor…" : "Reflecting…")
                        : (isTR ? "Yansıt (Ctrl+Enter)" : "Reflect (Ctrl+Enter)")}
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

              {/* ✅ REPLY PANEL (FIXED) */}
              <div className={`${styles.panel} ${styles.replyPanel}`}>
                <div className={styles.panelLabel}>{isTR ? "Cevap" : "Reply"}</div>

                {errorMsg ? (
                  <div className={styles.error}>
                    {errorMsg}
                  </div>
                ) : null}

                {isThinking ? <ThinkingDots label={isTR ? "Yansıtılıyor" : "Reflecting"} /> : null}

                <div className={styles.replyBox}>
                  <pre className={styles.replyText}>{typedReply || ""}</pre>
                </div>

                {!typedReply && !errorMsg && !isThinking ? (
                  <div className={styles.empty}>
                    {isTR ? "Yansıma burada belirecek." : "Your reflection will appear here."}
                  </div>
                ) : null}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
