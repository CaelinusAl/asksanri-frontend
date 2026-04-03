import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  redirectToShopier,
  isShopierUnlocked,
  checkServerUnlock,
  syncPurchasesFromServer,
  SHOPIER_PRODUCTS,
} from "../data/shopierConfig";
import { useLanguage } from "../contexts/LanguageContext";
import { trackFunnelEvent } from "../data/funnelTracker";
import { trackAddToCart, trackGunesSirriAc } from "../data/analytics";
import {
  GOZ_CONTENT_ID,
  GOZ_RETURN_PATH,
  sectionsFree,
  cliffVisibleLine,
  paywallHypnotic,
  paywallSub,
  paywallHint,
  paywallCartCta,
  paywallOpenCta,
  sirUnlocked,
  heroHypnoticLine,
  sembolikReading,
  bridgeToSeal,
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

  const price = SHOPIER_PRODUCTS.okuma_devami?.price || "9.90";

  const onShopier = useCallback(() => {
    trackFunnelEvent("goz_acik_gunes_shopier_click");
    const amt = parseFloat(String(price).replace(",", ".")) || 9.9;
    trackAddToCart(GOZ_CONTENT_ID, amt, "TRY");
    redirectToShopier("okuma_devami", GOZ_CONTENT_ID, GOZ_RETURN_PATH);
  }, [price]);

  const onRecovery = useCallback(async () => {
    const ok = await checkServerUnlock(GOZ_CONTENT_ID);
    await syncPurchasesFromServer();
    if (ok || isShopierUnlocked(GOZ_CONTENT_ID)) {
      setUnlocked(true);
      window.location.reload();
    } else {
      window.alert("Sunucuda bu içerik için ödeme bulunamadı. /odeme-basarili sayfasından doğrula.");
    }
  }, []);

  const openDeep = useCallback(() => {
    setDeepOpen(true);
    trackFunnelEvent("goz_sirri_ac_click");
    trackGunesSirriAc(GOZ_CONTENT_ID);
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
          {isTR ? "Üst bilinç okuma" : "Deep read"}
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

            <section className={`${styles.block} ${styles.sembolikBlock}`}>
              <p className={styles.kicker}>{sembolikReading.kicker}</p>
              <p className={styles.sembolikHypnoticMain}>{sembolikReading.hypnoticLine}</p>
              <h2 className={styles.blockTitle}>{sembolikReading.title}</h2>
              {sembolikReading.paras.map((t, j) => (
                <p key={j} className={styles.para}>
                  {rich(t)}
                </p>
              ))}
            </section>

            <section className={styles.bridgeBlock}>
              {bridgeToSeal.paras.map((t, j) => (
                <p key={j} className={styles.bridgePara}>
                  {rich(t)}
                </p>
              ))}
            </section>

            <div className={styles.cliff}>
              <p className={styles.cliffText}>{cliffVisibleLine}</p>
            </div>

            {!unlocked ? (
              <div className={styles.sembolikPaywall}>
                <p className={styles.sembolikPaywallHypno}>{paywallHypnotic}</p>
                <p className={styles.sembolikPaywallSub}>{rich(paywallSub)}</p>
                <p className={styles.sembolikPaywallHint}>{paywallHint}</p>
                <div className={styles.sembolikPaywallActions}>
                  <button type="button" className={styles.ctaBtn} onClick={onShopier}>
                    {paywallCartCta} — {price}₺
                  </button>
                  <button type="button" className={styles.ctaBtnGhost} onClick={onShopier}>
                    {paywallOpenCta}
                  </button>
                </div>
                <button type="button" className={styles.recoveryBtn} onClick={onRecovery}>
                  {isTR ? "Ödemeyi yaptım, kilidi aç" : "I paid — unlock"}
                </button>
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
                <p className={styles.sirInnerLead}>{rich(sirUnlocked.innerLead)}</p>
                {sirUnlocked.paras.map((t, i) => (
                  <p key={i} className={styles.sirPara}>
                    {rich(t)}
                  </p>
                ))}
                <p className={styles.sirSeal}>{sirUnlocked.seal}</p>
                <div className={styles.sirSoftZone}>
                  <p className={styles.sirSoftLabel}>{sirUnlocked.softLabel}</p>
                  {sirUnlocked.softLines.map((t, i) => (
                    <p key={i} className={styles.sirSoftPara}>
                      {rich(t)}
                    </p>
                  ))}
                </div>
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
