import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "https://sanri-api-production-4a7b.up.railway.app").replace(/\/$/, "");

const getHeaders = () => {
  const token = localStorage.getItem("sanri_token");
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

export default function YankiAdminPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [sanriNote, setSanriNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchPosts = async (st) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/yanki/admin/posts?status_filter=${st}`, { headers: getHeaders() });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/yanki/admin/stats`, { headers: getHeaders() });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts(statusFilter);
    fetchStats();
  }, [statusFilter]);

  const handleReview = async (postId, action) => {
    try {
      const body = { action };
      if (action === "approve" && sanriNote.trim()) body.sanri_note = sanriNote.trim();
      if (action === "reject" && rejectReason.trim()) body.reject_reason = rejectReason.trim();

      await fetch(`${API_BASE}/yanki/admin/posts/${postId}/review`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      setReviewingId(null);
      setSanriNote("");
      setRejectReason("");
      fetchPosts(statusFilter);
      fetchStats();
    } catch (e) {
      alert("Hata: " + e.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={topbarStyle}>
        <button onClick={() => navigate("/", { state: { skipIntro: true } })} style={backBtnStyle}>
          ← Kapılar
        </button>
        <span style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>Yankı Moderasyon</span>
      </div>

      <div style={containerStyle}>
        {/* Stats */}
        <div style={statsRowStyle}>
          <div style={statCardStyle}>
            <div style={statNumStyle}>{stats.pending_review || 0}</div>
            <div style={statLabelStyle}>Bekleyen</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statNumStyle, color: "#7cf7d8" }}>{stats.published || 0}</div>
            <div style={statLabelStyle}>Yayında</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statNumStyle, color: "#ff6b6b" }}>{stats.rejected || 0}</div>
            <div style={statLabelStyle}>Reddedilen</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumStyle}>{stats.total_reports || 0}</div>
            <div style={statLabelStyle}>Bildiriler</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["pending_review", "published", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={statusFilter === st ? activeFilterStyle : filterStyle}
            >
              {st === "pending_review" ? "Bekleyen" : st === "published" ? "Yayında" : "Reddedilen"}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div style={emptyStyle}>Yükleniyor...</div>
        ) : posts.length === 0 ? (
          <div style={emptyStyle}>Bu kategoride içerik yok.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {posts.map((post) => (
              <div key={post.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "#b388ff", fontWeight: 800, letterSpacing: 1 }}>
                    #{post.id} • {post.category} • {post.author_mode}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                    {new Date(post.created_at).toLocaleString("tr-TR")}
                  </span>
                </div>

                {post.title ? <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{post.title}</div> : null}
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 12 }}>
                  {post.content_raw}
                </div>

                {post.report_count > 0 ? (
                  <div style={{ fontSize: 12, color: "#ff6b6b", marginBottom: 8 }}>
                    ⚠ {post.report_count} bildirim
                  </div>
                ) : null}

                {post.status === "pending_review" ? (
                  reviewingId === post.id ? (
                    <div style={reviewBoxStyle}>
                      <textarea
                        value={sanriNote}
                        onChange={(e) => setSanriNote(e.target.value)}
                        placeholder="Sanrı Notu (isteğe bağlı, onayda görünür)"
                        rows={2}
                        style={reviewInputStyle}
                      />
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Red sebebi (reddetme durumunda)"
                        rows={2}
                        style={reviewInputStyle}
                      />
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => handleReview(post.id, "approve")} style={approveBtnStyle}>
                          ✓ Onayla
                        </button>
                        <button onClick={() => handleReview(post.id, "reject")} style={rejectBtnStyle}>
                          ✕ Reddet
                        </button>
                        <button onClick={() => setReviewingId(null)} style={cancelBtnStyle}>
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReviewingId(post.id)} style={reviewTriggerStyle}>
                      İncele →
                    </button>
                  )
                ) : null}

                {post.status === "rejected" && post.reject_reason ? (
                  <div style={{ fontSize: 12, color: "rgba(255,100,100,0.7)", marginTop: 4 }}>
                    Red: {post.reject_reason}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", color: "white", fontFamily: "'Inter', system-ui, sans-serif", background: "linear-gradient(180deg, #060710 0%, #0a0c18 50%, #05060c 100%)" };
const topbarStyle = { position: "sticky", top: 0, zIndex: 999, display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", background: "rgba(8,8,16,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" };
const backBtnStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "#7cf7d8", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 };
const containerStyle = { maxWidth: 860, margin: "0 auto", padding: "30px 20px" };
const statsRowStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 };
const statCardStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px", textAlign: "center" };
const statNumStyle = { fontSize: 28, fontWeight: 900, color: "#cbbcff" };
const statLabelStyle = { fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 };
const filterStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 };
const activeFilterStyle = { ...filterStyle, background: "rgba(169,112,255,0.15)", borderColor: "rgba(169,112,255,0.3)", color: "#cbbcff" };
const cardStyle = { background: "rgba(16,14,30,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "20px 22px" };
const emptyStyle = { textAlign: "center", color: "rgba(255,255,255,0.35)", padding: "40px", fontSize: 14 };
const reviewBoxStyle = { background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 16, marginTop: 8 };
const reviewInputStyle = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 13, fontFamily: "inherit", marginBottom: 10, outline: "none", resize: "vertical", boxSizing: "border-box" };
const approveBtnStyle = { background: "rgba(124,247,216,0.15)", border: "1px solid rgba(124,247,216,0.3)", color: "#7cf7d8", padding: "8px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 13 };
const rejectBtnStyle = { background: "rgba(255,100,100,0.15)", border: "1px solid rgba(255,100,100,0.3)", color: "#ff6b6b", padding: "8px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 13 };
const cancelBtnStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", padding: "8px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 };
const reviewTriggerStyle = { background: "rgba(169,112,255,0.1)", border: "1px solid rgba(169,112,255,0.2)", color: "#cbbcff", padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 };
