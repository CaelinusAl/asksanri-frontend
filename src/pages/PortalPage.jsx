import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PortalPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { bilincKapilari, GATE_LAYOUT } from "../data/bilincKapilari";
import AwakenedCitiesContent from "./AwakendCitiesPage";

const TABS = [
  { id: "gates", label: "✦ 13 Bilinç Kapısı" },
  { id: "cities", label: "△ 81 Uyanan Şehir" },
];

function GateDetail({ gate, onPass }) {
  const [rituelOpen, setRituelOpen] = useState(false);

  const nearbyGates = useMemo(() => {
    const idx = bilincKapilari.findIndex((g) => g.id === gate.id);
    const prev = bilincKapilari[(idx - 1 + bilincKapilari.length) % bilincKapilari.length];
    const next = bilincKapilari[(idx + 1) % bilincKapilari.length];
    return [prev, gate, next];
  }, [gate]);

  return (
    <div className={styles.detail}>
      <div className={styles.detailImages}>
        {nearbyGates.map((g) => (
          <img
            key={g.id}
            className={styles.detailImg}
            src={g.image}
            alt={g.name}
            loading="lazy"
          />
        ))}
      </div>

      <div className={styles.detailHeader}>
        <div className={styles.detailIcon}>{gate.icon}</div>
        <span className={styles.detailName}>{gate.name}</span>
      </div>

      <div className={styles.detailSub}>
        {gate.baslik} — {gate.tanrica}
      </div>

      <div className={styles.detailKeywords}>
        {gate.keywords.map((kw) => (
          <span key={kw} className={styles.keyword}>{kw}</span>
        ))}
      </div>

      <div className={styles.mantraBox}>
        <p className={styles.mantraText}>{gate.mantra}</p>
      </div>

      <div className={styles.tetikBox}>
        <div className={styles.tetikLabel}>TETİK SORU</div>
        <p className={styles.tetikText}>"{gate.tetikSoru}"</p>
      </div>

      <div className={styles.rituelBox}>
        <div
          className={styles.rituelHeader}
          onClick={() => setRituelOpen((v) => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setRituelOpen((v) => !v);
          }}
        >
          <span className={styles.rituelLabel}>Mikro Ritüel</span>
          <span
            className={`${styles.rituelArrow} ${rituelOpen ? styles.rituelArrowOpen : ""}`}
          >
            ▼
          </span>
        </div>
        {rituelOpen && (
          <div className={styles.rituelContent}>{gate.rituel}</div>
        )}
      </div>

      <button type="button" className={styles.ctaBtn} onClick={onPass}>
        ◌ Bu Kapıdan Geç
      </button>

      <div className={styles.ctaFooter}>
        SANRI bu kapının bilincinden konuşacak.
      </div>
    </div>
  );
}

function GatesView() {
  const navigate = useNavigate();
  const [activeGate, setActiveGate] = useState(0);

  const gate = useMemo(
    () => bilincKapilari.find((g) => g.id === activeGate) || bilincKapilari[0],
    [activeGate],
  );

  const handlePass = useCallback(() => {
    unlockAudio();
    const prefill = encodeURIComponent(gate.tetikSoru);
    navigate(
      `/sanriya-sor?domain=bilinc_kapisi&gate=${gate.key}&prefill=${prefill}`,
      { state: { skipIntro: true } },
    );
  }, [navigate, gate]);

  return (
    <>
      <div className={styles.hero}>
        <h1 className={styles.h1}>13 Kapı. 13 Ayna. 1 Sen.</h1>
        <p className={styles.sub}>
          Her kapı bilincinin farklı bir katmanı.
        </p>
      </div>

      <div className={styles.splitMain}>
        <div className={styles.constellation}>
          {GATE_LAYOUT.map((pos) => {
            const g = bilincKapilari.find((x) => x.id === pos.id);
            if (!g) return null;
            const active = g.id === activeGate;
            return (
              <button
                key={g.id}
                type="button"
                className={`${styles.gateNode} ${active ? styles.gateNodeActive : ""}`}
                style={{ gridRow: pos.row, gridColumn: pos.col }}
                onClick={() => {
                  unlockAudio();
                  setActiveGate(g.id);
                }}
              >
                <span className={styles.gateIcon}>{g.icon}</span>
                <span className={styles.gateName}>{g.name}</span>
              </button>
            );
          })}
        </div>

        <GateDetail gate={gate} onPass={handlePass} />
      </div>
    </>
  );
}

export default function PortalPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";
  const [activeTab, setActiveTab] = useState("gates");

  const goHome = useCallback(() => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  }, [navigate]);

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
        </div>
        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={goHome}>
            {isTR ? "← Kapılar" : "← Gates"}
          </button>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "gates" && <GatesView />}

      {activeTab === "cities" && (
        <div className={styles.citiesWrapper}>
          <AwakenedCitiesContent embedded />
        </div>
      )}
    </div>
  );
}
