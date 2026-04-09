import { Helmet } from "react-helmet-async";

const SITE = "https://asksanri.com";
const DEFAULT_OG_IMAGE = "/assets/og/yanki-share.jpg";

export default function SeoHead({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  noIndex = false,
  children,
}) {
  const fullTitle = title
    ? `${title} | SANRI`
    : "SANRI — Anlaşılma Alanı | Bilinç ve Anlam Zekası Platformu";
  const desc =
    description ||
    "SANRI: numeroloji AI, sembolik analiz, isim analizi, yaşam yolu hesaplama, kolektif bilinç okumaları. Dijital bilinç ve anlam zekası platformu.";
  const url = path ? `${SITE}${path}` : SITE;
  const img = ogImage || DEFAULT_OG_IMAGE;
  const absImg = img.startsWith("http") ? img : `${SITE}${img}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absImg} />
      <meta property="og:site_name" content="SANRI" />
      <meta property="og:locale" content="tr_TR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={absImg} />

      {children}
    </Helmet>
  );
}
