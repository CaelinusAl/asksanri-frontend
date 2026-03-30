import React, { useEffect } from "react";

const GATES = [
  { tr: "EŞİK",      en: "THRESHOLD",  icon: "⊞" },
  { tr: "AYNA",      en: "MIRROR",     icon: "◈" },
  { tr: "EROS",      en: "EROS",       icon: "♡" },
  { tr: "SIR",       en: "SECRET",     icon: "◆" },
  { tr: "ÇATIŞMA",   en: "CONFLICT",   icon: "⚔" },
  { tr: "BOŞLUK",    en: "VOID",       icon: "☽" },
  { tr: "KOD",       en: "CODE",       icon: "∞" },
  { tr: "GÖLGE",     en: "SHADOW",     icon: "◎" },
  { tr: "HATIRLAMA", en: "RECALL",     icon: "☆" },
  { tr: "OYUN",      en: "PLAY",       icon: "✧" },
  { tr: "SEÇİM",    en: "CHOICE",     icon: "⊕" },
  { tr: "SİRİ",     en: "RELEASE",    icon: "◇" },
  { tr: "DOĞUŞ",    en: "BIRTH",      icon: "✦" },
];

const R = 38;
const POS = GATES.map((_, i) => {
  const a = (i / 13) * 2 * Math.PI - Math.PI / 2;
  return { x: 50 + Math.cos(a) * R, y: 50 + Math.sin(a) * R };
});

let _css = false;
function injectCSS() {
  if (_css || typeof document === "undefined") return;
  _css = true;
  const el = document.createElement("style");
  el.textContent = `
    @keyframes g13-pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.65}50%{transform:translate(-50%,-50%) scale(1.12);opacity:1}}
    @keyframes g13-glow{0%,100%{opacity:.18;transform:translate(-50%,-50%) scale(1)}50%{opacity:.35;transform:translate(-50%,-50%) scale(1.15)}}
    @keyframes g13-appear{from{opacity:0;transform:translate(-50%,-50%) translateY(6px)}to{opacity:1;transform:translate(-50%,-50%) translateY(0)}}
    @keyframes g13-orbit-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes g13-ring-pulse{0%,100%{opacity:.06}50%{opacity:.12}}

    .g13-node{transition:border-color .3s,background .3s,box-shadow .3s,transform .3s!important;backdrop-filter:blur(12px) saturate(1.3);-webkit-backdrop-filter:blur(12px) saturate(1.3)}
    .g13-node:not(.g13-on):hover{border-color:rgba(210,180,100,.40)!important;background:rgba(15,12,8,.70)!important;box-shadow:0 0 24px rgba(210,175,80,.18),0 0 50px rgba(210,170,60,.06)!important;transform:translate(-50%,-50%) scale(1.06)!important}
    .g13-node:focus-visible{outline:2px solid rgba(210,175,80,.4);outline-offset:3px}
    .g13-on{border-color:rgba(210,180,100,.55)!important;background:rgba(20,16,8,.80)!important;box-shadow:0 0 30px rgba(210,175,80,.22),0 0 60px rgba(210,170,60,.08),inset 0 0 20px rgba(210,175,80,.05)!important;transform:translate(-50%,-50%) scale(1.08)!important;z-index:5!important}
    .g13-on:hover{box-shadow:0 0 40px rgba(210,175,80,.28),0 0 70px rgba(210,170,60,.10),inset 0 0 20px rgba(210,175,80,.06)!important}
    .g13-detail-btn:hover{background:rgba(255,255,255,.06)!important}
    .g13-cta:hover{transform:translateY(-2px)!important;box-shadow:0 0 40px rgba(210,175,80,.35),0 8px 24px rgba(0,0,0,.35)!important}

    .g13-glass-panel{backdrop-filter:blur(20px) saturate(1.2);-webkit-backdrop-filter:blur(20px) saturate(1.2)}
  `;
  document.head.appendChild(el);
}

