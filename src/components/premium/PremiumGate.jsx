import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { usePremium } from "../../contexts/PremiumContext";
import styles from "./PremiumGate.module.css";

export function PremiumGate({ locked, children, title, description }) {
  const { language } = useLanguage();
  const { showUpgradeModal } = usePremium();
  const isTR = language === "tr";

  if (!locked) return <>{children}</>;

  return (
    <div className={`${styles.wrap} ${styles.locked}`}>
      <div className={styles.blurLayer}>{children}</div>
      <div className={styles.gradient} />
      <div className={styles.overlay}>
        <div className={styles.lockIcon}>🔒</div>
        <div className={styles.lockTitle}>
          {title || (isTR ? "Bu katman premium" : "This layer is premium")}
        </div>
        <div className={styles.lockDesc}>
          {description || (isTR
            ? "Devamını okumak ve tüm içeriğe erişmek için Premium'a geç."
            : "Upgrade to Premium to read the full content.")}
        </div>
        <button className={styles.unlockBtn} onClick={() => showUpgradeModal()}>
          {isTR ? "Kilidi Aç" : "Unlock"}
        </button>
      </div>
    </div>
  );
}

export function LockBadge() {
  return <span className={styles.lockBadge}>🔒</span>;
}

export default PremiumGate;
