import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { POST_TYPES } from "../data/yankiData";
import { createPost, fetchMyPosts, fetchMyProfile, isLoggedIn } from "../data/yankiApi";
import styles from "./YankiYeniPage.module.css";

const ROTATING_PLACEHOLDERS = [
  { tr: "Bugün içinde ne yankılandı?", en: "What echoed inside you today?" },
  { tr: "Kalbinden geçen ama söylemediğin ne var?", en: "What's in your heart but left unsaid?" },
  { tr: "Bir rüya, bir işaret, bir farkındalık bırak…", en: "Leave a dream, a sign, an awareness…" },
  { tr: "Şu an içinden geçen en gerçek cümle ne?", en: "What's the truest sentence passing through you?" },
  { tr: "Bugün sende ne açıldı?", en: "What opened in you today?" },
];

const TYPE_PLACEHOLDERS = {
  duygu: { tr: "İçinden geçeni yaz...", en: "Write what you feel..." },
  farkindalik: { tr: "Bugün neyi fark ettin?", en: "What did you notice today?" },
  ruya: { tr: "Rüyanı anlat...", en: "Describe your dream..." },
  isaret: { tr: "Gördüğün işareti paylaş...", en: "Share the sign you saw..." },
  soru: { tr: "Topluluğa bir soru sor...", en: "Ask the community..." },
  gunluk: { tr: "Kısa bir akış bırak...", en: "Leave a short flow..." },
  sesli: { tr: "Sesli yankın hakkında yaz...", en: "Write about your voice note..." },
  gorsel: { tr: "Görselin hakkında yaz...", en: "Write about your visual..." },
};

