import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LibraryPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { unlockAudio } from "../utils/sfx";
import { booksMetadata } from "../data/booksContent";

export default function LibraryPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { isPremium, isContentUnlocked } = usePremium();
  const isTR = language === "tr";

  const goBack = () => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.subttl}>
            {isTR ? "Kütüphane • Bilinç Kitaplığı" : "Library • Consciousness Books"}
          </span>
        </div>
        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={goBack}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.h1}>
          {isTR ? "Kütüphane" : "Library"}
        </h1>
        <p className={styles.heroSub}>
          {isTR
            ? "Her kitap bir kapı. Sayfalar döndükçe bilinç açılır."
            : "Each book is a gate. As pages turn, consciousness opens."}
        </p>
      </div>

      <div className={styles.grid}>
        {booksMetadata.map((book) => (
          <div
            key={book.id}
            className={styles.bookCard}
            onClick={() => navigate(`/library/${book.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/library/${book.id}`);
            }}
          >
            <div className={styles.bookAccent} style={{ background: book.color }} />
            <div style={{ position: "relative" }}>
              <img
                className={styles.bookCover}
                src={book.cover}
                alt={book.title}
                loading="lazy"
              />
              {book.isPremium && !isPremium && !isContentUnlocked(book.id) && (
                <span className={styles.lockBadge}>
                  {book.price > 0 ? `₺${book.price}` : "🔒"}
                </span>
              )}
              {(!book.isPremium || book.price === 0) && (
                <span className={styles.freeBadge}>
                  {isTR ? "Ücretsiz" : "Free"}
                </span>
              )}
            </div>
            <div className={styles.bookInfo}>
              <div className={styles.bookTitle}>{book.title}</div>
              <div className={styles.bookAuthor}>CELINE RIVER</div>
              <div className={styles.bookDesc}>{book.description}</div>
              <div className={styles.bookMeta}>
                <span className={styles.bookPages}>
                  {book.chapters?.length || 0} {isTR ? "bölüm" : "chapters"}
                </span>
                <button
                  type="button"
                  className={styles.bookOpenBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/library/${book.id}`);
                  }}
                >
                  {isTR ? "Kitabı Aç" : "Open Book"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>© 2026 CaelinusAI • SANRI</div>
    </div>
  );
}
