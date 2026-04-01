// Rituel Alani — Unified Ritual Catalog
// Cross-linked with Frekans (chakra), Anadolu Ruhu (city), SANRI (prompt)

import { chakraData } from "./chakraData";

export const RITUAL_CATEGORIES = [
  { id: "nefes", label: { tr: "Nefes", en: "Breath" }, icon: "◯" },
  { id: "arinma", label: { tr: "Arınma", en: "Purification" }, icon: "✦" },
  { id: "hatirlama", label: { tr: "Hatırlama", en: "Remembrance" }, icon: "◈" },
  { id: "korunma", label: { tr: "Korunma", en: "Protection" }, icon: "◇" },
  { id: "bolluk", label: { tr: "Bolluk", en: "Abundance" }, icon: "❋" },
  { id: "kalp-acilimi", label: { tr: "Kalp Açılımı", en: "Heart Opening" }, icon: "♡" },
  { id: "golge", label: { tr: "Gölge Çalışması", en: "Shadow Work" }, icon: "☾" },
  { id: "uyku-oncesi", label: { tr: "Uyku Öncesi", en: "Before Sleep" }, icon: "✧" },
  { id: "sabah", label: { tr: "Sabah Başlangıcı", en: "Morning Start" }, icon: "☀" },
  { id: "gece-kapanisi", label: { tr: "Gece Kapanışı", en: "Night Closure" }, icon: "☽" },
];

