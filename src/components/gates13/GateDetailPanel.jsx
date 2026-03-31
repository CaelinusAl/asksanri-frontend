import React from "react";
import { getGateImage } from "../../utils/assetMap";

export default function GateDetailPanel({
  gate, energy, soul, isTR,
  onEnter, ritualOpen, onToggleRitual,
}) {
  if (!gate) return null;
  const ec = energy?.c || "180,150,100";
  const heroImg = getGateImage(gate.key);

  return (
    <div className="g13-glass-panel" style={S.card}>
      {heroImg && (
        <div style={S.heroBand}>
          <img src={heroImg} alt="" style={S.heroImg} />
          <div style={S.heroOverlay} />
        </div>
      )}

      <div style={{ ...S.body, paddingTop: heroImg ? 20 : 36 }}>
        {/* Header */}
        <div style={S.head}>
          <div style={{
            ...S.icon,
            borderColor: `rgba(${ec},.22)`,
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
              borderColor: `rgba(${ec},.15)`,
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
            background: `linear-gradient(135deg, rgba(${ec},1), rgba(${ec},.75))`,
            boxShadow: `0 0 20px rgba(${ec},.18), 0 4px 14px rgba(0,0,0,.25)`,
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
    </div>
  );
}

const S = {
  card: {
    background: "rgba(6,5,14,.60)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 20,
    maxHeight: "72vh",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,.06) transparent",
    boxShadow: "0 4px 30px rgba(0,0,0,.25)",
  },

  heroBand: {
    position: "relative", width: "100%", height: 130,
    overflow: "hidden", flexShrink: 0,
  },
  heroImg: {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    objectFit: "cover", objectPosition: "center 40%",
  },
  heroOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to top, rgba(6,5,14,.92) 0%, rgba(6,5,14,.35) 55%, rgba(6,5,14,.15) 100%)",
  },

  body: {
    padding: "0 32px 32px",
  },

  head: {
    display: "flex", alignItems: "center", gap: 16, marginBottom: 24,
  },
  icon: {
    width: 48, height: 48,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, borderRadius: "50%",
    border: "1px solid", flexShrink: 0,
  },
  name: {
    fontSize: 20, fontWeight: 900, letterSpacing: ".04em", color: "#fff",
  },
  sub: {
    fontSize: 11, opacity: .40, marginTop: 3,
  },

  tags: {
    display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap",
  },
  tag: {
    padding: "5px 12px", borderRadius: 999,
    fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase",
    border: "1px solid",
  },

  soul: {
    marginBottom: 24, padding: 20, borderRadius: 14,
    background: "rgba(255,255,255,.025)",
    border: "1px solid rgba(255,255,255,.04)",
  },
  soulP: {
    fontSize: 14, lineHeight: 1.85, margin: 0, opacity: .80,
  },

  trigger: {
    marginBottom: 24, padding: 22, borderRadius: 14,
    background: "rgba(0,0,0,.15)",
    border: "1px solid rgba(255,255,255,.04)",
    textAlign: "center",
  },
  trigLabel: {
    fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase",
    opacity: .28, marginBottom: 10,
  },
  trigText: {
    fontSize: 17, fontWeight: 700, lineHeight: 1.55,
  },

  ritual: {
    marginBottom: 24,
    border: "1px solid rgba(255,255,255,.04)",
    borderRadius: 14, overflow: "hidden",
  },
  ritBtn: {
    width: "100%", display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "13px 18px",
    background: "rgba(255,255,255,.02)", border: "none",
    color: "rgba(255,255,255,.50)", cursor: "pointer", fontSize: 12,
  },
  ritBody: {
    padding: "16px 18px", fontSize: 13, lineHeight: 1.8,
    opacity: .60, borderTop: "1px solid rgba(255,255,255,.04)",
  },

  ctaWrap: { textAlign: "center", paddingTop: 10 },
  ctaBtn: {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: "16px 32px", border: "none", borderRadius: 14,
    fontSize: 15, fontWeight: 800, cursor: "pointer",
    color: "#06070b",
    transition: "transform .2s, box-shadow .2s",
  },
  ctaHint: {
    marginTop: 10, fontSize: 11, opacity: .25, fontStyle: "italic",
  },
};
