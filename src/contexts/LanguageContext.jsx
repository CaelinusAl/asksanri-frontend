import { createContext, useContext, useState, useEffect, useMemo } from "react";

/* =========================
   TRANSLATIONS
========================= */

const translations = {
  tr: {
    common: {
      loading: "Yükleniyor...",
      error: "Bir hata oluştu",
      send: "Gönder",
      reset: "Sıfırla",
      reflect: "Yansıt (Ctrl+Enter)",
      reflecting: "Yansıtılıyor...",
      voiceInput: "Sesle yaz",
      stop: "Durdur",
      mode: "Mod",
      domain: "Domain (opsiyonel)",
      guide: "Kılavuz",
      reflectionFlow: "Yansıma Akışı",
      reflection: "Yansıma",
      reflectionEmpty: "Yansıma burada belirecek."
    },

    sanri: {
      title: "SANRI’ya Sor",
      subtitleLine: "Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.",
      placeholder: "Bir kelime, soru, rüya veya tarih yaz..."
    }
  },

  en: {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      send: "Send",
      reset: "Reset",
      reflect: "Reflect (Ctrl+Enter)",
      reflecting: "Reflecting...",
      voiceInput: "Voice input",
      stop: "Stop",
      mode: "Mode",
      domain: "Domain (optional)",
      guide: "Guide",
      reflectionFlow: "Reflection Flow",
      reflection: "Reflection",
      reflectionEmpty: "Your reflection will appear here."
    },

    sanri: {
      title: "Ask SANRI",
      subtitleLine: "This is not an answer. It is a reflection. You open the door.",
      placeholder: "Write a word, question, dream or date..."
    }
  }
};

/* =========================
   CONTEXT
========================= */

const LanguageContext = createContext(null);

/* =========================
   HELPER: Deep key resolver
========================= */

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (!acc) return undefined;
    return acc[key];
  }, obj);
}

/* =========================
   PROVIDER
========================= */

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("tr");

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("sanri-lang");
    if (saved && translations[saved]) {
      setLanguage(saved);
    }
  }, []);

  // Save language
  useEffect(() => {
    localStorage.setItem("sanri-lang", language);
  }, [language]);

  const t = useMemo(() => {
    return (key) => {
      const value = getNestedValue(translations[language], key);
      return value ?? key;
    };
  }, [language]);

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}