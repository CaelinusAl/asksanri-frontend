import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPendingPurchase,
  clearPendingPurchase,
  syncPurchasesFromServer,
  resolveShopierPurchaseMeta,
  applyVerifiedShopierUnlock,
  fetchShopierPurchaseCheck,
  bindShopierPurchaseEmail,
  redirectToShopier,
  SHOPIER_PRODUCTS,
} from "../data/shopierConfig";
import { trackPurchase } from "../data/analytics";
import styles from "./PaymentPages.module.css";

function fireMetaPurchase(value) {
  const payload = { value, currency: "TRY" };
  const tryOnce = () => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Purchase", payload);
      return true;
    }
    return false;
  };
  if (tryOnce()) return;
  let attempts = 0;
  const id = window.setInterval(() => {
    if (tryOnce() || ++attempts >= 30) {
      window.clearInterval(id);
    }
  }, 100);
}

const CROSS_UNLOCK_MAP = {
  role_unlock: ["ankod_unlock", "subconscious_unlock"],
  ankod_unlock: ["role_unlock", "subconscious_unlock"],
  subconscious_unlock: ["role_unlock", "ankod_unlock"],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function OdemeBasariliPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [phase, setPhase] = useState("verifying");
  const [verifyNote, setVerifyNote] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [bindError, setBindError] = useState("");
  const startedRef = useRef(false);

  const pending = getPendingPurchase();
  const contentId = params.get("content") || pending?.contentId || null;
  const returnPath = params.get("ref") || pending?.returnPath || "/";

  const tryUnlockCross = useCallback(async (primaryId, purchasedAt) => {
    const crossIds = CROSS_UNLOCK_MAP[primaryId] || [];
    for (const cid of crossIds) {
      const r = await fetchShopierPurchaseCheck(cid);
      if (r.unlocked) {
        applyVerifiedShopierUnlock(cid, r.purchased_at || r.purchase?.purchased_at || purchasedAt);
      }
    }
  }, []);

  const runVerifiedSuccess = useCallback(
    async (target, purchasedAt, pendingSnap) => {
      applyVerifiedShopierUnlock(target, purchasedAt);
      await tryUnlockCross(target, purchasedAt);
      await syncPurchasesFromServer();
      clearPendingPurchase();

      const meta = resolveShopierPurchaseMeta(target, pendingSnap?.productId);
      const { pixelContentId, productTitle, actualPrice } = meta;
      const purchaseValue = actualPrice > 0 ? actualPrice : 9.9;
      fireMetaPurchase(purchaseValue);
      trackPurchase({
        contentId: pixelContentId,
        value: purchaseValue,
        currency: "TRY",
        productTitle,
        skipMetaPixel: true,
      });

      setPhase("glow");
      setTimeout(() => setPhase("kapi"), 1000);
      setTimeout(() => setPhase("devam"), 2200);
    },
    [tryUnlockCross]
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const pendingSnap = getPendingPurchase();
    const target = contentId || "premium";

    (async () => {
      setPhase("verifying");
      setVerifyNote("Ödeme kontrol ediliyor...");

      for (let i = 0; i < 24; i++) {
        const r = await fetchShopierPurchaseCheck(target);
        if (r.unlocked) {
          const at = r.purchased_at || r.purchase?.purchased_at;
          await runVerifiedSuccess(target, at, pendingSnap);
          return;
        }
        await sleep(2500);
        if (i === 8) {
          setVerifyNote(
            "Ödeme kaydı birkaç saniye gecikebilir. Giriş yaptıysan hesabındaki e-posta ile de aranıyor."
          );
        }
      }

      setPhase("need_email");
      setVerifyNote(
        "Ödeme doğrulanamadı. Eğer ödemeyi yeni yaptıysan kısa süre sonra tekrar dene. Ödeme kaydı bulunamadıysa Shopier’da kullandığın e-postayı girerek bu cihaza bağlayabilirsin."
      );
    })();
  }, [contentId, runVerifiedSuccess]);

  const finalPath =
    returnPath && returnPath !== "/" ? decodeURIComponent(returnPath) : "/";

  const handleBindEmail = async () => {
    const target = contentId || "premium";
    setBindError("");
    const em = emailInput.trim();
    if (!em.includes("@")) {
      setBindError("Geçerli bir e-posta gir.");
      return;
    }
    const bind = await bindShopierPurchaseEmail(em, target);
    if (!bind.ok) {
      if (bind.error === "device_mismatch") {
        setBindError("Bu satın alma başka bir cihaza bağlı görünüyor. Destek ile iletişime geç.");
      } else {
        setBindError("Bu e-posta ile eşleşen ödeme bulunamadı. E-postayı kontrol et veya birkaç dakika sonra tekrar dene.");
      }
      return;
    }
    const r = await fetchShopierPurchaseCheck(target);
    if (r.unlocked) {
      const pendingSnap = getPendingPurchase();
      await runVerifiedSuccess(target, r.purchased_at || r.purchase?.purchased_at, pendingSnap);
    } else {
      setBindError("Bağlandı ama doğrulama yanıt vermedi. Sayfayı yenile.");
    }
  };

  const handleRetryPayment = () => {
    const pendingSnap = getPendingPurchase();
    const pid = pendingSnap?.productId;
    const cid = contentId || pendingSnap?.contentId;
    if (pid && SHOPIER_PRODUCTS[pid]) {
      redirectToShopier(pid, cid, returnPath || "/");
      return;
    }
    window.location.href = "https://shopier.com/asksanri";
  };

  return (
    <div className={styles.ritualPage}>
      <div
        className={`${styles.ritualGlow} ${
          phase !== "verifying" && phase !== "need_email" ? styles.ritualGlowActive : ""
        }`}
      />

      <AnimatePresence mode="wait">
        {phase === "verifying" && (
          <motion.div
            key="verifying"
            className={styles.ritualCenter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.voidPulse}>
              <span className={styles.voidGlyph}>◈</span>
            </div>
            <p className={styles.voidText}>{verifyNote || "Ödeme kontrol ediliyor..."}</p>
          </motion.div>
        )}

        {phase === "need_email" && (
          <motion.div
            key="need_email"
            className={styles.ritualCenter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: 420, padding: "0 20px" }}
          >
            <h1 className={styles.ritualTitle} style={{ fontSize: "clamp(20px,4vw,26px)" }}>
              Ödeme henüz doğrulanamadı
            </h1>
            <p
              style={{
                marginTop: 14,
                color: "rgba(200,160,255,0.55)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {verifyNote}
            </p>
            <input
              type="email"
              placeholder="Shopier ödeme e-postası"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(200,160,255,0.2)",
                background: "rgba(255,255,255,0.04)",
                color: "#e8e4f4",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
            {bindError && (
              <p style={{ color: "#f6ad55", fontSize: 13, marginTop: 10 }}>{bindError}</p>
            )}
            <button
              type="button"
              onClick={handleBindEmail}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #c8a0ff, #a07aff)",
                color: "#07080d",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              E-postayı doğrula
            </button>
            <button
              type="button"
              onClick={handleRetryPayment}
              style={{
                marginTop: 12,
                width: "100%",
                padding: "12px 20px",
                borderRadius: 12,
                border: "1px solid rgba(200,160,255,0.25)",
                background: "transparent",
                color: "rgba(200,160,255,0.75)",
                cursor: "pointer",
              }}
            >
              Tekrar ödeme yap
            </button>
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
              Ödemen doğrulandı. İçeriğin açıldı.
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
            >
              {finalPath.includes("rol-okuma") ? "Rolünü Gör" : "Devam Et"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
