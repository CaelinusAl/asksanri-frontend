import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "./HomeAskHero.module.css";

/**
 * HomeAskHero ÔÇö anasayfan─▒n yeni hero'su.
 * SANRI'YA SOR'u ├Âne ├ğ─▒kar─▒r: b├╝y├╝k textarea + seed prompt'lar + tek primary CTA.
 *
 * Submit edildi─şinde onSubmit(text, { fromSeed }) ile parent'a haber verir.
 * Parent (HomePage) /sanriya-sor rotas─▒na state: { prefill, autoSubmit: true } ile gider.
 */
export default function HomeAskHero({ isTR, onSubmit, onUnlock }) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const taRef = useRef(null);
  const recognitionRef = useRef(null);

  const seedPrompts = isTR
    ? [
        "Bug├╝n i├ğimde neyi bast─▒r─▒yorum?",
        "Bu r├╝ya bana neyi hat─▒rlat─▒yor?",
        "┼Şu an hangi karardan ka├ğ─▒yorum?",
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

  // Speech-to-text
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

  return (
    <section className={styles.hero} aria-labelledby="ask-hero-title">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span className={styles.orb} aria-hidden="true" />
          <span>SANRI</span>
        </div>

        <h1 id="ask-hero-title" className={styles.title}>
          {isTR ? "─░├ğinden ne soruyorsun?" : "What are you asking from within?"}
        </h1>
        <p className={styles.subtitle}>
          {isTR
            ? "Bir kelime, bir soru, bir r├╝ya, bir tarih yaz. SANRI cevap ├╝retmez ÔÇö alan a├ğar."
            : "Write a word, a question, a dream, a date. SANRI doesn't produce answers ÔÇö it opens space."}
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
            placeholder={
              isTR
                ? "├ûrn. Bug├╝n i├ğimde neyi bast─▒r─▒yorum?"
                : "e.g. What am I suppressing today?"
            }
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
              <span aria-hidden="true">­şÄÖ</span>
              <span className={styles.micLabel}>
                {isListening
                  ? isTR
                    ? "DinleniyorÔÇĞ"
                    : "ListeningÔÇĞ"
                  : isTR
                  ? "Sesle yaz"
                  : "Voice"}
              </span>
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!hasText}
              aria-label={isTR ? "Yans─▒t" : "Reflect"}
            >
              <span>{isTR ? "Yans─▒t" : "Reflect"}</span>
              <span aria-hidden="true" className={styles.arrow}>ÔåÆ</span>
            </button>
          </div>

          <div className={styles.hintRow}>
            <kbd className={styles.kbd}>Ctrl</kbd>
            <span className={styles.kbdPlus}>+</span>
            <kbd className={styles.kbd}>Enter</kbd>
            <span className={styles.hintText}>
              {isTR ? "ile h─▒zl─▒ g├Ânder" : "to submit"}
            </span>
          </div>
        </form>

        <div className={styles.seedRow}>
          <div className={styles.seedLabel}>
            {isTR ? "Nereden ba┼şlayaca─ş─▒n─▒ bilmiyorsan:" : "If you don't know where to start:"}
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
