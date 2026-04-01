import { useCallback, useMemo, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import DataTable from "../../components/admin/DataTable";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminPremiumPage.module.css";

const MOCK_PACKAGES_INITIAL = [
  {
    id: 1,
    name: "Aylık Premium",
    type: "subscription",
    price: "₺99/ay",
    status: "active",
    subscribers: 34,
  },
  {
    id: 2,
    name: "Yıllık Premium",
    type: "subscription",
    price: "₺799/yıl",
    status: "active",
    subscribers: 12,
  },
  {
    id: 3,
    name: "Matrix Code Kitabı",
    type: "book",
    price: "₺49",
    status: "active",
    sales: 89,
  },
  {
    id: 4,
    name: "Ritüel Paketi: Arınma",
    type: "ritual_pack",
    price: "₺29",
    status: "inactive",
    sales: 0,
  },
  {
    id: 5,
    name: "Okuma Alanı Erişimi",
    type: "content",
    price: "₺19/ay",
    status: "active",
    subscribers: 67,
  },
  {
    id: 6,
    name: "7 Günlük Deneme",
    type: "trial",
    price: "Ücretsiz",
    status: "active",
    subscribers: 156,
  },
];

const TYPE_OPTIONS = [
  { value: "subscription", label: "Abonelik" },
  { value: "book", label: "Kitap" },
  { value: "ritual_pack", label: "Ritüel paketi" },
  { value: "content", label: "İçerik erişimi" },
  { value: "trial", label: "Deneme" },
];

function typeUsesSubscribers(t) {
  return t === "subscription" || t === "content" || t === "trial";
}

function typeBadgeClass(type) {
  const map = {
    subscription: pageStyles.badgeSubscription,
    book: pageStyles.badgeBook,
    ritual_pack: pageStyles.badgeRitualPack,
    content: pageStyles.badgeContent,
    trial: pageStyles.badgeTrial,
  };
  return map[type] || pageStyles.badgeTypeDefault;
}

function typeLabel(type) {
  const opt = TYPE_OPTIONS.find((o) => o.value === type);
  return opt ? opt.label : type || "—";
}

function subscriberOrSalesCell(row) {
  if (typeUsesSubscribers(row.type)) {
    const n = row.subscribers ?? 0;
    return (
      <span>
        <span className={pageStyles.subscriberCount}>{n}</span> abone
      </span>
    );
  }
  const n = row.sales ?? 0;
  return (
    <span>
      <span className={pageStyles.subscriberCount}>{n}</span> satış
    </span>
  );
}

export default function AdminPremiumPage() {
  const [packages, setPackages] = useState(MOCK_PACKAGES_INITIAL);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "subscription",
    price: "",
    statusActive: true,
  });

  const openNew = useCallback(() => {
    setEditingId(null);
    setForm({
      name: "",
      type: "subscription",
      price: "",
      statusActive: true,
    });
    setDrawerOpen(true);
  }, []);

  const openEdit = useCallback((row) => {
    setEditingId(row.id);
    setForm({
      name: row.name ?? "",
      type: row.type ?? "subscription",
      price: row.price ?? "",
      statusActive: row.status === "active",
    });
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingId(null);
  }, []);

  const toggleRowStatus = useCallback((id, e) => {
    e?.stopPropagation?.();
    setPackages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    );
  }, []);

  const handleSave = useCallback(() => {
    const name = form.name.trim();
    if (!name) {
      window.alert("Ürün adı zorunludur.");
      return;
    }
    const price = form.price.trim() || "—";
    const status = form.statusActive ? "active" : "inactive";
    const editId = editingId;

    setPackages((prev) => {
      if (editId == null) {
        const nextId = prev.reduce((m, p) => Math.max(m, p.id), 0) + 1;
        const base = {
          id: nextId,
          name,
          type: form.type,
          price,
          status,
        };
        if (typeUsesSubscribers(form.type)) {
          base.subscribers = 0;
        } else {
          base.sales = 0;
        }
        return [...prev, base];
      }
      return prev.map((p) => {
        if (p.id !== editId) return p;
        const sub = typeUsesSubscribers(form.type);
        const count =
          sub
            ? typeUsesSubscribers(p.type)
              ? p.subscribers ?? 0
              : p.sales ?? 0
            : typeUsesSubscribers(p.type)
              ? p.subscribers ?? 0
              : p.sales ?? 0;
        if (sub) {
          return { id: p.id, name, type: form.type, price, status, subscribers: count };
        }
        return { id: p.id, name, type: form.type, price, status, sales: count };
      });
    });
    closeDrawer();
  }, [closeDrawer, editingId, form]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Ürün Adı",
        render: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span>,
      },
      {
        key: "type",
        label: "Tür",
        render: (row) => <span className={typeBadgeClass(row.type)}>{typeLabel(row.type)}</span>,
      },
      {
        key: "price",
        label: "Fiyat",
        render: (row) => <span className={pageStyles.priceCell}>{row.price}</span>,
      },
      {
        key: "status",
        label: "Durum",
        render: (row) =>
          row.status === "active" ? (
            <span className={`${styles.badge} ${styles.badgeGreen}`}>Aktif</span>
          ) : (
            <span className={`${styles.badge} ${styles.badgeGray}`}>Pasif</span>
          ),
      },
      {
        key: "metric",
        label: "Abone/Satış",
        render: (row) => subscriberOrSalesCell(row),
      },
      {
        key: "actions",
        label: "Aksiyonlar",
        render: (row) => (
          <div
            className={pageStyles.actionCell}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              className={styles.actionBtn}
              onClick={(e) => toggleRowStatus(row.id, e)}
              title={row.status === "active" ? "Pasifleştir" : "Aktifleştir"}
            >
              {row.status === "active" ? "Pasifleştir" : "Aktifleştir"}
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => openEdit(row)}>
              Düzenle
            </button>
          </div>
        ),
      },
    ],
    [openEdit, toggleRowStatus]
  );

  return (
    <div>
      <div className={pageStyles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Premium & Ürünler</h1>
          <p className={styles.pageDesc}>Paketleri ve ürünleri yönet</p>
        </div>
        <button type="button" className={pageStyles.createBtn} onClick={openNew}>
          Yeni Paket
        </button>
      </div>

      <div className={styles.grid3}>
        <StatCard label="Aktif Premium" value="34" accent="#50c878" />
        <StatCard label="Aylık Gelir" value="$1,240" accent="#c8a0ff" />
        <StatCard label="Dönüşüm Oranı" value="%4.2" accent="#78b4ff" />
      </div>

      <h2 className={styles.sectionTitle}>Paketler & ürünler</h2>
      <DataTable columns={columns} data={packages} emptyText="Paket yok" />

      {drawerOpen ? (
        <>
          <div className={styles.drawerOverlay} role="presentation" onClick={closeDrawer} />
          <aside
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="premium-drawer-title"
          >
            <button type="button" className={styles.drawerClose} onClick={closeDrawer} aria-label="Kapat">
              ×
            </button>
            <h2 id="premium-drawer-title" className={styles.pageTitle} style={{ fontSize: 18, marginBottom: 24 }}>
              {editingId == null ? "Yeni paket" : "Paketi düzenle"}
            </h2>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="premium-name">
                Ürün adı
              </label>
              <input
                id="premium-name"
                className={styles.formInput}
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Örn. Aylık Premium"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="premium-type">
                Tür
              </label>
              <select
                id="premium-type"
                className={styles.formSelect}
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="premium-price">
                Fiyat
              </label>
              <input
                id="premium-price"
                className={styles.formInput}
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="₺99/ay"
              />
            </div>

            <div className={pageStyles.toggleRow}>
              <button
                type="button"
                className={`${styles.toggleSwitch} ${form.statusActive ? styles.toggleSwitchOn : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, statusActive: !prev.statusActive }))}
                aria-pressed={form.statusActive}
                aria-label="Durum aktif"
              >
                <span className={`${styles.toggleDot} ${form.statusActive ? styles.toggleDotOn : ""}`} />
              </button>
              <span className={pageStyles.toggleLabel}>{form.statusActive ? "Aktif" : "Pasif"}</span>
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
