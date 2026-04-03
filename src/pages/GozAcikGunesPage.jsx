import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  redirectToShopier,
  isShopierUnlocked,
  unlockViaShopier,
  syncPurchasesFromServer,
  SHOPIER_PRODUCTS,
} from "../data/shopierConfig";
import { useLanguage } from "../contexts/LanguageContext";
import { trackFunnelEvent } from "../data/funnelTracker";
import {
  GOZ_CONTENT_ID,
  GOZ_RETURN_PATH,
  sectionsFree,
  cliffVisibleLine,
  paywallTitle,
  paywallSub,
  paywallHint,
  paywallCta,
  sirUnlocked,
  heroHypnoticLine,
} from "../data/gozAcikGunesContent";
import styles from "./GozAcikGunesPage.module.css";

function rich(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i}>{p.slice(2, -2)}</strong>
      );
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export default function GozAcikGunesPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const [unlocked, setUnlocked] = useState(() => isShopierUnlocked(GOZ_CONTENT_ID));
  const [deepOpen, setDeepOpen] = useState(() => isShopierUnlocked(GOZ_CONTENT_ID));
  const deepRef = useRef(null);

  useEffect(() => {
    trackFunnelEvent("goz_acik_gunes_view");
  }, []);

  useEffect(() => {
    if (unlocked) setDeepOpen(true);
  }, [unlocked]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await syncPurchasesFromServer();
      if (!cancelled && isShopierUnlocked(GOZ_CONTENT_ID)) {
        setUnlocked(true);
        trackFunnelEvent("goz_acik_gunes_unlocked");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!unlocked) trackFunnelEvent("goz_acik_gunes_paywall_shown");
  }, [unlocked]);

  const onShopier = useCallback(() => {
    trackFunnelEvent("goz_acik_gunes_shopier_click");
    redirectToShopier("okuma_devami", GOZ_CONTENT_ID, GOZ_RETURN_PATH);
  }, []);

  const onRecovery = useCallback(() => {
    unlockViaShopier(GOZ_CONTENT_ID);
    syncPurchasesFromServer().then(() => {
      if (isShopierUnlocked(GOZ_CONTENT_ID)) setUnlocked(true);
      else window.location.reload();
    });
  }, []);

  const price = SHOPIER_PRODUCTS.okuma_devami?.price || "9.90";

  const openDeep = useCallback(() => {
    setDeepOpen(true);
    trackFunnelEvent("goz_sirri_ac_click");
    window.requestAnimationFrame(() => {
      deepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.orb} aria-hidden />
      <div className={styles.orb2} aria-hidden />

      <header className={styles.topbar}>
        <button type="button" className={styles.backBtn} onClick={() => navigate("/")}>
          ← {isTR ? "Kapılar" : "Gates"}
        </button>
        <span className={styles.badge}>
          {isTR ? "Derin okuma" : "Deep read"}
        </span>
      </header>

      <article className={styles.article}>
        <div className={styles.hero}>
          <div className={styles.heroGlyph} aria-hidden>
            ☉
          </div>
          <h1 className={styles.heroTitle}>
            {isTR ? "Göz Açık Güneş" : "Eye-Open Sun"}
          </h1>
          <p className={styles.heroHypnotic}>
            {isTR ? heroHypnoticLine : "I HAVE A SECRET FOR YOU"}
          </p>
          {isTR && !deepOpen && (
            <button type="button" className={styles.heroOpenBtn} onClick={openDeep}>
              Sırrı aç
            </button>
          )}
        </div>

        {isTR ? (
          <>
            {deepOpen && (
              <div id="goz-derin" ref={deepRef} className={styles.deepReveal}>
            {sectionsFree.map((sec, idx) => (
              <section key={idx} className={styles.block}>
                <p className={styles.kicker}>{sec.kicker}</p>
                <h2 className={styles.blockTitle}>{sec.title}</h2>
                {sec.paras.map((t, j) => (
                  <p key={j} className={styles.para}>
                    {rich(t)}
                  </p>
                ))}
              </section>
            ))}

            <div className={styles.cliff}>
              <p className={styles.cliffText}>{cliffVisibleLine}</p>
            </div>

            {!unlocked ? (
              <div className={styles.lockZone}>
                <div className={styles.lockFake} aria-hidden>
                  <p>
                    ████ ██████ ██ ███ ██████ ██… dikkat frekansı… merkez
                    kayması… ████…
                  </p>
                  <p>
                    ████████ … izlenme miti … ████ bakış derleyici … ████
                  </p>
                </div>
                <div className={styles.lockOverlay}>
                  <h3 className={styles.lockTitle}>{paywallTitle}</h3>
                  <p className={styles.lockSub}>{rich(paywallSub)}</p>
                  <p className={styles.lockHint}>{paywallHint}</p>
                  <button type="button" className={styles.ctaBtn} onClick={onShopier}>
                    {isTR ? `${paywallCta} — ${price}₺` : `Unlock — ${price}₺ TRY`}
                  </button>
                  <button type="button" className={styles.recoveryBtn} onClick={onRecovery}>
                    {isTR ? "Ödemeyi yaptım, kilidi aç" : "I paid — unlock"}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                className={styles.sirZone}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
              >
                <p className={styles.sirLabel}>{isTR ? "Kilit açıldı" : "Unsealed"}</p>
                <h2 className={styles.sirTitle}>{sirUnlocked.title}</h2>
                {sirUnlocked.paras.map((t, i) => (
                  <p key={i} className={styles.sirPara}>
                    {rich(t)}
                  </p>
                ))}
                <p className={styles.sirSeal}>{sirUnlocked.seal}</p>
              </motion.div>
            )}
              </div>
            )}
          </>
        ) : (
          <section className={styles.block}>
            <p className={styles.para}>
              This reading is available in Turkish. Switch language to TR using the home
              page control, or continue exploring other gates.
            </p>
          </section>
        )}
      </article>
    </div>
  );
}