export const rituals = [
  // ─── 1. 47 Nefes · Sakinleştir ───
  {
    id: "47-nefes",
    title: { tr: "47 Nefes", en: "47 Breaths" },
    subtitle: { tr: "Sakinleştir", en: "Calm Down" },
    category: ["nefes"],
    durationMin: 3,
    difficulty: "easy",
    energyType: "grounding",
    chakraIds: ["kok"],
    cityCodes: ["04"],
    sanriPrompt: {
      tr: "Sessizliğimde beni bekleyen mesaj ne?",
      en: "What message awaits me in my silence?",
    },
    description: {
      tr: "47 bilinçli nefesle zihni sustur, bedeni toprakla. Her nefes seni biraz daha şimdiye çeker.",
      en: "Silence the mind with 47 conscious breaths. Each breath pulls you deeper into the present.",
    },
    intentionPrompt: {
      tr: "Zihni durdurmak, bedene dönmek",
      en: "Stop the mind, return to the body",
    },
    steps: {
      tr: [
        { text: "Gözlerini kapat. Dik otur.", duration: 8 },
        { text: "Burnundan derin nefes al — 4 saniye.", duration: 15 },
        { text: "Tut — 4 saniye. Bırak — 6 saniye.", duration: 20 },
        { text: "Bu ritmi tekrar et. Sayma. Sadece hisset.", duration: 40 },
        { text: "Son 7 nefes: her birinde bir kelime bırak.", duration: 35 },
        { text: "Gözlerini aç. Sessizliği taşı.", duration: 10 },
      ],
      en: [
        { text: "Close your eyes. Sit upright.", duration: 8 },
        { text: "Inhale deeply through your nose — 4 seconds.", duration: 15 },
        { text: "Hold — 4 seconds. Release — 6 seconds.", duration: 20 },
        { text: "Repeat the rhythm. Don't count. Just feel.", duration: 40 },
        { text: "Last 7 breaths: release one word with each.", duration: 35 },
        { text: "Open your eyes. Carry the silence.", duration: 10 },
      ],
    },
    reflectionQuestion: {
      tr: "Sessizlikte ne duydun?",
      en: "What did you hear in the silence?",
    },
    isPremium: false,
    isFeatured: true,
  },

  // ─── 2. Yük Bırakma · Gece Kapanışı ───
  {
    id: "yuk-birakma",
    title: { tr: "Yük Bırakma", en: "Release the Weight" },
    subtitle: { tr: "Gece Kapanışı", en: "Night Closure" },
    category: ["gece-kapanisi", "arinma"],
    durationMin: 4,
    difficulty: "easy",
    energyType: "release",
    chakraIds: ["kok", "kalp"],
    cityCodes: ["02"],
    sanriPrompt: {
      tr: "Bırakmakta zorlandığım şeyin bana öğretmek istediği ne?",
      en: "What is the thing I struggle to release trying to teach me?",
    },
    description: {
      tr: "Günün yükünü taşıyarak uyuma. Bu ritüel seni hafifletir ve geceyi temiz açar.",
      en: "Don't carry the weight of today into sleep. This ritual lightens you and opens a clean night.",
    },
    intentionPrompt: {
      tr: "Bugünü bırakmak, geceye temiz girmek",
      en: "Let go of today, enter the night clean",
    },
    steps: {
      tr: [
        { text: "Yatağına uzan. Ellerini karnına koy.", duration: 10 },
        { text: "Bugün seni ağırlaştıran bir şeyi düşün.", duration: 20 },
        { text: "Nefes ver — o yükü ellerinden toprağa bırak.", duration: 20 },
        { text: "Bir tane daha. Adını koy. Bırak.", duration: 25 },
        { text: "'Bugün yeterliydi. Ben de yeterliyim' de.", duration: 15 },
        { text: "3 yavaş nefes. Gözlerin kapansın.", duration: 15 },
      ],
      en: [
        { text: "Lie down. Place your hands on your belly.", duration: 10 },
        { text: "Think of something that weighed you down today.", duration: 20 },
        { text: "Exhale — release that weight through your hands into the earth.", duration: 20 },
        { text: "One more. Name it. Release it.", duration: 25 },
        { text: "Say: 'Today was enough. I am enough.'", duration: 15 },
        { text: "3 slow breaths. Let your eyes close.", duration: 15 },
      ],
    },
    reflectionQuestion: {
      tr: "Ne bıraktığında hafifledin?",
      en: "What did you release to feel lighter?",
    },
    isPremium: false,
    isFeatured: false,
  },

  // ─── 3. Kalp Yumuşatma · Affediş ───
  {
    id: "kalp-yumusatma",
    title: { tr: "Kalp Yumuşatma", en: "Soften the Heart" },
    subtitle: { tr: "Affediş", en: "Forgiveness" },
    category: ["kalp-acilimi"],
    durationMin: 5,
    difficulty: "medium",
    energyType: "heart",
    chakraIds: ["kalp"],
    cityCodes: ["07", "35"],
    sanriPrompt: {
      tr: "Kalbimde tuttuğum duygunun altında hangi gerçek var?",
      en: "What truth lies beneath the feeling I hold in my heart?",
    },
    description: {
      tr: "Kalbindeki sertliği fark et ve yavaşça çöz. Affetmek güçsüzlük değil, özgürlüktür.",
      en: "Notice the hardness in your heart and gently dissolve it. Forgiveness is not weakness — it is freedom.",
    },
    intentionPrompt: {
      tr: "Kalbi yumuşatmak, affetmeye yer açmak",
      en: "Soften the heart, make room for forgiveness",
    },
    steps: {
      tr: [
        { text: "Ellerini göğsüne koy. Kalbini dinle.", duration: 15 },
        { text: "Kızgın veya kırgın olduğun birini düşün.", duration: 25 },
        { text: "O duyguya bir renk ver. Nerede duruyor?", duration: 20 },
        { text: "'Seni affediyorum. Kendimi de.' de.", duration: 20 },
        { text: "O rengin yavaşça çözüldüğünü hayal et.", duration: 25 },
        { text: "3 nefes. Kalbin biraz daha açık şimdi.", duration: 15 },
      ],
      en: [
        { text: "Place hands on your chest. Listen to your heart.", duration: 15 },
        { text: "Think of someone you're angry at or hurt by.", duration: 25 },
        { text: "Give that feeling a color. Where does it sit?", duration: 20 },
        { text: "Say: 'I forgive you. I forgive myself too.'", duration: 20 },
        { text: "Imagine that color slowly dissolving.", duration: 25 },
        { text: "3 breaths. Your heart is a little more open now.", duration: 15 },
      ],
    },
    reflectionQuestion: {
      tr: "Affetmek seni ne kadar hafifletti?",
      en: "How much lighter did forgiveness make you?",
    },
    isPremium: false,
    isFeatured: true,
  },

  // ─── 4. Alan Temizliği · Arınma ───
  {
    id: "alan-temizligi",
    title: { tr: "Alan Temizliği", en: "Field Cleansing" },
    subtitle: { tr: "Arınma", en: "Purification" },
    category: ["arinma", "korunma"],
    durationMin: 4,
    difficulty: "easy",
    energyType: "release",
    chakraIds: ["bogaz", "ucuncuGoz"],
    cityCodes: ["08"],
    sanriPrompt: {
      tr: "Alanıma sızan ve bana ait olmayan enerji nereden geliyor?",
      en: "Where does the energy that seeps into my field and doesn't belong to me come from?",
    },
    description: {
      tr: "Etrafındaki enerjiyi temizle. Sana ait olmayan ne varsa geri gönder.",
      en: "Cleanse the energy around you. Send back whatever doesn't belong to you.",
    },
    intentionPrompt: {
      tr: "Alanı temizlemek, sınırları netleştirmek",
      en: "Cleanse the field, clarify boundaries",
    },
    steps: {
      tr: [
        { text: "Ayakta dur. Omurgayı dik tut.", duration: 8 },
        { text: "Etrafında beyaz bir ışık küresi hayal et.", duration: 20 },
        { text: "'Bana ait olmayan enerji, geri dön' de.", duration: 15 },
        { text: "Işık küresini genişlet — odayı kapla.", duration: 20 },
        { text: "'Bu alan benim. Burada sadece sevgi var' de.", duration: 20 },
        { text: "3 nefes. Alanın temiz.", duration: 12 },
      ],
      en: [
        { text: "Stand. Keep your spine straight.", duration: 8 },
        { text: "Imagine a white light sphere around you.", duration: 20 },
        { text: "Say: 'Energy that is not mine, return.'", duration: 15 },
        { text: "Expand the sphere — fill the room.", duration: 20 },
        { text: "Say: 'This space is mine. Only love lives here.'", duration: 20 },
        { text: "3 breaths. Your field is clean.", duration: 12 },
      ],
    },
    reflectionQuestion: {
      tr: "Temizlenen alanda kendini nasıl hissediyorsun?",
      en: "How do you feel in your cleansed space?",
    },
    isPremium: false,
    isFeatured: false,
  },

  // ─── 5. Sabah Ateşi · Başlangıç ───
  {
    id: "sabah-atesi",
    title: { tr: "Sabah Ateşi", en: "Morning Fire" },
    subtitle: { tr: "Başlangıç", en: "Ignition" },
    category: ["sabah", "nefes"],
    durationMin: 3,
    difficulty: "easy",
    energyType: "clarity",
    chakraIds: ["solar"],
    cityCodes: ["01"],
    sanriPrompt: {
      tr: "Bugün başlatmak istediğim şey için hangi iç engeli bırakmam gerekiyor?",
      en: "What inner obstacle must I release to start what I want today?",
    },
    description: {
      tr: "Güne ateşle başla. 3 dakikada niyetini yak, enerjini hizala, harekete geç.",
      en: "Start the day with fire. In 3 minutes ignite your intention, align your energy, move.",
    },
    intentionPrompt: {
      tr: "Güne güçlü ve hizalı başlamak",
      en: "Start the day strong and aligned",
    },
    steps: {
      tr: [
        { text: "Ayağa kalk. Gözlerini aç. Nefes al.", duration: 8 },
        { text: "Bugün için tek bir kelime seç. Güçlü bir kelime.", duration: 15 },
        { text: "O kelimeyi 3 kez içinden söyle.", duration: 15 },
        { text: "Ellerini ovala. Yüzüne koy. Sıcaklığı hisset.", duration: 15 },
        { text: "'Bugün ben varım' de. Karnından söyle.", duration: 12 },
      ],
      en: [
        { text: "Stand up. Open your eyes. Breathe.", duration: 8 },
        { text: "Choose one word for today. A powerful word.", duration: 15 },
        { text: "Say that word 3 times inside.", duration: 15 },
        { text: "Rub your palms. Place them on your face. Feel the warmth.", duration: 15 },
        { text: "Say: 'Today I am here.' Say it from your gut.", duration: 12 },
      ],
    },
    reflectionQuestion: {
      tr: "Bugünkü kelimen ne oldu?",
      en: "What was your word for today?",
    },
    isPremium: false,
    isFeatured: false,
  },

  // ─── 6. Sessiz Merkez · Netlik ───
  {
    id: "sessiz-merkez",
    title: { tr: "Sessiz Merkez", en: "Silent Center" },
    subtitle: { tr: "Netlik", en: "Clarity" },
    category: ["nefes", "hatirlama"],
    durationMin: 5,
    difficulty: "medium",
    energyType: "clarity",
    chakraIds: ["ucuncuGoz"],
    cityCodes: ["05"],
    sanriPrompt: {
      tr: "Zihnimin gürültüsünün ardında saklanan gerçek ne?",
      en: "What truth hides behind the noise of my mind?",
    },
    description: {
      tr: "Gürültünün ortasında bir sessizlik noktası bul. Orası senin merkezin. Oradan bak.",
      en: "Find a point of silence in the noise. That is your center. Look from there.",
    },
    intentionPrompt: {
      tr: "İç gürültüyü susturmak, merkeze dönmek",
      en: "Silence the inner noise, return to center",
    },
    steps: {
      tr: [
        { text: "Gözlerini kapat. Ne duyuyorsun? Sadece dinle.", duration: 15 },
        { text: "Şimdi dışarıdaki sesleri bırak. İçe dön.", duration: 15 },
        { text: "İçerideki düşünceleri de bırak. Sessizliği ara.", duration: 25 },
        { text: "O sessizliğin tam ortasına otur. Burası senin yerin.", duration: 30 },
        { text: "'Cevap burada' de. Bekle. Dinle.", duration: 25 },
        { text: "Yavaşça geri dön. Gözlerini aç.", duration: 10 },
      ],
      en: [
        { text: "Close your eyes. What do you hear? Just listen.", duration: 15 },
        { text: "Now let go of outside sounds. Turn inward.", duration: 15 },
        { text: "Let go of thoughts too. Seek the silence.", duration: 25 },
        { text: "Sit in the center of that silence. This is your place.", duration: 30 },
        { text: "Say: 'The answer is here.' Wait. Listen.", duration: 25 },
        { text: "Slowly return. Open your eyes.", duration: 10 },
      ],
    },
    reflectionQuestion: {
      tr: "Sessizlikte seni ne karşıladı?",
      en: "What greeted you in the silence?",
    },
    isPremium: false,
    isFeatured: false,
  },

  // ─── 7. Gölgeye Bakış · İç Görü ───
  {
    id: "golgeye-bakis",
    title: { tr: "Gölgeye Bakış", en: "Facing the Shadow" },
    subtitle: { tr: "İç Görü", en: "Inner Sight" },
    category: ["golge"],
    durationMin: 7,
    difficulty: "deep",
    energyType: "shadow",
    chakraIds: ["sakral", "ucuncuGoz"],
    cityCodes: ["03"],
    sanriPrompt: {
      tr: "Beni tetikleyen şey aslında hangi gölgemi gösteriyor?",
      en: "What shadow of mine is the thing that triggers me actually revealing?",
    },
    description: {
      tr: "Kaçındığın duyguyla yüzleş. Yargılamadan bak. Gölge de sensin — o da sevilmeyi hak ediyor.",
      en: "Face the emotion you've been avoiding. Look without judgment. The shadow is you too — it deserves love.",
    },
    intentionPrompt: {
      tr: "Kaçınılan duyguyla karşılaşmak",
      en: "Meet the avoided emotion",
    },
    steps: {
      tr: [
        { text: "Sessiz bir yerde otur. Gözlerini kapat.", duration: 10 },
        { text: "Son günlerde kaçındığın bir duyguyu düşün.", duration: 25 },
        { text: "O duyguya bir isim ver. Bir şekil ver.", duration: 20 },
        { text: "Ona 'Seni görüyorum' de. Yargılamadan.", duration: 25 },
        { text: "'Neden buradasın?' diye sor. Dinle.", duration: 40 },
        { text: "'Seni kabul ediyorum' de. Sarıl.", duration: 25 },
        { text: "3 nefes. Yavaşça gözlerini aç.", duration: 15 },
      ],
      en: [
        { text: "Sit somewhere quiet. Close your eyes.", duration: 10 },
        { text: "Think of an emotion you've been avoiding lately.", duration: 25 },
        { text: "Give it a name. Give it a shape.", duration: 20 },
        { text: "Say: 'I see you.' Without judgment.", duration: 25 },
        { text: "Ask: 'Why are you here?' Listen.", duration: 40 },
        { text: "Say: 'I accept you.' Embrace it.", duration: 25 },
        { text: "3 breaths. Slowly open your eyes.", duration: 15 },
      ],
    },
    reflectionQuestion: {
      tr: "Gölgen sana ne söyledi?",
      en: "What did your shadow say to you?",
    },
    isPremium: false,
    isFeatured: false,
  },

  // ─── 8. Bolluk Akışı · Alım İzni ───
  {
    id: "bolluk-akisi",
    title: { tr: "Bolluk Akışı", en: "Abundance Flow" },
    subtitle: { tr: "Alım İzni", en: "Permission to Receive" },
    category: ["bolluk"],
    durationMin: 5,
    difficulty: "medium",
    energyType: "abundance",
    chakraIds: ["sakral", "solar"],
    cityCodes: ["10"],
    sanriPrompt: {
      tr: "Bolluğu engelleyen inanç sistemimde hangi kök yara var?",
      en: "What core wound in my belief system blocks abundance?",
    },
    description: {
      tr: "Bolluğu engelleyen inancı bul ve bırak. Almaya izin ver. Evrenin akışına gir.",
      en: "Find the belief blocking abundance and release it. Give yourself permission to receive.",
    },
    intentionPrompt: {
      tr: "Almaya kendine izin vermek",
      en: "Give yourself permission to receive",
    },
    steps: {
      tr: [
        { text: "Gözlerini kapat. Avuçlarını yukarı aç.", duration: 10 },
        { text: "'Almayı hak ediyorum' de. Nasıl hissettirdi?", duration: 20 },
        { text: "Eğer direnç varsa — o dirence bak. Ne diyor?", duration: 25 },
        { text: "'Bu inancı bırakıyorum' de.", duration: 15 },
        { text: "Avuçlarına altın ışık aktığını hayal et.", duration: 25 },
        { text: "'Bolluk benim doğal halim' de. 3 nefes.", duration: 15 },
      ],
      en: [
        { text: "Close your eyes. Open your palms upward.", duration: 10 },
        { text: "Say: 'I deserve to receive.' How did that feel?", duration: 20 },
        { text: "If there's resistance — look at it. What does it say?", duration: 25 },
        { text: "Say: 'I release this belief.'", duration: 15 },
        { text: "Imagine golden light flowing into your palms.", duration: 25 },
        { text: "Say: 'Abundance is my natural state.' 3 breaths.", duration: 15 },
      ],
    },
    reflectionQuestion: {
      tr: "Almana engel olan inanç neydi?",
      en: "What belief was blocking you from receiving?",
    },
    isPremium: false,
    isFeatured: true,
  },
];

