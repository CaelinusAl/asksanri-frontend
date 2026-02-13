import React, { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function PremiumGateModal({ open, onClose, title = "Premium", subtitle = "" }) {
  const { loading, isAuthenticated, isPremium, loginEmail, registerEmail } = useAuth();

  const [tab, setTab] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const state = useMemo(() => {
    if (loading) return "loading";
    if (!isAuthenticated) return "need_login";
    if (isAuthenticated && !isPremium) return "need_premium";
    return "ok";
  }, [loading, isAuthenticated, isPremium]);

  if (!open) return null;

  const submit = async () => {
    setErr("");
    setBusy(true);
    try {
      if (!email.trim() || !password.trim()) throw new Error("Email & şifre gerekli.");
      if (tab === "login") await loginEmail({ email: email.trim(), password });
      else await registerEmail({ email: email.trim(), password });

      onClose?.();
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          borderRadius: 16,
          background: "rgba(15,18,28,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          padding: 16,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
            {subtitle ? <div style={{ opacity: 0.8, marginTop: 4 }}>{subtitle}</div> : null}
          </div>
          <button
            onClick={onClose}
            type="button"
            style={{
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {state === "loading" ? (
            <div style={{ opacity: 0.85 }}>Kontrol ediliyor…</div>
          ) : state === "need_premium" ? (
            <div style={{ opacity: 0.9, lineHeight: 1.5 }}>
              Bu kapı <b>Premium</b>.  
              Premium’a geçiş ekranını yarın birlikte bağlarız (Stripe/iyzico vs).  
              Şimdilik “merak uyandırma” mesajı.
              <div style={{ marginTop: 10, opacity: 0.7 }}>
                Giriş yaptıysan ama premium değilsen: premium plan sayfasına yönlendireceğiz.
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: tab === "login" ? "rgba(124,92,255,0.25)" : "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Giriş
                </button>
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: tab === "register" ? "rgba(124,92,255,0.25)" : "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Kayıt
                </button>
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  style={{
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    outline: "none",
                  }}
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifre"
                  type="password"
                  style={{
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    outline: "none",
                  }}
                />

                {err ? <div style={{ color: "#ff8b8b" }}>{err}</div> : null}

                <button
                  type="button"
                  disabled={busy}
                  onClick={submit}
                  style={{
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #7c5cff, #a07bff)",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: busy ? 0.7 : 1,
                  }}
                >
                  {busy ? "Bekle…" : tab === "login" ? "Giriş yap" : "Kayıt ol"}
                </button>

                <div style={{ opacity: 0.7, fontSize: 12, lineHeight: 1.45 }}>
                  Not: Google ile giriş endpoint’in var (`/api/auth/google/session`).  
                  Onu da ekleriz ama önce email login’i sağlamlaştıralım.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}