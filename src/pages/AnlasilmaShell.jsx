import React, { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "./AnlasilmaShell.module.css";

/**
 * Sanrı = Anlaşılma Alanı — tüm ana deneyim bu kabukta.
 * Frekans, Yankı, Rol Okuma alt modüller; Keşfet → Kapılar (ikincil).
 */
export default function AnlasilmaShell() {
  const { language } = useLanguage();
  const isTR = language === "tr";
  const [moreOpen, setMoreOpen] = useState(false);

  const nav = [
    { to: "/", end: true, tr: "Anlaşılma", en: "Understanding" },
    { to: "/frekans", tr: "Frekans", en: "Frequency" },
    { to: "/yanki", tr: "Yankı", en: "Echo" },
    { to: "/rol-okuma", tr: "Rol Okuma", en: "Role reading" },
  ];

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <Link to="/" className={styles.brand}>
            SANRI
          </Link>
          <span className={styles.tagline}>{isTR ? "Anlaşılma Alanı" : "Field of Understanding"}</span>
        </div>
        <nav className={styles.nav} aria-label={isTR ? "Ana modüller" : "Main modules"}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            >
              {isTR ? item.tr : item.en}
            </NavLink>
          ))}
          <div className={styles.moreWrap}>
            <button
              type="button"
              className={styles.moreBtn}
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            >
              {isTR ? "Keşfet ▾" : "Explore ▾"}
            </button>
            {moreOpen && (
              <div className={styles.moreMenu}>
                <Link to="/kapilar" className={styles.moreItem} onClick={() => setMoreOpen(false)}>
                  {isTR ? "Kapılar (tüm alanlar)" : "Gates (all areas)"}
                </Link>
                <Link to="/okuma-alani" className={styles.moreItem} onClick={() => setMoreOpen(false)}>
                  {isTR ? "Okuma alanı" : "Readings"}
                </Link>
                <Link to="/library" className={styles.moreItem} onClick={() => setMoreOpen(false)}>
                  {isTR ? "Kütüphane" : "Library"}
                </Link>
                <Link to="/rituel-alani" className={styles.moreItem} onClick={() => setMoreOpen(false)}>
                  {isTR ? "Ritüel" : "Rituals"}
                </Link>
                <Link to="/sanriya-sor" className={styles.moreItem} onClick={() => setMoreOpen(false)}>
                  {isTR ? "Sanrı'ya sor" : "Ask Sanrı"}
                </Link>
                <Link to="/giris" className={styles.moreItem} onClick={() => setMoreOpen(false)}>
                  {isTR ? "Giriş / Profil" : "Sign in / Profile"}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
