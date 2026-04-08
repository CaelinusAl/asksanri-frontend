import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminUsersPage.module.css";
import { fetchUsers, setUserRole } from "../../data/adminApi";

const ROLE_FILTERS = [
  { id: "all", label: "Tümü" },
  { id: "user", label: "Kullanıcı" },
  { id: "admin", label: "Admin" },
  { id: "premium", label: "Premium" },
];

function normalizeUsersResponse(res) {
  if (Array.isArray(res)) return res;
  if (res?.users && Array.isArray(res.users)) return res.users;
  if (res?.items && Array.isArray(res.items)) return res.items;
  return [];
}

function normalizeUser(u) {
  return {
    ...u,
    id: u.id ?? u.user_id,
    display_name: u.display_name ?? u.name ?? "—",
    role: u.role ?? "user",
    is_active: u.is_active !== false,
    is_premium: Boolean(u.is_premium),
  };
}

function formatDate(value) {
  if (value == null || value === "") return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString("tr-TR");
}

function roleBadgeClass(row, s) {
  if (row.is_premium) return s.badgeYellow;
  if (row.role === "admin") return s.badgePurple;
  return s.badgeGray;
}

function roleBadgeLabel(row) {
  if (row.is_premium) return "Premium";
  if (row.role === "admin") return "Admin";
  return "Kullanıcı";
}

function useDebounced(value, ms) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounced(search, 500);

  const updateUser = useCallback((id, patch) => {
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    setSelectedUser((sel) => (sel && sel.id === id ? { ...sel, ...patch } : sel));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (roleFilter === "admin") params.role = "admin";
        if (roleFilter === "user") params.role = "user";

        const res = await fetchUsers(params);
        if (cancelled) return;

        let list = normalizeUsersResponse(res).map(normalizeUser);
        if (roleFilter === "premium") {
          list = list.filter((u) => u.is_premium);
        }
        if (roleFilter === "user") {
          list = list.filter((u) => u.role === "user");
        }

        setUsers(list);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Liste yüklenemedi");
        setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, roleFilter]);

  const displayRows = users;

  const handleSetAdmin = useCallback(
    async (row, asAdmin) => {
      const nextRole = asAdmin ? "admin" : "user";
      try {
        await setUserRole(row.id, nextRole);
      } catch {
        /* local fallback */
      }
      updateUser(row.id, { role: nextRole });
    },
    [updateUser]
  );

  const handleTogglePremium = useCallback(
    (row) => {
      updateUser(row.id, { is_premium: !row.is_premium });
    },
    [updateUser]
  );

  const handleToggleActive = useCallback(
    (row) => {
      updateUser(row.id, { is_active: !row.is_active });
    },
    [updateUser]
  );

  const columns = useMemo(
    () => [
      { key: "email", label: "Email" },
      { key: "display_name", label: "İsim" },
      {
        key: "role",
        label: "Rol",
        render: (row) => (
          <span className={`${styles.badge} ${roleBadgeClass(row, styles)}`}>{roleBadgeLabel(row)}</span>
        ),
      },
      {
        key: "is_active",
        label: "Durum",
        render: (row) => (
          <span className={`${styles.badge} ${row.is_active ? styles.badgeGreen : styles.badgeRed}`}>
            {row.is_active ? "Aktif" : "Pasif"}
          </span>
        ),
      },
      {
        key: "created_at",
        label: "Kayıt Tarihi",
        render: (row) => formatDate(row.created_at),
      },
      {
        key: "actions",
        label: "Aksiyonlar",
        render: (row) => (
          <div
            className={styles.filterBar}
            style={{ marginBottom: 0, gap: 8 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => handleSetAdmin(row, row.role !== "admin")}
            >
              {row.role === "admin" ? "Admin Kaldır" : "Admin Yap"}
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => handleTogglePremium(row)}>
              {row.is_premium ? "Premium Kaldır" : "Premium Ver"}
            </button>
          </div>
        ),
      },
    ],
    [handleSetAdmin, handleTogglePremium]
  );

  return (
    <div>
      <h1 className={styles.pageTitle}>Kullanıcı Yönetimi</h1>
      <p className={styles.pageDesc}>Kullanıcıları yönet, roller ata</p>

      {error && (
        <p className={styles.pageDesc} style={{ color: "#c87850", marginTop: -16 }}>
          {error}
        </p>
      )}

      <div className={styles.filterBar}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="E-posta veya isim ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Kullanıcı ara"
        />
      </div>

      <div className={styles.filterBar}>
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.filterBtn} ${roleFilter === f.id ? styles.filterBtnActive : ""}`}
            onClick={() => setRoleFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.pageDesc}>Yükleniyor…</p>
      ) : (
        <DataTable
          columns={columns}
          data={displayRows}
          onRowClick={(row) => setSelectedUser(row)}
          emptyText="Kullanıcı yok"
        />
      )}

      {selectedUser && (
        <>
          <button
            type="button"
            className={styles.drawerOverlay}
            aria-label="Paneli kapat"
            onClick={() => setSelectedUser(null)}
          />
          <aside className={styles.drawer} aria-label="Kullanıcı detayı">
            <button type="button" className={styles.drawerClose} onClick={() => setSelectedUser(null)} aria-label="Kapat">
              ×
            </button>
            <div className={pageStyles.userDrawerInfo}>
              <div className={pageStyles.userDrawerEmail}>{selectedUser.email}</div>
              <div className={pageStyles.userDrawerMeta}>İsim: {selectedUser.display_name || "—"}</div>
              <div className={pageStyles.userDrawerMeta}>
                Rol: {roleBadgeLabel(selectedUser)} ({selectedUser.role || "user"}
                {selectedUser.is_premium ? ", premium" : ""})
              </div>
              <div className={pageStyles.userDrawerMeta}>Kayıt: {formatDate(selectedUser.created_at)}</div>
              <div className={pageStyles.userDrawerMeta}>Durum: {selectedUser.is_active ? "Aktif" : "Pasif"}</div>
            </div>

            <div className={pageStyles.userDrawerActions}>
              <button
                type="button"
                className={pageStyles.userDrawerBtn}
                onClick={() => handleSetAdmin(selectedUser, selectedUser.role !== "admin")}
              >
                {selectedUser.role === "admin" ? "Admin Kaldır" : "Admin Yap"}
              </button>
              <button type="button" className={pageStyles.userDrawerBtn} onClick={() => handleTogglePremium(selectedUser)}>
                {selectedUser.is_premium ? "Premium Kaldır" : "Premium Ver"}
              </button>
              <button
                type="button"
                className={`${pageStyles.userDrawerBtn} ${pageStyles.userDrawerBtnDanger}`}
                onClick={() => handleToggleActive(selectedUser)}
              >
                {selectedUser.is_active ? "Pasifleştir" : "Aktif Et"}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
