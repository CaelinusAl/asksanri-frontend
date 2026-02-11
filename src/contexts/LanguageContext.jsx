import React, { createContext, useContext, useMemo, useState } from "react";
import { sanriI18n } from "../i18n/sanri";

const LanguageContext = createContext(null);

// Base minimal common i18n (istersen büyütürüz)
const baseTranslations = {
  tr: {
    common: {
      loading: "Yükleniyor...",
      error: "Bir hata oluştu",
      send: "Gönder",
      reset: "Sıfırla",
      reflect: "Yansıt (Ctrl+Enter)",
      reflecting: "Yansıtılıyor…",
      voiceInput: "Sesle yaz",
      stop: "Durdur",
      mode: "Mod",
      domain: "Domain (opsiyonel)",
      guide: "Kılavuz",
      reflectionFlow: "Yansıma Akışı",
      reflection: "Yansıma",
      reflectionEmpty: "Yansıma burada belirecek.",
    },
  },
  en: {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      send: "Send",
      reset: "Reset",
      reflect: "Reflect (Ctrl+Enter)",
      reflecting: "Reflecting…",
      voiceInput: "Voice input",
      stop: "Stop",
      mode: "Mode",
      domain: "Domain (optional)",
      guide: "Guide",
      reflectionFlow: "Reflection Flow",
      reflection: "Reflection",
      reflectionEmpty: "Your reflection will appear here.",
    },
  },
};

// Deep key resolver: t("sanri.title") gibi
function getNested(obj, path) {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("caelinus-lang");
    return saved === "en" ? "en" : "tr";
  });

  const translations = useMemo(() => {
    return {
      tr: { ...baseTranslations.tr, ...sanriI18n.tr },
      en: { ...baseTranslations.en, ...sanriI18n.en },
    };
  }, []);

  const t = useMemo(() => {
    return (key, fallback) => {
      const value = getNested(translations[language], key);
      if (value === undefined || value === null) return fallback ?? key;
      return value;
    };
  }, [language, translations]);

  const setLang = (lang) => {
    const safe = lang === "en" ? "en" : "tr";
    localStorage.setItem("caelinus-lang", safe);
    setLanguage(safe);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
