// src/pages/SanriyaSorPage.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SanriyaSorPage.module.css";

import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio, playSfx } from "../utils/sfx";

const MODES = [
  { id: "mirror", labelKey: "sanri.modes.mirror", tr: "Ayna", en: "Mirror" },
  { id: "dream", labelKey: "sanri.modes.dream", tr: "Rüya", en: "Dream" },
  { id: "divine", labelKey: "sanri.modes.divine", tr: "İlahi", en: "Divine" },
  { id: "shadow", labelKey: "sanri.modes.shadow", tr: "Gölge", en: "Shadow" },
  { id: "light", labelKey: "sanri.modes.light", tr: "Işık", en: "Light" },
];

const DOMAINS = [
  { id: "auto", labelKey: "sanri.domains.auto", tr: "Otomatik", en: "Auto" },
  { id: "awakened_cities", labelKey: "sanri.domains.awakened_cities", tr: "Uyanmış Şehirler", en: "Awakened Cities" },
  { id: "consciousness_field", labelKey: "sanri.domains.consciousness_field", tr: "Bilinç Alanı", en: "Consciousness Field" },
  { id: "frequency_field", labelKey: "sanri.domains.frequency_field", tr: "Frekans Alanı", en: "Frequency Field" },
  { id: "ritual_space", labelKey: "sanri.domains.ritual_space", tr: "Ritüel Alanı", en: "Ritual Space" },
  { id: "neural_ecstasy", labelKey: "sanri.domains.neural_ecstasy", tr: "Beyin Orgazmı", en: "Neural Ecstasy" },
  { id: "book_112", labelKey: "sanri.domains.book_112", tr: "112. Kitap", en: "Book 112" },
];

function parseQuery(search) {
  const sp = new URLSearchParams(search);
  return {
    domain: sp.get("domain") || "",
    mode: sp.get("mode") || "",
    prefill: sp.get("prefill") || "",
  };
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function ThinkingDots({ label }) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 350);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={styles.thinking}>
      {label}
      <span className={styles.dots}>{dots}</span>
    </span>
  );
}

