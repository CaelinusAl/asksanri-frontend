import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./RitualDetailPage.module.css";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import {
  getRitualById,
  RITUAL_CATEGORIES,
  isFavorite,
  toggleFavorite,
  getChakrasForRitual,
} from "../data/ritualData";
import { anadoluCities } from "../data/anadoluCities";

const ENERGY_COLORS = {
  grounding: "#48BB78",
  release: "#9F7AEA",
  heart: "#ED64A6",
  clarity: "#4299E1",
  abundance: "#ECC94B",
  shadow: "#718096",
};

const DIFFICULTY_MAP = {
  easy: { tr: "Kolay", en: "Easy" },
  medium: { tr: "Orta", en: "Medium" },
  deep: { tr: "Derin", en: "Deep" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function RitualDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const ritual = getRitualById(id);
  const [fav, setFav] = useState(() => (ritual ? isFavorite(ritual.id) : false));
  const [stepsOpen, setStepsOpen] = useState(false);

  const handleToggleFav = useCallback(() => {
    if (!ritual) return;
    unlockAudio();
    toggleFavorite(ritual.id);
    setFav(isFavorite(ritual.id));
  }, [ritual]);

  const handleStart = useCallback(() => {
    if (!ritual) return;
    unlockAudio();
    navigate(`/rituel-alani/${ritual.id}/session`);
  }, [ritual, navigate]);

  const handleDeepen = useCallback(() => {
    if (!ritual) return;
    const prompt = isTR ? ritual.sanriPrompt?.tr : ritual.sanriPrompt?.en;
    const q = encodeURIComponent(prompt || (isTR ? ritual.title.tr : ritual.title.en));
    navigate(`/sanriya-sor?prefill=${q}&domain=ritual_space&mode=mirror`, {
      state: { skipIntro: true },
    });
  }, [ritual, isTR, navigate]);

  if (!ritual) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p className={styles.notFoundText}>
            {isTR ? "Ritüel bulunamadı." : "Ritual not found."}
          </p>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => navigate("/rituel-alani")}
          >
            {isTR ? "← Ritüellere Dön" : "← Back to Rituals"}
          </button>
        </div>
      </div>
    );
  }

  const energyColor = ENERGY_COLORS[ritual.energyType] || ENERGY_COLORS.clarity;
  const steps = isTR ? ritual.steps.tr : ritual.steps.en;
  const diff = DIFFICULTY_MAP[ritual.difficulty] || DIFFICULTY_MAP.easy;
  const categoryLabels = ritual.category
    .map((catId) => {
      const cat = RITUAL_CATEGORIES.find((c) => c.id === catId);
      return cat ? { icon: cat.icon, label: isTR ? cat.label.tr : cat.label.en } : null;
    })
    .filter(Boolean);

  const linkedChakras = getChakrasForRitual(ritual);
  const linkedCities = (ritual.cityCodes || [])
    .map((code) => anadoluCities.find((c) => c.code === code))
    .filter(Boolean);

  return (
    <div
      className={styles.page}
      style={{ "--energy-color": energyColor }}
      onPointerDown={unlockAudio}
    >
      <div className={styles.topbar}>
        <span className={styles.brand}>CAELINUS AI</span>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/rituel-alani")}
        >
          {isTR ? "← Ritüeller" : "← Rituals"}
        </button>
      </div>

      <header className={styles.hero}>
        <div className={styles.heroGlow} />

        <button
          type="button"
          className={`${styles.favBtn} ${fav ? styles.favActive : ""}`}
          onClick={handleToggleFav}
          aria-label={isTR ? "Favorilere ekle" : "Toggle favorite"}
        >
          {fav ? "♥" : "♡"}
        </button>

        <motion.h1
          className={styles.heroTitle}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          {isTR ? ritual.title.tr : ritual.title.en}
        </motion.h1>

        <motion.p
          className={styles.heroSubtitle}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          {isTR ? ritual.subtitle.tr : ritual.subtitle.en}
        </motion.p>

        <motion.div
          className={styles.badges}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <span className={styles.badge}>
            {ritual.durationMin} {isTR ? "dk" : "min"}
          </span>
          <span className={styles.badge}>{isTR ? diff.tr : diff.en}</span>
          {ritual.isPremium && <span className={styles.premiumBadge}>PREMIUM</span>}
        </motion.div>
      </header>

      <div className={styles.shell}>
        <motion.p
          className={styles.description}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          {isTR ? ritual.description.tr : ritual.description.en}
        </motion.p>

        <div className={styles.infoGrid}>
          <motion.div
            className={styles.infoCard}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
          >
            <div className={styles.infoCardLabel}>
              {isTR ? "NİYET" : "INTENTION"}
            </div>
            <div className={styles.infoCardText}>
              {isTR ? ritual.intentionPrompt.tr : ritual.intentionPrompt.en}
            </div>
          </motion.div>

          <motion.div
            className={styles.infoCard}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
          >
            <div className={styles.infoCardLabel}>
              {isTR ? "YANSIMA" : "REFLECTION"}
            </div>
            <div className={styles.infoCardText}>
              {isTR ? ritual.reflectionQuestion.tr : ritual.reflectionQuestion.en}
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.categoryRow}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
        >
          {categoryLabels.map((cat, i) => (
            <span key={i} className={styles.categoryTag}>
              <span className={styles.categoryIcon}>{cat.icon}</span>
              {cat.label}
            </span>
          ))}
        </motion.div>

        {(linkedChakras.length > 0 || linkedCities.length > 0) && (
          <motion.div
            className={styles.linksSection}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={7}
          >
            {linkedChakras.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={styles.linkCard}
                style={{ borderColor: ch.color + "33" }}
                onClick={() => navigate("/frekans-alani")}
              >
                <span className={styles.linkDot} style={{ background: ch.color }} />
                <span className={styles.linkLabel}>
                  {ch.name.split("(")[0].trim()}
                </span>
                <span className={styles.linkHz}>{ch.hz} Hz</span>
              </button>
            ))}
            {linkedCities.map((city) => (
              <button
                key={city.code}
                type="button"
                className={styles.linkCard}
                onClick={() => navigate("/uyanan-sehirler")}
              >
                <span className={styles.linkDot} style={{ background: "#c8a0ff" }} />
                <span className={styles.linkLabel}>{city.city}</span>
                <span className={styles.linkHz}>{city.subtitle}</span>
              </button>
            ))}
          </motion.div>
        )}

        <motion.div
          className={styles.stepsSection}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={8}
        >
          <button
            type="button"
            className={styles.stepsToggle}
            onClick={() => setStepsOpen((o) => !o)}
          >
            <span className={styles.stepsToggleText}>
              {steps.length} {isTR ? "adım" : "steps"}
            </span>
            <span
              className={`${styles.stepsArrow} ${stepsOpen ? styles.stepsArrowOpen : ""}`}
            >
              ▾
            </span>
          </button>

          {stepsOpen && (
            <motion.ol
              className={styles.stepsList}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {steps.map((step, i) => (
                <li key={i} className={styles.stepItem}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepText}>{step.text}</span>
                  <span className={styles.stepDur}>{step.duration}s</span>
                </li>
              ))}
            </motion.ol>
          )}
        </motion.div>

        <motion.div
          className={styles.actions}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={9}
        >
          <button type="button" className={styles.startBtn} onClick={handleStart}>
            {isTR ? "BAŞLA" : "START"}
          </button>
        </motion.div>

        <motion.div
          className={styles.deepenRow}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={10}
        >
          <button type="button" className={styles.deepenLink} onClick={handleDeepen}>
            {isTR ? "SANRI ile Derinleş →" : "Go deeper with SANRI →"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
