// src/data/rituelFlows.js

export const rituelFlows = [
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
        { t: "NİYET", b: "“Bugün kendime dönüyorum.”" },
        { t: "NEFES", b: "4 al • 2 tut • 6 ver (3 tur)." },
        { t: "MÜHÜR", b: "“Oldu.”" },
      ],
      en: [
        { t: "PAUSE", b: "Hand on heart. One breath." },
        { t: "INTENTION", b: "“I return to myself today.”" },
        { t: "BREATH", b: "4 in • 2 hold • 6 out (3 rounds)." },
        { t: "SEAL", b: "“Done.”" },
      ],
    },
  },

  // Aşağıya diğer ritüellerin burada olduğu gibi devam edecek:
  // ÖRNEK: rituel_60 (senin mevcut içeriğini buraya taşıyacağız)
  {
    key: "rituel_60",
    title: { tr: "60 Saniye Ritüeli", en: "60-Second Ritual" },
    desc: { tr: "Anında düzenleme protokolü.", en: "Instant regulation protocol." },
    premium: true,
    audio: {
      tr: "/audio/rituels/rituel_60_tr.mp3",
      en: "/audio/rituels/rituel_60_en.mp3",
    },
    steps: {
      tr: [{ t: "NİYET", b: "Niyetini yaz." }],
      en: [{ t: "INTENTION", b: "Write your intention." }],
    },
  },
];

export default rituelFlows;