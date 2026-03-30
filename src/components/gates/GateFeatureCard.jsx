import React from "react";

const ENERGY = {
  sanri: {
    img: "/assets/gates/sanri.jpg",
    accent: "#b388ff",
    border: "rgba(255,255,255,.06)",
    hoverBorder: "rgba(179,136,255,.22)",
    hoverShadow: "0 12px 40px rgba(179,136,255,.12)",
  },
  bilinc: {
    img: "/assets/gates/bilinc.jpg",
    accent: "#64b5f6",
    border: "rgba(255,255,255,.06)",
    hoverBorder: "rgba(100,181,246,.22)",
    hoverShadow: "0 12px 40px rgba(100,181,246,.10)",
  },
  frekans: {
    img: "/assets/gates/frekans.jpg",
    accent: "#ffb347",
    border: "rgba(255,255,255,.06)",
    hoverBorder: "rgba(255,179,71,.22)",
    hoverShadow: "0 12px 40px rgba(255,179,71,.10)",
  },
  rituel: {
    img: "/assets/gates/rituel.jpg",
    accent: "#ff6b9d",
    border: "rgba(255,255,255,.06)",
    hoverBorder: "rgba(255,107,157,.22)",
    hoverShadow: "0 12px 40px rgba(255,107,157,.10)",
  },
  yanki: {
    img: "/assets/gates/sanri.jpg",
    accent: "#f8bbd0",
    border: "rgba(255,255,255,.06)",
    hoverBorder: "rgba(248,187,208,.22)",
    hoverShadow: "0 12px 40px rgba(248,187,208,.08)",
  },
  library: {
    img: "/assets/gates/kutuphane.jpg",
    accent: "#ffd54f",
    border: "rgba(255,255,255,.06)",
    hoverBorder: "rgba(255,213,79,.22)",
    hoverShadow: "0 12px 40px rgba(255,213,79,.08)",
  },
  admin: {
    img: "/assets/gates/admin.jpg",
    accent: "#90a4ae",
    border: "rgba(255,255,255,.06)",
    hoverBorder: "rgba(144,164,174,.18)",
    hoverShadow: "0 12px 40px rgba(144,164,174,.06)",
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
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        border: `1px solid ${e.border}`,
        boxShadow: "0 2px 20px rgba(0,0,0,.30)",
        animation: `g-fade-up .5s ${0.15 + delay * 0.06}s ease both`,
        minHeight: 200,
      }}
    >
      {/* Background image — SHARP, no blur */}
      <div className="g-card-bg" style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${e.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.85,
        transition: "opacity .4s ease, transform .4s ease",
      }} />

      {/* Single clean dark overlay — bottom heavy for text readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(8,10,20,.88) 0%, rgba(8,10,20,.55) 50%, rgba(8,10,20,.30) 100%)",
      }} />

      {/* Hover glow — only visible on hover */}
      <div className="g-card-glow" style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to top, ${e.accent}12, transparent 50%)`,
        opacity: 0,
        transition: "opacity .35s ease",
        pointerEvents: "none",
      }} />

      {/* Top accent line — appears on hover */}
      <div className="g-card-accent-line" style={{
        position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
        background: `linear-gradient(90deg, transparent, ${e.accent}66, transparent)`,
        opacity: 0,
        transition: "opacity .3s ease",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "26px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          background: "rgba(0,0,0,.35)",
          border: "1px solid rgba(255,255,255,.08)",
          marginBottom: 4,
          color: e.accent,
        }}>
          {gate.icon}
        </div>

        <div style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: ".01em",
        }}>
          {gate.title}
        </div>

        <div style={{
          fontSize: 13,
          color: "rgba(255,255,255,.55)",
          lineHeight: 1.55,
          minHeight: 36,
        }}>
          {gate.desc}
        </div>

        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: e.accent,
          opacity: 0.8,
          letterSpacing: ".02em",
          marginTop: 4,
        }}>
          {gate.hint} →
        </div>
      </div>

      {/* VIP badge */}
      {gate.premium && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          padding: "4px 10px",
          borderRadius: 7,
          background: "rgba(0,0,0,.45)",
          border: "1px solid rgba(255,200,100,.25)",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "1.5px",
          color: "rgba(255,220,150,.85)",
          zIndex: 3,
        }}>
          VIP
        </div>
      )}
    </div>
  );
}
