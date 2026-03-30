import React from "react";

/*
  Visual energy + background image map per gate.
  Images are decorative: blurred, dark overlay, atmosphere only.
*/
const ENERGY = {
  sanri: {
    img: "/assets/gates/sanri.jpg",
    accent: "#b388ff",
    glow: "rgba(179,136,255,.14)",
    border: "rgba(179,136,255,.12)",
    iconGlow: "0 0 30px rgba(179,136,255,.25), 0 0 60px rgba(140,80,240,.10)",
    overlayTint: "rgba(30,15,60,.75)",
  },
  bilinc: {
    img: "/assets/gates/bilinc.jpg",
    accent: "#64b5f6",
    glow: "rgba(100,181,246,.12)",
    border: "rgba(100,181,246,.10)",
    iconGlow: "0 0 30px rgba(100,181,246,.22), 0 0 60px rgba(80,140,240,.08)",
    overlayTint: "rgba(10,20,50,.75)",
  },
  frekans: {
    img: "/assets/gates/frekans.jpg",
    accent: "#ffb347",
    glow: "rgba(255,179,71,.12)",
    border: "rgba(255,179,71,.10)",
    iconGlow: "0 0 30px rgba(255,179,71,.25), 0 0 60px rgba(255,140,40,.10)",
    overlayTint: "rgba(40,20,10,.75)",
  },
  rituel: {
    img: "/assets/gates/rituel.jpg",
    accent: "#ff6b9d",
    glow: "rgba(255,107,157,.10)",
    border: "rgba(255,107,157,.10)",
    iconGlow: "0 0 30px rgba(255,107,157,.20), 0 0 60px rgba(255,80,140,.08)",
    overlayTint: "rgba(40,10,25,.75)",
  },
  yanki: {
    img: "/assets/gates/sanri.jpg",
    accent: "#f8bbd0",
    glow: "rgba(248,187,208,.10)",
    border: "rgba(248,187,208,.10)",
    iconGlow: "0 0 30px rgba(248,187,208,.20), 0 0 60px rgba(240,160,210,.08)",
    overlayTint: "rgba(35,15,35,.75)",
  },
  library: {
    img: "/assets/gates/kutuphane.jpg",
    accent: "#ffd54f",
    glow: "rgba(255,213,79,.10)",
    border: "rgba(255,213,79,.10)",
    iconGlow: "0 0 30px rgba(255,213,79,.22), 0 0 60px rgba(200,170,120,.08)",
    overlayTint: "rgba(35,25,10,.75)",
  },
  admin: {
    img: "/assets/gates/admin.jpg",
    accent: "#90a4ae",
    glow: "rgba(144,164,174,.08)",
    border: "rgba(144,164,174,.08)",
    iconGlow: "0 0 30px rgba(144,164,174,.15), 0 0 60px rgba(120,140,170,.06)",
    overlayTint: "rgba(15,18,25,.80)",
  },
};

const FALLBACK = ENERGY.sanri;

export default function GateFeatureCard({ gate, onClick, delay = 0 }) {
  const e = ENERGY[gate.accent] || FALLBACK;

  return (
    <div
      className="g-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") onClick?.(); }}
      style={{
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        cursor: "pointer",
        border: `1px solid ${e.border}`,
        boxShadow: `0 4px 40px rgba(0,0,0,.35), 0 8px 30px ${e.glow}, inset 0 1px 0 rgba(255,255,255,.04)`,
        animation: `g-fade-up .5s ${0.15 + delay * 0.06}s ease both`,
        minHeight: 200,
      }}
    >
      {/* Background image — blurred, decorative */}
      <div style={{
        position: "absolute", inset: -8,
        backgroundImage: `url(${e.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(6px)",
        opacity: 0.65,
        transition: "filter .5s ease, opacity .5s ease, transform .5s ease",
        transform: "scale(1.05)",
      }} className="g-card-bg" />

      {/* Dark gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(160deg, ${e.overlayTint} 0%, rgba(10,10,20,.88) 100%)`,
        transition: "opacity .4s",
      }} />

      {/* Inner glow accent */}
      <div style={{
        position: "absolute", inset: 0,
        background:
          `radial-gradient(ellipse 60% 50% at 80% 90%, ${e.accent}18, transparent 60%)`,
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "28px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        {/* Icon with glow */}
        <div style={{
          width: 44, height: 44,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          background: "rgba(0,0,0,.25)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${e.border}`,
          boxShadow: e.iconGlow,
          marginBottom: 4,
          color: e.accent,
        }}>
          {gate.icon}
        </div>

        <div style={{
          fontSize: 18,
          fontWeight: 800,
          color: "rgba(255,255,255,.95)",
          letterSpacing: ".01em",
          textShadow: "0 2px 10px rgba(0,0,0,.5)",
        }}>
          {gate.title}
        </div>

        <div style={{
          fontSize: 13,
          color: "rgba(255,255,255,.55)",
          lineHeight: 1.6,
          minHeight: 36,
          textShadow: "0 1px 6px rgba(0,0,0,.4)",
        }}>
          {gate.desc}
        </div>

        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: e.accent,
          opacity: 0.85,
          letterSpacing: ".02em",
          marginTop: 4,
          transition: "opacity .3s",
          textShadow: "0 1px 8px rgba(0,0,0,.4)",
        }}>
          {gate.hint} →
        </div>
      </div>

      {/* VIP badge */}
      {gate.premium && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          padding: "4px 10px",
          borderRadius: 8,
          background: "linear-gradient(135deg, rgba(255,200,100,.22), rgba(180,120,255,.15))",
          border: "1px solid rgba(255,200,100,.30)",
          backdropFilter: "blur(8px)",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "1.5px",
          color: "rgba(255,220,150,.90)",
          zIndex: 3,
        }}>
          VIP
        </div>
      )}
    </div>
  );
}
