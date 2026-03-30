import React from "react";
import GateBadge from "./GateBadge";

export default function GatesHeroCard({ gate, onClick, isTR }) {
  if (!gate) return null;

  return (
    <div
      className="g-hero-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
      style={{
        ...S.wrap,
        animation: "g-fade-up .6s .1s ease both",
      }}
    >
      {/* Background image — SHARP */}
      <div style={S.bgImage} className="g-hero-bg" />

      {/* Single clean overlay — left side darker for text */}
      <div style={S.overlay} />

      {/* Hover glow — only on hover */}
      <div className="g-hero-glow-overlay" style={S.hoverGlow} />

      {/* Subtle shimmer */}
      <div style={S.shimmerWrap}>
        <div style={S.shimmer} />
      </div>

      {/* Content */}
      <div className="g-hero-inner" style={S.inner}>
        <GateBadge color="rgba(255,210,120,.90)">
          {isTR ? "ANADOLU RUHU" : "SOUL OF ANATOLIA"}
        </GateBadge>

        <h2 className="g-hero-title" style={S.title}>{gate.title}</h2>
        <p style={S.desc}>{gate.desc}</p>

        <div style={S.cta}>
          <span style={S.ctaText}>{gate.hint}</span>
          <span style={S.ctaArrow}>→</span>
        </div>
      </div>
    </div>
  );
}

const S = {
  wrap: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    cursor: "pointer",
    marginBottom: 28,
    minHeight: 260,
    border: "1px solid rgba(255,255,255,.07)",
    boxShadow: "0 2px 30px rgba(0,0,0,.35)",
  },

  bgImage: {
    position: "absolute", inset: 0,
    backgroundImage: "url(/assets/gates/anadolu.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.9,
    transition: "opacity .5s ease, transform .5s ease",
  },

  overlay: {
    position: "absolute", inset: 0,
    background:
      "linear-gradient(90deg, rgba(8,10,20,.85) 0%, rgba(8,10,20,.55) 50%, rgba(8,10,20,.20) 100%), " +
      "linear-gradient(to top, rgba(8,10,20,.50) 0%, transparent 40%)",
  },

  hoverGlow: {
    position: "absolute", inset: 0,
    background: "linear-gradient(90deg, transparent 40%, rgba(255,200,100,.06) 70%, transparent 100%)",
    opacity: 0,
    transition: "opacity .4s ease",
    pointerEvents: "none",
  },

  shimmerWrap: {
    position: "absolute", inset: 0,
    overflow: "hidden",
    borderRadius: 24,
  },
  shimmer: {
    position: "absolute",
    top: 0, left: 0,
    width: "40%", height: "100%",
    background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,.02) 50%, transparent 65%)",
    animation: "g-hero-shimmer 8s 3s ease-in-out infinite",
  },

  inner: {
    position: "relative", zIndex: 2,
    padding: "40px 38px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1.2,
    marginTop: 4,
  },
  desc: {
    fontSize: 15,
    color: "rgba(255,255,255,.60)",
    lineHeight: 1.6,
    maxWidth: 420,
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    padding: "9px 20px",
    borderRadius: 10,
    border: "1px solid rgba(255,200,100,.18)",
    background: "rgba(0,0,0,.30)",
    width: "fit-content",
    transition: "all .3s",
  },
  ctaText: {
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,210,130,.85)",
    letterSpacing: ".02em",
  },
  ctaArrow: {
    fontSize: 15,
    color: "rgba(255,210,130,.60)",
  },
};
