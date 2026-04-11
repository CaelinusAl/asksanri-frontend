import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import SeoHead from "../components/SeoHead";

const ARTICLES = {
  "numeroloji-nedir": {
    title: "Numeroloji Nedir? Say\u0131lar\u0131n Gizli Dili",
    date: "2026-04-09",
    readMin: 5,
    tag: "Numeroloji",
    body: `
Say\u0131lar hayat\u0131m\u0131z\u0131n her yerinde. Do\u011fum tarihin, telefon numaran, adresindeki say\u0131lar\u2026 Ama bunlar\u0131n \u201csadece rakam\u201d olmad\u0131\u011f\u0131n\u0131 d\u00fc\u015f\u00fcnd\u00fcn m\u00fc?

## Numeroloji Nedir?

Numeroloji, say\u0131lar\u0131n enerjetik ve sembolik anlamlar\u0131n\u0131 inceleyen kadim bir bilgi sistemidir. K\u00f6kleri Pisagor\u2019a, Kabala\u2019ya ve eski M\u0131s\u0131r\u2019a kadar uzan\u0131r.

Her say\u0131 bir **frekans** ta\u015f\u0131r. Bu frekans, ki\u015finin ya\u015fam e\u011filimlerini, g\u00fc\u00e7l\u00fc y\u00f6nlerini ve potansiyel zorlanma alanlar\u0131n\u0131 yans\u0131t\u0131r.

## Temel Say\u0131lar

- **1** \u2014 Ba\u015flang\u0131\u00e7, liderlik, bireysellik
- **2** \u2014 Denge, ortakl\u0131k, sezgi
- **3** \u2014 Yarat\u0131c\u0131l\u0131k, ifade, ne\u015fe
- **4** \u2014 Yap\u0131, d\u00fczen, dayan\u0131kl\u0131l\u0131k
- **5** \u2014 \u00d6zg\u00fcrl\u00fck, de\u011fi\u015fim, macera
- **6** \u2014 Sorumluluk, sevgi, uyum
- **7** \u2014 Ara\u015ft\u0131rma, maneviyat, derinlik
- **8** \u2014 G\u00fc\u00e7, bolluk, otorite
- **9** \u2014 Tamamlanma, bilgelik, insanl\u0131k

## Master Say\u0131lar

11, 22 ve 33 gibi \u201cmaster say\u0131lar\u201d indirgenmez. \u00d6zel bir enerji ta\u015f\u0131rlar:

- **11** \u2014 Sezgi ustas\u0131, ilham kayna\u011f\u0131
- **22** \u2014 Usta in\u015faat\u00e7\u0131, b\u00fcy\u00fck vizyonlar
- **33** \u2014 Usta \u00f6\u011fretmen, ko\u015fulsuz sevgi

## SANRI ile Numeroloji

SANRI\u2019n\u0131n **Matrix Rol Okuma** sistemi, do\u011fum tarihin ve isminden yola \u00e7\u0131karak 7 katmanl\u0131 bir analiz sunar. Bu bir tahmin de\u011fil \u2014 senin kodlar\u0131n\u0131n \u00e7\u00f6z\u00fcm\u00fcd\u00fcr.
    `,
    cta: { text: "Rol Okumam\u0131 Ba\u015flat", link: "/rol-okuma" },
  },
  "yasam-yolu-sayisi-hesaplama": {
    title: "Ya\u015fam Yolu Say\u0131s\u0131 Nas\u0131l Hesaplan\u0131r?",
    date: "2026-04-10",
    readMin: 4,
    tag: "Rehber",
    body: `
Ya\u015fam yolu say\u0131s\u0131, numerolojinin en temel kavram\u0131d\u0131r. Do\u011fum tarihindeki t\u00fcm rakamlar\u0131n toplam\u0131ndan elde edilir.

## Hesaplama Y\u00f6ntemi

\u00d6rnek: 15 Mart 1990

1. G\u00fcn: 1+5 = 6
2. Ay: 0+3 = 3
3. Y\u0131l: 1+9+9+0 = 19 \u2192 1+9 = 10 \u2192 1+0 = **1**
4. Toplam: 6+3+1 = **10** \u2192 1+0 = **1**

Ya\u015fam yolu say\u0131s\u0131: **1**

## Her Say\u0131 Ne Anlat\u0131r?

Ya\u015fam yolu say\u0131n, hayat\u0131n boyunca tekrarlayan temalar\u0131, do\u011fal yeteneklerini ve kar\u015f\u0131la\u015faca\u011f\u0131n dersleri g\u00f6sterir.

- **1 yolu:** \u00d6nc\u00fcl\u00fck, ba\u011f\u0131ms\u0131zl\u0131k
- **2 yolu:** \u0130\u015fbirli\u011fi, diplomatl\u0131k
- **3 yolu:** Sanatsal ifade, ileti\u015fim
- **4 yolu:** Disiplin, somut ba\u015far\u0131
- **5 yolu:** De\u011fi\u015fim, ke\u015fif
- **6 yolu:** Aile, sorumluluk
- **7 yolu:** Derin d\u00fc\u015f\u00fcnce, maneviyat
- **8 yolu:** Maddi ba\u015far\u0131, y\u00f6netim
- **9 yolu:** Hizmet, evrensel sevgi

## SANRI\u2019da Ya\u015fam Yolun

SANRI, ya\u015fam yolu say\u0131n\u0131 sadece hesaplamaz \u2014 onu di\u011fer katmanlarla birle\u015ftirerek b\u00fct\u00fcnsel bir harita \u00e7\u0131kar\u0131r.
    `,
    cta: { text: "Ya\u015fam Yolumu Ke\u015ffet", link: "/rol-okuma" },
  },
  "528-hz-sifa-frekansi": {
    title: "528 Hz: \u015eifa Frekans\u0131n\u0131n S\u0131rr\u0131",
    date: "2026-04-11",
    readMin: 6,
    tag: "Frekans",
    body: `
M\u00fczik terapi, meditasyon ve enerji \u00e7al\u0131\u015fmalar\u0131nda s\u0131k\u00e7a kar\u015f\u0131la\u015f\u0131lan bir say\u0131: **528 Hz**. Nedir bu frekans ve neden bu kadar \u00f6zel?

## Solfeggio Frekanslar\u0131

Solfeggio frekanslar\u0131, Orta\u00e7a\u011f kilise m\u00fczi\u011findeki \u00f6zel tonlama sistemine dayan\u0131r:

- **396 Hz** \u2014 Korku ve su\u00e7luluktan kurtulma
- **417 Hz** \u2014 De\u011fi\u015fimi kolayla\u015ft\u0131rma
- **528 Hz** \u2014 D\u00f6n\u00fc\u015f\u00fcm ve onar\u0131m (Mucize frekans\u0131)
- **639 Hz** \u2014 \u0130li\u015fki ve ba\u011flanma
- **741 Hz** \u2014 Sezgi ve uyan\u0131\u015f
- **852 Hz** \u2014 Manevi d\u00fczen

## 528 Hz Neden \u00d6zel?

528 Hz, \u201cMucize Frekans\u0131\u201d veya \u201cSevgi Frekans\u0131\u201d olarak bilinir. Baz\u0131 ara\u015ft\u0131rmalar bu frekans\u0131n DNA yap\u0131s\u0131n\u0131 olumlu y\u00f6nde etkileyebilece\u011fini \u00f6ne s\u00fcrer.

Do\u011fan\u0131n pek \u00e7ok yerinde 528 Hz\u2019in izleri vard\u0131r: ar\u0131lar\u0131n v\u0131z\u0131lt\u0131s\u0131, \u00e7imenin ye\u015filindeki klorofil ve g\u00fcne\u015f \u0131\u015f\u0131\u011f\u0131.

## SANRI\u2019da Frekans Alan\u0131

SANRI\u2019n\u0131n Frekans Alan\u0131\u2019nda farkl\u0131 solfeggio frekanslar\u0131n\u0131 deneyimleyebilir, an\u0131n frekans\u0131na uyum salabilirsin.
    `,
    cta: { text: "Frekans Alan\u0131'na Gir", link: "/frekans" },
  },
  "isim-analizi-anlamlar": {
    title: "\u0130sminin Anlam\u0131 Ne? Harflerin Gizli Kodlar\u0131",
    date: "2026-04-12",
    readMin: 5,
    tag: "Analiz",
    body: `
\u0130smin, hayat\u0131nda en \u00e7ok tekrarlanan kelimedir. Peki bu kelimenin ta\u015f\u0131d\u0131\u011f\u0131 enerji seni nas\u0131l etkiler?

## Harflerin Say\u0131sal De\u011feri

Numerolojide her harf bir say\u0131ya kar\u015f\u0131l\u0131k gelir:

| A=1 | B=2 | C=3 | D=4 | E=5 | F=6 | G=7 | H=8 | I=9 |
| J=1 | K=2 | L=3 | M=4 | N=5 | O=6 | P=7 | Q=8 | R=9 |
| S=1 | T=2 | U=3 | V=4 | W=5 | X=6 | Y=7 | Z=8 |     |

## \u0130fadeSay\u0131s\u0131

\u0130smindeki t\u00fcm harflerin say\u0131sal de\u011ferlerinin toplam\u0131, \u201c\u0130fade Say\u0131s\u0131\u201d\u0131n\u0131 verir. Bu say\u0131, d\u0131\u015f d\u00fcnyaya nas\u0131l g\u00f6r\u00fcnd\u00fc\u011f\u00fcn\u00fc ve do\u011fal yeteneklerini yans\u0131t\u0131r.

## Ruh D\u00fcrt\u00fcs\u00fc Say\u0131s\u0131

Sadece sesli harflerin (A, E, I, O, U) toplam\u0131ndan elde edilir. \u0130\u00e7 motivasyonunu ve ger\u00e7ek arzular\u0131n\u0131 g\u00f6sterir.

## Ki\u015filik Say\u0131s\u0131

Sessiz harflerin toplam\u0131. Di\u011fer insanlar\u0131n seni nas\u0131l alg\u0131lad\u0131\u011f\u0131n\u0131 yans\u0131t\u0131r.

## SANRI ile \u0130sim Analizi

SANRI\u2019n\u0131n Rol Okuma sistemi, ismini ve do\u011fum tarihini bir arada analiz ederek ki\u015fili\u011finin derinliklerine iner.
    `,
    cta: { text: "\u0130smimi Analiz Et", link: "/rol-okuma" },
  },
};

