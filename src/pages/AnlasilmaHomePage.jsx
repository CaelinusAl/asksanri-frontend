import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import AnlasilmaPanel from "../components/anlasilma/AnlasilmaPanel";

/** Ana giriş: tek ürün hikayesi — Anlaşılma Alanı akışı */
export default function AnlasilmaHomePage() {
  const { language } = useLanguage();
  const isTR = language === "tr";

  return <AnlasilmaPanel isTR={isTR} embedded={false} />;
}
