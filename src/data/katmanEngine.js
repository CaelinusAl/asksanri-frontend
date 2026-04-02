/* ═══════════════════════════════════════════════════
   KATMANLI AÇILIM ENGINE
   Theme detection + dynamic recommendation mapping
   ═══════════════════════════════════════════════════ */

const KATMAN_DEFS = {
  iliski: {
    id: "iliski_acilimi",
    icon: "◈",
    question: "İlişkilerinde neden hep aynı şeyi yaşıyorsun?",
    teaser:
      "Belki sorun karşındaki kişi değil. Belki sen hep aynı aynaya bakıyorsun.",
    cta: "Bunu açabilirsin.",
    price: "369",
    productId: "iliski_acilimi",
    contentId: "iliski_acilimi",
    modalLines: [
      "Hep aynı kişiyi mi seçiyorsun?",
      "Yoksa aynı kişi seni mi buluyor?",
      "",
      "İlişki Açılımı'nda:",
      "• tekrar eden ilişki kalıbın",
      "• çektiğin ve kaçtığın enerji",
      "• ilişkide gizli rolün",
      "sana özel olarak açılır.",
    ],
    themes: ["tekrar", "bağlanma", "korku", "bırakma", "değer", "güven"],
    weight: 10,
  },
  para: {
    id: "para_akisi",
    icon: "✦",
    question: "Para neden sana akmıyor?",
    teaser:
      "Para sana gelmiyor olabilir. Ama belki de sen ona kapalısın.",
    cta: "Bunu açabilirsin.",
    price: "369",
    productId: "para_akisi",
    contentId: "para_akisi",
    modalLines: [
      "Para bir enerji akışıdır.",
      "Ve her akış bir blokaj taşır.",
      "",
      "Para Akışı Açılımı'nda:",
      "• bolluk blokajın",
      "• para ile ilişki kalıbın",
      "• enerji sızıntı noktaların",
      "sana özel olarak açılır.",
    ],
    themes: ["kontrol", "değer", "korku", "sıkışma", "güven"],
    weight: 9,
  },
  kariyer: {
    id: "kariyer_acilimi",
    icon: "⟁",
    question: "Kariyerinde neden ilerlemiyorsun?",
    teaser:
      "Belki sorun çalışmak değil. Yanlış yönde gitmek.",
    cta: "Bunu açabilirsin.",
    price: "369",
    productId: "kariyer_acilimi",
    contentId: "kariyer_acilimi",
    modalLines: [
      "Bir şeyi çok çalışarak elde edemiyorsan,",
      "belki o şey senin yolun değildir.",
      "",
      "Kariyer Açılımı'nda:",
      "• gerçek yön enerjin",
      "• sıkışma döngün",
      "• göremediğin fırsat alanın",
      "sana özel olarak açılır.",
    ],
    themes: ["sıkışma", "kontrol", "tekrar", "yön", "belirsizlik"],
    weight: 8,
  },
  haftalik: {
    id: "haftalik_akis",
    icon: "☽",
    question: "Her hafta aynı şeyi yaşıyorsun.",
    teaser:
      "Sadece fark etmiyorsun. İstersen bu haftanın kodunu açabilirsin.",
    cta: "Bu haftayı aç.",
    price: "69",
    productId: "haftalik_akis",
    contentId: "haftalik_akis",
    modalLines: [
      "Her hafta bir frekans taşır.",
      "Ve sen o frekansın içindesin — görmesen bile.",
      "",
      "Haftalık Akış'ta:",
      "• bu haftanın ana teması",
      "• dikkat etmen gereken alan",
      "• sana özel SANRI mesajı",
      "her hafta yenilenir.",
    ],
    themes: ["tekrar", "belirsizlik", "yorgunluk", "boşluk"],
    weight: 7,
    isWeekly: true,
  },
  saglik: {
    id: "saglik_enerji",
    icon: "∞",
    question: "Bedenin konuşuyor.",
    teaser: "Ama sen dinlemiyorsun. İstersen bu mesajı açabilirsin.",
    cta: "Bunu açabilirsin.",
    price: "369",
    productId: "saglik_enerji",
    contentId: "saglik_enerji",
    modalLines: [
      "Beden rastgele sinyal vermez.",
      "Her ağrı, her yorgunluk, her tıkanma bir mesaj taşır.",
      "",
      "Sağlık & Enerji Katmanı'nda:",
      "• bedensel enerji haritanın",
      "• tıkanma noktaların",
      "• bedenin sana ne söylüyor",
      "sana özel olarak açılır.",
    ],
    themes: ["yorgunluk", "bırakma", "boşluk", "bastırma"],
    weight: 6,
  },
};

