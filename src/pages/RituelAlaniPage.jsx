// src/pages/RituelAlaniPage.jsx — Ritüel Kubbesi (sihirli ritüel alanı)
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RituelAlaniPage.module.css";

import StarTrail from "../components/StarTrail";
import PremiumGateModal from "../components/PremiumGateModal";

import { ritualFlows } from "../data/ritualFlows";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

const FLOW_SYMBOLS = {
  vitrin_rituel: "\u2726",
  "60_saniye": "\u25CB",
  default: "\u25C7",
};

const PHASES = {
  tr: ["\u00c7a\u011fr\u0131", "Niyet", "Ak\u0131\u015f", "M\u00fch\u00fcr", "Derinlik", "Yol"],
  en: ["Call", "Intention", "Flow", "Seal", "Depth", "Path"],
};

export default function RituelAlaniPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [fatal, setFatal] = useState("");

  useEffect(() => {
    const onErr = (msg, src, line, col, err) => {
      setFatal(String(err?.stack || err || msg));
      return false;
    };
    const onRej = (e) => setFatal(String(e?.reason?.stack || e?.reason || e));
    window.onerror = onErr;
    window.onunhandledrejection = onRej;
    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

  const flows = useMemo(() => (Array.isArray(ritualFlows) ? ritualFlows : []), []);
  const [activeKey, setActiveKey] = useState(() => flows?.[0]?.key || "vitrin_rituel");
  const [stepIndex, setStepIndex] = useState(0);

  const [gateOpen, setGateOpen] = useState(false);

  const activeFlow = useMemo(() => {
    const found = flows.find((f) => f?.key === activeKey);
    return found || flows?.[0] || null;
  }, [flows, activeKey]);

  const steps = useMemo(() => {
    const s = activeFlow?.steps?.[isTR ? "tr" : "en"];
    return Array.isArray(s) ? s : [];
  }, [activeFlow, isTR]);

  const currentStep = steps[stepIndex] || null;

  const progressPct = useMemo(() => {
    if (!steps.length) return 0;
    return Math.round(((stepIndex + 1) / steps.length) * 100);
  }, [stepIndex, steps.length]);

  const phaseName = useMemo(() => {
    const arr = isTR ? PHASES.tr : PHASES.en;
    return arr[Math.min(stepIndex, arr.length - 1)] || arr[0];
  }, [stepIndex, isTR]);

  const flowSymbol = FLOW_SYMBOLS[activeFlow?.key] || FLOW_SYMBOLS.default;

  const rawAudio = activeFlow?.audio?.[isTR ? "tr" : "en"] || "";
  const currentAudio = useMemo(() => {
    if (rawAudio) return rawAudio;
    if (activeFlow?.key === "vitrin_rituel") {
      return isTR ? "/audio/rituals/vitrin_rituel_tr.mp3" : "/audio/rituals/vitrin_rituel_en.mp3";
    }
    return "";
  }, [rawAudio, activeFlow?.key, isTR]);

  const goBackToGates = useCallback(() => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  }, [navigate]);

  const openFlow = useCallback((flow) => {
    unlockAudio();
    setFatal("");
    if (!flow?.key) return;

    if (flow.premium) {
      setGateOpen(true);
      return;
    }

    setActiveKey(flow.key);
    setStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  }, [stepIndex, steps.length]);

  const prevStep = useCallback(() => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const goToSanri = useCallback(() => {
    const title = isTR ? activeFlow?.title?.tr : activeFlow?.title?.en;
    const q = encodeURIComponent(String(title || ""));
    navigate(`/sanriya-sor?prefill=${q}&domain=ritual_space&mode=mirror`, { state: { skipIntro: true } });
  }, [navigate, activeFlow, isTR]);

  const audioRef = useRef(null);
  useEffect(() => {
    if (!audioRef.current) return;
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } catch {}
  }, [currentAudio]);

  const handleRegister = useCallback(
    async ({ email, password }) => {
      if (!API_URL) return alert(isTR ? "VITE_BACKEND_URL eksik." : "Missing VITE_BACKEND_URL.");
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(String(data?.detail || data?.error || "Register failed"));
      setGateOpen(false);
      alert(isTR ? "Kay\u0131t ba\u015far\u0131l\u0131. \u015eimdi giri\u015f yap." : "Registration successful. Now log in.");
    },
    [API_URL, isTR]
  );

  const handleLogin = useCallback(
    async ({ email, password }) => {
      if (!API_URL) return alert(isTR ? "VITE_BACKEND_URL eksik." : "Missing VITE_BACKEND_URL.");
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(String(data?.detail || data?.error || "Login failed"));
      setGateOpen(false);
      alert(isTR ? "Giri\u015f ba\u015far\u0131l\u0131." : "Login successful.");
    },
    [API_URL, isTR]
  );

  const heroEyebrow = isTR ? "Frekans \u2022 Nefes \u2022 M\u00fch\u00fcr" : "Frequency \u2022 Breath \u2022 Seal";
  const heroTitle = isTR ? "Rit\u00fcel Kubbesi" : "The Ritual Dome";
  const heroSub = isTR
    ? "Burada bilgi de\u011fil, alan a\u00e7\u0131l\u0131r. Ad\u0131mlar seni y\u00f6nlendirmez; i\u00e7indeki ritme d\u00f6nd\u00fcr\u00fcr."
    : "Knowledge is not produced here\u2014space opens. Steps don\u2019t instruct; they return you to your rhythm.";

  const pageSubtitle = isTR ? "Rit\u00fcel Alan\u0131" : "Ritual Space";

  return (
    <div
      className={styles.page}
      onPointerDown={unlockAudio}
      onTouchStart={unlockAudio}
      onMouseDown={unlockAudio}
    >
      {fatal ? (
        <div className={styles.fatal}>
          <b>{isTR ? "Rit\u00fcel Alan\u0131 Hatas\u0131" : "Ritual Space Error"}</b>
          {"\n\n"}
          {fatal}
        </div>
      ) : null}

      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>SANRI</span>
          <span className={styles.topbarSubtitle}>{pageSubtitle}</span>
        </div>

        <div className={styles.topbarRight}>
          <button type="button" className={styles.langBtn} onClick={() => setLanguage(isTR ? "en" : "tr")}>
            {isTR ? "EN" : "TR"}
          </button>

          <button type="button" className={styles.backBtn} onClick={goBackToGates}>
            {isTR ? "\u2190 Kap\u0131lara D\u00f6n" : "\u2190 Back to Gates"}
          </button>
        </div>
      </div>

      <header className={styles.ritualHero} aria-hidden="false">
        <div className={styles.heroGlow} />
        <p className={styles.heroEyebrow}>{heroEyebrow}</p>
        <h1 className={styles.heroTitle}>{heroTitle}</h1>
        <p className={styles.heroSub}>{heroSub}</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.ritualList}>
          <div className={styles.panelTitle}>{isTR ? "KAPILAR" : "GATES"}</div>

          <div className={styles.listInner}>
            {flows.map((r) => {
              const isActive = r?.key === activeKey;
              const title = isTR ? r?.title?.tr : r?.title?.en;
              const desc = isTR ? r?.desc?.tr : r?.desc?.en;
              const sym = FLOW_SYMBOLS[r.key] || FLOW_SYMBOLS.default;

              return (
                <div
                  key={r.key}
                  role="button"
                  tabIndex={0}
                  className={`${styles.ritualItem} ${isActive ? styles.active : ""}`}
                  onClick={() => openFlow(r)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openFlow(r);
                  }}
                >
                  <span className={styles.itemSymbol} aria-hidden>
                    {sym}
                  </span>
                  <div className={styles.itemTitle}>{title || r.key}</div>
                  <div className={styles.itemDesc}>{desc || ""}</div>

                  <div className={styles.badges}>
                    {r?.premium ? (
                      <span className={styles.premiumBadge}>PREMIUM</span>
                    ) : (
                      <span className={styles.freeBadge}>{isTR ? "\u00dcCRETS\u0130Z" : "FREE"}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.note}>
            {isTR
              ? "Premium kap\u0131lar i\u00e7in anahtar gerekir. Vitrin rit\u00fceli herkese a\u00e7\u0131k bir nefestir."
              : "Premium gates need a key. The showcase ritual is one breath open to all."}
          </div>
        </aside>

        <main className={styles.selectedCard}>
          <div className={styles.panelTitle}>{isTR ? "SE\u00c7\u0130L\u0130 ALAN" : "ACTIVE FIELD"}</div>

          <div className={styles.selectedTitle}>
            {activeFlow ? (isTR ? activeFlow?.title?.tr : activeFlow?.title?.en) : isTR ? "Rit\u00fcel" : "Ritual"}
          </div>

          <div className={styles.selectedDesc}>
            {activeFlow ? (isTR ? activeFlow?.desc?.tr : activeFlow?.desc?.en) : ""}
          </div>

          <section className={styles.orbSection} aria-label={isTR ? "Rit\u00fcel ad\u0131m\u0131" : "Ritual step"}>
            <div
              className={styles.progressRingWrap}
              style={{ "--progress": progressPct }}
            >
              <div className={styles.progressRing} />
              <div className={styles.progressRingInner}>
                <span className={styles.stepSigil}>{flowSymbol}</span>
              </div>
            </div>

            <div className={styles.phaseLabel}>{phaseName}</div>

            {currentStep?.t ? <div className={styles.stepTag}>{currentStep.t}</div> : null}

            <div className={styles.stepVerse}>
              {currentStep?.b || (isTR ? "Bu rit\u00fcel yak\u0131nda." : "Coming soon.")}
            </div>
          </section>

          <div className={styles.audioSanctum}>
            <div className={styles.audioTitle}>{isTR ? "SES TUNELI" : "SOUND TUNNEL"}</div>

            {currentAudio ? (
              <audio ref={audioRef} src={currentAudio} controls className={styles.audio} preload="metadata" />
            ) : (
              <div className={styles.audioMissing}>{isTR ? "Ses dosyas\u0131 bulunamad\u0131." : "Audio file not found."}</div>
            )}

            <div className={styles.audioHint}>
              {isTR
                ? "\u0130lk dinlemede ekrana bir kez dokun."
                : "Tap the screen once before first play."}
            </div>
          </div>

          <div className={styles.stepsBox}>
            <div className={styles.stepActions}>
              <button type="button" className={styles.btnGhost} onClick={prevStep} disabled={stepIndex <= 0}>
                {isTR ? "\u2190 \u00d6nceki nefes" : "\u2190 Previous"}
              </button>

              <button
                type="button"
                className={styles.btnPrimary}
                onClick={nextStep}
                disabled={!steps.length || stepIndex >= steps.length - 1}
              >
                {isTR ? "Sonraki nefes \u2192" : "Next \u2192"}
              </button>

              <div className={styles.grow} />

              <button type="button" className={styles.btnSanri} onClick={goToSanri}>
                {isTR ? "SANRI ile derinle\u015f \u2192" : "Go deeper with SANRI \u2192"}
              </button>
            </div>
          </div>

          <div className={styles.footnote}>
            {isTR
              ? "\u201cBilgi\u201d \u00fcretmez; protokol uygular. A\u00e7\u0131l\u0131\u015f sende olur. \u00a9 2026 CaelinusAI \u2022 SANRI"
              : "It does not produce \u201cknowledge\u201d\u2014it applies protocol. The opening is within you. \u00a9 2026 CaelinusAI \u2022 SANRI"}
          </div>
        </main>
      </div>

      <PremiumGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title={isTR ? "Premium kap\u0131" : "Premium gate"}
        subtitle={
          isTR
            ? "Bu rit\u00fcel derin frekans ta\u015f\u0131r.\nGiri\u015f yap veya kay\u0131t ol."
            : "This ritual carries a deep frequency.\nLog in or register."
        }
        onRegister={handleRegister}
        onLogin={handleLogin}
      />
    </div>
  );
}
