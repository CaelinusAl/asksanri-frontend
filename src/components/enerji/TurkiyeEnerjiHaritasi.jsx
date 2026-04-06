import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./TurkiyeEnerjiHaritasi.module.css";
import { PROVINCE_LON_LAT } from "../../data/provinceMapCoords";
import { getCityById } from "../../data/cities";

/**
 * Türkiye ana kara sınırı — kabaca WGS84 halkası, eşdikdörtgen projeksiyon (web görseli).
 * viewBox: 0 0 1000 460 (boylam ~25.4–45.6°, enlem ~35.45–42.35°)
 */
const TURKEY_D =
  "M 47 46.7 L 35.6 66.7 L 49.5 142 L 37.1 170 L 47 196.7 L 32.2 273.3 L 93.1 300 L 100 353.3 L 142.6 371.3 L 184.2 411.3 L 225.2 416.7 L 250 398 L 274.8 380 L 324.3 386.7 L 354 410 L 420.8 430 L 490.1 424.7 L 538.6 408.7 L 566.8 380 L 634.7 353.3 L 673.3 331.3 L 731.2 271.3 L 805.9 162 L 893.6 100 L 898.5 71.3 L 822.8 48.7 L 774.8 20 L 728.7 18 L 705.4 35.3 L 662.4 53.3 L 574.3 95.3 L 527.2 75.3 L 477.7 43.3 L 453 21.3 L 418.3 18 L 368.8 30 L 294.6 51.3 L 215.3 88.7 L 179.2 126.7 L 131.2 144.7 L 96.5 160 L 70.3 113.3 L 47 46.7 Z";

/** Yankı haritası ana düğümleri — cities.js id */
const HUB_IDS = new Set([1, 6, 7, 16, 21, 25, 27, 34, 35, 42, 50, 61, 65]);
const CENTER_ID = 50;

const HUB_LINKS = [
  [34, 6],
  [34, 16],
  [6, 42],
  [6, 50],
  [35, 7],
  [7, 1],
  [1, 27],
  [27, 21],
  [61, 25],
  [25, 65],
  [6, 61],
  [50, 42],
  [16, 6],
];

const HZ_PALETTE = {
  396: { h: 168, a: 0.95 },
  417: { h: 188, a: 0.92 },
  528: { h: 200, a: 1 },
  639: { h: 265, a: 0.9 },
  741: { h: 290, a: 0.88 },
  852: { h: 310, a: 0.85 },
  963: { h: 330, a: 0.82 },
};

const ALL_HZ = [396, 417, 528, 639, 741, 852, 963];

const FIELD_IONS = [
  [212, 118],
  [298, 95],
  [245, 205],
  [128, 198],
  [320, 142],
  [412, 128],
  [388, 198],
  [442, 268],
  [518, 112],
  [548, 188],
  [598, 248],
  [652, 138],
  [698, 218],
  [748, 98],
  [818, 188],
  [862, 118],
  [338, 328],
  [428, 352],
  [558, 318],
  [668, 288],
  [192, 312],
  [498, 95],
  [622, 352],
  [772, 248],
];

function projectLonLat(lon, lat) {
  const lonMin = 25.4;
  const lonMax = 45.6;
  const latMin = 35.45;
  const latMax = 42.35;
  const W = 1000;
  const H = 460;
  return {
    x: ((lon - lonMin) / (lonMax - lonMin)) * W,
    y: ((latMax - lat) / (latMax - latMin)) * H,
  };
}

const DEFAULT_MAP_HZ = 417;

function hzToRgb(hz) {
  const p = HZ_PALETTE[hz] || HZ_PALETTE[DEFAULT_MAP_HZ];
  return `hsla(${p.h}, 85%, 58%, ${p.a})`;
}

function hzToRgbSolid(hz, alpha = 1) {
  const p = HZ_PALETTE[hz] || HZ_PALETTE[DEFAULT_MAP_HZ];
  return `hsla(${p.h}, 85%, 58%, ${alpha})`;
}

function linePath(byId, a, b) {
  const p = byId[a];
  const q = byId[b];
  if (!p || !q) return "";
  return `M ${p.x} ${p.y} L ${q.x} ${q.y}`;
}

function labelForProvince(id, isTR) {
  if (id === CENTER_ID) return isTR ? "MERKEZ" : "CENTER";
  const c = getCityById(id, isTR ? "tr" : "en");
  return c?.name ?? String(id);
}

