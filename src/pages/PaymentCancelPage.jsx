import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "./PaymentPages.module.css";

export default function PaymentCancelPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTR = language === "tr";

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.iconWrap}>
          <span className={styles.cancelIcon}>✕</span>
        </div>
        <h1 className={styles.title}>
          {isTR ? "Ödeme İptal Edildi" : "Payment Cancelled"}
        </h1>
        <p className={styles.subtitle}>
          {isTR
            ? "Ödeme tamamlanmadı. Hesabından herhangi bir ücret alınmadı."
            : "Payment was not completed. No charges were made to your account."}
        </p>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => navigate(-1)}>
            {isTR ? "Geri Dön" : "Go Back"}
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate("/")}>
            {isTR ? "Ana Sayfa" : "Home"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
