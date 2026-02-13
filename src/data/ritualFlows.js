// src/data/ritualFlows.js
export const ritualFlows = [
  {
    key: "vitrin_rituel",
    title: { tr: "Vitrin Ritüeli • Kapı Açılışı", en: "Showcase Ritual • Door Opening" },
    desc: { tr: "Ücretsiz. 60 saniyede alan açar.", en: "Free. Opens the field in 60 seconds." },
    premium: false,
    audio: {
      tr: "/audio/rituels/vitrin_tr.mp3",
      en: "/audio/rituels/vitrin_en.mp3",
    },
    steps: {
      tr: [
        { t: "DUR", b: "Elini kalbine koy. Bir nefes." },
        { t: "NİYET", b: "Bugün kendime dönüyorum." },
        { t: "NEFES", b: "4 al • 2 tut • 6 ver (3 tur)." },
        { t: "MÜHÜR", b: "Oldu." },
      ],
      en: [
        { t: "PAUSE", b: "Hand on heart. One breath." },
        { t: "INTENTION", b: "I return to myself today." },
        { t: "BREATH", b: "4 in • 2 hold • 6 out (3 rounds)." },
        { t: "SEAL", b: "Done." },
      ],
    },
  },

  {
    key: "rituel_60",
    title: { tr: "60 Saniye Ritüeli", en: "60-Second Ritual" },
    desc: { tr: "Anında düzenleme protokolü.", en: "Instant regulation protocol." },
    premium: true,
    audio: {
      tr: "/audio/rituels/60_tr.mp3",
      en: "/audio/rituels/60_en.mp3",
    },
    steps: {
      tr: [
        { t: "Sakinlik", b: "Omuzlarını indir. Çeneni yumuşat." },
        { t: "Nefes", b: "3 nefes: uzun veriş." },
        { t: "Yön", b: "Bugün hangi frekansta kalmalıyım?" },
      ],
      en: [
        { t: "Calm", b: "Drop your shoulders. Relax your jaw." },
        { t: "Breath", b: "3 breaths: longer exhale." },
        { t: "Direction", b: "What frequency should I hold today?" },
      ],
    },
  },
];