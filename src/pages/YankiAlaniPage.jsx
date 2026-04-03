import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { POST_TYPES, getPostTypeById, timeAgo } from "../data/yankiData";
import { fetchPosts, fetchFeaturedPost, reactToPost, fetchMyReactions, askSanriReflection, addComment, reportPost, isLoggedIn, fetchNotifications, markAllNotificationsRead, markNotificationRead } from "../data/yankiApi";
import SEED_POSTS from "../data/seedYankilar";
import { getDailyQuestion } from "../data/dailyQuestions";
import SanriSharePanel from "../components/SanriSharePanel";
import styles from "./YankiAlaniPage.module.css";

const REPORT_REASONS = [
  { id: "spam", label: { tr: "Spam / Reklam", en: "Spam / Advertising" } },
  { id: "offensive", label: { tr: "Hakaret / Saldırgan", en: "Offensive / Abusive" } },
  { id: "irrelevant", label: { tr: "Konuyla ilgisiz", en: "Off-topic" } },
  { id: "harmful", label: { tr: "Zararlı içerik", en: "Harmful content" } },
  { id: "other", label: { tr: "Diğer", en: "Other" } },
];

function parseStructuredReflection(text) {
  if (!text) return null;
  const yansimaMatch = text.match(/YANSIMA:\s*([\s\S]*?)(?=\n+DER[İI]NL[İI]K:|$)/i);
  const derinlikMatch = text.match(/DER[İI]NL[İI]K:\s*([\s\S]*?)(?=\n+SORU:|$)/i);
  const soruMatch = text.match(/SORU:\s*([\s\S]*?)$/i);
  if (yansimaMatch || derinlikMatch || soruMatch) {
    return {
      yansima: yansimaMatch ? yansimaMatch[1].trim() : null,
      derinlik: derinlikMatch ? derinlikMatch[1].trim() : null,
      soru: soruMatch ? soruMatch[1].trim() : null,
      isStructured: true,
    };
  }
  return { yansima: text, isStructured: false };
}

const TABS = [
  { id: "akis", label: { tr: "Akış", en: "Feed" } },
  { id: "gunluk", label: { tr: "Günlük Akış", en: "Daily Flow" } },
  { id: "sanri", label: { tr: "Sanrı Seçkisi", en: "Sanri Curated" } },
];

const DEEPEN_QUESTIONS = {
  duygu: {
    tr: "Bu duygunun altında ne var?",
    en: "What lies beneath this feeling?",
  },
  ruya: {
    tr: "Bu rüya sana ne söylüyor?",
    en: "What is this dream telling you?",
  },
  farkindalik: {
    tr: "Bu farkındalık seni nereye götürür?",
    en: "Where does this awareness take you?",
  },
  soru: {
    tr: "Bu sorunun altında hangi cevap var?",
    en: "What answer hides beneath this question?",
  },
  isaret: {
    tr: "Bu işaret neyin habercisi?",
    en: "What does this sign herald?",
  },
  gunluk_akis: {
    tr: "Bu anın sana öğrettiği ne?",
    en: "What did this moment teach you?",
  },
  donusum: {
    tr: "Bu dönüşüm seni nereye taşıyor?",
    en: "Where is this transformation taking you?",
  },
  genel: {
    tr: "Bu paylaşımın altında ne yatıyor?",
    en: "What lies beneath this sharing?",
  },
};

function normalizePost(p) {
  return {
    id: p.id,
    author_mode: p.author_mode || p.authorMode || "anonymous",
    author_name: p.author_name || null,
    author_id: p.author_id || p.authorId || null,
    title: p.title || null,
    content: p.content || p.content_sanitized || "",
    category: p.category || p.type || "genel",
    image_url: p.image_url || p.imageUrl || null,
    audio_url: p.audio_url || p.audioUrl || null,
    sanri_note: p.sanri_note || p.sanriNote || null,
    reaction_heart: p.reaction_heart ?? p.reactions?.heart ?? 0,
    reaction_felt: p.reaction_felt ?? p.reactions?.felt ?? 0,
    reaction_sessizce: p.reaction_sessizce ?? 0,
    comment_count: p.comment_count ?? p.commentCount ?? 0,
    created_at: p.created_at || p.createdAt || null,
    published_at: p.published_at || p.publishedAt || null,
  };
}

