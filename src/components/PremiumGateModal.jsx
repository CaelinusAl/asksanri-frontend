// src/components/PremiumGateModal.jsx
import React, { useMemo, useState } from "react";
import styles from "./PremiumGateModal.module.css";

export default function PremiumGateModal({
  open,
  onClose,
  title,
  subtitle,
  primaryCtaTextTR = "✨ Frekansı Aktive Et",
  primaryCtaTextEN = "✨ Activate Frequency",
  onLogin,
  onRegister,
  isTR = true,
}) {
  const [tab, setTab] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const primaryText = isTR ? primaryCtaTextTR : primaryCtaTextEN;

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length > 3;
  }, [email, password]);

  if (!open) return null;

  const submit = async () => {
    const payload = { email: email.trim(), password: password.trim() };
    if (tab === "login") await onLogin?.(payload);
    else await onRegister?.(payload);
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.close} type="button" onClick={onClose} aria-label="close">
          ×
        </button>

        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${tab === "login" ? styles.active : ""}`}
            onClick={() => setTab("login")}
          >
            {isTR ? "Giriş" : "Login"}
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === "register" ? styles.active : ""}`}
            onClick={() => setTab("register")}
          >
            {isTR ? "Kayıt" : "Register"}
          </button>
        </div>

        <div className={styles.form}>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isTR ? "Email" : "Email"}
            autoComplete="email"
          />
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isTR ? "Şifre" : "Password"}
            type="password"
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />

          <button type="button" className={styles.primary} disabled={!canSubmit} onClick={submit}>
            {primaryText}
          </button>

          <div className={styles.note}>
            {isTR
              ? "Not: Google ile giriş endpoint’in var (/api/auth/google/session). Onu da ekleriz; önce email login’i sağlamlaştıralım."
              : "Note: You have a Google login endpoint (/api/auth/google/session). We can add it next; first stabilize email login."}
          </div>
        </div>
      </div>
    </div>
  );
}