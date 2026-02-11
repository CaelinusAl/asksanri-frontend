import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "./SanriyaSorPage.module.css";

// Optional field (bugün sadece bunu bağlayalım)
import BilincAlaniField from "../components/sanri/fields/BilincAlaniField";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MODES = [
  { id: "mirror", labelKey: "sanri.modes.mirror" },
  { id: "dream", labelKey: "sanri.modes.dream" },
  { id: "divine", labelKey: "sanri.modes.divine" },
  { id: "shadow", labelKey: "sanri.modes.shadow" },
  { id: "light", labelKey: "sanri.modes.light" },
];

const DOMAINS = [
  { id: "auto", labelKey: "sanri.domains.auto" },
  { id: "awakened_cities", labelKey: "sanri.domains.awakened_cities" },
  { id: "consciousness_field", labelKey: "sanri.domains.consciousness_field" },
  { id: "frequency_field", labelKey: "sanri.domains.frequency_field" },
  { id: "ritual_space", labelKey: "sanri.domains.ritual_space" },
  { id: "neural_ecstasy", labelKey: "sanri.domains.neural_ecstasy" },
  { id: "book_112", labelKey: "sanri.domains.book_112" },
];

export default function SanriyaSorPage() {
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");

  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [replyFull, setReplyFull] = useState("");
  const [replyShown, setReplyShown] = useState("");

  // Voice input (SpeechRecognition)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // ---------- Domain -> FieldComponent ----------
  const FieldComponent = useMemo(() => {
    // Şimdilik sadece Bilinç Alanı. Diğerleri sonra.
    if (domain === "consciousness_field") return BilincAlaniField;
    return null;
  }, [domain]);

  // ---------- Guide text ----------
  const guideText = useMemo(() => {
    const base = t("sanri.guide.base");
    const modeLabel = MODES.find((m) => m.id === mode)?.id || "mirror";
    const perMode = t(`sanri.guide.${modeLabel}`);
    const modeName = t("sanri.guide.mode");
    const modeHuman = t(`sanri.modes.${modeLabel}`);
    return `${base}\n\n${modeName}: ${modeHuman}\n${perMode}`;
  }, [mode, t]);

  // ---------- Typewriter ----------
  const typeToScreen = (full, speed = 14) => {
    setReplyFull(full);
    setReplyShown("");
    let i = 0;
    const tick = () => {
      i += 1;
      setReplyShown(full.slice(0, i));
      if (i < full.length) setTimeout(tick, speed);
    };
    tick();
  };

  const handleReset = () => {
    setText("");
    setReplyFull("");
    setReplyShown("");
  };

  const handleKeyDown = (e) => {
    const isCmdEnter = (e.ctrlKey || e.metaKey) && e.key === "Enter";
    if (isCmdEnter) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const buildPrompt = () => {
    // Mode+domain bilgisi backend’e gidecek tek prompt
    const header = `MODE: ${mode}\nDOMAIN: ${domain}\nLANG: ${language}\n\n`;
    return header + text.trim();
  };

  const handleSubmit = async () => {
    if (isSending) return;
    if (!text.trim()) return;

    // Robotic hissi kırmak için bilinçli küçük gecikme
    setIsSending(true);
    setReplyShown("");
    setReplyFull("");
    await new Promise((r) => setTimeout(r, 650));

    try {
      if (!API_URL) throw new Error("VITE_BACKEND_URL missing");

      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // backend'in beklediği payload'a göre düzenleyebilirsin:
        body: JSON.stringify({
          prompt: buildPrompt(),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Request failed");
      }

      const data = await res.json();
      const out =
        data?.answer ||
        data?.response ||
        data?.text ||
        (typeof data === "string" ? data : JSON.stringify(data));

      typeToScreen(out, 12);
    } catch (err) {
      typeToScreen(`${t("common.error")}:\n${String(err?.message || err)}`, 10);
    } finally {
      setIsSending(false);
    }
  };

  // ---------- Voice recognition ----------
  const ensureRecognition = () => {
    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (!SR) return null;

    const rec = new SR();
    rec.lang = language === "en" ? "en-US" : "tr-TR";
    rec.interimResults = true;
    rec.continuous = true;
    return rec;
  };

  const startListening = () => {
    if (isListening) return;
    const rec = ensureRecognition();
    if (!rec) {
      typeToScreen(
        language === "en"
          ? "Your browser does not support speech recognition."
          : "Tarayıcı ses tanımayı desteklemiyor (SpeechRecognition yok)."
      );
      return;
    }

    recognitionRef.current = rec;

    rec.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
      }
      if (finalText) {
        setText((prev) => (prev ? prev + " " : "") + finalText.trim());
      }
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
    // dil değişince dinleme açıksa kapat
    if (isListening) stopListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const isTR = language === "tr";

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div className={styles.brandPill}>CAELINUS AI</div>
        <div className={styles.topbarSubtitle}>{t("sanri.topbar.subtitle")}</div>

        <div className={styles.topbarRight}>
          <div className={styles.rightChip}>{t("sanri.topbar.rightChip")}</div>
          <button
            className={styles.langBtn}
            type="button"
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title="TR / EN"
          >
            {isTR ? "TR" : "EN"}
          </button>
        </div>
      </div>

      {/* Card */}
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</div>
          <div className={styles.h1}>{t("sanri.title")}</div>
          <div className={styles.subtitle}>{t("sanri.subtitleLine")}</div>

          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.left}>
              <div className={styles.block}>
                <div className={styles.label}>{t("common.mode")}</div>
                <select
                  className={styles.select}
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {t(m.labelKey)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>{t("common.domain")}</div>
                <select
                  className={styles.select}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {t(d.labelKey)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.guide}>
                <div className={styles.label}>{t("common.guide")}</div>
                <pre className={styles.hint}>{guideText}</pre>
              </div>

              {/* Bilinç Alanı Field (opsiyonel) */}
              {FieldComponent ? (
                <div className={styles.panel}>
                  <div className={styles.label}>{t("sanri.domains.consciousness_field")}</div>
                  <FieldComponent
                    language={language}
                    onInsert={(txt) =>
                      setText((prev) => (prev ? prev + "\n\n" : "") + String(txt || ""))
                    }
                  />
                </div>
              ) : null}
            </div>

            {/* RIGHT */}
            <div className={styles.right}>
              <div className={styles.panel}>
                <div className={styles.label}>{t("common.reflectionFlow")}</div>
                <textarea
                  className={styles.textarea}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("sanri.placeholder")}
                  disabled={isSending}
                />

                <div className={styles.actions}>
                  <button className={styles.btnGhost} type="button" onClick={handleReset}>
                    {t("common.reset")}
                  </button>

                  <button
                    className={styles.btnPrimary}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSending || !text.trim()}
                    title="Ctrl+Enter"
                  >
                    {isSending ? t("common.reflecting") : t("common.reflect")}
                  </button>

                  <div className={styles.grow} />

                  <button
                    className={`${styles.btnMic} ${isListening ? styles.micLive : ""}`}
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? t("common.stop") : t("common.voiceInput")}
                  </button>
                </div>
              </div>

              <div className={`${styles.panel} ${styles.replyPanel}`}>
                <div className={styles.label}>{t("common.reflection")}</div>
                <div className={styles.replyBox}>
                  {replyShown || (!replyFull && !isSending ? t("common.reflectionEmpty") : "")}
                </div>
              </div>

              <div className={styles.footnote}>
                {isTR
                  ? "Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026 CaelinusAI • SANRI"
                  : 'This space does not produce "knowledge". It reflects meaning—shaped within you. © 2026 CaelinusAI • SANRI'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
