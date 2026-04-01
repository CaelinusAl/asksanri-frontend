import { useEffect, useState } from "react";
import adminStyles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminSystemPage.module.css";
import { fetchHealth } from "../../data/adminApi";

const MOCK_HEALTH = { status: "ok", ok: true };

const MOCK_LOGS = [
  { time: "31 Mar 12:45", level: "warn", message: "Slow query: /yanki/posts (850ms)" },
  { time: "31 Mar 10:22", level: "error", message: "OpenAI API timeout on /bilinc-alani/ask" },
  { time: "30 Mar 18:10", level: "warn", message: "Rate limit approached: 95/100 requests" },
  { time: "30 Mar 14:30", level: "info", message: "Database connection pool expanded to 20" },
  { time: "29 Mar 22:00", level: "info", message: "Scheduled cleanup: removed 45 expired sessions" },
];

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
            <div className={pageStyles.statusValue}>v2.4.1 — 31 Mart 2026</div>
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

      <h2 className={adminStyles.sectionTitle}>Son Hatalar</h2>
      <div className={pageStyles.logCard}>
        {MOCK_LOGS.map((log) => (
          <div key={`${log.time}-${log.message}`} className={pageStyles.logRow}>
            <span className={pageStyles.logTime}>{log.time}</span>
            <span
              className={`${pageStyles.logLevel} ${
                log.level === "error"
                  ? pageStyles.logError
                  : log.level === "warn"
                    ? pageStyles.logWarn
                    : pageStyles.logInfo
              }`}
            >
              {log.level}
            </span>
            <span className={pageStyles.logMessage}>{log.message}</span>
          </div>
        ))}
      </div>

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
