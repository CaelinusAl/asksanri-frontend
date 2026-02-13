// src/pages/RituelAlaniPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./RituelAlaniPage.module.css";

import StarTrail from "../components/StarTrail";
import RitualJourney from "../components/RituelJourney";
import RitualAudioPlayer from "../components/RitualAudioPlayer";
import PremiumGateModal from "../components/PremiumGateModal";

import { ritualFlows } from "../data/rituelFlows";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { useAuth } from "../contexts/AuthContext";

export default function RituelAlaniPage() {
  const navigate = useNavigate();

  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const { isAuthenticated, isPremium } = useAuth();

  // Flow data
  const flows = useMemo(() => ritualFlows || [], []);
  const [activeKey, setActiveKey] = useState(flows?.[0]?.key || "vitrin_rituel");
  const [stepIndex, setStepIndex] = useState(0);

  const activeFlow = useMemo(() => {
    const found = flows.find((f) => f.key === activeKey);
    return found || flows[0] || null;
  }, [flows, activeKey]);

  // Premium gate modal
  const [gateOpen, setGateOpen] = useState(false);

  // kullanıcı sayfaya dokunduğu anda audio unlock
  useEffect(() => {
    const onFirstPointer = () => unlockAudio();
    window.addEventListener("pointerdown", onFirstPointer, { passive: true });
    return () => window.removeEventListener("pointerdown", onFirstPointer);
  }, []);

  const goBackToGates = () => {
    // introya geri düşmemek için skipIntro state
    navigate("/", { state: { skipIntro: true } });
  };

  const selectFlow = (key) => {
    unlockAudio();
    setActiveKey(key);
    setStepIndex(0);
  };

  const openFlow = (flow) => {
    unlockAudio();

    if (flow?.premium && (!isAuthenticated || !isPremium)) {
      setGateOpen(true);
      return;
    }

    // aynı flow’a girince baştan başlat
    setActiveKey(flow.key);
    setStepIndex(0);
  };

  if (!activeFlow) {
    return (
      <div className={styles.page}>
        <StarTrail />
        <div className={styles.shell}>
          <div className={styles.card}>
            <div className={styles.h1}>Ritüel Alanı</div>
            <div className={styles.sub}>Flow bulunamadı.</div>
            <button className={styles.backBtn} onClick={goBackToGates} type="button">
              ← {isTR ? "Kapılara Dön" : "Back to Gates"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = isTR ? activeFlow.title?.tr : activeFlow.title?.en;
  const desc = isTR ? activeFlow.desc?.tr : activeFlow.desc?.en;
  const audioSrc = isTR ? activeFlow.audio?.tr : activeFlow.audio?.en;
  const steps = isTR ? activeFlow.steps?.tr : activeFlow.steps?.en;

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

      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>{isTR ? "RİTÜEL ALANI" : "RITUAL SPACE"}</div>
          <div className={styles.h1}>{title}</div>
          <div className={styles.sub}>{desc}</div>

          <div className={styles.grid}>
            {/* LEFT: Flow list */}
            <div className={styles.left}>
              <div className={styles.sectionTitle}>{isTR ? "Ritüeller" : "Rituals"}</div>

              <div className={styles.flowList}>
                {flows.map((f) => {
                  const ft = isTR ? f.title?.tr : f.title?.en;
                  const fd = isTR ? f.desc?.tr : f.desc?.en;
                  const active = f.key === activeKey;

                  return (
                    <button
                      key={f.key}
                      type="button"
                      className={`${styles.flowItem} ${active ? styles.flowItemActive : ""}`}
                      onClick={() => openFlow(f)}
                    >
                      <div className={styles.flowRow}>
                        <div>
                          <div className={styles.flowTitle}>{ft}</div>
                          <div className={styles.flowDesc}>{fd}</div>
                        </div>

                        <div className={styles.badges}>
                          {f.premium ? <span className={styles.premium}>PREMIUM</span> : null}
                          {!f.premium ? <span className={styles.free}>{isTR ? "Ücretsiz" : "Free"}</span> : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={styles.note}>
                {isTR
                  ? "Not: Ritüel sesleri ilk dokunuş sonrası açılır."
                  : "Note: Audio unlocks after the first tap/click."}
              </div>
            </div>

            {/* RIGHT: Ritual player */}
            <div className={styles.right}>
              <div className={styles.panel}>
                <div className={styles.panelTitle}>{isTR ? "Ritüel Yolculuğu" : "Ritual Journey"}</div>

                <RitualJourney
                  steps={steps}
                  stepIndex={stepIndex}
                  setStepIndex={setStepIndex}
                />

                <div className={styles.audioWrap}>
                  <RitualAudioPlayer src={audioSrc} />
                </div>

                <div className={styles.actionsRow}>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={() => {
                      unlockAudio();
                      setStepIndex(0);
                    }}
                  >
                    {isTR ? "Başa Sar" : "Restart"}
                  </button>

                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => {
                      unlockAudio();
                      setStepIndex((i) => Math.min(i + 1, (steps?.length || 1) - 1));
                    }}
                  >
                    {isTR ? "Devam →" : "Next →"}
                  </button>
                </div>
              </div>

              <div className={styles.footerTag}>Caelinus AI • Ritüel Alanı</div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM GATE MODAL */}
      <PremiumGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title={isTR ? "Ritüel Alanı • Premium Kapı" : "Ritual Space • Premium Gate"}
        subtitle={
          isTR
            ? "Bir katman daha derine geçmek için giriş/premium gerekli."
            : "Login/premium required to go deeper."
        }
      />
    </div>
  );
}