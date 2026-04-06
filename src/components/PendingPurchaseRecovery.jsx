import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getPendingPurchase, clearPendingPurchase } from "../data/shopierConfig";
import { isAdminPath } from "../utils/adminPath";

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
    flexWrap: "wrap",
  },
  primaryBtn: {
    flex: 1,
    minWidth: 160,
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
    minWidth: 120,
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
    if (isAdminPath(location.pathname)) return;
    if (location.pathname === "/odeme-basarili") return;

    const p = getPendingPurchase();
    if (p && p.contentId) {
      setPending(p);
      const delay = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(delay);
    }
  }, [location.pathname]);

  const goVerify = useCallback(() => {
    if (!pending) return;
    const ref = encodeURIComponent(pending.returnPath || "/");
    navigate(
      `/odeme-basarili?content=${encodeURIComponent(pending.contentId)}&ref=${ref}`
    );
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
            <p style={STYLE.title}>Yarım kalan ödeme</p>
            <p style={STYLE.desc}>
              Erişim yalnızca ödeme sunucuda doğrulandıktan sonra açılır. Ödeme sayfasından döndüysen doğrulama
              ekranına git.
            </p>
            <div style={STYLE.btnRow}>
              <button type="button" style={STYLE.primaryBtn} onClick={goVerify}>
                Erişimi doğrula
              </button>
              <button type="button" style={STYLE.cancelBtn} onClick={handleCancel}>
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
