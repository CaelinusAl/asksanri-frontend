// src/pages/AdminPanelPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

function StatBox({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value ?? "-"}</div>
    </div>
  );
}

export default function AdminPanelPage() {
  const API = import.meta.env.VITE_BACKEND_URL || "https://sanri-api-production-4a7b.up.railway.app";
  const navigate = useNavigate();
  const { search } = useLocation();

  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const queryKey = useMemo(() => {
    const sp = new URLSearchParams(search || "");
    return sp.get("key") || "";
  }, [search]);

  const [adminKey, setAdminKey] = useState(() => queryKey || localStorage.getItem("ADMIN_KEY") || "");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const keyParam = useMemo(() => encodeURIComponent(adminKey || ""), [adminKey]);

  const load = async () => {
  setErr("");

  if (!API) {
    setErr("VITE_BACKEND_URL missing");
    return;
  }

  if (!adminKey) {
    setErr(isTR ? "ADMIN_KEY gerekli" : "ADMIN_KEY required");
    return;
  }

  localStorage.setItem("ADMIN_KEY", adminKey);
  setLoading(true);

  try {
    const sRes = await fetch(`${API}/admin/overview`, {
      headers: { "X-Admin-Token": adminKey },
    });
    const sJson = await sRes.json();

    if (!sRes.ok) {
      throw new Error(sJson?.detail || "Stats request failed");
    }

    setStats(sJson);

    const uRes = await fetch(`${API}/admin/events?limit=50`, {
      headers: { "X-Admin-Token": adminKey },
    });
    const uJson = await uRes.json();

    if (!uRes.ok) {
      throw new Error(uJson?.detail || "Users request failed");
    }

    setUsers(Array.isArray(uJson) ? uJson : (uJson?.users || []));

  } catch (e) {
    setErr(String(e?.message || e));
  } finally {
    setLoading(false);
  }
}; useEffect(() => {
  load();
}, [adminKey]);

  // Sayfa açılınca: queryKey varsa otomatik yükle

  useEffect(() => {
  load();
  const t = setInterval(load, 20000);
  return () => clearInterval(t);
}, [adminKey]); 

  useEffect(() => {
    if (queryKey && queryKey !== adminKey) setAdminKey(queryKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  useEffect(() => {
    if (adminKey) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  return (
    <div style={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div style={styles.topbar}>
        <div style={styles.left}>
          <div style={styles.brand}>CAELINUS AI</div>
          <div style={styles.sub}>{isTR ? "Admin • Üyelik Takip" : "Admin • Membership Tracking"}</div>
        </div>

        <div style={styles.right}>
          <button style={styles.btn} type="button" onClick={() => navigate("/", { state: { skipIntro: true } })}>
            {isTR ? "← Kapılar" : "← Gates"}
          </button>

          <button
            style={styles.btn}
            type="button"
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title={isTR ? "EN" : "TR"}
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div style={styles.shell}>
        <div style={styles.card}>
          <div style={styles.h1}>{isTR ? "Admin Panel" : "Admin Panel"}</div>
          <div style={styles.p}>
            {isTR ? "Bu alan sadece sana ait. ADMIN_KEY ile kilitli." : "This space is yours only. Locked by ADMIN_KEY."}
          </div>

          <div style={styles.row}>
            <input
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="ADMIN_KEY"
              style={styles.input}
            />
            <button style={styles.primary} type="button" onClick={load} disabled={loading}>
              {loading ? (isTR ? "Yükleniyor…" : "Loading…") : (isTR ? "Yenile" : "Refresh")}
            </button>
          </div>

          {err ? <div style={styles.error}>{err}</div> : null}

          <div style={styles.grid3}>
            <StatBox label={isTR ? "Toplam Kayıt" : "Total Users"} value={stats?.total_users} />
            <StatBox label={isTR ? "Bugün" : "Today"} value={stats?.today_users ?? stats?.last_24h} />
            <StatBox label={isTR ? "Premium" : "Premium"} value={stats?.premium_users} />
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>{isTR ? "Son Kullanıcılar" : "Latest Users"}</div>

            <div style={styles.list}>
              {(users || []).slice(0, 50).map((u) => (
                <div key={u.id || u.email} style={styles.item}>
                  <div style={{ fontWeight: 800 }}>{u.email || `#${u.id}`}</div>
                  <div style={styles.muted}>
                    {u.created_at ? new Date(u.created_at).toLocaleString() : ""}
                  </div>
                </div>
              ))}
              {!users?.length ? <div style={styles.muted}>{isTR ? "Liste boş." : "Empty list."}</div> : null}
            </div>
          </div>

          <div style={styles.foot}>© 2026 CaelinusAI • SANRI</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "18px 18px 60px",
    background:
      "radial-gradient(900px 520px at 20% 10%, rgba(180,120,255,.18), transparent 60%)," +
      "radial-gradient(700px 420px at 80% 20%, rgba(80,200,255,.12), transparent 60%)," +
      "linear-gradient(180deg, #07080d 0%, #0b0d14 55%, #06070b 100%)",
    color: "rgba(255,255,255,.92)",
  },
  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 9999,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 16,
    background: "rgba(10,12,18,.55)",
    backdropFilter: "blur(14px)",
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  brand: {
    fontWeight: 900,
    letterSpacing: ".16em",
    fontSize: 12,
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 999,
    background: "rgba(255,255,255,.05)",
  },
  sub: { opacity: 0.8, fontSize: 12 },
  right: { display: "flex", gap: 10 },
  btn: {
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(255,255,255,.06)",
    color: "rgba(255,255,255,.92)",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
  },
  shell: { maxWidth: 1100, margin: "14px auto 0" },
  card: {
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 22,
    background: "rgba(255,255,255,.04)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 0 44px rgba(0,0,0,.35)",
    padding: 18,
  },
  h1: { fontSize: 26, fontWeight: 900, marginBottom: 6 },
  p: { opacity: 0.75, marginBottom: 14 },
  row: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  input: {
    flex: 1,
    minWidth: 220,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(0,0,0,.18)",
    color: "rgba(255,255,255,.92)",
    outline: "none",
  },
  primary: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(160,123,255,.20)",
    color: "rgba(255,255,255,.95)",
    cursor: "pointer",
    fontWeight: 900,
  },
  error: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,120,120,.25)",
    background: "rgba(255,80,80,.10)",
    color: "rgba(255,220,220,.95)",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 14,
  },
  stat: {
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 18,
    background: "rgba(0,0,0,.12)",
    padding: 14,
  },
  statLabel: { opacity: 0.75, fontSize: 12, letterSpacing: ".12em" },
  statValue: { fontSize: 26, fontWeight: 900, marginTop: 6 },
  section: { marginTop: 16 },
  sectionTitle: { fontWeight: 900, marginBottom: 10 },
  list: { display: "grid", gap: 10 },
  item: {
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 16,
    background: "rgba(0,0,0,.12)",
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  muted: { opacity: 0.7, fontSize: 12 },
  foot: { marginTop: 14, opacity: 0.6, fontSize: 12, textAlign: "center" },
};