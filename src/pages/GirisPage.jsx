import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const API =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "https://api.asksanri.com";

/* ═══════════════════════════════════════════════
   CSS KEYFRAMES — injected once into <head>
   ═══════════════════════════════════════════════ */
const CSS_ID = "sanri-giris-css";
if (typeof document !== "undefined" && !document.getElementById(CSS_ID)) {
  const s = document.createElement("style");
  s.id = CSS_ID;
  s.textContent = `
    /* Breathing core */
    @keyframes sg-breathe {
      0%, 100% { transform: scale(1); opacity: .7; }
      50%      { transform: scale(1.12); opacity: 1; }
    }
    @keyframes sg-glow-rotate {
      0%   { transform: translate(-50%,-50%) rotate(0deg); }
      100% { transform: translate(-50%,-50%) rotate(360deg); }
    }

    /* Entrance stagger */
    @keyframes sg-fade-up {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes sg-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* Data fall — very subtle vertical streaks */
    @keyframes sg-fall {
      0%   { transform: translateY(-100vh); opacity: 0; }
      10%  { opacity: .12; }
      90%  { opacity: .06; }
      100% { transform: translateY(100vh); opacity: 0; }
    }

    /* Button micro-interactions */
    .sg-btn:hover  { transform: translateY(-1px); }
    .sg-btn:active { transform: scale(.985); }
    .sg-btn:focus-visible {
      outline: 2px solid rgba(124,247,216,.5);
      outline-offset: 3px;
    }

    /* Input focus glow */
    .sg-input:focus {
      border-color: rgba(124,247,216,.35) !important;
      box-shadow: 0 0 0 3px rgba(124,247,216,.08), 0 0 20px rgba(124,247,216,.06);
    }

    /* Responsive */
    @media (max-width: 520px) {
      .sg-card { margin: 0 8px; padding: 28px 20px !important; }
      .sg-brand { font-size: 26px !important; letter-spacing: .20em !important; }
      .sg-core { width: 52px !important; height: 52px !important; }
    }
  `;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════
   DATA FALL PARTICLES — lightweight background
   ═══════════════════════════════════════════════ */

function DataFall() {
  const count = 18;
  const streams = useRef(
    Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      dur: `${6 + Math.random() * 6}s`,
      w: `${1 + Math.random()}px`,
      h: `${40 + Math.random() * 80}px`,
      op: 0.04 + Math.random() * 0.06,
    }))
  ).current;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {streams.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.left,
            top: 0,
            width: s.w,
            height: s.h,
            background:
              "linear-gradient(180deg, transparent, rgba(124,247,216,.18), transparent)",
            borderRadius: 2,
            opacity: s.op,
            animation: `sg-fall ${s.dur} ${s.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FREQUENCY CORE — breathing sphere
   ═══════════════════════════════════════════════ */

function FrequencyCore() {
  return (
    <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto" }}>
      {/* Outer glow ring — slowly rotating */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, transparent, rgba(124,247,216,.08), transparent, rgba(180,160,255,.06), transparent)",
          animation: "sg-glow-rotate 12s linear infinite",
          filter: "blur(8px)",
        }}
      />

      {/* Core sphere */}
      <div
        className="sg-core"
        style={{
          position: "relative",
          width: 64,
          height: 64,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 35%, rgba(200,210,255,.22), rgba(124,247,216,.12) 45%, rgba(160,140,255,.08) 70%, transparent 100%)",
          border: "1px solid rgba(124,247,216,.15)",
          boxShadow:
            "0 0 40px rgba(124,247,216,.12), 0 0 80px rgba(160,140,255,.06), inset 0 0 24px rgba(124,247,216,.08)",
          animation: "sg-breathe 4s ease-in-out infinite",
        }}
      >
        {/* Inner highlight */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "28%",
            width: "30%",
            height: "30%",
            borderRadius: "50%",
            background: "rgba(220,230,255,.12)",
            filter: "blur(4px)",
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

export default function GirisPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [mode, setMode] = useState("welcome"); // welcome | login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [entering, setEntering] = useState(false); // threshold micro-state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const doEnter = () => {
    setEntering(true);
    setTimeout(() => navigate("/"), 900);
  };

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
      setErr(isTR ? "Şifre en az 6 karakter olmalı." : "Password must be at least 6 characters.");
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
      if (!res.ok) throw new Error(data?.detail || (isTR ? "Bir hata oluştu." : "An error occurred."));

      if (data.token) {
        localStorage.setItem("sanri_token", data.token);
        if (data.user) localStorage.setItem("sanri_user", JSON.stringify(data.user));
      }

      doEnter();
    } catch (e) {
      setErr(String(e?.message || e));
      setBusy(false);
    }
  };

  const guestEnter = () => {
    localStorage.setItem("sanri_guest", "1");
    doEnter();
  };

  const switchMode = (m) => {
    setMode(m);
    setErr("");
  };

  /* ── Entering threshold overlay ── */
  if (entering) {
    return (
      <div style={P.page}>
        <DataFall />
        <div
          style={{
            position: "relative",
            zIndex: 5,
            textAlign: "center",
            animation: "sg-fade-in .4s ease forwards",
          }}
        >
          <FrequencyCore />
          <div
            style={{
              marginTop: 28,
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: ".06em",
              color: "rgba(124,247,216,.7)",
              animation: "sg-fade-up .6s .2s ease both",
            }}
          >
            {isTR ? "Alana giriş yapılıyor…" : "Entering the field…"}
          </div>
        </div>
      </div>
    );
  }

  const anim = (delay) =>
    mounted
      ? { animation: `sg-fade-up .55s ${delay}s cubic-bezier(.23,1,.32,1) both` }
      : { opacity: 0 };

  return (
    <div style={P.page}>
      <DataFall />

      {/* ── TOPBAR ── */}
      <header style={P.topbar}>
        <div style={P.topLeft}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={P.topBrand}>SANRI</span>
          </Link>
          <span style={P.topSub}>
            {isTR ? "Bilinç ve Anlam Zekası" : "Consciousness & Meaning Intelligence"}
          </span>
        </div>
        <button
          className="sg-btn"
          style={P.langPill}
          onClick={() => setLanguage(isTR ? "en" : "tr")}
          aria-label="Switch language"
        >
          {isTR ? "EN" : "TR"}
        </button>
      </header>

      {/* ── HERO ZONE ── */}
      <main style={P.main}>
        <div style={{ ...P.heroBlock, ...anim(0) }}>
          <FrequencyCore />

          <h1 className="sg-brand" style={P.brand}>
            SANRI
          </h1>
          <p style={P.subtitle}>
            {isTR ? "Bilinç ve Anlam Zekası" : "Consciousness & Meaning Intelligence"}
          </p>
          <p style={P.motto}>
            {isTR
              ? "SANRI cevap üretmez. Alan açar."
              : "SANRI does not generate answers. It opens space."}
          </p>
        </div>

        {/* ── AUTH CARD ── */}
        <div className="sg-card" style={{ ...P.card, ...anim(0.15) }}>
          {mode === "welcome" ? (
            <>
              <div style={P.cardGreet}>
                {isTR ? "Hoş geldin" : "Welcome"}
              </div>
              <div style={P.cardSub}>
                {isTR ? "Devam etmek için bir yol seç." : "Choose a way to continue."}
              </div>

              <button
                className="sg-btn"
                style={P.btnPrimary}
                onClick={() => switchMode("login")}
              >
                <MailIcon />
                {isTR ? "E-posta ile devam et" : "Continue with email"}
              </button>

              <button
                className="sg-btn"
                style={P.btnSecondary}
                onClick={() => switchMode("register")}
              >
                {isTR ? "Alanını oluştur" : "Create your space"}
              </button>

              <div style={P.divider}>
                <div style={P.divLine} />
                <span style={P.divText}>{isTR ? "veya" : "or"}</span>
                <div style={P.divLine} />
              </div>

              <button
                className="sg-btn"
                style={P.btnGhost}
                onClick={guestEnter}
              >
                {isTR ? "Misafir olarak keşfet" : "Explore as guest"}
              </button>
            </>
          ) : (
            <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
              <div style={P.formTitle}>
                {mode === "login"
                  ? isTR ? "Giriş Yap" : "Sign In"
                  : isTR ? "Alanını Oluştur" : "Create Your Space"}
              </div>

              {mode === "register" && (
                <div style={P.fieldGroup}>
                  <label style={P.label}>{isTR ? "Adın" : "Your name"}</label>
                  <input
                    className="sg-input"
                    style={P.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isTR ? "İsim..." : "Name..."}
                    autoComplete="name"
                  />
                </div>
              )}

              <div style={P.fieldGroup}>
                <label style={P.label}>{isTR ? "E-posta" : "Email"}</label>
                <input
                  className="sg-input"
                  style={P.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@..."
                  autoComplete="email"
                />
              </div>

              <div style={P.fieldGroup}>
                <label style={P.label}>{isTR ? "Şifre" : "Password"}</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="sg-input"
                    style={P.input}
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={P.eyeBtn}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "◉" : "◎"}
                  </button>
                </div>
              </div>

              {err && <div style={P.error} role="alert">{err}</div>}

              <button
                className="sg-btn"
                type="submit"
                style={P.btnPrimary}
                disabled={busy}
              >
                {busy
                  ? (isTR ? "Bağlanıyor…" : "Connecting…")
                  : mode === "login"
                    ? isTR ? "Giriş Yap" : "Sign In"
                    : isTR ? "Kayıt Ol" : "Register"}
              </button>

              <div style={P.switchRow}>
                <span style={{ opacity: 0.45 }}>
                  {mode === "login"
                    ? isTR ? "Henüz alanın yok mu?" : "No space yet?"
                    : isTR ? "Zaten bir alanın var mı?" : "Already have a space?"}
                </span>
                <button
                  type="button"
                  className="sg-btn"
                  style={P.linkBtn}
                  onClick={() =>
                    switchMode(mode === "login" ? "register" : "login")
                  }
                >
                  {mode === "login"
                    ? isTR ? "Oluştur" : "Create"
                    : isTR ? "Giriş Yap" : "Sign In"}
                </button>
              </div>

              <button
                type="button"
                className="sg-btn"
                style={P.backBtn}
                onClick={() => switchMode("welcome")}
              >
                ← {isTR ? "Geri" : "Back"}
              </button>
            </form>
          )}

          {/* Legal */}
          <div style={P.legal}>
            {isTR ? "Devam ederek " : "By continuing, you agree to the "}
            <Link to="/kullanim-sartlari" style={P.legalLink}>
              {isTR ? "Kullanım Koşulları" : "Terms of Use"}
            </Link>
            {isTR ? " ve " : " and "}
            <Link to="/gizlilik" style={P.legalLink}>
              {isTR ? "Gizlilik Politikası" : "Privacy Policy"}
            </Link>
            {isTR ? "'nı kabul etmiş olursun." : "."}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════ */

function MailIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════ */

const P = {
  /* ── Page ── */
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "rgba(255,255,255,.92)",
    background:
      "radial-gradient(ellipse 800px 450px at 50% 15%, rgba(100,130,200,.07), transparent 65%)," +
      "radial-gradient(ellipse 600px 350px at 70% 75%, rgba(130,100,200,.04), transparent 60%)," +
      "linear-gradient(185deg, #080a12 0%, #0a0d17 40%, #070810 100%)",
  },

  /* ── Topbar ── */
  topbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
  },
  topLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  topBrand: {
    fontWeight: 900,
    fontSize: 13,
    letterSpacing: ".18em",
    color: "rgba(255,255,255,.75)",
  },
  topSub: {
    fontSize: 10,
    letterSpacing: ".08em",
    opacity: 0.3,
    display: "inline-block",
  },
  langPill: {
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.04)",
    backdropFilter: "blur(12px)",
    color: "rgba(255,255,255,.65)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: ".12em",
    transition: "all .2s",
  },

  /* ── Main ── */
  main: {
    position: "relative",
    zIndex: 5,
    width: "100%",
    maxWidth: 480,
    padding: "80px 16px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
  },

  /* ── Hero ── */
  heroBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  brand: {
    fontWeight: 900,
    fontSize: 32,
    letterSpacing: ".28em",
    marginTop: 20,
    background: "linear-gradient(135deg, rgba(200,220,255,.95), rgba(180,160,255,.85))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: ".14em",
    opacity: 0.35,
    textTransform: "uppercase",
    margin: 0,
  },
  motto: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.6,
    opacity: 0.5,
    maxWidth: 320,
    margin: "4px 0 0",
    fontStyle: "italic",
  },

  /* ── Card ── */
  card: {
    width: "100%",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,.07)",
    background: "rgba(12,14,22,.65)",
    backdropFilter: "blur(24px) saturate(1.2)",
    boxShadow:
      "0 4px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)",
    padding: "36px 32px 28px",
    display: "grid",
    gap: 14,
  },
  cardGreet: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: ".02em",
    color: "rgba(255,255,255,.88)",
  },
  cardSub: {
    fontSize: 13,
    textAlign: "center",
    opacity: 0.4,
    marginBottom: 6,
  },

  /* ── Buttons ── */
  btnPrimary: {
    width: "100%",
    padding: "15px 20px",
    borderRadius: 14,
    border: "1px solid rgba(124,247,216,.20)",
    background:
      "linear-gradient(135deg, rgba(124,247,216,.12) 0%, rgba(160,140,255,.08) 100%)",
    boxShadow: "0 0 24px rgba(124,247,216,.06), inset 0 1px 0 rgba(255,255,255,.04)",
    color: "rgba(124,247,216,.9)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: ".02em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all .2s ease",
  },
  btnSecondary: {
    width: "100%",
    padding: "15px 20px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.09)",
    background: "rgba(255,255,255,.03)",
    color: "rgba(255,255,255,.78)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: ".01em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .2s ease",
  },
  btnGhost: {
    width: "100%",
    padding: "13px 20px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.05)",
    background: "transparent",
    color: "rgba(255,255,255,.42)",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: ".02em",
    transition: "all .2s ease",
  },

  /* ── Divider ── */
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    margin: "2px 0",
  },
  divLine: {
    flex: 1,
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent)",
  },
  divText: {
    fontSize: 11,
    opacity: 0.25,
    letterSpacing: ".12em",
    fontWeight: 500,
  },

  /* ── Form ── */
  formTitle: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: ".02em",
  },
  fieldGroup: { display: "grid", gap: 6 },
  label: {
    fontSize: 11,
    fontWeight: 600,
    opacity: 0.4,
    letterSpacing: ".08em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(0,0,0,.25)",
    color: "rgba(255,255,255,.92)",
    outline: "none",
    fontSize: 15,
    fontWeight: 400,
    boxSizing: "border-box",
    transition: "border-color .2s, box-shadow .2s",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255,255,255,.3)",
    cursor: "pointer",
    fontSize: 16,
    padding: 4,
  },
  error: {
    padding: "11px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,100,100,.20)",
    background: "rgba(255,60,60,.06)",
    color: "rgba(255,200,200,.85)",
    fontSize: 13,
    lineHeight: 1.4,
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
    color: "rgba(124,247,216,.75)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    padding: 0,
    transition: "color .15s",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,.3)",
    cursor: "pointer",
    fontSize: 13,
    textAlign: "center",
    padding: 4,
    transition: "color .15s",
  },

  /* ── Legal ── */
  legal: {
    fontSize: 11,
    lineHeight: 1.5,
    opacity: 0.3,
    textAlign: "center",
    marginTop: 6,
  },
  legalLink: {
    color: "rgba(180,170,220,.7)",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
};