const THEME_KEYWORDS = {
  kontrol: [
    "kontrol", "kontrolcü", "yönetici", "düzenleyici", "planlayıcı",
    "güç", "otorite", "perfeksiyonist",
  ],
  korku: [
    "korku", "kaygı", "endişe", "panik", "savunma", "kaçış",
    "güvensiz", "tehdit",
  ],
  tekrar: [
    "tekrar", "döngü", "kalıp", "pattern", "tekrarlayan", "aynı",
    "sürekli", "yine",
  ],
  bırakma: [
    "bırakma", "tutunma", "bağlanma", "yas", "kayıp", "ayrılık",
    "tamamlanmamış", "geçmiş",
  ],
  değer: [
    "değer", "özsaygı", "yeterlilik", "onay", "kabul",
    "yetersiz", "hak etmek",
  ],
  sıkışma: [
    "sıkışma", "tıkanma", "durgunluk", "blokaj", "ilerleyememe",
    "çıkmaz",
  ],
  güven: [
    "güven", "güvensiz", "ihanet", "sadakat", "koruma",
  ],
  belirsizlik: [
    "belirsiz", "kararsız", "yön", "bilinmeyen", "kaybolmuş",
  ],
  yorgunluk: [
    "yorgun", "bitkin", "tükenme", "enerji", "motivasyon",
  ],
  boşluk: [
    "boşluk", "anlamsız", "hiçlik", "yalnız", "kopuş",
  ],
  bastırma: [
    "bastırma", "bastırılmış", "gizli", "söylenmemiş", "sessiz",
  ],
  bağlanma: [
    "bağlanma", "bağımlı", "ayrılamama", "yapışma", "takıntı",
  ],
  yön: [
    "yön", "amaç", "misyon", "hedef", "nereye",
  ],
};

/**
 * Detect themes from analysis data (Matrix Rol or AN_KOD answers).
 * Returns sorted array of theme strings.
 */
export function detectThemes(data = {}) {
  const themes = new Map();

  const textPool = [
    data.matrix_role,
    data.name_archetype,
    data.life_path_archetype,
    data.teaser,
    ...(data.sectionTexts || []),
    ...(data.answers ? Object.values(data.answers) : []),
    data.reading,
    data.reflection,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (textPool.includes(kw)) score += 1;
    }
    if (score > 0) themes.set(theme, score);
  }

  if (themes.size === 0) {
    return ["tekrar", "kontrol", "değer"];
  }

  return [...themes.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
}

/**
 * Get recommended katmanlar based on detected themes.
 * Always returns 3-5 items, sorted by relevance.
 */
export function getRecommendations(detectedThemes = [], unlockedIds = []) {
  const scored = [];

  for (const [, katman] of Object.entries(KATMAN_DEFS)) {
    if (unlockedIds.includes(katman.contentId)) continue;

    let score = katman.weight;
    for (const theme of detectedThemes) {
      if (katman.themes.includes(theme)) {
        const themeIdx = detectedThemes.indexOf(theme);
        score += (detectedThemes.length - themeIdx) * 3;
      }
    }

    scored.push({ ...katman, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5);
}

/**
 * Get all katman definitions (for browse mode).
 */
export function getAllKatmanlar() {
  return Object.values(KATMAN_DEFS);
}