export default function TurkiyeEnerjiHaritasi({
  selectedHz = DEFAULT_MAP_HZ,
  onHzChange,
  isTR = true,
  onProvinceSelect,
}) {
  const [showAllLabels, setShowAllLabels] = useState(false);
  const lang = isTR ? "tr" : "en";

  const { provinces, hubById } = useMemo(() => {
    const list = PROVINCE_LON_LAT.map((pair, i) => {
      const id = i + 1;
      const [lon, lat] = pair;
      const { x, y } = projectLonLat(lon, lat);
      const hub = HUB_IDS.has(id);
      const city = getCityById(id, lang);
      return {
        id,
        x,
        y,
        hub,
        center: id === CENTER_ID,
        name: city?.name ?? "",
      };
    });
    const byId = Object.fromEntries(list.map((p) => [p.id, p]));
    return { provinces: list, hubById: byId };
  }, [lang]);

  const accent = hzToRgb(selectedHz);
  const accentSoft = hzToRgbSolid(selectedHz, 0.22);
  const accentMid = hzToRgbSolid(selectedHz, 0.38);
  const energySpeed = Math.min(
    1.85,
    Math.max(0.62, 0.62 + ((selectedHz - 396) / (963 - 396)) * 1.23)
  );

  const hubsSorted = useMemo(() => {
    const h = provinces.filter((p) => p.hub);
    const rest = h.filter((p) => !p.center);
    const c = h.find((p) => p.center);
    return c ? [...rest, c] : rest;
  }, [provinces]);

  const othersSorted = useMemo(() => provinces.filter((p) => !p.hub), [provinces]);

  const handleProvinceClick = (id) => {
    onProvinceSelect?.(id);
  };

  const handleProvinceKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onProvinceSelect?.(id);
    }
  };

  return (
    <div
      className={styles.wrap}
      style={{
        "--map-accent": accent,
        "--energy-speed": String(energySpeed),
      }}
    >
      <div className={styles.starfield} aria-hidden />
      <div className={styles.aurora} aria-hidden />
      <div className={styles.hudTop}>
        <div className={styles.hudMini}>
          <span className={styles.hudMono}>SANRI_FIELD // TR-GRID</span>
          <div className={styles.spark} />
        </div>
      </div>

      <div className={styles.titleBlock}>
        <h2 className={styles.title}>{isTR ? "Türkiye enerji haritası" : "Turkey energy map"}</h2>
        <p className={styles.sub}>
          {isTR
            ? "İle dokun — Anadolu Ruh Haritası’nda o ilin kapısını aç. Frekans katmanı alanı renklendirir."
            : "Tap a province — open its gate on the Anatolian soul map. The frequency layer tints the field."}
        </p>
      </div>

      <div className={styles.mapToolbar}>
        <button
          type="button"
          className={`${styles.toolBtn} ${showAllLabels ? styles.toolBtnOn : ""}`}
          aria-pressed={showAllLabels}
          onClick={() => setShowAllLabels((v) => !v)}
        >
          {isTR ? (showAllLabels ? "Sadece ana düğümler" : "81 il adını göster") : showAllLabels ? "Hub view" : "Show all 81 names"}
        </button>
        <Link to="/sehirler" className={styles.soulMapLink}>
          {isTR ? "Anadolu Ruh Haritası — liste" : "Anatolian soul map — list"}
        </Link>
      </div>

      <div className={styles.svgWrap}>
        <svg
          className={styles.svg}
          viewBox="0 0 1000 460"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={isTR ? "Türkiye enerji haritası, 81 il" : "Turkey energy map, 81 provinces"}
        >
          <defs>
            <radialGradient id="fieldCore" cx="52%" cy="38%" r="72%">
              <stop offset="0%" stopColor={accentMid} stopOpacity="0.55" />
              <stop offset="45%" stopColor={accentSoft} stopOpacity="0.12" />
              <stop offset="100%" stopColor="#050a14" stopOpacity="0.92" />
            </radialGradient>
            <radialGradient id="ionGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="coastBloom" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--map-accent)" stopOpacity="0.06" />
              <stop offset="50%" stopColor="var(--map-accent)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--map-accent)" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          <path d={TURKEY_D} fill="url(#fieldCore)" className={styles.fieldFill} />

          <path
            d={TURKEY_D}
            fill="none"
            stroke="var(--map-accent)"
            strokeWidth="4.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.18"
            filter="url(#coastBloom)"
            className={styles.coastHalo}
          />

          <path
            d={TURKEY_D}
            fill="none"
            stroke="var(--map-accent)"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#glow)"
            className={styles.coastLine}
          />

          <path
            d={TURKEY_D}
            fill="none"
            stroke="var(--map-accent)"
            strokeWidth="1.2"
            strokeDasharray="10 14"
            strokeLinejoin="round"
            opacity="0.35"
            className={styles.coastScan}
          />

          {FIELD_IONS.map(([x, y], i) => (
            <circle
              key={`ion-${i}`}
              cx={x}
              cy={y}
              r={1.2}
              fill="url(#ionGlow)"
              className={styles.ion}
              style={{ animationDelay: `${i * 0.31}s` }}
            />
          ))}

          {HUB_LINKS.map(([a, b], i) => (
            <path
              key={`${a}-${b}`}
              d={linePath(hubById, a, b)}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="1.35"
              className={styles.leyLine}
              style={{ animationDelay: `${i * 0.28}s` }}
            />
          ))}

          {othersSorted.map((p) => {
            const showLabel = showAllLabels;
            const lbl = labelForProvince(p.id, isTR);
            return (
              <g
                key={`pv-${p.id}`}
                transform={`translate(${p.x},${p.y})`}
                className={styles.provinceHit}
                role="button"
                tabIndex={0}
                cursor="pointer"
                onClick={() => handleProvinceClick(p.id)}
                onKeyDown={(e) => handleProvinceKey(e, p.id)}
              >
                <title>
                  {p.name} — {isTR ? "Anadolu Ruh Haritası" : "Anatolian soul map"}
                </title>
                <circle r={14} fill="transparent" className={styles.hitCircle} />
                <circle r={2.1} fill="var(--map-accent)" opacity={0.45} className={styles.provinceDotSmall} />
                {showLabel ? (
                  <text x={0} y={-5} textAnchor="middle" className={styles.provinceLabelAll}>
                    {lbl}
                  </text>
                ) : null}
              </g>
            );
          })}

          {hubsSorted.map((c, i) => {
            const r = c.center ? 5.2 : c.hub ? 3.9 : 3.1;
            const isCore = c.center;
            const showLabel = true;
            const lbl = labelForProvince(c.id, isTR);
            return (
              <g
                key={`hub-${c.id}`}
                transform={`translate(${c.x},${c.y})`}
                className={styles.provinceHit}
                role="button"
                tabIndex={0}
                cursor="pointer"
                onClick={() => handleProvinceClick(c.id)}
                onKeyDown={(e) => handleProvinceKey(e, c.id)}
              >
                <title>
                  {c.name} — {isTR ? "Anadolu Ruh Haritası" : "Anatolian soul map"}
                </title>
                <circle r={18} fill="transparent" className={styles.hitCircle} />
                <circle
                  r={r * 4}
                  fill="var(--map-accent)"
                  opacity={0.06}
                  className={styles.pulseRing}
                  style={{ animationDelay: `${i * 0.19}s` }}
                />
                <circle
                  r={r * 2.4}
                  fill="var(--map-accent)"
                  opacity={0.1}
                  className={styles.pulseRing2}
                  style={{ animationDelay: `${i * 0.31}s` }}
                />
                <circle
                  r={r}
                  fill={isCore ? "#f4fbff" : "var(--map-accent)"}
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="0.65"
                  filter={isCore ? "url(#softGlow)" : "url(#glow)"}
                  className={styles.cityDot}
                />
                {showLabel ? (
                  <text
                    x={0}
                    y={isCore ? -14 : -11}
                    textAnchor="middle"
                    className={showAllLabels ? styles.cityLabelDense : styles.cityLabel}
                  >
                    {lbl}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.hzRail} role="group" aria-label={isTR ? "Frekans katmanı" : "Frequency layer"}>
        {ALL_HZ.map((hz) => (
          <button
            key={hz}
            type="button"
            className={`${styles.hzChip} ${selectedHz === hz ? styles.hzChipOn : ""}`}
            onClick={() => onHzChange?.(hz)}
          >
            {hz} Hz
          </button>
        ))}
      </div>

      <div className={styles.legendRow}>
        <div className={styles.legend}>
          <span className={styles.legendTitle}>{isTR ? "Bölgesel enerji" : "Regional energy"}</span>
          <ul>
            <li>{isTR ? "Frekans sıcaklığı — seçilen Hz ile renk ve nabız hızı" : "Frequency heat — color and pulse from Hz"}</li>
            <li>{isTR ? "81 il — tıkla, ruhani koordinat sayfasına git" : "81 provinces — tap for the soul-coordinate page"}</li>
          </ul>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendTitle}>{isTR ? "Yankı yolları" : "Echo paths"}</span>
          <ul>
            <li>{isTR ? "Ana düğümler arası çizgiler — kolektif akış metaforu" : "Hub connection lines — collective flow metaphor"}</li>
            <li>{isTR ? "Merkez (Nevşehir) — rezonans odağı" : "Center (Nevşehir) — resonance focus"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
