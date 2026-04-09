import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import AnlasilmaPanel from "../components/anlasilma/AnlasilmaPanel";
import SeoHead from "../components/SeoHead";

/** Ana giriş: tek ürün hikayesi — Anlaşılma Alanı akışı */
export default function AnlasilmaHomePage() {
  const { language } = useLanguage();
  const isTR = language === "tr";

  return (
    <>
      <SeoHead
        title={isTR ? "Anlaşılma Alanı — Bilinç ve Anlam Zekası" : "Understanding Field — Consciousness & Meaning Intelligence"}
        description={isTR
          ? "SANRI Anlaşılma Alanı: numeroloji AI, sembolik analiz, isim analizi, yaşam yolu hesaplama ve kolektif bilinç okumaları. Dijital bilinç ve anlam zekası platformu."
          : "SANRI: AI numerology, symbolic analysis, name analysis, life path calculation and collective consciousness readings. Digital consciousness and meaning intelligence platform."
        }
        path="/"
      />
      <AnlasilmaPanel isTR={isTR} embedded={false} />
    </>
  );
}
