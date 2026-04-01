import React from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { usePremium } from "../../contexts/PremiumContext";
import { redirectToShopier } from "../../data/shopierConfig";
import styles from "./PremiumGate.module.css";

export function PremiumGate({ locked, children, title, description, contentId, shopierProduct }) {
  const { language } = useLanguage();
  const { showUpgradeModal } = usePremium();
  const location = useLocation();
  const isTR = language === "tr";

  if (!locked) return <>{children}</>;

  const handleShopier = () => {
    redirectToShopier(
      shopierProduct || "single_okuma",
      contentId || "premium",
      location.pathname
    );
  };

  return (
    <div className={`${styles.wrap} ${styles.locked}`}>
      <div className={styles.blurLayer}>{children}</div>
      <div className={styles.gradient} />
      <div className={styles.overlay}>
        <div className={styles.lockIcon}>🔒</div>
        <div className={styles.lockTitle}>
          {title || (isTR
            ? "Bu katman açıldığında hikaye değişir"
            : "When this layer opens, the story changes")}
        </div>
        <div className={styles.lockDesc}>
          {description || (isTR
            ? "Devamını okumak ve tüm içeriğe erişmek için satın al."
            : "Purchase to read the full content.")}
        </div>
        <button className={styles.shopierBtn} onClick={handleShopier}>
          {isTR ? "Satın Al ve Aç" : "Purchase & Unlock"}
        </button>
        <button className={styles.altBtn} onClick={() => showUpgradeModal()}>
          {isTR ? "Tüm İçeriklere Eriş" : "Get Full Access"}
        </button>
      </div>
    </div>
  );
}

export function LockBadge() {
  return <span className={styles.lockBadge}>🔒</span>;
}

export default PremiumGate;
