import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SanriyaSorPage.module.css";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Mic,
  MicOff,
  Send,
  RotateCcw,
  Globe2,
  Sparkles,
  ChevronDown,
} from "lucide-react";

/**
 * SanriyaSorPage
 * - TR/EN i18n via LanguageContext
 * - Premium glass UI (module css)
 * - Voice input (SpeechRecognition)
 * - "Typing" effect to avoid robotic instant reply
 * - Safe fallbacks: never white-screen due to missing keys
 */

const API_URL = import.meta.env.VITE_BACKEND_URL || "";

const MODES = [
  { id: "mirror", tKey: "sanri.modes.mirror", fallback: "Ayna / Mirror" },
  { id: "dream", tKey: "sanri.modes.dream", fallback: "Rüya / Dream" },
  { id: "divine", tKey: "sanri.modes.divine", fallback: "İlahi / Divine" },
  { id: "shadow", tKey: "sanri.modes.shadow", fallback: "Gölge / Shadow" },
  { id: "light", tKey: "sanri.modes.light", fallback: "Işık / Light" },
];

const DOMAINS = [
  { id: "auto", tKey: "sanri.domains.auto", fallback: "Otomatik / Auto" },
  {
    id: "consciousness_field",
    tKey: "sanri.domains.consciousness_field",
    fallback: "Bilinç Alanı / Consciousness Field",
  },
  {
    id: "frequency_field",
    tKey: "sanri.domains.frequency_field",
    fallback: "Frekans Alanı / Frequency Field",
  },
  {
    id: "ritual_space",
    tKey: "sanri.domains.ritual_space",
    fallback: "Ritüel Alanı / Ritual Space",
  },
  {
    id: "book_112",
    tKey: "sanri.domains.book_112",
    fallback: "112. Kitap / Book 112",
  },
  {
    id: "awakened_cities",
    tKey: "sanri.domains.awakened_cities",
    fallback: "Uyanmış Şehirler / Awakened Cities",
  },
];

function safeT(t, key, fallback) {
  try {
    const v = t?.(key);
    if (!v || v === key) return fallback;
    return v;
  } catch {
    return fallback;
  }
}

function pickLabelByLang(language, trText, enText) {
  return language === "tr" ? trText : enText;
}

