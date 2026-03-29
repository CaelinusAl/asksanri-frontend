// src/pages/FrekansAlaniPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrekansAlaniPage.module.css";

import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

export default function FrekansAlaniPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const goBackToGates = () => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  };

  const cards = useMemo(
    () => [
      {
        key: "breath_47",
        titleTR: "47 Nefes \u2022 Sakinle\u015ftir",
        titleEN: "47 Breath \u2022 Regulate",
        descTR: "3 tur: 4 al \u2022 2 tut \u2022 6 ver. Kalbi yumu\u015fat.",
        descEN: "3 rounds: 4 in \u2022 2 hold \u2022 6 out. Soften the heart.",
        stepsTR: [
          "G\u00f6zlerini kapat. Omuzlar\u0131n\u0131 indir.",
          "4 saniye nefes al\u2026 burundan, derin.",
          "2 saniye tut\u2026 sessizce.",
          "6 saniye yava\u015f\u00e7a ver\u2026 a\u011f\u0131zdan.",
          "Tekrarla. Kalp yumu\u015fayana kadar.",
          "Tamamland\u0131. \u015eimdi SANRI'ya sor: bu sessizlikte ne duydun?",
        ],
        stepsEN: [
          "Close your eyes. Drop your shoulders.",
          "Inhale 4 seconds\u2026 through the nose, deeply.",
          "Hold 2 seconds\u2026 in silence.",
          "Exhale 6 seconds\u2026 slowly, through the mouth.",
          "Repeat. Until the heart softens.",
          "Complete. Now ask SANRI: what did you hear in that silence?",
        ],
      },
      {
        key: "focus_369",
        titleTR: "369 Odak \u2022 A\u00e7\u0131k Zihin",
        titleEN: "369 Focus \u2022 Clear Mind",
        descTR: "1 dakika: omuzlar\u0131 indir, g\u00f6zleri yumu\u015fat, niyeti netle\u015ftir.",
        descEN: "1 minute: drop shoulders, soften eyes, clarify intention.",
        stepsTR: [
          "Bir dakika. Sadece bir dakika.",
          "Omuzlar\u0131n\u0131 bilin\u00e7li olarak indir.",
          "G\u00f6zlerini yumu\u015fat \u2014 bak\u0131\u015f\u0131n\u0131 oda\u011f\u0131ndan \u00e7\u00f6z.",
          "Zihnindeki tek soruyu bul. Onu net s\u00f6yle.",
          "Niyetin netle\u015fti. \u015eimdi SANRI ile derinle\u015ftir.",
        ],
        stepsEN: [
          "One minute. Just one minute.",
          "Consciously drop your shoulders.",
          "Soften your eyes \u2014 release focus.",
          "Find the one question in your mind. Say it clearly.",
          "Your intention is clear. Now deepen with SANRI.",
        ],
      },
      {
        key: "signal",
        titleTR: "Sinyal \u2022 Y\u00f6n Bul",
        titleEN: "Signal \u2022 Find Direction",
        descTR: "Bug\u00fcn tek k\u00fc\u00e7\u00fck bir se\u00e7im: 'neye evet?'",
        descEN: "One small choice today: 'what is my yes?'",
        stepsTR: [
          "Bug\u00fcn sana bir soru: neye evet diyorsun?",
          "Evet demek i\u00e7in \u00f6nce hay\u0131rlar\u0131n\u0131 g\u00f6r.",
          "Y\u00f6n\u00fcn hedef de\u011fil \u2014 hissetti\u011fin \u00e7ekim.",
          "K\u00fc\u00e7\u00fck bir se\u00e7im yap. \u015eimdi. B\u00fcy\u00fc\u011f\u00fc gelir.",
          "Sinyalin sende. SANRI ile onu oku.",
        ],
        stepsEN: [
          "A question for you today: what is your yes?",
          "To say yes, first see your no's.",
          "Direction is not a goal \u2014 it's a pull you feel.",
          "Make one small choice. Now. The rest follows.",
          "The signal is within you. Read it with SANRI.",
        ],
      },
    ],
    []
  );

  const [activeKey, setActiveKey] = useState(cards[0]?.key);

  const active = useMemo(
    () => cards.find((c) => c.key === activeKey) || cards[0],
    [cards, activeKey]
  );

  const steps = isTR ? (active.stepsTR || []) : (active.stepsEN || []);
  const isLastStep = step >= steps.length - 1;

  const handleStart = () => {
    unlockAudio();
    setStep(0);
    setRunning(true);
  };

  const handleNext = () => {
    if (isLastStep) {
      const prompt = encodeURIComponent(isTR ? active.descTR : active.descEN);
      navigate(`/sanriya-sor?domain=frequency_field&mode=mirror&prefill=${prompt}`, {
        state: { skipIntro: true },
      });
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleClose = () => {
    setRunning(false);
    setStep(0);
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>
            {isTR ? "Bilin\u00e7 ve Anlam Zekas\u0131" : "Consciousness & Meaning Intelligence"}
          </span>
        </div>

        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={goBackToGates}>
            {isTR ? "\u2190 Kap\u0131lara D\u00f6n" : "\u2190 Back to Gates"}
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

      {/* CONTENT */}
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI \u2022 FREQUENCY FIELD</div>

          <div className={styles.h1}>{isTR ? "Frekans Alan\u0131" : "Frequency Field"}</div>

          <div className={styles.subtitle}>
            {isTR
              ? "Enerji katman\u0131. K\u00fc\u00e7\u00fck se\u00e7imler b\u00fcy\u00fck ak\u0131\u015fa d\u00f6n\u00fc\u015f\u00fcr."
              : "Energy layer. Small choices become a larger flow."}
          </div>

          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.left}>
              <div className={styles.sectionTitle}>{isTR ? "Protokoller" : "Protocols"}</div>

              <div className={styles.list}>
                {cards.map((c) => {
                  const isActive = c.key === activeKey;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                      onClick={() => { setActiveKey(c.key); setRunning(false); setStep(0); }}
                    >
                      <div className={styles.itemTitle}>{isTR ? c.titleTR : c.titleEN}</div>
                      <div className={styles.itemDesc}>{isTR ? c.descTR : c.descEN}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT */}
            <div className={styles.right}>
              <div className={styles.panel}>
                <div className={styles.panelTitle}>{isTR ? "Se\u00e7ili Protokol" : "Selected Protocol"}</div>

                <div className={styles.bigTitle}>{isTR ? active.titleTR : active.titleEN}</div>
                <div className={styles.bigDesc}>{isTR ? active.descTR : active.descEN}</div>

                {/* Protocol Runner */}
                {running && (
                  <div style={{
                    marginTop: 20,
                    padding: "20px 18px",
                    borderRadius: 16,
                    background: "rgba(160,120,255,0.08)",
                    border: "1px solid rgba(160,120,255,0.22)",
                  }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
                      {isTR ? `Ad\u0131m ${step + 1} / ${steps.length}` : `Step ${step + 1} / ${steps.length}`}
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", marginBottom: 16 }}>
                      <div style={{
                        height: "100%",
                        borderRadius: 2,
                        background: "linear-gradient(90deg, #b98cff, #7c5fff)",
                        width: `${((step + 1) / steps.length) * 100}%`,
                        transition: "width 0.4s ease",
                      }} />
                    </div>

                    <div style={{ fontSize: 16, lineHeight: 1.7, fontWeight: 500 }}>
                      {steps[step]}
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                      <button
                        type="button"
                        className={styles.primaryBtn}
                        onClick={handleNext}
                      >
                        {isLastStep
                          ? (isTR ? "SANRI ile Devam Et \u2192" : "Continue with SANRI \u2192")
                          : (isTR ? "Sonraki \u2192" : "Next \u2192")}
                      </button>
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={handleClose}
                      >
                        {isTR ? "Kapat" : "Close"}
                      </button>
                    </div>
                  </div>
                )}

                {!running && (
                  <div className={styles.ctaRow}>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={handleStart}
                    >
                      {isTR ? "Ba\u015flat" : "Start"}
                    </button>

                    <button
                      type="button"
                      className={styles.ghostBtn}
                      onClick={() => navigator.clipboard?.writeText(isTR ? active.descTR : active.descEN)}
                    >
                      {isTR ? "Metni Kopyala" : "Copy Text"}
                    </button>
                  </div>
                )}

                <div className={styles.footnote}>
                  {isTR
                    ? "Not: Frekans bir hedef de\u011fil; y\u00f6n. K\u00fc\u00e7\u00fck se\u00e7imler b\u00fcy\u00fck ak\u0131\u015fa d\u00f6n\u00fc\u015f\u00fcr."
                    : "Note: Frequency is not a goal; it's direction. Small choices become a larger flow."}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerLine}>&copy; 2026 CaelinusAI \u2022 SANRI</div>
      </div>
    </div>
  );
}
