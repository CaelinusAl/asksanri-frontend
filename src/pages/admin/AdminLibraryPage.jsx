import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminLibraryPage.module.css";
import { booksMetadata } from "../../data/booksContent";

function cloneBooksFromMetadata() {
  return booksMetadata.map((b) => ({
    ...b,
    chapters: Array.isArray(b.chapters) ? [...b.chapters] : [],
  }));
}

function BookCoverThumb({ src, imgClass, fallbackClass }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={fallbackClass} aria-hidden>
        📖
      </div>
    );
  }
  return (
    <img src={src} alt="" className={imgClass} width={40} height={56} onError={() => setFailed(true)} />
  );
}

function DrawerCover({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div className={pageStyles.drawerCoverFallback} aria-hidden>📖</div>;
  }
  return <img src={src} alt={alt} className={pageStyles.drawerCover} onError={() => setFailed(true)} />;
}

export default function AdminLibraryPage() {
  const [books, setBooks] = useState(cloneBooksFromMetadata);
  const [drawerId, setDrawerId] = useState(null);
  const [draftPremium, setDraftPremium] = useState(false);
  const [draftPreviewPages, setDraftPreviewPages] = useState("0");

  const selectedBook = useMemo(
    () => (drawerId ? books.find((b) => b.id === drawerId) : null),
    [books, drawerId]
  );

  const openDrawer = useCallback((row) => {
    setDrawerId(row.id);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerId(null);
  }, []);

  useEffect(() => {
    if (!selectedBook) return;
    setDraftPremium(!!selectedBook.isPremium);
    const n = Number(selectedBook.freePreviewPages);
    setDraftPreviewPages(String(Number.isFinite(n) ? n : 0));
  }, [selectedBook]);

  useEffect(() => {
    if (!drawerId) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerId, closeDrawer]);

  const handleSave = useCallback(() => {
    if (!drawerId) return;
    const pages = Math.max(0, Math.floor(Number(draftPreviewPages.replace(/\s/g, ""))) || 0);
    setBooks((prev) =>
      prev.map((b) =>
        b.id === drawerId ? { ...b, isPremium: draftPremium, freePreviewPages: pages } : b
      )
    );
    closeDrawer();
  }, [closeDrawer, drawerId, draftPremium, draftPreviewPages]);

  const columns = useMemo(
    () => [
      {
        key: "cover",
        label: "Kapak",
        width: 72,
        render: (row) => (
          <BookCoverThumb
            src={row.cover}
            imgClass={pageStyles.bookCover}
            fallbackClass={pageStyles.bookCoverFallback}
          />
        ),
      },
      { key: "title", label: "Başlık" },
      { key: "author", label: "Yazar" },
      {
        key: "isPremium",
        label: "Premium",
        render: (row) =>
          row.isPremium ? (
            <span className={pageStyles.premiumBadge} title="Premium">
              ✦
            </span>
          ) : (
            <span className={`${styles.badge} ${styles.badgeGray}`}>Ücretsiz</span>
          ),
      },
      { key: "freePreviewPages", label: "Önizleme Sayfası" },
      {
        key: "chapters.length",
        label: "Bölüm Sayısı",
        render: (row) => (Array.isArray(row.chapters) ? row.chapters.length : 0),
      },
      {
        key: "actions",
        label: "Aksiyonlar",
        width: 110,
        render: (row) => (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              openDrawer(row);
            }}
          >
            Düzenle
          </button>
        ),
      },
    ],
    [openDrawer]
  );

  return (
    <div>
      <h1 className={styles.pageTitle}>Kütüphane Yönetimi</h1>
      <p className={styles.pageDesc}>Kitapları ve içerikleri yönet</p>

      <DataTable columns={columns} data={books} onRowClick={openDrawer} emptyText="Kitap yok" />

      {drawerId && selectedBook ? (
        <>
          <div className={styles.drawerOverlay} role="presentation" onClick={closeDrawer} />
          <aside className={styles.drawer} style={{ position: "relative" }} role="dialog" aria-modal="true">
            <button type="button" className={styles.drawerClose} onClick={closeDrawer} aria-label="Kapat">
              ×
            </button>
            <div className={pageStyles.drawerBody}>
              <DrawerCover src={selectedBook.cover} alt={selectedBook.title} />
              <h2 className={pageStyles.drawerBookTitle}>{selectedBook.title}</h2>
              <p className={pageStyles.drawerAuthor}>{selectedBook.author}</p>

              <div className={styles.formGroup}>
                <div className={pageStyles.toggleRow}>
                  <span className={styles.formLabel} style={{ marginBottom: 0 }}>
                    Premium kitap
                  </span>
                  <button
                    type="button"
                    className={`${styles.toggleSwitch} ${draftPremium ? styles.toggleSwitchOn : ""}`}
                    onClick={() => setDraftPremium((p) => !p)}
                    aria-pressed={draftPremium}
                    aria-label="Premium"
                  >
                    <span className={`${styles.toggleDot} ${draftPremium ? styles.toggleDotOn : ""}`} />
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="admin-lib-preview-pages">
                  Önizleme sayfası
                </label>
                <input
                  id="admin-lib-preview-pages"
                  type="number"
                  min={0}
                  className={`${styles.formInput} ${pageStyles.previewInput}`}
                  value={draftPreviewPages}
                  onChange={(e) => setDraftPreviewPages(e.target.value)}
                />
              </div>

              <div className={pageStyles.saveRow}>
                <button type="button" className={pageStyles.saveBtn} onClick={handleSave}>
                  Kaydet
                </button>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
