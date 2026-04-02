import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPendingPurchase,
  clearPendingPurchase,
  unlockViaShopier,
  syncPurchasesFromServer,
} from "../data/shopierConfig";

const STYLE = {
  backdrop: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
    display: "flex",
    justifyContent: "center",
    padding: "16px",
    pointerEvents: "none",
  },
  card: {
    maxWidth: 420,
    width: "100%",
    padding: "24px 24px 20px",
    borderRadius: 20,
    background: "linear-gradient(170deg, rgba(20,18,30,0.98), rgba(10,10,16,0.96))",
    border: "1px solid rgba(200,160,255,0.2)",
    boxShadow: "0 -4px 60px rgba(200,160,255,0.12), 0 0 120px rgba(0,0,0,0.6)",
    textAlign: "center",
    pointerEvents: "auto",
  },
  glyph: {
    fontSize: 24,
    color: "rgba(120,247,216,0.6)",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: "#e8e4f4",
    margin: "0 0 6px",
  },
  desc: {
    fontSize: 13,
    color: "rgba(200,160,255,0.5)",
    margin: "0 0 20px",
    lineHeight: 1.6,
  },
  btnRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  confirmBtn: {
    flex: 1,
    padding: "14px 20px",
    borderRadius: 12,
    border: "1px solid rgba(120,247,216,0.3)",
    background: "rgba(120,247,216,0.1)",
    color: "#7cf7d8",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s",
  },
  cancelBtn: {
    flex: 1,
    padding: "14px 20px",
    borderRadius: 12,
    border: "1px solid rgba(200,160,255,0.15)",
    background: "rgba(200,160,255,0.04)",
    color: "rgba(200,160,255,0.5)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.25s",
  },
};

export default function PendingPurchaseRecovery() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    syncPurchasesFromServer();

    if (location.pathname === "/odeme-basarili") return;

    const p = getPendingPurchase();
    if (p && p.contentId) {
      setPending(p);
      const delay = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(delay);
    }
  }, [location.pathname]);

  const handleConfirm = useCallback(() => {
    if (!pending) return;
    unlockViaShopier(pending.contentId);
    clearPendingPurchase();
    setVisible(false);
    setPending(null);

    const returnPath = pending.returnPath || "/";
    navigate(returnPath, { replace: true });
  }, [pending, navigate]);

  const handleCancel = useCallback(() => {
    clearPendingPurchase();
    setVisible(false);
    setPending(null);
  }, []);

  return (
    <AnimatePresence>
      {visible && pending && (
        <div style={STYLE.backdrop}>
          <motion.div
            style={STYLE.card}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div style={STYLE.glyph}>✦</div>
            <p style={STYLE.title}>Bekleyen bir satın alımın var</p>
            <p style={STYLE.desc}>
              Ödemen tamamlandı mı? Tamamlandıysa içeriğini hemen açalım.
            </p>
            <div style={STYLE.btnRow}>
              <button
                style={STYLE.confirmBtn}
                onClick={handleConfirm}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(120,247,216,0.18)";
                  e.target.style.boxShadow = "0 0 30px rgba(120,247,216,0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(120,247,216,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Evet, satın aldım
              </button>
              <button
                style={STYLE.cancelBtn}
                onClick={handleCancel}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(200,160,255,0.08)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(200,160,255,0.04)";
                }}
              >
                Hayır
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
