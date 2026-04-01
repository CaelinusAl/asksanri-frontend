import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { fetchMyAccess } from "../data/billingApi";
import styles from "./PaymentPages.module.css";

const MAX_POLLS = 14;
const POLL_INTERVAL = 2500;

const PHASE_TIMINGS = {
  voidToGlow: 800,
  glowToText: 1200,
  textToLine: 1800,
  lineToTransition: 3200,
  transitionToRedirect: 5500,
};

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { language } = useLanguage();
  const { onPaymentSuccess } = usePremium();
  const isTR = language === "tr";

  const [verified, setVerified] = useState(false);
  const [phase, setPhase] = useState("void");
  const pollRef = useRef(0);
  const startedRef = useRef(false);

  const poll = useCallback(async () => {
    try {
      const access = await fetchMyAccess();
      const has = access.is_premium || (access.unlocked_content_ids?.length > 0);
      if (has) {
        await onPaymentSuccess();
        return true;
      }
    } catch { /* retry */ }
    return false;
  }, [onPaymentSuccess]);

  useEffect(() => {
    let timer;
    const run = async () => {
      const ok = await poll();
      if (ok) { setVerified(true); return; }
      pollRef.current += 1;
      if (pollRef.current >= MAX_POLLS) { setVerified(true); return; }
      timer = setTimeout(run, POLL_INTERVAL);
    };
    const init = setTimeout(run, 1200);
    return () => { clearTimeout(init); clearTimeout(timer); };
  }, [poll]);

  useEffect(() => {
    if (!verified || startedRef.current) return;
    startedRef.current = true;

    setPhase("glow");
    const t1 = setTimeout(() => setPhase("kapi"), PHASE_TIMINGS.voidToGlow);
    const t2 = setTimeout(() => setPhase("aitsin"), PHASE_TIMINGS.glowToText);
    const t3 = setTimeout(() => setPhase("transition"), PHASE_TIMINGS.textToLine);
    const t4 = setTimeout(() => navigate("/"), PHASE_TIMINGS.transitionToRedirect);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [verified, navigate]);

  return (
    <div className={styles.ritualPage}>
      <div className={`${styles.ritualGlow} ${phase !== "void" ? styles.ritualGlowActive : ""}`} />

      <AnimatePresence mode="wait">
        {/* VOID: waiting */}
        {phase === "void" && (
          <motion.div
            key="void"
            className={styles.ritualCenter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.voidPulse}>
              <span className={styles.voidGlyph}>◈</span>
            </div>
            <p className={styles.voidText}>
              {isTR ? "Doğrulanıyor..." : "Verifying..."}
            </p>
          </motion.div>
        )}

        {/* GLOW: light expands */}
        {phase === "glow" && (
          <motion.div
            key="glow"
            className={styles.ritualCenter}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className={styles.glowOrb} />
          </motion.div>
        )}

        {/* KAPI AÇILDI */}
        {phase === "kapi" && (
          <motion.div
            key="kapi"
            className={styles.ritualCenter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h1 className={styles.ritualTitle}>
              {isTR ? "Kapı açıldı." : "The door has opened."}
            </h1>
          </motion.div>
        )}

        {/* ARTIK BU KATMANA AİTSİN */}
        {phase === "aitsin" && (
          <motion.div
            key="aitsin"
            className={styles.ritualCenter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <p className={styles.ritualLine}>
              {isTR ? "Artık bu katmana aitsin." : "You now belong to this layer."}
            </p>
          </motion.div>
        )}

        {/* TRANSITION */}
        {phase === "transition" && (
          <motion.div
            key="transition"
            className={styles.ritualCenter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.transitionGlyph}>✦</div>
            <p className={styles.transitionText}>
              {isTR ? "İçeriklerin seni bekliyor..." : "Your content awaits..."}
            </p>
            <div className={styles.transitionBar}>
              <div className={styles.transitionFill} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