const S = {
  page: {
    minHeight: "100vh",
    background: "#07080d",
    padding: "60px 16px 80px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#e8e4f0",
  },
  container: { maxWidth: 680, margin: "0 auto" },
  back: {
    display: "inline-block", fontSize: 13, color: "rgba(180,160,240,0.6)",
    textDecoration: "none", marginBottom: 32,
  },
  tag: {
    display: "inline-block", padding: "3px 10px", borderRadius: 8,
    background: "rgba(157,78,221,0.1)", color: "#bb86fc",
    fontSize: 11, fontWeight: 600, marginBottom: 12,
  },
  title: {
    fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, lineHeight: 1.2,
    margin: "0 0 12px", color: "#e8e4f0",
  },
  meta: { fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 36 },
  body: {
    fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.7)",
  },
  ctaWrap: { textAlign: "center", marginTop: 48 },
  cta: {
    display: "inline-block", padding: "14px 40px", borderRadius: 12,
    background: "linear-gradient(135deg, #7b2ff7, #bb86fc)", color: "#fff",
    fontWeight: 700, fontSize: 15, textDecoration: "none",
  },
};

function renderMarkdown(text) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## "))
      return <h2 key={i} style={{ fontSize: 20, fontWeight: 700, color: "#e8e4f0", margin: "28px 0 12px" }}>{trimmed.slice(3)}</h2>;
    if (trimmed.startsWith("- **"))
      return <li key={i} style={{ marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong style='color:#e0d4f5'>$1</strong>") }} />;
    if (trimmed.startsWith("| "))
      return <p key={i} style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "2px 0" }}>{trimmed}</p>;
    if (!trimmed) return <br key={i} />;
    return <p key={i} style={{ margin: "0 0 8px" }} dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#e0d4f5'>$1</strong>").replace(/\u201c(.*?)\u201d/g, "\u201c<em>$1</em>\u201d") }} />;
  });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const article = ARTICLES[slug];
  if (!article) return <Navigate to="/blog" replace />;

  return (
    <div style={S.page}>
      <SeoHead title={article.title} description={article.body.trim().slice(0, 155)} path={`/blog/${slug}`} />
      <div style={S.container}>
        <Link to="/blog" style={S.back}>&larr; Blog</Link>
        <div style={S.tag}>{article.tag}</div>
        <h1 style={S.title}>{article.title}</h1>
        <p style={S.meta}>{article.date} &bull; {article.readMin} dk okuma</p>
        <div style={S.body}>{renderMarkdown(article.body)}</div>
        <div style={S.ctaWrap}>
          <Link to={article.cta.link} style={S.cta}>{article.cta.text}</Link>
        </div>
      </div>
    </div>
  );
}
