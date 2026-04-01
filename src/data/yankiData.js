// Yanki Alani — Mock Data & Post Type Definitions

export const POST_TYPES = [
  { id: "duygu", label: { tr: "Duygu", en: "Emotion" }, color: "#ff6b9d", icon: "♡" },
  { id: "farkindalik", label: { tr: "Farkındalık", en: "Awareness" }, color: "#7cf7d8", icon: "◈" },
  { id: "ruya", label: { tr: "Rüya", en: "Dream" }, color: "#b388ff", icon: "☾" },
  { id: "isaret", label: { tr: "İşaret", en: "Sign" }, color: "#ffb74d", icon: "✦" },
  { id: "soru", label: { tr: "Soru", en: "Question" }, color: "#64b5f6", icon: "?" },
  { id: "gunluk", label: { tr: "Günlük Akış", en: "Daily Flow" }, color: "#81c784", icon: "◯" },
  { id: "sesli", label: { tr: "Sesli Yankı", en: "Voice Echo" }, color: "#ce93d8", icon: "♪" },
  { id: "gorsel", label: { tr: "Görsel Yankı", en: "Visual Echo" }, color: "#4dd0e1", icon: "◻" },
];

export function getPostTypeById(id) {
  return POST_TYPES.find((t) => t.id === id) || POST_TYPES[0];
}

// ─── Profiles ───

export const mockProfiles = [
  { id: "u1", name: "Aysel", avatar: null, intentionLine: "İçsel barışı arıyorum", postCount: 4, yankiCount: 28, savedCount: 7 },
  { id: "u2", name: "Kaan", avatar: null, intentionLine: "Uyanış yolculuğunda", postCount: 3, yankiCount: 35, savedCount: 5 },
  { id: "u3", name: "Deniz", avatar: null, intentionLine: "Rüyalarımı takip ediyorum", postCount: 2, yankiCount: 16, savedCount: 3 },
  { id: "u4", name: "Elif", avatar: null, intentionLine: "Her gün yeni bir farkındalık", postCount: 2, yankiCount: 22, savedCount: 4 },
  { id: "u5", name: "Yaman", avatar: null, intentionLine: "Gölgelerle barışıyorum", postCount: 2, yankiCount: 19, savedCount: 6 },
  { id: "anon", name: "Anonim", avatar: null, intentionLine: "", postCount: 0, yankiCount: 0, savedCount: 0 },
];

const MOCK_AUTHORS = mockProfiles;

