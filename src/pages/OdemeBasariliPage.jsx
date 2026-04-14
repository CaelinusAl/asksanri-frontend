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

    const alternateIds = [];
    if (target.startsWith("okuma_")) {
      alternateIds.push("okuma_devami");
      const numPart = target.replace("okuma_", "");
      if (numPart !== target) alternateIds.push(`okuma_${numPart}`);
    }
    if (target === "okuma_devami") {
    } else if (!target.startsWith("okuma_")) {
      alternateIds.push(target);
    }

    const tryAllIds = async (email) => {
      const idsToTry = [target, ...alternateIds.filter(id => id !== target)];
      for (const id of idsToTry) {
        const r = await fetchShopierPurchaseCheck(id, email);
        if (r.unlocked) {
          return { unlocked: true, id, at: r.purchased_at || r.purchase?.purchased_at };
        }
      }
      return { unlocked: false };
    };

    const tryVerifyByEmail = async (email) => {
      const idsToTry = [target, ...alternateIds.filter(id => id !== target)];
      for (const id of idsToTry) {
        const pat = await verifyPurchaseByEmail(email, id);
        if (pat.unlocked) {
          const check = await fetchShopierPurchaseCheck(id, email);
          if (check.unlocked) {
            return { unlocked: true, id, at: check.purchased_at || check.purchase?.purchased_at || new Date().toISOString() };
          }
        }
      }
      return { unlocked: false };
    };

    (async () => {
      setPhase("verifying");
      setVerifyNote("Ödeme kontrol ediliyor...");

      const immediate = await tryAllIds(pendingEmail);
      if (immediate.unlocked) {
        await runVerifiedSuccess(target, immediate.at, pendingSnap);
        return;
      }

      if (pendingEmail && pendingEmail.includes("@")) {
        setVerifyNote("Shopier kaydı kontrol ediliyor...");
        const patResult = await tryVerifyByEmail(pendingEmail);
        if (patResult.unlocked) {
          await runVerifiedSuccess(target, patResult.at, pendingSnap);
          return;
        }
      }

      for (let i = 0; i < 24; i++) {
        await sleep(2500);
        const r = await tryAllIds(pendingEmail);
        if (r.unlocked) {
          await runVerifiedSuccess(target, r.at, pendingSnap);
          return;
        }
        if (i === 4) {
          setVerifyNote("Ödeme kaydı birkaç saniye gecikebilir. Kontrol devam ediyor...");
        }
        if (i === 8) {
          setPhase("need_email");
          setVerifyNote(
            "Ödeme kaydı henüz ulaşmadı. Shopier'da kullandığın e-postanı girerek hızlıca doğrulayabilirsin."
          );
          return;
        }
      }

      setPhase("need_email");
      setVerifyNote(
        "Ödeme doğrulanamadı. Shopier'da kullandığın e-postayı girerek bu cihaza bağlayabilirsin."
      );
    })();
  }, [contentId, runVerifiedSuccess]);

  const finalPath =
    returnPath && returnPath !== "/" ? decodeURIComponent(returnPath) : "/";

  const handleBindEmail = async () => {
    const target = contentId || "premium";
    setBindError("");
    const em = emailInput.trim().toLowerCase();
    if (!em.includes("@")) {
      setBindError("Geçerli bir e-posta gir.");
      return;
    }

    const idsToTry = [target];
    if (target.startsWith("okuma_") && target !== "okuma_devami") {
      idsToTry.push("okuma_devami");
    }
    if (target === "okuma_devami") {
    }

    for (const cid of idsToTry) {
      const pat = await verifyPurchaseByEmail(em, cid);
      if (pat.unlocked) {
        const r = await fetchShopierPurchaseCheck(cid, em);
        if (r.unlocked) {
          const pendingSnap = getPendingPurchase();
          await runVerifiedSuccess(target, r.purchased_at || r.purchase?.purchased_at, pendingSnap);
          return;
        }
      }
    }

    for (const cid of idsToTry) {
      const bind = await bindShopierPurchaseEmail(em, cid);
      if (bind.ok) {
        const r = await fetchShopierPurchaseCheck(cid, em);
        if (r.unlocked) {
          const pendingSnap = getPendingPurchase();
          await runVerifiedSuccess(target, r.purchased_at || r.purchase?.purchased_at, pendingSnap);
          return;
        }
        setBindError("Bağlandı ama doğrulama yanıt vermedi. Sayfayı yenile veya birkaç dakika bekle.");
        return;
      }
      if (bind.error === "device_mismatch") {
        setBindError("Bu satın alma başka bir cihaza bağlı görünüyor. Destek ile iletişime geç.");
        return;
      }
    }

    setBindError(
      "Bu e-posta ile eşleşen ödeme henüz bulunamadı.\n\n" +
      "• Shopier ödeme e-postanı doğru girdiğinden emin ol\n" +
      "• Ödeme birkaç dakika gecikebilir — 2-3 dk sonra tekrar dene\n" +
      "• Sorun devam ederse: destek@asksanri.com"
    );
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
              {"Ödeme henüz doğrulanamadı"}
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

            <div style={{
              marginTop: 20,
              padding: "16px",
              background: "rgba(200,160,255,0.04)",
              border: "1px solid rgba(200,160,255,0.12)",
              borderRadius: 14,
              textAlign: "left",
            }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(200,160,255,0.7)", fontWeight: 600 }}>
                {"Shopier'da ödeme yaptığın e-postayı gir:"}
              </p>
              <input
                type="email"
                placeholder="ornek@gmail.com"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setBindError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleBindEmail()}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(200,160,255,0.2)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#e8e4f4",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
              />
            </div>

            {bindError && (
              <p style={{
                color: "#f6ad55",
                fontSize: 13,
                marginTop: 12,
                lineHeight: 1.6,
                whiteSpace: "pre-line",
                textAlign: "left",
                padding: "0 4px",
              }}>{bindError}</p>
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
                fontSize: 15,
              }}
            >
              {"Ödemeyi doğrula"}
            </button>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                type="button"
                onClick={handleRetryPayment}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(200,160,255,0.25)",
                  background: "transparent",
                  color: "rgba(200,160,255,0.75)",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {"Tekrar ödeme yap"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (returnPath && returnPath !== "/") {
                    navigate(decodeURIComponent(returnPath), { replace: true });
                  } else {
                    navigate("/", { replace: true });
                  }
                }}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(200,160,255,0.15)",
                  background: "transparent",
                  color: "rgba(200,160,255,0.5)",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {"Okumaya dön"}
              </button>
            </div>

            <p style={{
              marginTop: 16,
              fontSize: 11,
              color: "rgba(200,160,255,0.35)",
              lineHeight: 1.6,
            }}>
              {"Ödeme yaptıysan ama doğrulama çalışmıyorsa, okuma sayfasındaki \"Ödeme yaptım ama açılmadı\" butonunu da kullanabilirsin."}
            </p>
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
