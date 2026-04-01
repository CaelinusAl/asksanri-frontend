import { useCallback, useMemo, useState } from "react";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminNotificationsPage.module.css";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "purchase",
    title: "Yeni Premium Aktivasyon",
    text: "mira@test.com aylık premium satın aldı",
    time: "2 dk önce",
    read: false,
  },
  {
    id: 2,
    type: "moderation",
    title: "Moderasyon Bekliyor",
    text: "3 yeni post onay bekliyor",
    time: "15 dk önce",
    read: false,
  },
  {
    id: 3,
    type: "comment",
    title: "Yorum Patlaması",
    text: "'1999 — Kapanmayan Frekans' postuna 8 yeni yorum",
    time: "1 sa önce",
    read: false,
  },
  {
    id: 4,
    type: "system",
    title: "API Yanıt Süresi",
    text: "Ortalama yanıt süresi 850ms'e yükseldi",
    time: "2 sa önce",
    read: true,
  },
  {
    id: 5,
    type: "purchase",
    title: "Kitap Satışı",
    text: "eren@test.com Matrix Code kitabını satın aldı",
    time: "3 sa önce",
    read: true,
  },
  {
    id: 6,
    type: "moderation",
    title: "Rapor",
    text: "Bir kullanıcı spam bildirimi yaptı",
    time: "5 sa önce",
    read: true,
  },
  {
    id: 7,
    type: "comment",
    title: "Yeni Yorum",
    text: "Yankı Alanı'nda 12 yeni yorum",
    time: "6 sa önce",
    read: true,
  },
  {
    id: 8,
    type: "system",
    title: "Deploy Başarılı",
    text: "Frontend v2.4.1 başarıyla deploy edildi",
    time: "8 sa önce",
    read: true,
  },
];

const FILTER_TABS = [
  { id: "all", label: "Tümü" },
  { id: "purchase", label: "Satın Alım" },
  { id: "moderation", label: "Moderasyon" },
  { id: "comment", label: "Yorum" },
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
  const [items, setItems] = useState(() => MOCK_NOTIFICATIONS.map((n) => ({ ...n })));
  const [filter, setFilter] = useState("all");

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((n) => n.type === filter);
  }, [items, filter]);

  const markRead = useCallback((id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

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
      <p className={styles.pageDesc}>Platform bildirimleri ve uyarılar</p>

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

      <div className={pageStyles.listWrap}>
        {filtered.length === 0 ? (
          <p className={pageStyles.emptyState}>Bu filtrede bildirim yok.</p>
        ) : (
          filtered.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`${pageStyles.notifCard} ${!n.read ? pageStyles.notifUnread : ""}`}
              onClick={() => markRead(n.id)}
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
                <span className={pageStyles.notifTime}>{n.time}</span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
