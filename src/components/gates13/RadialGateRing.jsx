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
    @keyframes g13-pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7}50%{transform:translate(-50%,-50%) scale(1.1);opacity:1}}
    @keyframes g13-glow{0%,100%{opacity:.10;transform:translate(-50%,-50%) scale(1)}50%{opacity:.22;transform:translate(-50%,-50%) scale(1.12)}}
    @keyframes g13-appear{from{opacity:0}to{opacity:1}}
    @keyframes g13-orbit-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    .g13-node{transition:border-color .25s,background .25s,box-shadow .25s,transform .25s!important}
    .g13-node:not(.g13-on):hover{border-color:rgba(210,175,80,.30)!important;background:rgba(18,14,8,.88)!important;box-shadow:0 0 16px rgba(210,175,80,.10)!important;transform:translate(-50%,-50%) scale(1.04)!important}
    .g13-node:focus-visible{outline:2px solid rgba(210,175,80,.35);outline-offset:2px}
    .g13-on{border-color:rgba(210,175,80,.50)!important;background:rgba(22,18,10,.94)!important;box-shadow:0 0 26px rgba(210,175,80,.16),inset 0 0 12px rgba(210,175,80,.04)!important;transform:translate(-50%,-50%) scale(1.06)!important;z-index:5!important}
    .g13-on:hover{box-shadow:0 0 32px rgba(210,175,80,.20),inset 0 0 14px rgba(210,175,80,.05)!important}
    .g13-detail-btn:hover{background:rgba(255,255,255,.04)!important}
    .g13-cta:hover{transform:translateY(-2px)!important;box-shadow:0 0 36px rgba(210,175,80,.30),0 6px 20px rgba(0,0,0,.3)!important}
  `;
  document.head.appendChild(el);
}

export default function RadialGateRing({ activeKey = "0", onSelect, isTR }) {
  useEffect(injectCSS, []);

  return (
    <div style={S.wrap}>
      <div style={S.bgGlow} />

      {/* Orbit ring + slow rotating dashed ring */}
      <div style={S.orbit} />
      <div style={S.orbitDash} />

      {/* SVG connecting lines */}
      <svg style={S.svg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {POS.map((p, i) => (
          <line key={i} x1="50" y1="50" x2={p.x} y2={p.y}
            stroke={String(i) === activeKey ? "rgba(210,175,80,.08)" : "rgba(210,175,80,.02)"}
            strokeWidth=".12" />
        ))}
      </svg>

      {/* Center heart */}
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
              width: "clamp(52px, 13vw, 70px)",
              height: "clamp(62px, 15.5vw, 84px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 3,
              borderRadius: 13,
              border: "1px solid rgba(210,175,80,.10)",
              background: "rgba(10,8,16,.82)",
              boxShadow: "0 2px 10px rgba(0,0,0,.25)",
              cursor: "pointer", outline: "none", padding: 0,
              zIndex: 2,
              animation: `g13-appear .35s ${i * 0.04}s ease both`,
            }}
          >
            <span style={{
              fontSize: "clamp(15px, 3.8vw, 20px)",
              color: on ? "rgba(220,185,90,.95)" : "rgba(220,185,90,.35)",
              transition: "color .25s", lineHeight: 1,
            }}>{g.icon}</span>
            <span style={{
              fontSize: "clamp(6.5px, 1.6vw, 8.5px)",
              fontWeight: 800, letterSpacing: ".12em",
              color: on ? "rgba(255,245,210,.88)" : "rgba(255,245,210,.30)",
              transition: "color .25s", textAlign: "center", lineHeight: 1.15,
            }}>{isTR ? g.tr : g.en}</span>
          </button>
        );
      })}
    </div>
  );
}

const S = {
  wrap: {
    position: "relative", width: "100%", maxWidth: 480,
    aspectRatio: "1", margin: "0 auto", flexShrink: 0,
  },
  bgGlow: {
    position: "absolute", left: "50%", top: "50%",
    transform: "translate(-50%,-50%)", width: "70%", height: "70%",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(160,120,60,.04) 0%, rgba(120,80,200,.015) 50%, transparent 75%)",
    pointerEvents: "none",
  },
  orbit: {
    position: "absolute",
    left: `${50 - R}%`, top: `${50 - R}%`,
    width: `${R * 2}%`, height: `${R * 2}%`,
    borderRadius: "50%",
    border: "1px solid rgba(210,175,80,.05)",
    pointerEvents: "none",
  },
  orbitDash: {
    position: "absolute",
    left: `${50 - R - 3}%`, top: `${50 - R - 3}%`,
    width: `${(R + 3) * 2}%`, height: `${(R + 3) * 2}%`,
    borderRadius: "50%",
    border: "1px dashed rgba(210,175,80,.025)",
    animation: "g13-orbit-spin 120s linear infinite",
    transformOrigin: "center",
    pointerEvents: "none",
  },
  svg: {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    pointerEvents: "none",
  },
  heartGlow: {
    position: "absolute", left: "50%", top: "50%",
    width: 90, height: 90, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(210,170,60,.10), transparent 65%)",
    animation: "g13-glow 5s ease-in-out infinite",
    pointerEvents: "none", zIndex: 1,
  },
  heart: {
    position: "absolute", left: "50%", top: "50%",
    fontSize: 26, color: "rgba(210,175,80,.70)",
    animation: "g13-pulse 4.5s ease-in-out infinite",
    filter: "drop-shadow(0 0 8px rgba(210,170,60,.20))",
    zIndex: 3, pointerEvents: "none", userSelect: "none",
  },
};
