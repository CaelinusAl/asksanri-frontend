import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import StarTrail from "../components/StarTrail";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.asksanri.com";

const CATEGORIES = [
  { key: "all", label: "Tümü" },
  { key: "duygu", label: "Duygu" },
  { key: "ruya", label: "Rüya" },
  { key: "soru", label: "Soru" },
  { key: "farkindlik", label: "Farkındalık" },
  { key: "donusum", label: "Dönüşüm" },
];

const SECTIONS = [
  { key: "new", label: "Yeni Bırakılanlar" },
  { key: "today", label: "Bugünün Yankısı" },
  { key: "curated", label: "Sanrı Seçkisi" },
];

const getHeaders = () => {
  const token = localStorage.getItem("sanri_token");
  const h = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

export default function YankiAlaniPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [section, setSection] = useState("new");
  const [offset, setOffset] = useState(0);
  const LIMIT = 15;

  const fetchPosts = useCallback(async (cat, sec, off) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: LIMIT, offset: off });
      if (cat !== "all") params.set("category", cat);
      if (sec !== "new") params.set("section", sec);
      const res = await fetch(`${API_BASE}/yanki/posts?${params}`);
      const data = await res.json();
      if (off === 0) {
        setPosts(data.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
      }
      setTotal(data.total || 0);
    } catch (e) {
      console.error("Yankı fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchPosts(category, section, 0);
  }, [category, section, fetchPosts]);

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchPosts(category, section, newOffset);
  };

  const handleReact = async (postId, type) => {
    try {
      const res = await fetch(`${API_BASE}/yanki/posts/${postId}/react`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reaction_type: type }),
      });
      if (res.ok) {
        fetchPosts(category, section, 0);
        setOffset(0);
      }
    } catch (e) {
      console.error("React error:", e);
    }
  };

  const handleReport = async (postId) => {
    if (!window.confirm("Bu içeriği bildirmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`${API_BASE}/yanki/posts/${postId}/report`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reason: "inappropriate" }),
      });
      alert("Bildirim alındı.");
    } catch (e) {
      console.error("Report error:", e);
    }
  };

  const catBadgeColor = (cat) => {
    const map = {
      duygu: "#ff6b9d",
      ruya: "#b388ff",
      soru: "#64b5f6",
      farkindlik: "#7cf7d8",
      donusum: "#ffb74d",
      genel: "rgba(255,255,255,0.4)",
    };
    return map[cat] || map.genel;
  };

  return (
    <div style={pageStyle}>
      <StarTrail />

      {/* Topbar */}
      <div style={topbarStyle}>
        <button onClick={() => navigate("/", { state: { skipIntro: true } })} style={backBtnStyle}>
          ← Kapılar
        </button>
        <span style={topbarTitleStyle}>Yankı Alanı</span>
      </div>

      <div style={containerStyle}>
        {/* Hero */}
        <div style={heroStyle}>
          <h1 style={h1Style}>Yankı Alanı</h1>
          <p style={subStyle}>Burada içini dök. Bilinç yankılanır.</p>
          <button onClick={() => navigate("/yanki-alani/yeni")} style={ctaBtnStyle}>
            ✦ Yeni Yankı Bırak
          </button>
        </div>

        {/* Section Tabs */}
        <div style={tabRowStyle}>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              style={section === s.key ? activeTabStyle : tabStyle}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div style={catRowStyle}>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              style={category === c.key ? activeCatStyle : catStyle}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading && posts.length === 0 ? (
          <div style={emptyStyle}>Yükleniyor...</div>
        ) : posts.length === 0 ? (
          <div style={emptyStyle}>
            Henüz yankı yok. İlk sen bırak.
          </div>
        ) : (
          <div style={feedStyle}>
            {posts.map((post) => (
              <div key={post.id} style={cardStyle}>
                <div style={cardTopStyle}>
                  <span style={{ ...catBadgeStyle, color: catBadgeColor(post.category) }}>
                    {post.category}
                  </span>
                  <span style={dateStyle}>
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("tr-TR") : ""}
                  </span>
                </div>

                {post.title ? <div style={cardTitleStyle}>{post.title}</div> : null}
                <div style={cardContentStyle}>{post.content_sanitized}</div>

                {post.sanri_note ? (
                  <div style={sanriNoteStyle}>
                    <span style={sanriNoteLabel}>Sanrı Notu:</span> {post.sanri_note}
                  </div>
                ) : null}

                <div style={cardBottomStyle}>
                  <button onClick={() => handleReact(post.id, "kalbime_dokundu")} style={reactBtnStyle}>
                    💜 {post.reaction_heart || 0}
                  </button>
                  <button onClick={() => handleReact(post.id, "ben_de_hissettim")} style={reactBtnStyle}>
                    🌊 {post.reaction_felt || 0}
                  </button>
                  <button onClick={() => handleReport(post.id)} style={reportBtnStyle} title="Bildir">
                    ⚑
                  </button>
                </div>
              </div>
            ))}

            {posts.length < total ? (
              <button onClick={loadMore} disabled={loading} style={loadMoreStyle}>
                {loading ? "Yükleniyor..." : "Daha Fazla"}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", position: "relative", color: "white", fontFamily: "'Inter', system-ui, sans-serif", background: "linear-gradient(180deg, #060710 0%, #0a0c18 50%, #05060c 100%)" };
const topbarStyle = { position: "sticky", top: 0, zIndex: 999, display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", background: "rgba(8,8,16,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" };
const backBtnStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "#7cf7d8", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 };
const topbarTitleStyle = { fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.7)" };
const containerStyle = { maxWidth: 780, margin: "0 auto", padding: "40px 20px" };
const heroStyle = { marginBottom: 36, textAlign: "center" };
const h1Style = { fontSize: 38, fontWeight: 900, background: "linear-gradient(135deg, #fff 30%, #b388ff 70%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 };
const subStyle = { color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 20 };
const ctaBtnStyle = { background: "linear-gradient(135deg, rgba(169,112,255,0.25), rgba(124,247,216,0.12))", border: "1px solid rgba(169,112,255,0.3)", color: "#cbbcff", padding: "12px 28px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 14, letterSpacing: 0.5, transition: "all 0.3s" };
const tabRowStyle = { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" };
const tabStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)", padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.2s" };
const activeTabStyle = { ...tabStyle, background: "rgba(169,112,255,0.15)", borderColor: "rgba(169,112,255,0.3)", color: "#cbbcff" };
const catRowStyle = { display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" };
const catStyle = { background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.40)", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 };
const activeCatStyle = { ...catStyle, background: "rgba(124,247,216,0.08)", borderColor: "rgba(124,247,216,0.2)", color: "#7cf7d8" };
const feedStyle = { display: "flex", flexDirection: "column", gap: 16 };
const cardStyle = { background: "rgba(16,14,30,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 24px", backdropFilter: "blur(12px)" };
const cardTopStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 };
const catBadgeStyle = { fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" };
const dateStyle = { fontSize: 11, color: "rgba(255,255,255,0.30)" };
const cardTitleStyle = { fontSize: 18, fontWeight: 800, marginBottom: 8, color: "rgba(255,255,255,0.92)" };
const cardContentStyle = { fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.68)", whiteSpace: "pre-wrap" };
const sanriNoteStyle = { marginTop: 14, padding: "12px 16px", borderRadius: 12, background: "rgba(169,112,255,0.08)", border: "1px solid rgba(169,112,255,0.15)", fontSize: 13, color: "rgba(255,255,255,0.70)", fontStyle: "italic" };
const sanriNoteLabel = { color: "#b388ff", fontWeight: 800, fontStyle: "normal" };
const cardBottomStyle = { display: "flex", gap: 10, marginTop: 16, alignItems: "center" };
const reactBtnStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", padding: "6px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s" };
const reportBtnStyle = { marginLeft: "auto", background: "transparent", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 16 };
const loadMoreStyle = { ...ctaBtnStyle, width: "100%", marginTop: 8, textAlign: "center" };
const emptyStyle = { textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "60px 20px", fontSize: 15 };
