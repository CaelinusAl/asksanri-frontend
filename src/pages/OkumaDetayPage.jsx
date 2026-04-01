import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { PremiumGate } from "../components/premium/PremiumGate";
import { getPostBySlug, getCommentsByPostId, getCategoryById, timeAgoOkuma } from "../data/okumaData";
import styles from "./OkumaDetayPage.module.css";

export default function OkumaDetayPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { isPremium } = usePremium();
  const isTR = language === "tr";

  const post = useMemo(() => getPostBySlug(slug), [slug]);
  const isLocked = post?.isPremium && !isPremium;

  const [comments, setComments] = useState(() =>
    post ? getCommentsByPostId(post.id) : []
  );
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [coverError, setCoverError] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = newComment.trim();
    const name = authorName.trim() || (isTR ? "Anonim" : "Anonymous");
    if (!text) return;

    const comment = {
      id: Date.now(),
      authorName: name,
      content: text,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
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
          <span>💬 {comments.length}</span>
          <span>👁 {post.viewCount}</span>
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

        {/* ── Preview or Full Content ── */}
        {isLocked && post.previewContent && (
          <div className={styles.content}>{post.previewContent}</div>
        )}

        <PremiumGate
          locked={isLocked}
          title={isTR ? "Bu okuma premium" : "This reading is premium"}
          description={isTR
            ? "Tam içeriğe, kod çözümlemeye ve Sanrı yansımasına erişmek için Premium'a geç."
            : "Upgrade to Premium to access the full content, code decryption, and Sanri reflection."}
        >
          {!isLocked && <div className={styles.content}>{post.fullContent}</div>}

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
        </PremiumGate>

        {/* ── Deeper CTA ── */}
        {!isLocked && (
          <div className={styles.deeperCta}>
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
                disabled={!newComment.trim()}
              >
                {isTR ? "Gönder" : "Send"}
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