function groupByDay(posts, isTR) {
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  const groups = {};
  for (const post of posts) {
    const d = new Date(post.created_at);
    const ds = d.toDateString();
    let label;
    if (ds === todayStr) label = isTR ? "Bugün" : "Today";
    else if (ds === yesterdayStr) label = isTR ? "Dün" : "Yesterday";
    else label = isTR ? "Bu Hafta" : "This Week";
    if (!groups[label]) groups[label] = [];
    groups[label].push(post);
  }
  return groups;
}

export default function YankiAlaniPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isTR = language === "tr";

  const initialTab = params.get("tab") || "akis";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeType, setActiveType] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Saved posts (client-side only)
  const SAVED_KEY = "sanri_yanki_saved";
  const [savedSet, setSavedSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); }
    catch { return new Set(); }
  });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const section = activeTab === "sanri" ? "curated" : activeTab === "gunluk" ? null : null;
      const category = activeTab === "akis" && activeType !== "all" ? activeType : null;
      const data = await fetchPosts({ category, section, limit: 40 });
      setPosts((data.posts || []).map(normalizePost));
    } catch (err) {
      console.error("[YankiAlani] load error:", err);
      setError(isTR ? "Yüklenirken bir hata oluştu." : "Failed to load posts.");
      setPosts([]);
    }
    setLoading(false);
  }, [activeType, activeTab, isTR]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const displayPosts = useMemo(() => {
    let real = posts;
    if (activeTab === "gunluk") {
      real = posts.filter((p) => p.category === "gunluk_akis" || p.category === "gunluk");
    }
    if (real.length < 5) {
      const seedFiltered = activeTab === "gunluk"
        ? SEED_POSTS.filter((s) => s.category === "gunluk_akis")
        : SEED_POSTS;
      return [...real, ...seedFiltered];
    }
    return real;
  }, [activeTab, posts]);

  const dailyGroups = useMemo(
    () => (activeTab === "gunluk" ? groupByDay(displayPosts, isTR) : {}),
    [activeTab, displayPosts, isTR]
  );

  const [featuredPost, setFeaturedPost] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedPost()
      .then((data) => {
        if (!cancelled && data.post) setFeaturedPost(normalizePost(data.post));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // ─── Notifications ───
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  const loadNotifs = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      const data = await fetchNotifications({ limit: 20 });
      setNotifs(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadNotifs(); }, [loadNotifs]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setUnreadCount(0);
      setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch { /* silent */ }
  };

  const handleNotifClick = async (n) => {
    if (!n.is_read) {
      try { await markNotificationRead(n.id); } catch { /* silent */ }
      setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, is_read: true } : x));
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
    if (n.post_id) {
      setNotifOpen(false);
      navigate(`/yanki-alani/${n.post_id}`);
    }
  };

  // ─── My active reactions per post  { postId: Set(["kalbime_dokundu", ...]) } ───
  const [myReactions, setMyReactions] = useState({});
  const [popAnim, setPopAnim] = useState(null);

  useEffect(() => {
    if (!isLoggedIn() || posts.length === 0) return;
    const realIds = posts.filter((p) => !p.isSeed).map((p) => p.id);
    if (realIds.length === 0) return;
    fetchMyReactions(realIds)
      .then((data) => {
        const map = {};
        for (const [pid, types] of Object.entries(data.reactions || {})) {
          map[pid] = new Set(types);
        }
        setMyReactions(map);
      })
      .catch(() => {});
  }, [posts]);

  const handleReact = async (e, postId, type) => {
    e.stopPropagation();
    const targetPost = displayPosts.find((p) => p.id === postId);
    if (targetPost?.is_seed) return;
    if (!isLoggedIn()) { navigate("/giris", { state: { from: location.pathname + location.search } }); return; }
    const wasActive = myReactions[postId]?.has(type);
    const delta = wasActive ? -1 : 1;
    const col = type === "kalbime_dokundu" ? "reaction_heart"
      : type === "ben_de_hissettim" ? "reaction_felt"
      : "reaction_sessizce";

    setPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, [col]: Math.max((p[col] || 0) + delta, 0) } : p)
    );
    setMyReactions((prev) => {
      const next = { ...prev };
      const set = new Set(prev[postId] || []);
      if (wasActive) set.delete(type); else set.add(type);
      next[postId] = set;
      return next;
    });

    if (!wasActive) {
      setPopAnim(`${postId}-${type}`);
      setTimeout(() => setPopAnim(null), 500);
    }

    try {
      await reactToPost(postId, type);
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) => p.id === postId ? { ...p, [col]: Math.max((p[col] || 0) - delta, 0) } : p)
      );
      setMyReactions((prev) => {
        const next = { ...prev };
        const set = new Set(prev[postId] || []);
        if (wasActive) set.add(type); else set.delete(type);
        next[postId] = set;
        return next;
      });
      if (err.status === 401) navigate("/giris", { state: { from: location.pathname + location.search } });
    }
  };

  // ─── Save (client-side) ───
  const handleSave = (e, postId) => {
    e.stopPropagation();
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  // ─── Share link ───
  const handleShare = async (e, postId) => {
    e.stopPropagation();
    const base = window.location.origin;
    const ref = user?.id ? `?ref=${user.id}` : "";
    const url = `${base}/yanki/${postId}${ref}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(postId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(postId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // ─── Sanri reflection ───
  const [reflections, setReflections] = useState({});
  const [reflLoading, setReflLoading] = useState({});
  const [reflCopied, setReflCopied] = useState(null);

  const handleShareReflection = async (e, postId) => {
    e.stopPropagation();
    const raw = reflections[postId];
    if (!raw) return;
    const parsed = parseStructuredReflection(raw);
    let text = "";
    if (parsed?.isStructured) {
      if (parsed.yansima) text += parsed.yansima + "\n";
      if (parsed.derinlik) text += "\n" + parsed.derinlik + "\n";
      if (parsed.soru) text += `\n"${parsed.soru}"\n`;
    } else {
      text = raw;
    }
    text += `\n— Sanrı Yansıması`;
    const shareUrl = `${window.location.origin}/yanki/${postId}${user?.id ? `?ref=${user.id}` : ""}`;
    text += `\n${shareUrl}`;
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    setReflCopied(postId);
    setTimeout(() => setReflCopied(null), 2500);
  };

  const handleSanri = async (e, post) => {
    e.stopPropagation();
    if (reflections[post.id] || reflLoading[post.id]) return;
    if (!isLoggedIn()) { navigate("/giris", { state: { from: location.pathname + location.search } }); return; }

    setReflLoading((prev) => ({ ...prev, [post.id]: true }));
    try {
      const data = await askSanriReflection(post.id, post.content);
      setReflections((prev) => ({ ...prev, [post.id]: data.response }));
    } catch (err) {
      if (err.status === 401) navigate("/giris", { state: { from: location.pathname + location.search } });
      else setReflections((prev) => ({ ...prev, [post.id]: isTR ? "Yansıma alınamadı." : "Reflection unavailable." }));
    }
    setReflLoading((prev) => ({ ...prev, [post.id]: false }));
  };

  // ─── Report modal ───
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  const openReport = (e, postId) => {
    e.stopPropagation();
    if (!isLoggedIn()) { navigate("/giris", { state: { from: location.pathname + location.search } }); return; }
    setReportTarget(postId);
    setReportReason("");
    setReportDone(false);
  };

  const handleReport = async () => {
    if (!reportReason || reportSending || !reportTarget) return;
    setReportSending(true);
    try {
      await reportPost(reportTarget, reportReason);
      setReportDone(true);
      setTimeout(() => { setReportTarget(null); setReportDone(false); setReportReason(""); }, 2000);
    } catch (err) {
      if (err.status === 401) navigate("/giris", { state: { from: location.pathname + location.search } });
    }
    setReportSending(false);
  };

  // ─── Quick reply for daily flow ───
  const [quickReply, setQuickReply] = useState({});
  const handleQuickReply = async (postId) => {
    const targetPost = displayPosts.find((p) => p.id === postId);
    if (targetPost?.is_seed) return;
    const text = (quickReply[postId] || "").trim();
    if (!text) return;
    if (!isLoggedIn()) {
      navigate("/giris", { state: { from: location.pathname + location.search } });
      return;
    }
    try {
      await addComment(postId, text);
      setQuickReply((prev) => ({ ...prev, [postId]: "" }));
      setPosts((prev) =>
        prev.map((p) => p.id === postId ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p)
      );
    } catch (err) {
      if (err.status === 401) {
        navigate("/giris", { state: { from: location.pathname + location.search } });
      }
    }
  };

  return (
    <div className={styles.page}>
      {/* Back + brand + notifications + profile */}
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← {isTR ? "Kapılar" : "Gates"}
        </button>
        <div className={styles.topBarRight}>
          {isLoggedIn() && (
            <div className={styles.notifWrap}>
              <button className={styles.notifBtn} onClick={() => setNotifOpen((v) => !v)}>
                🔔
                {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
              </button>
              {notifOpen && (
                <div className={styles.notifDropdown}>
                  <div className={styles.notifHeader}>
                    <span className={styles.notifTitle}>{isTR ? "Bildirimler" : "Notifications"}</span>
                    {unreadCount > 0 && (
                      <button className={styles.notifReadAll} onClick={handleMarkAllRead}>
                        {isTR ? "Tümünü Oku" : "Read All"}
                      </button>
                    )}
                  </div>
                  {notifs.length === 0 ? (
                    <p className={styles.notifEmpty}>{isTR ? "Henüz bildirim yok" : "No notifications yet"}</p>
                  ) : (
                    <div className={styles.notifList}>
                      {notifs.map((n) => (
                        <button
                          key={n.id}
                          className={`${styles.notifItem} ${!n.is_read ? styles.notifUnread : ""}`}
                          onClick={() => handleNotifClick(n)}
                        >
                          <span className={styles.notifIcon}>
                            {n.type === "comment" ? "💬" : n.type === "reaction" ? "♡" : "✦"}
                          </span>
                          <span className={styles.notifText}>{n.message || n.type}</span>
                          <span className={styles.notifTime}>{timeAgo(n.created_at, isTR)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {isLoggedIn() && (
            <button className={styles.profileBtn} onClick={() => navigate("/yanki-alani/profil/me")}>
              👤
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.heroTitle}>{isTR ? "Yankı Alanı" : "Echo Field"}</h1>
        <p className={styles.heroSub}>
          {isTR
            ? "Kolektif bilinç akışı — paylaş, yankıla, dinle"
            : "Collective consciousness stream — share, echo, listen"}
        </p>
      </motion.section>

      {/* Daily question */}
      {(() => {
        const dq = getDailyQuestion();
        return (
          <div
            className={styles.dailyQ}
            onClick={() => navigate("/yanki-alani/yeni")}
          >
            <span className={styles.dailyQLabel}>{isTR ? "BUGÜNÜN SORUSU" : "TODAY'S QUESTION"}</span>
            <p className={styles.dailyQText}>{isTR ? dq.tr : dq.en}</p>
            <span className={styles.dailyQHint}>{isTR ? "Yanıtla →" : "Respond →"}</span>
          </div>
        );
      })()}

      {/* Tabs */}
      <nav className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {isTR ? tab.label.tr : tab.label.en}
          </button>
        ))}
      </nav>

      {/* Category filter (only on main feed) */}
      {activeTab === "akis" && (
        <div className={styles.typeFilter}>
          <button
            className={`${styles.typeChip} ${activeType === "all" ? styles.typeActive : ""}`}
            onClick={() => setActiveType("all")}
          >
            {isTR ? "Tümü" : "All"}
          </button>
          {POST_TYPES.map((t) => (
            <button
              key={t.id}
              className={`${styles.typeChip} ${activeType === t.id ? styles.typeActive : ""}`}
              style={activeType === t.id ? { borderColor: t.color, color: t.color } : {}}
              onClick={() => setActiveType(t.id)}
            >
              {t.icon} {isTR ? t.label.tr : t.label.en}
            </button>
          ))}
        </div>
      )}

      {/* Bugünün Yankısı — featured post */}
      {activeTab === "akis" && featuredPost && (() => {
        const fpt = getPostTypeById(featuredPost.category);
        return (
          <motion.section
            className={styles.featuredWrap}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.featuredLabel}>
              ✦ {isTR ? "GÜNÜN YANKISI" : "ECHO OF THE DAY"}
            </div>
            <article
              className={styles.featuredCard}
              onClick={() => navigate(`/yanki-alani/${featuredPost.id}`)}
            >
              <div className={styles.featuredHeader}>
                <span className={styles.featuredAvatar} style={{ background: fpt.color + "33", color: fpt.color }}>
                  {featuredPost.author_mode === "anonymous" ? "?" : (featuredPost.author_name || "?")[0]}
                </span>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>
                    {featuredPost.author_mode === "anonymous" ? (isTR ? "Anonim" : "Anonymous") : (featuredPost.author_name || (isTR ? "Anonim" : "Anonymous"))}
                  </span>
                  <span className={styles.timeAgo}>{timeAgo(featuredPost.created_at, isTR)}</span>
                </div>
                <span className={styles.typeBadge} style={{ background: fpt.color + "22", color: fpt.color, borderColor: fpt.color + "44" }}>
                  {fpt.icon} {isTR ? fpt.label.tr : fpt.label.en}
                </span>
              </div>
              {featuredPost.title && <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>}
              <p className={styles.featuredContent}>{featuredPost.content}</p>
              {featuredPost.sanri_note && (
                <div className={styles.featuredSanri}>
                  <span className={styles.sanriIcon}>✦</span>
                  <span>{featuredPost.sanri_note}</span>
                </div>
              )}
              <div className={styles.featuredMeta}>
                <span>♡ {featuredPost.reaction_heart}</span>
                <span>◈ {featuredPost.reaction_felt}</span>
                <span>◇ {featuredPost.reaction_sessizce}</span>
                <span>💬 {featuredPost.comment_count}</span>
              </div>
            </article>
          </motion.section>
        );
      })()}

      {/* Feed */}
      <section className={styles.feed}>
        {/* Loading */}
        {loading && (
          <div className={styles.loader}>
            <span className={styles.pulse} />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className={styles.errorWrap}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryBtn} onClick={loadPosts}>
              {isTR ? "Tekrar Dene" : "Retry"}
            </button>
          </div>
        )}

        {/* ── Günlük Akış: time-grouped telegram-style ── */}
        {!loading && !error && activeTab === "gunluk" ? (
          <div className={styles.dailyFeed}>
            {Object.keys(dailyGroups).length === 0 && (
              <p className={styles.empty}>{isTR ? "Henüz günlük akış yok..." : "No daily flow yet..."}</p>
            )}
            {Object.entries(dailyGroups).map(([groupLabel, groupPosts]) => (
              <div key={groupLabel} className={styles.dailyGroup}>
                <div className={styles.dailyGroupLabel}>{groupLabel}</div>
                {groupPosts.map((post, i) => {
                  const pt = getPostTypeById(post.category);
                  return (
                    <motion.div
                      key={post.id}
                      className={styles.dailyCard}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                    >
                      <div className={styles.dailyHeader}>
                        <span className={styles.dailyAvatar}>
                          {post.author_mode === "anonymous" ? "?" : (post.author_name || "?")[0]}
                        </span>
                        <span className={styles.dailyAuthor}>
                          {post.author_mode === "anonymous" ? (isTR ? "Anonim" : "Anonymous") : (post.author_name || (isTR ? "Anonim" : "Anonymous"))}
                        </span>
                        <span className={styles.dailyTime}>{timeAgo(post.created_at, isTR)}</span>
                      </div>
                      <p className={styles.dailyContent} onClick={() => navigate(`/yanki-alani/${post.id}`)}>
                        {post.content}
                      </p>
                      <div className={styles.dailyActions}>
                        <button
                          type="button"
                          className={styles.dailyAction}
                          disabled={post.is_seed}
                          onClick={(e) => handleReact(e, post.id, "kalbime_dokundu")}
                        >
                          ♡ {isTR ? "Yankı" : "Echo"} {post.reaction_heart > 0 && post.reaction_heart}
                        </button>
                        <button
                          type="button"
                          className={styles.dailyAction}
                          disabled={post.is_seed}
                          onClick={(e) => handleReact(e, post.id, "ben_de_hissettim")}
                        >
                          ◈ {isTR ? "Açıldı" : "Felt"} {post.reaction_felt > 0 && post.reaction_felt}
                        </button>
                        <button
                          type="button"
                          className={styles.dailyAction}
                          disabled={post.is_seed}
                          onClick={(e) => handleReact(e, post.id, "sessizce_aldim")}
                        >
                          ◇ {isTR ? "Sessiz" : "Silent"} {post.reaction_sessizce > 0 && post.reaction_sessizce}
                        </button>
                      </div>
                      {/* Quick reply — yalnızca gerçek gönderiler (API) */}
                      <div className={styles.quickReply}>
                        <input
                          type="text"
                          className={styles.quickReplyInput}
                          placeholder={post.is_seed ? (isTR ? "Örnek yankı (yorum kapalı)" : "Sample (comments off)") : (isTR ? "Hızlı yankı..." : "Quick echo...")}
                          value={quickReply[post.id] || ""}
                          disabled={post.is_seed}
                          onChange={(e) => setQuickReply((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && !post.is_seed && handleQuickReply(post.id)}
                        />
                        <button
                          type="button"
                          className={styles.quickReplySend}
                          disabled={post.is_seed || !(quickReply[post.id] || "").trim()}
                          onClick={() => handleQuickReply(post.id)}
                        >
                          →
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : !loading && !error ? (
          /* ── Standard feed (Akış + Sanrı Seçkisi) ── */
          <>
            <AnimatePresence mode="popLayout">
              {displayPosts.map((post, i) => {
                const pt = getPostTypeById(post.category);
                const saved = savedSet.has(post.id);
                const showSeedDivider = post.is_seed && (i === 0 || !displayPosts[i - 1]?.is_seed);
                return (
                  <div key={post.id}>
                  {showSeedDivider && posts.length > 0 && (
                    <div className={styles.seedDivider}>
                      <span className={styles.seedDividerLine} />
                      <span className={styles.seedDividerText}>{isTR ? "✦ Topluluktan ilhamlar" : "✦ Community inspirations"}</span>
                      <span className={styles.seedDividerLine} />
                    </div>
                  )}
                  <motion.article
                    key={post.id}
                    className={`${styles.card}${post.is_seed ? ` ${styles.seedCard}` : ""}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    onClick={() => !post.is_seed && navigate(`/yanki-alani/${post.id}`)}
                    style={post.is_seed ? { cursor: "default" } : undefined}
                  >
                    {post.is_seed && (
                      <div className={styles.seedBadge}>
                        <span className={styles.seedDot}>✦</span> {post.seed_tag || "İlk Yankı"}
                      </div>
                    )}
                    <div className={styles.cardHeader}>
                      <span
                        className={styles.avatar}
                        style={{ background: pt.color + "33", color: pt.color }}
                      >
                        {post.author_mode === "anonymous" ? "?" : (post.author_name || "?")[0]}
                      </span>
                      <div className={styles.authorInfo}>
                        {post.author_mode !== "anonymous" && post.author_id ? (
                          <button
                            className={styles.authorLink}
                            onClick={(e) => { e.stopPropagation(); navigate(`/yanki-alani/profil/${post.author_id}`); }}
                          >
                            {post.author_name || (isTR ? "Anonim" : "Anonymous")}
                          </button>
                        ) : (
                          <span className={styles.authorName}>
                            {post.author_mode === "anonymous"
                              ? isTR ? "Anonim" : "Anonymous"
                              : (post.author_name || (isTR ? "Anonim" : "Anonymous"))}
                          </span>
                        )}
                        <span className={styles.timeAgo}>
                          {post.is_seed ? (post.seed_tag === "Rehber Paylaşım" ? "✦" : "~") : timeAgo(post.created_at, isTR)}
                        </span>
                      </div>
                      <span className={styles.typeBadge} style={{ background: pt.color + "22", color: pt.color, borderColor: pt.color + "44" }}>
                        {pt.icon} {isTR ? pt.label.tr : pt.label.en}
                      </span>
                    </div>

                    {post.title && <h3 className={styles.cardTitle}>{post.title}</h3>}
                    <p className={styles.cardContent}>{post.content}</p>

                    {(() => {
                      const dq = DEEPEN_QUESTIONS[post.category] || DEEPEN_QUESTIONS.genel;
                      return (
                        <p className={styles.deepenQ}>
                          {isTR ? dq.tr : dq.en}
                        </p>
                      );
                    })()}

                    {post.sanri_note && (
                      <div className={styles.sanriNote}>
                        <span className={styles.sanriIcon}>✦</span>
                        <span>{post.sanri_note}</span>
                      </div>
                    )}

                    {/* Inline Sanrı reflection */}
                    {reflections[post.id] && (() => {
                      const rp = parseStructuredReflection(reflections[post.id]);
                      const shareU = `${window.location.origin}/yanki/${post.id}${user?.id ? `?ref=${user.id}` : ""}`;
                      return (
                        <div className={styles.inlineReflection} onClick={(e) => e.stopPropagation()}>
                          <div className={styles.inlineReflHeader}>
                            <span className={styles.sanriIcon}>✦</span>
                            <span className={styles.inlineReflLabel}>SANRI YANSIMASI</span>
                            <button
                              className={`${styles.reflShareBtn} ${reflCopied === post.id ? styles.reflShareCopied : ""}`}
                              onClick={(e) => handleShareReflection(e, post.id)}
                            >
                              {reflCopied === post.id ? "✓" : "⤴"}
                            </button>
                          </div>
                          {rp?.isStructured ? (
                            <>
                              {rp.yansima && <p className={styles.inlineReflText}>{rp.yansima}</p>}
                              {rp.soru && <p className={styles.inlineReflQuestion}>{rp.soru}</p>}
                            </>
                          ) : (
                            <p className={styles.inlineReflText}>{reflections[post.id]}</p>
                          )}
                          <SanriSharePanel
                            variant="compact"
                            reflectionText={reflections[post.id]}
                            shareUrl={shareU}
                            cardKind="yanki"
                            isTR={isTR}
                          />
                        </div>
                      );
                    })()}

                    {post.is_seed ? (
                      <div className={styles.cardActions}>
                        <span className={styles.seedStat}>♡ {post.reaction_heart}</span>
                        <span className={styles.seedStat}>◈ {post.reaction_felt}</span>
                        <span className={styles.seedStat}>◇ {post.reaction_sessizce}</span>
                        <span className={styles.seedStat}>💬 {post.comment_count}</span>
                      </div>
                    ) : (
                      <div className={styles.cardActions}>
                        {[
                          { type: "kalbime_dokundu", icon: "♡", iconActive: "♥", col: "reaction_heart", tr: "Yankı Ver", en: "Echo", cls: "heart" },
                          { type: "ben_de_hissettim", icon: "◈", iconActive: "◆", col: "reaction_felt", tr: "Bende Açıldı", en: "Felt it", cls: "felt" },
                          { type: "sessizce_aldim", icon: "◇", iconActive: "◆", col: "reaction_sessizce", tr: "Sessizce", en: "Silent", cls: "silent" },
                        ].map((rx) => {
                          const active = myReactions[post.id]?.has(rx.type);
                          const popping = popAnim === `${post.id}-${rx.type}`;
                          return (
                            <button
                              key={rx.type}
                              className={`${styles.reactBtn} ${active ? styles[`reactActive_${rx.cls}`] : ""} ${popping ? styles.reactPop : ""}`}
                              onClick={(e) => handleReact(e, post.id, rx.type)}
                            >
                              <span className={styles.reactIcon}>{active ? rx.iconActive : rx.icon}</span>
                              <span className={styles.reactLabel}>{isTR ? rx.tr : rx.en}</span>
                              {(post[rx.col] || 0) > 0 && (
                                <span className={`${styles.reactCount} ${popping ? styles.countPop : ""}`}>
                                  {post[rx.col]}
                                </span>
                              )}
                            </button>
                          );
                        })}
                        <button className={styles.action} onClick={(e) => { e.stopPropagation(); navigate(`/yanki-alani/${post.id}`); }}>
                          💬 {post.comment_count}
                        </button>
                        <button
                          className={`${styles.action} ${saved ? styles.actionActive : ""}`}
                          onClick={(e) => handleSave(e, post.id)}
                        >
                          {saved ? "★" : "☆"}
                        </button>
                        <button
                          className={`${styles.actionShare} ${copiedId === post.id ? styles.actionShareCopied : ""}`}
                          onClick={(e) => handleShare(e, post.id)}
                          title={isTR ? "Paylaş" : "Share"}
                        >
                          {copiedId === post.id ? "✓" : "⤴"}
                        </button>
                        <button className={styles.actionReport} onClick={(e) => openReport(e, post.id)}>
                          ⚑
                        </button>
                        <button
                          className={`${styles.actionSanri} ${reflections[post.id] ? styles.actionSanriDone : ""}`}
                          onClick={(e) => handleSanri(e, post)}
                          disabled={reflLoading[post.id]}
                        >
                          {reflLoading[post.id]
                            ? (isTR ? "✦ Yansıtılıyor..." : "✦ Reflecting...")
                            : reflections[post.id]
                              ? (isTR ? "✦ Yansıma" : "✦ Reflected")
                              : (isTR ? "Sanrı'ya Taşı" : "Send to Sanri")}
                        </button>
                      </div>
                    )}
                  </motion.article>
                  </div>
                );
              })}
            </AnimatePresence>

            {!loading && displayPosts.length === 0 && SEED_POSTS.length === 0 && (
              <p className={styles.empty}>
                {isTR ? "Henüz yankı yok. İlk yankıyı sen bırak!" : "No echoes yet. Be the first!"}
              </p>
            )}
          </>
        ) : null}
      </section>

      {/* Report Modal */}
      <AnimatePresence>
        {reportTarget && (
          <motion.div
            className={styles.reportOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !reportSending && setReportTarget(null)}
          >
            <motion.div
              className={styles.reportModal}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              {reportDone ? (
                <div className={styles.reportSuccess}>
                  <span className={styles.reportSuccessIcon}>✓</span>
                  <p>{isTR ? "Bildirim alındı. Teşekkürler." : "Report received. Thank you."}</p>
                </div>
              ) : (
                <>
                  <h3 className={styles.reportTitle}>
                    {isTR ? "İçerik Bildir" : "Report Content"}
                  </h3>
                  <p className={styles.reportDesc}>
                    {isTR ? "Bu paylaşımı neden bildiriyorsun?" : "Why are you reporting this post?"}
                  </p>
                  <div className={styles.reportReasons}>
                    {REPORT_REASONS.map((r) => (
                      <button
                        key={r.id}
                        className={`${styles.reportReasonBtn} ${reportReason === r.id ? styles.reportReasonActive : ""}`}
                        onClick={() => setReportReason(r.id)}
                      >
                        {isTR ? r.label.tr : r.label.en}
                      </button>
                    ))}
                  </div>
                  <div className={styles.reportModalActions}>
                    <button
                      className={styles.reportCancelBtn}
                      onClick={() => setReportTarget(null)}
                      disabled={reportSending}
                    >
                      {isTR ? "İptal" : "Cancel"}
                    </button>
                    <button
                      className={styles.reportSubmitBtn}
                      onClick={handleReport}
                      disabled={!reportReason || reportSending}
                    >
                      {reportSending
                        ? (isTR ? "Gönderiliyor..." : "Sending...")
                        : (isTR ? "Bildir" : "Report")}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        className={styles.fab}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/yanki-alani/yeni")}
        aria-label={isTR ? "Yeni Paylaşım" : "New Post"}
      >
        +
      </motion.button>
    </div>
  );
}
