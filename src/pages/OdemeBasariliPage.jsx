import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPendingPurchase,
  clearPendingPurchase,
  unlockViaShopier,
  recordPurchaseToServer,
  syncPurchasesFromServer,
  SHOPIER_PRODUCTS,
} from "../data/shopierConfig";
import { trackPurchase } from "../data/analytics";
import styles from "./PaymentPages.module.css";

const CROSS_UNLOCK_MAP = {
  role_unlock: ["ankod_unlock", "subconscious_unlock"],
  ankod_unlock: ["role_unlock", "subconscious_unlock"],
  subconscious_unlock: ["role_unlock", "ankod_unlock"],
};

export default function OdemeBasariliPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [phase, setPhase] = useState("void");
  const startedRef = useRef(false);

  const pending = getPendingPurchase();
  const contentId = params.get("content") || pending?.contentId || null;
  const returnPath = params.get("ref") || pending?.returnPath || "/";

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const target = contentId || "premium";

    unlockViaShopier(target);

    const crossIds = CROSS_UNLOCK_MAP[target] || [];
    for (const cid of crossIds) {
      unlockViaShopier(cid);
    }

    clearPendingPurchase();
    syncPurchasesFromServer();

    const product = SHOPIER_PRODUCTS[target] || SHOPIER_PRODUCTS[pending?.productId];
    trackPurchase(target, product ? parseFloat(product.price) : 0);

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
                color: "rgba(200,160,255,0.45)",
                fontSize: 15,
                letterSpacing: "0.04em",
                fontStyle: "italic",
              }}
            >
              Ama artık geri dönüş yok.
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
            <div style={{ fontSize: 28, color: "rgba(120,247,216,0.5)", marginBottom: 24 }}>
              ✦
            </div>
            <p
              style={{
                color: "rgba(200,160,255,0.45)",
                fontSize: 15,
                margin: "0 0 8px",
                lineHeight: 1.7,
              }}
            >
              Devam ettiğinde:
            </p>
            <p
              style={{
                color: "rgba(200,160,255,0.4)",
                fontSize: 14,
                margin: "0 0 6px",
                fontStyle: "italic",
              }}
            >
              okuduğun şey değişmeyecek.
            </p>
            <h2
              style={{
                fontSize: "clamp(22px, 5vw, 32px)",
                fontWeight: 300,
                color: "#e8e4f4",
                margin: "0 0 36px",
                letterSpacing: "0.02em",
              }}
            >
              Sen değişeceksin.
            </h2>
            <button
              onClick={() => navigate(finalPath, { replace: true })}
              style={{
                padding: "16px 44px",
                borderRadius: 14,
                border: "1px solid rgba(200,160,255,0.25)",
                background: "rgba(200,160,255,0.08)",
                color: "#e0dcf0",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
                letterSpacing: "0.03em",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(200,160,255,0.16)";
                e.target.style.borderColor = "rgba(200,160,255,0.4)";
                e.target.style.boxShadow = "0 0 40px rgba(200,160,255,0.12)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(200,160,255,0.08)";
                e.target.style.borderColor = "rgba(200,160,255,0.25)";
                e.target.style.boxShadow = "none";
              }}
            >
              {finalPath.includes("rol-okuma") ? "Rolünü Gör" : "Devam Et"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
