import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminNotificationsFeed } from "../../data/adminApi";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminNotificationsPage.module.css";

const READ_STORAGE_KEY = "sanri_admin_notif_read_v1";

function loadReadSet() {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  } catch {
    return new Set();
  }
}

function saveReadSet(set) {
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

function formatRelativeTime(iso) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return String(iso);
  const sec = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (sec < 45) return "Az önce";
  if (sec < 3600) return `${Math.floor(sec / 60)} dk önce`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} sa önce`;
  if (sec < 86400 * 7) return `${Math.floor(sec / 86400)} gün önce`;
  return new Date(t).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
}

const FILTER_TABS = [
  { id: "all", label: "Tümü" },
  { id: "purchase", label: "Satın Alım" },
  { id: "moderation", label: "Moderasyon" },
  { id: "comment", label: "Aktivite" },
  { id: "system", label: "Sistem" },
];

const ICON_BY_TYPE = {
  purchase: "✦",
  moderation: "⊙",
  comment: "◉",
  system: "⚙",
};

const ICON_CLASS_BY_TYPE = {
  purchase: pageStyles.notifIconPurchase,
  moderation: pageStyles.notifIconModeration,
  comment: pageStyles.notifIconComment,
  system: pageStyles.notifIconSystem,
};

function iconClassForType(type) {
  const t = String(type || "").toLowerCase();
  return ICON_CLASS_BY_TYPE[t] || pageStyles.notifIconSystem;
}

function iconGlyphForType(type) {
  const t = String(type || "").toLowerCase();
  return ICON_BY_TYPE[t] || "•";
}

export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mergeWithRead = useCallback((rawList) => {
    const rs = loadReadSet();
    return (rawList || []).map((n) => ({
      ...n,
      id: n.id != null ? String(n.id) : `row-${Math.random()}`,
      read: rs.has(String(n.id)),
      timeLabel: formatRelativeTime(n.time),
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminNotificationsFeed(80);
        const list = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) setItems(mergeWithRead(list));
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Akış yüklenemedi");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mergeWithRead]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((n) => n.type === filter);
  }, [items, filter]);

  const markRead = useCallback((id) => {
    const sid = String(id);
    const next = loadReadSet();
    next.add(sid);
    saveReadSet(next);
    setItems((prev) => prev.map((n) => (String(n.id) === sid ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    const all = loadReadSet();
    items.forEach((n) => all.add(String(n.id)));
    saveReadSet(all);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [items]);

  const onCardClick = useCallback(
    (n) => {
      markRead(n.id);
      if (n.href && typeof n.href === "string") navigate(n.href);
    },
    [markRead, navigate],
  );

  return (
    <div>
      <header className={pageStyles.headerRow}>
        <div className={pageStyles.titleBlock}>
          <h1 className={`${styles.pageTitle} ${pageStyles.headerTitle}`}>Bildirim Merkezi</h1>
          {unreadCount > 0 ? (
            <span className={pageStyles.unreadBadge} aria-label={`Okunmamış ${unreadCount}`}>
              {unreadCount}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          className={pageStyles.markAllBtn}
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          Tümünü Okundu İşaretle
        </button>
      </header>
      <p className={styles.pageDesc}>
        Canlı akış: havale bekleyenler, Yankı moderasyonu, yeni üyeler, funnel ve platform olayları.
      </p>

      <div className={styles.filterBar}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.filterBtn} ${filter === tab.id ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? <p className={pageStyles.emptyState}>{error}</p> : null}
      {loading ? <p className={pageStyles.emptyState}>Akış yükleniyor…</p> : null}

      <div className={pageStyles.listWrap}>
        {!loading && !error && filtered.length === 0 ? (
          <p className={pageStyles.emptyState}>
            Bu filtrede kayıt yok. Etkinlik veya bekleyen iş oluşunca burada görünür.
          </p>
        ) : null}
        {!loading &&
          filtered.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`${pageStyles.notifCard} ${!n.read ? pageStyles.notifUnread : ""}`}
              onClick={() => onCardClick(n)}
            >
              <span
                className={`${pageStyles.notifIcon} ${iconClassForType(n.type)}`}
                aria-hidden
              >
                {iconGlyphForType(n.type)}
              </span>
              <span className={pageStyles.notifBody}>
                <span className={pageStyles.notifTitle}>{n.title}</span>
                <span className={pageStyles.notifText}>{n.text}</span>
                <span className={pageStyles.notifTime}>{n.timeLabel || n.time}</span>
              </span>
            </button>
          ))}
      </div>
    </div>
  );
}
