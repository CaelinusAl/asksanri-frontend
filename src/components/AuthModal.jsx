import React, { useCallback, useMemo, useState } from "react";
import styles from "./AuthModal.module.css";
import MatrixRain from "./MatrixRain";
import { useLanguage } from "../contexts/LanguageContext";

export default function AuthModal({ open, onClose, onGuest, onLoginSuccess }) {
  const { language } = useLanguage();
  const isTR = language === "tr";

  const [tab, setTab] = useState("login"); // login | register | guest
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [rain, setRain] = useState(false);

  const title = isTR ? "Sanrı Anahtarı" : "Sanri Key";
  const subtitle = isTR
    ? "Giriş yap • Misafir gir • Yaşam Koçu panelini aktive et."
    : "Sign in • Enter as guest • Activate your life coach panel.";

  const reset = useCallback(() => {
    setErr("");
    setBusy(false);
  }, []);

  const closeSafe = useCallback(() => {
    reset();
    onClose?.();
  }, [onClose, reset]);

  const api = import.meta.env.VITE_BACKEND_URL;

  const canSubmit = useMemo(() => {
    if (tab === "guest") return true;
    return Boolean(String(email).trim() && String(password).trim());
  }, [tab, email, password]);

  const submit = useCallback(async () => {
    setErr("");
    if (!canSubmit) return;

    if (tab === "guest") {
      // ✅ misafir: matrix yağmuru + yönlendirme
      setRain(true);
      return;
    }

    if (!api) {
      setErr(isTR ? "VITE_BACKEND_URL eksik." : "Missing VITE_BACKEND_URL.");
      return;
    }

    setBusy(true);
    try {
      const url =
        tab === "login"
          ? `${api}/auth/login`
          : `${api}/auth/register`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.detail || data?.error || (tab === "login" ? "Login failed" : "Register failed"));
      }

      if (data?.token) {
        try { localStorage.setItem("sanri_token", data.token); } catch {}
      }

      setRain(true);
    } catch (e) {
      setErr(String(e?.message || e));
      setBusy(false);
    }
  }, [api, tab, email, password, isTR, canSubmit]);

  if (!open) return null;

  return (
    <>
      <div className={styles.backdrop} onMouseDown={closeSafe}>
        <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
          <div className={styles.head}>
            <div className={styles.title}>
              <span className={styles.pyramid} aria-hidden="true" />
              <div>
                <div>{title}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{isTR ? "Piramid Anahtar • Matrix Kapısı" : "Pyramid Key • Matrix Gate"}</div>
              </div>
            </div>
            <button className={styles.close} type="button" onClick={closeSafe}>
              ✕
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.subtitle}>{subtitle}</div>

            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${tab === "login" ? styles.tabActive : ""}`}
                onClick={() => setTab("login")}
              >
                {isTR ? "Giriş" : "Login"}
              </button>
              <button
                type="button"
                className={`${styles.tab} ${tab === "register" ? styles.tabActive : ""}`}
                onClick={() => setTab("register")}
              >
                {isTR ? "Kayıt" : "Register"}
              </button>
              <button
                type="button"
                className={`${styles.tab} ${tab === "guest" ? styles.tabActive : ""}`}
                onClick={() => setTab("guest")}
              >
                {isTR ? "Misafir" : "Guest"}
              </button>
            </div>

            {tab !== "guest" ? (
              <>
                <div className={styles.field}>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{isTR ? "E-posta" : "Email"}</div>
                  <input
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isTR ? "email@…" : "email@…"}
                    autoComplete="email"
                  />
                </div>

                <div className={styles.field}>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{isTR ? "Şifre" : "Password"}</div>
                  <input
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isTR ? "••••••••" : "••••••••"}
                    type="password"
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                  />
                </div>
              </>
            ) : (
              <div className={styles.note}>
                {isTR
                  ? "Misafir giriş: Panel + Notlar açık. Premium kapılar kilitli."
                  : "Guest entry: Panel + Notes open. Premium gates locked."}
              </div>
            )}

            <div className={styles.row}>
              <button
                type="button"
                className={styles.primary}
                disabled={busy || !canSubmit}
                onClick={submit}
              >
                {tab === "guest"
                  ? (isTR ? "Misafir Gir" : "Enter as Guest")
                  : tab === "login"
                    ? (isTR ? "Frekansı Aktive Et" : "Activate Frequency")
                    : (isTR ? "Kayıt Ol" : "Create Account")}
              </button>

              <button type="button" className={styles.ghost} onClick={closeSafe} disabled={busy}>
                {isTR ? "Kapat" : "Close"}
              </button>
            </div>

            {err ? <div className={styles.error}>{err}</div> : null}

            <div className={styles.note}>
              {isTR
                ? "Not: Kayıt tamamlanınca Matrix yağmuru açılır ve panele geçersin."
                : "Note: After success, Matrix rain plays and you’ll enter the panel."}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Matrix Rain overlay */}
      <MatrixRain
        active={rain}
        durationMs={1400}
        onDone={() => {
          // kayıt/giriş/misafir bitince:
          try {
            if (tab === "guest") localStorage.setItem("sanri_guest", "1");
          } catch {}

          setRain(false);
          setBusy(false);

          // yönlendirme
          onClose?.();
          if (tab === "guest") onGuest?.();
          else onLoginSuccess?.();
        }}
      />
    </>
  );
}