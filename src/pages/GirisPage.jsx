import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";

const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "https://api.asksanri.com";

export default function GirisPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [mode, setMode] = useState("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !password.trim()) {
      setErr(isTR ? "Lütfen tüm alanları doldurun." : "Please fill all fields.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setErr(isTR ? "Adını gir." : "Enter your name.");
      return;
    }
    if (password.length < 6) {
      setErr(isTR ? "Şifre en az 6 karakter olmalı." : "Password min 6 chars.");
      return;
    }

    setBusy(true);
    try {
      const url = mode === "login" ? `${API}/auth/login` : `${API}/auth/register`;
      const body = mode === "login" ? { email, password } : { email, password, name };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.detail || "Hata oluştu");

      if (data.token) {
        localStorage.setItem("sanri_token", data.token);
        if (data.user) localStorage.setItem("sanri_user", JSON.stringify(data.user));
      }

      if (data.user?.email_verified === false) {
        navigate("/");
        return;
      }

      navigate("/");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  const guestEnter = () => {
    localStorage.setItem("sanri_guest", "1");
    navigate("/");
  };

  return (
    <div style={S.page}>
      <StarTrail />

      {/* Lang toggle */}
      <div style={S.langRow}>
        <button style={S.langBtn} onClick={() => setLanguage(isTR ? "en" : "tr")}>
          {isTR ? "EN" : "TR"}
        </button>
      </div>

      <div style={S.center}>
        {/* Logo */}
        <div style={S.logoWrap}>
          <div style={S.orb} />
          <div style={S.brand}>SANRI</div>
          <div style={S.tagline}>
            {isTR ? "Bilinç ve Anlam Zekası" : "Consciousness & Meaning Intelligence"}
          </div>
        </div>

        {/* Card */}
        <div style={S.card}>
          {mode === "welcome" ? (
            <>
              <div style={S.welcomeText}>
                {isTR
                  ? "Bu alan, kendini hatırlamak isteyenler içindir."
                  : "This space is for those who want to remember themselves."}
              </div>

              {/* Email Login */}
              <button style={S.btnPrimary} onClick={() => setMode("login")}>
                <MailIcon />
                <span>{isTR ? "E-posta ile Giriş Yap" : "Sign In with Email"}</span>
              </button>

              {/* Register */}
              <button style={S.btnOutline} onClick={() => setMode("register")}>
                <span>{isTR ? "Yeni Hesap Oluştur" : "Create New Account"}</span>
              </button>

              {/* Divider */}
              <div style={S.divider}>
                <div style={S.divLine} />
                <span style={S.divText}>{isTR ? "veya" : "or"}</span>
                <div style={S.divLine} />
              </div>

              {/* Guest */}
              <button style={S.btnGhost} onClick={guestEnter}>
                {isTR ? "Misafir Olarak Devam Et" : "Continue as Guest"}
              </button>

              {/* Privacy */}
              <div style={S.privacy}>
                {isTR ? "Devam ederek, " : "By continuing, you agree to our "}
                <Link to="/gizlilik" style={S.privacyLink}>
                  {isTR ? "gizlilik politikamızı" : "privacy policy"}
                </Link>
                {isTR ? " kabul etmiş olursun." : "."}
              </div>
            </>
          ) : (
            <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
              <div style={S.formTitle}>
                {mode === "login" ? (isTR ? "Giriş Yap" : "Sign In") : (isTR ? "Kayıt Ol" : "Register")}
              </div>

              {mode === "register" && (
                <div style={S.fieldWrap}>
                  <label style={S.label}>{isTR ? "Adın" : "Your Name"}</label>
                  <input
                    style={S.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isTR ? "İsim..." : "Name..."}
                    autoComplete="name"
                  />
                </div>
              )}

              <div style={S.fieldWrap}>
                <label style={S.label}>{isTR ? "E-posta" : "Email"}</label>
                <input
                  style={S.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@..."
                  autoComplete="email"
                />
              </div>

              <div style={S.fieldWrap}>
                <label style={S.label}>{isTR ? "Şifre" : "Password"}</label>
                <div style={{ position: "relative" }}>
                  <input
                    style={S.input}
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={S.eyeBtn}
                  >
                    {showPw ? "◉" : "◎"}
                  </button>
                </div>
              </div>

              {err && <div style={S.error}>{err}</div>}

              <button type="submit" style={S.btnPrimary} disabled={busy}>
                {busy ? "..." : mode === "login" ? (isTR ? "Giriş Yap" : "Sign In") : (isTR ? "Kayıt Ol" : "Register")}
              </button>

              <div style={S.switchRow}>
                {mode === "login" ? (
                  <>
                    <span style={{ opacity: 0.5 }}>{isTR ? "Hesabın yok mu?" : "No account?"}</span>
                    <button type="button" style={S.linkBtn} onClick={() => { setMode("register"); setErr(""); }}>
                      {isTR ? "Kayıt Ol" : "Register"}
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ opacity: 0.5 }}>{isTR ? "Hesabın var mı?" : "Have an account?"}</span>
                    <button type="button" style={S.linkBtn} onClick={() => { setMode("login"); setErr(""); }}>
                      {isTR ? "Giriş Yap" : "Sign In"}
                    </button>
                  </>
                )}
              </div>

              <button type="button" style={S.backBtn} onClick={() => { setMode("welcome"); setErr(""); }}>
                ← {isTR ? "Geri" : "Back"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse 900px 500px at 50% 20%, rgba(124,247,216,0.06), transparent 60%), radial-gradient(ellipse 700px 400px at 30% 80%, rgba(203,188,255,0.05), transparent 60%), linear-gradient(180deg, #07080d 0%, #0b0d14 50%, #06070b 100%)",
    color: "rgba(255,255,255,0.92)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    position: "relative",
  },
  langRow: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 10,
  },
  langBtn: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: "0.1em",
  },
  center: {
    position: "relative",
    zIndex: 5,
    width: "100%",
    maxWidth: 420,
  },
  logoWrap: {
    textAlign: "center",
    marginBottom: 28,
  },
  orb: {
    width: 56,
    height: 56,
    margin: "0 auto 14px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,247,216,0.25) 0%, rgba(203,188,255,0.15) 50%, transparent 70%)",
    border: "1px solid rgba(124,247,216,0.2)",
    boxShadow: "0 0 40px rgba(124,247,216,0.15), inset 0 0 20px rgba(124,247,216,0.1)",
    animation: "pulse 3s ease-in-out infinite",
  },
  brand: {
    fontWeight: 900,
    fontSize: 28,
    letterSpacing: "0.25em",
    background: "linear-gradient(135deg, #7cf7d8, #cbbcff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    fontSize: 12,
    opacity: 0.45,
    letterSpacing: "0.12em",
    marginTop: 6,
  },
  card: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 60px rgba(0,0,0,0.4)",
    padding: "32px 28px",
    display: "grid",
    gap: 14,
  },
  welcomeText: {
    textAlign: "center",
    opacity: 0.55,
    fontSize: 14,
    lineHeight: 1.6,
    fontStyle: "italic",
    marginBottom: 4,
  },
  btnPrimary: {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 14,
    border: "1px solid rgba(124,247,216,0.25)",
    background: "linear-gradient(135deg, rgba(124,247,216,0.15), rgba(203,188,255,0.10))",
    color: "#7cf7d8",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.2s",
  },
  btnOutline: {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.2s",
  },
  btnGhost: {
    width: "100%",
    padding: "12px 20px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    transition: "all 0.2s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    margin: "4px 0",
  },
  divLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.08)",
  },
  divText: {
    fontSize: 11,
    opacity: 0.3,
    letterSpacing: "0.1em",
  },
  privacy: {
    fontSize: 11,
    opacity: 0.35,
    textAlign: "center",
    lineHeight: 1.5,
    marginTop: 4,
  },
  privacyLink: {
    color: "rgba(124,247,216,0.7)",
    textDecoration: "underline",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 900,
    textAlign: "center",
    marginBottom: 4,
  },
  fieldWrap: {
    display: "grid",
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    opacity: 0.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.2)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    fontSize: 16,
  },
  error: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,80,80,0.25)",
    background: "rgba(255,60,60,0.08)",
    color: "rgba(255,200,200,0.9)",
    fontSize: 13,
  },
  switchRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 13,
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#7cf7d8",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    fontSize: 13,
    textAlign: "center",
  },
};
