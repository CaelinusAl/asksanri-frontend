import React, { useEffect, useState } from "react";

export default function AdminMembersPage() {
  const API = import.meta.env.VITE_BACKEND_URL;
  const [key, setKey] = useState(localStorage.getItem("admin_key") || "");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    if (!API) return setErr("VITE_BACKEND_URL missing");
    if (!key) return setErr("ADMIN KEY required");
    localStorage.setItem("admin_key", key);

    try {
      const s = await fetch(`${API}/api/admin/stats?key=${encodeURIComponent(key)}`).then(r => r.json());
      setStats(s);

      const u = await fetch(`${API}/api/admin/users?key=${encodeURIComponent(key)}&limit=50&offset=0`).then(r => r.json());
      setUsers(Array.isArray(u) ? u : []);
    } catch (e) {
      setErr("Fetch failed");
    }
  };

  useEffect(() => { if (key) load(); }, []);

  return (
    <div style={{ minHeight: "100vh", padding: 18, background: "#07080d", color: "#e9ecff" }}>
      <h2 style={{ margin: 0 }}>Admin • Üyelik Takip</h2>
      <p style={{ opacity: 0.75, marginTop: 6 }}>Sadece sen erişirsin.</p>

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="ADMIN_KEY"
          style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#fff" }}
        />
        <button
          onClick={load}
          style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(160,123,255,0.18)", color: "#fff", cursor: "pointer" }}
        >
          Yenile
        </button>
      </div>

      {err ? <div style={{ marginTop: 12, color: "#ff7b7b" }}>{err}</div> : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginTop: 16 }}>
        <div style={{ padding: 14, borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)" }}>
          <div style={{ opacity: 0.7 }}>Toplam</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{stats?.total_users ?? "-"}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)" }}>
          <div style={{ opacity: 0.7 }}>Son 24 Saat</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{stats?.last_24h ?? "-"}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)" }}>
          <div style={{ opacity: 0.7 }}>Premium</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{stats?.premium_users ?? "-"}</div>
        </div>
      </div>

      <div style={{ marginTop: 18, padding: 14, borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)" }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Son Kayıtlar</div>
        <div style={{ display: "grid", gap: 8 }}>
          {users.map((u) => (
            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ opacity: 0.95 }}>{u.email}</div>
              <div style={{ opacity: 0.6, fontSize: 12 }}>{u.created_at || `#${u.id}`}</div>
            </div>
          ))}
          {!users.length ? <div style={{ opacity: 0.7 }}>Henüz kayıt listesi gelmedi.</div> : null}
        </div>
      </div>
    </div>
  );
}