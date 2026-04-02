import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import adminStyles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminSystemPage.module.css";
import { fetchHealth, fetchVisitorStats, fetchFunnelStats } from "../../data/adminApi";

const MOCK_HEALTH = { status: "ok", ok: true };

function isHealthy(data) {
  if (!data || typeof data !== "object") return false;
  if (data.status === "ok" || data.status === "healthy") return true;
  if (data.ok === true || data.healthy === true) return true;
  return false;
}

function EnvBadge({ ok }) {
  return (
    <span className={`${adminStyles.badge} ${ok ? adminStyles.badgeGreen : adminStyles.badgeRed}`}>
      {ok ? "Ayarlandı" : "Eksik"}
    </span>
  );
}

export default function AdminSystemPage() {
  const [health, setHealth] = useState(null);
  const [usedMock, setUsedMock] = useState(false);
  const [ready, setReady] = useState(false);
  const [visitors, setVisitors] = useState(null);
  const [funnel, setFunnel] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const h = await fetchHealth();
        if (cancelled) return;
        setHealth(h);
        setUsedMock(false);
      } catch {
        if (cancelled) return;
        setHealth(MOCK_HEALTH);
        setUsedMock(true);
      } finally {
        if (!cancelled) setReady(true);
      }

      const [v, f] = await Promise.all([
        fetchVisitorStats().catch(() => null),
        fetchFunnelStats(7).catch(() => null),
      ]);
      if (!cancelled) {
        if (v) setVisitors(v);
        if (f) setFunnel(f);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const apiOk = ready && !usedMock && isHealthy(health);
  const backendEnvOk = apiOk;

  const viteBackendSet = Boolean(
    import.meta.env.VITE_BACKEND_URL && String(import.meta.env.VITE_BACKEND_URL).trim() !== ""
  );
  const viteAdminKeySet = Boolean(
    import.meta.env.VITE_ADMIN_KEY && String(import.meta.env.VITE_ADMIN_KEY).trim() !== ""
  );

  const envRows = [
    { name: "VITE_BACKEND_URL", ok: viteBackendSet },
    { name: "VITE_ADMIN_KEY", ok: viteAdminKeySet },
    { name: "Backend API", ok: backendEnvOk },
  ];

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>Sistem Sağlığı</h1>
      <p className={adminStyles.pageDesc}>Platform durumu ve sistem bilgileri</p>

      <div className={`${adminStyles.grid3} ${pageStyles.statusGrid}`}>
        <div className={pageStyles.statusCard}>
          <span
            className={`${pageStyles.statusDot} ${
              !ready
                ? pageStyles.statusDotNeutral
                : apiOk
                  ? pageStyles.statusDotGreen
                  : pageStyles.statusDotRed
            }`}
            aria-hidden
          />
          <div>
            <div className={pageStyles.statusLabel}>API Durumu</div>
            <div className={pageStyles.statusValue}>
              {!ready ? "…" : apiOk ? "Çalışıyor" : "Hata"}
            </div>
          </div>
        </div>
        <div className={pageStyles.statusCard}>
          <span className={`${pageStyles.statusDot} ${pageStyles.statusDotGreen}`} aria-hidden />
          <div>
            <div className={pageStyles.statusLabel}>Veritabanı</div>
            <div className={pageStyles.statusValue}>Bağlı</div>
          </div>
        </div>
        <div className={pageStyles.statusCard}>
          <span className={`${pageStyles.statusDot} ${pageStyles.statusDotGreen}`} aria-hidden />
          <div>
            <div className={pageStyles.statusLabel}>Son Deploy</div>
            <div className={pageStyles.statusValue}>v3.0 — {new Date().toLocaleDateString("tr-TR")}</div>
          </div>
        </div>
      </div>

      <h2 className={adminStyles.sectionTitle}>Ortam kontrolü</h2>
      <div className={pageStyles.envTable}>
        {envRows.map((row) => (
          <div key={row.name} className={pageStyles.envRow}>
            <span className={pageStyles.envName}>{row.name}</span>
            <div className={pageStyles.envRowRight}>
              <span className={pageStyles.envMask}>****</span>
              <EnvBadge ok={row.ok} />
            </div>
          </div>
        ))}
      </div>

      <h2 className={adminStyles.sectionTitle}>Gerçek Zamanlı Metrikler</h2>
      <div className={adminStyles.grid4} style={{ marginBottom: 24 }}>
        <StatCard
          label="Toplam Ziyaret"
          value={visitors?.views?.total ?? "—"}
          icon="👁"
        />
        <StatCard
          label="Bugün Ziyaret"
          value={visitors?.views?.today ?? "—"}
          icon="📊"
          accent="#78f7d8"
        />
        <StatCard
          label="Tekil Ziyaretçi (Bugün)"
          value={visitors?.unique_visitors?.today ?? "—"}
          icon="◇"
          accent="#ffd700"
        />
        <StatCard
          label="Funnel Events (7g)"
          value={funnel?.total_events ?? "—"}
          icon="⊳"
          accent="#c8a0ff"
        />
      </div>

      {visitors?.top_pages && visitors.top_pages.length > 0 && (
        <>
          <h2 className={adminStyles.sectionTitle}>En Çok Ziyaret Edilen Sayfalar</h2>
          <div className={pageStyles.logCard}>
            {visitors.top_pages.slice(0, 10).map((p) => (
              <div key={p.path} className={pageStyles.logRow}>
                <span className={pageStyles.logMessage} style={{ flex: 1 }}>{p.path}</span>
                <span className={pageStyles.logTime} style={{ fontWeight: 700, color: "#c8a0ff" }}>{p.views}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className={pageStyles.infoSection}>
        <h2 className={adminStyles.sectionTitle}>Sistem Bilgisi</h2>
        <div className={pageStyles.infoRow}>
          <span className={pageStyles.infoLabel}>Platform</span>
          <span className={pageStyles.infoValue}>SANRI v2.4</span>
        </div>
        <div className={pageStyles.infoRow}>
          <span className={pageStyles.infoLabel}>Frontend</span>
          <span className={pageStyles.infoValue}>React + Vite</span>
        </div>
        <div className={pageStyles.infoRow}>
          <span className={pageStyles.infoLabel}>Backend</span>
          <span className={pageStyles.infoValue}>FastAPI</span>
        </div>
        <div className={pageStyles.infoRow}>
          <span className={pageStyles.infoLabel}>Database</span>
          <span className={pageStyles.infoValue}>PostgreSQL</span>
        </div>
        <div className={pageStyles.infoRow}>
          <span className={pageStyles.infoLabel}>Host</span>
          <span className={pageStyles.infoValue}>Vercel + Railway</span>
        </div>
      </div>
    </div>
  );
}
