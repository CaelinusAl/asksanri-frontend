import React, { useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminLoginPage.module.css";

function resolveFromState(from) {
  if (!from) return "/admin";
  if (typeof from === "string") return from;
  const { pathname = "/admin", search = "", hash = "" } = from;
  return `${pathname}${search}${hash}`;
}

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login({ email, password });
      navigate(resolveFromState(location.state?.from), { replace: true });
    } catch (ex) {
      setError(String(ex?.message || ex));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.brand}>SANRI</h1>
          <p className={styles.subtitle}>Control Center</p>
        </header>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Email</span>
            <input
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Password</span>
            <input
              className={styles.input}
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
          <button className={styles.submit} type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
