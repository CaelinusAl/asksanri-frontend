import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { LockBadge } from "../components/premium/PremiumGate";
import { OKUMA_POSTS, OKUMA_CATEGORIES, getCategoryById, timeAgoOkuma } from "../data/okumaData";
import { isOkumaSeen } from "../data/okumaSeen";
import styles from "./OkumaAlaniPage.module.css";

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

function useActiveReaders() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 8) + 4);
  const ref = useRef(count);
  useEffect(() => {
    const t = setInterval(() => {
      const delta = Math.random() > 0.5 ? 1 : -1;
      ref.current = Math.max(2, Math.min(24, ref.current + delta));
      setCount(ref.current);
    }, 8000 + Math.random() * 7000);
    return () => clearInterval(t);
  }, []);
  return count;
}

function mergeCount(liveVal, staticVal) {
  return (liveVal || 0) + (staticVal || 0);
}

/** Sunucu / poll ile sayı değişince hafif “canlı” nabız */
function OkumaLiveStat({ icon, liveVal, staticVal }) {
  const total = mergeCount(liveVal, staticVal);
  const prevRef = useRef(null);
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (prevRef.current === null) {
      prevRef.current = total;
      return;
    }
    if (prevRef.current !== total) {
      prevRef.current = total;
      setPulse(true);
      const t = window.setTimeout(() => setPulse(false), 480);
      return () => window.clearTimeout(t);
    }
  }, [total]);
  return (
    <span className={`${styles.liveStat}${pulse ? ` ${styles.liveStatPulse}` : ""}`}>
      {icon} {total}
    </span>
  );
}

function OkumaSeenBadge({ isTR }) {
  return <span className={styles.seenBadge}>{isTR ? "Görüldü" : "Seen"}</span>;
}

/** Kapak yüklenmezse React ağacını innerHTML ile bozmayız (removeChild çökmesinin ana nedeni). */
function OkumaCardCover({ coverImage, title }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={styles.coverFallback} aria-hidden>
        ✦
      </div>
    );
  }
  return (
    <img
      className={styles.cardImg}
      src={coverImage}
      alt={title}
      onError={() => setFailed(true)}
    />
  );
}