export default function YankiYeniPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const [selectedType, setSelectedType] = useState("duygu");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isFirstPost, setIsFirstPost] = useState(false);
  const [newPostId, setNewPostId] = useState(null);
  const [streakCount, setStreakCount] = useState(0);
  const [error, setError] = useState(null);

  const [rotIdx, setRotIdx] = useState(() => Math.floor(Math.random() * ROTATING_PLACEHOLDERS.length));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused || content.length > 0) return;
    const timer = setInterval(() => {
      setRotIdx((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isFocused, content.length]);

  const placeholder = content.length === 0 && !isFocused
    ? ROTATING_PLACEHOLDERS[rotIdx]
    : (TYPE_PLACEHOLDERS[selectedType] || TYPE_PLACEHOLDERS.duygu);

  const canSubmit = content.trim().length >= 10 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (!isLoggedIn()) {
      navigate("/giris", { state: { from: location.pathname } });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await createPost({
        content: content.trim(),
        title: title.trim() || null,
        category: selectedType,
        anonymous,
      });
      setNewPostId(res.post_id);

      let first = false;
      try {
        const my = await fetchMyPosts({ limit: 2 });
        first = (my.total || 0) <= 1;
      } catch { /* ignore */ }
      setIsFirstPost(first);

      try {
        const prof = await fetchMyProfile();
        setStreakCount(prof?.streak?.current || 0);
      } catch { /* ignore */ }

      setSubmitting(false);
      setSuccess(true);
    } catch (err) {
      console.error("[YankiYeni] post error:", err, "status:", err?.status, "body:", err?.body);
      setSubmitting(false);
      if (err.status === 401) {
        navigate("/giris", { state: { from: location.pathname } });
        return;
      }
      const detail = err.body?.detail || err.message || "";
      setError(detail || (isTR ? "Gönderilemedi. Tekrar dene." : "Failed to send. Try again."));
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/yanki")}>
          ← {isTR ? "Akış" : "Feed"}
        </button>
        <h2 className={styles.pageTitle}>{isTR ? "Yeni Yankı" : "New Echo"}</h2>
        <div style={{ width: 60 }} />
      </header>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            className={styles.successWrap}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.successGlow} />
            <span className={styles.successIcon}>✦</span>

            {isFirstPost ? (
              <>
                <p className={styles.successTitle}>
                  {isTR ? "İlk yankını bıraktın" : "You left your first echo"}
                </p>
                <p className={styles.successSub}>
                  {isTR ? "Bu alan artık seni de taşıyor." : "This space now carries you too."}
                </p>
              </>
            ) : (
              <p className={styles.successTitle}>
                {isTR ? "Yankın bırakıldı." : "Your echo has been left."}
              </p>
            )}

            {streakCount > 0 && (
              <div className={styles.streakMsg}>
                <span className={styles.streakMsgFire}>🔥</span>
                <span className={styles.streakMsgText}>
                  {isTR
                    ? `${streakCount} gün aktif — streak devam ediyor`
                    : `${streakCount} day streak — keep going`}
                </span>
                {[3, 7, 21].includes(streakCount) && (
                  <span className={styles.streakMsgMilestone}>
                    {streakCount === 3
                      ? (isTR ? "✦ İlk adım" : "✦ First step")
                      : streakCount === 7
                        ? (isTR ? "◈ Haftalık güç" : "◈ Weekly power")
                        : (isTR ? "☀ 21 gün — alışkanlık oluştu" : "☀ 21 days — habit formed")}
                  </span>
                )}
              </div>
            )}

            <div className={styles.postActions}>
              <button
                className={styles.postActionBtn}
                onClick={() => navigate(`/yanki/post/${newPostId}`)}
              >
                <span className={styles.postActionIcon}>💬</span>
                <span>{isTR ? "Yorumları gör" : "See comments"}</span>
              </button>
              <button
                className={`${styles.postActionBtn} ${styles.postActionSanri}`}
                onClick={() => navigate(`/yanki/post/${newPostId}?sanri=1`)}
              >
                <span className={styles.postActionIcon}>✦</span>
                <span>{isTR ? "Sanrı'ya taşı" : "Send to Sanri"}</span>
              </button>
              <button
                className={styles.postActionBtn}
                onClick={() => {
                  setSuccess(false);
                  setContent("");
                  setTitle("");
                  setNewPostId(null);
                  setIsFirstPost(false);
                }}
              >
                <span className={styles.postActionIcon}>+</span>
                <span>{isTR ? "Yeni yankı bırak" : "New echo"}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className={styles.formWrap}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Type selector */}
            <label className={styles.sectionLabel}>{isTR ? "Yankı Türü" : "Echo Type"}</label>
            <div className={styles.typeGrid}>
              {POST_TYPES.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.typePill} ${selectedType === t.id ? styles.typePillActive : ""}`}
                  style={
                    selectedType === t.id
                      ? { borderColor: t.color, color: t.color, background: t.color + "14" }
                      : {}
                  }
                  onClick={() => setSelectedType(t.id)}
                >
                  <span className={styles.pillIcon}>{t.icon}</span>
                  {isTR ? t.label.tr : t.label.en}
                </button>
              ))}
            </div>

            {/* Title */}
            <label className={styles.sectionLabel}>
              {isTR ? "Başlık" : "Title"}{" "}
              <span className={styles.optional}>({isTR ? "opsiyonel" : "optional"})</span>
            </label>
            <input
              type="text"
              className={styles.titleInput}
              placeholder={isTR ? "Kısa bir başlık..." : "Short title..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
            />

            {/* Content */}
            <label className={styles.sectionLabel}>{isTR ? "İçerik" : "Content"}</label>
            <textarea
              className={styles.contentArea}
              placeholder={isTR ? placeholder.tr : placeholder.en}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={6}
              maxLength={2000}
            />
            <div className={styles.charRow}>
              <span className={styles.charCount}>{content.length}/2000</span>
              {content.trim().length > 0 && content.trim().length < 10 && (
                <span className={styles.charWarn}>{isTR ? "En az 10 karakter" : "Min 10 chars"}</span>
              )}
            </div>

            {/* Media placeholders */}
            <div className={styles.mediaRow}>
              <button className={styles.mediaBtn} disabled>
                🖼 {isTR ? "Görsel Ekle" : "Add Image"}
              </button>
              <button className={styles.mediaBtn} disabled>
                🎙 {isTR ? "Ses Kaydet" : "Record Audio"}
              </button>
            </div>

            {/* Anonymous toggle */}
            <label className={styles.anonToggle}>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className={styles.anonCheck}
              />
              <span className={styles.anonLabel}>
                {isTR ? "Anonim olarak paylaş" : "Share anonymously"}
              </span>
            </label>

            {/* Error */}
            {error && <p className={styles.errorText}>{error}</p>}

            {/* Submit */}
            <button
              className={styles.submitBtn}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {submitting
                ? (isTR ? "Gönderiliyor..." : "Sending...")
                : (isTR ? "Yankıyı Bırak" : "Leave Echo")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
