import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { LockBadge } from "../components/premium/PremiumGate";
import { OKUMA_POSTS, OKUMA_CATEGORIES, getCategoryById, timeAgoOkuma } from "../data/okumaData";
import styles from "./OkumaAlaniPage.module.css";

export default function OkumaAlaniPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isPremium } = usePremium();
  const isTR = language === "tr";
  const [activeFilter, setActiveFilter] = useState("all");

  const featured = useMemo(() => OKUMA_POSTS.find((p) => p.isFeatured) || OKUMA_POSTS[0], []);

  const filteredPosts = useMemo(() => {
    const nonFeatured = OKUMA_POSTS.filter((p) => p.id !== featured.id);
    if (activeFilter === "all") return nonFeatured;
    return nonFeatured.filter((p) => p.category === activeFilter);
  }, [activeFilter, featured.id]);

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

      {/* ── Featured Post ── */}
      {activeFilter === "all" && featured && (
        <div className={styles.featuredWrap}>
          <motion.div
            className={styles.featuredCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(`/okuma-alani/${featured.slug}`)}
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
                <span>💬 {featured.commentCount}</span>
                <span>👁 {featured.viewCount}</span>
                <span>{timeAgoOkuma(featured.createdAt)}</span>
              </div>
            </div>
          </motion.div>
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
                <motion.div
                  key={post.id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  onClick={() => navigate(`/okuma-alani/${post.slug}`)}
                >
                  <div className={styles.cardImgWrap}>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className={styles.cardImg}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML = `<div class="${styles.coverFallback}">✦</div>`;
                      }}
                    />
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
                      <span>💬 {post.commentCount}</span>
                      <span>👁 {post.viewCount}</span>
                      <span>{timeAgoOkuma(post.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
