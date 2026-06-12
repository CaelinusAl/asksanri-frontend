import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPendingPurchase,
  clearPendingPurchase,
  checkServerUnlock,
  applyVerifiedShopierUnlock,
  syncPurchasesFromServer,
} from "../data/shopierConfig";
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
  successTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#78f7d8",
    margin: "0 0 6px",
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

async function silentCheckWithFallback(contentId, email = "") {
  const ok = await checkServerUnlock(contentId, email);
  if (ok) return true;
  if (contentId.startsWith("okuma_") && contentId !== "okuma_devami") {
    return checkServerUnlock("okuma_devami", email);
  }
  return false;
}

export default function PendingPurchaseRecovery() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState(null);
  const [visible, setVisible] = useState(false);
  const [autoUnlocked, setAutoUnlocked] = useState(false);
  const stopRef = useRef(false);

  useEffect(() => {
    if (isAdminPath(location.pathname)) return undefined;
    if (location.pathname === "/odeme-basarili") return undefined;

    const p = getPendingPurchase();
    if (!p || !p.contentId) return undefined;

    /* Shopier müşteriyi ödeme sonrası buraya yönlendirmeyebilir; bu yüzden
       webhook'un satın alımı kaydetmesini periyodik olarak bekleriz.
       İlk ~20 sn sessiz kontrol; sonra hâlâ açılmadıysa manuel doğrulama
       kartını gösterir ama arka planda kontrole devam ederiz (~3 dk). */
    stopRef.current = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 36;        // ~3 dk (5 sn aralık)
    const SHOW_CARD_AFTER = 4;      // ~20 sn sonra manuel kart
    const email = (p.email && String(p.email).includes("@")) ? p.email : "";

    const finishUnlocked = () => {
      applyVerifiedShopierUnlock(p.contentId, new Date().toISOString());
      syncPurchasesFromServer({ email });
      clearPendingPurchase();
      setAutoUnlocked(true);
      setPending(p);
      setVisible(true);

      const target =
        p.returnPath && p.returnPath !== "/" ? p.returnPath : "";
      if (target && location.pathname !== target) {
        setTimeout(() => {
          if (!stopRef.current) navigate(target, { replace: true });
        }, 1500);
      }
      setTimeout(() => {
        setVisible(false);
        setPending(null);
      }, 6000);
    };

    const poll = async () => {
      if (stopRef.current) return;
      attempts += 1;
      let unlocked = false;
      try {
        unlocked = await silentCheckWithFallback(p.contentId, email);
      } catch {
        unlocked = false;
      }
      if (stopRef.current) return;

      if (unlocked) {
        finishUnlocked();
        return;
      }

      if (attempts === SHOW_CARD_AFTER) {
        setPending(p);
        setVisible(true);
      }

      if (attempts < MAX_ATTEMPTS) {
        const delay =
          typeof document !== "undefined" &&
          document.visibilityState === "hidden"
            ? 8000
            : 5000;
        setTimeout(poll, delay);
      }
    };

    poll();

    return () => {
      stopRef.current = true;
    };
  }, [location.pathname, navigate]);

  const goVerify = useCallback(() => {
    if (!pending) return;
    const ref = encodeURIComponent(pending.returnPath || "/");
    navigate(
      `/odeme-basarili?content=${encodeURIComponent(pending.contentId)}&ref=${ref}`
    );
  }, [pending, navigate]);

  const goBack = useCallback(() => {
    if (pending?.returnPath) {
      navigate(pending.returnPath, { replace: true });
    } else {
      window.location.reload();
    }
  }, [pending, navigate]);

  const handleCancel = useCallback(() => {
    stopRef.current = true;
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
            {autoUnlocked ? (
              <>
                <div style={STYLE.glyph}>{"✓"}</div>
                <p style={STYLE.successTitle}>{"Ödeme doğrulandı!"}</p>
                <p style={STYLE.desc}>
                  {"İçeriğin açıldı. Okumaya devam edebilirsin."}
                </p>
                <div style={STYLE.btnRow}>
                  <button type="button" style={STYLE.primaryBtn} onClick={goBack}>
                    {"Okumaya dön"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={STYLE.glyph}>{"✦"}</div>
                <p style={STYLE.title}>{"Yarım kalan ödeme"}</p>
                <p style={STYLE.desc}>
                  {"Ödeme sayfasından döndüysen doğrulama ekranına git. İçerik sunucuda doğrulandıktan sonra açılır."}
                </p>
                <div style={STYLE.btnRow}>
                  <button type="button" style={STYLE.primaryBtn} onClick={goVerify}>
                    {"Erişimi doğrula"}
                  </button>
                  <button type="button" style={STYLE.cancelBtn} onClick={handleCancel}>
                    {"Kapat"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