// ─── Intention keyword → ritual matching ───

const INTENTION_KEYWORDS = [
  { keywords: ["sakin", "huzur", "rahat", "dur", "calm", "peace", "relax"], ids: ["47-nefes", "sessiz-merkez"] },
  { keywords: ["bırak", "bırakmak", "release", "let go", "ağır"], ids: ["yuk-birakma", "alan-temizligi"] },
  { keywords: ["kalp", "aşk", "sev", "affet", "heart", "love", "forgiv"], ids: ["kalp-yumusatma"] },
  { keywords: ["bolluk", "para", "bereket", "abundance", "money", "receiv", "al"], ids: ["bolluk-akisi"] },
  { keywords: ["başla", "sabah", "güç", "enerji", "start", "morning", "fire", "power"], ids: ["sabah-atesi"] },
  { keywords: ["gör", "iç", "gölge", "fark", "shadow", "see", "inner", "aware"], ids: ["golgeye-bakis", "sessiz-merkez"] },
  { keywords: ["temiz", "arın", "sınır", "clean", "purif", "boundar"], ids: ["alan-temizligi"] },
  { keywords: ["gece", "uyku", "kapat", "night", "sleep", "close"], ids: ["yuk-birakma"] },
  { keywords: ["netlik", "net", "karar", "clarity", "clear", "decision"], ids: ["sessiz-merkez", "sabah-atesi"] },
];

