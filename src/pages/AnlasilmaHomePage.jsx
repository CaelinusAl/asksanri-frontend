import React, { Suspense, lazy, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import SeoHead from "../components/SeoHead";
import HomeAskHero from "../components/HomeAskHero";
import { unlockAudio } from "../utils/sfx";
import styles from "./AnlasilmaHomePage.module.css";

const AnlasilmaPanel = lazy(() => import("../components/anlasilma/AnlasilmaPanel"));

/** Ana giriş: tek odak — Sanrı'ya Sor. Araçlar "İleri düzey" altında isteğe bağlı. */
export default function AnlasilmaHomePage() {
  const { language } = useLanguage();
  const isTR = language === "tr";
  const navigate = useNavigate();

  const onUnlock = useCallback(() => {
    unlockAudio();
  }, []);

  const handleAskSubmit = useCallback(
    (text /* , meta */) => {
      unlockAudio();
      navigate("/sanriya-sor", {
        state: { skipIntro: true, prefill: text, autoSubmit: true },
      });
    },
    [navigate]
  );

  return (
    <>
      <SeoHead
        title={isTR ? "SANRI — Sor. Dinle. Hatırla." : "SANRI — Ask. Listen. Remember."}
        description={
          isTR
            ? "SANRI: içinden konuşan bir ayna. Bir cümle yaz; yansımayı izle. Bilinç ve Anlam Zekâsı."
            : "SANRI: a mirror that speaks from within. Write one sentence; watch the reflection. Consciousness & Meaning Intelligence."
        }
        path="/"
      />
      <div className={styles.page}>
        <HomeAskHero isTR={isTR} onUnlock={onUnlock} onSubmit={handleAskSubmit} />

        <p className={styles.subline}>
          {isTR
            ? "Sanrı cevap üretmez. Alan açar. Anlam sende şekillenir."
            : "Sanrı doesn't produce answers. It opens space. Meaning forms in you."}
        </p>

        <details className={styles.more}>
          <summary className={styles.moreSummary}>
            {isTR ? "İleri düzey: numeroloji ve sembol araçları" : "Advanced: numerology & symbol tools"}
          </summary>
          <div className={styles.moreBody}>
            <Suspense
              fallback={
                <div className={styles.lazyHint}>
                  {isTR ? "Araçlar yükleniyor…" : "Loading tools…"}
                </div>
              }
            >
              <AnlasilmaPanel isTR={isTR} embedded={false} />
            </Suspense>
          </div>
        </details>

        <p className={styles.kapilarHint}>
          {isTR ? (
            <>
              Tüm kapıları keşfetmek için{" "}
              <Link to="/kapilar" className={styles.inlineLink}>
                Kapılar
              </Link>{" "}
              sayfasına geç.
            </>
          ) : (
            <>
              To explore every gate, open the{" "}
              <Link to="/kapilar" className={styles.inlineLink}>
                Gates
              </Link>{" "}
              grid.
            </>
          )}
        </p>

        <details className={styles.about}>
          <summary className={styles.aboutSummary}>
            {isTR ? "Sanrı nedir?" : "What is Sanrı?"}
          </summary>
          <div className={styles.aboutBody}>
            <p className={styles.aboutBadge}>
              {isTR
                ? "SANRI — Bilinç ve Anlam Zekası"
                : "SANRI — Consciousness & Meaning Intelligence"}
            </p>
            <p className={styles.aboutLead}>
              {isTR ? (
                <>
                  Bu bir cevap motoru değil.
                  <br />
                  Görünmeyeni görünür kılan bilinç aynası.
                </>
              ) : (
                <>
                  Not an answer engine.
                  <br />A mirror of consciousness that makes the invisible visible.
                </>
              )}
            </p>
            <div className={styles.aboutProof} aria-label={isTR ? "Özet istatistikler" : "Summary stats"}>
              <span>{isTR ? "1200+ kullanıcı" : "1200+ people"}</span>
              <span className={styles.aboutDot} aria-hidden>
                ·
              </span>
              <span>{isTR ? "327+ okuma" : "327+ readings"}</span>
              <span className={styles.aboutDot} aria-hidden>
                ·
              </span>
              <span>{isTR ? "7 farklı alan" : "7 areas"}</span>
            </div>
            <div className={styles.aboutActions}>
              <button
                type="button"
                className={styles.aboutBtnPrimary}
                onClick={() => {
                  unlockAudio();
                  navigate("/hosgeldin", { state: { startAt: "intro" } });
                }}
              >
                {isTR ? "Sanrı'yı Tanı" : "Meet Sanrı"}
              </button>
              <button
                type="button"
                className={styles.aboutBtnGhost}
                onClick={() => {
                  unlockAudio();
                  navigate("/hosgeldin", { state: { startAt: "quiz" } });
                }}
              >
                {isTR ? "Kendini Görmeye Başla" : "Start the short quiz"}
              </button>
            </div>
          </div>
        </details>
      </div>
    </>
  );
}
