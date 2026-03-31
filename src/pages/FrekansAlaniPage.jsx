import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FrekansAlaniPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { chakraData } from "../data/chakraData";

const DURATIONS = [
  { label: "1 dk", seconds: 60 },
  { label: "3 dk", seconds: 180 },
  { label: "7 dk", seconds: 420 },
];

const PHASE_LABELS = {
  inhale: "Nefes al…",
  hold: "Tut…",
  exhale: "Yavaşça ver…",
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ── Chakra Selector ── */
function ChakraSelector({ active, onSelect }) {
  return (
    <div className={styles.selector}>
      {chakraData.map((ch) => (
        <button
          key={ch.id}
          type="button"
          className={`${styles.chakraNode} ${active.id === ch.id ? styles.chakraNodeActive : ""}`}
          style={{ "--chakra-color": ch.color }}
          onClick={() => onSelect(ch)}
        >
          <div
            className={styles.chakraCircle}
            style={{ background: `radial-gradient(circle, ${ch.color}44 0%, transparent 70%)` }}
          />
          <span className={styles.chakraHz}>{ch.hz} Hz</span>
          <span className={styles.chakraLabel}>{ch.name.split("(")[0].trim()}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Info Panel ── */
function ChakraInfo({ chakra }) {
  return (
    <motion.div
      key={chakra.id}
      className={styles.infoPanel}
      style={{ borderColor: `${chakra.color}18` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.infoHeader}>
        <span className={styles.infoName}>{chakra.name}</span>
        <span className={styles.infoHz}>{chakra.hz} Hz</span>
      </div>
      <div className={styles.infoTheme}>{chakra.theme}</div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoCardLabel}>DENGEDE</div>
          <div className={styles.infoCardText}>{chakra.balancedState}</div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoCardLabel}>BLOKE</div>
          <div className={styles.infoCardText}>{chakra.blockedState}</div>
        </div>
      </div>

      <div className={styles.infoMessage}>{chakra.message}</div>
    </motion.div>
  );
}

/* ── Progress Ring SVG ── */
function ProgressRing({ progress, color }) {
  const R = 100;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - progress);

  return (
    <svg className={styles.progressRing} viewBox="0 0 212 212">
      <circle className={styles.progressTrack} cx="106" cy="106" r={R} />
      <circle
        className={styles.progressFill}
        cx="106"
        cy="106"
        r={R}
        style={{
          stroke: color,
          strokeDasharray: C,
          strokeDashoffset: offset,
        }}
      />
    </svg>
  );
}

/* ── Session Area ── */
function SessionArea({ chakra, onComplete }) {
  const [durIdx, setDurIdx] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | paused | complete
  const [remaining, setRemaining] = useState(DURATIONS[0].seconds);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const intervalRef = useRef(null);
  const breathRef = useRef(null);
  const totalSeconds = DURATIONS[durIdx].seconds;

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathRef.current) clearTimeout(breathRef.current);
    intervalRef.current = null;
    breathRef.current = null;
  }, []);

  const runBreathCycle = useCallback(() => {
    const { inhale, hold, exhale } = chakra.breathPattern;

    setBreathPhase("inhale");
    breathRef.current = setTimeout(() => {
      setBreathPhase("hold");
      breathRef.current = setTimeout(() => {
        setBreathPhase("exhale");
        breathRef.current = setTimeout(() => {
          runBreathCycle();
        }, exhale * 1000);
      }, hold * 1000);
    }, inhale * 1000);
  }, [chakra.breathPattern]);

  const start = useCallback(() => {
    clearTimers();
    const secs = status === "paused" ? remaining : DURATIONS[durIdx].seconds;
    setRemaining(secs);
    setStatus("running");
    runBreathCycle();

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimers();
          setStatus("complete");
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [status, remaining, durIdx, clearTimers, runBreathCycle, onComplete]);

  const pause = useCallback(() => {
    clearTimers();
    setStatus("paused");
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setStatus("idle");
    setRemaining(DURATIONS[durIdx].seconds);
    setBreathPhase("inhale");
  }, [clearTimers, durIdx]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  useEffect(() => {
    if (status === "idle") {
      setRemaining(DURATIONS[durIdx].seconds);
    }
  }, [durIdx, status]);

  // Reset session when chakra changes
  useEffect(() => {
    clearTimers();
    setStatus("idle");
    setRemaining(DURATIONS[durIdx].seconds);
    setBreathPhase("inhale");
  }, [chakra.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = 1 - remaining / totalSeconds;
  const isActive = status === "running";

  const { inhale, hold, exhale } = chakra.breathPattern;
  const cycleDuration = inhale + hold + exhale;
  const scaleKeyframes = useMemo(() => {
    const inEnd = inhale / cycleDuration;
    const holdEnd = (inhale + hold) / cycleDuration;
    return [1, 1.22, 1.22, 1];
  }, [inhale, hold, cycleDuration]);

  const scaleTimesKeyframes = useMemo(() => {
    const inEnd = inhale / cycleDuration;
    const holdEnd = (inhale + hold) / cycleDuration;
    return [0, inEnd, holdEnd, 1];
  }, [inhale, hold, cycleDuration]);

  return (
    <div className={styles.sessionArea} style={{ "--chakra-color": chakra.color }}>
      {/* Duration Picker */}
      <div className={styles.durationRow}>
        {DURATIONS.map((d, i) => (
          <button
            key={d.label}
            type="button"
            className={`${styles.durBtn} ${i === durIdx ? styles.durBtnActive : ""}`}
            onClick={() => { if (status === "idle") setDurIdx(i); }}
            disabled={status !== "idle"}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Energy Circle */}
      <div className={styles.energyWrap}>
        <motion.div
          className={`${styles.energyCircle} ${isActive ? styles.energyCircleRunning : ""}`}
          animate={
            isActive
              ? { scale: scaleKeyframes }
              : { scale: 1 }
          }
          transition={
            isActive
              ? {
                  duration: cycleDuration,
                  repeat: Infinity,
                  times: scaleTimesKeyframes,
                  ease: "easeInOut",
                }
              : { duration: 0.4 }
          }
        >
          <ProgressRing progress={progress} color={chakra.color} />
          <span className={styles.breathText}>
            {status === "idle" ? "Hazır" : PHASE_LABELS[breathPhase]}
          </span>
          <span className={styles.timerText}>{formatTime(remaining)}</span>
          {isActive && (
            <span className={styles.phaseHint}>
              {inhale}s / {hold}s / {exhale}s
            </span>
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {status === "idle" && (
          <button type="button" className={`${styles.ctrlBtn} ${styles.ctrlPrimary}`} onClick={start}>
            Başlat
          </button>
        )}
        {status === "running" && (
          <button type="button" className={`${styles.ctrlBtn} ${styles.ctrlPrimary}`} onClick={pause}>
            Duraklat
          </button>
        )}
        {status === "paused" && (
          <>
            <button type="button" className={`${styles.ctrlBtn} ${styles.ctrlPrimary}`} onClick={start}>
              Devam Et
            </button>
            <button type="button" className={`${styles.ctrlBtn} ${styles.ctrlGhost}`} onClick={reset}>
              Sıfırla
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Session Complete ── */
function SessionComplete({ chakra, onReset }) {
  const navigate = useNavigate();
  return (
    <motion.div
      className={styles.completeArea}
      style={{ "--chakra-color": chakra.color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.completeBadge}>OTURUM TAMAMLANDI</div>

      <div className={styles.reflectionBox}>
        <div className={styles.reflectionLabel}>Yansıma Sorusu</div>
        <div className={styles.reflectionText}>{chakra.reflectionQuestion}</div>
      </div>

      <div className={styles.practiceBox}>
        <div className={styles.practiceLabel}>Mini Pratik</div>
        <div className={styles.practiceText}>{chakra.miniPractice}</div>
      </div>

      <div className={styles.completeActions}>
        <button
          type="button"
          className={`${styles.ctrlBtn} ${styles.ctrlPrimary}`}
          onClick={() =>
            navigate("/sanriya-sor", {
              state: { prefill: `${chakra.name} frekansında bir oturum tamamladım. ${chakra.reflectionQuestion}` },
            })
          }
        >
          Sanrı'ya Sor
        </button>
        <button type="button" className={`${styles.ctrlBtn} ${styles.ctrlGhost}`} onClick={onReset}>
          Yeni Oturum
        </button>
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function FrekansAlaniPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [activeChakra, setActiveChakra] = useState(chakraData[0]);
  const [sessionDone, setSessionDone] = useState(false);

  const goBack = () => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  };

  const handleChakraSelect = (ch) => {
    setActiveChakra(ch);
    setSessionDone(false);
  };

  return (
    <div className={styles.page} style={{ "--chakra-color": activeChakra.color }} onPointerDown={unlockAudio}>
      <StarTrail />

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
        </div>
        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={goBack}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.shell}>
        <div className={styles.hero}>
          <h1 className={styles.h1}>{isTR ? "Frekans Alanı" : "Frequency Field"}</h1>
          <p className={styles.sub}>
            {isTR
              ? "Bir çakra seç. Frekansını hisset. Nefesle akışa gir."
              : "Choose a chakra. Feel its frequency. Enter the flow with breath."}
          </p>
        </div>

        <ChakraSelector active={activeChakra} onSelect={handleChakraSelect} />

        <AnimatePresence mode="wait">
          <ChakraInfo key={activeChakra.id} chakra={activeChakra} />
        </AnimatePresence>

        {sessionDone ? (
          <SessionComplete
            chakra={activeChakra}
            onReset={() => setSessionDone(false)}
          />
        ) : (
          <SessionArea
            chakra={activeChakra}
            onComplete={() => setSessionDone(true)}
          />
        )}

        <div className={styles.footer}>© 2026 CaelinusAI • SANRI</div>
      </div>
    </div>
  );
}