export default function SanriyaSorPage() {
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");

  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [replyFull, setReplyFull] = useState("");
  const [replyShown, setReplyShown] = useState("");
  const typingTimerRef = useRef(null);

  // Voice (SpeechRecognition)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // ---------- HINT ----------
  const hint = useMemo(() => {
    const base = safeT(
      t,
      "sanri.hint.base",
      pickLabelByLang(
        language,
        "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.",
        "Pause for a moment. Feel where your question resonates in your body.\nSANRI does not answer; it opens a door."
      )
    );

    const modeLabel = MODES.find((m) => m.id === mode)?.tKey;
    const modeName = safeT(
      t,
      modeLabel || "",
      MODES.find((m) => m.id === mode)?.fallback || mode
    );

    const modeHintKey = `sanri.hint.${mode}`;
    const modeHint = safeT(
      t,
      modeHintKey,
      (() => {
        const per = {
          mirror: pickLabelByLang(
            language,
            "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
            "Write one clear sentence. Not an answer—reflection will arrive."
          ),
          dream: pickLabelByLang(
            language,
            "Rüyayı sahne gibi anlat. Simgeleri saklama.",
            "Describe the dream like a scene. Don't hide symbols."
          ),
          divine: pickLabelByLang(
            language,
            "Bir niyet yaz. Sonra tek soru sor.",
            "Write an intention. Then ask one question."
          ),
          shadow: pickLabelByLang(
            language,
            "Rahatsız eden şeyi söyle. Kaçma. Abartma.",
            "Name what disturbs you. Don't escape. Don't dramatize."
          ),
          light: pickLabelByLang(
            language,
            "Şu anki duygunu yaz. Yargısız.",
            "Write what you feel now. Without judgment."
          ),
        };
        return per[mode] || "";
      })()
    );

    return `${base}\n\n${pickLabelByLang(language, "Mod:", "Mode:")} ${modeName}\n${modeHint}`;
  }, [t, language, mode]);

  // ---------- TYPING EFFECT ----------
  const stopTyping = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const typeToScreen = (full) => {
    stopTyping();
    setReplyShown("");
    setReplyFull(full);

    let i = 0;
    const tick = () => {
      i += 1;
      setReplyShown(full.slice(0, i));
      if (i >= full.length) {
        typingTimerRef.current = null;
        return;
      }
      // small natural variation
      const delay = 22 + Math.floor(Math.random() * 26);
      typingTimerRef.current = setTimeout(tick, delay);
    };
    typingTimerRef.current = setTimeout(tick, 120);
  };

  useEffect(() => {
    return () => stopTyping();
  }, []);

  // ---------- SUBMIT ----------
  const handleReset = () => {
    setText("");
    setReplyFull("");
    setReplyShown("");
    stopTyping();
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const buildFallbackReply = () => {
    const modeName = safeT(
      t,
      MODES.find((m) => m.id === mode)?.tKey || "",
      MODES.find((m) => m.id === mode)?.fallback || mode
    );

    return pickLabelByLang(
      language,
      `Yansıma (${modeName}):\n\nŞu cümlenin içindeki en canlı kelime hangisi: “${text.trim()}”\n\nOnu bedeninde nerede hissediyorsun? Orada ne istiyor: görülmek mi, çözülmek mi, korunmak mı?`,
      `Reflection (${modeName}):\n\nWhich word feels most alive inside: “${text.trim()}”?\n\nWhere do you feel it in your body? What does it want: to be seen, to soften, to be protected?`
    );
  };

  const handleSubmit = async () => {
    const q = text.trim();
    if (!q || isSending) return;

    setIsSending(true);
    setReplyShown("");
    setReplyFull("");

    try {
      // If no backend URL, show gentle fallback without crashing
      if (!API_URL) {
        const msg = pickLabelByLang(
          language,
          "Backend URL yok. VITE_BACKEND_URL tanımla (Vercel env) veya şimdilik yerel yansıma modunu kullan.",
          "Backend URL missing. Set VITE_BACKEND_URL (Vercel env) or use local reflection mode for now."
        );
        typeToScreen(`${msg}\n\n${buildFallbackReply()}`);
        setIsSending(false);
        return;
      }

      // Minimal request shape (adjust if your backend expects different fields)
      const payload = {
        text: q,
        mode,
        domain,
        language,
      };

      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // fallback
        typeToScreen(buildFallbackReply());
        setIsSending(false);
        return;
      }

      const data = await res.json().catch(() => null);
      const answer =
        data?.answer ||
        data?.text ||
        data?.reply ||
        data?.message ||
        buildFallbackReply();

      typeToScreen(String(answer));
      setIsSending(false);
    } catch {
      typeToScreen(buildFallbackReply());
      setIsSending(false);
    }
  };

  // ---------- VOICE ----------
  const ensureRecognition = () => {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = language === "tr" ? "tr-TR" : "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    return rec;
  };

  const startListening = () => {
    if (isListening) return;
    const rec = ensureRecognition();
    if (!rec) {
      const msg = pickLabelByLang(
        language,
        "Tarayıcı ses tanımayı desteklemiyor (SpeechRecognition yok).",
        "Your browser does not support SpeechRecognition."
      );
      typeToScreen(msg);
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

  // ---------- DOMAIN FIELD (optional) ----------
  // Keep it safe: no dynamic import top-level await.
  // If you add more fields later, import them normally and map here.
  let FieldComponent = null;
  // Example: when you build BilincAlaniField later, import & assign here.
  // if (domain === "consciousness_field") FieldComponent = BilincAlaniField;

  // ---------- UI TEXT ----------
  const topbarSubtitle = safeT(
    t,
    "sanri.topbar.subtitle",
    pickLabelByLang(language, "Bilinç ve Anlam Zekası", "Consciousness & Meaning Intelligence")
  );

  const breadcrumb = safeT(
    t,
    "sanri.breadcrumb",
    pickLabelByLang(language, "SANRI • Soru Alanı", "SANRI • Prompt Space")
  );

  const title = safeT(t, "sanri.title", pickLabelByLang(language, "SANRI’ya Sor", "Ask SANRI"));
  const subtitleLine = safeT(
    t,
    "sanri.subtitleLine",
    pickLabelByLang(
      language,
      "Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.",
      "This is not an answer. It is a reflection. You open the door."
    )
  );

  const inputLabel = safeT(
    t,
    "sanri.inputLabel",
    pickLabelByLang(language, "Yansıma Akışı", "Reflection Flow")
  );
  const placeholder = safeT(
    t,
    "sanri.placeholder",
    pickLabelByLang(language, "Bir kelime, soru, rüya veya tarih yaz…", "Write a word, question, dream or date…")
  );

  const modeLabel = safeT(t, "sanri.modeLabel", pickLabelByLang(language, "Mod", "Mode"));
  const domainLabel = safeT(
    t,
    "sanri.domainLabel",
    pickLabelByLang(language, "Domain (opsiyonel)", "Domain (optional)")
  );

  const guideLabel = safeT(t, "sanri.guideLabel", pickLabelByLang(language, "Kılavuz", "Guide"));
  const resetText = safeT(t, "sanri.reset", pickLabelByLang(language, "Sıfırla", "Reset"));
  const reflectText = safeT(
    t,
    "sanri.reflect",
    pickLabelByLang(language, "Yansıt (Ctrl+Enter)", "Reflect (Ctrl+Enter)")
  );
  const reflectingText = safeT(
    t,
    "sanri.reflecting",
    pickLabelByLang(language, "Yansıtılıyor…", "Reflecting…")
  );

  const voiceText = safeT(
    t,
    "sanri.voice",
    pickLabelByLang(language, "Sesle yaz", "Voice input")
  );
  const stopVoiceText = safeT(
    t,
    "sanri.voiceStop",
    pickLabelByLang(language, "Durdur", "Stop")
  );

  const replyLabel = safeT(t, "sanri.replyLabel", pickLabelByLang(language, "Yansıma", "Reflection"));
  const replyEmpty = safeT(
    t,
    "sanri.replyEmpty",
    pickLabelByLang(language, "Yansıma burada belirecek.", "Your reflection will appear here.")
  );

  const footnote = safeT(
    t,
    "sanri.footnote",
    pickLabelByLang(
      language,
      "Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026 CaelinusAI • SANRI",
      "This space does not produce “knowledge”. It reflects meaning—shaped within you. © 2026 CaelinusAI • SANRI"
    )
  );

  const isTR = language === "tr";

  const toggleLang = () => setLanguage(isTR ? "en" : "tr");

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brandLeft}>
            <span className={styles.brandPill}>CAELINUS AI</span>
            <span className={styles.brandText}>{topbarSubtitle}</span>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.crumb}>
              <Sparkles size={14} />
              <span>{breadcrumb}</span>
            </div>

            <button className={styles.langBtn} type="button" onClick={toggleLang} title="TR / EN">
              <Globe2 size={16} />
              <span>{isTR ? "TR" : "EN"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className={styles.centerWrap}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.kicker}>
              CAELINUS AI • {pickLabelByLang(language, "Consciousness Mirror", "Consciousness Mirror")}
            </div>

            <h1 className={styles.h1}>{title}</h1>
            <div className={styles.subtitle}>{subtitleLine}</div>
          </div>

          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.leftCol}>
              <div className={styles.block}>
                <div className={styles.label}>{modeLabel}</div>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    {MODES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {safeT(t, m.tKey, m.fallback)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={styles.chev} size={16} />
                </div>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>{domainLabel}</div>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {safeT(t, d.tKey, d.fallback)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={styles.chev} size={16} />
                </div>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>{guideLabel}</div>
                <pre className={styles.hint}>{hint}</pre>
              </div>

              {/* Optional domain field */}
              {FieldComponent ? (
                <div className={styles.block}>
                  <div className={styles.label}>
                    {pickLabelByLang(language, "Bilinç Alanı", "Consciousness Field")}
                  </div>
                  <div className={styles.fieldBox}>
                    <FieldComponent
                      language={language}
                      onInsert={(txt) =>
                        setText((prev) => (prev ? prev + "\n\n" : "") + String(txt || ""))
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {/* RIGHT */}
            <div className={styles.rightCol}>
              <div className={styles.panel}>
                <div className={styles.label}>{inputLabel}</div>

                <textarea
                  className={styles.textarea}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={isSending}
                />

                <div className={styles.actions}>
                  <button className={styles.btnGhost} type="button" onClick={handleReset}>
                    <RotateCcw size={16} />
                    {resetText}
                  </button>

                  <button
                    className={styles.btnPrimary}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSending || !text.trim()}
                    title="Ctrl+Enter"
                  >
                    <Send size={16} />
                    {isSending ? reflectingText : reflectText}
                  </button>

                  <div className={styles.grow} />

                  <button
                    className={`${styles.btnMic} ${isListening ? styles.micLive : ""}`}
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    {isListening ? stopVoiceText : voiceText}
                  </button>
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.label}>{replyLabel}</div>

                <div className={styles.replyBox}>
                  <div className={styles.replyText}>
                    {replyShown || (!replyFull && !isSending ? replyEmpty : "")}
                    {isSending ? <span className={styles.caret} /> : null}
                  </div>
                </div>
              </div>

              <div className={styles.footnote}>{footnote}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
