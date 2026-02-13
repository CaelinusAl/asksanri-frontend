import React, { useMemo, useState } from "react";
import styles from "./RituelAlaniPage.module.css";

import StarTrail from "../components/StarTrail";
import RituelJourney from "../components/RituelJourney";

import { rituelFlows } from "../data/rituelFlows";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio, playSfx } from "../utils/sfx";
import RitualAudioPlayer from "../components/RitualAudioPlayer";
import PremiumGateModal from "../components/PremiumGateModal";
import { useAuth } from "../contexts/AuthContext";

export default function RituelAlaniPage() {
  const { isAuthenticated, isPremium } = useAuth();
  const [gateOpen, setGateOpen] = useState(false);

  const openFlow = (flow) => {
    if (flow.premium && (!isAuthenticated || !isPremium)) {
      setGateOpen(true);
      return;
    }
    // ✅ burada ritüeli başlat
  };

  return (
    <>
      {/* ... ritüel UI ... */}

      <PremiumGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title="Ritüel Alanı • Premium Kapı"
        subtitle="Bir katman daha derine geçmek için giriş/premium gerekli."
      />
    </>
  );
}



export default function RituelAlaniPage() {
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";


  const flows = useMemo(() => rituelFlows, []);
  const [activeKey, setActiveKey] = useState(flows[0]?.key || "rituel_60");
  const [stepIndex, setStepIndex] = useState(0);

  const activeFlow = useMemo(
    () => flows.find((f) => f.key === activeKey) || flows[0],
    [flows, activeKey]
  );

  const selectFlow = (key) => {
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
          <div className={styles.kicker}>{isTR ? "RİTÜEL ALANI" : "RITUAL SPACE"}</div>
          <h1 className={styles.h1}>{isTR ? "Ritüel Alanı" : "Ritual Space"}</h1>
          <p className={styles.sub}>
            {isTR
              ? "Kısa protokoller: niyet + nefes + mühür. Son adımda SANRI’dan ritüel iste."
              : "Short protocols: intention + breath + seal. Ask SANRI at the end."}
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>{isTR ? "Ritüeller" : "Rituals"}</div>

              <div className={styles.list}>
                {flows.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`${styles.door} ${activeKey === f.key ? styles.active : ""}`}
                    onClick={() => selectFlow(f.key)}
                  >
                    <div className={styles.doorTitle}>{f.title?.[language] || f.title?.tr}</div>
                    <div className={styles.doorDesc}>{f.desc?.[language] || f.desc?.tr}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <RituelJourney
              lang={language}
              flow={activeFlow}
              stepIndex={stepIndex}
              setStepIndex={setStepIndex}
            />
          </div>
        </div>
         <RitualAudioPlayer
  src={
    language === "tr"
      ? "/audio/rituels/vitrin_rituel_tr.mp3"
      : "/audio/rituels/vitrin_rituel_en.mp3"
  }
/>



        <div className={styles.footer}>Caelinus AI • Ritüel Alanı</div>
      </div>
    </div>
  );
}