export const mockPosts = [
  {
    id: "p1",
    author: MOCK_AUTHORS[0],
    authorMode: "named",
    type: "duygu",
    title: null,
    content: "Bugün içimde bir sıkışma vardı. Ama ona baktığımda yumuşadığını fark ettim. Bakmak bile iyileştirmeye başlıyor.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-31T14:22:00Z",
    reactions: { heart: 12, felt: 8 },
    commentCount: 3,
    saved: false,
  },
  {
    id: "p2",
    author: MOCK_AUTHORS[1],
    authorMode: "named",
    type: "farkindalik",
    title: "Kontrol ve Teslim",
    content: "Kontrol etmeye çalıştığım her şey beni tüketiyor. Bıraktığım her şey beni besliyor. Bugün bunu fark ettim.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: "Teslim, güçsüzlük değil — güvendir. Bu farkındalık önemli bir eşik.",
    createdAt: "2026-03-31T12:10:00Z",
    reactions: { heart: 24, felt: 15 },
    commentCount: 7,
    saved: false,
  },
  {
    id: "p3",
    author: MOCK_AUTHORS[2],
    authorMode: "named",
    type: "ruya",
    title: "Mavi kapı",
    content: "Rüyamda mavi bir kapı gördüm. Açtığımda içerisi tamamen boştu ama çok huzurluydu. Kapıyı geçmek bile yeterliydi.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-31T08:45:00Z",
    reactions: { heart: 18, felt: 11 },
    commentCount: 5,
    saved: false,
  },
  {
    id: "p4",
    author: MOCK_AUTHORS[5],
    authorMode: "anonymous",
    type: "duygu",
    title: null,
    content: "Kimseye söyleyemediğim bir şey var. Burada bırakıyorum. Ağırlaştırmak istemiyorum artık. Bırakıyorum.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-31T07:30:00Z",
    reactions: { heart: 31, felt: 22 },
    commentCount: 2,
    saved: false,
  },
  {
    id: "p5",
    author: MOCK_AUTHORS[3],
    authorMode: "named",
    type: "isaret",
    title: "11:11",
    content: "Bu hafta her gün 11:11'de saate baktım. Tesadüf değil. Evren konuşuyor. Ben dinliyorum.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-30T22:15:00Z",
    reactions: { heart: 14, felt: 9 },
    commentCount: 4,
    saved: false,
  },
  {
    id: "p6",
    author: MOCK_AUTHORS[4],
    authorMode: "named",
    type: "soru",
    title: null,
    content: "Gölge çalışması yapanlar: en çok ne zaman tetikleniyorsunuz? Bende yakın ilişkilerde patlıyor. Sizde?",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-30T19:40:00Z",
    reactions: { heart: 8, felt: 19 },
    commentCount: 11,
    saved: false,
  },
  {
    id: "p7",
    author: MOCK_AUTHORS[0],
    authorMode: "named",
    type: "farkindalik",
    title: "Nefes = Şimdi",
    content: "Nefesimi takip ettiğim her an, geçmiş ve gelecek kayboluyor. Geriye sadece bu an kalıyor. Bu kadar basit.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: "Nefes, şimdiki anın kapısıdır. Bu farkındalığı günlük ritüele dönüştür.",
    createdAt: "2026-03-30T15:20:00Z",
    reactions: { heart: 20, felt: 13 },
    commentCount: 6,
    saved: false,
  },
  {
    id: "p8",
    author: MOCK_AUTHORS[5],
    authorMode: "anonymous",
    type: "gunluk",
    title: null,
    content: "Sabah kalktım, ilk düşüncem: 'yeterliyim.' Bu cümle her şeyi değiştirdi.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-30T09:05:00Z",
    reactions: { heart: 16, felt: 7 },
    commentCount: 1,
    saved: false,
  },
  {
    id: "p9",
    author: MOCK_AUTHORS[2],
    authorMode: "named",
    type: "ruya",
    title: null,
    content: "Rüyamda uçuyordum ama yükselmedim. Yere paralel uçuyordum. Belki mesaj şu: yükselmek değil, akışta kalmak.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-29T23:55:00Z",
    reactions: { heart: 10, felt: 6 },
    commentCount: 3,
    saved: false,
  },
  {
    id: "p10",
    author: MOCK_AUTHORS[3],
    authorMode: "named",
    type: "isaret",
    title: "Kelebek",
    content: "Bugün üst üste 3 kelebek gördüm. Anneannem hep 'kelebekler mesaj taşır' derdi. Dinliyorum.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-29T16:30:00Z",
    reactions: { heart: 22, felt: 14 },
    commentCount: 8,
    saved: false,
  },
  {
    id: "p11",
    author: MOCK_AUTHORS[1],
    authorMode: "named",
    type: "duygu",
    title: "Yalnızlık ve Bütünlük",
    content: "Yalnızlık hissettiğimde kendimden koptuğumu fark ettim. Başkalarından değil. Kendimle bağ kurunca yalnızlık çözülüyor.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: "Yalnızlık dışarıda değil içeride çözülür. Bu güçlü bir farkındalık.",
    createdAt: "2026-03-29T11:00:00Z",
    reactions: { heart: 28, felt: 17 },
    commentCount: 9,
    saved: false,
  },
  {
    id: "p12",
    author: MOCK_AUTHORS[4],
    authorMode: "named",
    type: "gunluk",
    title: null,
    content: "Bugün hiçbir şey yapmadım ve suçluluk duymadım. Bu bir zafer.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-29T08:15:00Z",
    reactions: { heart: 35, felt: 20 },
    commentCount: 4,
    saved: false,
  },
  {
    id: "p13",
    author: MOCK_AUTHORS[5],
    authorMode: "anonymous",
    type: "soru",
    title: null,
    content: "İçinizden gelen sesleri nasıl ayırt ediyorsunuz? Hangisi korku, hangisi sezgi? Bazen karıştırıyorum.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-28T20:45:00Z",
    reactions: { heart: 11, felt: 25 },
    commentCount: 13,
    saved: false,
  },
  {
    id: "p14",
    author: MOCK_AUTHORS[0],
    authorMode: "named",
    type: "farkindalik",
    title: null,
    content: "Affetmek karşıdaki için değilmiş. Kendim için taşıdığım yükü bırakmak için. Bugün bunu yaşadım.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-28T14:30:00Z",
    reactions: { heart: 19, felt: 12 },
    commentCount: 5,
    saved: false,
  },
  {
    id: "p15",
    author: MOCK_AUTHORS[1],
    authorMode: "named",
    type: "gunluk",
    title: null,
    content: "3 dakika nefes çalışması yaptım. Dünya durdu. Sonra geri döndü. Ama ben aynı değildim.",
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: "2026-03-28T07:50:00Z",
    reactions: { heart: 13, felt: 8 },
    commentCount: 2,
    saved: false,
  },
];

