import React from "react";

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
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        boxShadow:
          `0 4px 40px rgba(0,0,0,.40), ` +
          `0 8px 30px ${e.glow}, ` +
          `inset 0 1px 0 rgba(255,255,255,.05), ` +
          `inset 0 -1px 0 rgba(255,255,255,.02)`,
        animation: `g-fade-up .5s ${0.15 + delay * 0.06}s ease both`,
        minHeight: 200,
      }}
    >
      {/* Background image — blurred, decorative */}
      <div className="g-card-bg" style={{
        position: "absolute", inset: -10,
        backgroundImage: `url(${e.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(6px) saturate(1.3)",
        opacity: 0.6,
        transition: "filter .5s ease, opacity .5s ease, transform .5s ease",
        transform: "scale(1.06)",
      }} />

      {/* Multi-layer gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background:
          `linear-gradient(160deg, ${e.overlayTint} 0%, rgba(10,10,20,.85) 100%), ` +
          `linear-gradient(to top, rgba(0,0,0,.4) 0%, transparent 50%)`,
      }} />

      {/* Glassmorphism frost layer */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(12,10,24,.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }} />

      {/* Corner energy accents */}
      <div style={{
        position: "absolute", inset: 0,
        background:
          `radial-gradient(ellipse 70% 60% at 85% 95%, ${e.accent}1a, transparent 55%), ` +
          `radial-gradient(ellipse 40% 35% at 10% 10%, ${e.accent}0d, transparent 50%)`,
        pointerEvents: "none",
      }} />

      {/* Hover glow — intensifies on hover via CSS class */}
      <div className="g-card-glow" style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 70% at 50% 100%, ${e.accent}18, transparent 60%)`,
        opacity: 0,
        transition: "opacity .4s ease",
        pointerEvents: "none",
      }} />

      {/* Top accent line — appears on hover */}
      <div className="g-card-accent-line" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent 10%, ${e.accent}88, transparent 90%)`,
        opacity: 0,
        transition: "opacity .35s ease",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "28px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          background: "rgba(0,0,0,.30)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
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
          textShadow: "0 2px 12px rgba(0,0,0,.5)",
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
          WebkitBackdropFilter: "blur(8px)",
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