export default function SanriyaSorPage() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const q = useMemo(() => parseQuery(location.search), [location.search]);

  const { language, setLanguage, t } = useLanguage();
  const isTR = language === "tr";
  const hasStartedRef = useRef(false);

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

  const title = tt("sanri.title", isTR ? "SANRI’ya Sor" : "Ask SANRI");
  const subtitle = tt(
    "sanri.subtitleLine",
    isTR ? "Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın." : "This is not an answer. It is a reflection. You open the door."
  );

  // state
  const [mode, setMode] = useState(q.mode || "mirror");
  const [domain, setDomain] = useState(q.domain || "auto");
  const [text, setText] = useState(q.prefill ? String(q.prefill) : "");

  const [isSending, setIsSending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [replyFull, setReplyFull] = useState("");
  const [typedReply, setTypedReply] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const taRef = useRef(null);

  // query ile geldiyse state’leri güncelle (kapı presetleri)
  useEffect(() => {
    if (q.mode) setMode(q.mode);
    if (q.domain) setDomain(q.domain);
    if (q.prefill) setText(String(q.prefill));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.mode, q.domain, q.prefill]);

  const hint = useMemo(() => {
    const base = isTR
      ? "Bir an dur.\nSoruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.\n"
      : "Pause for a moment.\nFeel where your question resonates in your body.\nSANRI does not answer; it opens a door.\n";
    const modeLine = isTR
      ? `\nMod: ${mode}\nNet bir cümle yaz. Cevap değil; yansıma gelecek.`
      : `\nMode: ${mode}\nWrite one clear sentence. Not an answer—reflection will arrive.`;
    return base + modeLine;
  }, [isTR, mode]);

  // “Kapılara dön” = Home’a skipIntro ile dönsün (intro tekrar açılmasın)
  const goBackToGates = useCallback(() => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  }, [navigate]);

  const handleReset = useCallback(() => {
    setText("");
    setReplyFull("");
    setTypedReply("");
    setErrorMsg("");

    hasStartedRef.current = false;
    setIsThinking(false);
    setIsSending(false);
    window.setTimeout(() => taRef.current?.focus?.(), 0);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        void handleSubmit();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, mode, domain, isSending, API_URL, isTR]
  );

  // typing effect: “insan gibi”
  useEffect(() => {
    if (!replyFull) return;
    setTypedReply("");

    let i = 0;
    let alive = true;

    const step = () => {
      if (!alive) return;
      const next = replyFull.slice(0, i + 1);
      setTypedReply(next);
      i += 1;

      if (i >= replyFull.length) return;

      const ch = replyFull[i - 1] || "";
      // noktalama duraklaması
      const pause =
        ch === "." || ch === "!" || ch === "?" ? 240 :
        ch === "," || ch === ";" || ch === ":" ? 140 :
        ch === "\n" ? 200 :
        0;

      // temel hız (senin “gerçek yazıyor” hissin)
      const base = 18; // 18ms/char
      const jitter = Math.floor(Math.random() * 18); // 0..17
      const delay = base + jitter + pause;

      window.setTimeout(step, delay);
    };

    window.setTimeout(step, 80);

    return () => {
      alive = false;
    };
  }, [replyFull]);

  
  const handleSubmit = useCallback(async () => {
    unlockAudio();
    setErrorMsg("");

  if (!hasStartedRef.current) {
  playSfx("/sfx/door-open.mp3", { volume: 0.3 });
  hasStartedRef.current = true;
}

    const msg = String(text || "").trim();
    if (!msg || isSending) return;

    if (!API_URL) {
      setErrorMsg(isTR ? "VITE_BACKEND_URL eksik (Vercel env)." : "VITE_BACKEND_URL is missing (Vercel env).");
      return;
    }

    setIsSending(true);
    setIsThinking(true);
    setReplyFull("");
    setTypedReply("");

    // minik “düşünüyor” çanı (çok düşük)
    playSfx("/sfx/aura-chime.mp3", { volume: 0.18 });

    // Backend schema: message/question/session_id/mode
    // Biz message + mode gönderiyoruz, session_id sabit.
    const payload = {
      message: msg,
      question: msg,
      session_id: "default",
      mode: mode || "mirror",
      // domain backend’de zorunlu değilse bile gönderiyoruz (ileride kullanılır)
      domain: domain || "auto",
    };

    try {
      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      const data = safeJsonParse(raw) || {};

      if (!res.ok) {
        const msgErr =
          data?.detail ||
          data?.error ||
          raw ||
          (isTR ? "Bir hata oluştu." : "An error occurred.");
        setErrorMsg(String(msgErr));
        setIsSending(false);
        setIsThinking(false);
        return;
      }

      const answer = data?.response ?? data?.reply ?? data?.text ?? raw ?? "";
      setReplyFull(String(answer || ""));
      setIsSending(false);
      setIsThinking(false);
    } catch (err) {
      // CORS dahil network
      setErrorMsg(
        isTR
          ? "Bağlantı/CORS hatası. (Railway SANRI_ALLOWED_ORIGINS içine Vercel domainini eklemen gerekebilir.)"
          : "Network/CORS error. (Add your Vercel domain into SANRI_ALLOWED_ORIGINS on Railway.)"
      );
      setIsSending(false);
      setIsThinking(false);
    }
  }, [API_URL, domain, isSending, isTR, mode, text]);

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

      {/* CARD */}
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</div>
          <div className={styles.h1}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>

          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.left}>
              <div className={styles.block}>
                <div className={styles.label}>{tt("common.mode", isTR ? "Mod" : "Mode")}</div>
                <select
                  className={styles.select}
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {tt(m.labelKey, isTR ? m.tr : m.en)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>{tt("common.domain", isTR ? "Domain (opsiyonel)" : "Domain (optional)")}</div>
                <select
                  className={styles.select}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {tt(d.labelKey, isTR ? d.tr : d.en)}
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

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSubmit();
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
                    >
                      {isSending
                        ? tt("common.reflecting", isTR ? "Yansıtılıyor…" : "Reflecting…")
                        : tt("common.reflect", isTR ? "Yansıt (Ctrl+Enter)" : "Reflect (Ctrl+Enter)")}
                    </button>
                  </div>
                </form>
              </div>

              <div className={`${styles.panel} ${styles.reply}`}>
                <div className={styles.label}>{tt("common.reflection", isTR ? "Yansıma" : "Reflection")}</div>

                <div className={styles.replybox}>
                  {errorMsg ? (
                    <span className={styles.errorText}>{errorMsg}</span>
                  ) : isThinking || isSending ? (
                    <ThinkingDots label={isTR ? "Sanrı düşünüyor" : "SANRI is thinking"} />
                  ) : typedReply ? (
                    typedReply
                  ) : (
                    tt("common.reflectionEmpty", isTR ? "Yansıma burada belirecek." : "Your reflection will appear here.")
                  )}
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