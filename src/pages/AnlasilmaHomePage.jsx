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
      </div>
    </>
  );
}
