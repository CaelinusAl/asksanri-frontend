import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { PremiumGate } from "../components/premium/PremiumGate";
import { getPostBySlug, getCategoryById, timeAgoOkuma } from "../data/okumaData";
import { pickCtaForUser, recordCtaClick } from "../data/ctaEngine";
import { isShopierUnlocked, redirectToShopier } from "../data/shopierConfig";
import styles from "./OkumaDetayPage.module.css";

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

export default function OkumaDetayPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { isPremium, isContentUnlocked, showMicroPayModal } = usePremium();
  const isTR = language === "tr";

  const location = useLocation();
  const post = useMemo(() => getPostBySlug(slug), [slug]);
  const singleUnlocked = post ? isContentUnlocked(post.id) : false;
  const shopierOk = post ? isShopierUnlocked(`okuma_${post.id}`) : false;
  const isLocked = post?.isPremium && !isPremium && !singleUnlocked && !shopierOk;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [coverError, setCoverError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const loadedRef = useRef(false);

  const autoCta = useMemo(() => pickCtaForUser(), []);
  const handleCtaClick = useCallback(() => {
    if (autoCta) recordCtaClick(autoCta.id);
  }, [autoCta]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — SANRI Okuma Alanı`;
    const setMeta = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("og:title", post.title);
    setMeta("og:description", post.excerpt);
    setMeta("og:url", `${window.location.origin}/okuma-alani/${post.slug}`);
    if (post.coverImage) setMeta("og:image", `${window.location.origin}${post.coverImage}`);
    return () => { document.title = "SANRI"; };
  }, [post]);

  useEffect(() => {
    if (!post || loadedRef.current) return;
    loadedRef.current = true;

    fetch(`${API}/okuma/comments/${post.slug}`)
      .then((r) => r.json())
      .then((data) => { if (data.comments) setComments(data.comments); })
      .catch(() => {});

    fetch(`${API}/okuma/likes/${post.slug}`)
      .then((r) => r.json())
      .then((data) => {
        setLikesCount(data.count || 0);
        setLiked(Boolean(data.liked));
      })
      .catch(() => {});
  }, [post]);

  if (!post) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <div className={styles.notFoundTitle}>
            {isTR ? "Okuma bulunamadı" : "Reading not found"}
          </div>
          <p className={styles.notFoundText}>
            {isTR
              ? "Aradığın okuma mevcut değil veya kaldırılmış olabilir."
              : "The reading you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/okuma-alani" className={styles.notFoundLink}>
            ← {isTR ? "Okuma Alanı'na dön" : "Back to Reading Field"}
          </Link>
        </div>
      </div>
    );
  }

  const cat = getCategoryById(post.category);
  const sr = post.sanriReflection;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = newComment.trim();
    const name = authorName.trim() || (isTR ? "Anonim" : "Anonymous");
    if (!text || submitting) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem("sanri_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`${API}/okuma/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          post_slug: post.slug,
          author_name: name,
          content: text,
        }),
      });

      setComments((prev) => [
        ...prev,
        { id: Date.now(), authorName: name, content: text, createdAt: new Date().toISOString() },
      ]);
      setNewComment("");
    } catch {}
    setSubmitting(false);
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("sanri_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API}/okuma/like/${post.slug}`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      setLikesCount(data.count || 0);
      setLiked(data.liked);
    } catch {}
  };

  return (
    <div className={styles.page}>
      {/* ── Back ── */}
      <div className={styles.topBar}>
        <Link to="/okuma-alani" className={styles.backLink}>
          ← {isTR ? "Okuma Alanı" : "Reading Field"}
        </Link>
      </div>

      {/* ── Cover ── */}
      <div className={styles.coverWrap}>
        {!coverError ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className={styles.cover}
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className={styles.coverFallback}>✦</div>
        )}
      </div>

      {/* ── Article ── */}
      <motion.article
        className={styles.article}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <span
          className={styles.catBadge}
          style={{
            background: `${cat.color}18`,
            color: cat.color,
            border: `1px solid ${cat.color}30`,
          }}
        >
          {isTR ? cat.label.tr : cat.label.en}
        </span>

        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.subtitleText}>{post.subtitle}</p>

        <div className={styles.meta}>
          <button
            className={`${styles.likeBtn} ${liked ? styles.likeBtnActive : ""}`}
            onClick={handleLike}
          >
            {liked ? "❤️" : "🤍"} {likesCount}
          </button>
          <span>💬 {comments.length}</span>
          <span>{timeAgoOkuma(post.createdAt)}</span>
          <button
            className={styles.shareBtn}
            onClick={() => {
              const url = `${window.location.origin}/okuma-alani/${post.slug}`;
              if (navigator.share) {
                navigator.share({ title: post.title, text: post.excerpt, url });
              } else {
                navigator.clipboard.writeText(url).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }
            }}
          >
            {copied ? "Kopyalandı" : "Paylaş"}
          </button>
        </div>

        {/* ── Content with paragraph-level lock ── */}
        {(() => {
          const paragraphs = (post.fullContent || "").split(/\n\n+/);
          const FREE_PARAGRAPHS = 2;
          const showFull = !isLocked;

          if (showFull) {
            return (
              <>
                <div className={styles.content}>{post.fullContent}</div>

                {post.codeLayer && (
                  <div className={styles.codeLayerWrap}>
                    <div className={styles.codeLayerHeader}>
                      <span className={styles.codeLayerIcon}>⟁</span>
                      <span className={styles.codeLayerTitle}>
                        {isTR ? "Kod Çözümleme" : "Code Decryption"}
                      </span>
                    </div>
                    <div className={styles.codeLayerText}>{post.codeLayer}</div>
                  </div>
                )}

                {sr && (
                  <motion.div
                    className={styles.sanriWrap}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className={styles.sanriHeader}>
                      <span className={styles.sanriGlyph}>✦</span>
                      <span className={styles.sanriLabel}>
                        {isTR ? "Sanrı Yansıması" : "Sanri Reflection"}
                      </span>
                    </div>
                    <p className={styles.sanriAnalysis}>{sr.analysis}</p>
                    <p className={styles.sanriStrong}>{sr.strongLine}</p>
                    <p className={styles.sanriQuestion}>{sr.question}</p>
                  </motion.div>
                )}
              </>
            );
          }

          const freePart = paragraphs.slice(0, FREE_PARAGRAPHS).join("\n\n");
          const lockedPart = paragraphs.slice(FREE_PARAGRAPHS, FREE_PARAGRAPHS + 3).join("\n\n");

          return (
            <>
              <div className={styles.content}>{freePart}</div>

              <div className={styles.lockZone}>
                <div className={styles.lockZoneBlur}>
                  <div className={styles.content}>{lockedPart}</div>
                </div>
                <div className={styles.lockZoneGradient} />
                <div className={styles.lockZoneOverlay}>
                  <div className={styles.lockZoneIcon}>🔒</div>
                  <p className={styles.lockZoneLine1}>
                    {isTR ? "Buraya kadar gördün." : "You've seen this far."}
                  </p>
                  <p className={styles.lockZoneLine2}>
                    {isTR
                      ? "Ama asıl katman burada başlar."
                      : "But the real layer begins here."}
                  </p>
                  <button
                    className={styles.lockZoneBtn}
                    onClick={() =>
                      redirectToShopier("okuma_devami", `okuma_${post.id}`, location.pathname)
                    }
                  >
                    {isTR ? "Devamını Aç — 9.90₺" : "Unlock — ₺9.90"}
                  </button>
                  <button
                    className={styles.lockZoneAlt}
                    onClick={() =>
                      redirectToShopier("okuma_devami", `okuma_${post.id}`, location.pathname)
                    }
                  >
                    {isTR ? "Satın Al ve Kapıyı Aç" : "Purchase & Unlock"}
                  </button>
                </div>
              </div>
            </>
          );
        })()}

        {/* ── Auto CTA (locked users) ── */}
        {isLocked && autoCta && (
          <motion.div
            className={styles.autoCta}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <p className={styles.autoCtaText}>{autoCta.text}</p>
            <div className={styles.autoCtaActions}>
              <button
                className={styles.microPayBtn}
                onClick={() => redirectToShopier("okuma_devami", `okuma_${post.id}`, location.pathname)}
              >
                {isTR ? "Satın Al ve Kapıyı Aç" : "Purchase & Unlock"}
              </button>
              <Link
                to="/subscription"
                className={styles.autoCtaBtn}
                onClick={handleCtaClick}
              >
                {isTR ? "Tüm İçerikler İçin Premium" : "Full Premium Access"}
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Deeper CTA (unlocked users) ── */}
        {!isLocked && (
          <div className={styles.deeperCta}>
            {autoCta && (
              <p className={styles.autoCtaHint}>{autoCta.text}</p>
            )}
            <p className={styles.deeperText}>
              {isTR
                ? "Bu okuma sende ne açtı? Devam et."
                : "What did this reading open in you? Go deeper."}
            </p>
            <div className={styles.deeperLinks}>
              <Link to="/sanri" className={styles.deeperBtn}>
                {isTR ? "Sanrı'ya Sor" : "Ask Sanri"}
              </Link>
              <Link to="/yanki-alani/yeni" className={styles.deeperBtn}>
                {isTR ? "Yankı Bırak" : "Leave an Echo"}
              </Link>
              <Link to="/frekans-alani" className={styles.deeperBtn}>
                {isTR ? "Frekans Alanı" : "Frequency Field"}
              </Link>
            </div>
          </div>
        )}

        {/* ── Divider ── */}
        <div className={styles.divider} />

        {/* ── Comments ── */}
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>
            {isTR ? `Yorumlar (${comments.length})` : `Comments (${comments.length})`}
          </h2>

          {comments.map((c) => (
            <div key={c.id} className={styles.commentCard}>
              <div className={styles.commentHeader}>
                <div className={styles.commentAvatar}>
                  {c.authorName.charAt(0).toUpperCase()}
                </div>
                <span className={styles.commentAuthor}>{c.authorName}</span>
                <span className={styles.commentTime}>{timeAgoOkuma(c.createdAt)}</span>
              </div>
              <p className={styles.commentText}>{c.content}</p>
            </div>
          ))}

          {/* ── Comment Form ── */}
          <form className={styles.commentForm} onSubmit={handleSubmit}>
            <textarea
              className={styles.commentInput}
              placeholder={isTR ? "Düşünceni paylaş..." : "Share your thoughts..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className={styles.commentFormRow}>
              <input
                type="text"
                className={styles.nameInput}
                placeholder={isTR ? "İsmin (opsiyonel)" : "Your name (optional)"}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? (isTR ? "Gönderiliyor..." : "Sending...") : (isTR ? "Gönder" : "Send")}
              </button>
            </div>
          </form>
        </div>

        {/* ── Sanrı CTA (after everything) ── */}
        {!isLocked && sr && (
          <div className={styles.sanriCta}>
            <p className={styles.sanriCtaText}>
              {isTR
                ? "Bu okuma sende bir soru uyandırdıysa — Sanrı dinliyor."
                : "If this reading sparked a question in you — Sanri is listening."}
            </p>
            <Link to={`/sanri?q=${encodeURIComponent(sr.question)}`} className={styles.sanriCtaBtn}>
              {isTR ? "Sanrı'ya Taşı" : "Carry to Sanri"}
            </Link>
          </div>
        )}
      </motion.article>
    </div>
  );
}
