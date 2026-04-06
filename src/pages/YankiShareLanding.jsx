import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { fetchPostPreview, trackReferral, claimReferral, fetchReflections } from "../data/yankiApi";
import { getPostTypeById } from "../data/yankiData";

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
import styles from "./YankiShareLanding.module.css";

export default function YankiShareLanding() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const isTR = language === "tr";

  const refId = params.get("ref") ? parseInt(params.get("ref"), 10) : null;

  const [post, setPost] = useState(null);
  const [referrerName, setReferrerName] = useState(null);
  const [reflection, setReflection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [previewData, reflData] = await Promise.all([
          fetchPostPreview(id, refId),
          fetchReflections(id).catch(() => ({ reflections: [] })),
        ]);
        if (cancelled) return;
        setPost(previewData.post);
        setReferrerName(previewData.referrer_name || null);
        if (reflData.reflections?.length > 0) {
          setReflection(reflData.reflections[0].response);
        }
      } catch (err) {
        if (!cancelled) setError(isTR ? "Paylaşım bulunamadı." : "Post not found.");
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [id, refId, isTR]);

  useEffect(() => {
    if (!post) return;
    const title = (post.title || "Yankı") + " — Yankı Alanı";
    const desc = (post.content || "").slice(0, 160) + "...";
    document.title = title;

    const setMeta = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`) ||
               document.querySelector(`meta[name="${prop}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (prop.startsWith("og:") || prop.startsWith("twitter:")) el.setAttribute("property", prop);
        else el.setAttribute("name", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const url = `${window.location.origin}/yanki/${id}`;
    const ogImage = `${window.location.origin}/assets/og/yanki-share.jpg`;

    setMeta("og:title", title);
    setMeta("og:description", desc);
    setMeta("og:url", url);
    setMeta("og:image", ogImage);
    setMeta("og:type", "article");
    setMeta("og:site_name", "CAELINUS AI — SANRI");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", ogImage);
    setMeta("description", desc);

    return () => { document.title = "CAELINUS AI • SANRI"; };
  }, [post, id]);

  useEffect(() => {
    if (!refId || tracked) return;
    async function track() {
      try {
        const result = await trackReferral({
          referrer_id: refId,
          post_id: parseInt(id, 10),
        });
        setTracked(true);
        if (isAuthenticated && result?.referral_id) {
          try { await claimReferral(result.referral_id); } catch { /* ignore */ }
        }
      } catch { /* silent */ }
    }
    track();
  }, [refId, id, tracked, isAuthenticated]);

  const typeInfo = post ? getPostTypeById(post.category) : null;

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate(`/yanki/post/${id}`);
    } else {
      navigate(`/giris?redirect=/yanki/post/${id}`);
    }
  };

  const handleExplore = () => {
    navigate("/yanki");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={styles.loadingText}
          >
            ✦
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.page}>
        <div className={styles.errorWrap}>
          <p className={styles.errorText}>{error || (isTR ? "Bulunamadı." : "Not found.")}</p>
          <button className={styles.ctaBtn} onClick={handleExplore}>
            {isTR ? "Yankı Alanını Keşfet" : "Explore Yankı"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {referrerName && (
          <p className={styles.inviteText}>
            <span className={styles.inviteHighlight}>{referrerName}</span>
            {isTR ? " seni Yankı Alanı'na çağırıyor" : " invites you to Yankı Alanı"}
          </p>
        )}

        <div className={styles.card}>
          {typeInfo && (
            <span className={styles.badge} style={{ background: typeInfo.color + "22", color: typeInfo.color }}>
              {typeInfo.icon} {isTR ? typeInfo.label.tr : typeInfo.label.en}
            </span>
          )}

          {post.title && <h2 className={styles.cardTitle}>{post.title}</h2>}

          <p className={styles.cardContent}>{post.content}</p>

          {post.author_mode !== "anonymous" && post.author_name && (
            <p className={styles.author}>— {post.author_name}</p>
          )}

          <div className={styles.stats}>
            <span>♡ {post.reaction_heart || 0}</span>
            <span>◈ {post.reaction_felt || 0}</span>
            <span>◇ {post.reaction_sessizce || 0}</span>
            <span>💬 {post.comment_count || 0}</span>
          </div>
        </div>

        {reflection && (() => {
          const rp = parseStructuredReflection(reflection);
          return (
            <div className={styles.reflCard}>
              <div className={styles.reflHeader}>
                <span className={styles.reflGlyph}>✦</span>
                <span className={styles.reflLabel}>SANRI YANSIMASI</span>
              </div>
              {rp?.isStructured ? (
                <div className={styles.reflBody}>
                  {rp.yansima && <p className={styles.reflText}>{rp.yansima}</p>}
                  {rp.derinlik && <p className={styles.reflDeep}>{rp.derinlik}</p>}
                  {rp.soru && <p className={styles.reflQuestion}>❝ {rp.soru} ❞</p>}
                </div>
              ) : (
                <p className={styles.reflText}>{reflection}</p>
              )}
            </div>
          );
        })()}

        <div className={styles.actions}>
          <button className={styles.ctaBtn} onClick={handleCTA}>
            {isAuthenticated
              ? (isTR ? "Sen de Yankı Bırak" : "Leave Your Echo")
              : (isTR ? "Giriş Yap ve Yankı Bırak" : "Sign in & Leave Echo")}
          </button>
          {reflection && (
            <button className={styles.secondaryBtn} onClick={() => {
              if (isAuthenticated) navigate(`/yanki/post/${id}?sanri=1`);
              else navigate(`/giris?redirect=/yanki/post/${id}?sanri=1`);
            }}>
              {isTR ? "✦ Sanrı'ya Sor" : "✦ Ask Sanri"}
            </button>
          )}
          <button className={styles.secondaryBtn} onClick={handleExplore}>
            {isTR ? "Yankı Alanını Keşfet" : "Explore Yankı Alanı"}
          </button>
        </div>

        <p className={styles.footer}>
          {isTR
            ? "Yankı Alanı — kolektif bilinç platformu"
            : "Yankı Alanı — collective consciousness platform"}
        </p>
      </motion.div>
    </div>
  );
}