export const mockComments = {
  p1: [
    { id: "c1", postId: "p1", author: MOCK_AUTHORS[1], content: "Bakmak ilk adım. Güzel farkındalık.", createdAt: "2026-03-31T15:00:00Z" },
    { id: "c2", postId: "p1", author: MOCK_AUTHORS[3], content: "Ben de bugün bunu yaşadım. Yalnız değilsin.", createdAt: "2026-03-31T15:30:00Z" },
    { id: "c3", postId: "p1", author: MOCK_AUTHORS[4], content: "Sıkışma da bir mesajdır. Dinle onu.", createdAt: "2026-03-31T16:10:00Z" },
  ],
  p2: [
    { id: "c4", postId: "p2", author: MOCK_AUTHORS[0], content: "Bu çok doğru. Kontrol yanılsaması enerji tüketiyor.", createdAt: "2026-03-31T13:00:00Z" },
    { id: "c5", postId: "p2", author: MOCK_AUTHORS[2], content: "Teslim olmayı öğreniyorum ben de.", createdAt: "2026-03-31T13:45:00Z" },
  ],
  p3: [
    { id: "c6", postId: "p3", author: MOCK_AUTHORS[4], content: "Mavi kapı genellikle iletişim ve ifade ile ilgili. Boğaz çakrası.", createdAt: "2026-03-31T09:30:00Z" },
    { id: "c7", postId: "p3", author: MOCK_AUTHORS[1], content: "Boşluk bazen doluluktan daha güçlüdür.", createdAt: "2026-03-31T10:15:00Z" },
  ],
  p6: [
    { id: "c8", postId: "p6", author: MOCK_AUTHORS[0], content: "Bende de yakın ilişkilerde. Özellikle beni seven insanlarda.", createdAt: "2026-03-30T20:00:00Z" },
    { id: "c9", postId: "p6", author: MOCK_AUTHORS[3], content: "İş ortamında çıkıyor bende. Otoriteyle ilişkim.", createdAt: "2026-03-30T20:30:00Z" },
    { id: "c10", postId: "p6", author: MOCK_AUTHORS[2], content: "Tetiklenme = gölgenin kapısı. Orası çalışma alanın.", createdAt: "2026-03-30T21:00:00Z" },
  ],
};

// ─── Local post persistence ───

const LOCAL_POSTS_KEY = "sanri_yanki_local_posts";
const SANRI_REFLECTIONS_KEY = "sanri_yanki_reflections";

export function getLocalPosts() {
  try { return JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || "[]"); } catch { return []; }
}

export function addLocalPost(post) {
  const posts = getLocalPosts();
  const full = {
    id: "local-" + Date.now(),
    author: { id: "me", name: "Sen", avatar: null, intentionLine: "" },
    authorMode: post.authorMode || "named",
    type: post.type || "duygu",
    title: post.title || null,
    content: post.content,
    imageUrl: null,
    audioUrl: null,
    sanriNote: null,
    createdAt: new Date().toISOString(),
    reactions: { heart: 0, felt: 0 },
    commentCount: 0,
    saved: false,
    ...post,
  };
  posts.unshift(full);
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  return full;
}

export function getAllPosts() {
  return [...getLocalPosts(), ...mockPosts];
}

export function getPostByIdGlobal(id) {
  const local = getLocalPosts().find((p) => p.id === id);
  if (local) return local;
  return mockPosts.find((p) => p.id === id) || null;
}

// Sanri reflection storage
export function getSanriReflection(postId) {
  try {
    const all = JSON.parse(localStorage.getItem(SANRI_REFLECTIONS_KEY) || "{}");
    return all[postId] || null;
  } catch { return null; }
}

