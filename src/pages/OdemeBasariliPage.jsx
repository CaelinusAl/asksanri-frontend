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
import { useAuth } from "../contexts/AuthContext";
import styles from "./PaymentPages.module.css";

import { WHATSAPP_SUPPORT_URL as WHATSAPP_LINK } from "../constants/whatsappSupport";

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

function buildAlternateIds(target) {
  const alts = [];
  if (target.startsWith("okuma_") && target !== "okuma_devami") {
    alts.push("okuma_devami");
  }
  return alts;
}

async function tryAllIds(target, alternateIds, email) {
  const idsToTry = [target, ...alternateIds.filter((id) => id !== target)];
  for (const id of idsToTry) {
    const r = await fetchShopierPurchaseCheck(id, email);
    if (r.unlocked) {
      return { unlocked: true, id, at: r.purchased_at || r.purchase?.purchased_at };
    }
  }
  return { unlocked: false };
}

async function tryVerifyByEmail(target, alternateIds, email) {
  const idsToTry = [target, ...alternateIds.filter((id) => id !== target)];
  for (const id of idsToTry) {
    const pat = await verifyPurchaseByEmail(email, id);
    if (pat.unlocked) {
      const check = await fetchShopierPurchaseCheck(id, email);
      if (check.unlocked) {
        return {
          unlocked: true,
          id,
          at: check.purchased_at || check.purchase?.purchased_at || new Date().toISOString(),
        };
      }
    }
  }
  return { unlocked: false };
}

/**
 * Dinamik polling aralığı — ilk dakikada sık, sonra seyrek.
 * Sayfa görünür olduğu sürece durmaz.
 */
function nextPollDelay(iteration) {
  if (iteration < 10) return 3000; // ilk 30 sn: 3 sn
  if (iteration < 30) return 5000; // sonraki ~100 sn: 5 sn
  return 10000; // sonsuza kadar: 10 sn
}

