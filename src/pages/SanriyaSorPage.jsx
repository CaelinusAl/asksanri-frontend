import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SanriyaSorPage.module.css";

import StarTrail from "../components/StarTrail";
import { unlockAudio, playSfx } from "../utils/sfx";
import { useLanguage } from "../contexts/LanguageContext";
import SeoHead from "../components/SeoHead";
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

function parseLayers(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;

  const markers = [
    { key: "yanki", re: /\[İLK YANKI\]\s*/i },
    { key: "derin", re: /\[DERİN KATMAN\]\s*/i },
    { key: "hatirlatma", re: /\[HATIRLATMA\]\s*/i },
  ];

  const positions = markers
    .map((m) => {
      const match = text.match(m.re);
      return match ? { key: m.key, start: match.index, len: match[0].length } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.start - b.start);

  if (positions.length < 2) {
    const paras = text.split(/\n{2,}/).filter((p) => p.trim());
    if (paras.length >= 3) {
      return { yanki: paras[0].trim(), derin: paras.slice(1, -1).join("\n\n").trim(), hatirlatma: paras[paras.length - 1].trim() };
    }
    if (paras.length === 2) {
      return { yanki: paras[0].trim(), derin: paras[1].trim(), hatirlatma: "" };
    }
    return { yanki: text, derin: "", hatirlatma: "" };
  }

  const extract = (idx) => {
    const cur = positions[idx];
    const next = positions[idx + 1];
    const from = cur.start + cur.len;
    const to = next ? next.start : text.length;
    return text.slice(from, to).trim();
  };

  const result = { yanki: "", derin: "", hatirlatma: "" };
  positions.forEach((p, i) => {
    result[p.key] = extract(i);
  });
  return result;
}

function LayeredReply({ layers, isTR }) {
  if (!layers) return null;
  return (
    <div className={styles.layeredReply}>
      {layers.yanki ? (
        <motion.div
          className={styles.layerYanki}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.layerTag}>{isTR ? "İlk Yankı" : "First Echo"}</span>
          <p className={styles.layerYankiText}>{layers.yanki}</p>
        </motion.div>
      ) : null}

      {layers.derin ? (
        <motion.div
          className={styles.layerDerin}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
        >
          <span className={styles.layerTag}>{isTR ? "Derin Katman" : "Deep Layer"}</span>
          <p className={styles.layerDerinText}>{layers.derin}</p>
        </motion.div>
      ) : null}

      {layers.hatirlatma ? (
        <motion.div
          className={styles.layerHatirlatma}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className={styles.layerTag}>{isTR ? "Hatırlatma" : "Reminder"}</span>
          <p className={styles.layerHatirlatmaText}>{layers.hatirlatma}</p>
        </motion.div>
      ) : null}
    </div>
  );
}

