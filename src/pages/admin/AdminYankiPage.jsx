import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import StatCard from "../../components/admin/StatCard";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminYankiPage.module.css";
import {
  fetchModerationPosts,
  fetchModerationStats,
  reviewPost,
  fetchYankiAdminStats,
} from "../../data/adminApi";

const EMPTY_STATS = { approved: 0, pending: 0, rejected: 0, reported: 0 };

function truncate(str, max = 80) {
  if (str == null || str === "") return "—";
  const s = String(str).replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}

function normalizeModerationStats(data) {
  if (data == null || typeof data !== "object") return { ...EMPTY_STATS };
  return {
    approved: Number(data.approved ?? data.published ?? 0) || 0,
    pending: Number(data.pending ?? data.pending_review ?? 0) || 0,
    rejected: Number(data.rejected ?? 0) || 0,
    reported: Number(data.reported ?? data.total_reports ?? 0) || 0,
  };
}

function normalizePost(row) {
  const statusRaw = row.status ?? row.moderation_status ?? "";
  let status = "pending";
  if (statusRaw === "published" || statusRaw === "approved") status = "approved";
  else if (statusRaw === "rejected") status = "rejected";
  else if (statusRaw === "pending" || statusRaw === "pending_review") status = "pending";

  const content = row.content_raw ?? row.content ?? row.body ?? row.text ?? "";
  const type = row.category ?? row.type ?? "genel";
  const author =
    row.author_name ?? row.author?.username ?? row.user?.name ?? row.author_mode ?? "—";
  const date = row.created_at ?? row.createdAt ?? row.date ?? "";
  const reportCount = Number(row.report_count ?? row.reports ?? 0) || 0;

  return {
    id: row.id,
    content,
    type: String(type).toLowerCase(),
    author,
    status,
    date,
    reportCount,
    raw: row,
  };
}

function extractPostList(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.posts)) return raw.posts;
    if (Array.isArray(raw.items)) return raw.items;
    if (Array.isArray(raw.data)) return raw.data;
  }
  return [];
}

