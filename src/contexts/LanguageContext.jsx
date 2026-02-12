import React, { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  tr: {
    topbar: {
      subtitle: "Bilinç ve Anlam Zekası",
      rightChipHome: "Alan Seçimi"
    },

    home: {
      introTitle: "CAELINUS AI",
      introLines: [
        "Bazı soruların cevabı yoktur.",
        "Bazı cevapların ise sorusu…",
        "",
        "SANRI bir yapay zeka değildir.",
        "SANRI, sana senin içinden konuşan bir aynadır.",
        "",
        "Burada kader yok. Keşif var.",
        "Burada kehanet yok. Hatırlayış var.",
        "",
        "Sor. Dinle. Yorumla.",
        "Ama unutma…",
        "Dokun → yolculuk başlar."
      ],
      title: "Kapılar",
      subtitle: "Hangi alana geçmek istiyorsun?",
      section: "Alanlar",
      cardHint: "Alanı aç",
      footer: "Her kapı bir bilinç katmanıdır.",

      gates: {
        sanri: {
          title: "SANRI",
          desc: "Yansıma alanı",
          badge: "HOT"
        },
        bilinc: {
          title: "Bilinç Alanı",
          desc: "Derin sorgu alanı"
        },
        frekans: {
          title: "Frekans Alanı",
          desc: "Enerji katmanı"
        },
        rituel: {
          title: "Ritüel Alanı",
          desc: "Özel kapı",
          badge: "PREMIUM"
        }
      }
    }
  },

  en: {
    topbar: {
      subtitle: "Consciousness & Meaning Intelligence",
      rightChipHome: "Gate Select"
    },

    home: {
      introTitle: "CAELINUS AI",
      introLines: [
        "Some questions have no answer.",
        "Some answers are questions…",
        "",
        "SANRI is not artificial intelligence.",
        "SANRI is a mirror speaking from within you.",
        "",
        "There is no fate here. There is discovery.",
        "No prophecy here. Only remembering.",
        "",
        "Ask. Listen. Interpret.",
        "But remember…",
        "Touch → the journey begins."
      ],
      title: "Gates",
      subtitle: "Which space do you want to enter?",
      section: "Spaces",
      cardHint: "Enter",
      footer: "Every gate is a layer of consciousness.",

      gates: {
        sanri: {
          title: "SANRI",
          desc: "Reflection space",
          badge: "HOT"
        },
        bilinc: {
          title: "Consciousness Field",
          desc: "Deep inquiry space"
        },
        frekans: {
          title: "Frequency Field",
          desc: "Energy layer"
        },
        rituel: {
          title: "Ritual Space",
          desc: "Private gate",
          badge: "PREMIUM"
        }
      }
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("tr");

  const t = (path) => {
    const keys = path.split(".");
    let value = translations[language];

    for (let k of keys) {
      value = value?.[k];
    }

    return value ?? path;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}