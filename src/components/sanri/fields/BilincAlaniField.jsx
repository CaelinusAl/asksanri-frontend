import React, { useEffect, useMemo, useState } from "react";
import "./BilincAlaniField.css";

/**
 * BilincAlaniField
 * - Parent'e "hazır prompt" gönderebilir (onInsert)
 * - Mini ritüel (nefes) akışı içerir
 *
 * Props:
 * - language: "tr" | "en" (opsiyonel)
 * - onInsert: (text: string) => void // textarea'ya metin basmak için
 */
export default function BilincAlaniField({ language = "tr", onInsert }) {
  const t = useMemo(() => {
    const tr = {
      title: "Bilinç Alanı",
      subtitle:
        "Bu bir cevap üretim alanı değil; farkındalık alanı. Burada soru bir kapıdır.",
      pick: "Kapı seç",
      doors: [
        {
          id: "kalp",
          label: "Kalp",
          hint: "Duygunun kökü nerede? Sevgi mi korku mu?",
          prompt:
            "Şu an kalbimde hangi duygu var? Bu duygu bana ne anlatmak istiyor? Tek cümleyle söyleyeyim:",
        },
        {
          id: "zihin",
          label: "Zihin",
          hint: "Düşünceyi izle. İnancı yakala.",
          prompt:
            "Zihnimde hangi cümle dönüyor? Bu cümle hangi inançtan geliyor? Tek cümleyle yazıyorum:",
        },
        {
          id: "beden",
          label: "Beden",
          hint: "Beden yalan söylemez. Nerede yankı var?",
          prompt:
            "Bedenimde neresi konuşuyor (kalp/mide/boğaz/karın)? Bu his bana neyi hatırlatıyor? Tek cümle:",
        },
      ],
      actions: "Hızlı Başlat",
      insert: "Soru tohumunu yerleştir",
      ritualTitle: "30 saniye Nefes Ritüeli",
      ritualDesc:
        "4 saniye al • 4 tut • 6 ver. Sadece izle. Sonra tek cümle yaz.",
      start: "Başlat",
      stop: "Durdur",
      done: "Tamam",
      readyPrompt: "Ritüelden sonra tek cümle:",
      footer:
        "Not: Burada ‘teşhis’ yok. Yalnızca farkındalık ve yön vardır.",
    };

    const en = {
      title: "Consciousness Field",
      subtitle:
        "Not an answer factory—an awareness space. The question is a door.",
      pick: "Choose a door",
      doors: [
        {
          id: "heart",
          label: "Heart",
          hint: "Where is the root of the feeling—love or fear?",
          prompt:
            "What emotion is in my heart right now? What does it want to tell me? One sentence:",
        },
        {
          id: "mind",
          label: "Mind",
          hint: "Watch the thought. Catch the belief.",
          prompt:
            "What sentence is looping in my mind? Which belief does it come from? One sentence:",
        },
        {
          id: "body",
          label: "Body",
          hint: "The body doesn’t lie. Where does it echo?",
          prompt:
            "Where in my body do I feel it (chest/stomach/throat/belly)? What does it remind me of? One sentence:",
        },
      ],
      actions: "Quick Start",
      insert: "Insert a seed prompt",
      ritualTitle: "30-second Breath Ritual",
      ritualDesc: "Inhale 4 • hold 4 • exhale 6. Observe. Then write one line.",
      start: "Start",
      stop: "Stop",
      done: "Done",
      readyPrompt: "After the ritual, one sentence:",
      footer: "Note: No diagnosis here. Only awareness and direction.",
    };

    return language === "en" ? en : tr;
  }, [language]);

  const [activeDoor, setActiveDoor] = useState(t.doors[0]);
  const [ritualOpen, setRitualOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [sec, setSec] = useState(30);

  useEffect(() => {
    setActiveDoor(t.doors[0]);
  }, [t]);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && sec === 0) setRunning(false);
  }, [sec, running]);

  const insertSeed = () => {
    if (typeof onInsert === "function") onInsert(activeDoor.prompt);
  };

  const openRitual = () => {
    setRitualOpen(true);
    setSec(30);
    setRunning(false);
  };

  const closeRitual = () => {
    setRitualOpen(false);
    setRunning(false);
    setSec(30);
  };

  const toggleRun = () => {
    if (sec === 0) setSec(30);
    setRunning((r) => !r);
  };

  return (
    <section className="cae-field">
      <div className="cae-field__head">
        <div>
          <div className="cae-field__title">{t.title}</div>
          <div className="cae-field__sub">{t.subtitle}</div>
        </div>
        <div className="cae-field__badge">CAELINUS • FIELD</div>
      </div>

      <div className="cae-field__grid">
        <div className="cae-field__card">
          <div className="cae-field__label">{t.pick}</div>

          <div className="cae-field__doors">
            {t.doors.map((d) => (
              <button
                key={d.id}
                type="button"
                className={
                  "cae-door " + (activeDoor?.id === d.id ? "is-active" : "")
                }
                onClick={() => setActiveDoor(d)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="cae-field__hint">{activeDoor?.hint}</div>

          <div className="cae-field__actions">
            <button type="button" className="cae-btn" onClick={insertSeed}>
              {t.insert}
            </button>
            <button
              type="button"
              className="cae-btn cae-btn--ghost"
              onClick={openRitual}
            >
              {t.actions}
            </button>
          </div>

          <div className="cae-field__foot">{t.footer}</div>
        </div>
      </div>

      {ritualOpen && (
        <div className="cae-modal" role="dialog" aria-modal="true">
          <div className="cae-modal__panel">
            <div className="cae-modal__top">
              <div>
                <div className="cae-modal__title">{t.ritualTitle}</div>
                <div className="cae-modal__desc">{t.ritualDesc}</div>
              </div>

              <button
                type="button"
                className="cae-x"
                aria-label="close"
                onClick={closeRitual}
              >
                ×
              </button>
            </div>

            <div className="cae-timer">
              <div className="cae-timer__ring" data-running={running ? 1 : 0}>
                <div className="cae-timer__num">{sec}s</div>
              </div>

              <div className="cae-timer__btns">
                <button type="button" className="cae-btn" onClick={toggleRun}>
                  {running ? t.stop : t.start}
                </button>
                <button
                  type="button"
                  className="cae-btn cae-btn--ghost"
                  onClick={() => {
                    setRunning(false);
                    setSec(0);
                  }}
                >
                  {t.done}
                </button>
              </div>
            </div>

            <div className="cae-modal__bottom">
              <div className="cae-field__label">{t.readyPrompt}</div>
              <button
                type="button"
                className="cae-btn cae-btn--wide"
                onClick={() => {
                  insertSeed();
                  closeRitual();
                }}
              >
                {t.insert}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}