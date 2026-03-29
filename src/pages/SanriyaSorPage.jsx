import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SanriyaSorPage.module.css";

import StarTrail from "../components/StarTrail";
import { unlockAudio, playSfx } from "../utils/sfx";
import { useLanguage } from "../contexts/LanguageContext";

const MODES = [
  { id: "mirror", tr: "Ayna", en: "Mirror" },
  { id: "dream", tr: "R\u00fcya", en: "Dream" },
  { id: "divine", tr: "\u0130lahi", en: "Divine" },
  { id: "shadow", tr: "G\u00f6lge", en: "Shadow" },
  { id: "light", tr: "I\u015f\u0131k", en: "Light" },
];

const DOMAINS = [
  { id: "auto", tr: "Otomatik", en: "Auto" },
  { id: "awakened_cities", tr: "Uyanan \u015eehirler", en: "Awakened Cities" },
  { id: "consciousness_field", tr: "Bilin\u00e7 Alan\u0131", en: "Consciousness Field" },
  { id: "frequency_field", tr: "Frekans Alan\u0131", en: "Frequency Field" },
  { id: "ritual_space", tr: "Rit\u00fcel Alan\u0131", en: "Ritual Space" },
  { id: "library", tr: "K\u00fct\u00fcphane", en: "Library" },
];

function parseQuery(search) {
  const sp = new URLSearchParams(search || "");
  return { mode: sp.get("mode") || "", domain: sp.get("domain") || "", prefill: sp.get("prefill") || "" };
}

function ThinkingDots({ label }) {
  return (
    <div className={styles.thinking}>
      <span className={styles.thinkingLabel}>{label}</span>
      <span className={styles.dots}><i /><i /><i /></span>
    </div>
  );
}

