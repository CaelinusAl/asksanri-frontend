import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPendingPurchase,
  clearPendingPurchase,
  unlockViaShopier,
} from "../data/shopierConfig";
import styles from "./PaymentPages.module.css";

export default function OdemeBasariliPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [phase, setPhase] = useState("void");
  const startedRef = useRef(false);

  const contentId = params.get("content") || null;
  const returnPath = params.get("ref") || "/";

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const pending = getPendingPurchase();
    const target = contentId || pending?.contentId || null;

    if (target) {
      unlockViaShopier(target);
    } else {
      unlockViaShopier("premium");
    }
    clearPendingPurchase();

    setPhase("glow");
    const t1 = setTimeout(() => setPhase("kapi"), 1000);
    const t2 = setTimeout(() => setPhase("devam"), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [contentId]);

  const finalPath = returnPath && returnPath !== "/" ? decodeURIComponent(returnPath) : "/";

  return (
    <div className={styles.ritualPage}>
      <div
        className={`${styles.ritualGlow} ${
          phase !== "void" ? styles.ritualGlowActive : ""
        }`}
      />

      <AnimatePresence mode="wait">
        {phase === "void" && (
          <motion.div
            key="void"
            className={styles.ritualCenter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.voidPulse}>
              <span className={styles.voidGlyph}>◈</span>
            </div>
            <p className={styles.voidText}>Doğrulanıyor...</p>
          </motion.div>
        )}

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

        {phase === "kapi" && (
          <motion.div
            key="kapi"
            className={styles.ritualCenter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h1 className={styles.ritualTitle}>Kapı açıldı.</h1>
            <p
              style={{
                marginTop: 14,
                color: "rgba(200,160,255,0.55)",
                fontSize: 15,
                letterSpacing: "0.04em",
              }}
            >
              Artık görüyorsun.
            </p>
          </motion.div>
        )}

        {phase === "devam" && (
          <motion.div
            key="devam"
            className={styles.ritualCenter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ fontSize: 28, color: "rgba(120,247,216,0.6)", marginBottom: 20 }}>
              ✦
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 5vw, 36px)",
                fontWeight: 300,
                color: "#e8e4f4",
                margin: "0 0 10px",
                letterSpacing: "0.03em",
              }}
            >
              Kapı açıldı. Artık görüyorsun.
            </h2>
            <p
              style={{
                color: "rgba(200,160,255,0.5)",
                fontSize: 14,
                margin: "0 0 32px",
              }}
            >
              İçerik artık sana açık.
            </p>
            <button
              onClick={() => navigate(finalPath, { replace: true })}
              style={{
                padding: "15px 40px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #c8a0ff, #7cf7d8)",
                color: "#07080d",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            >
              Devam Et
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
