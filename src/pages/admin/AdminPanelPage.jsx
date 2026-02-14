// src/pages/admin/AdminPanelPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function AdminPanelPage() {
  const nav = useNavigate();
  const { adminEmail, logout } = useAdmin();

  const [stats, setStats] = useState({
    users_total: null,
    users_today: null,
    premium_total: null,
    active_7d: null,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const apiHint = useMemo(() => {
    return API ? `API: ${API}` : "API: (VITE_BACKEND_URL yok)";
  }, []);

  // Bu sayfa şu an backend’e bağlı olmak zorunda değil.
  // Backend hazır olunca aşağıdaki fetch'i açarız.
  useEffect(() => {
    let alive = true;

    // Şimdilik: UI hazır, veri yoksa da çalışsın.
    // Eğer ileride admin stats endpoint yaparsan:
    // GET `${API}/api/admin/stats` (x-admin-key header ile)
    async function load() {
      if (!API) return;
      setLoading(true);
      setErr("");
      try {
        // ⚠️ ŞU AN endpoint yok: bu yüzden kapalı bırakıyorum
        // const res = await fetch(`${API}/api/admin/stats`, {
        // headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY || "" },
        // });
        // const data = await res.json().catch(() => ({}));
        // if (!res.ok) throw new Error(data?.detail || "Admin stats error");
        // if (!alive) return;
        // setStats({
        // users_total: data?.users_total ?? null,
        // users_today: data?.users_today ?? null,
        // premium_total: data?.premium_total ?? null,
        // active_7d: data?.active_7d ?? null,
        // });

        if (!alive) return;
      } catch (e) {
        if (!alive) return;
        setErr(String(e?.message || e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const pill = (label, value) => (
    <div
      style={{
        padding: 14,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(0,0,0,0.22)",
      }}
    >
      <div style={{ fontWeight: 900 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 26, fontWeight: 900 }}>
        {value === null ? "—" : value}
      </div>
      <div style={{ marginTop: 6, opacity: 0.7, fontSize: 12 }}>{apiHint}</div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 18,
        background:
          "radial-gradient(900px 600px at 20% 10%, rgba(160,123,255,0.20), transparent 60%)," +
          "radial-gradient(700px 480px at 80% 70%, rgba(80,120,255,0.12), transparent 60%)," +
          "linear-gradient(180deg, #07080d 0%, #0b0d14 55%, #06070b 100%)",
        color: "rgba(255,255,255,0.92)",
      }}
    >
      <div
        style={{
          maxWidth: 1150,
          margin: "0 auto",
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
          padding: 18,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontWeight: 900, letterSpacing: ".14em", fontSize: 12, opacity: 0.82 }}>
              CAELINUS AI • ADMIN PANEL
            </div>
            <div style={{ fontSize: 28, fontWeight: 950, marginTop: 8 }}>Control Room</div>
            <div style={{ opacity: 0.78, marginTop: 6 }}>
              Signed as: <span style={{ fontWeight: 800 }}>{adminEmail || "admin"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => nav("/")}
              style={btnGhost}
              type="button"
            >
              ← Gates
            </button>

            <button
              onClick={() => nav("/admin/members")}
              style={btnPrimary}
              type="button"
            >
              Members
            </button>

            <button
              onClick={() => {
                logout();
                nav("/admin/login", { replace: true });
              }}
              style={btnDanger}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATUS */}
        {err ? (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,80,80,0.35)",
              background: "rgba(255,80,80,0.10)",
              color: "rgba(255,230,230,0.92)",
            }}
          >
            {err}
          </div>
        ) : null}

        {/* GRID */}
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {pill("Users Total", stats.users_total)}
          {pill("Users Today", stats.users_today)}
          {pill("Premium Total", stats.premium_total)}
          {pill("Active (7d)", stats.active_7d)}
        </div>

        {/* ACTIONS */}
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Today’s Ops</div>
            <div style={{ opacity: 0.75, marginTop: 6, lineHeight: 1.45 }}>
              Burayı “üyelikleri takip” merkezine dönüştüreceğiz:
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                <li>Yeni kayıtlar listesi</li>
                <li>Premium / free ayrımı</li>
                <li>Son giriş tarihi</li>
                <li>Not / tag ekleme</li>
              </ul>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={btnPrimary} onClick={() => nav("/admin/members")}>
                Open Members
              </button>
              <button
                type="button"
                style={btnGhost}
                onClick={() => {
                  // placeholder
                  alert("Next: /api/admin/stats + /api/admin/members endpointlerini ekleyeceğiz.");
                }}
              >
                Next Steps
              </button>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Quick Tools</div>
            <div style={{ opacity: 0.75, marginTop: 6, lineHeight: 1.45 }}>
              Bugün paylaşım öncesi:
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                <li>Members sayfası çalışıyor mu?</li>
                <li>Auth register/login CORS ok mi?</li>
                <li>Mobile ritual açılıyor mu?</li>
              </ul>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={btnGhost} onClick={() => window.location.reload()}>
                Refresh UI
              </button>
              <button
                type="button"
                style={btnPrimary}
                onClick={() => {
                  const url = API ? `${API}/openapi.json` : "";
                  if (!url) return alert("VITE_BACKEND_URL yok.");
                  window.open(url, "_blank");
                }}
              >
                OpenAPI
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, opacity: 0.65, fontSize: 12 }}>
          © 2026 CaelinusAI • SANRI — Admin is client-locked with VITE_ADMIN_KEY
        </div>

        {loading ? (
          <div style={{ marginTop: 10, opacity: 0.75, fontSize: 12 }}>Loading…</div>
        ) : null}
      </div>
    </div>
  );
}

const btnPrimary = {
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "linear-gradient(180deg, rgba(160,123,255,0.22), rgba(160,123,255,0.10))",
  color: "rgba(255,255,255,0.92)",
  cursor: "pointer",
  fontWeight: 900,
  letterSpacing: ".04em",
};

const btnGhost = {
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.25)",
  color: "rgba(255,255,255,0.86)",
  cursor: "pointer",
  fontWeight: 800,
};

const btnDanger = {
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,80,80,0.22)",
  background: "rgba(255,80,80,0.10)",
  color: "rgba(255,235,235,0.92)",
  cursor: "pointer",
  fontWeight: 900,
};

const card = {
  padding: 14,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.22)",
};