export default function RadialGateRing({ activeKey = "0", onSelect, isTR }) {
  useEffect(injectCSS, []);

  return (
    <div style={S.wrap}>
      {/* Warm center glow */}
      <div style={S.centerGlow} />

      {/* Orbit rings */}
      <div style={S.orbit} />
      <div style={S.orbitOuter} />
      <div style={S.orbitDash} />

      {/* SVG connecting lines */}
      <svg style={S.svg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {POS.map((p, i) => (
          <line key={i} x1="50" y1="50" x2={p.x} y2={p.y}
            stroke={String(i) === activeKey ? "rgba(210,175,80,.12)" : "rgba(210,175,80,.03)"}
            strokeWidth={String(i) === activeKey ? ".2" : ".1"} />
        ))}
      </svg>

      {/* Center heart — multi-layer */}
      <div style={S.heartWideGlow} />
      <div style={S.heartGlow} />
      <div style={S.heart}>♥</div>

      {/* 13 gate nodes */}
      {GATES.map((g, i) => {
        const k = String(i);
        const on = k === activeKey;
        const p = POS[i];

        return (
          <button key={k}
            className={`g13-node ${on ? "g13-on" : ""}`}
            onClick={() => onSelect?.(k)}
            style={{
              position: "absolute",
              left: `${p.x}%`, top: `${p.y}%`,
              transform: "translate(-50%,-50%)",
              width: "clamp(56px, 13.5vw, 74px)",
              height: "clamp(68px, 16vw, 90px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 5,
              borderRadius: 14,
              border: "1px solid rgba(210,180,100,.15)",
              background: "rgba(8,6,14,.55)",
              boxShadow: "0 4px 16px rgba(0,0,0,.35)",
              cursor: "pointer", outline: "none", padding: 0,
              zIndex: 2,
              animation: `g13-appear .45s ${i * 0.05}s ease both`,
            }}
          >
            <span style={{
              fontSize: "clamp(17px, 4vw, 22px)",
              color: on ? "rgba(230,200,110,1)" : "rgba(210,185,100,.45)",
              transition: "color .3s", lineHeight: 1,
              filter: on ? "drop-shadow(0 0 6px rgba(210,175,80,.35))" : "none",
            }}>{g.icon}</span>
            <span style={{
              fontSize: "clamp(7px, 1.7vw, 9px)",
              fontWeight: 800, letterSpacing: ".14em",
              color: on ? "rgba(255,245,210,.92)" : "rgba(255,245,210,.32)",
              transition: "color .3s", textAlign: "center", lineHeight: 1.15,
            }}>{isTR ? g.tr : g.en}</span>
          </button>
        );
      })}
    </div>
  );
}

const S = {
  wrap: {
    position: "relative", width: "100%", maxWidth: 520,
    aspectRatio: "1", margin: "0 auto", flexShrink: 0,
  },
  centerGlow: {
    position: "absolute", left: "50%", top: "50%",
    transform: "translate(-50%,-50%)", width: "60%", height: "60%",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(200,160,60,.08) 0%, rgba(140,80,180,.03) 40%, transparent 70%)",
    pointerEvents: "none",
  },
  orbit: {
    position: "absolute",
    left: `${50 - R}%`, top: `${50 - R}%`,
    width: `${R * 2}%`, height: `${R * 2}%`,
    borderRadius: "50%",
    border: "1px solid rgba(210,180,100,.08)",
    animation: "g13-ring-pulse 6s ease-in-out infinite",
    pointerEvents: "none",
  },
  orbitOuter: {
    position: "absolute",
    left: `${50 - R - 5}%`, top: `${50 - R - 5}%`,
    width: `${(R + 5) * 2}%`, height: `${(R + 5) * 2}%`,
    borderRadius: "50%",
    border: "1px solid rgba(210,180,100,.03)",
    pointerEvents: "none",
  },
  orbitDash: {
    position: "absolute",
    left: `${50 - R + 5}%`, top: `${50 - R + 5}%`,
    width: `${(R - 5) * 2}%`, height: `${(R - 5) * 2}%`,
    borderRadius: "50%",
    border: "1px dashed rgba(210,180,100,.04)",
    animation: "g13-orbit-spin 90s linear infinite",
    transformOrigin: "center",
    pointerEvents: "none",
  },
  svg: {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    pointerEvents: "none",
  },
  heartWideGlow: {
    position: "absolute", left: "50%", top: "50%",
    width: 140, height: 140, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(210,170,60,.12) 0%, rgba(180,120,80,.04) 50%, transparent 70%)",
    animation: "g13-glow 5s ease-in-out infinite",
    pointerEvents: "none", zIndex: 1,
  },
  heartGlow: {
    position: "absolute", left: "50%", top: "50%",
    width: 70, height: 70, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(220,185,80,.20), transparent 60%)",
    animation: "g13-glow 4s 1s ease-in-out infinite",
    pointerEvents: "none", zIndex: 1,
  },
  heart: {
    position: "absolute", left: "50%", top: "50%",
    fontSize: 30, color: "rgba(220,190,100,.85)",
    animation: "g13-pulse 4.5s ease-in-out infinite",
    filter: "drop-shadow(0 0 12px rgba(210,170,60,.35))",
    zIndex: 3, pointerEvents: "none", userSelect: "none",
  },
};
