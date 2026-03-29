import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AwakendCitiesPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { awakenedCities } from "../data/awakendCities";

export default function AwakenedCitiesPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const cities = useMemo(() => awakenedCities, []);
  const [activeId, setActiveId] = useState(cities?.[0]?.id);
  const active = useMemo(() => cities.find(c => c.id === activeId) || cities[0], [cities, activeId]);

  const goBackToGates = () => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  };

  const goToSanri = () => {
    unlockAudio();
    const prefill = isTR ? active.promptTR : active.promptEN;
    const q = encodeURIComponent(prefill || "");
    navigate(`/sanriya-sor?domain=awakened_cities&mode=mirror&prefill=${q}`, { state: { skipIntro: true } });
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.subttl}>
            {isTR ? "Türkiye Okuması • Uyanan Şehirler" : "Turkey Reading • Awakened Cities"}
          </span>
        </div>

        <div className={styles.topbarRight}>
          <button className={styles.backBtn} type="button" onClick={goBackToGates}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>
          <button className={styles.langBtn} type="button" onClick={() => setLanguage(isTR ? "en" : "tr")}>
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.sectionTitle}>{isTR ? "Şehirler" : "Cities"}</div>

            <div className={styles.list}>
              {cities.map((c) => {
                const on = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.item} ${on ? styles.itemActive : ""}`}
                    onClick={() => setActiveId(c.id)}
                  >
                    <div className={styles.itemTitle}>{isTR ? c.nameTR : c.nameEN}</div>
                    <div className={styles.itemMeta}>
                      {isTR ? `Plaka: ${c.plate} • Tel: ${c.phone}` : `Plate: ${c.plate} • Phone: ${c.phone}`}
                    </div>
                    <div className={styles.itemDesc}>{isTR ? c.archetypeTR : c.archetypeEN}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.card}>
              <div className={styles.h1}>
                {isTR ? active?.nameTR : active?.nameEN}
              </div>
              <div className={styles.meta}>
                {isTR ? `Plaka ${active?.plate} • Telefon ${active?.phone}` : `Plate ${active?.plate} • Phone ${active?.phone}`}
              </div>
              <div className={styles.archetype}>
                {isTR ? active?.archetypeTR : active?.archetypeEN}
              </div>

              <div className={styles.preview}>
                <div className={styles.previewTitle}>{isTR ? "SANRI’ya iletilecek okuma prompt’u" : "Prompt to send to SANRI"}</div>
                <pre className={styles.pre}>{isTR ? active?.promptTR : active?.promptEN}</pre>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.primary} onClick={goToSanri}>
                  {isTR ? "Türkiye Okumasını Başlat →" : "Start Turkey Reading →"}
                </button>
                <button
                  type="button"
                  className={styles.ghost}
                  onClick={() => navigator.clipboard?.writeText(isTR ? active?.promptTR : active?.promptEN)}
                >
                  {isTR ? "Prompt’u Kopyala" : "Copy Prompt"}
                </button>
              </div>

              <div className={styles.foot}>
                {isTR ? "Bu alan şehirler üzerinden bilinç yolculuğu açar." : "This space opens an inner journey through cities."}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>© 2026 CaelinusAI • SANRI</div>
      </div>
    </div>
  );
}