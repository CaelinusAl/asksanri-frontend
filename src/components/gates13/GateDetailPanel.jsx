import React from "react";

export default function GateDetailPanel({
  gate, energy, soul, isTR,
  onEnter, ritualOpen, onToggleRitual,
}) {
  if (!gate) return null;
  const ec = energy?.c || "180,150,100";

  return (
    <div style={S.panel}>
      {/* Header */}
      <div style={S.head}>
        <div style={{
          ...S.icon,
          borderColor: `rgba(${ec},.22)`,
          boxShadow: `0 0 18px rgba(${ec},.08)`,
          background: `radial-gradient(circle, rgba(${ec},.10), rgba(${ec},.02))`,
        }}>
          {energy?.s || "○"}
        </div>
        <div>
          <div style={S.name}>{gate.sehir}</div>
          <div style={S.sub}>{gate.baslik} — {gate.tanrica}</div>
        </div>
      </div>

      {/* Tags */}
      <div style={S.tags}>
        {[gate.faz, gate.element].filter(Boolean).map((t, i) => (
          <span key={i} style={{
            ...S.tag,
            borderColor: `rgba(${ec},.14)`,
            background: `rgba(${ec},.05)`,
            color: `rgba(${ec},.85)`,
          }}>{t}</span>
        ))}
      </div>

      {/* Soul description */}
      <div style={S.soul}>
        <p style={S.soulP}>{isTR ? soul?.tr : soul?.en}</p>
      </div>

      {/* Trigger question */}
      <div style={S.trigger}>
        <div style={S.trigLabel}>{isTR ? "TETİK SORU" : "TRIGGER QUESTION"}</div>
        <div style={{
          ...S.trigText,
          background: `linear-gradient(90deg, rgba(${ec},1), rgba(255,255,255,.7))`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          &ldquo;{isTR ? soul?.tqTR : soul?.tqEN}&rdquo;
        </div>
      </div>

      {/* Micro ritual */}
      <div style={S.ritual}>
        <button className="g13-detail-btn" style={S.ritBtn} onClick={onToggleRitual}>
          <span>{isTR ? "Mikro Ritüel" : "Micro Ritual"}</span>
          <span style={{ fontSize: 10 }}>{ritualOpen ? "▲" : "▼"}</span>
        </button>
        {ritualOpen && (
          <div style={S.ritBody}>{isTR ? soul?.rTR : soul?.rEN}</div>
        )}
      </div>

      {/* CTA */}
      <div style={S.ctaWrap}>
        <button className="g13-cta" style={{
          ...S.ctaBtn,
          background: `linear-gradient(135deg, rgba(${ec},1), rgba(${ec},.7))`,
          boxShadow: `0 0 22px rgba(${ec},.16), 0 4px 14px rgba(0,0,0,.25)`,
        }} onClick={onEnter}>
          {energy?.s || "✦"} {isTR ? "Bu Kapıdan Geç" : "Enter This Gate"}
        </button>
        <p style={S.ctaHint}>
          {isTR
            ? "SANRI bu kapının bilincinden konuşacak."
            : "SANRI will speak from this gate."}
        </p>
      </div>
    </div>
  );
}

const S = {
  panel: {
    maxHeight: "68vh",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,.06) transparent",
  },

  head: {
    display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
  },
  icon: {
    width: 50, height: 50,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, borderRadius: "50%",
    border: "1px solid", flexShrink: 0,
  },
  name: {
    fontSize: 22, fontWeight: 900, letterSpacing: ".04em", color: "#fff",
  },
  sub: {
    fontSize: 11, opacity: .4, marginTop: 2,
  },

  tags: {
    display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap",
  },
  tag: {
    padding: "4px 10px", borderRadius: 999,
    fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase",
    border: "1px solid",
  },

  soul: {
    marginBottom: 18, padding: 18, borderRadius: 14,
    background: "linear-gradient(135deg, rgba(210,175,80,.035), rgba(210,175,80,.01))",
    border: "1px solid rgba(210,175,80,.05)",
  },
  soulP: {
    fontSize: 14, lineHeight: 1.75, margin: 0, opacity: .8,
  },

  trigger: {
    marginBottom: 18, padding: 18, borderRadius: 14,
    background: "rgba(0,0,0,.18)",
    border: "1px solid rgba(210,175,80,.06)",
    textAlign: "center",
  },
  trigLabel: {
    fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase",
    opacity: .3, marginBottom: 8,
  },
  trigText: {
    fontSize: 17, fontWeight: 700, lineHeight: 1.5,
  },

  ritual: {
    marginBottom: 18,
    border: "1px solid rgba(255,255,255,.05)",
    borderRadius: 12, overflow: "hidden",
  },
  ritBtn: {
    width: "100%", display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "11px 14px",
    background: "rgba(255,255,255,.025)", border: "none",
    color: "rgba(255,255,255,.55)", cursor: "pointer", fontSize: 12,
  },
  ritBody: {
    padding: "12px 14px", fontSize: 13, lineHeight: 1.7,
    opacity: .65, borderTop: "1px solid rgba(255,255,255,.04)",
  },

  ctaWrap: { textAlign: "center", paddingTop: 6 },
  ctaBtn: {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: "14px 28px", border: "none", borderRadius: 14,
    fontSize: 14, fontWeight: 800, cursor: "pointer",
    color: "#06070b",
    transition: "transform .2s, box-shadow .2s",
  },
  ctaHint: {
    marginTop: 8, fontSize: 11, opacity: .3, fontStyle: "italic",
  },
};
