import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { getPostTypeById, timeAgo } from "../data/yankiData";
import { fetchMyProfile, fetchMyPosts, updateMyProfile, fetchUserPublicProfile, isLoggedIn } from "../data/yankiApi";
import styles from "./YankiProfilPage.module.css";

const PROFILE_TABS = [
  { id: "posts", label: { tr: "Paylaşımlar", en: "Posts" } },
  { id: "saved", label: { tr: "Kaydedilenler", en: "Saved" } },
];

function normalizePost(p) {
  return {
    id: p.id,
    author_mode: p.author_mode || "anonymous",
    author_name: p.author_name || null,
    title: p.title || null,
    content: p.content || "",
    category: p.category || "genel",
    reaction_heart: p.reaction_heart ?? 0,
    reaction_felt: p.reaction_felt ?? 0,
    reaction_sessizce: p.reaction_sessizce ?? 0,
    comment_count: p.comment_count ?? 0,
    created_at: p.created_at || null,
    status: p.status || "published",
  };
}

export default function YankiProfilPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);

  const isMe = !userId || userId === "me";

  const loadData = useCallback(async () => {
    if (!isMe) { setLoading(false); return; }
    if (!isLoggedIn()) { navigate("/giris", { state: { from: location.pathname } }); return; }
    setLoading(true);
    setError(null);
    try {
      const [profileData, postsData] = await Promise.all([
        fetchMyProfile().catch(() => null),
        fetchMyPosts({ limit: 50 }),
      ]);
      if (profileData) setProfile(profileData);
      setPosts((postsData.posts || []).map(normalizePost));
    } catch (err) {
      if (err.status === 401) { navigate("/giris", { state: { from: location.pathname } }); return; }
      setError(isTR ? "Yüklenemedi." : "Failed to load.");
    }
    setLoading(false);
  }, [isMe, isTR, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const SAVED_KEY = "sanri_yanki_saved";
  const savedIds = (() => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); }
    catch { return []; }
  })();

  const displayPosts = activeTab === "saved" ? [] : posts;
  const stats = profile?.stats || {};

  const startEdit = () => {
    setEditName(profile?.display_name || "");
    setEditBio(profile?.bio || "");
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await updateMyProfile({ display_name: editName, bio: editBio });
      setProfile((prev) => prev ? { ...prev, display_name: editName || null, bio: editBio || null } : prev);
      setEditing(false);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const [otherProfile, setOtherProfile] = useState(null);
  const [otherLoading, setOtherLoading] = useState(false);

  useEffect(() => {
    if (isMe) return;
    setOtherLoading(true);
    fetchUserPublicProfile(userId)
      .then((data) => setOtherProfile(data))
      .catch(() => {
        setOtherProfile({
          display_name: `Kullanıcı #${userId}`,
          bio: null,
          stats: { published_count: 0, total_reactions_received: 0, comment_count: 0 },
        });
      })
      .finally(() => setOtherLoading(false));
  }, [isMe, userId]);

  if (!isMe) {
    const op = otherProfile;
    return (
      <div className={styles.page}>
        <header className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← {isTR ? "Geri" : "Back"}
          </button>
        </header>
        {otherLoading ? (
          <div className={styles.loaderWrap}><span className={styles.pulse} /></div>
        ) : op ? (
          <motion.section
            className={styles.profileHero}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.avatarLarge}>
              {op.display_name ? op.display_name[0].toUpperCase() : "?"}
            </div>
            <h1 className={styles.profileName}>{op.display_name || (isTR ? "Bilinmeyen" : "Unknown")}</h1>
            {op.bio && <p className={styles.bioLine}>{op.bio}</p>}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{op.stats?.published_count ?? 0}</span>
                <span className={styles.statLabel}>{isTR ? "Paylaşım" : "Posts"}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>{op.stats?.total_reactions_received ?? 0}</span>
                <span className={styles.statLabel}>{isTR ? "Yankı" : "Echoes"}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>{op.stats?.comment_count ?? 0}</span>
                <span className={styles.statLabel}>{isTR ? "Yorum" : "Comments"}</span>
              </div>
            </div>
          </motion.section>
        ) : (
          <div className={styles.otherProfile}>
            <div className={styles.avatarLarge}>?</div>
            <p className={styles.otherText}>{isTR ? "Profil bulunamadı." : "Profile not found."}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/yanki-alani")}>
          ← {isTR ? "Akış" : "Feed"}
        </button>
      </header>

      {/* Profile hero */}
      <motion.section
        className={styles.profileHero}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.avatarLarge}>
          {profile?.display_name ? profile.display_name[0].toUpperCase() : "✦"}
        </div>

        {editing ? (
          <div className={styles.editForm}>
            <input
              className={styles.editInput}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder={isTR ? "Görünen isim" : "Display name"}
              maxLength={100}
            />
            <textarea
              className={styles.editTextarea}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder={isTR ? "Kısa niyet cümlesi..." : "Short intention..."}
              maxLength={500}
              rows={2}
            />
            <div className={styles.editActions}>
              <button className={styles.editCancel} onClick={() => setEditing(false)} disabled={saving}>
                {isTR ? "İptal" : "Cancel"}
              </button>
              <button className={styles.editSave} onClick={saveEdit} disabled={saving}>
                {saving ? "..." : isTR ? "Kaydet" : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className={styles.profileName}>
              {profile?.display_name || (isTR ? "Profilim" : "My Profile")}
            </h1>
            {profile?.bio && <p className={styles.bioLine}>{profile.bio}</p>}
            {profile?.email && <p className={styles.emailLine}>{profile.email}</p>}
            <button className={styles.editBtn} onClick={startEdit}>
              {isTR ? "Profili Düzenle" : "Edit Profile"}
            </button>
          </>
        )}

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.published_count ?? posts.length}</span>
            <span className={styles.statLabel}>{isTR ? "Paylaşım" : "Posts"}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.total_reactions_received ?? 0}</span>
            <span className={styles.statLabel}>{isTR ? "Yankı" : "Echoes"}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.comment_count ?? 0}</span>
            <span className={styles.statLabel}>{isTR ? "Yorum" : "Comments"}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{savedIds.length}</span>
            <span className={styles.statLabel}>{isTR ? "Kayıt" : "Saved"}</span>
          </div>
        </div>

        {/* Reaction breakdown */}
        {(stats.reaction_heart > 0 || stats.reaction_felt > 0 || stats.reaction_sessizce > 0) && (
          <div className={styles.reactionBreakdown}>
            <span className={styles.rbItem}>♡ {stats.reaction_heart}</span>
            <span className={styles.rbItem}>◈ {stats.reaction_felt}</span>
            <span className={styles.rbItem}>◇ {stats.reaction_sessizce}</span>
          </div>
        )}

        {/* Streak section */}
        {profile?.streak && profile.streak.current > 0 && (
          <div className={styles.streakSection}>
            <div className={styles.streakBadge}>
              <span className={styles.streakFire}>🔥</span>
              <span className={styles.streakText}>
                {profile.streak.current} {isTR ? "gün aktif" : "day streak"}
              </span>
              {profile.streak.longest > profile.streak.current && (
                <span className={styles.streakBest}>
                  ({isTR ? "en uzun" : "best"}: {profile.streak.longest})
                </span>
              )}
            </div>
            <div className={styles.milestones}>
              {[3, 7, 21].map((m) => {
                const reached = (profile.streak.longest || 0) >= m;
                const current = (profile.streak.current || 0) >= m;
                return (
                  <div
                    key={m}
                    className={`${styles.milestone} ${current ? styles.milestoneCurrent : reached ? styles.milestoneReached : ""}`}
                  >
                    <span className={styles.milestoneIcon}>
                      {m === 3 ? "✦" : m === 7 ? "◈" : "☀"}
                    </span>
                    <span className={styles.milestoneNum}>{m}</span>
                    <span className={styles.milestoneLabel}>
                      {isTR ? "gün" : "days"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.section>

      {/* Tabs */}
      <nav className={styles.tabs}>
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {isTR ? tab.label.tr : tab.label.en}
          </button>
        ))}
      </nav>

      {/* Loading */}
      {loading && (
        <div className={styles.loaderWrap}>
          <span className={styles.pulse} />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className={styles.errorWrap}>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn} onClick={loadData}>
            {isTR ? "Tekrar Dene" : "Retry"}
          </button>
        </div>
      )}

      {/* Posts list */}
      {!loading && !error && (
        <section className={styles.postList}>
          {activeTab === "saved" && (
            <p className={styles.empty}>
              {isTR ? "Kaydettiğin yankılar yakında burada olacak." : "Saved echoes will appear here soon."}
            </p>
          )}

          {activeTab === "posts" && displayPosts.length === 0 && (
            <p className={styles.empty}>
              {isTR ? "Henüz paylaşımın yok. İlk yankını bırak!" : "No posts yet. Leave your first echo!"}
            </p>
          )}

          {displayPosts.map((post, i) => {
            const pt = getPostTypeById(post.category);
            return (
              <motion.article
                key={post.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => post.status === "published" ? navigate(`/yanki-alani/${post.id}`) : null}
                style={post.status !== "published" ? { opacity: 0.55 } : {}}
              >
                <div className={styles.cardTop}>
                  <span
                    className={styles.typeBadge}
                    style={{ background: pt.color + "22", color: pt.color, borderColor: pt.color + "44" }}
                  >
                    {pt.icon} {isTR ? pt.label.tr : pt.label.en}
                  </span>
                  <span className={styles.cardTime}>{timeAgo(post.created_at, isTR)}</span>
                  {post.status !== "published" && (
                    <span className={styles.statusBadge}>
                      {post.status === "pending_review" ? (isTR ? "İnceleniyor" : "Pending") : post.status}
                    </span>
                  )}
                </div>
                {post.title && <h3 className={styles.cardTitle}>{post.title}</h3>}
                <p className={styles.cardContent}>{post.content}</p>
                <div className={styles.cardMeta}>
                  <span>♡ {post.reaction_heart}</span>
                  <span>◈ {post.reaction_felt}</span>
                  <span>◇ {post.reaction_sessizce}</span>
                  <span>💬 {post.comment_count}</span>
                </div>
              </motion.article>
            );
          })}
        </section>
      )}
    </div>
  );
}
