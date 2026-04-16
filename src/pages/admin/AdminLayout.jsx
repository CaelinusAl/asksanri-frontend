import { useCallback, useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { fetchAdminPendingSummary } from "../../data/adminApi";
import { allowUnauthenticatedPaymentAdmin } from "../../utils/adminOpenPayment";
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
  { to: "/admin/banka-odemeleri", icon: "⌁", label: "Banka ödemeleri" },
  { to: "/admin/teslimatlar", icon: "✧", label: "Teslimatlar" },
  { to: "/admin/leads", icon: "✉", label: "E-posta & Leads" },
  { to: "/admin/funnel", icon: "⊳", label: "Funnel" },
  { to: "/admin/billing", icon: "₺", label: "Billing" },
  { to: "/admin/notifications", icon: "⊙", label: "Bildirimler", pendingBadge: true },
  { to: "/admin/system", icon: "⚙", label: "Sistem" },
];

export default function AdminLayout() {
  const { adminUser, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const openPaymentNoAuth = allowUnauthenticatedPaymentAdmin(location.pathname) && !adminUser;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingOps, setPendingOps] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      fetchAdminPendingSummary()
        .then((d) => {
          if (!cancelled) setPendingOps(Math.max(0, Number(d?.total ?? 0)));
        })
        .catch(() => {
          if (!cancelled) setPendingOps(0);
        });
    };
    tick();
    const t = setInterval(tick, 60000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

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
          {NAV_ITEMS.map(({ to, end, icon, label, pendingBadge }) => {
            const showPending = pendingBadge && pendingOps > 0;
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeMobile}
                className={({ isActive }) =>
                  [
                    styles.navLink,
                    isActive ? styles.navLinkActive : "",
                    showPending ? styles.navLinkWithBadge : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <span className={styles.navIcon} aria-hidden>
                  {icon}
                </span>
                <span className={styles.navLabel}>{label}</span>
                {showPending ? (
                  <span
                    className={collapsed ? styles.navBadgeDot : styles.navBadge}
                    title={`${pendingOps} bekleyen iş`}
                    aria-label={`${pendingOps} bekleyen iş`}
                  >
                    {!collapsed ? (pendingOps > 99 ? "99+" : pendingOps) : ""}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
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
            {openPaymentNoAuth ? (
              <span
                style={{
                  marginLeft: 12,
                  fontSize: "0.75rem",
                  color: "rgba(200, 160, 255, 0.95)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                Ödeme ekranları açık (giriş yok — API token gerektirir)
              </span>
            ) : null}
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.userBlock}>
              <div className={styles.userEmail} title={adminUser?.email || ""}>
                {adminUser?.email || adminUser?.name || (openPaymentNoAuth ? "Yerel önizleme" : "Admin")}
              </div>
              <div className={styles.userRole}>{openPaymentNoAuth ? "Önizleme" : "Yönetici"}</div>
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
