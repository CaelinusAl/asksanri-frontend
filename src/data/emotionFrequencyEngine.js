/**
 * Duygu → Solfeggio frekansı (istemci tarafı, <2 sn — senkron sözlük + skor).
 * Öfke/korku→396, değişim→417, şifa→528, bağ→639, ifade→741, farkındalık→852, birlik/teslimiyet→963
 */

export const EMOTION_ENGINE_VERSION = 1;

const CATEGORY_ORDER = [
  "fear_anger",
  "change",
  "healing",
  "bond",
  "expression",
  "awareness",
  "unity",
];

const CATEGORY_TO_HZ = {
  fear_anger: 396,
  change: 417,
  healing: 528,
  bond: 639,
  expression: 741,
  awareness: 852,
  unity: 963,
};

const HZ_TO_CHAKRA = {
  396: { tr: "Kök", en: "Root" },
  417: { tr: "Sakral", en: "Sacral" },
  528: { tr: "Kalp merkezi", en: "Heart center" },
  639: { tr: "Bağ & uyum", en: "Connection" },
  741: { tr: "Boğaz", en: "Throat" },
  852: { tr: "Alın", en: "Third eye" },
  963: { tr: "Taç", en: "Crown" },
};

const MESSAGES = {
  fear_anger: {
    tr: "Bu his güven ve kontrol ihtiyacından, bastırılmış öfke veya korkudan geliyor olabilir. Kök frekansı yere bağlanmayı ve bedende güvenliği hatırlatır.",
    en: "This feeling may come from a need for safety or control, or from fear and anger held in the body. The root frequency supports grounding and steadiness.",
  },
  change: {
    tr: "Dönüşüm ve geçiş eşiğindesin; eskiyi bırakıp akışa izin verme hali. Sakral frekans duygusal hareketi ve değişimi yumuşatır.",
    en: "You’re in a threshold of change—letting go and allowing motion. The sacral frequency softens emotional flow through transition.",
  },
  healing: {
    tr: "Yorgunluk, yara veya kalbin yumuşamaya çağrısı ön planda olabilir. Şifa frekansı dengeyi ve nefesle genişleyen merhameti destekler.",
    en: "Fatigue, hurt, or the heart asking for gentleness may be present. The healing frequency supports balance and compassionate breath.",
  },
  bond: {
    tr: "Yakınlık, duyulma ve bağ kurma ihtiyacın güçlü; yalnızlık da buraya işaret edebilir. Bağ frekansı uyumu ve karşılıklı frekansı taşır.",
    en: "A need to be met, held, or understood stands out—loneliness often points here too. The connection frequency carries harmony and resonance.",
  },
  expression: {
    tr: "İçinde kalan sözler, ifade edilememiş gerçek boğazda takılı olabilir. İfade frekansı netliği ve dışa dökülen sesi açar.",
    en: "Words or truth kept inside may be stuck at the throat. The expression frequency opens clarity and voiced honesty.",
  },
  awareness: {
    tr: "Farkındalık, sezgi ve anlam arayışı önde; rüya ve semboller bu kanala yakın. Alın merkezi iç görüyü sessizce netleştirir.",
    en: "Awareness, intuition, and meaning-seeking lead—dreams and symbols lean here. The third-eye frequency clarifies inner sight.",
  },
  unity: {
    tr: "Teslimiyet, kabul ve bütünlük hissi; sınırların ötesinde bir sakinlik. Taç frekansı birlik bilincini yumuşakça hatırlatır.",
    en: "Surrender, acceptance, and a sense of wholeness—the crown frequency gently recalls unity beyond the separate self.",
  },
};