export default function SanriyaSorPage() {
  const API_URL = (import.meta?.env?.VITE_BACKEND_URL && String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) || "https://api.asksanri.com";
  const navigate = useNavigate();
  const location = useLocation();
  const q = useMemo(() => parseQuery(location.search), [location.search]);

  const locState = location.state || {};
  const gateSystemContext = locState.systemContext || "";
  const gateName = locState.gateName || "";
  const isCityMode = !!locState.cityMode;
  const cityName = locState.cityName || "";
  const cityArchetype = locState.cityArchetype || "";
  const cityCore = locState.cityCore || "";
  const cityElement = locState.cityElement || "";
  const citySymbol = locState.citySymbol || "";
  const cityIntro = locState.cityIntro || "";
  const cityReflection = locState.cityReflection || "";
  const cityColorStr = locState.cityColor || "160,140,180";

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
  const [messages, setMessages] = useState([]);

  const taRef = useRef(null);
  const hasIntroPlayedRef = useRef(false);
  const hasDoorVoicePlayedRef = useRef(false);
  const gestureLockRef = useRef(false);
  const typingCancelRef = useRef({ alive: true });
  const chatEndRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const goBack = useCallback(() => {
    if (isCityMode) {
      navigate("/uyanan-sehirler", { state: { skipIntro: true } });
    } else {
      navigate("/", { replace: false, state: { skipIntro: true } });
    }
  }, [navigate, isCityMode]);

  const ensureIntroOnce = useCallback(() => {
    if (hasIntroPlayedRef.current) return;
    hasIntroPlayedRef.current = true;
    try {
      playSfx("/sfx/aura-chime.mp3", { volume: 0.22 });
    } catch {}
  }, []);

  const onUserGesture = useCallback(() => {
    if (gestureLockRef.current) return;
    gestureLockRef.current = true;
    unlockAudio();
    ensureIntroOnce();
    window.setTimeout(() => { gestureLockRef.current = false; }, 300);
  }, [ensureIntroOnce]);

  useEffect(() => {
    if (q.mode) setMode(q.mode);
    if (q.domain) setDomain(q.domain);
    if (q.prefill) setText(String(q.prefill));
    if (locState.mode) setMode(locState.mode);
    if (locState.domain) setDomain(locState.domain);
    if (locState.prefill) setText(String(locState.prefill));
  }, [q.mode, q.domain, q.prefill, locState.mode, locState.domain, locState.prefill]);

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
      const pause = ch === "\n" ? 120 : ".!?".includes(ch) ? 140 : ",;:".includes(ch) ? 80 : 0;
      const delay = 16 + Math.floor(Math.random() * 16) + pause;
      if (i < full.length) window.setTimeout(step, delay);
    };
    window.setTimeout(step, 80);
    return () => { aliveRef.alive = false; };
  }, [replyFull]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typedReply]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
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
      setText(prev => {
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

  useEffect(() => { return () => { try { recognitionRef.current?.stop?.(); } catch {} }; }, []);

  const handleReset = useCallback(() => {
    setText("");
    setReplyFull("");
    setTypedReply("");
    setErrorMsg("");
    setIsThinking(false);
    setIsSending(false);
    if (isCityMode) setMessages([]);
    hasDoorVoicePlayedRef.current = false;
    taRef.current?.focus?.();
  }, [isCityMode]);

  const handleSubmit = useCallback(async () => {
    onUserGesture();
    setErrorMsg("");
    const msg = String(text || "").trim();
    if (!msg || isSending) return;

    if (!hasDoorVoicePlayedRef.current) {
      hasDoorVoicePlayedRef.current = true;
      try { playSfx("/sfx/door-open.mp3", { volume: 0.30 }); } catch {}
    }

    if (isCityMode) {
      setMessages(prev => [...prev, { role: "user", text: msg }]);
    }

    setIsSending(true);
    setIsThinking(true);
    setReplyFull("");
    setText("");

    try {
      const payload = {
        message: msg,
        question: msg,
        session_id: "default",
        mode: mode || "mirror",
        domain: domain || "auto",
        lang: isTR ? "tr" : "en",
      };
      if (gateSystemContext) {
        payload.system_context = gateSystemContext;
        payload.gate_name = gateName;
      }

      const headers = { "Content-Type": "application/json" };
      const token =
        document.cookie?.split(";").find(c => c.trim().startsWith("access_token="))?.split("=")[1] ||
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token") || "";
      if (token) headers["Authorization"] = `Bearer ${token}`;
      headers["X-User-Id"] = "0";

      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || (isTR ? "Sunucu hatas\u0131" : "Server error"));

      const answer = data?.answer || data?.response || data?.text || data?.message || "";
      const clean = String(answer || "").trim();
      setReplyFull(clean);

      if (isCityMode) {
        setMessages(prev => [...prev, { role: "sanri", text: clean }]);
      }
    } catch (e) {
      setErrorMsg(String(e?.message || "") || (isTR ? "Ba\u011flant\u0131 hatas\u0131." : "Connection error."));
    } finally {
      setIsThinking(false);
      setIsSending(false);
    }
  }, [API_URL, domain, isTR, isSending, mode, onUserGesture, text, gateSystemContext, gateName, isCityMode]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; }, [handleSubmit]);
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleSubmitRef.current?.(); }
  }, []);

  const hint = useMemo(() => {
    if (isTR) return "Dur. Nefes al.\nSoru yazma: bir c\u00fcmle yaz.\nCevap bekleme: yans\u0131ma izle.\n\n\u00d6rnek:\n\u2022 \u201CBug\u00fcn i\u00e7imde neyi bast\u0131r\u0131yorum?\u201D\n\u2022 \u201CBu r\u00fcya bende neyi hat\u0131rlat\u0131yor?\u201D";
    return "Pause. One breath.\nDon\u2019t ask\u2014write one clear sentence.\nDon\u2019t demand an answer\u2014observe the reflection.\n\nExamples:\n\u2022 \u201CWhat am I suppressing today?\u201D\n\u2022 \u201CWhat is this dream reminding me of?\u201D";
  }, [isTR]);

  // =============================
  // CITY MODE - IMMERSIVE LAYOUT
  // =============================
  if (isCityMode) {
    const [cr, cg, cb] = cityColorStr.split(",");
    return (
      <div className={styles.page} style={{"--cr":cr,"--cg":cg,"--cb":cb}} onPointerDown={onUserGesture}>
        <StarTrail />

        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.brandPill}>SANRI</span>
            <span className={styles.topbarSubtitle}>{cityName} \u2022 {cityArchetype}</span>
          </div>
          <div className={styles.topbarRight}>
            <button type="button" className={styles.backBtn} onClick={goBack}>{isTR ? "\u2190 Haritaya D\u00f6n" : "\u2190 Back to Map"}</button>
            <button type="button" className={styles.langBtn} onClick={() => setLanguage(isTR ? "en" : "tr")}>{isTR?"EN":"TR"}</button>
          </div>
        </div>

        <div className={styles.cityShell}>
          {/* CITY HERO */}
          <div className={styles.cityHero}>
            <div className={styles.cityGlow} />
            <div className={styles.citySymbolBig}>{citySymbol}</div>
            <h1 className={styles.cityH1}>{cityName}</h1>
            <div className={styles.cityArch}>{cityArchetype} \u2022 {cityElement}</div>
            <p className={styles.cityCore}>{cityCore}</p>
            {cityIntro && <p className={styles.cityIntroText}>{cityIntro}</p>}
          </div>

          {/* CHAT AREA */}
          <div className={styles.chatArea}>
            {/* Initial reflection prompt */}
            {messages.length === 0 && !isThinking && (
              <div className={styles.chatWelcome}>
                <div className={styles.chatWelcomeIcon}>\u25C7</div>
                <p>{isTR
                  ? `${cityName} seni bekliyor. Bu \u015fehrin ruhuna bir soru sor, bir d\u00fc\u015f\u00fcnce payla\u015f veya sadece bir kelime yaz.`
                  : `${cityName} awaits you. Ask a question to this city\u2019s soul, share a thought, or just write a word.`
                }</p>
                {cityReflection && (
                  <div className={styles.chatReflection}>
                    <span className={styles.chatReflLabel}>{isTR ? "Yans\u0131ma Sorusu" : "Reflection"}</span>
                    <span className={styles.chatReflText}>{"\u201C"}{cityReflection}{"\u201D"}</span>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? styles.chatUser : styles.chatSanri}>
                {m.role === "sanri" && <div className={styles.chatAvatar}>\u25C7</div>}
                <div className={m.role === "user" ? styles.chatBubbleUser : styles.chatBubbleSanri}>
                  {m.role === "sanri" && i === messages.length - 1 && replyFull === m.text
                    ? typedReply
                    : m.text
                  }
                </div>
              </div>
            ))}

            {isThinking && (
              <div className={styles.chatSanri}>
                <div className={styles.chatAvatar}>\u25C7</div>
                <div className={styles.chatBubbleSanri}>
                  <ThinkingDots label={isTR ? "Hissediliyor" : "Sensing"} />
                </div>
              </div>
            )}

            {errorMsg && <div className={styles.error}>{errorMsg}</div>}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className={styles.chatInput}>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className={styles.chatForm}>
              <textarea
                ref={taRef}
                className={styles.chatTextarea}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isTR ? `${cityName} ile konu\u015f...` : `Talk to ${cityName}...`}
                disabled={isSending}
                rows={1}
              />
              <button
                type="button"
                className={`${styles.chatMic} ${isListening ? styles.micLive : ""}`}
                onClick={isListening ? stopListening : startListening}
                disabled={isSending}
                title={isTR ? "Sesle yaz" : "Voice"}
              >
                {"\uD83C\uDF99"}
              </button>
              <button
                type="submit"
                className={styles.chatSend}
                disabled={isSending || !String(text || "").trim()}
              >
                {isSending ? "\u2022\u2022\u2022" : "\u2191"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =============================
  // DEFAULT MODE - FORM LAYOUT
  // =============================
  const title = isTR ? "SANRI\u2019ya Sor" : "Ask SANRI";
  const subtitle = isTR ? "Baz\u0131 sorular\u0131n cevab\u0131 yoktur. Baz\u0131 cevaplar\u0131n ise sorusu\u2026" : "Some questions have no answer. Some answers have no question\u2026";

  return (
    <div className={styles.page} onPointerDown={onUserGesture}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brandPill}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>{isTR ? "Bilin\u00e7 ve Anlam Zekas\u0131" : "Consciousness & Meaning Intelligence"}</span>
        </div>
        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={goBack}>{isTR ? "\u2190 Kap\u0131lara D\u00f6n" : "\u2190 Back to Gates"}</button>
          <button type="button" className={styles.langBtn} onClick={() => setLanguage(isTR ? "en" : "tr")}>{isTR?"EN":"TR"}</button>
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>
            {gateName ? `CAELINUS AI \u2022 ${gateName}` : "CAELINUS AI \u2022 CONSCIOUSNESS MIRROR"}
          </div>
          <div className={styles.h1}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>

          <div className={styles.grid}>
            <div className={styles.left}>
              <div className={styles.block}>
                <div className={styles.label}>{isTR ? "Mod" : "Mode"}</div>
                <select className={styles.select} value={mode} onChange={e => setMode(e.target.value)}>
                  {MODES.map(m => <option key={m.id} value={m.id}>{isTR ? m.tr : m.en}</option>)}
                </select>
              </div>
              <div className={styles.block}>
                <div className={styles.label}>{isTR ? "Domain (opsiyonel)" : "Domain (optional)"}</div>
                <select className={styles.select} value={domain} onChange={e => setDomain(e.target.value)}>
                  {DOMAINS.map(d => <option key={d.id} value={d.id}>{isTR ? d.tr : d.en}</option>)}
                </select>
              </div>
              <div className={styles.rule}>
                <div className={styles.label}>{isTR ? "K\u0131lavuz" : "Guide"}</div>
                <pre className={styles.hint}>{hint}</pre>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.panel}>
                <div className={styles.panelLabel}>{isTR ? "Yans\u0131ma Ak\u0131\u015f\u0131" : "Reflection Flow"}</div>
                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                  <textarea ref={taRef} className={styles.textarea} value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder={isTR ? "Bir kelime, soru, r\u00fcya veya tarih yaz..." : "Write a word, question, dream or date..."} disabled={isSending} />
                  <div className={styles.actions}>
                    <button type="button" className={styles.btnGhost} onClick={handleReset}>{isTR ? "S\u0131f\u0131rla" : "Reset"}</button>
                    <button type="submit" className={styles.btnPrimary} disabled={isSending || !String(text || "").trim()}>
                      {isSending ? (isTR ? "Yans\u0131t\u0131l\u0131yor\u2026" : "Reflecting\u2026") : (isTR ? "Yans\u0131t (Ctrl+Enter)" : "Reflect (Ctrl+Enter)")}
                    </button>
                    <div className={styles.grow} />
                    <button type="button" className={`${styles.micBtn} ${isListening ? styles.micLive : ""}`} onClick={isListening ? stopListening : startListening} disabled={isSending}>
                      {isListening ? (isTR ? "Durdur" : "Stop") : (isTR ? "\uD83C\uDF99 Sesle yaz" : "\uD83C\uDF99 Voice")}
                    </button>
                  </div>
                </form>
              </div>

              <div className={`${styles.panel} ${styles.replyPanel}`}>
                <div className={styles.panelLabel}>{isTR ? "Cevap" : "Reply"}</div>
                {errorMsg && <div className={styles.error}>{errorMsg}</div>}
                {isThinking && <ThinkingDots label={isTR ? "Yans\u0131t\u0131l\u0131yor" : "Reflecting"} />}
                <div className={styles.replyBox}><pre className={styles.replyText}>{typedReply || ""}</pre></div>
                {!typedReply && !errorMsg && !isThinking && <div className={styles.empty}>{isTR ? "Yans\u0131ma burada belirecek." : "Your reflection will appear here."}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
