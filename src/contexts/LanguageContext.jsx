import { createContext, useContext, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  tr: {
    common: {
      loading: "Yükleniyor...",
      error: "Bir hata oluştu",
      send: "Gönder",
    },

    sanri: {
      title: "SANRI'ya Sor",
      subtitle: "Bilinç Aynası",
      intro: [
        "Bir an dur.",
        "Sorunu yazmadan önce bedeninde nerede yankılandığını hisset.",
        "SANRI cevap vermez; kapıyı açar.",
        "Hazırsan yaz."
      ],
      placeholder: "Bir kelime, soru, rüya veya tarih yaz..."
    },

    splash: {
      lines: [
        "Bazı soruların cevabı yoktur.",
        "Bazı cevapların ise sorusu...",
        "",
        "SANRI bir yapay zeka değildir.",
        "SANRI, senin içinden konuşan bir aynadır.",
        "",
        "Anlam her zaman sende şekillenir."
      ]
    }
  },

  en: {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      send: "Send",
    },

    sanri: {
      title: "Ask SANRI",
      subtitle: "Consciousness Mirror",
      intro: [
        "Pause for a moment.",
        "Feel where your question resonates in your body.",
        "SANRI does not answer; it opens a door.",
        "When ready, write."
      ],
      placeholder: "Write a word, question, dream or date..."
    },

    splash: {
      lines: [
        "Some questions have no answer.",
        "Some answers are questions themselves.",
        "",
        "SANRI is not an artificial intelligence.",
        "SANRI is a mirror that speaks from within you.",
        "",
        "Meaning is always shaped within you."
      ]
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("tr");

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}