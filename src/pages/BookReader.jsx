import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BookReader.module.css";
import { booksMetadata, loadBookPages } from "../data/booksContent";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { PremiumGate } from "../components/premium/PremiumGate";
import { unlockAudio } from "../utils/sfx";

/* ── Page Renderers by Type ── */

function PageCover({ page, meta }) {
  return (
    <div className={styles.pageCover}>
      <div className={styles.coverAccent} style={{ background: meta.color }} />
      <div className={styles.coverLabel}>CAELINUS</div>
      <h1 className={styles.coverTitle}>{page.title}</h1>
      <div className={styles.coverSub}>{page.subtitle}</div>
      {page.author && <div className={styles.coverAuthor}>{page.author}</div>}
    </div>
  );
}

function PageDedication({ page }) {
  return (
    <div className={styles.pageDedication}>
      <div className={styles.dedicationTitle}>{page.title}</div>
      <div className={styles.dedicationBody}>{page.body}</div>
    </div>
  );
}

function PageToc({ page }) {
  return (
    <div className={styles.pageToc}>
      <div className={styles.tocTitle}>{page.title}</div>
      <div className={styles.tocDesc}>{page.body}</div>
      {page.items && (
        <ol className={styles.tocList}>
          {page.items.map((item, i) => (
            <li key={i} className={styles.tocItem}>{item}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

function PageChapter({ page }) {
  return (
    <div className={styles.pageChapter}>
      <div className={styles.chapterNum}>
        {typeof page.number === "number"
          ? `${page.number}. Kapı`
          : /^[IVXLC]+$/.test(page.number)
            ? `Bölüm ${page.number}`
            : `Bölüm ${page.number}`}
      </div>
      <h2 className={styles.chapterTitle}>{page.title}</h2>
      {page.epigraph && (
        <div className={styles.chapterEpigraph}>{page.epigraph}</div>
      )}
    </div>
  );
}

function PageContent({ page }) {
  return (
    <div className={styles.pageContentWrap}>
      <div className={styles.contentTitle}>{page.title}</div>
      {page.subtitle && (
        <div className={styles.contentSubtitle}>{page.subtitle}</div>
      )}
      {page.quote && (
        <blockquote className={styles.contentQuote}>{page.quote}</blockquote>
      )}
      <div className={styles.contentBody}>{page.body}</div>
    </div>
  );
}

function PageQuote({ page }) {
  return (
    <div className={styles.pageQuote}>
      <div className={styles.quoteTitle}>{page.title}</div>
      <blockquote className={styles.quoteBody}>{page.body}</blockquote>
    </div>
  );
}

function PageRitual({ page }) {
  return (
    <div className={styles.pageRitual}>
      <div className={styles.ritualIcon}>☽</div>
      <div className={styles.ritualTitle}>{page.title}</div>
      <div className={styles.ritualBody}>{page.body}</div>
      {page.quote && (
        <div className={styles.ritualQuote}>{page.quote}</div>
      )}
    </div>
  );
}

function PageClosing({ page }) {
  return (
    <div className={styles.pageClosing}>
      <div className={styles.closingTitle}>{page.title}</div>
      <div className={styles.closingBody}>{page.body}</div>
      <div className={styles.closingSymbol}>✦</div>
    </div>
  );
}

function PageLegacy({ page }) {
  return (
    <div className={styles.pageContentWrap}>
      <div className={styles.contentBody}>
        {typeof page === "string" ? page : page.body || ""}
      </div>
    </div>
  );
}

const RENDERERS = {
  cover: PageCover,
  dedication: PageDedication,
  toc: PageToc,
  chapter: PageChapter,
  content: PageContent,
  quote: PageQuote,
  ritual: PageRitual,
  closing: PageClosing,
};

function RenderPage({ page, meta, pageNum }) {
  if (!page) {
    return <div className={styles.pageEmpty}>☽</div>;
  }

  if (typeof page === "string") {
    return <PageLegacy page={page} />;
  }

  const Comp = RENDERERS[page.type] || PageLegacy;
  return <Comp page={page} meta={meta} pageNum={pageNum} />;
}

/* ── Main Book Reader ── */

export default function BookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isPremium } = usePremium();
  const isTR = language === "tr";

  const meta = booksMetadata.find((b) => b.id === bookId);
  const isBookLocked = meta?.isPremium && !isPremium;
  const freeLimit = meta?.freePreviewPages || 5;

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spread, setSpread] = useState(0);
  const [flipping, setFlipping] = useState(null);
  const [chaptersOpen, setChaptersOpen] = useState(false);

  useEffect(() => {
    if (!meta) return;
    setLoading(true);
    loadBookPages(bookId).then((p) => {
      setPages(p);
      setLoading(false);
      setSpread(0);
    });
  }, [bookId, meta]);

  const totalSpreads = Math.ceil(pages.length / 2);
  const leftIdx = spread * 2;
  const rightIdx = spread * 2 + 1;
  const progress = totalSpreads > 0 ? (spread + 1) / totalSpreads : 0;

  const chapterPages = useMemo(() => {
    if (!pages.length) return [];
    return pages
      .map((p, i) => ({ ...p, idx: i }))
      .filter((p) => p.type === "chapter" || p.type === "cover");
  }, [pages]);

  const maxFreeSpread = isBookLocked ? Math.ceil(freeLimit / 2) : totalSpreads;
  const isAtPremiumWall = isBookLocked && spread >= maxFreeSpread - 1;

  const goNext = useCallback(() => {
    if (flipping || spread >= totalSpreads - 1) return;
    if (isBookLocked && spread + 1 >= maxFreeSpread) {
      setSpread(maxFreeSpread - 1);
      return;
    }
    setFlipping("next");
    setTimeout(() => {
      setSpread((s) => s + 1);
      setFlipping(null);
    }, 450);
  }, [flipping, spread, totalSpreads, isBookLocked, maxFreeSpread]);

  const goPrev = useCallback(() => {
    if (flipping || spread <= 0) return;
    setFlipping("prev");
    setTimeout(() => {
      setSpread((s) => s - 1);
      setFlipping(null);
    }, 450);
  }, [flipping, spread]);

  const goToPage = useCallback((pageIdx) => {
    setSpread(Math.floor(pageIdx / 2));
    setChaptersOpen(false);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "Escape") setChaptersOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  if (!meta) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Kitap bulunamadı.</div>
      </div>
    );
  }

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.bookTitleBar}>{meta.title}</span>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.pageIndicator}>
            {leftIdx + 1}–{Math.min(rightIdx + 1, pages.length)} / {pages.length}
          </span>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/library")}
          >
            {isTR ? "← Kütüphane" : "← Library"}
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress * 100}%`, background: meta.color }}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>
          {isTR ? "Sayfalar yükleniyor…" : "Loading pages…"}
        </div>
      ) : (
        <>
          {/* BOOK */}
          <div className={styles.bookWrap}>
            <div className={styles.book}>
              <div className={styles.spread}>
                <div className={styles.leftPage}>
                  <div className={`${styles.pageNum} ${styles.pageNumLeft}`}>
                    {leftIdx + 1}
                  </div>
                  <div className={styles.pageInner}>
                    <RenderPage page={pages[leftIdx]} meta={meta} pageNum={leftIdx + 1} />
                  </div>
                </div>
                <div className={styles.rightPage}>
                  <div className={`${styles.pageNum} ${styles.pageNumRight}`}>
                    {rightIdx < pages.length ? rightIdx + 1 : ""}
                  </div>
                  <div className={styles.pageInner}>
                    <RenderPage page={pages[rightIdx]} meta={meta} pageNum={rightIdx + 1} />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {flipping === "next" && (
                  <motion.div
                    className={styles.flipPage}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -180 }}
                    exit={{ rotateY: -180 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className={styles.flipFront}>
                      <div className={styles.pageInner}>
                        <RenderPage page={pages[rightIdx]} meta={meta} pageNum={rightIdx + 1} />
                      </div>
                    </div>
                    <div className={styles.flipBack}>
                      <div className={styles.pageInner}>
                        <RenderPage page={pages[rightIdx + 1]} meta={meta} pageNum={rightIdx + 2} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className={styles.navRow}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={goPrev}
              disabled={spread <= 0 || !!flipping}
            >
              ← {isTR ? "Önceki" : "Prev"}
            </button>
            <span className={styles.navPageNum}>
              {leftIdx + 1}–{Math.min(rightIdx + 1, pages.length)} / {pages.length} {isTR ? "sayfa" : "pages"}
            </span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={goNext}
              disabled={spread >= totalSpreads - 1 || !!flipping || isAtPremiumWall}
            >
              {isTR ? "Sonraki" : "Next"} →
            </button>
          </div>

          {isAtPremiumWall && (
            <div style={{ maxWidth: 700, margin: "24px auto", padding: "0 20px" }}>
              <PremiumGate
                locked={true}
                title={isTR ? "Bu kitabın devamı premium" : "The rest of this book is premium"}
                description={isTR
                  ? "Tüm sayfaları okumak için Premium'a geç."
                  : "Upgrade to Premium to read all pages."}
              >
                <div style={{ height: 120 }} />
              </PremiumGate>
            </div>
          )}
        </>
      )}

      {/* CHAPTERS TOGGLE */}
      <button
        type="button"
        className={styles.chaptersToggle}
        onClick={() => setChaptersOpen((v) => !v)}
        title={isTR ? "Bölümler" : "Chapters"}
      >
        ☰
      </button>

      {/* CHAPTERS SIDEBAR */}
      <div
        className={`${styles.chaptersSidebar} ${chaptersOpen ? styles.chaptersSidebarOpen : ""}`}
      >
        <div className={styles.chaptersTitle}>
          {isTR ? "BÖLÜMLER" : "CHAPTERS"}
        </div>
        {chapterPages.length > 0
          ? chapterPages.map((ch) => (
              <button
                key={ch.idx}
                type="button"
                className={styles.chapterItem}
                onClick={() => goToPage(ch.idx)}
              >
                {ch.type === "cover"
                  ? "Kapak"
                  : `${ch.number}. ${ch.title}`}
              </button>
            ))
          : meta.chapters.map((ch, i) => (
              <button
                key={i}
                type="button"
                className={styles.chapterItem}
                onClick={() =>
                  goToPage(Math.floor((pages.length / meta.chapters.length) * i))
                }
              >
                {i + 1}. {ch}
              </button>
            ))}
      </div>
    </div>
  );
}
