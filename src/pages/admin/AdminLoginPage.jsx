// src/pages/admin/AdminLoginPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const nav = useNavigate();
  const loc = useLocation();

  const from = useMemo(() => loc.state?.from || "/admin/panel", [loc.state]);

  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [hours, setHours] = useState(12);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login({ email, key, rememberHours: hours });
      nav(from, { replace: true });
    } catch (ex) {
      setErr(String(ex?.message || ex));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 18,
      background: "linear-gradient(180deg, #07080d 0%, #0b0d14 55%, #06070b 100%)",
      color: "rgba(255,255,255,0.92)"
    }}>
      <div style={{
        width: "min(520px, 100%)",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
        padding: 18
      }}>
        <div style={{ fontWeight: 900, letterSpacing: ".12em", fontSize: 12, opacity: .8 }}>
          CAELINUS AI • ADMIN
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, marginTop: 10 }}>
          Admin Key
        </div>
        <div style={{ opacity: .78, marginTop: 6 }}>
          Sadece Selin erişir. (VITE_ADMIN_KEY ile kilitli)
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (sende kalır)"
            autoComplete="email"
            style={{
              width: "100%",
              padding: "14px 14px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.35)",
              color: "rgba(255,255,255,0.92)"
            }}
          />
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin Key"
            autoComplete="current-password"
            type="password"
            style={{
              width: "100%",
              padding: "14px 14px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.35)",
              color: "rgba(255,255,255,0.92)"
            }}
          />

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ opacity: .78, fontSize: 12 }}>Session</span>
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)"
              }}
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={72}>3 days</option>
            </select>
          </div>

          {err ? (
            <div style={{
              marginTop: 6,
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,80,80,0.35)",
              background: "rgba(255,80,80,0.10)",
              color: "rgba(255,230,230,0.92)"
            }}>
              {err}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            style={{
              marginTop: 8,
              padding: "14px 14px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "linear-gradient(180deg, rgba(160,123,255,0.22), rgba(160,123,255,0.10))",
              color: "rgba(255,255,255,0.92)",
              fontWeight: 900,
              letterSpacing: ".06em",
              cursor: "pointer"
            }}
          >
            {busy ? "..." : "OPEN"}
          </button>

          <button
            type="button"
            onClick={() => nav("/", { replace: true })}
            style={{
              padding: "12px 14px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.25)",
              color: "rgba(255,255,255,0.86)",
              cursor: "pointer"
            }}
          >
            ← Back to Gates
          </button>
        </form>
      </div>
    </div>
  );
}