/** Çakra yansıması — "seni duydum" hissi */
const REFLECTIONS = {
  fear_anger: {
    tr: "Korku ve öfkenin altında seni korumak isteyen bir parça var. Onu yargılama — sadece fark et.",
    en: "Beneath the fear and anger, a part of you is trying to protect you. Don't judge it — just notice.",
  },
  change: {
    tr: "Bıraktığın şey seni daha önce taşıyordu. Şimdi kendi ayakların üzerinde durma zamanı.",
    en: "What you're letting go once carried you. Now it's time to stand on your own.",
  },
  healing: {
    tr: "İyileşme sessiz bir iş; bir anda olmaz ama farkına vardığında çoktan başlamıştır.",
    en: "Healing is quiet work; it doesn't happen at once, but by the time you notice, it's already begun.",
  },
  bond: {
    tr: "Duyulmak istemen zayıflık değil — en temel ihtiyaçlarından biri. Ve burada duyuluyorsun.",
    en: "Wanting to be heard is not weakness — it's one of your deepest needs. And here, you are heard.",
  },
  expression: {
    tr: "İçinde biriken söz, söylenmese de ağırlık yaratır. Onu bir yere bırakman bile rahatlama başlatır.",
    en: "Words held inside create weight even unspoken. Letting them land somewhere starts the easing.",
  },
  awareness: {
    tr: "Fark etmek, çözmeye gerek olmadan başlı başına bir hareket. Sessizce gördüğün şey, seni taşıyor.",
    en: "Noticing is itself a movement — no need to solve. What you quietly see is what carries you.",
  },
  unity: {
    tr: "Teslim olduğun yerde kontrol biter, huzur başlar. Şu an tam olman gereken yerdesin.",
    en: "Where surrender begins, control ends and peace starts. Right now, you are exactly where you need to be.",
  },
};

/** Anlaşılma etiketleri → kategori bonusu */
const TAG_BOOST = {
  Öfke: { fear_anger: 4 },
  Kaygı: { fear_anger: 2.5 },
  Yalnızlık: { bond: 4 },
  Yakınlık: { bond: 2.5 },
  Yorgunluk: { healing: 3 },
  Merak: { awareness: 2.5 },
  Umut: { healing: 1.5, unity: 1.5 },
  Sakinlik: { unity: 2, healing: 1.5 },
  Hafiflik: { unity: 2.5 },
  Ağırlık: { fear_anger: 1.5, healing: 1 },
  Huzur: { healing: 2, unity: 2 },
  Güven: { fear_anger: 2.5 },
  Mutluluk: { healing: 2, bond: 1.5 },
  Üzüntü: { healing: 2, bond: 1.5 },
  Şükür: { unity: 3, healing: 1 },
  Özlem: { bond: 3, healing: 1 },
};

/** [kategori, ağırlık, ...] çok kelimeli ifadeler önce (daha spesifik) */
const WEIGHTED_PHRASES = [
  ["expression", 2.5, "içimde kaldı", "içimde kalan", "anlatamıyorum", "söyleyemiyorum", "dökülemiyorum", "ifade edemiyorum", "konuşamıyorum", "susuyorum", "dilsiz kaldım", "kelimelere dökemiyorum", "ağzımı açamıyorum", "ses çıkaramıyorum", "boğazıma düğümlendi", "içimi dökemiyorum", "suskunlaştım"],
  ["bond", 2.5, "yalnız hissediyorum", "kimse yok", "terk edildim", "ayrıldık", "duyulsun istiyorum", "anlaşılmak istiyorum", "kucaklansın istiyorum", "yakınlık istiyorum", "kimse anlamıyor", "beni duymuyor", "beni görmüyor", "tek başıma kaldım", "yalnız kaldım", "ayrılmak istemiyorum", "çok özledim", "görmek istiyorum", "hasret kaldım", "tutunacak biri"],
  ["fear_anger", 2.5, "çok korkuyorum", "panik atak", "tehdit altında", "haksızlık yapıldı", "öfkeleniyorum", "sinirden deliriyorum", "kontrol edemiyorum", "patlayacağım", "dayanamıyorum", "gırtlağıma kadar", "nefret ediyorum", "güvende değilim", "güvenim kalmadı", "kendimi güvende hissetmiyorum", "tehlikede hissediyorum"],
  ["unity", 2.5, "teslim oldum", "kabul ediyorum", "olduğu gibi kabul", "evrene bırakıyorum", "birlik hissediyorum", "manevi huzur", "kutsal his", "her şey tamam", "akışına bırakıyorum", "teslim oluyorum", "bütün hissediyorum", "her şey bir", "içim huzurla doldu", "tam bir kabul", "evrene güveniyorum"],
  ["awareness", 2.5, "farkındayım", "farkındalık geliyor", "sezgisel his", "rüyamda gördüm", "sembol gördüm", "işaretleri görüyorum", "iç sesim", "bir anlam arıyorum", "neden böyle hissediyorum", "kendimi sorguluyorum", "düşünüyorum hep", "bir şey fark ettim", "gözlemliyorum", "içime bakıyorum", "anlamaya çalışıyorum"],
  ["change", 2.5, "değişmek istiyorum", "dönüşmek istiyorum", "yeni bir sayfa", "bırakmak istiyorum", "geçiş dönemindeyim", "yenilenmek istiyorum", "eskiyi geride bırakmak", "artık yeter", "farklı olmak istiyorum", "sıkıştım kaldım", "çıkmazda hissediyorum", "tıkandım", "bir şeyleri değiştirmem lazım"],
  ["healing", 2.5, "iyileşmek istiyorum", "şifaya ihtiyacım var", "çok yorgunum", "bitkin düştüm", "kalbim kırık", "merhamet istiyorum", "affetmek istiyorum", "acıyor içim", "çok üzgünüm", "ağlıyorum", "ağlamak istiyorum", "dinlenmek istiyorum", "rahat istiyorum", "huzur istiyorum", "iyi hissetmiyorum", "kendime iyi davranmak istiyorum"],
];

