import React, { useEffect, useRef, useState } from "react";
import styles from "./PremiumGateModal.module.css";
import { unlockAudio, playSfx } from "../utils/sfx";

export default function PremiumGateModal({
  open,
  onClose,
  title = "Ritüel Alanı • Premium Kapı",
  subtitle = "Bu kapı, bilinç katmanı derin olanlara açılır.\nGiriş yap ve alanı aktive et.",
  note = "Not: Google ile giriş endpoint’in var (/api/auth/google/session). Onu da ekleriz; önce email login’i sağlamlaştıralım.",
  onRegister,
  onLogin,
}) {
  const [tab, setTab] = useState("register"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      hasPlayedRef.current = false;
      return;
    }
    // Modal açılınca sadece 1 kere hafif chime
    if (!hasPlayedRef.current) {
      unlockAudio();
      playSfx("/sfx/aura-chime.mp3", { volume: 0.22 });
      hasPlayedRef.current = true;
    }
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = () => {
    unlockAudio();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    unlockAudio();

    const payload = { email: String(email).trim(), password: String(password) };
    if (!payload.email || !payload.password) return;

    try {
      if (tab === "login") {
        await onLogin?.(payload);
      } else {
        await onRegister?.(payload);
      }
    } catch {
      // hata yönetimi parent’ta olabilir; burada sessiz kalıyoruz
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick} onPointerDown={handleOverlayClick}>
      <div className={styles.premiumOverlayGlow} />

      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>
            {subtitle.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${tab === "login" ? styles.active : ""}`}
            onClick={() => setTab("login")}
          >
            Giriş
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === "register" ? styles.active : ""}`}
            onClick={() => setTab("register")}
          >
            Kayıt
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
          />
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            type="password"
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />

          <button type="submit" className={styles.cta}>
            {tab === "login" ? "Girişi Tamamla" : "✨ Frekansı Aktive Et"}
          </button>
        </form>

        {note ? <div className={styles.note}>{note}</div> : null}
      </div>
    </div>
  );
}