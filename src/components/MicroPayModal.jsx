import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePremium } from "../contexts/PremiumContext";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "./MicroPayModal.module.css";

const PRODUCT_KEY_MAP = {
  single_okuma: "single_read_unlock",
  single_book: "single_book_unlock",
  single_ritual: "single_ritual_unlock",
  weekly_pass: "weekly_pass",
  premium_monthly: "premium_monthly",
  premium_yearly: "premium_yearly",
};

const CONTENT_TYPE_FROM_MICRO = {
  single_okuma: "okuma",
  single_book: "book",
  single_ritual: "ritual",
};

export default function MicroPayModal() {
  const {
    microPayOpen,
    microPayContentId,
    microPayContentType,
    hideMicroPayModal,
    startCheckout,
    hasFreeUnlock,
    claimFreeUnlock,
    pricingOptions,
  } = usePremium();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [freeSuccess, setFreeSuccess] = useState(false);

  const singleOptions = pricingOptions.filter((p) => p.id === microPayContentType || p.type === "single");
  const passOptions = pricingOptions.filter((p) => p.type === "pass");
  const subOptions = pricingOptions.filter((p) => p.type === "subscription");

  const handleFreeUnlock = async () => {
    if (processing) return;
    setProcessing(true);
    setError(null);
    try {
      const contentType = CONTENT_TYPE_FROM_MICRO[microPayContentType] || "okuma";
      await claimFreeUnlock(microPayContentId, contentType);
      setFreeSuccess(true);
      setTimeout(() => {
        hideMicroPayModal();
        setFreeSuccess(false);
        setProcessing(false);
      }, 1800);
    } catch (err) {
      setError(err.message || (isTR ? "Bir hata oluştu." : "An error occurred."));
      setProcessing(false);
    }
  };

  const handlePurchase = async () => {
    if (!selected || processing) return;
    setProcessing(true);
    setError(null);
    try {
      const productKey = PRODUCT_KEY_MAP[selected.id] || selected.id;
      await startCheckout(productKey, microPayContentId);
    } catch (err) {
      setError(err.message || (isTR ? "Bir hata oluştu." : "An error occurred."));
      setProcessing(false);
    }
  };

  const handleClose = () => {
    if (processing) return;
    hideMicroPayModal();
    setSelected(null);
    setError(null);
    setFreeSuccess(false);
  };

  return (
    <AnimatePresence>
      {microPayOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* FREE SUCCESS */}
            {freeSuccess && (
              <motion.div
                className={styles.freeSuccessWrap}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={styles.freeSuccessGlyph}>✦</div>
                <p className={styles.freeSuccessText}>
                  {isTR ? "İlk kapın açıldı." : "Your first door is open."}
                </p>
              </motion.div>
            )}

            {!freeSuccess && (
              <>
                <div className={styles.header}>
                  <span className={styles.glyph}>✦</span>
                  <div>
                    <h2 className={styles.title}>
                      {isTR ? "İçerik Aç" : "Unlock Content"}
                    </h2>
                    <p className={styles.subtitle}>
                      {isTR
                        ? "Tek seferlik veya tam erişim seçenekleri"
                        : "One-time or full access options"}
                    </p>
                  </div>
                  <button className={styles.closeBtn} onClick={handleClose}>✕</button>
                </div>

                {error && (
                  <div className={styles.errorBar}>
                    <span>⚠</span> {error}
                  </div>
                )}

                {/* FREE UNLOCK */}
                {hasFreeUnlock && microPayContentId && (
                  <div className={styles.freeSection}>
                    <div className={styles.freeCard}>
                      <div className={styles.freeCardInner}>
                        <span className={styles.freeGlyph}>◈</span>
                        <div className={styles.freeInfo}>
                          <span className={styles.freeLabel}>
                            {isTR ? "İlk İçerik Hediye" : "First Content Free"}
                          </span>
                          <span className={styles.freeHint}>
                            {isTR
                              ? "Bir kerelik — ilk adımın bizden."
                              : "One-time gift — your first step is on us."}
                          </span>
                        </div>
                        <span className={styles.freePrice}>
                          {isTR ? "Ücretsiz" : "Free"}
                        </span>
                      </div>
                      <button
                        className={styles.freeBtn}
                        onClick={handleFreeUnlock}
                        disabled={processing}
                      >
                        {processing
                          ? (isTR ? "Açılıyor..." : "Opening...")
                          : (isTR ? "Bu İçeriği Ücretsiz Aç" : "Unlock This for Free")}
                      </button>
                    </div>
                    <div className={styles.freeDivider}>
                      <span className={styles.freeDividerLine} />
                      <span className={styles.freeDividerText}>
                        {isTR ? "veya" : "or"}
                      </span>
                      <span className={styles.freeDividerLine} />
                    </div>
                  </div>
                )}

                {/* SINGLE */}
                <div className={styles.section}>
                  <span className={styles.sectionLabel}>
                    {isTR ? "◇ Tek İçerik Aç" : "◇ Unlock Single"}
                  </span>
                  <div className={styles.options}>
                    {singleOptions.map((opt) => (
                      <button
                        key={opt.id}
                        className={`${styles.optionCard} ${selected?.id === opt.id ? styles.optionSelected : ""}`}
                        onClick={() => setSelected(opt)}
                      >
                        <span className={styles.optionLabel}>{opt.label}</span>
                        <span className={styles.optionPrice}>
                          {opt.currency}{opt.price.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* WEEKLY PASS */}
                {passOptions.length > 0 && (
                  <div className={styles.section}>
                    <span className={styles.sectionLabel}>
                      {isTR ? "◈ Haftalık Geçiş" : "◈ Weekly Pass"}
                    </span>
                    <div className={styles.options}>
                      {passOptions.map((opt) => (
                        <button
                          key={opt.id}
                          className={`${styles.optionCard} ${styles.optionPass} ${selected?.id === opt.id ? styles.optionSelected : ""}`}
                          onClick={() => setSelected(opt)}
                        >
                          <span className={styles.optionLabel}>{opt.label}</span>
                          <span className={styles.optionPrice}>
                            {opt.currency}{opt.price.toFixed(2)}
                          </span>
                          <span className={styles.optionHint}>
                            {isTR ? "7 gün tüm içeriklere erişim" : "7-day access to all content"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PREMIUM */}
                <div className={styles.section}>
                  <span className={styles.sectionLabel}>
                    {isTR ? "★ Tam Premium" : "★ Full Premium"}
                  </span>
                  <div className={styles.options}>
                    {subOptions.map((opt) => (
                      <button
                        key={opt.id}
                        className={`${styles.optionCard} ${styles.optionPremium} ${selected?.id === opt.id ? styles.optionSelected : ""}`}
                        onClick={() => setSelected(opt)}
                      >
                        {opt.badge && <span className={styles.optionBadge}>{opt.badge}</span>}
                        <span className={styles.optionLabel}>{opt.label}</span>
                        <span className={styles.optionPrice}>
                          {opt.currency}{opt.price.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.securityNote}>
                  <span>🔒</span>
                  <span>
                    {isTR
                      ? "Ödeme Stripe üzerinden güvenli şekilde işlenir. Kart bilgileri sunucularımızda saklanmaz."
                      : "Payment is securely processed via Stripe. Card info is never stored on our servers."}
                  </span>
                </div>

                <button
                  className={styles.purchaseBtn}
                  disabled={!selected || processing}
                  onClick={handlePurchase}
                >
                  {processing
                    ? (isTR ? "Stripe'a yönlendiriliyorsunuz..." : "Redirecting to Stripe...")
                    : selected
                      ? `${isTR ? "Satın Al" : "Purchase"} — ${selected.currency}${selected.price.toFixed(2)}`
                      : (isTR ? "Seçim yapın" : "Select an option")}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