export function suggestRitualsByIntention(text) {
  if (!text || text.trim().length < 2) return [];
  const lower = text.toLowerCase();
  const matched = new Set();
  for (const rule of INTENTION_KEYWORDS) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      rule.ids.forEach((id) => matched.add(id));
    }
  }
  return [...matched].map((id) => getRitualById(id)).filter(Boolean);
}

// ─── Cross-link helpers ───

export function getChakrasForRitual(ritual) {
  if (!ritual?.chakraIds) return [];
  return ritual.chakraIds
    .map((cid) => chakraData.find((c) => c.id === cid))
    .filter(Boolean);
}

// ─── Helpers ───

export function getAllRituals() {
  return rituals;
}

export function getRitualById(id) {
  return rituals.find((r) => r.id === id) || null;
}

export function getRitualsByCategory(categoryId) {
  return rituals.filter((r) => r.category.includes(categoryId));
}

export function getFeaturedRituals() {
  return rituals.filter((r) => r.isFeatured);
}

export function getFreeRituals() {
  return rituals.filter((r) => !r.isPremium);
}

export function getPremiumRituals() {
  return rituals.filter((r) => r.isPremium);
}

export function getTodayRitual() {
  const free = getFreeRituals();
  const today = new Date().toDateString();
  const seed = today.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return free[seed % free.length];
}

// ─── localStorage: History ───

const HISTORY_KEY = "sanri_ritual_history";
const FAVORITES_KEY = "sanri_ritual_favorites";

export function getRitualHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addRitualToHistory(ritualId, mood) {
  const history = getRitualHistory();
  history.unshift({ ritualId, completedAt: new Date().toISOString(), mood });
  if (history.length > 50) history.length = 50;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getRecentRitualIds() {
  return [...new Set(getRitualHistory().map((h) => h.ritualId))].slice(0, 6);
}

// ─── localStorage: Favorites ───

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(ritualId) {
  const favs = getFavorites();
  const idx = favs.indexOf(ritualId);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(ritualId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(ritualId) {
  return getFavorites().includes(ritualId);
}