export default function OkumaAlaniPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isPremium } = usePremium();
  const isTR = language === "tr";
  const [activeFilter, setActiveFilter] = useState("all");
  const [liveStats, setLiveStats] = useState({});
  const [gozCoverErr, setGozCoverErr] = useState(false);
  const [, setSeenBump] = useState(0);
  const activeReaders = useActiveReaders();

  useEffect(() => {
    const onSeen = () => setSeenBump((n) => n + 1);
    window.addEventListener("sanri-okuma-seen", onSeen);
    return () => window.removeEventListener("sanri-okuma-seen", onSeen);
  }, []);

  useEffect(() => {
    const load = () =>
      fetch(`${API}/okuma/all-stats`)
        .then((r) => r.json())
        .then((data) => {
          if (data.stats) setLiveStats(data.stats);
        })
        .catch(() => {});
    load();
    const poll = window.setInterval(load, 42000);
    return () => window.clearInterval(poll);
  }, []);

  /** Birden fazla `isFeatured: true` varsa ilki değil, en yeni tarihli öne çıkan (güncel haber) seçilir. */
  const featured = useMemo(() => {
    if (!OKUMA_POSTS?.length) return null;
    const candidates = OKUMA_POSTS.filter((p) => p.isFeatured);
    if (candidates.length === 0) return OKUMA_POSTS[0];
    return candidates.reduce((best, p) => {
      const t = new Date(p.createdAt || 0).getTime() || 0;
      const bt = new Date(best.createdAt || 0).getTime() || 0;
      return t >= bt ? p : best;
    });
  }, []);

  /**
   * "Tümü"nde öne çıkan kartta gösterilen yazı grid’de tekrarlanmasın.
   * Kategori filtresi seçiliyken öne çıkan satırı gizlediğimiz için (yalnızca Tümü’nde var),
   * aynı yazı grid’e dahil edilmeli — yoksa örn. Hopa/koyun haberi "Gündem Kodu"nda tamamen kaybolurdu.
   */
  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") {
      if (!featured) return [...OKUMA_POSTS];
      return OKUMA_POSTS.filter((p) => p.id !== featured.id);
    }
    return OKUMA_POSTS.filter((p) => p.category === activeFilter);
  }, [activeFilter, featured]);

  const renderCategoryBadge = (categoryId, extraStyle) => {
    const cat = getCategoryById(categoryId);
    return (
      <span
        className={styles.cardCatBadge}
        style={{
          background: `${cat.color}18`,
          color: cat.color,
          border: `1px solid ${cat.color}30`,
          ...extraStyle,
        }}
      >
        {isTR ? cat.label.tr : cat.label.en}
      </span>
    );
  };

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>← {isTR ? "Ana Sayfa" : "Home"}</Link>
        <h1 className={styles.h1}>{isTR ? "Okuma Alanı" : "Reading Field"}</h1>
        <p className={styles.subtitle}>
          {isTR
            ? "Hologram Matrix sistem okumaları — gerçekliğin kodlarını çöz, derinliğe in."
            : "Hologram Matrix system readings — decode reality, descend into depth."}
        </p>
      </div>

      {/* ── Live Indicator ── */}
      <div className={styles.liveBar}>
        <span className={styles.liveDot} />
        <span className={styles.liveText}>
          {activeReaders} {isTR ? "kişi şu an okuyor" : "reading now"}
        </span>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeFilter === "all" ? styles.filterActive : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          {isTR ? "Tümü" : "All"}
        </button>
        {OKUMA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${activeFilter === cat.id ? styles.filterActive : ""}`}
            onClick={() => setActiveFilter(cat.id)}
          >
            {isTR ? cat.label.tr : cat.label.en}
          </button>
        ))}
      </div>

      {/* ── Göz Açık Güneş / Sauron — özel derin okuma ── */}
      <div className={styles.gozStrip}>
        <button
          type="button"
          className={styles.gozStripInner}
          onClick={() => navigate("/goz-acik-gunes")}
        >
          <div className={styles.gozStripImgWrap}>
            {!gozCoverErr ? (
              <img
                className={styles.gozStripImg}
                src="/assets/gates/goz-acildi.jpg"
                alt={isTR ? "Göz Açık Güneş görseli" : "Eye-Open Sun"}
                onError={() => setGozCoverErr(true)}
              />
            ) : (
              <div className={styles.gozStripGlyph} aria-hidden>
                👁
              </div>
            )}
          </div>
          <div>
            <p className={styles.gozStripKicker}>
              {isTR ? "Üst bilinç okuma" : "Upper-mind read"}
            </p>
            <h2 className={styles.gozStripTitle}>
              {isTR
                ? "Sauron’un Gözü × Göz Açık Güneş"
                : "Sauron's Eye × Eye-Open Sun"}
            </h2>
            <p className={styles.gozStripSub}>
              {isTR
                ? "Sembolik okuma — görünen ile hissettiğin arasındaki katman."
                : "A symbolic read — the layer between what you see and what you sense."}
            </p>
          </div>
          <span className={styles.gozStripCta}>
            {isTR ? "Metne gir →" : "Enter →"}
          </span>
        </button>
      </div>

      {/* ── Featured Post ── */}
      {activeFilter === "all" && featured && (
        <div className={styles.featuredWrap}>
          <div
            className={styles.featuredCard}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/okuma-alani/${featured.slug}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/okuma-alani/${featured.slug}`);
              }
            }}
          >
            <div className={styles.featuredImgWrap}>
              <img
                src={featured.coverImage}
                alt={featured.title}
                className={styles.featuredImg}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <span className={styles.featuredLabel}>
                {isTR ? "ÖNE ÇIKAN" : "FEATURED"}
              </span>
              {featured.isPremium && !isPremium && <LockBadge />}
            </div>
            <div className={styles.featuredBody}>
              {renderCategoryBadge(featured.category, {
                position: "static",
                marginBottom: 4,
              })}
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <p className={styles.featuredSub}>{featured.subtitle}</p>
              <p className={styles.featuredSub} style={{ opacity: 0.85 }}>
                {featured.excerpt}
              </p>
              <div className={styles.featuredMeta}>
                <OkumaLiveStat
                  icon="💬"
                  liveVal={liveStats[featured.slug]?.comments}
                  staticVal={featured.commentCount}
                />
                <OkumaLiveStat
                  icon="👁"
                  liveVal={liveStats[featured.slug]?.views}
                  staticVal={featured.viewCount}
                />
                <span className={styles.metaTime}>{timeAgoOkuma(featured.createdAt)}</span>
                {isOkumaSeen(featured.slug) ? <OkumaSeenBadge isTR={isTR} /> : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Grid ── */}
      <div className={styles.gridWrap}>
        {filteredPosts.length === 0 ? (
          <div className={styles.empty}>
            {isTR ? "Bu kategoride henüz okuma yok." : "No readings in this category yet."}
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredPosts.map((post, idx) => {
              const cat = getCategoryById(post.category);
              return (
                <div
                  key={post.id}
                  className={styles.card}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/okuma-alani/${post.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/okuma-alani/${post.slug}`);
                    }
                  }}
                >
                  <div className={styles.cardImgWrap}>
                    <OkumaCardCover coverImage={post.coverImage} title={post.title} />
                    <span
                      className={styles.cardCatBadge}
                      style={{
                        background: `${cat.color}18`,
                        color: cat.color,
                        border: `1px solid ${cat.color}30`,
                      }}
                    >
                      {isTR ? cat.label.tr : cat.label.en}
                    </span>
                    {post.isPremium && !isPremium && <LockBadge />}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                    <div className={styles.cardMeta}>
                      <OkumaLiveStat
                        icon="💬"
                        liveVal={liveStats[post.slug]?.comments}
                        staticVal={post.commentCount}
                      />
                      <OkumaLiveStat
                        icon="👁"
                        liveVal={liveStats[post.slug]?.views}
                        staticVal={post.viewCount}
                      />
                      <span className={styles.metaTime}>{timeAgoOkuma(post.createdAt)}</span>
                      {isOkumaSeen(post.slug) ? <OkumaSeenBadge isTR={isTR} /> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
