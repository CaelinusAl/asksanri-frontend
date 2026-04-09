import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { useAdmin } from "../contexts/AdminContext";
import { getPostBySlug, getCategoryById, timeAgoOkuma, getCommentsByPostId } from "../data/okumaData";
import { trackFunnelEvent } from "../data/funnelTracker";
import { markOkumaSeen, OKUMA_EARLY_PAYWALL_MARKER } from "../data/okumaSeen";
import { putContentSnapshot, putEntitlement } from "../lib/offline/contentArchive";
import { pickCtaForUser, recordCtaClick } from "../data/ctaEngine";
import { isShopierUnlocked, redirectToShopier } from "../data/shopierConfig";
import { EmailCaptureInline } from "../components/EmailCaptureModal";
import BankTransferLink from "../components/BankTransferLink";
import SeoHead from "../components/SeoHead";
import styles from "./OkumaDetayPage.module.css";

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

function normalizeOkumaComments(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((c, i) => {
    const name = String(c?.authorName ?? c?.author_name ?? "").trim() || "Anonim";
    return {
      id: c?.id ?? `c-${i}`,
      authorName: name,
      content: String(c?.content ?? ""),
      createdAt: c?.createdAt ?? c?.created_at ?? "",
    };
  });
}

export default function OkumaDetayPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { isPremium, isContentUnlocked, showMicroPayModal } = usePremium();
  const { isAdmin } = useAdmin();
  const isTR = language === "tr";

  const location = useLocation();
  const post = useMemo(() => getPostBySlug(slug), [slug]);
  const singleUnlocked = post
    ? isContentUnlocked(post.id) || isContentUnlocked(`okuma_${post.id}`)
    : false;
  const shopierOk = post ? isShopierUnlocked(`okuma_${post.id}`) : false;
  const isLocked = post?.isPremium && !isPremium && !isAdmin && !singleUnlocked && !shopierOk;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [coverError, setCoverError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const loadedRef = useRef(false);
  const [activeReaders, setActiveReaders] = useState(() => Math.floor(Math.random() * 5) + 2);
  const arRef = useRef(activeReaders);

  useEffect(() => {
    const t = setInterval(() => {
      const d = Math.random() > 0.5 ? 1 : -1;
      arRef.current = Math.max(1, Math.min(14, arRef.current + d));
      setActiveReaders(arRef.current);
    }, 9000 + Math.random() * 6000);
    return () => clearInterval(t);
  }, []);

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

    const setNameMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setNameMeta("description", post.excerpt);
    setNameMeta("keywords", `${post.title}, SANRI, numeroloji, sembolik analiz, bilinç, frekans, anlam zekası`);

    let ldScript = document.getElementById("sanri-article-ld");
    if (!ldScript) { ldScript = document.createElement("script"); ldScript.id = "sanri-article-ld"; ldScript.type = "application/ld+json"; document.head.appendChild(ldScript); }
    ldScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt,
      "url": `${window.location.origin}/okuma-alani/${post.slug}`,
      "image": post.coverImage ? `${window.location.origin}${post.coverImage}` : undefined,
      "datePublished": post.createdAt,
      "author": { "@type": "Organization", "name": "SANRI", "url": "https://asksanri.com" },
      "publisher": { "@type": "Organization", "name": "SANRI", "url": "https://asksanri.com" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${window.location.origin}/okuma-alani/${post.slug}` },
    });

    return () => {
      document.title = "SANRI";
      const ld = document.getElementById("sanri-article-ld");
      if (ld?.isConnected) {
        try {
          ld.remove();
        } catch {
          /* eklenti / çeviri DOM'u oynattıysa removeChild patlamasın */
        }
      }
    };
  }, [post]);

  useEffect(() => {
    if (!post) return;
    markOkumaSeen(post.slug);
  }, [post]);

  useEffect(() => {
    if (!post || isLocked) return;
    const body = JSON.stringify({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      categoryId: post.categoryId,
      isPremium: post.isPremium,
      createdAt: post.createdAt,
    });
    putContentSnapshot(post.slug, {
      title: post.title,
      body,
      meta: { source: "bundle", version: 1 },
    }).catch(() => {});
    putEntitlement(`okuma_${post.id}`, { slug: post.slug, unlocked: true, at: Date.now() }).catch(() => {});
  }, [post, isLocked]);

  useEffect(() => {
    loadedRef.current = false;
    setComments([]);
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    trackFunnelEvent("okuma_detail_view", post.slug);
  }, [post]);

  useEffect(() => {
    if (!post || loadedRef.current) return;
    loadedRef.current = true;

    fetch(`${API}/okuma/comments/${post.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.comments) setComments(normalizeOkumaComments(data.comments));
      })
      .catch(() => {});

    fetch(`${API}/okuma/likes/${post.slug}`)
      .then((r) => r.json())
      .then((data) => {
        setLikesCount(data.count || 0);
        setLiked(Boolean(data.liked));
      })
      .catch(() => {});

    fetch(`${API}/okuma/view/${post.slug}`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => { if (data.count != null) setViewsCount(data.count); })
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
      <SeoHead
        title={post.title}
        description={post.excerpt || post.title}
        path={`/okuma-alani/${post.slug}`}
        ogImage={post.coverImage}
        ogType="article"
      />
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
      <article className={styles.article}>
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

        <div className={styles.liveBar}>
          <span className={styles.liveDot} />
          <span className={styles.liveText}>
            {activeReaders} {isTR ? "kişi şu an okuyor" : "reading now"}
          </span>
        </div>

        <div className={styles.meta}>
          <button
            type="button"
            className={`${styles.likeBtn} ${liked ? styles.likeBtnActive : ""}`}
            onClick={handleLike}
          >
            <span className={styles.likeEmoji}>{liked ? "❤️" : "🤍"}</span>
            <span className={styles.likeNum}>{likesCount + (post.likeCount || 0)}</span>
          </button>
          <span className={styles.metaStat}>💬 {comments.length}</span>
          <span className={styles.metaStat}>👁 {viewsCount + (post.viewCount || 0)}</span>
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
          const rawFull = post.fullContent || "";
          const hasEarlyPaywall = rawFull.includes(OKUMA_EARLY_PAYWALL_MARKER);
          const fullTextForDisplay = hasEarlyPaywall
            ? rawFull.split(OKUMA_EARLY_PAYWALL_MARKER).join("\n\n").trim()
            : rawFull;

          if (showFull) {
            return (
              <>
                <div className={styles.content}>{fullTextForDisplay}</div>

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

                {sr && typeof sr === "object" && (
                  <div className={styles.sanriWrap}>
                    <div className={styles.sanriHeader}>
                      <span className={styles.sanriGlyph}>✦</span>
                      <span className={styles.sanriLabel}>
                        {isTR ? "Sanrı Yansıması" : "Sanri Reflection"}
                      </span>
                    </div>
                    <p className={styles.sanriAnalysis}>{sr.analysis}</p>
                    <p className={styles.sanriStrong}>{sr.strongLine}</p>
                    <p className={styles.sanriQuestion}>{sr.question}</p>
                  </div>
                )}
                {sr && typeof sr === "string" && (
                  <div className={styles.sanriWrap}>
                    <div className={styles.sanriHeader}>
                      <span className={styles.sanriGlyph}>✦</span>
                      <span className={styles.sanriLabel}>
                        {isTR ? "Sanrı Yansıması" : "Sanri Reflection"}
                      </span>
                    </div>
                    <p className={styles.sanriAnalysis} style={{ whiteSpace: "pre-wrap" }}>
                      {sr}
                    </p>
                  </div>
                )}
              </>
            );
          }

          if (hasEarlyPaywall) {
            trackFunnelEvent("okuma_paywall_view", post.slug);
            const teaser = rawFull.split(OKUMA_EARLY_PAYWALL_MARKER)[0]?.trim() || "";
            const deepComments = post.deepReaderComments || [];
            return (
              <>
                <div className={styles.content}>{teaser}</div>

                {(viewsCount + (post.viewCount || 0) > 10 || deepComments.length > 0) && (
                  <div className={styles.socialProof} style={{
                    margin: "16px 0", padding: "14px 16px",
                    background: "rgba(200,160,255,0.05)",
                    border: "1px solid rgba(200,160,255,0.10)",
                    borderRadius: 12,
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(200,160,255,0.8)", fontWeight: 600 }}>
                      {isTR
                        ? `Bu okuma ${viewsCount + (post.viewCount || 0)} kişi tarafından görüntülendi`
                        : `This reading was viewed by ${viewsCount + (post.viewCount || 0)} people`}
                      {deepComments.length > 0 && (
                        <span style={{ opacity: 0.7 }}>
                          {" · "}
                          {isTR
                            ? `${deepComments.length} kişi derin katmanı okudu`
                            : `${deepComments.length} read the deep layer`}
                        </span>
                      )}
                    </p>
                    {deepComments.length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <p style={{ margin: "0 0 6px", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: ".04em", fontWeight: 600 }}>
                          {isTR ? "DERİN AÇILIMI OKUYANLARDAN:" : "FROM DEEP LAYER READERS:"}
                        </p>
                        {deepComments.slice(0, 2).map((c, i) => (
                          <p key={i} style={{
                            margin: "4px 0", padding: "8px 10px", fontSize: 12,
                            background: "rgba(255,255,255,0.03)", borderRadius: 8,
                            color: "rgba(255,255,255,0.6)", fontStyle: "italic",
                            borderLeft: "2px solid rgba(200,160,255,0.3)",
                          }}>
                            "{c.content.length > 80 ? c.content.slice(0, 80) + "…" : c.content}"
                            <span style={{ display: "block", fontSize: 10, marginTop: 3, opacity: 0.5, fontStyle: "normal" }}>
                              — {c.authorName}
                            </span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className={`${styles.lockZone} ${styles.lockZoneStandalone}`}>
                  <div className={styles.lockZoneGradient} />
                  <div className={styles.lockZoneOverlay}>
                    <div className={styles.lockZoneIcon}>🔒</div>
                    <p className={styles.lockZoneLine1}>
                      {isTR
                        ? "Derin okumaya inmek istersen — buradan sonra açılım genişler."
                        : "If you want to go deeper — the reading opens from here."}
                    </p>
                    <p className={styles.lockZoneLine2}>
                      {isTR
                        ? "Kod çözümü ve tam metin; devam, 9,90 ₺ enerji karşılığında."
                        : "Code layer and full text; continue with a ₺9.90 energy exchange."}
                    </p>
                    <button
                      className={styles.lockZoneBtn}
                      onClick={() => {
                        trackFunnelEvent("okuma_unlock_click", post.slug);
                        redirectToShopier("okuma_devami", `okuma_${post.id}`, location.pathname);
                      }}
                    >
                      {isTR ? "Derin okumayı aç — 9,90 ₺" : "Open deep reading — ₺9.90"}
                    </button>
                    <button
                      className={styles.lockZoneAlt}
                      onClick={() => {
                        trackFunnelEvent("okuma_unlock_click", post.slug);
                        redirectToShopier("okuma_devami", `okuma_${post.id}`, location.pathname);
                      }}
                    >
                      {isTR ? "İlerle" : "Continue"}
                    </button>
                    <BankTransferLink
                      contentId={`okuma_${post.id}`}
                      returnTo={`${location.pathname}${location.search}`}
                      className={styles.lockZoneHavale}
                    >
                      {isTR ? "Havale / EFT ile öde (9,90 ₺)" : "Pay via bank transfer (₺9.90)"}
                    </BankTransferLink>
                  </div>
                </div>
              </>
            );
          }

          const preview = typeof post.previewContent === "string" ? post.previewContent.trim() : "";
          if (preview) {
            return (
              <>
                <div className={styles.content}>{post.previewContent}</div>
                <div className={`${styles.lockZone} ${styles.lockZoneStandalone}`}>
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
                    <BankTransferLink
                      contentId={`okuma_${post.id}`}
                      returnTo={`${location.pathname}${location.search}`}
                      className={styles.lockZoneHavale}
                    >
                      {isTR ? "Havale / EFT ile öde (9,90 ₺)" : "Pay via bank transfer (₺9.90)"}
                    </BankTransferLink>
                  </div>
                </div>
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
                  <BankTransferLink
                    contentId={`okuma_${post.id}`}
                    returnTo={`${location.pathname}${location.search}`}
                    className={styles.lockZoneHavale}
                  >
                    {isTR ? "Havale / EFT ile öde (9,90 ₺)" : "Pay via bank transfer (₺9.90)"}
                  </BankTransferLink>
                </div>
              </div>
            </>
          );
        })()}

        {/* ── Auto CTA (locked users) ── */}
        {isLocked && autoCta && (
          <div className={styles.autoCta}>
            <p className={styles.autoCtaText}>{autoCta?.text ?? ""}</p>
            <div className={styles.autoCtaActions}>
              <button
                className={styles.microPayBtn}
                onClick={() => redirectToShopier("okuma_devami", `okuma_${post.id}`, location.pathname)}
              >
                {isTR ? "Satın Al ve Kapıyı Aç" : "Purchase & Unlock"}
              </button>
              <button
                type="button"
                className={styles.autoCtaBtn}
                onClick={() => {
                  handleCtaClick();
                  redirectToShopier("kod_egitmeni", "kod_egitmeni", location.pathname);
                }}
              >
                {isTR ? "Tüm İçerikleri Satın Al (999 ₺)" : "Buy all content (₺999)"}
              </button>
              <BankTransferLink
                contentId={`okuma_${post.id}`}
                returnTo={`${location.pathname}${location.search}`}
                className={styles.autoCtaHavale}
              >
                {isTR ? "Havale / EFT ile öde" : "Bank transfer (EFT)"}
              </BankTransferLink>
            </div>
          </div>
        )}

        {/* ── Deeper CTA (unlocked users) ── */}
        {!isLocked && (
          <div className={styles.deeperCta}>
            {autoCta && (
              <p className={styles.autoCtaHint}>{autoCta?.text ?? ""}</p>
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
              <Link to="/yanki/yeni" className={styles.deeperBtn}>
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
          {Array.isArray(post.deepReaderComments) && post.deepReaderComments.length > 0 && (
            <div className={styles.readerEchoBlock}>
              <h3 className={styles.readerEchoHeading}>
                {isTR ? "Derin açılımı okuyanlardan" : "From readers who went deep"}
              </h3>
              <p className={styles.readerEchoLead}>
                {isTR
                  ? "Tam metni — kelime-kök ve üst bilinç yorumunu — bitirenlerin notları. Sen de derine indiğinde paylaş."
                  : "Notes from readers who finished the full layer. Share yours when you go deep."}
              </p>
              <div className={styles.readerEchoList}>
                {post.deepReaderComments.map((c, i) => (
                  <div key={`deep-echo-${i}`} className={`${styles.commentCard} ${styles.readerEchoCard}`}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentAvatar}>
                        {(c.authorName || "?").charAt(0).toUpperCase()}
                      </div>
                      <span className={styles.commentAuthor}>{c.authorName}</span>
                      <div className={styles.readerEchoMeta}>
                        <span className={styles.readerEchoPill}>
                          {isTR ? "derin okuma" : "deep read"}
                        </span>
                        <span className={styles.commentTime}>{timeAgoOkuma(c.createdAt)}</span>
                      </div>
                    </div>
                    <p className={styles.commentText}>{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className={styles.commentsTitle}>
            {isTR
              ? `Yorumlar (${comments.length})`
              : `Comments (${comments.length})`}
          </h2>

          {comments.map((c) => (
            <div key={c.id} className={styles.commentCard}>
              <div className={styles.commentHeader}>
                <div className={styles.commentAvatar}>
                  {(c.authorName || "?").charAt(0).toUpperCase()}
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

        {/* ── Email Capture ── */}
        {!isLocked && (
          <EmailCaptureInline
            page={`okuma/${post.slug}`}
            label="Bu okumanın devamını ve yeni frekans analizlerini almak ister misin?"
          />
        )}

        {/* ── Sanrı CTA (after everything) ── */}
        {!isLocked && sr && typeof sr === "object" && sr.question && (
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
      </article>
    </div>
  );
}
