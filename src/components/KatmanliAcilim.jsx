import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToShopier, isShopierUnlocked } from "../data/shopierConfig";
import { detectThemes, getRecommendations } from "../data/katmanEngine";
import styles from "./KatmanliAcilim.module.css";

function AcilimModal({ katman, onClose }) {
  if (!katman) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <motion.div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className={styles.modalGlyph}>{katman.icon}</div>

        {katman.modalLines.map((line, i) =>
          line === "" ? (
            <div key={i} className={styles.modalDivider} />
          ) : line.startsWith("•") ? (
            <p key={i} className={styles.modalBullet}>{line}</p>
          ) : (
            <p key={i} className={styles.modalLine}>{line}</p>
          )
        )}

        <p className={styles.modalEthic}>
          Bu çalışma kesin yargı vermez. Sana bir ayna tutar.
        </p>

        <p className={styles.modalPrice}>
          {katman.price}₺ enerji değişimi
        </p>

        <button
          className={styles.modalBtn}
          onClick={() =>
            redirectToShopier(katman.productId, katman.contentId, "/rol-okuma")
          }
        >
          Kapıyı Aç
        </button>
        <button className={styles.modalClose} onClick={onClose}>
          Şimdilik kal
        </button>
      </motion.div>
    </div>
  );
}

export default function KatmanliAcilim({ analysisData, returnPath = "/rol-okuma" }) {
  const [activeModal, setActiveModal] = useState(null);
  const [revealedCount, setRevealedCount] = useState(3);

  const recommendations = useMemo(() => {
    const themes = detectThemes(analysisData);
    const unlocked = [];
    return getRecommendations(themes, unlocked);
  }, [analysisData]);

  const visibleRecs = recommendations.slice(0, revealedCount);
  const hasMore = revealedCount < recommendations.length;

  if (recommendations.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerGlyph}>◎</div>
        <h3 className={styles.headerTitle}>Katmanlar</h3>
      </div>

      <div className={styles.cards}>
        {visibleRecs.map((katman, i) => {
          const unlocked = isShopierUnlocked(katman.contentId);
          return (
            <motion.div
              key={katman.id}
              className={`${styles.card} ${unlocked ? styles.cardUnlocked : ""}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
            >
              <div className={styles.cardIcon}>{katman.icon}</div>
              <p className={styles.cardQuestion}>{katman.question}</p>
              <p className={styles.cardTeaser}>{katman.teaser}</p>

              {unlocked ? (
                <div className={styles.cardUnlockedBadge}>Açıldı ✦</div>
              ) : (
                <button
                  className={styles.cardBtn}
                  onClick={() => setActiveModal(katman)}
                >
                  {katman.cta}
                </button>
              )}

              {katman.isWeekly && (
                <span className={styles.weeklyBadge}>Haftalık</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {hasMore && (
        <motion.button
          className={styles.revealBtn}
          onClick={() => setRevealedCount((c) => c + 2)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Daha derin katmanları gör
        </motion.button>
      )}

      <AnimatePresence>
        {activeModal && (
          <AcilimModal
            katman={{ ...activeModal, returnPath }}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
