// src/pages/LibraryPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LibraryPage.module.css";
import { useLanguage } from "../contexts/LanguageContext";
import { libraryItems } from "../data/libraryItems";

export default function LibraryPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const items = useMemo(() => libraryItems, []);

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.left}>
          <div className={styles.brand}>CAELINUS AI</div>
          <div className={styles.sub}>{isTR ? "Library • Kitaplık" : "Library • Books"}</div>
        </div>

        <div className={styles.right}>
          <button className={styles.backBtn} onClick={() => navigate("/", { state: { skipIntro: true } })}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.header}>
          <div className={styles.h1}>{isTR ? "KİTAPLIK" : "LIBRARY"}</div>
          <div className={styles.p}>
            {isTR
              ? "E-kitaplar + sesli bölümler burada. Bir kapı gibi açılır."
              : "E-books + voiced chapters live here. Opens like a gate."}
          </div>
        </div>

        <div className={styles.grid}>
          {items.map((b) => (
            <div key={b.id} className={styles.card}>
              <div className={styles.kicker}>
                {b.tag === "FREE" ? (isTR ? "ÜCRETSİZ" : "FREE") : "PREMIUM"}
              </div>
              <div className={styles.title}>{isTR ? b.titleTR : b.titleEN}</div>
              <div className={styles.desc}>{isTR ? b.descTR : b.descEN}</div>

              <div className={styles.actions}>
                <a className={styles.btn} href={b.pdf} target="_blank" rel="noreferrer">
                  {isTR ? "PDF Aç" : "Open PDF"}
                </a>

                {isTR && b.audioTR ? (
                  <a className={styles.btnGhost} href={b.audioTR} target="_blank" rel="noreferrer">
                    {isTR ? "Ses (TR)" : "Audio (TR)"}
                  </a>
                ) : null}

                {!isTR && b.audioEN ? (
                  <a className={styles.btnGhost} href={b.audioEN} target="_blank" rel="noreferrer">
                    {isTR ? "Ses (EN)" : "Audio (EN)"}
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}