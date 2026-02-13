import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RituelAlaniPage.module.css";
import { ritualFlows } from "../data/ritualFlows";
import { useLanguage } from "../contexts/LanguageContext";
import StarTrail from "../components/StarTrail";
import { unlockAudio } from "../utils/sfx";

export default function RituelAlaniPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [activeKey, setActiveKey] = useState("vitrin_rituel");
  const [stepIndex, setStepIndex] = useState(0);

  const flow = useMemo(
    () => ritualFlows.find((f) => f.key === activeKey),
    [activeKey]
  );

  if (!flow) return null;

  const currentSteps = isTR ? flow.steps.tr : flow.steps.en;
  const currentAudio = isTR ? flow.audio.tr : flow.audio.en;

  const nextStep = () => {
    if (stepIndex < currentSteps.length - 1) setStepIndex(stepIndex + 1);
  };

  const prevStep = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
  <StarTrail />
  {/* TOPBAR */}
  
      <div className={styles.topbar}>
        <div className={styles.brandArea}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.subtitle}>
            {isTR ? "Ritüel Alanı • Frekans Protokolleri" : "Ritual Space • Frequency Protocols"}
          </span>
        </div>

        <div className={styles.topbarRight}>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title={isTR ? "EN" : "TR"}
            aria-label="Language toggle"
          >
            {isTR ? "EN" : "TR"}
          </button>

          <button type="button" className={styles.backBtn} onClick={() => navigate("/")}>
            ← {isTR ? "Kapılara Dön" : "Back to Gates"}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* LEFT PANEL */}
        <div className={styles.ritualList}>
          <div className={styles.panelTitle}>{isTR ? "RİTÜELLER" : "RITUALS"}</div>

          {ritualFlows.map((r) => (
            <div
              key={r.key}
              className={`${styles.ritualItem} ${activeKey === r.key ? styles.activeItem : ""}`}
              onClick={() => {
                setActiveKey(r.key);
                setStepIndex(0);
              }}
            >
              <div className={styles.itemTitle}>{isTR ? r.title.tr : r.title.en}</div>
              <div className={styles.itemDesc}>{isTR ? r.desc.tr : r.desc.en}</div>
              {!r.premium && <span className={styles.freeBadge}>FREE</span>}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.selectedCard}>
          <div className={styles.selectedTitle}>{isTR ? flow.title.tr : flow.title.en}</div>
          <div className={styles.selectedDesc}>{isTR ? flow.desc.tr : flow.desc.en}</div>

          {/* AUDIO */}
          <div className={styles.audioBox}>
            <div className={styles.audioLabel}>{isTR ? "Sesli Ritüel" : "Audio Ritual"}</div>

            <audio key={currentAudio} controls className={styles.audio}>
              <source src={currentAudio} type="audio/mpeg" />
            </audio>
          </div>

          {/* STEPS */}
          <div className={styles.steps}>
            <div className={styles.stepCount}>
              {isTR ? "Adım" : "Step"} {stepIndex + 1}/{currentSteps.length}
            </div>

            <div className={styles.stepTitle}>{currentSteps[stepIndex].t}</div>
            <div className={styles.stepBody}>{currentSteps[stepIndex].b}</div>
          </div>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button onClick={prevStep} className={styles.secondaryBtn}>
              ← {isTR ? "Geri" : "Back"}
            </button>

            <button onClick={nextStep} className={styles.primaryBtn}>
              {isTR ? "Devam" : "Continue"} →
            </button>

            <button
              className={styles.premiumBtn}
              onClick={() => navigate(`/sanriya-sor?q=${encodeURIComponent(isTR ? flow.title.tr : flow.title.en)}`)}
            >
              ✨ {isTR ? "SANRI’ya Sor" : "Ask SANRI"}
            </button>
          </div>

          <div className={styles.footnote}>
            {isTR
              ? "Bu alan 'bilgi' üretmez. Protokol uygular; sende açılır. © 2026 CaelinusAI • SANRI"
              : "This space does not produce knowledge. It applies protocol; it opens within you. © 2026 CaelinusAI • SANRI"}
          </div>
        </div>
      </div>
    </div>
  );
}