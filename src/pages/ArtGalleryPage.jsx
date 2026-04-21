import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import StarTrail from "../components/StarTrail";
import SeoHead from "../components/SeoHead";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import {
  artGalleryProducts,
  artGalleryCategories,
  artProductImageUrl,
  formatArtPrice,
  getSimilarArtProducts,
  DIMENSIONS_FALLBACK,
  IMAGE_FALLBACK_TEXT,
} from "../data/artGalleryProducts";
import styles from "./ArtGalleryPage.module.css";

/* ── Helpers ─────────────────────────────────────────────────────────── */
const SUPPORT_EMAIL = "selin@asksanri.com";

function getCategoryLabel(catId, isTR) {
  const cat = artGalleryCategories.find((c) => c.id === catId);
  if (!cat) return catId || "";
  return isTR ? cat.labelTr : cat.labelEn;
}

function pickName(product, isTR) {
  if (!product) return "";
  if (!isTR && product.nameEn) return product.nameEn;
  return product.name;
}

/**
 * Ürün detay sayfasından "daha fazla bilgi" için mailto: linki kurar.
 * Konu ve gövde ürün bilgisi ile ön-doldurulmuş.
 */
function buildSupportMailto(product, isTR) {
  if (!product) return `mailto:${SUPPORT_EMAIL}`;
  const name = pickName(product, isTR);
  const price = formatArtPrice(product.price, product.currency);
  const dim = product.dimensions || "";
  const pageUrl =
    (typeof window !== "undefined" && window.location?.href) || "";

  const subject = isTR
    ? `Art Gallery — ${name} hakkında bilgi`
    : `Art Gallery — Info request: ${name}`;

  const lines = isTR
    ? [
        "Merhaba Selin,",
        "",
        `"${name}" hakkında daha fazla bilgi almak istiyorum.`,
        "",
        `• Ürün: ${name}`,
        `• Fiyat: ${price}`,
        dim ? `• Ölçü: ${dim}` : "",
        pageUrl ? `• Sayfa: ${pageUrl}` : "",
        "",
        "Teşekkürler.",
      ]
    : [
        "Hi Selin,",
        "",
        `I'd like more info about "${name}".`,
        "",
        `• Item: ${name}`,
        `• Price: ${price}`,
        dim ? `• Size: ${dim}` : "",
        pageUrl ? `• Page: ${pageUrl}` : "",
        "",
        "Thank you.",
      ];
  const body = lines.filter(Boolean).join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/* ── Gallery Image (kart / modal ortak) ──────────────────────────────── */
function GalleryImage({ product, sizes = "(max-width: 600px) 100vw, 400px", priority = false }) {
  const [idx, setIdx] = useState(0);
  const gallery = Array.isArray(product?.gallery) && product.gallery.length
    ? product.gallery
    : product?.image
      ? [product.image]
      : [];
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setIdx(0);
    setBroken(false);
  }, [product?.id]);

  const n = gallery.length;
  const safe = n ? idx % n : 0;
  const file = gallery[safe];
  const src = file ? artProductImageUrl(file) : "";

  const go = (delta) => {
    if (n <= 1) return;
    setIdx((i) => (i + delta + n) % n);
    setBroken(false);
  };

  return (
    <div className={styles.imgWrap}>
      {!src || broken ? (
        <div className={styles.imgFallback}>
          <span>{IMAGE_FALLBACK_TEXT}</span>
        </div>
      ) : (
        <img
          className={styles.mainImg}
          src={src}
          alt={product?.name || ""}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : undefined}
          onError={() => setBroken(true)}
        />
      )}
      {n > 1 && (
        <>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Önceki görsel"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Sonraki görsel"
          >
            ›
          </button>
          <div className={styles.dots}>
            {gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === safe ? styles.dotActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                  setBroken(false);
                }}
                aria-label={`Görsel ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Ürün Kartı ─────────────────────────────────────────────────────── */
function ProductCard({ product, isTR, onOpen }) {
  const name = pickName(product, isTR);
  const catLabel = getCategoryLabel(product.category, isTR);
  const priceText = formatArtPrice(product.price, product.currency);
  const dim = product.dimensions || DIMENSIONS_FALLBACK;

  return (
    <article
      className={`${styles.card} ${product.featured ? styles.cardFeatured : ""}`}
      onClick={() => onOpen(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(product);
        }
      }}
    >
      <GalleryImage product={product} priority={product.featured} />
      <div className={styles.body}>
        <div className={styles.cardMeta}>
          <span className={styles.badge}>{catLabel}</span>
          {product.featured && <span className={styles.featuredTag}>{isTR ? "SEÇKİ" : "FEATURED"}</span>}
        </div>
        <h2 className={styles.title}>{name}</h2>
        <p className={styles.shortStory}>{product.shortStory}</p>

        <div className={styles.cardFacts}>
          <span className={styles.cardPrice}>{priceText}</span>
          <span className={styles.cardDim}>{dim}</span>
        </div>

        <button
          type="button"
          className={styles.detailBtn}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(product);
          }}
        >
          {isTR ? "Detayı İncele" : "View Details"}
        </button>
      </div>
    </article>
  );
}

/* ── Ürün Detay Modalı ──────────────────────────────────────────────── */
function ProductDetailModal({ product, isTR, onClose, onOpen }) {
  const similar = useMemo(() => getSimilarArtProducts(product, 4), [product]);
  const catLabel = getCategoryLabel(product?.category, isTR);
  const name = pickName(product, isTR);
  const priceText = formatArtPrice(product?.price, product?.currency);
  const dim = product?.dimensions || DIMENSIONS_FALLBACK;

  useEffect(() => {
    if (!product) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div
        className={styles.modalPanel}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label={isTR ? "Kapat" : "Close"}
        >
          ×
        </button>

        <div className={styles.modalBody}>
          <div className={styles.modalImgCol}>
            <GalleryImage product={product} priority />
          </div>

          <div className={styles.modalInfoCol}>
            <span className={styles.badge}>{catLabel}</span>
            <h2 className={styles.modalTitle}>{name}</h2>

            <div className={styles.modalPriceBlock}>
              <span className={styles.modalPrice}>{priceText}</span>
              {product.featured && (
                <span className={styles.featuredTag}>{isTR ? "SEÇKİ" : "FEATURED"}</span>
              )}
            </div>

            <dl className={styles.specList}>
              <div className={styles.specRow}>
                <dt>{isTR ? "Ölçü" : "Size"}</dt>
                <dd>{dim}</dd>
              </div>
              <div className={styles.specRow}>
                <dt>{isTR ? "Malzeme" : "Material"}</dt>
                <dd>{product.material || (isTR ? "Bilgi istek üzerine paylaşılır." : "Available on request.")}</dd>
              </div>
              <div className={styles.specRow}>
                <dt>{isTR ? "Kategori" : "Category"}</dt>
                <dd>{catLabel}</dd>
              </div>
            </dl>

            <div className={styles.storyBlock}>
              <p className={styles.storyLead}>{product.shortStory}</p>
              {product.description && (
                <p className={styles.storyBody}>{product.description}</p>
              )}
            </div>

            <div className={styles.modalCta}>
              <a
                href={buildSupportMailto(product, isTR)}
                className={styles.modalCtaPrimary}
              >
                {isTR ? "Ürün hakkında daha fazla bilgi al" : "Request more info"}
              </a>
              <button type="button" className={styles.modalCtaGhost} onClick={onClose}>
                {isTR ? "Galerisine Dön" : "Back to gallery"}
              </button>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className={styles.similarBlock}>
            <h3 className={styles.similarTitle}>
              {isTR ? "Benzer Parçalar" : "Similar Pieces"}
            </h3>
            <div className={styles.similarGrid}>
              {similar.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className={styles.similarCard}
                  onClick={() => onOpen(p)}
                >
                  <div className={styles.similarImgWrap}>
                    {p.image ? (
                      <img
                        src={artProductImageUrl(p.image)}
                        alt={pickName(p, isTR)}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.imgFallback}>
                        <span>{IMAGE_FALLBACK_TEXT}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.similarMeta}>
                    <span className={styles.similarName}>{pickName(p, isTR)}</span>
                    <span className={styles.similarPrice}>{formatArtPrice(p.price, p.currency)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sayfa ──────────────────────────────────────────────────────────── */
export default function ArtGalleryPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";
  const [filter, setFilter] = useState("all");
  const [activeProduct, setActiveProduct] = useState(null);

  const availableProducts = useMemo(
    () => artGalleryProducts.filter((p) => p.available !== false),
    []
  );

  const filtered = useMemo(() => {
    if (filter === "all") return availableProducts;
    return availableProducts.filter((p) => p.category === filter);
  }, [filter, availableProducts]);

  const activeCategories = useMemo(() => {
    const used = new Set(availableProducts.map((p) => p.category));
    return artGalleryCategories.filter((c) => used.has(c.id));
  }, [availableProducts]);

  const openDetail = useCallback((product) => {
    setActiveProduct(product);
  }, []);

  const closeDetail = useCallback(() => {
    setActiveProduct(null);
  }, []);

  return (
    <div className={styles.page} onPointerDown={() => unlockAudio()}>
      <SeoHead
        title={isTR ? "Sanat Galerisi — Art Gallery" : "Art Gallery"}
        description={
          isTR
            ? "Özgün heykel, büst, tablo ve dekoratif objeler — koleksiyonluk çağdaş sanat parçaları."
            : "Original sculptures, busts, framed art and decor — curated contemporary collection."
        }
        path="/art-gallery"
        ogImage="/assets/art-gallery/products/art-gallery.jpeg"
      />
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.subttl}>Art Gallery</span>
        </div>
        <div className={styles.topbarRight}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/kapilar", { state: { skipIntro: true } })}
          >
            {isTR ? "← Kapılara Dön" : "← Gates"}
          </button>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.hero}>
        <h1 className={styles.h1}>ART GALLERY</h1>
        <p className={styles.heroSub}>
          {isTR
            ? "Heykel, tablo, sehpa ve seçilmiş objeler — çağdaş sanat ve tasarımın kesiştiği koleksiyon."
            : "Sculptures, paintings, tables and curated objects — where contemporary art meets design."}
        </p>
      </div>

      <div className={styles.filters}>
        <button
          type="button"
          className={`${styles.filterBtn} ${filter === "all" ? styles.filterActive : ""}`}
          onClick={() => setFilter("all")}
        >
          {isTR ? "Tümü" : "All"}
        </button>
        {activeCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`${styles.filterBtn} ${filter === c.id ? styles.filterActive : ""}`}
            onClick={() => setFilter(c.id)}
          >
            {isTR ? c.labelTr : c.labelEn}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} isTR={isTR} onOpen={openDetail} />
        ))}
      </div>

      <p className={styles.legalNote}>
        <Link to="/mesafeli-satis">{isTR ? "Mesafeli satış şartları" : "Distance selling terms"}</Link>
        {" · "}
        {isTR
          ? "Sipariş ve ödeme için iletişime geçebilirsiniz."
          : "Contact us for ordering and payment options."}
      </p>

      {activeProduct && (
        <ProductDetailModal
          product={activeProduct}
          isTR={isTR}
          onClose={closeDetail}
          onOpen={openDetail}
        />
      )}
    </div>
  );
}
