import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import DataTable from "../../components/admin/DataTable";
import StatCard from "../../components/admin/StatCard";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminOkumaPage.module.css";
import { OKUMA_POSTS, OKUMA_CATEGORIES, getCategoryById } from "../../data/okumaData";
import { fetchOkumaAllStats } from "../../data/adminApi";

function slugifyFromTitle(title) {
  if (!title || typeof title !== "string") return "";
  let s = title.trim().toLocaleLowerCase("tr-TR");
  const map = {
    ş: "s",
    ğ: "g",
    ü: "u",
    ö: "o",
    ç: "c",
    ı: "i",
    â: "a",
    î: "i",
    û: "u",
  };
  s = s.replace(/./g, (c) => map[c] || c);
  return s
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function clonePostsWithStatus() {
  return OKUMA_POSTS.map((p) => ({
    ...structuredClone(p),
    status: p.status ?? "published",
  }));
}

function emptyPost(nextId) {
  return {
    id: nextId,
    slug: "",
    title: "",
    subtitle: "",
    category: OKUMA_CATEGORIES[0]?.id ?? "matrix_okumasi",
    coverImage: "/assets/gates/okuma-alani.jpg",
    excerpt: "",
    fullContent: "",
    codeLayer: "",
    sanriReflection: { analysis: "", strongLine: "", question: "" },
    isPremium: false,
    previewContent: null,
    createdAt: new Date().toISOString(),
    commentCount: 0,
    viewCount: 0,
    isFeatured: false,
    status: "draft",
  };
}

export default function AdminOkumaPage() {
  const location = useLocation();
  const draftApplied = useRef(false);
  const [posts, setPosts] = useState(clonePostsWithStatus);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [liveStats, setLiveStats] = useState({});

  useEffect(() => {
    fetchOkumaAllStats()
      .then((data) => { if (data?.stats) setLiveStats(data.stats); })
      .catch(() => {});
  }, []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    slug: "",
    category: OKUMA_CATEGORIES[0]?.id ?? "",
    excerpt: "",
    isPremium: false,
    isFeatured: false,
  });

  useEffect(() => {
    const navState = location.state;
    if (navState?.newDraft && !draftApplied.current) {
      draftApplied.current = true;
      setEditingId(null);
      setForm({
        title: navState.title || "",
        subtitle: navState.subtitle || "",
        slug: slugifyFromTitle(navState.title || ""),
        category: navState.category || OKUMA_CATEGORIES[0]?.id || "",
        excerpt: navState.subtitle || "",
        isPremium: false,
        isFeatured: false,
      });
      setDrawerOpen(true);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const filteredPosts = useMemo(() => {
    if (categoryFilter === "all") return posts;
    return posts.filter((p) => p.category === categoryFilter);
  }, [posts, categoryFilter]);

  const openNew = () => {
    setEditingId(null);
    setForm({
      title: "",
      subtitle: "",
      slug: "",
      category: OKUMA_CATEGORIES[0]?.id ?? "",
      excerpt: "",
      isPremium: false,
      isFeatured: false,
    });
    setDrawerOpen(true);
  };

  const openEdit = useCallback((row) => {
    setEditingId(row.id);
    setForm({
      title: row.title ?? "",
      subtitle: row.subtitle ?? "",
      slug: row.slug ?? slugifyFromTitle(row.title ?? ""),
      category: row.category ?? OKUMA_CATEGORIES[0]?.id ?? "",
      excerpt: row.excerpt ?? "",
      isPremium: Boolean(row.isPremium),
      isFeatured: Boolean(row.isFeatured),
    });
    setDrawerOpen(true);
  }, []);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
  };

  const setField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title") {
        next.slug = slugifyFromTitle(value);
      }
      return next;
    });
  };

  const handleSave = () => {
    const title = form.title.trim();
    if (!title) {
      window.alert("Başlık zorunludur.");
      return;
    }
    const slug = (form.slug || slugifyFromTitle(title)).trim() || slugifyFromTitle(title);

    if (editingId == null) {
      const nextId = posts.reduce((m, p) => Math.max(m, p.id), 0) + 1;
      const row = emptyPost(nextId);
      row.title = title;
      row.subtitle = form.subtitle.trim();
      row.slug = slug;
      row.category = form.category;
      row.excerpt = form.excerpt.trim();
      row.isPremium = form.isPremium;
      row.isFeatured = form.isFeatured;
      setPosts((prev) => {
        const base = form.isFeatured ? prev.map((p) => ({ ...p, isFeatured: false })) : prev;
        return [...base, row];
      });
    } else {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === editingId) {
            return {
              ...p,
              title,
              subtitle: form.subtitle.trim(),
              slug,
              category: form.category,
              excerpt: form.excerpt.trim(),
              isPremium: form.isPremium,
              isFeatured: form.isFeatured,
            };
          }
          if (form.isFeatured) {
            return { ...p, isFeatured: false };
          }
          return { ...p };
        })
      );
    }
    closeDrawer();
  };

  const handleDelete = useCallback((row) => {
    if (!window.confirm(`“${row.title}” silinsin mi?`)) return;
    setPosts((prev) => prev.filter((p) => p.id !== row.id));
  }, []);

  const toggleFeatured = useCallback((postId, e) => {
    e?.stopPropagation?.();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) {
          return { ...p, isFeatured: false };
        }
        return { ...p, isFeatured: !p.isFeatured };
      })
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "title",
        label: "Başlık",
        render: (row) => <span style={{ fontWeight: 600 }}>{row.title}</span>,
      },
      {
        key: "category",
        label: "Kategori",
        render: (row) => {
          const cat = getCategoryById(row.category);
          const bg = `${cat.color}22`;
          return (
            <span
              className={styles.badge}
              style={{
                background: bg,
                color: cat.color,
                border: `1px solid ${cat.color}44`,
              }}
            >
              {cat.label?.tr ?? row.category}
            </span>
          );
        },
      },
      {
        key: "status",
        label: "Durum",
        render: (row) =>
          row.status === "published" ? (
            <span className={`${styles.badge} ${styles.badgeGreen}`}>Yayında</span>
          ) : (
            <span className={`${styles.badge} ${styles.badgeYellow}`}>Taslak</span>
          ),
      },
      {
        key: "isPremium",
        label: "Premium",
        render: (row) =>
          row.isPremium ? (
            <span style={{ color: "#c8a0ff", fontWeight: 700, fontSize: 16 }} title="Premium">
              ✦
            </span>
          ) : (
            "—"
          ),
      },
      {
        key: "isFeatured",
        label: "Öne Çıkan",
        render: (row) => (
          <button
            type="button"
            title={row.isFeatured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
            onClick={(e) => toggleFeatured(row.id, e)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              fontSize: 18,
              lineHeight: 1,
              color: row.isFeatured ? "#ffd76c" : "#5a5470",
            }}
            aria-pressed={row.isFeatured}
          >
            {row.isFeatured ? "★" : "☆"}
          </button>
        ),
      },
      {
        key: "viewCount",
        label: "👁 Görüntüleme",
        render: (row) => {
          const live = liveStats[row.slug];
          return (
            <span style={{ fontWeight: 600, color: live?.views ? "#78f7d8" : "#5a5470" }}>
              {live?.views ?? row.viewCount ?? 0}
            </span>
          );
        },
      },
      {
        key: "likesCount",
        label: "❤️ Beğeni",
        render: (row) => {
          const live = liveStats[row.slug];
          return (
            <span style={{ fontWeight: 600, color: live?.likes ? "#ffd700" : "#5a5470" }}>
              {live?.likes ?? 0}
            </span>
          );
        },
      },
      {
        key: "commentCount",
        label: "💬 Yorum",
        render: (row) => {
          const live = liveStats[row.slug];
          return (
            <span style={{ fontWeight: 600, color: live?.comments ? "#c8a0ff" : "#5a5470" }}>
              {live?.comments ?? row.commentCount ?? 0}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: "Aksiyonlar",
        render: (row) => (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.actionBtn} onClick={() => openEdit(row)}>
              Düzenle
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              onClick={() => handleDelete(row)}
            >
              Sil
            </button>
          </div>
        ),
      },
    ],
    [openEdit, toggleFeatured, handleDelete, liveStats]
  );

  const totalViews = Object.values(liveStats).reduce((s, v) => s + (v.views || 0), 0);
  const totalLikes = Object.values(liveStats).reduce((s, v) => s + (v.likes || 0), 0);
  const totalComments = Object.values(liveStats).reduce((s, v) => s + (v.comments || 0), 0);

  return (
    <div>
      <div className={pageStyles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Okuma Alanı Yönetimi</h1>
          <p className={styles.pageDesc}>Matrix okumalarını yönet — gerçek zamanlı etkileşim verileri</p>
        </div>
        <button type="button" className={pageStyles.createBtn} onClick={openNew}>
          Yeni Okuma
        </button>
      </div>

      <div className={styles.grid4} style={{ marginBottom: 20 }}>
        <StatCard label="Toplam Okuma" value={posts.length} icon="◈" />
        <StatCard label="Toplam Görüntüleme" value={totalViews} icon="👁" accent="#78f7d8" />
        <StatCard label="Toplam Beğeni" value={totalLikes} icon="❤️" accent="#ffd700" />
        <StatCard label="Toplam Yorum" value={totalComments} icon="💬" accent="#c8a0ff" />
      </div>

      <div className={styles.filterBar}>
        <button
          type="button"
          className={`${styles.filterBtn} ${categoryFilter === "all" ? styles.filterBtnActive : ""}`}
          onClick={() => setCategoryFilter("all")}
        >
          Tümü
        </button>
        {OKUMA_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`${styles.filterBtn} ${categoryFilter === c.id ? styles.filterBtnActive : ""}`}
            onClick={() => setCategoryFilter(c.id)}
          >
            {c.label.tr}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filteredPosts} emptyText="Bu filtrede okuma yok" />

      {drawerOpen ? (
        <>
          <div className={styles.drawerOverlay} role="presentation" onClick={closeDrawer} />
          <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="okuma-drawer-title">
            <button type="button" className={styles.drawerClose} onClick={closeDrawer} aria-label="Kapat">
              ×
            </button>
            <h2 id="okuma-drawer-title" className={styles.pageTitle} style={{ fontSize: 18, marginBottom: 24 }}>
              {editingId == null ? "Yeni Okuma" : "Okumayı Düzenle"}
            </h2>

            <div className={pageStyles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="okuma-title">
                  Başlık
                </label>
                <input
                  id="okuma-title"
                  className={styles.formInput}
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="Başlık"
                />
                <div className={pageStyles.slugPreview}>Slug: /{form.slug || slugifyFromTitle(form.title) || "…"}</div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="okuma-subtitle">
                  Alt başlık
                </label>
                <input
                  id="okuma-subtitle"
                  className={styles.formInput}
                  value={form.subtitle}
                  onChange={(e) => setField("subtitle", e.target.value)}
                  placeholder="Alt başlık"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="okuma-slug">
                Slug (başlıktan üretilir, düzenlenebilir)
              </label>
              <input
                id="okuma-slug"
                className={styles.formInput}
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="url-slug"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="okuma-category">
                Kategori
              </label>
              <select
                id="okuma-category"
                className={styles.formSelect}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                {OKUMA_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label.tr}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="okuma-excerpt">
                Özet
              </label>
              <textarea
                id="okuma-excerpt"
                className={styles.formTextarea}
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                placeholder="Kısa özet"
                rows={4}
              />
            </div>

            <div className={pageStyles.toggleRow}>
              <button
                type="button"
                className={`${styles.toggleSwitch} ${form.isPremium ? styles.toggleSwitchOn : ""}`}
                onClick={() => setField("isPremium", !form.isPremium)}
                aria-pressed={form.isPremium}
                aria-label="Premium"
              >
                <span className={`${styles.toggleDot} ${form.isPremium ? styles.toggleDotOn : ""}`} />
              </button>
              <span className={pageStyles.toggleLabel}>Premium</span>
            </div>

            <div className={pageStyles.toggleRow}>
              <button
                type="button"
                className={`${styles.toggleSwitch} ${form.isFeatured ? styles.toggleSwitchOn : ""}`}
                onClick={() => setField("isFeatured", !form.isFeatured)}
                aria-pressed={form.isFeatured}
                aria-label="Öne çıkan"
              >
                <span className={`${styles.toggleDot} ${form.isFeatured ? styles.toggleDotOn : ""}`} />
              </button>
              <span className={pageStyles.toggleLabel}>Öne çıkan (yalnızca biri)</span>
            </div>

            <button type="button" className={pageStyles.createBtn} style={{ width: "100%", marginTop: 8 }} onClick={handleSave}>
              Kaydet
            </button>
          </aside>
        </>
      ) : null}
    </div>
  );
}
