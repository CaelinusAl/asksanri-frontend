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
      {/* ── Gradient artwork layers ── */}
      <div style={S.artBase} />
      <div style={S.artGold} />
      <div style={S.artRing1} />
      <div style={S.artRing2} />
      <div style={S.artPurple} />
      <div style={S.artRose} />
      <div style={S.artVignette} />

      {/* Shimmer sweep */}
      <div style={S.shimmerWrap}>
        <div style={S.shimmer} />
      </div>

      {/* Purple underglow */}
      <div style={S.underglow} />

      {/* ── Content ── */}
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
    borderRadius: 28,
    overflow: "hidden",
    cursor: "pointer",
    marginBottom: 32,
    minHeight: 260,
    border: "1px solid rgba(255,200,100,.12)",
    boxShadow:
      "0 4px 50px rgba(0,0,0,.4), " +
      "0 8px 40px rgba(255,180,60,.06), " +
      "0 16px 60px rgba(140,80,240,.05), " +
      "inset 0 1px 0 rgba(255,255,255,.05)",
  },

  /* Gradient art layers — create cosmic heart/energy without images */
  artBase: {
    position: "absolute", inset: 0,
    background: "linear-gradient(135deg, rgba(20,15,40,.95) 0%, rgba(15,12,30,.90) 50%, rgba(25,18,45,.92) 100%)",
  },
  artGold: {
    position: "absolute", inset: 0,
    background:
      "radial-gradient(ellipse 55% 70% at 65% 50%, rgba(255,180,60,.16) 0%, rgba(255,140,40,.06) 40%, transparent 70%)",
    animation: "g-hero-pulse 6s ease-in-out infinite",
  },
  artRing1: {
    position: "absolute",
    top: "50%", left: "60%",
    transform: "translate(-50%,-50%)",
    width: 320, height: 320,
    borderRadius: "50%",
    border: "1px solid rgba(255,200,100,.08)",
    boxShadow: "0 0 40px rgba(255,180,60,.04), inset 0 0 40px rgba(255,180,60,.03)",
  },
  artRing2: {
    position: "absolute",
    top: "50%", left: "60%",
    transform: "translate(-50%,-50%)",
    width: 200, height: 200,
    borderRadius: "50%",
    border: "1px solid rgba(255,200,100,.06)",
    boxShadow: "0 0 60px rgba(255,200,100,.06), inset 0 0 30px rgba(255,180,60,.04)",
    animation: "g-hero-pulse 4s 1s ease-in-out infinite",
  },
  artPurple: {
    position: "absolute", inset: 0,
    background:
      "radial-gradient(ellipse 40% 60% at 15% 60%, rgba(160,100,255,.12) 0%, transparent 60%)," +
      "radial-gradient(ellipse 30% 40% at 85% 20%, rgba(140,80,240,.08) 0%, transparent 55%)",
  },
  artRose: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse 25% 35% at 50% 15%, rgba(255,120,180,.05) 0%, transparent 60%)",
  },
  artVignette: {
    position: "absolute", inset: 0,
    background: "linear-gradient(90deg, rgba(10,8,20,.7) 0%, transparent 45%, rgba(10,8,20,.3) 100%)",
  },

  shimmerWrap: {
    position: "absolute", inset: 0,
    overflow: "hidden",
    borderRadius: 28,
  },
  shimmer: {
    position: "absolute",
    top: 0, left: 0,
    width: "50%", height: "100%",
    background: "linear-gradient(105deg, transparent 30%, rgba(255,220,150,.04) 50%, transparent 70%)",
    animation: "g-hero-shimmer 6s 2s ease-in-out infinite",
  },

  underglow: {
    position: "absolute",
    bottom: -20, left: "50%",
    transform: "translateX(-50%)",
    width: "70%", height: 60,
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(255,180,60,.14) 0%, rgba(160,100,240,.06) 50%, transparent 80%)",
    filter: "blur(24px)",
    zIndex: -1,
  },

  inner: {
    position: "relative", zIndex: 2,
    padding: "44px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1.2,
    marginTop: 4,
    textShadow: "0 2px 20px rgba(0,0,0,.4)",
  },
  desc: {
    fontSize: 15,
    color: "rgba(255,255,255,.60)",
    lineHeight: 1.65,
    maxWidth: 460,
    textShadow: "0 1px 8px rgba(0,0,0,.3)",
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    padding: "10px 22px",
    borderRadius: 12,
    border: "1px solid rgba(255,200,100,.20)",
    background: "rgba(255,200,100,.08)",
    width: "fit-content",
    transition: "all .3s",
  },
  ctaText: {
    fontSize: 14,
    fontWeight: 700,
    color: "rgba(255,210,130,.90)",
    letterSpacing: ".02em",
  },
  ctaArrow: {
    fontSize: 16,
    color: "rgba(255,210,130,.70)",
    transition: "transform .3s",
  },
};
