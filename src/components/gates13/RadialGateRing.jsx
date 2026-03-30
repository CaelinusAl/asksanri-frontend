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

const R = 40;
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
    @keyframes g13-pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6}50%{transform:translate(-50%,-50%) scale(1.08);opacity:.9}}
    @keyframes g13-glow{0%,100%{opacity:.12;transform:translate(-50%,-50%) scale(1)}50%{opacity:.22;transform:translate(-50%,-50%) scale(1.08)}}
    @keyframes g13-appear{from{opacity:0}to{opacity:1}}

    .g13-node{transition:border-color .25s,background .25s,box-shadow .25s,transform .25s!important;backdrop-filter:blur(14px) saturate(1.2);-webkit-backdrop-filter:blur(14px) saturate(1.2)}
    .g13-node:not(.g13-on):hover{border-color:rgba(210,180,100,.35)!important;background:rgba(12,10,6,.75)!important;box-shadow:0 0 18px rgba(210,175,80,.12)!important;transform:translate(-50%,-50%) scale(1.05)!important}
    .g13-node:focus-visible{outline:2px solid rgba(210,175,80,.35);outline-offset:2px}
    .g13-on{border-color:rgba(210,180,100,.50)!important;background:rgba(18,14,8,.82)!important;box-shadow:0 0 22px rgba(210,175,80,.16),inset 0 0 12px rgba(210,175,80,.03)!important;transform:translate(-50%,-50%) scale(1.06)!important;z-index:5!important}
    .g13-on:hover{box-shadow:0 0 28px rgba(210,175,80,.20),inset 0 0 14px rgba(210,175,80,.04)!important}
    .g13-detail-btn:hover{background:rgba(255,255,255,.05)!important}
    .g13-cta:hover{transform:translateY(-2px)!important;box-shadow:0 0 32px rgba(210,175,80,.30),0 6px 20px rgba(0,0,0,.30)!important}
    .g13-glass-panel{backdrop-filter:blur(20px) saturate(1.15);-webkit-backdrop-filter:blur(20px) saturate(1.15)}
  `;
  document.head.appendChild(el);
}

export default function RadialGateRing({ activeKey = "0", onSelect, isTR }) {
  useEffect(injectCSS, []);

  return (
    <div style={S.wrap}>
      {/* Single orbit ring */}
      <div style={S.orbit} />

      {/* Center heart — minimal */}
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
              width: "clamp(58px, 14vw, 76px)",
              height: "clamp(70px, 17vw, 92px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 6,
              borderRadius: 14,
              border: "1px solid rgba(210,180,100,.12)",
              background: "rgba(6,5,12,.60)",
              boxShadow: "0 2px 12px rgba(0,0,0,.30)",
              cursor: "pointer", outline: "none", padding: 0,
              zIndex: 2,
              animation: `g13-appear .3s ${i * 0.04}s ease both`,
            }}
          >
            <span style={{
              fontSize: "clamp(18px, 4.2vw, 24px)",
              color: on ? "rgba(230,200,110,.95)" : "rgba(210,185,100,.40)",
              transition: "color .25s", lineHeight: 1,
            }}>{g.icon}</span>
            <span style={{
              fontSize: "clamp(7px, 1.8vw, 9px)",
              fontWeight: 800, letterSpacing: ".12em",
              color: on ? "rgba(255,245,210,.90)" : "rgba(255,245,210,.28)",
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
    position: "relative", width: "100%", maxWidth: 560,
    aspectRatio: "1", margin: "0 auto", flexShrink: 0,
  },
  orbit: {
    position: "absolute",
    left: `${50 - R}%`, top: `${50 - R}%`,
    width: `${R * 2}%`, height: `${R * 2}%`,
    borderRadius: "50%",
    border: "1px solid rgba(210,180,100,.06)",
    pointerEvents: "none",
  },
  heartGlow: {
    position: "absolute", left: "50%", top: "50%",
    width: 80, height: 80, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(210,170,60,.10), transparent 65%)",
    animation: "g13-glow 5s ease-in-out infinite",
    pointerEvents: "none", zIndex: 1,
  },
  heart: {
    position: "absolute", left: "50%", top: "50%",
    fontSize: 24, color: "rgba(220,190,100,.70)",
    animation: "g13-pulse 5s ease-in-out infinite",
    filter: "drop-shadow(0 0 6px rgba(210,170,60,.18))",
    zIndex: 3, pointerEvents: "none", userSelect: "none",
  },
};
