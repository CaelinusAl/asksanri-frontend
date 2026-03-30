import React from "react";

/*
  Visual energy map — each gate has a unique gradient atmosphere.
  Colors are layered over a dark glass base to create distinct identities.
*/
const ENERGY = {
  sanri: {
    bg:
      "radial-gradient(ellipse 65% 70% at 20% 80%, rgba(160,100,255,.14) 0%, transparent 60%)," +
      "radial-gradient(ellipse 50% 55% at 80% 20%, rgba(120,70,220,.08) 0%, transparent 55%)",
    accent: "#b388ff",
    glow: "rgba(179,136,255,.14)",
    border: "rgba(179,136,255,.12)",
    iconGlow: "0 0 30px rgba(179,136,255,.25), 0 0 60px rgba(140,80,240,.10)",
  },
  bilinc: {
    bg:
      "radial-gradient(ellipse 60% 65% at 75% 70%, rgba(80,140,240,.12) 0%, transparent 58%)," +
      "radial-gradient(ellipse 45% 50% at 25% 25%, rgba(100,180,255,.07) 0%, transparent 50%)",
    accent: "#64b5f6",
    glow: "rgba(100,181,246,.12)",
    border: "rgba(100,181,246,.10)",
    iconGlow: "0 0 30px rgba(100,181,246,.22), 0 0 60px rgba(80,140,240,.08)",
  },
  frekans: {
    bg:
      "radial-gradient(ellipse 55% 60% at 50% 75%, rgba(255,170,50,.12) 0%, transparent 55%)," +
      "radial-gradient(ellipse 40% 45% at 70% 20%, rgba(255,200,80,.06) 0%, transparent 50%)",
    accent: "#ffb347",
    glow: "rgba(255,179,71,.12)",
    border: "rgba(255,179,71,.10)",
    iconGlow: "0 0 30px rgba(255,179,71,.25), 0 0 60px rgba(255,140,40,.10)",
  },
  rituel: {
    bg:
      "radial-gradient(ellipse 50% 55% at 30% 70%, rgba(255,100,160,.10) 0%, transparent 55%)," +
      "radial-gradient(ellipse 35% 40% at 75% 30%, rgba(255,80,140,.06) 0%, transparent 50%)",
    accent: "#ff6b9d",
    glow: "rgba(255,107,157,.10)",
    border: "rgba(255,107,157,.10)",
    iconGlow: "0 0 30px rgba(255,107,157,.20), 0 0 60px rgba(255,80,140,.08)",
  },
  yanki: {
    bg:
      "radial-gradient(ellipse 55% 60% at 60% 65%, rgba(240,160,210,.10) 0%, transparent 55%)," +
      "radial-gradient(ellipse 40% 45% at 30% 30%, rgba(255,180,220,.06) 0%, transparent 50%)",
    accent: "#f8bbd0",
    glow: "rgba(248,187,208,.10)",
    border: "rgba(248,187,208,.10)",
    iconGlow: "0 0 30px rgba(248,187,208,.20), 0 0 60px rgba(240,160,210,.08)",
  },
  library: {
    bg:
      "radial-gradient(ellipse 60% 65% at 25% 75%, rgba(255,200,100,.10) 0%, transparent 55%)," +
      "radial-gradient(ellipse 45% 50% at 80% 20%, rgba(200,170,120,.06) 0%, transparent 50%)",
    accent: "#ffd54f",
    glow: "rgba(255,213,79,.10)",
    border: "rgba(255,213,79,.10)",
    iconGlow: "0 0 30px rgba(255,213,79,.22), 0 0 60px rgba(200,170,120,.08)",
  },
  admin: {
    bg:
      "radial-gradient(ellipse 55% 60% at 70% 65%, rgba(120,140,170,.08) 0%, transparent 55%)," +
      "radial-gradient(ellipse 40% 45% at 30% 30%, rgba(160,180,200,.05) 0%, transparent 50%)",
    accent: "#90a4ae",
    glow: "rgba(144,164,174,.08)",
    border: "rgba(144,164,174,.08)",
    iconGlow: "0 0 30px rgba(144,164,174,.15), 0 0 60px rgba(120,140,170,.06)",
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
        background: "rgba(12,10,24,.60)",
        backdropFilter: "blur(16px) saturate(1.15)",
        boxShadow: `0 4px 40px rgba(0,0,0,.35), 0 8px 30px ${e.glow}, inset 0 1px 0 rgba(255,255,255,.04)`,
        animation: `g-fade-up .5s ${0.15 + delay * 0.06}s ease both`,
        minHeight: 180,
      }}
    >
      {/* Energy gradient background */}
      <div style={{
        position: "absolute", inset: 0,
        background: e.bg,
        transition: "opacity .4s",
      }} />

      {/* Top accent line — visible on hover via CSS */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${e.accent}66, transparent)`,
        opacity: 0,
        transition: "opacity .3s",
      }} className="g-card-accent" />

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
          background: `rgba(255,255,255,.04)`,
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
          color: "rgba(255,255,255,.93)",
          letterSpacing: ".01em",
        }}>
          {gate.title}
        </div>

        <div style={{
          fontSize: 13,
          color: "rgba(255,255,255,.45)",
          lineHeight: 1.6,
          minHeight: 36,
        }}>
          {gate.desc}
        </div>

        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: e.accent,
          opacity: 0.75,
          letterSpacing: ".02em",
          marginTop: 4,
          transition: "opacity .3s",
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
          background: "linear-gradient(135deg, rgba(255,200,100,.18), rgba(180,120,255,.12))",
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
