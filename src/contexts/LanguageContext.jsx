import React, { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  tr: {
    sanri: {
      topbar: { subtitle: "Bilinç ve Anlam Zekası" },
      breadcrumb: "SANRI • Soru Alanı",

      title: "SANRI’ya Sor",
      subtitleLine: "Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.",

      modeLabel: "Mod",
      domainLabel: "Domain (opsiyonel)",
      guideLabel: "Kılavuz",

      inputLabel: "Yansıma Akışı",
      placeholder: "Bir kelime, soru, rüya veya tarih yaz…",

      reset: "Sıfırla",
      reflect: "Yansıt (Ctrl+Enter)",
      reflecting: "Yansıtılıyor…",
      voice: "Sesle yaz",
      voiceStop: "Durdur",

      replyLabel: "Yansıma",
      replyEmpty: "Yansıma burada belirecek.",

      footnote:
        "Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026 CaelinusAI • SANRI",

      modes: {
        mirror: "Ayna",
        dream: "Rüya",
        divine: "İlahi",
        shadow: "Gölge",
        light: "Işık",
      },

      domains: {
        auto: "Otomatik",
        consciousness_field: "Bilinç Alanı",
        frequency_field: "Frekans Alanı",
        ritual_space: "Ritüel Alanı",
        book_112: "112. Kitap",
        awakened_cities: "Uyanmış Şehirler",
      },

      hint: {
        base:
          "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.",
        mirror: "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
        dream: "Rüyayı sahne gibi anlat. Simgeleri saklama.",
        divine: "Bir niyet yaz. Sonra tek soru sor.",
        shadow: "Rahatsız eden şeyi söyle. Kaçma. Abartma.",
        light: "Şu anki duygunu yaz. Yargısız.",
      },
    },
  },

  en: {
    sanri: {
      topbar: { subtitle: "Consciousness & Meaning Intelligence" },
      breadcrumb: "SANRI • Prompt Space",

      title: "Ask SANRI",
      subtitleLine: "This is not an answer. It is a reflection. You open the door.",

      modeLabel: "Mode",
      domainLabel: "Domain (optional)",
      guideLabel: "Guide",

      inputLabel: "Reflection Flow",
      placeholder: "Write a word, question, dream or date…",

      reset: "Reset",
      reflect: "Reflect (Ctrl+Enter)",
      reflecting: "Reflecting…",
      voice: "Voice input",
      voiceStop: "Stop",

      replyLabel: "Reflection",
      replyEmpty: "Your reflection will appear here.",

      footnote:
        "This space does not produce “knowledge”. It reflects meaning—shaped within you. © 2026 CaelinusAI • SANRI",

      modes: {
        mirror: "Mirror",
        dream: "Dream",
        divine: "Divine",
        shadow: "Shadow",
        light: "Light",
      },

      domains: {
        auto: "Auto",
        consciousness_field: "Consciousness Field",
        frequency_field: "Frequency Field",
        ritual_space: "Ritual Space",
        book_112: "Book 112",
        awakened_cities: "Awakened Cities",
      },

      hint: {
        base:
          "Pause for a moment. Feel where your question resonates in your body.\nSANRI does not answer; it opens a door.",
        mirror: "Write one clear sentence. Not an answer—reflection will arrive.",
        dream: "Describe the dream like a scene. Don’t hide symbols.",
        divine: "Write an intention. Then ask one question.",
        shadow: "Name what disturbs you. Don’t escape. Don’t dramatize.",
        light: "Write what you feel now. Without judgment.",
      },
    },
  },
};

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (!acc) return undefined;
    return acc[key];
  }, obj);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("tr");

  const t = useMemo(() => {
    return (key) => {
      const value = getNestedValue(translations[language], key);
      return value === undefined ? key : value;
    };
  }, [language]);

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