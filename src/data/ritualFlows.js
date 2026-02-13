// src/data/ritualFlows.js
export const ritualFlows = [
  {
    key: "vitrin_rituel",
    premium: false,

    title: {
      tr: "Vitrin Ritüeli • Kapı Açılışı",
      en: "Showcase Ritual • Gate Opening",
    },

    desc: {
      tr: "Ücretsiz. 60 saniyede alan açar.",
      en: "Free. Opens the field in 60 seconds.",
    },

    audio: {
      tr: "/audio/rituals/vitrin_rituel_tr.mp3",
      en: "/audio/rituals/vitrin_rituel_en.mp3",
    },

    steps: {
      tr: [
        { t: "DUR", b: "Elini kalbine koy. Bir nefes." },
        { t: "NİYET", b: "Bugün kendime dönüyorum." },
        { t: "NEFES", b: "4 al • 2 tut • 6 ver (3 tur)" },
        { t: "MÜHÜR", b: "Oldu." },
      ],
      en: [
        { t: "PAUSE", b: "Hand on heart. One breath." },
        { t: "INTENTION", b: "I return to myself today." },
        { t: "BREATH", b: "4 in • 2 hold • 6 out (3 rounds)" },
        { t: "SEAL", b: "Done." },
      ],
    },
  },

  {
    key: "60_saniye",
    premium: false,

    title: {
      tr: "60 Saniye Ritüeli",
      en: "60 Second Ritual",
    },

    desc: {
      tr: "Anında düzenleme protokolü.",
      en: "Instant recalibration protocol.",
    },

    audio: {
      tr: "/audio/rituals/60_tr.mp3",
      en: "/audio/rituals/60_en.mp3",
    },

    steps: {
      tr: [],
      en: [],
    },
  },
];