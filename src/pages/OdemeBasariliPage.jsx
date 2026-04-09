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
  verifyPurchaseByEmail,
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
    const pendingEmail = params.get("email") || pendingSnap?.email || "";

    (async () => {
      setPhase("verifying");
      setVerifyNote("\u00D6deme kontrol ediliyor...");

      // Katman 1: Sunucu kaydini hemen kontrol et (webhook gelmis olabilir)
      const immediate = await fetchShopierPurchaseCheck(target, pendingEmail);
      if (immediate.unlocked) {
        const at = immediate.purchased_at || immediate.purchase?.purchased_at;
        await runVerifiedSuccess(target, at, pendingSnap);
        return;
      }

      // Katman 2: PAT ile Shopier API uzerinden email dogrulama
      if (pendingEmail && pendingEmail.includes("@")) {
        setVerifyNote("Shopier kayd\u0131 kontrol ediliyor...");
        const pat = await verifyPurchaseByEmail(pendingEmail, target);
        if (pat.unlocked) {
          const check = await fetchShopierPurchaseCheck(target, pendingEmail);
          const at = check.purchased_at || check.purchase?.purchased_at || new Date().toISOString();
          await runVerifiedSuccess(target, at, pendingSnap);
          return;
        }
      }

      // Katman 3: Polling (webhook gecikmeli gelebilir)
      for (let i = 0; i < 24; i++) {
        await sleep(2500);
        const r = await fetchShopierPurchaseCheck(target, pendingEmail);
        if (r.unlocked) {
          const at = r.purchased_at || r.purchase?.purchased_at;
          await runVerifiedSuccess(target, at, pendingSnap);
          return;
        }
        if (i === 4) {
          setVerifyNote("\u00D6deme kayd\u0131 birka\u00E7 saniye gecikebilir. Kontrol devam ediyor...");
        }
        if (i === 12) {
          setVerifyNote("\u00D6deme kayd\u0131 hen\u00FCz ula\u015Fmad\u0131. Biraz daha bekliyoruz...");
        }
      }

      setPhase("need_email");
      setVerifyNote(
        "\u00D6deme do\u011Frulanamad\u0131. E\u011Fer \u00F6demeyi yeni yapt\u0131ysan k\u0131sa s\u00FCre sonra tekrar dene. \u00D6deme kayd\u0131 bulunamad\u0131ysa Shopier\u2019da kulland\u0131\u011F\u0131n e-postay\u0131 girerek bu cihaza ba\u011Flayabilirsin."
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
      setBindError("Ge\u00E7erli bir e-posta gir.");
      return;
    }

    // Once PAT verify dene, sonra bind
    const pat = await verifyPurchaseByEmail(em, target);
    if (pat.unlocked) {
      const r = await fetchShopierPurchaseCheck(target, em);
      if (r.unlocked) {
        const pendingSnap = getPendingPurchase();
        await runVerifiedSuccess(target, r.purchased_at || r.purchase?.purchased_at, pendingSnap);
        return;
      }
    }

    const bind = await bindShopierPurchaseEmail(em, target);
    if (!bind.ok) {
      if (bind.error === "device_mismatch") {
        setBindError("Bu sat\u0131n alma ba\u015Fka bir cihaza ba\u011Fl\u0131 g\u00F6r\u00FCn\u00FCyor. Destek ile ileti\u015Fime ge\u00E7.");
      } else {
        setBindError("Bu e-posta ile e\u015Fle\u015Fen \u00F6deme bulunamad\u0131. E-postay\u0131 kontrol et veya birka\u00E7 dakika sonra tekrar dene.");
      }
      return;
    }
    const r = await fetchShopierPurchaseCheck(target, em);
    if (r.unlocked) {
      const pendingSnap = getPendingPurchase();
      await runVerifiedSuccess(target, r.purchased_at || r.purchase?.purchased_at, pendingSnap);
    } else {
      setBindError("Ba\u011Fland\u0131 ama do\u011Frulama yan\u0131t vermedi. Sayfay\u0131 yenile.");
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
              <span className={styles.voidGlyph}>{"\u25C8"}</span>
            </div>
            <p className={styles.voidText}>{verifyNote || "\u00D6deme kontrol ediliyor..."}</p>
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
              {"\u00D6deme hen\u00FCz do\u011Frulanamad\u0131"}
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
              placeholder="Shopier \u00F6deme e-postas\u0131"
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
              {"E-postay\u0131 do\u011Frula"}
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
              {"Tekrar \u00F6deme yap"}
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
            <h1 className={styles.ritualTitle}>{"Kap\u0131 a\u00E7\u0131ld\u0131."}</h1>
            <p
              style={{
                marginTop: 14,
                color: "rgba(200,160,255,0.45)",
                fontSize: 15,
                letterSpacing: "0.04em",
                fontStyle: "italic",
              }}
            >
              {"\u00D6demen do\u011Fruland\u0131. \u0130\u00E7eri\u011Fin a\u00E7\u0131ld\u0131."}
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
              {"\u2726"}
            </div>
            <p
              style={{
                color: "rgba(200,160,255,0.45)",
                fontSize: 15,
                margin: "0 0 8px",
                lineHeight: 1.7,
              }}
            >
              {"Devam etti\u011Finde:"}
            </p>
            <p
              style={{
                color: "rgba(200,160,255,0.4)",
                fontSize: 14,
                margin: "0 0 6px",
                fontStyle: "italic",
              }}
            >
              {"okudu\u011Fun \u015Fey de\u011Fi\u015Fmeyecek."}
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
              {"Sen de\u011Fi\u015Feceksin."}
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
              {finalPath.includes("rol-okuma") ? "Rol\u00FCn\u00FC G\u00F6r" : "Devam Et"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
