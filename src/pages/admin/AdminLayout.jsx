import { useCallback, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import styles from "./AdminLayout.module.css";

const NAV_ITEMS = [
  { to: "/admin", end: true, icon: "◉", label: "Overview" },
  { to: "/admin/users", icon: "◇", label: "Kullanıcılar" },
  { to: "/admin/okuma", icon: "◈", label: "Okuma Alanı" },
  { to: "/admin/library", icon: "▣", label: "Kütüphane" },
  { to: "/admin/yanki", icon: "◎", label: "Yankı Alanı" },
  { to: "/admin/rituel", icon: "⬡", label: "Ritüel Alanı" },
  { to: "/admin/engine", icon: "⟐", label: "İçerik Motoru" },
  { to: "/admin/calendar", icon: "▦", label: "Takvim" },
  { to: "/admin/growth", icon: "⊕", label: "Growth Engine" },
  { to: "/admin/premium", icon: "✦", label: "Premium" },
  { to: "/admin/revenue", icon: "⊞", label: "Gelir" },
  { to: "/admin/muhasebe", icon: "≡", label: "Muhasebe" },
  { to: "/admin/funnel", icon: "⊳", label: "Funnel" },
  { to: "/admin/billing", icon: "₺", label: "Billing" },
  { to: "/admin/notifications", icon: "⊙", label: "Bildirimler" },
  { to: "/admin/system", icon: "⚙", label: "Sistem" },
];

export default function AdminLayout() {
  const { adminUser, logout } = useAdmin();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/admin/login");
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const sidebarClass = [
    styles.sidebar,
    collapsed ? styles.sidebarCollapsed : "",
    mobileOpen ? styles.sidebarMobileOpen : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.shell}>
      <button
        type="button"
        className={`${styles.backdrop} ${mobileOpen ? styles.backdropOpen : ""}`}
        aria-label="Menüyü kapat"
        onClick={closeMobile}
      />

      <aside className={sidebarClass} aria-label="Admin menü">
        <div className={styles.brand}>
          <span className={styles.brandTitle}>SANRI</span>
          <span className={styles.brandSubtitle}>Control Center</span>
        </div>

        <div className={styles.sidebarToggleRow}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Kenar çubuğunu genişlet" : "Kenar çubuğunu daralt"}
            title={collapsed ? "Genişlet" : "Daralt"}
          >
            {collapsed ? "⟩" : "⟨"}
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, end, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMobile}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : ""].filter(Boolean).join(" ")
              }
            >
              <span className={styles.navIcon} aria-hidden>
                {icon}
              </span>
              <span className={styles.navLabel}>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label="Menüyü aç"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
            <span className={styles.topbarTitle}>Admin</span>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.userBlock}>
              <div className={styles.userEmail} title={adminUser?.email || ""}>
                {adminUser?.email || adminUser?.name || "Admin"}
              </div>
              <div className={styles.userRole}>Yönetici</div>
            </div>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
              Çıkış
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
