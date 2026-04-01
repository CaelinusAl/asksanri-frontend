import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./RitualSessionPage.module.css";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { getRitualById, addRitualToHistory } from "../data/ritualData";

const ENERGY_COLORS = {
  grounding: "#48BB78",
  release: "#9F7AEA",
  heart: "#ED64A6",
  clarity: "#4299E1",
  abundance: "#ECC94B",
  shadow: "#718096",
};

const MOODS = [
  { emoji: "😌", tr: "Huzurlu", en: "Peaceful" },
  { emoji: "💪", tr: "Güçlü", en: "Strong" },
  { emoji: "😊", tr: "Hafif", en: "Light" },
  { emoji: "🤔", tr: "Düşünceli", en: "Thoughtful" },
  { emoji: "😢", tr: "Duygusal", en: "Emotional" },
];

const RING_RADIUS = 60;
const RING_STROKE = 4;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RING_SIZE = (RING_RADIUS + RING_STROKE) * 2;

export default function RitualSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const ritual = useMemo(() => getRitualById(id), [id]);
  const steps = useMemo(
    () => (ritual ? ritual.steps[isTR ? "tr" : "en"] : []),
    [ritual, isTR]
  );

  const [status, setStatus] = useState("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);

  const intervalRef = useRef(null);

  const currentStep = steps[stepIndex] || null;
  const totalDuration = currentStep ? currentStep.duration : 1;
  const energyColor = ritual ? ENERGY_COLORS[ritual.energyType] || "#4299E1" : "#4299E1";

  const isBreathStep = useMemo(() => {
    if (!currentStep) return false;
    const t = currentStep.text.toLowerCase();
    return t.includes("nefes") || t.includes("breath");
  }, [currentStep]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  useEffect(() => {
    if (status !== "running") return;
    if (remaining > 0) return;

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      clearTimer();
      setStatus("complete");
    }
  }, [remaining, status, stepIndex, steps.length, clearTimer]);

  useEffect(() => {
    if (status === "running" && currentStep) {
      setRemaining(currentStep.duration);
      startTimer();
    }
    return clearTimer;
  }, [stepIndex, status, currentStep, startTimer, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const handleStart = useCallback(() => {
    unlockAudio();
    setStepIndex(0);
    setSelectedMood(null);
    setMoodSaved(false);
    setStatus("running");
  }, []);

  const handlePause = useCallback(() => {
    clearTimer();
    setStatus("paused");
  }, [clearTimer]);

  const handleResume = useCallback(() => {
    setStatus("running");
    startTimer();
  }, [startTimer]);

  const handleRestart = useCallback(() => {
    clearTimer();
    setStepIndex(0);
    setSelectedMood(null);
    setMoodSaved(false);
    setStatus("idle");
  }, [clearTimer]);

  const handleExit = useCallback(() => {
    clearTimer();
    navigate("/rituel-alani");
  }, [clearTimer, navigate]);

  const handleMoodSelect = useCallback(
    (mood) => {
      setSelectedMood(mood);
      const label = isTR ? mood.tr : mood.en;
      addRitualToHistory(id, label);
      setMoodSaved(true);
    },
    [id, isTR]
  );

  const progressOffset = useMemo(() => {
    if (totalDuration <= 0) return RING_CIRCUMFERENCE;
    const elapsed = totalDuration - remaining;
    const fraction = elapsed / totalDuration;
    return RING_CIRCUMFERENCE * (1 - fraction);
  }, [remaining, totalDuration]);

  if (!ritual) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <p>{isTR ? "Ritüel bulunamadı." : "Ritual not found."}</p>
          <button className={styles.btnPrimary} onClick={() => navigate("/rituel-alani")}>
            {isTR ? "Geri Dön" : "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            className={styles.idleScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className={styles.idleIcon} style={{ color: energyColor }}>
              ✦
            </div>
            <h1 className={styles.idleTitle}>
              {isTR ? ritual.title.tr : ritual.title.en}
            </h1>
            <p className={styles.idleSubtitle}>
              {isTR ? ritual.subtitle.tr : ritual.subtitle.en}
            </p>
            <p className={styles.idlePrompt}>
              {isTR ? "Hazır mısın?" : "Ready?"}
            </p>
            <button
              className={styles.startBtn}
              style={{ background: energyColor }}
              onClick={handleStart}
            >
              {isTR ? "Başla" : "Start"}
            </button>
            <button className={styles.exitLink} onClick={handleExit}>
              {isTR ? "← Geri" : "← Back"}
            </button>
          </motion.div>
        )}

        {status === "running" && (
          <motion.div
            key="running"
            className={styles.runningScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.runningContent}>
              <div className={styles.ringWrap}>
                <svg
                  width={RING_SIZE}
                  height={RING_SIZE}
                  viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                  className={styles.ringSvg}
                >
                  <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={RING_STROKE}
                  />
                  <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke={energyColor}
                    strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={progressOffset}
                    transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                    style={{
                      transition: "stroke-dashoffset 0.3s ease",
                      filter: `drop-shadow(0 0 6px ${energyColor}66)`,
                    }}
                  />
                </svg>
                <span className={styles.ringTimer}>{remaining}</span>
              </div>

              <div className={styles.stepArea}>
                {isBreathStep && (
                  <motion.div
                    className={styles.breathCircle}
                    style={{ background: `${energyColor}26` }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={stepIndex}
                    className={styles.stepText}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {currentStep?.text}
                  </motion.p>
                </AnimatePresence>
              </div>

              <p className={styles.stepCounter}>
                {stepIndex + 1} / {steps.length}
              </p>
            </div>

            <div className={styles.controls}>
              <button
                className={styles.controlBtn}
                onClick={handlePause}
                aria-label={isTR ? "Duraklat" : "Pause"}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <rect x="4" y="3" width="4" height="14" rx="1" />
                  <rect x="12" y="3" width="4" height="14" rx="1" />
                </svg>
              </button>
              <button
                className={styles.controlBtnSmall}
                onClick={handleExit}
                aria-label={isTR ? "Çıkış" : "Exit"}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {status === "paused" && (
          <motion.div
            key="paused"
            className={styles.pausedScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.pausedContent}>
              <div className={styles.ringWrap}>
                <svg
                  width={RING_SIZE}
                  height={RING_SIZE}
                  viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                  className={styles.ringSvg}
                >
                  <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={RING_STROKE}
                  />
                  <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke={energyColor}
                    strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={progressOffset}
                    transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                    style={{ filter: `drop-shadow(0 0 6px ${energyColor}66)` }}
                  />
                </svg>
                <span className={styles.ringTimer}>{remaining}</span>
              </div>

              <p className={styles.stepTextDimmed}>{currentStep?.text}</p>
              <p className={styles.stepCounter}>
                {stepIndex + 1} / {steps.length}
              </p>
            </div>

            <div className={styles.pausedButtons}>
              <button
                className={styles.btnPrimary}
                style={{ background: energyColor }}
                onClick={handleResume}
              >
                {isTR ? "Devam Et" : "Resume"}
              </button>
              <button className={styles.btnSecondary} onClick={handleRestart}>
                {isTR ? "Yeniden Başla" : "Restart"}
              </button>
              <button className={styles.btnGhost} onClick={handleExit}>
                {isTR ? "Çıkış" : "Exit"}
              </button>
            </div>
          </motion.div>
        )}

        {status === "complete" && (
          <motion.div
            key="complete"
            className={styles.completeScreen}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className={styles.celebrationIcon}
              style={{ color: energyColor }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
            >
              {isTR ? "Tamamlandı ✦" : "Complete ✦"}
            </motion.div>

            {!moodSaved && (
              <motion.div
                className={styles.moodSection}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <p className={styles.moodQuestion}>
                  {isTR ? "Nasıl hissediyorsun?" : "How do you feel?"}
                </p>
                <div className={styles.moodRow}>
                  {MOODS.map((mood) => (
                    <button
                      key={mood.en}
                      className={`${styles.moodBtn} ${
                        selectedMood?.en === mood.en ? styles.moodBtnActive : ""
                      }`}
                      style={
                        selectedMood?.en === mood.en
                          ? { boxShadow: `0 0 16px ${energyColor}88` }
                          : undefined
                      }
                      onClick={() => handleMoodSelect(mood)}
                    >
                      <span className={styles.moodEmoji}>{mood.emoji}</span>
                      <span className={styles.moodLabel}>
                        {isTR ? mood.tr : mood.en}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {moodSaved && (
              <motion.div
                className={styles.reflectionSection}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className={styles.reflectionText}>
                  {isTR
                    ? ritual.reflectionQuestion.tr
                    : ritual.reflectionQuestion.en}
                </p>
              </motion.div>
            )}

            <motion.div
              className={styles.completeActions}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              {ritual.sanriPrompt && (
                <button
                  className={styles.btnSanri}
                  onClick={() => {
                    const prompt = isTR ? ritual.sanriPrompt.tr : ritual.sanriPrompt.en;
                    navigate(`/sanriya-sor?prefill=${encodeURIComponent(prompt)}&domain=ritual_space&mode=mirror`, {
                      state: { skipIntro: true },
                    });
                  }}
                >
                  {isTR ? "SANRI'ya Sor →" : "Ask SANRI →"}
                </button>
              )}
              <button
                className={styles.btnPrimary}
                style={{ background: energyColor }}
                onClick={handleRestart}
              >
                {isTR ? "Tekrar Yap" : "Do Again"}
              </button>
              <button className={styles.btnSecondary} onClick={handleExit}>
                {isTR ? "Ana Sayfa" : "Home"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
