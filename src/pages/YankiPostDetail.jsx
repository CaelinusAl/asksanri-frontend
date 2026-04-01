import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { getPostTypeById, timeAgo } from "../data/yankiData";
import {
  fetchPostById,
  fetchComments,
  fetchReflections,
  addComment,
  reactToPost,
  fetchMyReactions,
  askSanriReflection,
  reportPost,
  isLoggedIn,
} from "../data/yankiApi";
import styles from "./YankiPostDetail.module.css";

const REPORT_REASONS = [
  { id: "spam", label: { tr: "Spam / Reklam", en: "Spam / Advertising" } },
  { id: "offensive", label: { tr: "Hakaret / Saldırgan", en: "Offensive / Abusive" } },
  { id: "irrelevant", label: { tr: "Konuyla ilgisiz", en: "Off-topic" } },
  { id: "harmful", label: { tr: "Zararlı içerik", en: "Harmful content" } },
  { id: "other", label: { tr: "Diğer", en: "Other" } },
];

function normalizePost(p) {
  return {
    id: p.id,
    author_mode: p.author_mode || p.authorMode || "anonymous",
    author_name: p.author_name || null,
    title: p.title || null,
    content: p.content || p.content_sanitized || "",
    category: p.category || p.type || "genel",
    image_url: p.image_url || null,
    audio_url: p.audio_url || null,
    sanri_note: p.sanri_note || null,
    reaction_heart: p.reaction_heart ?? 0,
    reaction_felt: p.reaction_felt ?? 0,
    reaction_sessizce: p.reaction_sessizce ?? 0,
    comment_count: p.comment_count ?? 0,
    created_at: p.created_at || null,
  };
}

function parseStructuredReflection(text) {
  if (!text) return null;
  const sections = {};
  const yansimaMatch = text.match(/YANSIMA:\s*([\s\S]*?)(?=\n\nDERİNLİK:|$)/i);
  const derinlikMatch = text.match(/DERİNLİK:\s*([\s\S]*?)(?=\n\nSORU:|$)/i);
  const soruMatch = text.match(/SORU:\s*([\s\S]*?)$/i);

  if (yansimaMatch || derinlikMatch || soruMatch) {
    sections.yansima = yansimaMatch ? yansimaMatch[1].trim() : null;
    sections.derinlik = derinlikMatch ? derinlikMatch[1].trim() : null;
    sections.soru = soruMatch ? soruMatch[1].trim() : null;
    sections.isStructured = true;
  } else {
    sections.yansima = text;
    sections.isStructured = false;
  }
  return sections;
}

