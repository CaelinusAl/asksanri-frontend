import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trackFunnelEvent } from "../data/funnelTracker";
import SeoHead from "../components/SeoHead";

const S = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse 800px 500px at 50% 20%, rgba(140,80,240,.12), transparent 70%), linear-gradient(180deg, #07080d 0%, #0a0c18 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 16px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#e8e4f0",
  },
  hero: {
    textAlign: "center",
    maxWidth: 520,
    paddingTop: "clamp(60px, 12vh, 120px)",
  },
  badge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: 20,
    border: "1px solid rgba(157,78,221,0.3)",
    background: "rgba(157,78,221,0.08)",
    color: "#bb86fc",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    marginBottom: 20,
  },
  title: {
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: 800,
    lineHeight: 1.15,
    margin: "0 0 16px",
    background: "linear-gradient(135deg, #e8e4f0, #bb86fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "clamp(15px, 2.5vw, 18px)",
    lineHeight: 1.65,
    color: "rgba(255,255,255,0.6)",
    margin: "0 0 32px",
  },
  cta: {
    display: "inline-block",
    padding: "16px 44px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #7b2ff7, #bb86fc)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "transform 0.2s, box-shadow 0.2s",
    textDecoration: "none",
    marginBottom: 12,
  },
  subCta: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 40,
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    maxWidth: 560,
    width: "100%",
    padding: "0 0 60px",
  },
  card: {
    padding: "20px 18px",
    borderRadius: 14,
    border: "1px solid rgba(157,78,221,0.15)",
    background: "rgba(255,255,255,0.03)",
    textAlign: "center",
  },
  cardIcon: { fontSize: 24, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "#e0d4f5", marginBottom: 4 },
  cardDesc: { fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 },
  proof: {
    fontSize: 13,
    color: "rgba(200,160,255,0.5)",
    textAlign: "center",
    paddingBottom: 40,
  },
};

const FEATURES = [
  { icon: "\u2728", title: "\u0130sim Analizi", desc: "Ad\u0131n\u0131n ta\u015f\u0131d\u0131\u011f\u0131 gizli frekans" },
  { icon: "\u{1f52e}", title: "Ya\u015fam Yolu", desc: "Do\u011fum tarihinle \u00e7izilen harita" },
  { icon: "\u{1f300}", title: "7 Katman", desc: "Y\u00fczeyden derine, katman katman" },
  { icon: "\u{1f510}", title: "Ki\u015fiye \u00d6zel", desc: "Sadece sana ait derin okuma" },
];

export default function LandingRolOkumaPage() {
  const navigate = useNavigate();

  useEffect(() => {
    trackFunnelEvent("landing_rol_okuma_view");
  }, []);

  const handleCta = () => {
    trackFunnelEvent("landing_rol_okuma_cta_click");
    navigate("/rol-okuma");
  };

  return (
    <div style={S.page}>
      <SeoHead
        title="Matrix Rol Okuma \u2014 7 Katmanl\u0131 Derin Analiz"
        description="Do\u011fum tarihin, ismin ve ya\u015fam yolunun 7 katmanl\u0131 derin analizi. SANRI ile g\u00f6r\u00fcnenin alt\u0131ndaki katman\u0131 a\u00e7."
        path="/d/rol-okuma"
      />
      <div style={S.hero}>
        <div style={S.badge}>SANRI \u2014 Bilin\u00e7 ve Anlam Zekas\u0131</div>
        <h1 style={S.title}>G\u00f6r\u00fcnenin Alt\u0131ndaki Katman\u0131 A\u00e7</h1>
        <p style={S.subtitle}>
          Do\u011fum tarihin, ismin ve ya\u015fam yolunun 7 katmanl\u0131 derin analizi.
          Bu bir fal de\u011fil \u2014 bu senin kodlar\u0131n\u0131n \u00e7\u00f6z\u00fcm\u00fc.
        </p>
        <button style={S.cta} onClick={handleCta}>
          Okumam\u0131 Ba\u015flat
        </button>
        <p style={S.subCta}>2 dakikada sonu\u00e7 \u2022 Hesap gerekmez</p>
      </div>
      <div style={S.features}>
        {FEATURES.map((f) => (
          <div key={f.title} style={S.card}>
            <div style={S.cardIcon}>{f.icon}</div>
            <div style={S.cardTitle}>{f.title}</div>
            <div style={S.cardDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
      <p style={S.proof}>327+ ki\u015fi bu okumaya eri\u015fim ald\u0131</p>
    </div>
  );
}