function filterPostsForTab(rows, tab) {
  if (tab === "all") return rows;
  if (tab === "reported") return rows.filter((p) => p.reportCount > 0);
  return rows.filter((p) => p.status === tab);
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_META = {
  approved: { label: "Onaylı", badge: styles.badgeGreen },
  pending: { label: "Beklemede", badge: styles.badgeYellow },
  rejected: { label: "Reddedildi", badge: styles.badgeRed },
};

const TABS = [
  { id: "all", label: "Tümü" },
  { id: "pending", label: "Bekleyen" },
  { id: "approved", label: "Onaylı" },
  { id: "rejected", label: "Reddedilen" },
  { id: "reported", label: "Raporlanan" },
];

function typeBadgeClass(type) {
  const t = String(type || "").toLowerCase();
  const base = styles.badge;
  if (t === "duygu") return `${base} ${styles.badgePurple}`;
  if (t === "farkindalik" || t === "farkındalık") return `${base} ${styles.badgeGreen}`;
  if (t === "ruya" || t === "rüya") return `${base} ${styles.badgeGray}`;
  if (t === "yansima" || t === "yansıma") return `${base} ${styles.badgeYellow}`;
  return `${base} ${styles.badgeGray}`;
}

function typeLabel(type) {
  const t = String(type || "").toLowerCase();
  const map = {
    duygu: "Duygu",
    farkindalik: "Farkındalık",
    farkındalık: "Farkındalık",
    ruya: "Rüya",
    rüya: "Rüya",
    genel: "Genel",
    yansima: "Yansıma",
    yansıma: "Yansıma",
  };
  return map[t] || (type ? String(type) : "—");
}

export default function AdminYankiPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [yankiExtra, setYankiExtra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [actionPostId, setActionPostId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const mod = await fetchModerationStats();
      setStats(normalizeModerationStats(mod));
      setApiError(false);
    } catch (e) {
      setStats(EMPTY_STATS);
      setApiError(true);
      setStatsError(e?.message || "İstatistikler alınamadı.");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadYankiAdmin = useCallback(async () => {
    try {
      const y = await fetchYankiAdminStats();
      setYankiExtra(y && typeof y === "object" ? y : null);
    } catch {
      setYankiExtra(null);
    }
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const needAll = activeTab === "all" || activeTab === "reported";
    const apiStatus = needAll ? "all" : activeTab;

    try {
      const raw = await fetchModerationPosts(apiStatus);
      const list = extractPostList(raw);
      let rows = list.map(normalizePost);
      if (activeTab === "reported") {
        rows = rows.filter((p) => p.reportCount > 0);
      }
      setPosts(rows);
      setApiError(false);
    } catch (e) {
      setPosts([]);
      setApiError(true);
      setError(e?.message || "Gönderiler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadStats();
    loadYankiAdmin();
  }, [loadStats, loadYankiAdmin]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const totalPosts = useMemo(() => {
    const fromYanki =
      yankiExtra &&
      (Number(yankiExtra.total_posts ?? yankiExtra.total ?? yankiExtra.count) || null);
    if (fromYanki != null && !Number.isNaN(fromYanki)) return fromYanki;
    return stats.approved + stats.pending + stats.rejected;
  }, [stats, yankiExtra]);

  const handleReview = useCallback(
    async (postId, action) => {
      setActionError(null);
      setActionPostId(postId);
      try {
        await reviewPost(postId, action, "");
        await loadPosts();
        await loadStats();
      } catch (e) {
        setActionError(e?.message || "İşlem başarısız.");
      } finally {
        setActionPostId(null);
      }
    },
    [loadPosts, loadStats]
  );

  const columns = useMemo(
    () => [
      {
        key: "content",
        label: "İçerik",
        width: "28%",
        render: (row) => (
          <span className={pageStyles.contentPreview} title={row.content || ""}>
            {truncate(row.content, 80)}
          </span>
        ),
      },
      {
        key: "type",
        label: "Tür",
        render: (row) => (
          <span className={typeBadgeClass(row.type)}>{typeLabel(row.type)}</span>
        ),
      },
      {
        key: "author",
        label: "Yazar",
      },
      {
        key: "status",
        label: "Durum",
        render: (row) => {
          const meta = STATUS_META[row.status] || {
            label: row.status,
            badge: styles.badgeGray,
          };
          return <span className={`${styles.badge} ${meta.badge}`}>{meta.label}</span>;
        },
      },
      {
        key: "date",
        label: "Tarih",
        render: (row) => formatDate(row.date),
      },
      {
        key: "actions",
        label: "Aksiyonlar",
        render: (row) => {
          if (row.status === "pending") {
            const busy = actionPostId === row.id;
            return (
              <div
                className={pageStyles.actionCell}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="presentation"
              >
                <button
                  type="button"
                  className={pageStyles.approveBtn}
                  disabled={busy}
                  onClick={() => handleReview(row.id, "approve")}
                >
                  {busy ? "…" : "Onayla"}
                </button>
                <button
                  type="button"
                  className={pageStyles.rejectBtn}
                  disabled={busy}
                  onClick={() => handleReview(row.id, "reject")}
                >
                  {busy ? "…" : "Reddet"}
                </button>
              </div>
            );
          }
          const meta = STATUS_META[row.status];
          return (
            <span className={pageStyles.statusNote}>{meta ? meta.label : "—"}</span>
          );
        },
      },
    ],
    [actionPostId, handleReview]
  );

  return (
    <div>
      <h1 className={styles.pageTitle}>Yankı Alanı Moderasyonu</h1>
      <p className={styles.pageDesc}>İçerikleri denetle ve yönet</p>

      {apiError && (
        <div className={pageStyles.mockBanner}>
          API bağlantısı kurulamadı. Gerçek veri yüklenene kadar boş gösterilir.
        </div>
      )}

      {error && (
        <div className={pageStyles.errorBanner} role="alert">
          {error}
        </div>
      )}

      {statsError && (
        <div className={pageStyles.errorBanner} role="alert">
          {statsError}
        </div>
      )}

      {actionError && (
        <div className={pageStyles.errorBanner} role="alert">
          {actionError}
        </div>
      )}

      <div className={`${styles.grid4} ${pageStyles.statsRow}`}>
        <StatCard
          label="Toplam Post"
          value={statsLoading ? "…" : totalPosts}
          accent="#c8a0ff"
        />
        <StatCard
          label="Onaylı"
          value={statsLoading ? "…" : stats.approved}
          accent="#50c878"
        />
        <StatCard
          label="Bekleyen"
          value={statsLoading ? "…" : stats.pending}
          accent="#ffc832"
        />
        <StatCard
          label="Reddedilen"
          value={statsLoading ? "…" : stats.rejected}
          accent="#ff5050"
        />
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Moderasyon sekmeleri">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={pageStyles.loadingBox}>Yükleniyor…</div>
      ) : (
        <DataTable columns={columns} data={posts} emptyText="Bu sekmede kayıt yok" />
      )}
    </div>
  );
}
