import { useMemo, useState, useCallback } from "react";
import DataTable from "../../components/admin/DataTable";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminRituelPage.module.css";
import { rituals, RITUAL_CATEGORIES } from "../../data/ritualData";

function cloneRituals() {
  return rituals.map((r) => structuredClone(r));
}

function getCategoryById(id) {
  return RITUAL_CATEGORIES.find((c) => c.id === id) || null;
}

function difficultyClass(level) {
  if (level === "easy") return pageStyles.diffBadgeEasy;
  if (level === "medium") return pageStyles.diffBadgeMedium;
  if (level === "deep") return pageStyles.diffBadgeDeep;
  return "";
}

function difficultyLabel(level) {
  const map = { easy: "Kolay", medium: "Orta", deep: "Derin" };
  return map[level] ?? level ?? "—";
}

function truncateDesc(text, max = 200) {
  if (!text || typeof text !== "string") return "—";
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export default function AdminRituelPage() {
  const [items, setItems] = useState(cloneRituals);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    isPremium: false,
    isFeatured: false,
    durationMin: 0,
  });

  const filteredItems = useMemo(() => {
    if (categoryFilter === "all") return items;
    return items.filter((r) => Array.isArray(r.category) && r.category.includes(categoryFilter));
  }, [items, categoryFilter]);

  const openEdit = useCallback((row) => {
    setEditingId(row.id);
    setForm({
      isPremium: Boolean(row.isPremium),
      isFeatured: Boolean(row.isFeatured),
      durationMin: Number(row.durationMin) || 0,
    });
    setDrawerOpen(true);
  }, []);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
  };

  const currentRitual = useMemo(() => items.find((r) => r.id === editingId) ?? null, [items, editingId]);

  const handleSave = () => {
    if (editingId == null) return;
    const dm = Math.max(0, Number.parseInt(String(form.durationMin), 10) || 0);
    setItems((prev) =>
      prev.map((r) => {
        if (r.id === editingId) {
          return {
            ...r,
            isPremium: form.isPremium,
            isFeatured: form.isFeatured,
            durationMin: dm,
          };
        }
        if (form.isFeatured) {
          return { ...r, isFeatured: false };
        }
        return r;
      })
    );
    closeDrawer();
  };

  const handleTodaysRitual = () => {
    if (editingId == null) return;
    setItems((prev) => prev.map((r) => ({ ...r, isFeatured: r.id === editingId })));
    setForm((f) => ({ ...f, isFeatured: true }));
  };

  const columns = useMemo(
    () => [
      {
        key: "title.tr",
        label: "Başlık",
        render: (row) => <span style={{ fontWeight: 600 }}>{row.title?.tr ?? "—"}</span>,
      },
      {
        key: "category.0",
        label: "Kategori",
        render: (row) => {
          const firstId = row.category?.[0];
          const cat = firstId ? getCategoryById(firstId) : null;
          const label = cat?.label?.tr ?? firstId ?? "—";
          return (
            <span className={styles.badge} style={{ background: "rgba(200, 160, 255, 0.12)", color: "#c8a0ff", border: "1px solid rgba(200, 160, 255, 0.25)" }}>
              {label}
            </span>
          );
        },
      },
      {
        key: "durationMin",
        label: "Süre",
        render: (row) => `${row.durationMin ?? "—"} dk`,
      },
      {
        key: "difficulty",
        label: "Zorluk",
        render: (row) => {
          const d = row.difficulty;
          return <span className={`${pageStyles.diffBadge} ${difficultyClass(d)}`}>{difficultyLabel(d)}</span>;
        },
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
          <span
            style={{
              fontSize: 18,
              color: row.isFeatured ? "#ffd76c" : "#5a5470",
              fontWeight: 700,
            }}
            title={row.isFeatured ? "Öne çıkan" : "—"}
          >
            {row.isFeatured ? "★" : "☆"}
          </span>
        ),
      },
      {
        key: "id",
        label: "Aksiyonlar",
        render: (row) => (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.actionBtn} onClick={() => openEdit(row)}>
              Düzenle
            </button>
          </div>
        ),
      },
    ],
    [openEdit]
  );

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <h1 className={styles.pageTitle}>Ritüel Alanı Yönetimi</h1>
        <p className={styles.pageDesc}>Ritüelleri yönet ve düzenle</p>
      </div>

      <div className={styles.filterBar}>
        <button
          type="button"
          className={`${styles.filterBtn} ${categoryFilter === "all" ? styles.filterBtnActive : ""}`}
          onClick={() => setCategoryFilter("all")}
        >
          Tümü
        </button>
        {RITUAL_CATEGORIES.map((c) => (
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

      <DataTable columns={columns} data={filteredItems} onRowClick={openEdit} emptyText="Bu filtrede ritüel yok" />

      {drawerOpen && currentRitual ? (
        <>
          <div className={styles.drawerOverlay} role="presentation" onClick={closeDrawer} />
          <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="rituel-drawer-title">
            <button type="button" className={styles.drawerClose} onClick={closeDrawer} aria-label="Kapat">
              ×
            </button>
            <h2 id="rituel-drawer-title" className={styles.pageTitle} style={{ fontSize: 18, marginBottom: 16 }}>
              Ritüel
            </h2>

            <div className={pageStyles.drawerInfo}>
              <p className={pageStyles.drawerInfoTitle}>{currentRitual.title?.tr ?? "—"}</p>
              <p className={pageStyles.drawerInfoSubtitle}>{currentRitual.subtitle?.tr ?? ""}</p>
              <div className={pageStyles.ritualMeta}>
                <span>ID: {currentRitual.id}</span>
                <span>
                  Kategori:{" "}
                  {(currentRitual.category ?? [])
                    .map((cid) => getCategoryById(cid)?.label?.tr ?? cid)
                    .join(", ") || "—"}
                </span>
              </div>
              <p className={pageStyles.drawerDesc}>{truncateDesc(currentRitual.description?.tr)}</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="rituel-duration">
                Süre (dakika)
              </label>
              <input
                id="rituel-duration"
                type="number"
                min={0}
                className={styles.formInput}
                value={form.durationMin}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") {
                    setForm((f) => ({ ...f, durationMin: 0 }));
                    return;
                  }
                  const n = parseInt(v, 10);
                  if (!Number.isNaN(n)) {
                    setForm((f) => ({ ...f, durationMin: Math.max(0, n) }));
                  }
                }}
              />
            </div>

            <div className={pageStyles.toggleRow}>
              <button
                type="button"
                className={`${styles.toggleSwitch} ${form.isPremium ? styles.toggleSwitchOn : ""}`}
                onClick={() => setForm((f) => ({ ...f, isPremium: !f.isPremium }))}
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
                onClick={() => setForm((f) => ({ ...f, isFeatured: !f.isFeatured }))}
                aria-pressed={form.isFeatured}
                aria-label="Öne çıkan"
              >
                <span className={`${styles.toggleDot} ${form.isFeatured ? styles.toggleDotOn : ""}`} />
              </button>
              <span className={pageStyles.toggleLabel}>Öne çıkan (kaydederken diğerleri kalkar)</span>
            </div>

            <button type="button" className={pageStyles.featuredBtn} style={{ width: "100%", marginBottom: 16 }} onClick={handleTodaysRitual}>
              Bugünün Ritüeli
            </button>

            <button type="button" className={pageStyles.saveBtn} onClick={handleSave}>
              Kaydet
            </button>
          </aside>
        </>
      ) : null}
    </div>
  );
}