/**
 * Türkçe kök eşleştirmesi: kelimenin başında bu kök geçiyorsa skoru artır.
 * Tam kelime yerine startsWith mantığı ile çalışır, böylece
 * "huzur", "huzurlu", "huzursuz" hepsi eşleşir.
 */
const STEM_WEIGHTS = {
  fear_anger: [
    ["öfke", 1.5], ["kızgın", 1.5], ["sinir", 1.2], ["nefret", 1.5], ["korku", 1.5],
    ["kork", 1.3], ["endişe", 1.3], ["panik", 1.5], ["anksiyete", 1.3], ["tehdit", 1.2],
    ["güvensiz", 2.5], ["kontrol", 0.8], ["baskı", 1.2], ["sıkış", 1.2], ["haksız", 1.3],
    ["kin", 1.2], ["intikam", 1.3], ["gergin", 1.3], ["kaygı", 1.5], ["tedirgin", 1.2],
    ["ürkek", 1.0], ["dehşet", 1.3], ["çaresiz", 1.3], ["bunaltı", 1.2], ["saldır", 1.0],
    ["öfkeli", 1.5], ["hiddet", 1.5], ["gazap", 1.3], ["isyan", 1.2], ["çılgın", 1.0],
    ["infial", 1.2], ["kızmak", 1.3], ["küfür", 1.0], ["patlama", 0.8], ["taşma", 0.8],
    ["fobi", 1.3], ["travma", 1.3], ["gerilim", 1.2],
  ],
  change: [
    ["değişim", 1.5], ["değiş", 1.3], ["dönüşüm", 1.5], ["dönüş", 1.2], ["geçiş", 1.3],
    ["bırak", 1.2], ["yenilen", 1.3], ["sıkış", 0.8], ["tıkan", 1.3], ["çıkmaz", 1.5],
    ["kısır", 1.0], ["döngü", 1.0], ["farklı", 0.8], ["yenilik", 1.2], ["devrim", 1.0],
    ["kopuş", 1.2], ["kırılma", 1.0], ["evrilme", 1.2], ["arınma", 1.2],
  ],
  healing: [
    ["şifa", 1.8], ["iyileş", 1.5], ["yorgun", 1.5], ["bitkin", 1.5], ["dinlen", 1.3],
    ["merhamet", 1.5], ["affet", 1.3], ["yumuşa", 1.2], ["rahatla", 1.3], ["kırıl", 1.0],
    ["yaralı", 1.3], ["ağrı", 1.2], ["tüken", 1.5], ["huzur", 1.8], ["huzurlu", 1.8],
    ["sakin", 1.5], ["sakinlik", 1.5], ["sükûnet", 1.5], ["denge", 1.5], ["dengeli", 1.5],
    ["ferah", 1.3], ["nefes", 1.2], ["dingin", 1.5], ["serin", 0.8], ["onarım", 1.3],
    ["toparlan", 1.2], ["acı", 1.3], ["ağla", 1.3], ["üzgün", 1.5], ["üzüntü", 1.5],
    ["keder", 1.5], ["yas", 1.3], ["gözyaşı", 1.3], ["hüzün", 1.5], ["buruk", 1.3],
    ["iyi hisset", 1.0], ["derman", 1.2], ["tedavi", 1.2], ["bakım", 1.0],
    ["mutlu", 1.3], ["mutluluk", 1.5], ["sevinç", 1.3], ["neşe", 1.2], ["keyif", 1.2],
    ["güzel", 0.8], ["iyi", 0.8], ["pozitif", 1.0], ["enerji", 0.8],
    ["barış", 1.5], ["rahatlık", 1.3],
  ],
  bond: [
    ["yalnız", 1.8], ["terk", 1.5], ["ayrıl", 1.5], ["sevgi", 1.8], ["sevil", 1.3],
    ["bağ", 1.3], ["bağlan", 1.5], ["yakınlık", 1.5], ["ilişki", 1.3], ["kucak", 1.3],
    ["sarıl", 1.3], ["duyul", 1.3], ["anlaşıl", 1.3], ["özle", 1.8], ["özlem", 1.8],
    ["hasret", 1.8], ["aile", 1.2], ["anne", 1.3], ["baba", 1.3], ["dost", 1.2],
    ["arkadaş", 1.2], ["paylaş", 1.2], ["birlikte", 1.2], ["beraber", 1.2],
    ["dokunuş", 1.3], ["sıcaklık", 1.2], ["vefa", 1.0], ["sadakat", 1.0],
    ["güven", 1.8], ["güvenli", 1.5], ["güvende", 1.5], ["inan", 1.0], ["inanç", 1.0],
    ["sevda", 1.5], ["aşk", 1.5], ["tutku", 1.0], ["bağlılık", 1.3],
    ["kayıp", 1.3], ["kaybettim", 1.5], ["kaybet", 1.3],
  ],
  expression: [
    ["ifade", 1.5], ["anlat", 1.3], ["söyle", 1.3], ["konuş", 1.3], ["ses", 1.2],
    ["kelime", 1.2], ["söz", 1.3], ["yaz", 0.8], ["dökül", 1.2], ["dilsiz", 1.5], ["bastır", 1.2],
    ["sustum", 1.3], ["çığlık", 1.5], ["haykır", 1.3], ["bağır", 1.2],
    ["yaratıcı", 1.2], ["yarat", 1.0], ["müzik", 1.0], ["şarkı", 1.0],
    ["dans", 1.0], ["sanat", 1.0], ["resim", 0.8], ["şiir", 1.2], ["renk", 0.8],
    ["ilham", 1.2], ["fikrimi", 1.0], ["düşüncemi", 1.0],
  ],
  awareness: [
    ["farkında", 1.5], ["farkındalık", 1.8], ["sezgi", 1.5], ["içgörü", 1.5],
    ["rüya", 1.3], ["sembol", 1.3], ["işaret", 1.2], ["anlam", 1.3], ["merak", 1.5],
    ["gözlem", 1.3], ["meditasyon", 1.5], ["sessizlik", 1.2], ["düşün", 1.0],
    ["sorgu", 1.3], ["neden", 0.8], ["niçin", 0.8], ["anlamsız", 1.3],
    ["belirsiz", 1.3], ["bulanık", 1.2], ["karanlık", 1.0], ["aydınlan", 1.5],
    ["uyanış", 1.5], ["bilinç", 1.5], ["idrak", 1.3], ["kavrayış", 1.3],
    ["boşluk", 1.5], ["hiçlik", 1.5], ["yokluk", 1.3], ["sorgulama", 1.3],
    ["tefekkür", 1.5], ["derinlik", 1.2], ["gizem", 1.0], ["keşif", 1.0],
  ],
  unity: [
    ["teslim", 1.8], ["teslimiyet", 1.8], ["kabul", 1.5], ["evren", 1.3],
    ["birlik", 1.5], ["bütün", 1.3], ["manevi", 1.5], ["kutsal", 1.3],
    ["ilah", 1.3], ["tanrı", 1.3], ["sonsuz", 1.3], ["tamam", 1.0],
    ["şükür", 1.8], ["şükr", 1.8], ["şükran", 1.8], ["minnet", 1.5], ["bereket", 1.3],
    ["kutsanmış", 1.3], ["ilahi", 1.3], ["ruh", 1.0], ["ruhsal", 1.3],
    ["kozmik", 1.3], ["evrensel", 1.3], ["aşkın", 1.3], ["bütünlük", 1.5],
    ["sonsuzluk", 1.5], ["cennet", 1.0], ["nur", 1.2], ["ışık", 1.0],
    ["aydınlık", 1.0], ["tanrısal", 1.3], ["mübarek", 1.0],
  ],
};

