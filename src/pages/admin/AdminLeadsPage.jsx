import { useEffect, useState, useCallback } from "react";
import adminStyles from "../../components/admin/AdminStyles.module.css";
import StatCard from "../../components/admin/StatCard";

const API = import.meta.env.VITE_BACKEND_URL || "https://sanri-api-production-4a7b.up.railway.app";
const getToken = () => localStorage.getItem("sanri_token");

async function adminFetch(path) {
  const token = getToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

const SOURCE_LABELS = {
  registered: "Kayıtlı Üye",
  quiz: "Farkındalık Testi",
  popup: "Popup",
  timer: "Popup (Timer)",
  scroll: "Popup (Scroll)",
  inline: "Inline Form",
  purchase: "Satın Alma",
  manual: "Manuel",
  exit_intent: "Exit Intent",
  content_gate: "İçerik Gate",
};

const SOURCE_COLORS = {
  registered: "#7cf7d8",
  quiz: "#bb86fc",
  popup: "#ff9a6c",
  timer: "#ff9a6c",
  scroll: "#ff9a6c",
  inline: "#6cc8ff",
  purchase: "#6cf5c2",
  exit_intent: "#ffd76c",
  content_gate: "#ff6482",
};

export default function AdminLeadsPage() {
  const [data, setData] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const [leads, quiz] = await Promise.all([
        adminFetch(`/quiz/admin/all-leads?limit=300&search=${encodeURIComponent(q)}`),
        adminFetch("/quiz/stats"),
      ]);
      setData(leads);
      setQuizStats(quiz);
    } catch (e) {
      console.error("Leads load error:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await adminFetch("/quiz/admin/export-emails");
      const text = res.emails.join("\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sanri_emails_${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Export hatası: " + e.message);
    }
    setExporting(false);
  };

  const handleCopyAll = async () => {
    try {
      const res = await adminFetch("/quiz/admin/export-emails");
      await navigator.clipboard.writeText(res.emails.join("\n"));
      alert(`${res.total} e-posta adresi panoya kopyalandı!`);
    } catch (e) {
      alert("Kopyalama hatası: " + e.message);
    }
  };

  return (
    <div className={adminStyles.page}>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>E-posta & Lead Merkezi</h1>
        <p className={adminStyles.pageSubtitle}>
          Tüm kaynaklardan toplanan e-posta adresleri — Quiz, Popup, Kayıt, Satın Alma
        </p>
      </div>

      {/* Stats Row */}
      <div style={S.statRow}>
        <StatCard label="Toplam Benzersiz E-posta" value={data?.total ?? "—"} />
        <StatCard label="Quiz Katılımcısı" value={quizStats?.total ?? "—"} />
        {data?.sources && Object.entries(data.sources).map(([src, cnt]) => (
          <StatCard key={src} label={SOURCE_LABELS[src] || src} value={cnt} />
        ))}
      </div>

      {/* Quiz Theme Breakdown */}
      {quizStats?.themes?.length > 0 && (
        <div style={S.section}>
          <h3 style={S.sectionTitle}>Quiz Tema Dağılımı</h3>
          <div style={S.tagRow}>
            {quizStats.themes.map((t) => (
              <span key={t.theme} style={S.tag}>
                {t.theme}: <strong>{t.count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={S.actions}>
        <form onSubmit={handleSearch} style={S.searchRow}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="E-posta ara..."
            style={S.searchInput}
          />
          <button type="submit" style={S.searchBtn}>Ara</button>
        </form>
        <div style={S.actionBtns}>
          <button onClick={handleCopyAll} style={S.exportBtn}>
            Tümünü Kopyala
          </button>
          <button onClick={handleExport} disabled={exporting} style={S.exportBtn}>
            {exporting ? "İndiriliyor..." : "TXT İndir"}
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 40 }}>Yükleniyor...</p>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>E-posta</th>
                <th style={S.th}>İsim</th>
                <th style={S.th}>Kaynaklar</th>
                <th style={S.th}>Tema</th>
                <th style={S.th}>Sayfa/Alan</th>
                <th style={S.th}>İlk Görülme</th>
                <th style={S.th}>Son Görülme</th>
                <th style={S.th}>Temas</th>
              </tr>
            </thead>
            <tbody>
              {data?.leads?.map((lead, i) => (
                <tr key={lead.email + i} style={i % 2 === 0 ? S.trEven : undefined}>
                  <td style={S.td}>
                    <span style={S.emailCell}>{lead.email}</span>
                  </td>
                  <td style={S.td}>{lead.name || "—"}</td>
                  <td style={S.td}>
                    <div style={S.sourceTagRow}>
                      {lead.sources.split(",").map((s) => (
                        <span
                          key={s}
                          style={{
                            ...S.sourceTag,
                            borderColor: SOURCE_COLORS[s] || "rgba(255,255,255,0.15)",
                            color: SOURCE_COLORS[s] || "rgba(255,255,255,0.6)",
                          }}
                        >
                          {SOURCE_LABELS[s] || s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={S.td}>{lead.theme || "—"}</td>
                  <td style={S.td}>{lead.page || "—"}</td>
                  <td style={S.tdDate}>{lead.first_seen?.slice(0, 16) || "—"}</td>
                  <td style={S.tdDate}>{lead.last_seen?.slice(0, 16) || "—"}</td>
                  <td style={{ ...S.td, textAlign: "center" }}>{lead.touchpoints}</td>
                </tr>
              ))}
              {(!data?.leads || data.leads.length === 0) && (
                <tr>
                  <td colSpan={8} style={{ ...S.td, textAlign: "center", padding: 32 }}>
                    Henüz kayıt yok
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const S = {
  statRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
    padding: "16px 18px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    margin: 0,
  },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 },
  tag: {
    padding: "4px 12px",
    borderRadius: 8,
    background: "rgba(187,134,252,0.10)",
    border: "1px solid rgba(187,134,252,0.2)",
    color: "#cbbcff",
    fontSize: 13,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  searchRow: { display: "flex", gap: 8 },
  searchInput: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#e8e4f0",
    fontSize: 14,
    outline: "none",
    width: 240,
  },
  searchBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "1px solid rgba(187,134,252,0.25)",
    background: "rgba(187,134,252,0.1)",
    color: "#bb86fc",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  actionBtns: { display: "flex", gap: 8 },
  exportBtn: {
    padding: "10px 18px",
    borderRadius: 10,
    border: "1px solid rgba(124,247,216,0.2)",
    background: "rgba(124,247,216,0.06)",
    color: "#7cf7d8",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    padding: "12px 14px",
    textAlign: "left",
    color: "rgba(255,255,255,0.5)",
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 14px",
    color: "rgba(255,255,255,0.75)",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
  },
  tdDate: {
    padding: "10px 14px",
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    whiteSpace: "nowrap",
  },
  trEven: { background: "rgba(255,255,255,0.015)" },
  emailCell: { fontWeight: 600, color: "#e8e4f0" },
  sourceTagRow: { display: "flex", flexWrap: "wrap", gap: 4 },
  sourceTag: {
    padding: "2px 8px",
    borderRadius: 6,
    border: "1px solid",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
};
