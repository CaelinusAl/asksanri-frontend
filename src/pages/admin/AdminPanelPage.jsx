import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminPanelPage() {
  const nav = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const key = params.get("key") || "";

  const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || "";

  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0d14", color: "#fff", padding: 24 }}>
        <h2>Admin Panel</h2>
        <p style={{ opacity: 0.8 }}>Yetkisiz. Linke anahtar ekle:</p>
        <code style={{ opacity: 0.9 }}>/admin/panel?key=...</code>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0d14", color: "#fff", padding: 24 }}>
      <h2>Admin Panel • SANRI</h2>
      <p style={{ opacity: 0.75 }}>Şimdilik minimal panel. Sonraki adım: üyelikler + kullanıcılar.</p>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button onClick={() => nav("/", { state: { skipIntro: true } })}>← Kapılara Dön</button>
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Panel linkini kopyala</button>
      </div>

      <div style={{ marginTop: 18, opacity: 0.75 }}>
        Örnek admin link:
        <div>
          <code>/admin/panel?key={ADMIN_KEY}</code>
        </div>
      </div>
    </div>
  );
}