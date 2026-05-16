import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { buildSanriNavSections } from "../../data/sanriNavSections";
import styles from "./Footer.module.css";

const ADMIN_PREFIX = "/admin";

export function Footer() {
  const { pathname } = useLocation();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isTR = language === "tr";

  const [areasOpen, setAreasOpen] = useState(false);

  const sections = useMemo(
    () => buildSanriNavSections(isAuthenticated),
    [isAuthenticated]
  );

  if (pathname.startsWith(ADMIN_PREFIX)) return null;

  const aboutTo =
    language === "tr" ? "/hakkimizda" : { pathname: "/hakkimizda", search: "?lang=en" };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.accordion}>
          <button
            type="button"
            className={styles.accordionBtn}
            aria-expanded={areasOpen}
            onClick={() => setAreasOpen((v) => !v)}
          >
            <span>{isTR ? "Tüm alanlar" : "All areas"}</span>
            <span
              className={`${styles.chevron} ${areasOpen ? styles.chevronOpen : ""}`}
              aria-hidden
            >
              ▾
            </span>
          </button>

          {areasOpen && (
            <div className={styles.accordionPanel} role="region">
              {sections.map((section) => (
                <div key={section.titleTr} className={styles.block}>
                  <p className={styles.blockTitle}>
                    {isTR ? section.titleTr : section.titleEn}
                  </p>
                  <ul className={styles.linkList}>
                    {section.items.map((item) => (
                      <li key={`${section.titleTr}-${item.to}`}>
                        <NavLink
                          to={item.to}
                          end={item.end}
                          className={({ isActive }) =>
                            isActive ? styles.navLinkActive : styles.navLink
                          }
                        >
                          {isTR ? item.tr : item.en}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className={styles.legalRow} aria-label="footer-legal">
          <Link to="/gizlilik-politikasi" className={styles.legalLink}>
            {isTR ? "Gizlilik" : "Privacy"}
          </Link>
          <span className={styles.sep} aria-hidden>
            |
          </span>
          <Link to="/mesafeli-satis" className={styles.legalLink}>
            {isTR ? "Mesafeli satış" : "Distance sales"}
          </Link>
          <span className={styles.sep} aria-hidden>
            |
          </span>
          <Link to="/iade-kosullari" className={styles.legalLink}>
            {isTR ? "İade" : "Refunds"}
          </Link>
          <span className={styles.sep} aria-hidden>
            |
          </span>
          <a href="/gizlilik-politikasi#cookies" className={styles.legalLink}>
            {t("footer.cookies")}
          </a>
          <span className={styles.sep} aria-hidden>
            |
          </span>
          <Link to={aboutTo} className={styles.legalLink}>
            {t("footer.about")}
          </Link>
          <span className={styles.sep} aria-hidden>
            |
          </span>
          <a href="mailto:selin@asksanri.com" className={styles.legalLink}>
            {t("footer.contact")}
          </a>
        </nav>

        <div className={styles.company}>CR YAPIM VE AJANS TEKNOLOJİLERİ TİC.ŞTİ.</div>

        <div className={styles.detail}>
          {t("footer.taxOffice")} &nbsp;•&nbsp; {t("footer.contact")}: selin@asksanri.com
        </div>

        <div className={styles.copyright}>
          © {new Date().getFullYear()} CaelinusAI • SANRI
        </div>
      </div>
    </footer>
  );
}