export function saveSanriReflection(postId, text) {
  try {
    const all = JSON.parse(localStorage.getItem(SANRI_REFLECTIONS_KEY) || "{}");
    all[postId] = text;
    localStorage.setItem(SANRI_REFLECTIONS_KEY, JSON.stringify(all));
  } catch { /* noop */ }
}

// Featured post ("Bugünün Yankısı")
export function getFeaturedPost() {
  const curated = mockPosts.filter((p) => p.sanriNote);
  if (curated.length === 0) return mockPosts[0] || null;
  const dayIndex = new Date().getDate() % curated.length;
  return curated[dayIndex];
}

// ─── Helpers ───

const SAVED_KEY = "sanri_yanki_saved";
const COMMENTS_KEY = "sanri_yanki_comments";

export function getSavedPostIds() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
}

export function toggleSavePost(postId) {
  const saved = getSavedPostIds();
  const idx = saved.indexOf(postId);
  if (idx >= 0) saved.splice(idx, 1); else saved.push(postId);
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  return saved;
}

export function isPostSaved(postId) {
  return getSavedPostIds().includes(postId);
}

export function getLocalComments(postId) {
  try {
    const all = JSON.parse(localStorage.getItem(COMMENTS_KEY) || "{}");
    return all[postId] || [];
  } catch { return []; }
}

export function addLocalComment(postId, content, authorName) {
  try {
    const all = JSON.parse(localStorage.getItem(COMMENTS_KEY) || "{}");
    if (!all[postId]) all[postId] = [];
    all[postId].push({
      id: "lc-" + Date.now(),
      postId,
      author: { id: "me", name: authorName || "Sen", avatar: null },
      content,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
    return all[postId];
  } catch { return []; }
}

export function getPostById(id) {
  return getPostByIdGlobal(id);
}

export function getCommentsForPost(id) {
  return [...(mockComments[id] || []), ...getLocalComments(id)];
}

export function getPostsByType(type) {
  if (!type || type === "all") return mockPosts;
  return mockPosts.filter((p) => p.type === type);
}

export function getCuratedPosts() {
  return mockPosts.filter((p) => p.sanriNote);
}

export function getDailyPosts() {
  return mockPosts.filter((p) => p.type === "gunluk");
}

export function timeAgo(dateStr, isTR = true) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return isTR ? "şimdi" : "now";
  if (mins < 60) return `${mins} ${isTR ? "dk" : "min"}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ${isTR ? "sa" : "hr"}`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ${isTR ? "gün" : "d"}`;
  return new Date(dateStr).toLocaleDateString(isTR ? "tr-TR" : "en-US", { month: "short", day: "numeric" });
}

// ─── Profile helpers ───

export function getProfileById(id) {
  return mockProfiles.find((p) => p.id === id) || null;
}

export function getPostsByAuthor(authorId) {
  return mockPosts.filter((p) => p.author.id === authorId);
}

export function getSavedPosts() {
  const ids = getSavedPostIds();
  return mockPosts.filter((p) => ids.includes(p.id));
}

// ─── Time-grouping for daily flow ───

export function groupPostsByDay(posts, isTR = true) {
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const groups = {};
  for (const post of posts) {
    const d = new Date(post.createdAt);
    const ds = d.toDateString();
    let label;
    if (ds === todayStr) label = isTR ? "Bugün" : "Today";
    else if (ds === yesterdayStr) label = isTR ? "Dün" : "Yesterday";
    else label = isTR ? "Bu Hafta" : "This Week";
    if (!groups[label]) groups[label] = [];
    groups[label].push(post);
  }
  return groups;
}

// ─── Feed filter state helper ───

export const FEED_FILTERS = {
  tab: ["akis", "gunluk", "sanri"],
  type: ["all", ...POST_TYPES.map((t) => t.id)],
};

export function createFeedFilter(tab = "akis", type = "all") {
  return { tab, type };
}

// ─── Moderation state ───

export const MODERATION_STATUSES = ["pending_review", "published", "rejected"];

export function createModerationState() {
  return {
    statusFilter: "pending_review",
    posts: [],
    stats: { pending_review: 0, published: 0, rejected: 0, total_reports: 0 },
    loading: true,
    reviewingId: null,
    sanriNote: "",
    rejectReason: "",
  };
}