function ResultCTAs({ isTR, navigate }) {
  const ctas = [
    {
      label: isTR ? "Daha derine in" : "Go deeper",
      desc: isTR ? "Rol okuma ile döngünü gör" : "See your cycle with Role Reading",
      path: "/rol-okuma",
      icon: "◈",
    },
    {
      label: isTR ? "Bunu frekansa taşı" : "Carry this to frequency",
      desc: isTR ? "Frekans alanında enerji oku" : "Read energy in the Frequency Field",
      path: "/frekans",
      icon: "✦",
    },
    {
      label: isTR ? "Yankıya bırak" : "Leave it to the echo",
      desc: isTR ? "Başka bir cümle yaz, yankını izle" : "Write another sentence, watch the echo",
      action: "reset",
      icon: "↻",
    },
  ];

  return (
    <motion.div
      className={styles.ctaRow}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
    >
      {ctas.map((c) => (
        <button
          key={c.label}
          type="button"
          className={styles.ctaCard}
          onClick={() => {
            if (c.action === "reset") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (c.path) {
              navigate(c.path);
            }
          }}
        >
          <span className={styles.ctaIcon}>{c.icon}</span>
          <span className={styles.ctaLabel}>{c.label}</span>
          <span className={styles.ctaDesc}>{c.desc}</span>
        </button>
      ))}
    </motion.div>
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
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const taRef = useRef(null);
  const hasIntroPlayedRef = useRef(false);
  const hasDoorVoicePlayedRef = useRef(false);
  const gestureLockRef = useRef(false);
  const typingCancelRef = useRef({ alive: true });

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

  useEffect(() => {
    if (q.mode) setMode(q.mode);
    if (q.domain) setDomain(q.domain);
    if (q.prefill) setText(String(q.prefill));
  }, [q.mode, q.domain, q.prefill]);

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
      const pause = ch === "\n" ? 90 : ch === "." || ch === "!" ? 110 : ch === "," || ch === ";" || ch === ":" ? 60 : 0;
      const base = 12;
      const jitter = Math.floor(Math.random() * 12);
      if (i < full.length) window.setTimeout(step, base + jitter + pause);
    };

    window.setTimeout(step, 60);
    return () => { aliveRef.alive = false; };
  }, [replyFull]);

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
        return (base ? base + " " : "") + (finalText + interim).trim();
      });
    };
    rec.start();
  }, [isTR]);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop?.(); } catch {}
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => { try { recognitionRef.current?.stop?.(); } catch {} };
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

    if (!hasDoorVoicePlayedRef.current) {
      hasDoorVoicePlayedRef.current = true;
      try { playSfx(isTR ? "/sfx/door-open.mp3" : "/sfx/door-open-en.mp3", { volume: 0.30 }); } catch {}
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

      const answer = data?.answer || data?.response || data?.text || data?.message || "";
      setReplyFull(String(answer || "").trim());
    } catch (e) {
      setErrorMsg(String(e?.message || "") || (isTR ? "Bağlantı hatası." : "Connection error."));
    } finally {
      setIsThinking(false);
      setIsSending(false);
    }
  }, [API_URL, domain, isTR, isSending, mode, onUserGesture, text, token, user]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; }, [handleSubmit]);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitRef.current?.();
    }
  }, []);

  const layers = useMemo(() => parseLayers(typedReply), [typedReply]);
  const isTypingDone = typedReply.length > 0 && typedReply.length === replyFull.length;
  const hasReply = Boolean(replyFull);

  return (
    <div className={styles.page} onPointerDown={onUserGesture}>
      <SeoHead
        title={isTR ? "Sanrı'ya Sor \u2014 AI Bilinç Aynası" : "Ask Sanri \u2014 AI Consciousness Mirror"}
        description={isTR
          ? "Sanrı'ya sor: yapay zeka destekli bilinç aynası. Derin içgörü al, katmanları gör."
          : "Ask Sanri: AI consciousness mirror. Get deep layered insights."
        }
        path="/sanriya-sor"
      />
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brandPill}>SANRI</span>
        </div>
        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={goBackToGates}>
            {isTR ? "← Kapılar" : "← Gates"}
          </button>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            aria-label="Language toggle"
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.shell}>
        {/* HERO */}
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heroGlyph}>✦</div>
          <h1 className={styles.heroTitle}>{isTR ? "Sanrı'ya Sor" : "Ask Sanri"}</h1>
          <p className={styles.heroSub}>
            {isTR
              ? "Bir cümle yaz. Sana görünenin altındaki katmanı açayım."
              : "Write a sentence. Let me open the layer beneath what you see."}
          </p>
        </motion.div>

        {/* INPUT */}
        <motion.div
          className={styles.inputArea}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className={styles.inputForm}
          >
            <textarea
              ref={taRef}
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isTR ? "Ne hissediyorsun, ne gördün, ne taşıyorsun..." : "What do you feel, what did you see, what are you carrying..."}
              disabled={isSending}
              rows={3}
            />
            <div className={styles.inputActions}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSending || !String(text || "").trim()}
              >
                {isSending ? (isTR ? "Açılıyor..." : "Opening...") : (isTR ? "Yansıt" : "Reflect")}
              </button>
              <button
                type="button"
                className={`${styles.micBtn} ${isListening ? styles.micLive : ""}`}
                onClick={isListening ? stopListening : startListening}
                disabled={isSending}
                aria-label={isTR ? "Sesle yaz" : "Voice input"}
              >
                🎙
              </button>
              {hasReply ? (
                <button type="button" className={styles.resetBtn} onClick={handleReset}>
                  {isTR ? "Yeni soru" : "New question"}
                </button>
              ) : null}
            </div>
          </form>

          {/* Advanced options */}
          <div className={styles.advancedWrap}>
            <button
              type="button"
              className={styles.advancedToggle}
              onClick={() => setAdvancedOpen((o) => !o)}
              aria-expanded={advancedOpen}
            >
              {isTR ? "Gelişmiş seçenekler" : "Advanced options"}
              <span className={`${styles.advancedArrow} ${advancedOpen ? styles.advancedArrowOpen : ""}`}>▾</span>
            </button>
            <AnimatePresence>
              {advancedOpen && (
                <motion.div
                  className={styles.advancedBody}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className={styles.advancedGrid}>
                    <div className={styles.advField}>
                      <label className={styles.advLabel}>{isTR ? "Mod" : "Mode"}</label>
                      <select className={styles.advSelect} value={mode} onChange={(e) => setMode(e.target.value)}>
                        {MODES.map((m) => (
                          <option key={m.id} value={m.id}>{isTR ? m.tr : m.en}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.advField}>
                      <label className={styles.advLabel}>{isTR ? "Alan" : "Domain"}</label>
                      <select className={styles.advSelect} value={domain} onChange={(e) => setDomain(e.target.value)}>
                        {DOMAINS.map((d) => (
                          <option key={d.id} value={d.id}>{isTR ? d.tr : d.en}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* RESPONSE */}
        <AnimatePresence>
          {(isThinking || hasReply || errorMsg) && (
            <motion.div
              className={styles.responseArea}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {errorMsg ? (
                <div className={styles.error}>{errorMsg}</div>
              ) : null}

              {isThinking ? (
                <ThinkingDots label={isTR ? "Katmanlar açılıyor" : "Layers opening"} />
              ) : null}

              {layers && !isThinking ? (
                <LayeredReply layers={layers} isTR={isTR} />
              ) : null}

              {isTypingDone ? (
                <ResultCTAs isTR={isTR} navigate={navigate} />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* WHISPER */}
        {!hasReply && !isThinking && (
          <motion.p
            className={styles.whisper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {isTR
              ? "Bazı cevaplar soruyu değiştirir. Bazıları seni."
              : "Some answers change the question. Some change you."}
          </motion.p>
        )}
      </div>
    </div>
  );
}
