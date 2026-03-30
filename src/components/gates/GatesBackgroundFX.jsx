import React, { useRef } from "react";

/* ═══════════════════════════════════════════════════════
   SHARED KEYFRAMES for all gate components
   Injected once into <head>
   ═══════════════════════════════════════════════════════ */
const CSS_ID = "sanri-gates-fx";
if (typeof document !== "undefined" && !document.getElementById(CSS_ID)) {
  const s = document.createElement("style");
  s.id = CSS_ID;
  s.textContent = `
    @keyframes g-nebula-drift {
      0%, 100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(1.5%,-1%) scale(1.02); }
      66%      { transform: translate(-1%,0.8%) scale(0.98); }
    }
    @keyframes g-star-twinkle {
      0%, 100% { opacity: .2; }
      50%      { opacity: .75; }
    }
    @keyframes g-hero-shimmer {
      0%   { transform: translateX(-120%) rotate(15deg); }
      100% { transform: translateX(120%) rotate(15deg); }
    }
    @keyframes g-hero-pulse {
      0%, 100% { opacity: .55; transform: scale(1); }
      50%      { opacity: .85; transform: scale(1.04); }
    }
    @keyframes g-aurora-flow {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes g-ring-spin {
      from { transform: translate(-50%,-50%) rotate(0deg); }
      to   { transform: translate(-50%,-50%) rotate(360deg); }
    }
    @keyframes g-fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .g-hero-card {
      transition: all .45s cubic-bezier(.23,1,.32,1);
    }
    .g-hero-card:hover {
      transform: translateY(-5px);
      box-shadow:
        0 8px 60px rgba(255,180,60,.12),
        0 2px 30px rgba(160,100,240,.10),
        inset 0 1px 0 rgba(255,255,255,.06) !important;
    }
    .g-hero-card:focus-visible {
      outline: 2px solid rgba(255,200,100,.5);
      outline-offset: 4px;
    }

    .g-card {
      transition: all .4s cubic-bezier(.23,1,.32,1);
    }
    .g-card:hover {
      transform: translateY(-6px) scale(1.012);
    }
    .g-card:focus-visible {
      outline: 2px solid rgba(179,136,255,.5);
      outline-offset: 4px;
    }

    @media (max-width: 900px) {
      .g-grid { grid-template-columns: repeat(2,1fr) !important; }
      .g-hero-inner { padding: 36px 28px !important; }
    }
    @media (max-width: 600px) {
      .g-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
      .g-hero-inner { padding: 28px 20px !important; }
      .g-hero-title { font-size: 24px !important; }
      .g-section-title { font-size: 32px !important; }
    }
  `;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════════
   COSMIC BACKGROUND — nebulae, stars, aurora
   ═══════════════════════════════════════════════════════ */
export default function GatesBackgroundFX() {
  const stars = useRef(
    Array.from({ length: 50 }, () => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      s: 1 + Math.random() * 1.5,
      d: `${Math.random() * 5}s`,
      dur: `${2 + Math.random() * 4}s`,
    }))
  ).current;

  return (
    <div aria-hidden="true" style={{
      position: "fixed", inset: 0, overflow: "hidden",
      pointerEvents: "none", zIndex: 0,
    }}>
      {/* Nebula layer — slow drift */}
      <div style={{
        position: "absolute", inset: "-15%",
        animation: "g-nebula-drift 25s ease-in-out infinite",
      }}>
        {/* Purple nebula — top left */}
        <div style={{
          position: "absolute", top: "2%", left: "5%",
          width: 700, height: 550, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(140,80,240,.14) 0%, rgba(120,60,220,.06) 40%, transparent 65%)",
          filter: "blur(50px)",
        }} />
        {/* Gold nebula — center right */}
        <div style={{
          position: "absolute", top: "35%", right: "0%",
          width: 550, height: 450, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,180,60,.07) 0%, rgba(255,140,40,.03) 40%, transparent 65%)",
          filter: "blur(45px)",
        }} />
        {/* Deep purple — bottom */}
        <div style={{
          position: "absolute", bottom: "0%", left: "25%",
          width: 800, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100,50,180,.10) 0%, rgba(80,30,160,.04) 40%, transparent 60%)",
          filter: "blur(60px)",
        }} />
        {/* Rose accent — top right */}
        <div style={{
          position: "absolute", top: "10%", right: "15%",
          width: 350, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,100,180,.06) 0%, transparent 60%)",
          filter: "blur(35px)",
        }} />
      </div>

      {/* Stars */}
      {stars.map((st, i) => (
        <div key={i} style={{
          position: "absolute", left: st.x, top: st.y,
          width: st.s, height: st.s, borderRadius: "50%",
          background: "rgba(255,255,255,.65)",
          animation: `g-star-twinkle ${st.dur} ${st.d} ease-in-out infinite`,
        }} />
      ))}

      {/* Vignette overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(6,7,16,.6) 100%)",
      }} />
    </div>
  );
}