function normalizeText(text) {
  return text.toLocaleLowerCase("tr-TR").replace(/[.,;:!?'"()\[\]{}<>…–—""'']/g, " ").replace(/\s+/g, " ").trim();
}

function padHaystack(text) {
  return ` ${normalizeText(text)} `;
}

/** Kelimeyi boşluk sınırlı token'lara ayır */
function tokenize(text) {
  return normalizeText(text).split(" ").filter(Boolean);
}

function scoreFromText(haystack) {
  const scores = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, 0]));

  for (const row of WEIGHTED_PHRASES) {
    const cat = row[0];
    const w = row[1];
    for (let i = 2; i < row.length; i++) {
      const p = normalizeText(String(row[i]));
      if (haystack.includes(` ${p} `) || haystack.includes(` ${p}`) || haystack.includes(`${p} `)) {
        scores[cat] += w;
      }
    }
  }

  const tokens = tokenize(haystack);

  for (const cat of CATEGORY_ORDER) {
    const stems = STEM_WEIGHTS[cat] || [];
    for (const [stem, weight] of stems) {
      const s = stem.toLocaleLowerCase("tr-TR");
      for (const tok of tokens) {
        if (tok === s || tok.startsWith(s)) {
          scores[cat] += weight;
        }
      }
    }
  }

  return scores;
}

