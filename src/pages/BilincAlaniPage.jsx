import React, { useMemo, useState } from "react";
import styles from "./BilincAlaniPage.module.css";

import StarTrail from "../components/StarTrail";
import DoorJourney from "../components/DoorJourney";

import { bilincDoors } from "../data/bilincDoors";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio, playSfx } from "../utils/sfx";

export default function BilincAlaniPage() {
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const doors = useMemo(() => bilincDoors, []);
  const [activeKey, setActiveKey] = useState(doors[0]?.key || "zihinKalp");
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

      {/* TOPBAR */}
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

      {/* HERO */}
      <div className={styles.shell}>
        <div className={styles.hero}>
          <div className={styles.kicker}>
            {isTR ? "BİLİNÇ ALANI" : "CONSCIOUSNESS FIELD"}
          </div>
          <h1 className={styles.h1}>{isTR ? "Bilinç Alanı" : "Consciousness Field"}</h1>
          <p className={styles.sub}>
            {isTR
              ? "Kapıyı seç. İçeri gir. Adım adım derinleş. Son adımda SANRI yansıtacak."
              : "Choose a gate. Enter. Go deeper step by step. SANRI reflects at the end."}
          </p>
        </div>

        <div className={styles.grid}>
          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>{isTR ? "Kapılar" : "Gates"}</div>

              <div className={styles.list}>
                {doors.map((d) => {
                  const active = d.key === activeKey;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      className={`${styles.door} ${active ? styles.active : ""}`}
                      onClick={() => selectDoor(d.key)}
                    >
                      <div className={styles.doorTitle}>
                        {d.title?.[language] || d.title?.tr}
                      </div>
                      <div className={styles.doorDesc}>
                        {d.desc?.[language] || d.desc?.tr}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <DoorJourney
              lang={language}
              door={activeDoor}
              stepIndex={stepIndex}
              setStepIndex={setStepIndex}
            />
          </div>
        </div>

        <div className={styles.footer}>Caelinus AI • Bilinç Alanı</div>
      </div>
    </div>
  );
}