export default function YankiPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isTR = language === "tr";

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [sanriCopied, setSanriCopied] = useState(false);
  const [postCopied, setPostCopied] = useState(false);

  const SAVED_KEY = "sanri_yanki_saved";
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]").includes(Number(id) || id); }
    catch { return false; }
  });

  const [sanriReflection, setSanriReflection] = useState(null);
  const [sanriLoading, setSanriLoading] = useState(false);

  const [myReactions, setMyReactions] = useState(new Set());
  const [popAnim, setPopAnim] = useState(null);

  // Report modal state
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postData, commentsData] = await Promise.all([
        fetchPostById(id),
        fetchComments(id).catch(() => ({ comments: [], total: 0 })),
      ]);
      setPost(normalizePost(postData));
      setComments(commentsData.comments || []);

      try {
        const reflData = await fetchReflections(id);
        if (reflData.reflections && reflData.reflections.length > 0) {
          setSanriReflection(reflData.reflections[0].response);
        }
      } catch { /* no cached reflection */ }

      if (isLoggedIn()) {
        try {
          const rData = await fetchMyReactions([Number(id)]);
          const types = rData.reactions?.[id] || [];
          setMyReactions(new Set(types));
        } catch { /* silent */ }
      }
    } catch (err) {
      console.error("[YankiDetail] load error:", err);
      if (err.status === 404) setPost(null);
      else setError(isTR ? "Yüklenirken hata oluştu." : "Failed to load.");
    }
    setLoading(false);
  }, [id, isTR]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (searchParams.get("sanri") === "1" && post && !sanriReflection && !sanriLoading) {
      handleSanri();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const handleReact = async (type) => {
    if (!isLoggedIn()) { navigate("/giris"); return; }
    const wasActive = myReactions.has(type);
    const delta = wasActive ? -1 : 1;
    const col = type === "kalbime_dokundu" ? "reaction_heart"
      : type === "ben_de_hissettim" ? "reaction_felt"
      : "reaction_sessizce";

    setPost((p) => p ? { ...p, [col]: Math.max((p[col] || 0) + delta, 0) } : p);
    setMyReactions((prev) => {
      const next = new Set(prev);
      if (wasActive) next.delete(type); else next.add(type);
      return next;
    });

    if (!wasActive) {
      setPopAnim(type);
      setTimeout(() => setPopAnim(null), 500);
    }

    try {
      await reactToPost(id, type);
    } catch (err) {
      setPost((p) => p ? { ...p, [col]: Math.max((p[col] || 0) - delta, 0) } : p);
      setMyReactions((prev) => {
        const next = new Set(prev);
        if (wasActive) next.add(type); else next.delete(type);
        return next;
      });
      if (err.status === 401) navigate("/giris");
    }
  };

  const handleSave = () => {
    try {
      const ids = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      const postId = Number(id) || id;
      const idx = ids.indexOf(postId);
      if (idx >= 0) ids.splice(idx, 1); else ids.push(postId);
      localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
      setSaved(!saved);
    } catch { /* noop */ }
  };

  const handleSanri = async () => {
    if (!post || sanriLoading || sanriReflection) return;
    if (!isLoggedIn()) { navigate("/giris"); return; }
    setSanriLoading(true);
    try {
      const data = await askSanriReflection(post.id, post.content);
      setSanriReflection(data.response);
    } catch (err) {
      if (err.status === 401) navigate("/giris");
      else setSanriReflection(isTR ? "Yansıma alınamadı." : "Reflection unavailable.");
    }
    setSanriLoading(false);
  };

  const submitComment = async () => {
    const text = newComment.trim();
    if (!text || !post || commentSubmitting) return;
    if (!isLoggedIn()) { navigate("/giris"); return; }
    setCommentSubmitting(true);
    try {
      const result = await addComment(post.id, text);
      if (result.comment) setComments((prev) => [...prev, result.comment]);
      setNewComment("");
      setPost((p) => p ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p);
    } catch (err) {
      if (err.status === 401) navigate("/giris");
    }
    setCommentSubmitting(false);
  };

  const handleSharePost = async () => {
    if (!post) return;
    const shareUrl = `${window.location.origin}/yanki/${id}${user?.id ? `?ref=${user.id}` : ""}`;
    let text = "";
    if (post.title) text += `${post.title}\n\n`;
    text += post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content;
    text += `\n\n— Yankı Alanı\n${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: post.title || "Yankı", text, url: shareUrl });
        return;
      } catch { /* fallback to clipboard */ }
    }
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    setPostCopied(true);
    setTimeout(() => setPostCopied(false), 2500);
  };

  const buildSanriShareText = () => {
    const parsed = parseStructuredReflection(sanriReflection);
    let text = "✦ SANRI YANSIMASI\n\n";
    if (parsed?.isStructured) {
      if (parsed.yansima) text += `${parsed.yansima}\n`;
      if (parsed.derinlik) text += `\n${parsed.derinlik}\n`;
      if (parsed.soru) text += `\n❝ ${parsed.soru} ❞\n`;
    } else {
      text += (sanriReflection || "") + "\n";
    }
    const shareUrl = `${window.location.origin}/yanki/${id}${user?.id ? `?ref=${user.id}` : ""}`;
    text += `\n— Sanrı • Yankı Alanı\n${shareUrl}`;
    return { text, url: shareUrl };
  };

  const handleShareSanri = async () => {
    const { text, url } = buildSanriShareText();

    if (navigator.share) {
      try {
        await navigator.share({ title: "Sanrı Yansıması", text, url });
        return;
      } catch { /* fallback */ }
    }
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    setSanriCopied(true);
    setTimeout(() => setSanriCopied(false), 2500);
  };

  const handleReport = async () => {
    if (!reportReason || reportSending) return;
    if (!isLoggedIn()) { navigate("/giris"); return; }
    setReportSending(true);
    try {
      await reportPost(post.id, reportReason);
      setReportDone(true);
      setTimeout(() => { setShowReport(false); setReportDone(false); setReportReason(""); }, 2000);
    } catch (err) {
      if (err.status === 401) navigate("/giris");
    }
    setReportSending(false);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loaderWrap}><span className={styles.pulse} /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>{error}</p>
        <button className={styles.backLink} onClick={() => load()}>
          {isTR ? "Tekrar Dene" : "Retry"}
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>{isTR ? "Yankı bulunamadı." : "Echo not found."}</p>
        <button className={styles.backLink} onClick={() => navigate("/yanki-alani")}>
          ← {isTR ? "Akışa Dön" : "Back to Feed"}
        </button>
      </div>
    );
  }

  const pt = getPostTypeById(post.category);
  const reflParsed = parseStructuredReflection(sanriReflection);

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/yanki-alani")}>
          ← {isTR ? "Akış" : "Feed"}
        </button>
      </header>

      {/* Main post */}
      <motion.article
        className={styles.postCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.authorRow}>
          <span className={styles.avatar} style={{ background: pt.color + "33", color: pt.color }}>
            {post.author_mode === "anonymous" ? "?" : (post.author_name || "?")[0]}
          </span>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>
              {post.author_mode === "anonymous"
                ? (isTR ? "Anonim" : "Anonymous")
                : (post.author_name || (isTR ? "Anonim" : "Anonymous"))}
            </span>
          </div>
          <span className={styles.typeBadge} style={{ background: pt.color + "22", color: pt.color, borderColor: pt.color + "44" }}>
            {pt.icon} {isTR ? pt.label.tr : pt.label.en}
          </span>
        </div>

        <span className={styles.time}>{timeAgo(post.created_at, isTR)}</span>

        {post.title && <h2 className={styles.postTitle}>{post.title}</h2>}
        <p className={styles.postContent}>{post.content}</p>

        {post.sanri_note && (
          <div className={styles.sanriNote}>
            <span className={styles.sanriIcon}>✦</span>
            <div>
              <span className={styles.sanriLabel}>Sanrı</span>
              <p className={styles.sanriText}>{post.sanri_note}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          {[
            { type: "kalbime_dokundu", icon: "♡", iconActive: "♥", col: "reaction_heart", tr: "Yankı Ver", en: "Echo", cls: "heart" },
            { type: "ben_de_hissettim", icon: "◈", iconActive: "◆", col: "reaction_felt", tr: "Bende Açıldı", en: "Felt it", cls: "felt" },
            { type: "sessizce_aldim", icon: "◇", iconActive: "◆", col: "reaction_sessizce", tr: "Sessizce Aldım", en: "Received Silently", cls: "silent" },
          ].map((rx) => {
            const active = myReactions.has(rx.type);
            const popping = popAnim === rx.type;
            return (
              <button
                key={rx.type}
                className={`${styles.reactBtn} ${active ? styles[`reactActive_${rx.cls}`] : ""} ${popping ? styles.reactPop : ""}`}
                onClick={() => handleReact(rx.type)}
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
          <button
            className={`${styles.actionBtn} ${saved ? styles.actionSaved : ""}`}
            onClick={handleSave}
          >
            {saved ? "★" : "☆"} <span>{isTR ? "Sakla" : "Save"}</span>
          </button>
          <button
            className={`${styles.shareBtn} ${postCopied ? styles.shareBtnCopied : ""}`}
            onClick={handleSharePost}
          >
            {postCopied
              ? (isTR ? "✓ Kopyalandı" : "✓ Copied")
              : (isTR ? "⤴ Paylaş" : "⤴ Share")}
          </button>
          <button className={styles.reportBtn} onClick={() => setShowReport(true)}>
            ⚑
          </button>
          <button
            className={`${styles.sanriBtn} ${sanriReflection ? styles.sanriBtnDone : ""}`}
            onClick={handleSanri}
            disabled={sanriLoading}
          >
            {sanriLoading
              ? (isTR ? "✦ Yansıtılıyor..." : "✦ Reflecting...")
              : sanriReflection
                ? (isTR ? "✦ Yansıma Hazır" : "✦ Reflection Ready")
                : (isTR ? "✦ Sanrı'ya Taşı" : "✦ Send to Sanri")}
          </button>
        </div>
      </motion.article>

      {/* ── Sanrı Yansıması (structured) ── */}
      {(sanriReflection || sanriLoading) && (
        <motion.div
          className={styles.reflectionCard}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.reflectionHeader}>
            <span className={styles.reflectionGlyph}>✦</span>
            <span className={styles.reflectionLabel}>SANRI YANSIMASI</span>
            {sanriReflection && !sanriLoading && (
              <button
                className={`${styles.reflShareBtn} ${sanriCopied ? styles.reflShareCopied : ""}`}
                onClick={handleShareSanri}
                title={isTR ? "Yansımayı Paylaş" : "Share Reflection"}
              >
                {sanriCopied ? (isTR ? "✓ Kopyalandı" : "✓ Copied") : (isTR ? "⤴ Paylaş" : "⤴ Share")}
              </button>
            )}
          </div>
          {sanriLoading ? (
            <div className={styles.reflectionLoading}>
              <span className={styles.reflectionPulse} />
              <span>{isTR ? "Yansıma oluşturuluyor..." : "Creating reflection..."}</span>
            </div>
          ) : reflParsed?.isStructured ? (
            <div className={styles.reflectionSections}>
              {reflParsed.yansima && (
                <div className={styles.reflSection}>
                  <span className={styles.reflSectionIcon}>◈</span>
                  <p className={styles.reflSectionText}>{reflParsed.yansima}</p>
                </div>
              )}
              {reflParsed.derinlik && (
                <div className={styles.reflSection}>
                  <span className={styles.reflSectionIcon}>◆</span>
                  <p className={styles.reflSectionDeep}>{reflParsed.derinlik}</p>
                </div>
              )}
              {reflParsed.soru && (
                <div className={styles.reflQuestion}>
                  <span className={styles.reflQuestionIcon}>?</span>
                  <p className={styles.reflQuestionText}>{reflParsed.soru}</p>
                </div>
              )}
            </div>
          ) : (
            <p className={styles.reflectionText}>{sanriReflection}</p>
          )}
          {sanriReflection && !sanriLoading && (
            <div className={styles.reflCardFooter}>
              <span className={styles.reflCardBrand}>SANRI • Yankı Alanı</span>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Report Modal ── */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            className={styles.reportOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !reportSending && setShowReport(false)}
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
                  <div className={styles.reportActions}>
                    <button
                      className={styles.reportCancelBtn}
                      onClick={() => setShowReport(false)}
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

      {/* Comments */}
      <section className={styles.commentsSection}>
        <h3 className={styles.commentsTitle}>
          💬 {isTR ? "Yorumlar" : "Comments"} ({comments.length})
        </h3>

        <div className={styles.commentsList}>
          {comments.map((c, i) => (
            <motion.div
              key={c.id}
              className={styles.comment}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <span className={styles.commentAvatar}>
                {(c.author_name || c.author?.name || "?")[0]}
              </span>
              <div className={styles.commentBody}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentAuthor}>{c.author_name || c.author?.name || (isTR ? "Anonim" : "Anonymous")}</span>
                  <span className={styles.commentTime}>{timeAgo(c.created_at || c.createdAt, isTR)}</span>
                </div>
                <p className={styles.commentText}>{c.content}</p>
              </div>
            </motion.div>
          ))}

          {comments.length === 0 && (
            <p className={styles.noComments}>
              {isTR ? "İlk yorumu sen yaz." : "Be the first to comment."}
            </p>
          )}
        </div>

        <div className={styles.commentInput}>
          <input
            type="text"
            className={styles.commentField}
            placeholder={isTR ? "Yankını bırak..." : "Leave your echo..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitComment()}
            disabled={commentSubmitting}
          />
          <button
            className={styles.commentSubmit}
            disabled={!newComment.trim() || commentSubmitting}
            onClick={submitComment}
          >
            {commentSubmitting ? "..." : "→"}
          </button>
        </div>
      </section>
    </div>
  );
}