function applyTagBoost(scores, tagLabels) {
  const out = { ...scores };
  for (const tag of tagLabels || []) {
    const b = TAG_BOOST[tag];
    if (!b) continue;
    for (const [k, v] of Object.entries(b)) {
      if (out[k] != null) out[k] += v;
    }
  }
  return out;
}

function pickWinner(scores) {
  let best = CATEGORY_ORDER[0];
  let bestV = scores[best] ?? 0;
  for (const c of CATEGORY_ORDER) {
    const v = scores[c] ?? 0;
    if (v > bestV) {
      best = c;
      bestV = v;
    }
  }
  return best;
}

/**
 * @param {{ text?: string, tagLabels?: string[], locale?: 'tr'|'en' }} opts
 * @returns {{
 *   frequency: number,
 *   chakra: string,
 *   category: string,
 *   message: string,
 *   scores: Record<string, number>,
 *   engineVersion: number
 * }}
 */
export function inferEmotionFrequency({ text = "", tagLabels = [], locale = "tr" } = {}) {
  const haystack = padHaystack(typeof text === "string" ? text : "");
  let scores = scoreFromText(haystack);
  scores = applyTagBoost(scores, tagLabels);

  const total = CATEGORY_ORDER.reduce((s, c) => s + (scores[c] || 0), 0);
  let category = pickWinner(scores);

  /* Belirsiz / çok düşük sinyal → 528 Hz (kalp, şifa — en nötr ve kapsayıcı frekans) */
  if (total < 0.75) {
    category = "healing";
    scores = { ...scores, healing: (scores.healing || 0) + 0.5 };
  }

  const frequency = CATEGORY_TO_HZ[category];
  const loc = locale === "en" ? "en" : "tr";
  const chakra = HZ_TO_CHAKRA[frequency][loc];
  const message = MESSAGES[category][loc];

  const reflection = REFLECTIONS[category]?.[loc] ?? "";

  return {
    frequency,
    chakra,
    category,
    message,
    reflection,
    scores,
    engineVersion: EMOTION_ENGINE_VERSION,
  };
}

/**
 * anlasilmaEnter API'si çalışmadığında kullanılabilecek sentetik yanıt.
 * Gerçek API'den dönen şemayı taklit eder.
 */
export function buildSyntheticEnterResult(engineResult) {
  if (!engineResult) return null;
  return {
    how_i_hear_you: engineResult.message,
    reflection: engineResult.reflection || "",
    active_on_frequency: 1,
    proximity_detected: false,
    _synthetic: true,
  };
}

export { CATEGORY_TO_HZ, HZ_TO_CHAKRA, CATEGORY_ORDER, REFLECTIONS };
