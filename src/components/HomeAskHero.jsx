import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "./HomeAskHero.module.css";

/**
 * HomeAskHero — ana sayfanin yeni hero'su.
 * SANRI'YA SOR'u on plana cikarir: buyuk textarea + seed prompt'lar + tek primary CTA.
 *
 * Submit edildiginde onSubmit(text, { fromSeed }) ile parent'a haber verir.
 * Parent /sanriya-sor rotasina state: { prefill, autoSubmit: true } ile gider.
 */
export default function HomeAskHero({ isTR, onSubmit, onUnlock }) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const taRef = useRef(null);
  const recognitionRef = useRef(null);

  const seedPrompts = isTR
    ? [
        "Bug\u00fcn i\u00e7imde neyi bast\u0131r\u0131yorum?",
        "Bu r\u00fcya bana neyi hat\u0131rlat\u0131yor?",
        "\u015eu an hangi karardan ka\u00e7\u0131yorum?",
      ]
    : [
        "What am I suppressing today?",
        "What is this dream reminding me of?",
        "Which decision am I avoiding right now?",
      ];

  const handleSeedClick = useCallback(
    (prompt) => {
      onUnlock?.();
      onSubmit?.(prompt, { fromSeed: true });
    },
    [onSubmit, onUnlock]
  );

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      const msg = String(text || "").trim();
      if (!msg) return;
      onUnlock?.();
      onSubmit?.(msg, { fromSeed: false });
    },
    [text, onSubmit, onUnlock]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    onUnlock?.();
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
        return (base ? base + " " : "") + (finalText + interim).trim();
      });
    };
    rec.start();
  }, [isTR, onUnlock]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setIsListening(false);
  }, []);

  useEffect(
    () => () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    },
    []
  );

  const hasText = String(text || "").trim().length > 0;

  const titleTr = "\u0130\u00e7inden ne soruyorsun?";
  const subtitleTr =
    "Bir kelime, bir soru, bir r\u00fcya, bir tarih yaz. SANRI cevap \u00fcretmez \u2014 alan a\u00e7ar.";
  const placeholderTr =
    "\u00d6rn. Bug\u00fcn i\u00e7imde neyi bast\u0131r\u0131yorum?";
  const listeningTr = "Dinleniyor\u2026";
  const listeningEn = "Listening\u2026";
  const hintTr = "ile h\u0131zl\u0131 g\u00f6nder";
  const seedLabelTr = "Nereden ba\u015flayaca\u011f\u0131n\u0131 bilmiyorsan:";

  return (
    <section className={styles.hero} aria-labelledby="ask-hero-title">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span className={styles.orb} aria-hidden="true" />
          <span>SANRI</span>
        </div>

        <h1 id="ask-hero-title" className={styles.title}>
          {isTR ? titleTr : "What are you asking from within?"}
        </h1>
        <p className={styles.subtitle}>
          {isTR
            ? subtitleTr
            : "Write a word, a question, a dream, a date. SANRI doesn't produce answers \u2014 it opens space."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="ask-hero-textarea" className={styles.srOnly}>
            {isTR ? "SANRI'ya sorun" : "Your question to SANRI"}
          </label>
          <textarea
            id="ask-hero-textarea"
            ref={taRef}
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTR ? placeholderTr : "e.g. What am I suppressing today?"}
            rows={3}
          />

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.micBtn} ${isListening ? styles.micLive : ""}`}
              onClick={isListening ? stopListening : startListening}
              aria-label={isTR ? "Sesle yaz" : "Voice input"}
              aria-pressed={isListening}
            >
              <span aria-hidden="true">{"\u{1F3A4}"}</span>
              <span className={styles.micLabel}>
                {isListening
                  ? isTR
                    ? listeningTr
                    : listeningEn
                  : isTR
                    ? "Sesle yaz"
                    : "Voice"}
              </span>
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!hasText}
              aria-label={isTR ? "Yans\u0131t" : "Reflect"}
            >
              <span>{isTR ? "Yans\u0131t" : "Reflect"}</span>
              <span aria-hidden="true" className={styles.arrow}>
                {"\u2192"}
              </span>
            </button>
          </div>

          <div className={styles.hintRow}>
            <kbd className={styles.kbd}>Ctrl</kbd>
            <span className={styles.kbdPlus}>+</span>
            <kbd className={styles.kbd}>Enter</kbd>
            <span className={styles.hintText}>{isTR ? hintTr : "to submit"}</span>
          </div>
        </form>

        <div className={styles.seedRow}>
          <div className={styles.seedLabel}>
            {isTR ? seedLabelTr : "If you don't know where to start:"}
          </div>
          <div className={styles.seedChips}>
            {seedPrompts.map((p) => (
              <button
                key={p}
                type="button"
                className={styles.seedChip}
                onClick={() => handleSeedClick(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
