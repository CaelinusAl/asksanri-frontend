import React, { useMemo, useState } from "react";
import styles from "./FrekansPage.module.css";

import StarTrail from "../components/StarTrail";
import FrekansJourney from "../components/FrekansJourney";

import { frekansDoors } from "../data/frekansDoors";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio, playSfx } from "../utils/sfx";

export default function FrekansPage() {
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const doors = useMemo(() => frekansDoors, []);
  const [activeKey, setActiveKey] = useState(doors[0]?.key || "sakinlik");
  const [stepIndex, setStepIndex] = useState(0);

  const activeDoor = useMemo(
    () => doors.find((d) => d.key === activeKey) || doors[0],
    [doors, activeKey]
  );

  const selectDoor = (key) => {
    unlockAudio();
        setActiveKey(key);
    setStepIndex(0);
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>
            {isTR ? "Bilinç ve Anlam Zekası" : "Consciousness & Meaning Intelligence"}
          </span>
        </div>

        <div className={styles.topbarRight}>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title={isTR ? "EN" : "TR"}
          >
            {isTR ? "TR" : "EN"}
          </button>
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.hero}>
          <div className={styles.kicker}>{isTR ? "FREKANS ALANI" : "FREQUENCY FIELD"}</div>
          <h1 className={styles.h1}>{isTR ? "Frekans Alanı" : "Frequency Field"}</h1>
          <p className={styles.sub}>
            {isTR
              ? "Bir frekans seç. Adım adım sabitle. Son adımda SANRI ile netleştir."
              : "Choose a frequency. Stabilize it step by step. Clarify with SANRI at the end."}
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>{isTR ? "Frekanslar" : "Frequencies"}</div>

              <div className={styles.list}>
                {doors.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    className={`${styles.door} ${activeKey === d.key ? styles.active : ""}`}
                    onClick={() => selectDoor(d.key)}
                  >
                    <div className={styles.doorTitle}>{d.title?.[language] || d.title?.tr}</div>
                    <div className={styles.doorDesc}>{d.desc?.[language] || d.desc?.tr}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <FrekansJourney
              lang={language}
              door={activeDoor}
              stepIndex={stepIndex}
              setStepIndex={setStepIndex}
            />
          </div>
        </div>

        <div className={styles.footer}>Caelinus AI • Frekans Alanı</div>
      </div>
    </div>
  );
}