export default function OdemeBasariliPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [phase, setPhase] = useState("checking_with_email");
  const [verifyNote, setVerifyNote] = useState("");
  const [emailInput, setEmailInput] = useState("");
  /** Kullanıcı giriş yapınca veya URL/pending'den e-posta gelince input'u bir kez doldur. */
  const emailPrefillRef = useRef(false);
  const [bindError, setBindError] = useState("");
  const [emailAttempts, setEmailAttempts] = useState(0);
  const [pollingActive, setPollingActive] = useState(true);
  const startedRef = useRef(false);
  const pollingRef = useRef(true);
  const successCalledRef = useRef(false);

  const pending = getPendingPurchase();
  const contentId = params.get("content") || pending?.contentId || null;
  const returnPath = params.get("ref") || pending?.returnPath || "/";

  /**
   * Sıralı e-posta kaynakları — güçlüden zayıfa:
   *  1. URL param (mail linki ya da dpiurl ile geldi)
   *  2. Pending kaydında Shopier redirect öncesi alınan e-posta
   *  3. Giriş yapmış kullanıcının hesabındaki e-posta
   *  4. Manuel form (emailInput)
   */
  const urlEmail = params.get("email") || "";
  const authedEmail = user?.email || "";
  const resolvedEmail =
    (urlEmail && urlEmail.includes("@") && urlEmail.trim().toLowerCase()) ||
    (pending?.email && pending.email.includes("@") && pending.email.trim().toLowerCase()) ||
    (authedEmail && authedEmail.includes("@") && authedEmail.trim().toLowerCase()) ||
    "";

  /**
   * Polling döngüsünde her zaman en güncel email'i kullanmak için ref.
   * (AuthContext sonradan user'ı yükleyebilir, manuel form email girebilir.)
   */
  const emailRef = useRef(resolvedEmail);
  useEffect(() => {
    emailRef.current = resolvedEmail;
    if (!emailPrefillRef.current && resolvedEmail && !emailInput) {
      setEmailInput(resolvedEmail);
      emailPrefillRef.current = true;
    }
  }, [resolvedEmail, emailInput]);

  const tryUnlockCross = useCallback(async (primaryId, purchasedAt) => {
    const crossIds = CROSS_UNLOCK_MAP[primaryId] || [];
    for (const cid of crossIds) {
      const r = await fetchShopierPurchaseCheck(cid, emailRef.current);
      if (r.unlocked) {
        applyVerifiedShopierUnlock(cid, r.purchased_at || r.purchase?.purchased_at || purchasedAt);
      }
    }
  }, []);

  const runVerifiedSuccess = useCallback(
    async (target, purchasedAt, pendingSnap) => {
      if (successCalledRef.current) return;
      successCalledRef.current = true;
      pollingRef.current = false;

      applyVerifiedShopierUnlock(target, purchasedAt);
      if (target !== "okuma_devami" && target.startsWith("okuma_")) {
        applyVerifiedShopierUnlock("okuma_devami", purchasedAt);
      }
      await tryUnlockCross(target, purchasedAt);
      await syncPurchasesFromServer({ email: emailRef.current });
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
    const alternateIds = buildAlternateIds(target);

    const runCheck = async () => {
      const email = emailRef.current || "";
      const r = await tryAllIds(target, alternateIds, email);
      if (r.unlocked) return { unlocked: true, at: r.at };
      if (email && email.includes("@")) {
        const pat = await tryVerifyByEmail(target, alternateIds, email);
        if (pat.unlocked) return { unlocked: true, at: pat.at };
      }
      return { unlocked: false };
    };

    (async () => {
      setVerifyNote("Ödeme kontrol ediliyor...");

      const immediate = await runCheck();
      if (immediate.unlocked) {
        await runVerifiedSuccess(target, immediate.at, pendingSnap);
        return;
      }

      setPhase("checking_with_email");
      setVerifyNote(
        "Ödeme kaydı henüz ulaşmadı — arka planda kontrol devam ediyor.\nHızlı doğrulama için Shopier e-postanı gir."
      );

      /**
       * Sonsuz polling — sayfa görünür olduğu sürece devam eder.
       * Pratikte kullanıcı sekmeyi kapatırsa durur, yeniden açtığında
       * `visibilitychange` ile yeniden tetiklenir.
       */
      let i = 0;
      while (pollingRef.current) {
        const delay = nextPollDelay(i);
        i += 1;

        if (typeof document !== "undefined" && document.visibilityState === "hidden") {
          await sleep(1000);
          continue;
        }

        await sleep(delay);
        if (!pollingRef.current) return;

        const r = await runCheck();
        if (r.unlocked) {
          await runVerifiedSuccess(target, r.at, pendingSnap);
          return;
        }

        /* 10 denemeden (ilk ~30 sn) sonra `pollingActive` ipucunu kapat ki
           kullanıcı manuel e-posta formuna yönlensin — arka plan devam eder. */
        if (i === 10) setPollingActive(false);
      }
    })();

    return () => {
      pollingRef.current = false;
    };
  }, [contentId, runVerifiedSuccess]);

  /* Sekme tekrar görünür olunca bir kere hemen kontrol et. */
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const onVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      if (successCalledRef.current) return;
      if (!contentId) return;
      const target = contentId;
      const alternateIds = buildAlternateIds(target);
      const email = emailRef.current || "";
      const r = await tryAllIds(target, alternateIds, email);
      if (r.unlocked) {
        await runVerifiedSuccess(target, r.at, getPendingPurchase());
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
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

    /* Girilen e-postayı arka plan polling döngüsüne de yansıt — aksi halde
       döngü boş e-posta + sadece cihaz parmak izi ile denemeye devam eder. */
    emailRef.current = em;

    setPhase("email_checking");
    const alternateIds = buildAlternateIds(target);
    const idsToTry = [target, ...alternateIds];

    /* 1) En güvenilir yol: kendi DB kaydımıza doğrudan bak.
       Webhook ile kaydedilmiş satın alımlar burada anında eşleşir
       (Shopier canlı API'si gecikse / bulamasa bile). */
    for (const cid of idsToTry) {
      const r = await fetchShopierPurchaseCheck(cid, em);
      if (r.unlocked) {
        const pendingSnap = getPendingPurchase();
        await runVerifiedSuccess(target, r.purchased_at || r.purchase?.purchased_at, pendingSnap);
        return;
      }
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
      }
      if (bind.error === "device_mismatch") {
        setEmailAttempts((a) => a + 1);
        setPhase("checking_with_email");
        setBindError("Bu satın alma başka bir cihaza bağlı görünüyor.");
        return;
      }
    }

    const newAttempts = emailAttempts + 1;
    setEmailAttempts(newAttempts);
    setPhase("checking_with_email");

    if (newAttempts >= 2) {
      setBindError(
        "Ödeme doğrulanamadı. Aşağıdaki yollardan birini dene:\n\n" +
        "• E-postanı kontrol et — Shopier'da kullandığın e-posta ile eşleşmeli\n" +
        "• Birkaç dakika bekle ve tekrar dene\n" +
        "• WhatsApp'tan bize yaz — hemen yardımcı olalım"
      );
    } else {
      setBindError(
        "Bu e-posta ile eşleşen ödeme henüz bulunamadı.\n" +
        "Ödeme birkaç dakika gecikebilir — tekrar dene."
      );
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

  const showEmailForm = phase === "checking_with_email" || phase === "email_checking";

  return (
    <div className={styles.ritualPage}>
      <div
        className={`${styles.ritualGlow} ${
          !showEmailForm && phase !== "verifying" ? styles.ritualGlowActive : ""
        }`}
      />

      <AnimatePresence mode="wait">
        {phase === "email_checking" && (
          <motion.div
            key="email_checking"
            className={styles.ritualCenter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.voidPulse}>
              <span className={styles.voidGlyph}>{"\u25C8"}</span>
            </div>
            <p className={styles.voidText}>{"E-posta ile doğrulanıyor..."}</p>
          </motion.div>
        )}

        {phase === "checking_with_email" && (
          <motion.div
            key="checking_with_email"
            className={styles.ritualCenter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: 420, padding: "0 20px" }}
          >
            {pollingActive && (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 16,
                padding: "10px 16px",
                background: "rgba(120,247,216,0.06)",
                border: "1px solid rgba(120,247,216,0.15)",
                borderRadius: 10,
              }}>
                <span style={{ fontSize: 10, color: "#78f7d8", animation: "pulse 1.5s infinite" }}>{"●"}</span>
                <span style={{ fontSize: 12, color: "rgba(120,247,216,0.7)" }}>
                  {"Arka planda kontrol devam ediyor"}
                </span>
              </div>
            )}

            <h1 className={styles.ritualTitle} style={{ fontSize: "clamp(20px,4vw,26px)" }}>
              {"Shopier e-postanı gir"}
            </h1>
            <p style={{
              marginTop: 10,
              color: "rgba(200,160,255,0.55)",
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}>
              {verifyNote || "Hızlı doğrulama için Shopier'da kullandığın e-postayı gir."}
            </p>

            <div style={{
              marginTop: 16,
              padding: "16px",
              background: "rgba(200,160,255,0.04)",
              border: "1px solid rgba(200,160,255,0.12)",
              borderRadius: 14,
            }}>
              <input
                type="email"
                placeholder="ornek@gmail.com"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setBindError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleBindEmail()}
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(200,160,255,0.25)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#e8e4f4",
                  fontSize: 16,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={handleBindEmail}
                style={{
                  marginTop: 12,
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
            </div>

            {bindError && (
              <p style={{
                color: "#f6ad55",
                fontSize: 13,
                marginTop: 12,
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                textAlign: "left",
                padding: "0 4px",
              }}>{bindError}</p>
            )}

            {emailAttempts >= 2 && (
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  marginTop: 14,
                  padding: "14px 20px",
                  borderRadius: 12,
                  background: "rgba(37,211,102,0.12)",
                  border: "1px solid rgba(37,211,102,0.3)",
                  color: "#25d366",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                {"WhatsApp ile destek al"}
              </a>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
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
            <h1 className={styles.ritualTitle}>{"Kapı açıldı."}</h1>
            <p
              style={{
                marginTop: 14,
                color: "rgba(200,160,255,0.45)",
                fontSize: 15,
                letterSpacing: "0.04em",
                fontStyle: "italic",
              }}
            >
              {"Ödemen doğrulandı. İçeriğin açıldı."}
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
              {"Devam ettiğinde:"}
            </p>
            <p
              style={{
                color: "rgba(200,160,255,0.4)",
                fontSize: 14,
                margin: "0 0 6px",
                fontStyle: "italic",
              }}
            >
              {"okuduğun şey değişmeyecek."}
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
              {"Sen değişeceksin."}
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
