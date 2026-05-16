import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { buildSanriNavSections } from "../data/sanriNavSections";
import styles from "./AnlasilmaShell.module.css";

/**
 * Sanrı = Anlaşılma Alanı — ana kabuk.
 * Üst bar: SANRI + (isteğe bağlı) Sor pill + dil + giriş/profil + hamburger.
 * Diğer tüm ürünler çekmece menüsünde gruplanır.
 */
export default function AnlasilmaShell() {
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const isTR = language === "tr";
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sections = useMemo(
    () => buildSanriNavSections(isAuthenticated),
    [isAuthenticated]
  );

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const askLabel = isTR ? "Sanrı'ya Sor" : "Ask SANRI";
  const isOnAskPage =
    location.pathname === "/sanriya-sor" ||
    location.pathname === "/sanri" ||
    location.pathname === "/ask";

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brandRow} aria-label="SANRI">
          <span className={styles.brand}>SANRI</span>
          <span className={styles.tagline}>
            {isTR ? "Anlaşılma Alanı" : "Field of Understanding"}
          </span>
        </Link>

        <div className={styles.actions}>
          {!isOnAskPage && (
            <NavLink to="/sanriya-sor" className={styles.askPill}>
              {askLabel}
            </NavLink>
          )}

          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            aria-label={isTR ? "Switch to English" : "Türkçeye geç"}
          >
            {isTR ? "EN" : "TR"}
          </button>

          {isAuthenticated ? (
            <Link to="/profil" className={styles.signInBtn}>
              {isTR ? "Profil" : "Profile"}
            </Link>
          ) : (
            <Link to="/giris" className={styles.signInBtn}>
              {isTR ? "Giriş" : "Sign in"}
            </Link>
          )}

          <button
            type="button"
            className={styles.burgerBtn}
            onClick={() => setDrawerOpen(true)}
            aria-label={isTR ? "Menüyü aç" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="sanri-drawer"
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="sanri-drawer"
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal={drawerOpen}
        aria-label={isTR ? "Tüm alanlar" : "All areas"}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>
            {isTR ? "Tüm alanlar" : "All areas"}
          </span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setDrawerOpen(false)}
            aria-label={isTR ? "Menüyü kapat" : "Close menu"}
          >
            ×
          </button>
        </div>

        <nav className={styles.drawerNav}>
          {sections.map((section) => (
            <div key={section.titleTr} className={styles.section}>
              <p className={styles.sectionTitle}>
                {isTR ? section.titleTr : section.titleEn}
              </p>
              <ul className={styles.itemList}>
                {section.items.map((item) => (
                  <li key={`${section.titleTr}-${item.to}`}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ""}`
                      }
                    >
                      {isTR ? item.tr : item.en}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {isAuthenticated && (
          <div className={styles.drawerFooter}>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => {
                setDrawerOpen(false);
                logout();
              }}
            >
              {isTR ? "Çıkış yap" : "Log out"}
            </button>
          </div>
        )}
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
