import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AwakenedCitiesPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { anadoluCities } from "../data/anadoluCities";
import { bilincKapilari } from "../data/bilincKapilari";
import { getLabContent } from "../data/labEngine";

const ELEMENT_TR = { fire: "Ateş", water: "Su", earth: "Toprak", air: "Hava" };

const ELEMENT_DESCRIPTIONS = {
  fire: "Ham güç. Eyleme çağrı.",
  water: "Akış ve derinlik. Duygunun dili.",
  earth: "Kök ve yapı. Sabrın gücü.",
  air: "Hareket ve perspektif. Zihnin özgürlüğü.",
};

const TABS = [
  { id: "gate",       label: "Kapı",        icon: "◈" },
  { id: "deep",       label: "Derin Katman", icon: "◉" },
  { id: "history",    label: "Tarih",        icon: "◷" },
  { id: "numerology", label: "Numeroloji",   icon: "∞" },
  { id: "symbols",    label: "Semboller",    icon: "✦" },
  { id: "ritual",     label: "Ritüel",       icon: "☽" },
  { id: "lab",        label: "LAB",          icon: "✤" },
];

function InfoCard({ label, children }) {
  return (
    <div className={styles.infoCard}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoBody}>{children}</div>
    </div>
  );
}

/* ── Gate Images Strip ── */
function GateImagesStrip() {
  const images = useMemo(() => {
    const withImg = bilincKapilari.filter((g) => g.image);
    const shuffled = [...withImg].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  return (
    <div className={styles.gateStrip}>
      {images.map((g) => (
        <img
          key={g.id}
          className={styles.gateStripImg}
          src={g.image}
          alt={g.name}
          loading="lazy"
        />
      ))}
    </div>
  );
}

/* ── Archetype Hero Card ── */
function ArchetypeCard({ data }) {
  return (
    <div className={styles.archetypeCard}>
      <div className={styles.archetypeLabel}>ARKETİP</div>
      <div className={styles.archetypeName}>{ELEMENT_TR[data.element]}</div>
      <div className={styles.archetypeDesc}>
        {ELEMENT_DESCRIPTIONS[data.element]}
      </div>
    </div>
  );
}

/* ── Tab: Kapı ── */
function TabGate({ data }) {
  return (
    <div className={styles.tabContent}>
      <div className={styles.entryBanner}>
        {data.code} • {data.city.toUpperCase()} — {data.gate.title}
      </div>

      <InfoCard label="Ana Mesaj">
        <p className={styles.coreMsg}>{data.coreMessage}</p>
      </InfoCard>

      <InfoCard label="Matrix Rolü">
        <p>{data.gate.text}</p>
      </InfoCard>

      <div className={styles.twoCol}>
        <InfoCard label="Bu şehir ne öğretir?">
          <p>{data.deepLayer.text}</p>
        </InfoCard>
        <InfoCard label="Günlük hayattaki karşılığı">
          <p>{data.history.text}</p>
        </InfoCard>
      </div>
    </div>
  );
}

/* ── Tab: Derin Katman ── */
function TabDeep({ data }) {
  return (
    <div className={styles.tabContent}>
      <InfoCard label={data.deepLayer.title}>
        <p>{data.deepLayer.text}</p>
      </InfoCard>

      <div className={styles.twoCol}>
        <InfoCard label="Element">
          <p>{ELEMENT_TR[data.element] || data.element} — {data.subtitle}</p>
        </InfoCard>
        <InfoCard label="Arketip">
          <p>{data.archetype}</p>
        </InfoCard>
      </div>

      <InfoCard label="Anahtar Kelimeler">
        <p>{data.keywords.join(" • ")}</p>
      </InfoCard>
    </div>
  );
}

/* ── Tab: Tarih ── */
function TabHistory({ data }) {
  return (
    <div className={styles.tabContent}>
      <InfoCard label={data.history.title}>
        <p className={styles.historyText}>{data.history.text}</p>
      </InfoCard>
    </div>
  );
}

/* ── Tab: Numeroloji ── */
function TabNumerology({ data }) {
  return (
    <div className={styles.tabContent}>
      <InfoCard label={data.numerology.title}>
        <p className={styles.numHighlight}>{data.numerology.text}</p>
      </InfoCard>
    </div>
  );
}

/* ── Tab: Semboller ── */
function TabSymbols({ data }) {
  return (
    <div className={styles.tabContent}>
      <InfoCard label={data.symbols.title}>
        <div className={styles.symbolItems}>
          {data.symbols.items.map((item, i) => (
            <span key={i} className={styles.symbolTag}>{item}</span>
          ))}
        </div>
        <p style={{ marginTop: 12 }}>{data.symbols.text}</p>
      </InfoCard>
    </div>
  );
}

/* ── Tab: Ritüel ── */
function TabRitual({ data, onAskSanri }) {
  return (
    <div className={styles.tabContent}>
      <div className={styles.ritualReflection}>
        <div className={styles.ritualIcon}>☽</div>
        <div className={styles.ritualQ}>Yansıma Sorusu</div>
        <p className={styles.ritualText}>{data.ritual.reflectionQuestion}</p>
      </div>

      <InfoCard label={`Mini Ritüel — ${data.ritual.title}`}>
        <p className={styles.ritualPractice}>{data.ritual.text}</p>
      </InfoCard>

      <button type="button" className={styles.askSanri} onClick={onAskSanri}>
        Bu şehri SANRI'ya sor →
      </button>
    </div>
  );
}

/* ── Tab: LAB — Rewrite Engine ── */
function TabLab({ data, onAskSanri }) {
  const lab = useMemo(() => getLabContent(data), [data]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.labHeader}>
        {data.code} · LAB: Rewrite Engine
      </div>

      <div className={styles.labIntro}>
        {lab.description}
      </div>

      <div className={styles.labRuleBox}>
        <div className={styles.labCommand}>
          Komut: <strong>{lab.command}</strong>
        </div>
        <div className={styles.labRule}>
          <span className={styles.labRuleLabel}>Kural:</span>
          <span className={styles.labRuleValue}>"{lab.rule}"</span>
        </div>
        <div className={styles.labRule}>
          <span className={styles.labRuleLabelNew}>Yeni Kural:</span>
          <span className={styles.labRuleValueNew}>"{lab.newRule}"</span>
        </div>
      </div>

      <InfoCard label="Bilinç Notu">
        <p>
          <strong>{data.city}</strong> sana şunu hatırlatıyor: eski kural artık işlemiyor.
          Yeni kodu yükle ve gözlemle.
        </p>
      </InfoCard>

      <button type="button" className={styles.askSanri} onClick={onAskSanri}>
        Bu kodu SANRI ile işle →
      </button>
    </div>
  );
}

const TAB_RENDERERS = {
  gate: TabGate,
  deep: TabDeep,
  history: TabHistory,
  numerology: TabNumerology,
  symbols: TabSymbols,
  ritual: TabRitual,
  lab: TabLab,
};

export default function AwakenedCitiesPage({ embedded = false }) {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const cities = useMemo(() => anadoluCities, []);
  const [activeId, setActiveId] = useState("01");
  const [activeTab, setActiveTab] = useState("gate");
  const [search, setSearch] = useState("");

  const active = useMemo(
    () => cities.find((c) => c.code === activeId) || cities[0],
    [cities, activeId],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return cities;
    const q = search.toLowerCase();
    return cities.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.archetype.toLowerCase().includes(q),
    );
  }, [cities, search]);

  const goBackToGates = useCallback(() => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  }, [navigate]);

  const goToSanri = useCallback(() => {
    unlockAudio();
    const lab = getLabContent(active);
    const prompt = `${active.code} plaka kodlu ${active.city} şehrinin bilinç haritasını oku. '${active.archetype}' arketipi ve ${ELEMENT_TR[active.element]} elementi üzerinden ruh yolculuğunu anlat. LAB komutu: ${lab.command} — eski kural: "${lab.rule}" → yeni kural: "${lab.newRule}"`;
    const q = encodeURIComponent(prompt);
    navigate(`/sanriya-sor?domain=awakened_cities&mode=mirror&prefill=${q}`, {
      state: { skipIntro: true },
    });
  }, [navigate, active]);

  const Renderer = TAB_RENDERERS[activeTab] || TabGate;

  return (
    <div className={embedded ? undefined : styles.page} onPointerDown={unlockAudio}>
      {!embedded && <StarTrail />}

      {!embedded && (
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.brand}>CAELINUS AI</span>
            <span className={styles.subttl}>
              {isTR ? "Anadolu Ruhu • 81 Şehir Bilinç Haritası" : "Anatolian Spirit • 81 Cities Consciousness Map"}
            </span>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.backBtn} type="button" onClick={goBackToGates}>
              {isTR ? "← Kapılar" : "← Gates"}
            </button>
            <button className={styles.langBtn} type="button" onClick={() => setLanguage(isTR ? "en" : "tr")}>
              {isTR ? "EN" : "TR"}
            </button>
          </div>
        </div>
      )}

      <div className={styles.main}>
        {/* ── SIDEBAR ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitle}>
              {isTR ? "81 Şehir" : "81 Cities"}
            </div>
            <div className={styles.sidebarCount}>{filtered.length}</div>
          </div>

          <input
            className={styles.searchInput}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isTR ? "Şehir ara…" : "Search city…"}
          />

          <div className={styles.cityList}>
            {filtered.map((c) => {
              const on = c.code === activeId;
              return (
                <button
                  key={c.code}
                  type="button"
                  className={`${styles.cityItem} ${on ? styles.cityItemActive : ""}`}
                  onClick={() => {
                    setActiveId(c.code);
                    setActiveTab("gate");
                  }}
                >
                  <span className={styles.cityPlate}>{c.code}</span>
                  <span className={styles.cityName}>{c.city}</span>
                  <span className={styles.cityKeywords}>
                    {c.keywords.slice(0, 2).join(" · ")}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <section className={styles.panel}>
          {/* Gate Images Strip */}
          <GateImagesStrip />

          {/* City Header */}
          <div className={styles.cityHeader}>
            <div className={styles.cityHeaderPlate}>{active.code}</div>
            <div className={styles.cityHeaderInfo}>
              <h1 className={styles.cityHeaderName}>{active.city}</h1>
              <div className={styles.cityHeaderTitle}>
                {active.keywords.join(" · ")}
              </div>
              <div className={styles.cityHeaderMeta}>
                <span className={styles.metaTag}>{ELEMENT_TR[active.element]}</span>
                <span className={styles.metaTag}>{active.archetype}</span>
                {active.keywords.map((kw) => (
                  <span key={kw} className={styles.metaTag}>{kw}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Archetype Hero */}
          <ArchetypeCard data={active} />

          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className={styles.tabIcon}>{t.icon}</span>
                <span className={styles.tabLabel}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={styles.tabPanel}>
            <Renderer data={active} onAskSanri={goToSanri} />
          </div>
        </section>
      </div>
    </div>
  );
}
