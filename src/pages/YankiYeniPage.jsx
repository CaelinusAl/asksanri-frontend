import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarTrail from "../components/StarTrail";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.asksanri.com";

const CATEGORIES = [
  { key: "genel", label: "Genel" },
  { key: "duygu", label: "Duygu" },
  { key: "ruya", label: "Rüya" },
  { key: "soru", label: "Soru" },
  { key: "farkindlik", label: "Farkındalık" },
  { key: "donusum", label: "Dönüşüm" },
];

export default function YankiYeniPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("genel");
  const [anonymous, setAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = content.trim().length >= 10 && !loading;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("sanri_token");
      const res = await fetch(`${API_BASE}/yanki/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title: title.trim() || null, content: content.trim(), category, anonymous }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.detail || "Bir hata oluştu.");
        return;
      }
      setSubmitted(true);
    } catch (e) {
      alert("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={pageStyle}>
        <StarTrail />
        <div style={containerStyle}>
          <div style={successCardStyle}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 10, color: "#7cf7d8" }}>
              Yankın Alındı
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              İçeriğin incelendikten sonra yayınlanacak. Bilinç yankılanır.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => navigate("/yanki-alani")} style={btnStyle}>
                Yankı Alanına Dön
              </button>
              <button onClick={() => { setSubmitted(false); setTitle(""); setContent(""); }} style={{ ...btnStyle, background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.6)" }}>
                Yeni Yankı
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <StarTrail />

      <div style={topbarStyle}>
        <button onClick={() => navigate("/yanki-alani")} style={backBtnStyle}>
          ← Yankı Alanı
        </button>
      </div>

      <div style={containerStyle}>
        <h1 style={h1Style}>Yeni Yankı</h1>
        <p style={subStyle}>İçini dök. Yargı yok. Sadece yankı var.</p>

        <div style={formCardStyle}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Başlık (isteğe bağlı)"
            maxLength={300}
            style={inputStyle}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Burada ne hissediyorsan onu bırak… (en az 10 karakter)"
            rows={8}
            maxLength={5000}
            style={{ ...inputStyle, resize: "vertical", minHeight: 160, lineHeight: 1.7 }}
          />

          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "right", marginTop: -8, marginBottom: 12 }}>
            {content.length}/5000
          </div>

          <div style={labelStyle}>Kategori</div>
          <div style={catRowStyle}>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                style={category === c.key ? activeCatBtnStyle : catBtnStyle}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div style={toggleRowStyle}>
            <button
              onClick={() => setAnonymous(!anonymous)}
              style={{ ...toggleBtnStyle, background: anonymous ? "rgba(124,247,216,0.12)" : "rgba(255,255,255,0.04)", borderColor: anonymous ? "rgba(124,247,216,0.25)" : "rgba(255,255,255,0.08)" }}
            >
              <span style={{ color: anonymous ? "#7cf7d8" : "rgba(255,255,255,0.5)", fontWeight: 800 }}>
                {anonymous ? "◉ Anonim" : "○ İsmimle"}
              </span>
            </button>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              {anonymous ? "Kimliğin gizli kalacak" : "İsmin görünecek"}
            </span>
          </div>

          <button onClick={onSubmit} disabled={!canSubmit} style={{ ...submitBtnStyle, opacity: canSubmit ? 1 : 0.45 }}>
            {loading ? "Gönderiliyor..." : "Yankıyı Bırak"}
          </button>
        </div>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", position: "relative", color: "white", fontFamily: "'Inter', system-ui, sans-serif", background: "linear-gradient(180deg, #060710 0%, #0a0c18 50%, #05060c 100%)" };
const topbarStyle = { position: "sticky", top: 0, zIndex: 999, display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", background: "rgba(8,8,16,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" };
const backBtnStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "#7cf7d8", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 };
const containerStyle = { maxWidth: 640, margin: "0 auto", padding: "40px 20px" };
const h1Style = { fontSize: 34, fontWeight: 900, background: "linear-gradient(135deg, #fff 30%, #b388ff 70%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 };
const subStyle = { color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 28 };
const formCardStyle = { background: "rgba(16,14,30,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: "28px 24px", backdropFilter: "blur(12px)" };
const inputStyle = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", color: "white", fontSize: 14, fontFamily: "inherit", marginBottom: 14, outline: "none", boxSizing: "border-box" };
const labelStyle = { fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 };
const catRowStyle = { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 };
const catBtnStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", padding: "7px 16px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12 };
const activeCatBtnStyle = { ...catBtnStyle, background: "rgba(169,112,255,0.12)", borderColor: "rgba(169,112,255,0.25)", color: "#cbbcff" };
const toggleRowStyle = { display: "flex", alignItems: "center", gap: 12, marginBottom: 22 };
const toggleBtnStyle = { border: "1px solid", padding: "10px 20px", borderRadius: 12, cursor: "pointer", fontSize: 14, transition: "all 0.2s" };
const submitBtnStyle = { width: "100%", background: "linear-gradient(135deg, rgba(169,112,255,0.25), rgba(124,247,216,0.12))", border: "1px solid rgba(169,112,255,0.3)", color: "#cbbcff", padding: "16px", borderRadius: 16, cursor: "pointer", fontWeight: 900, fontSize: 16, letterSpacing: 0.5, transition: "all 0.3s" };
const successCardStyle = { textAlign: "center", background: "rgba(16,14,30,0.7)", border: "1px solid rgba(124,247,216,0.15)", borderRadius: 28, padding: "50px 30px", marginTop: 60, backdropFilter: "blur(12px)" };
const btnStyle = { background: "linear-gradient(135deg, rgba(169,112,255,0.25), rgba(124,247,216,0.12))", border: "1px solid rgba(169,112,255,0.3)", color: "#cbbcff", padding: "12px 24px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 14 };
