import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./RituelAlaniPage.module.css";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import {
  rituals,
  RITUAL_CATEGORIES,
  getTodayRitual,
  getFeaturedRituals,
  getRecentRitualIds,
  getRitualById,
  getRitualsByCategory,
  getFreeRituals,
  getPremiumRituals,
  suggestRitualsByIntention,
  getChakrasForRitual,
} from "../data/ritualData";
import { chakraData } from "../data/chakraData";

const DIFFICULTY_COLORS = {
  easy: "#48BB78",
  medium: "#ED8936",
  deep: "#E53E3E",
};

const DIFFICULTY_LABELS = {
  easy: { tr: "Kolay", en: "Easy" },
  medium: { tr: "Orta", en: "Medium" },
  deep: { tr: "Derin", en: "Deep" },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" },
  }),
};

export default function RituelAlaniPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [activeCategory, setActiveCategory] = useState(null);
  const [intentionText, setIntentionText] = useState("");

  const todayRitual = useMemo(() => getTodayRitual(), []);
  const recentIds = useMemo(() => getRecentRitualIds(), []);
  const recentRituals = useMemo(
    () => recentIds.map((id) => getRitualById(id)).filter(Boolean),
    [recentIds]
  );

  const intentionSuggestions = useMemo(
    () => suggestRitualsByIntention(intentionText),
    [intentionText]
  );

  const filteredRituals = useMemo(() => {
    if (intentionSuggestions.length > 0) return intentionSuggestions;
    if (!activeCategory) return rituals;
    return getRitualsByCategory(activeCategory);
  }, [activeCategory, intentionSuggestions]);

  const goBack = useCallback(() => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  }, [navigate]);

  const openRitual = useCallback(
    (id) => {
      unlockAudio();
      navigate("/rituel-alani/" + id);
    },
    [navigate]
  );

  const catLabel = useCallback(
    (cat) => (isTR ? cat.label.tr : cat.label.en),
    [isTR]
  );

  return (
    <div
      className={styles.page}
      onPointerDown={unlockAudio}
      onTouchStart={unlockAudio}
    >
      {/* ─── Top bar ─── */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.topbarSub}>
            {isTR ? "Ritüel Alanı" : "Ritual Space"}
          </span>
        </div>
        <div className={styles.topbarRight}>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
          >
            {isTR ? "EN" : "TR"}
          </button>
          <button type="button" className={styles.backBtn} onClick={goBack}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {isTR ? "Ritüel Alanı" : "Ritual Space"}
        </motion.h1>
        <motion.p
          className={styles.heroSub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {isTR
            ? "Nefes, niyet ve farkındalıkla kendi ritüelini oluştur. Her adım seni içine döndürür."
            : "Create your own ritual with breath, intention and awareness. Every step turns you inward."}
        </motion.p>

        <motion.div
          className={styles.intentionWrap}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
        >
          <input
            type="text"
            className={styles.intentionInput}
            placeholder={isTR ? "Niyetin ne?" : "What is your intention?"}
            value={intentionText}
            onChange={(e) => setIntentionText(e.target.value)}
          />
        </motion.div>
      </section>

      {/* ─── Today's Ritual ─── */}
      {todayRitual && (
        <section className={styles.todaySection}>
          <h2 className={styles.sectionTitle}>
            {isTR ? "Bugünün Ritüeli" : "Today's Ritual"}
          </h2>

          <motion.div
            className={styles.todayCard}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.todayContent}>
              <span className={styles.todayCategory}>
                {todayRitual.category[0] &&
                  (isTR
                    ? RITUAL_CATEGORIES.find(
                        (c) => c.id === todayRitual.category[0]
                      )?.label.tr
                    : RITUAL_CATEGORIES.find(
                        (c) => c.id === todayRitual.category[0]
                      )?.label.en)}
              </span>
              <h3 className={styles.todayTitle}>
                {isTR ? todayRitual.title.tr : todayRitual.title.en}
              </h3>
              <p className={styles.todaySubtitle}>
                {isTR ? todayRitual.subtitle.tr : todayRitual.subtitle.en}
              </p>
              <p className={styles.todayDesc}>
                {isTR
                  ? todayRitual.description.tr
                  : todayRitual.description.en}
              </p>
              <div className={styles.todayMeta}>
                <span className={styles.durationBadge}>
                  {todayRitual.durationMin} {isTR ? "dk" : "min"}
                </span>
                <span
                  className={styles.difficultyPill}
                  style={{
                    background:
                      DIFFICULTY_COLORS[todayRitual.difficulty] + "22",
                    color: DIFFICULTY_COLORS[todayRitual.difficulty],
                  }}
                >
                  {isTR
                    ? DIFFICULTY_LABELS[todayRitual.difficulty]?.tr
                    : DIFFICULTY_LABELS[todayRitual.difficulty]?.en}
                </span>
              </div>
            </div>
            <button
              type="button"
              className={styles.todayBtn}
              onClick={() => openRitual(todayRitual.id)}
            >
              {isTR ? "Başla" : "Start"}
            </button>
          </motion.div>
        </section>
      )}

      {/* ─── Category chips ─── */}
      <section className={styles.categorySection}>
        <div className={styles.categoryScroll}>
          <button
            type="button"
            className={`${styles.categoryChip} ${
              activeCategory === null ? styles.chipActive : ""
            }`}
            onClick={() => setActiveCategory(null)}
          >
            {isTR ? "Tümü" : "All"}
          </button>
          {RITUAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.categoryChip} ${
                activeCategory === cat.id ? styles.chipActive : ""
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className={styles.chipIcon}>{cat.icon}</span>
              {catLabel(cat)}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Ritual grid ─── */}
      <section className={styles.gridSection}>
        {intentionSuggestions.length > 0 && (
          <p className={styles.suggestionHint}>
            {isTR
              ? `"${intentionText}" için önerilen ritüeller:`
              : `Suggested rituals for "${intentionText}":`}
          </p>
        )}

        <div className={styles.grid}>
          {filteredRituals.map((r, i) => {
            const title = isTR ? r.title.tr : r.title.en;
            const subtitle = isTR ? r.subtitle.tr : r.subtitle.en;
            const catObj = RITUAL_CATEGORIES.find(
              (c) => c.id === r.category[0]
            );
            const catName = catObj
              ? isTR
                ? catObj.label.tr
                : catObj.label.en
              : "";

            const linkedChakras = getChakrasForRitual(r);

            return (
              <motion.div
                key={r.id}
                className={styles.card}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                onClick={() => openRitual(r.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openRitual(r.id);
                }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardCategory}>{catName}</span>
                  {r.isPremium && (
                    <span className={styles.lockIcon} title="Premium">
                      🔒
                    </span>
                  )}
                </div>

                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardSubtitle}>{subtitle}</p>

                {linkedChakras.length > 0 && (
                  <div className={styles.linkChips}>
                    {linkedChakras.map((ch) => (
                      <span
                        key={ch.id}
                        className={styles.linkChip}
                        style={{ borderColor: ch.color + "44", color: ch.color }}
                      >
                        ⚡ {ch.name.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.cardMeta}>
                  <span className={styles.durationBadge}>
                    {r.durationMin} {isTR ? "dk" : "min"}
                  </span>
                  <span
                    className={styles.difficultyPill}
                    style={{
                      background: DIFFICULTY_COLORS[r.difficulty] + "22",
                      color: DIFFICULTY_COLORS[r.difficulty],
                    }}
                  >
                    {isTR
                      ? DIFFICULTY_LABELS[r.difficulty]?.tr
                      : DIFFICULTY_LABELS[r.difficulty]?.en}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredRituals.length === 0 && (
          <p className={styles.emptyMsg}>
            {isTR
              ? "Bu kategoride ritüel bulunamadı."
              : "No rituals found in this category."}
          </p>
        )}
      </section>

      {/* ─── Recent rituals ─── */}
      <section className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>
          {isTR ? "Son Yaptıkların" : "Your Recent Rituals"}
        </h2>

        {recentRituals.length > 0 ? (
          <div className={styles.recentGrid}>
            {recentRituals.map((r, i) => {
              const title = isTR ? r.title.tr : r.title.en;
              const subtitle = isTR ? r.subtitle.tr : r.subtitle.en;
              return (
                <motion.div
                  key={r.id}
                  className={styles.recentCard}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  onClick={() => openRitual(r.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openRitual(r.id);
                  }}
                >
                  <h4 className={styles.recentTitle}>{title}</h4>
                  <p className={styles.recentSub}>{subtitle}</p>
                  <span className={styles.durationBadge}>
                    {r.durationMin} {isTR ? "dk" : "min"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className={styles.emptyMsg}>
            {isTR
              ? "Henüz bir ritüel yapmadın. Yukarıdan birini seç ve başla."
              : "You haven't done any rituals yet. Pick one above and begin."}
          </p>
        )}
      </section>

      <footer className={styles.footer}>
        <span>© 2026 CaelinusAI · SANRI</span>
      </footer>
    </div>
  );
}
