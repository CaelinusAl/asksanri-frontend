import React from "react";
import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";

const POSTS = [
  {
    slug: "numeroloji-nedir",
    title: "Numeroloji Nedir? Say\u0131lar\u0131n Gizli Dili",
    excerpt: "Say\u0131lar sadece matematik de\u011fildir. Her say\u0131 bir frekans ta\u015f\u0131r, her frekans bir anlam. Numerolojinin temellerini ke\u015ffet.",
    date: "2026-04-09",
    readMin: 5,
    tag: "Numeroloji",
  },
  {
    slug: "yasam-yolu-sayisi-hesaplama",
    title: "Ya\u015fam Yolu Say\u0131s\u0131 Nas\u0131l Hesaplan\u0131r?",
    excerpt: "Do\u011fum tarihin sana bir say\u0131 verir. Bu say\u0131 ya\u015fam yolunu, e\u011filimlerini ve potansiyelini g\u00f6sterir.",
    date: "2026-04-10",
    readMin: 4,
    tag: "Rehber",
  },
  {
    slug: "528-hz-sifa-frekansi",
    title: "528 Hz: \u015eifa Frekans\u0131n\u0131n S\u0131rr\u0131",
    excerpt: "Solfeggio frekanslar\u0131 aras\u0131nda en bilineni olan 528 Hz, DNA onar\u0131m\u0131 ve denge ile ili\u015fkilendirilir.",
    date: "2026-04-11",
    readMin: 6,
    tag: "Frekans",
  },
  {
    slug: "isim-analizi-anlamlar",
    title: "\u0130sminin Anlam\u0131 Ne? Harflerin Gizli Kodlar\u0131",
    excerpt: "Her harf bir titre\u015fim ta\u015f\u0131r. \u0130smindeki harflerin numerolojik de\u011ferleri sana ne s\u00f6yl\u00fcyor?",
    date: "2026-04-12",
    readMin: 5,
    tag: "Analiz",
  },
];

const S = {
  page: {
    minHeight: "100vh",
    background: "#07080d",
    padding: "60px 16px 80px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#e8e4f0",
  },
  container: { maxWidth: 720, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 48 },
  brand: {
    fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(180,160,240,0.7)",
    textDecoration: "none", display: "block", marginBottom: 16,
  },
  title: {
    fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, margin: "0 0 8px",
    background: "linear-gradient(135deg, #e8e4f0, #bb86fc)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0 },
  grid: { display: "grid", gap: 20 },
  card: {
    padding: "24px 22px",
    borderRadius: 16,
    border: "1px solid rgba(157,78,221,0.15)",
    background: "rgba(255,255,255,0.02)",
    textDecoration: "none",
    display: "block",
    transition: "border-color 0.2s, background 0.2s",
  },
  tag: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 8,
    background: "rgba(157,78,221,0.1)",
    color: "#bb86fc",
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18, fontWeight: 700, color: "#e8e4f0", margin: "0 0 8px", lineHeight: 1.35,
  },
  cardExcerpt: {
    fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 12px",
  },
  meta: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
};

export default function BlogPage() {
  return (
    <div style={S.page}>
      <SeoHead
        title="Blog \u2014 Numeroloji, Frekans ve Bilin\u00e7"
        description="Numeroloji, solfeggio frekanslar\u0131, isim analizi ve bilin\u00e7 \u00fczerine yaz\u0131lar. Sanr\u0131 blog."
        path="/blog"
      />
      <div style={S.container}>
        <div style={S.header}>
          <Link to="/" style={S.brand}>SANRI</Link>
          <h1 style={S.title}>Blog</h1>
          <p style={S.subtitle}>Numeroloji, frekans ve bilin\u00e7 \u00fczerine ke\u015fifler</p>
        </div>
        <div style={S.grid}>
          {POSTS.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} style={S.card}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(157,78,221,0.35)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(157,78,221,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            >
              <div style={S.tag}>{post.tag}</div>
              <h2 style={S.cardTitle}>{post.title}</h2>
              <p style={S.cardExcerpt}>{post.excerpt}</p>
              <span style={S.meta}>{post.date} \u2022 {post.readMin} dk okuma</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
