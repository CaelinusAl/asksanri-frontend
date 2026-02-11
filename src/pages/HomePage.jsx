import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "./HomePage.module.css";

const GATES = [
  { id: "sanri", titleKey: "gates.sanri.title", descKey: "gates.sanri.desc", to: "/sanriya-sor", badge: "HOT" },
  { id: "bilinc", titleKey: "gates.bilinc.title", descKey: "gates.bilinc.desc", to: "/bilinc", badge: "" },
  { id: "frekans", titleKey: "gates.frekans.title", descKey: "gates.frekans.desc", to: "/frekans", badge: "" },
  { id: "rituel", titleKey: "gates.rituel.title", descKey: "gates.rituel.desc", to: "/rituel", badge: "PREMIUM" },
];

export default function HomePage() {
  const nav = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const toggleLang = () => setLanguage(language === "tr" ? "en" : "tr");

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandChip}>CAELINUS AI</span>
          <span className={styles.brandSub}>{t("home.topbar.subtitle")}</span>
        </div>

        <div className={styles.right}>
          <button className={styles.lang} type="button" onClick={toggleLang}>
            {language.toUpperCase()}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.eye} aria-hidden />
          <h1 className={styles.h1}>{t("home.title")}</h1>
          <p className={styles.p}>{t("home.subtitle")}</p>
        </section>

        <section className={styles.gates}>
          <div className={styles.gatesTitle}>{t("gates.title")}</div>

          <div className={styles.grid}>
            {GATES.map((g) => (
              <button key={g.id} className={styles.card} type="button" onClick={() => nav(g.to)}>
                <div className={styles.cardTop}>
                  <div className={styles.cardTitle}>{t(g.titleKey)}</div>
                  {g.badge ? <span className={styles.badge}>{g.badge}</span> : null}
                </div>
                <div className={styles.cardDesc}>{t(g.descKey)}</div>
                <div className={styles.cardHint}>{t("home.cardHint")}</div>
              </button>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <span>{t("home.footerNote")}</span>
        </footer>
      </main>
    </div>
  );
}
