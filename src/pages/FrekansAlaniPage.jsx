// src/pages/FrekansAlaniPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./FrekansAlaniPage.module.css";

import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

export default function FrekansAlaniPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  // Gates’e geri dön (intro atla)
  const goBackToGates = () => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  };

  // Basit içerik örneği (sonra çoğaltırız)
  const cards = useMemo(
    () => [
      {
        key: "breath_47",
        titleTR: "47 Nefes • Sakinleştir",
        titleEN: "47 Breath • Regulate",
        descTR: "3 tur: 4 al • 2 tut • 6 ver. Kalbi yumuşat.",
        descEN: "3 rounds: 4 in • 2 hold • 6 out. Soften the heart.",
      },
      {
        key: "focus_369",
        titleTR: "369 Odak • Açık Zihin",
        titleEN: "369 Focus • Clear Mind",
        descTR: "1 dakika: omuzları indir, gözleri yumuşat, niyeti netleştir.",
        descEN: "1 minute: drop shoulders, soften eyes, clarify intention.",
      },
      {
        key: "signal",
        titleTR: "Sinyal • Yön Bul",
        titleEN: "Signal • Find Direction",
        descTR: "Bugün tek küçük bir seçim: ‘neye evet?’",
        descEN: "One small choice today: ‘what is my yes?’",
      },
    ],
    []
  );

  const [activeKey, setActiveKey] = useState(cards[0]?.key);

  const active = useMemo(
    () => cards.find((c) => c.key === activeKey) || cards[0],
    [cards, activeKey]
  );

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

      {/* CONTENT */}
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI • FREQUENCY FIELD</div>

          <div className={styles.h1}>{isTR ? "Frekans Alanı" : "Frequency Field"}</div>

          <div className={styles.subtitle}>
            {isTR
              ? "Enerji katmanı. Küçük seçimler büyük akışa dönüşür."
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
                      onClick={() => setActiveKey(c.key)}
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
                <div className={styles.panelTitle}>
                  {isTR ? "Seçili Protokol" : "Selected Protocol"}
                </div>

                <div className={styles.bigTitle}>{isTR ? active.titleTR : active.titleEN}</div>
                <div className={styles.bigDesc}>{isTR ? active.descTR : active.descEN}</div>

                <div className={styles.ctaRow}>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => {
                      // şimdilik sadece bir “başlat” hissi verelim
                      // sonra buraya ritual player veya frekans player bağlarız
                      alert(isTR ? "Başladı. Nefes al." : "Started. Breathe.");
                    }}
                  >
                    {isTR ? "Başlat" : "Start"}
                  </button>

                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => navigator.clipboard?.writeText(isTR ? active.descTR : active.descEN)}
                  >
                    {isTR ? "Metni Kopyala" : "Copy Text"}
                  </button>
                </div>

                <div className={styles.footnote}>
                  {isTR
                    ? "Not: Frekans bir hedef değil; yön. Küçük seçimler büyük akışa dönüşür."
                    : "Note: Frequency is not a goal; it’s direction. Small choices become a larger flow."}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerLine}>© 2026 CaelinusAI • SANRI</div>
      </div>
    </div>
  );
}