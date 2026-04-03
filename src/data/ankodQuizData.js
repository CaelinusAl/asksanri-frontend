/**
 * AN_KOD — 4 kategori × 5 soru (renk, sayı, hayvan, kelime, his)
 */

export const ANKOD_COMPLETED_KEY = "sanri_ankod_completed_quizzes";

export const ANKOD_CATEGORIES = [
  {
    id: "ruhsal",
    title: "Ruh",
    blurb: "Anlam, boşluk, sessizlik",
    glyph: "☽",
    accent: "rgba(168, 85, 247, 0.85)",
    glow: "rgba(168, 85, 247, 0.35)",
  },
  {
    id: "duygu",
    title: "Duygu",
    blurb: "Akış, bastırılan, derin su",
    glyph: "◇",
    accent: "rgba(236, 72, 153, 0.85)",
    glow: "rgba(236, 72, 153, 0.35)",
  },
  {
    id: "para",
    title: "Para",
    blurb: "Değer, güven, alışveriş içinizle",
    glyph: "◈",
    accent: "rgba(234, 179, 8, 0.9)",
    glow: "rgba(234, 179, 8, 0.32)",
  },
  {
    id: "iliski",
    title: "İlişki",
    blurb: "Sınır, yakınlık, ayna",
    glyph: "✦",
    accent: "rgba(120, 247, 216, 0.85)",
    glow: "rgba(120, 247, 216, 0.32)",
  },
];

const COLOR_OPTS = [
  { id: "mavi", label: "Mavi", color: "#4a8fe7" },
  { id: "kirmizi", label: "Kırmızı", color: "#e74a5a" },
  { id: "siyah", label: "Siyah", color: "#2a2a2f" },
  { id: "yesil", label: "Yeşil", color: "#4ae78a" },
  { id: "mor", label: "Mor", color: "#a855f7" },
];

const SAYI_OPTS = [
  { id: "1", label: "1", icon: "①" },
  { id: "3", label: "3", icon: "③" },
  { id: "6", label: "6", icon: "⑥" },
  { id: "7", label: "7", icon: "⑦" },
  { id: "9", label: "9", icon: "⑨" },
];

const HAYVAN_OPTS = [
  { id: "kurt", label: "Kurt", icon: "🐺" },
  { id: "kus", label: "Kuş", icon: "🦅" },
  { id: "yilan", label: "Yılan", icon: "🐍" },
  { id: "kedi", label: "Kedi", icon: "🐈‍⬛" },
  { id: "balina", label: "Balina", icon: "🐋" },
];

/** Kategori başına 5. soru: kelime + his metinleri */
const KELIME_HIS_BY_CAT = {
  ruhsal: {
    kelime: [
      { id: "sessizlik", label: "Sessizlik" },
      { id: "yol", label: "Yol" },
      { id: "isik", label: "Işık" },
      { id: "derinlik", label: "Derinlik" },
      { id: "sure", label: "Süre" },
    ],
    his: [
      { id: "yalniz", label: "Yalnız", icon: "◌" },
      { id: "merak", label: "Merak", icon: "✦" },
      { id: "yorgun", label: "Yorgun", icon: "—" },
      { id: "sakin", label: "Sakin", icon: "○" },
      { id: "gergin", label: "Gergin", icon: "△" },
    ],
  },
  duygu: {
    kelime: [
      { id: "ozlem", label: "Özlem" },
      { id: "ofke", label: "Öfke" },
      { id: "utanc", label: "Utanç" },
      { id: "sefkat", label: "Şefkat" },
      { id: "kayip", label: "Kayıp" },
    ],
    his: [
      { id: "bogucu", label: "Boğucu", icon: "◼" },
      { id: "tatli", label: "Tatlı-acı", icon: "◇" },
      { id: "durgun", label: "Durgun", icon: "～" },
      { id: "dalgalı", label: "Dalgalı", icon: "≈" },
      { id: "bos", label: "Boş", icon: "◯" },
    ],
  },
  para: {
    kelime: [
      { id: "guven", label: "Güven" },
      { id: "kaygi", label: "Kaygı" },
      { id: "ozgurluk", label: "Özgürlük" },
      { id: "borc", label: "Borç" },
      { id: "deger", label: "Değer" },
    ],
    his: [
      { id: "yetersiz", label: "Yetersiz", icon: "↓" },
      { id: "tutkulu", label: "Tutkulu", icon: "↑" },
      { id: "kısıtli", label: "Kısıtlı", icon: "⊓" },
      { id: "rahat", label: "Rahat", icon: "○" },
      { id: "karmasa", label: "Karmaşa", icon: "※" },
    ],
  },
  iliski: {
    kelime: [
      { id: "sinir", label: "Sınır" },
      { id: "yakinlik", label: "Yakınlık" },
      { id: "ayna", label: "Ayna" },
      { id: "terk", label: "Terk" },
      { id: "sadakat", label: "Sadakat" },
    ],
    his: [
      { id: "cekilmek", label: "Çekilmek", icon: "←" },
      { id: "yaklasmak", label: "Yaklaşmak", icon: "→" },
      { id: "kiskanclik", label: "Kıskançlık", icon: "◆" },
      { id: "guvenli", label: "Güvenli", icon: "◎" },
      { id: "belirsiz", label: "Belirsiz", icon: "◈" },
    ],
  },
};

const Q_PREFIX = {
  ruhsal: {
    renk: "Ruhunun tonu bugün hangi renkle konuşuyor?",
    sayi: "İçinde en çok titreşen sayı?",
    hayvan: "Ruhsal yolunda sana eşlik eden hayvan?",
  },
  duygu: {
    renk: "Duygun şu an hangi renge bürünmüş?",
    sayi: "Duygusal döngünde tekrar eden rakam?",
    hayvan: "Duygularını taşıyan hayvan?",
  },
  para: {
    renk: "Para konusunda içini hangi renk temsil ediyor?",
    sayi: "Maddi alanda seni en çok çağıran sayı?",
    hayvan: "Değer ve kaynak enerjinde hangi hayvan?",
  },
  iliski: {
    renk: "İlişkilerde şu an baskın renk?",
    sayi: "Bağlantı alanında tekrar eden sayı?",
    hayvan: "İlişki dinamiğinde sana benzeyen hayvan?",
  },
};

export function getQuizForCategory(catId) {
  const kh = KELIME_HIS_BY_CAT[catId];
  const pre = Q_PREFIX[catId];
  if (!kh || !pre) return [];
  return [
    { id: "renk", text: pre.renk, options: COLOR_OPTS },
    { id: "sayi", text: pre.sayi, options: SAYI_OPTS },
    { id: "hayvan", text: pre.hayvan, options: HAYVAN_OPTS },
    { id: "kelime", text: "Sana çarpan kelime?", options: kh.kelime },
    { id: "his", text: "Şu an en baskın his?", options: kh.his },
  ];
}

export function buildAnkodLines(questions, answersObj) {
  return questions.map((q) => {
    const pick = answersObj[q.id];
    const opt = q.options.find((o) => o.id === pick);
    const label = opt ? opt.label : pick || "—";
    return `${q.text} → ${label}`;
  });
}

const COLOR_MEANING = {
  mavi: "derin bir sakinlik ve arayış",
  kirmizi: "bastırılmamış enerji ve tutku",
  siyah: "sınır çizme ve kontrol ihtiyacı",
  yesil: "iyileşme ve yenilenme arzusu",
  mor: "sezgisel uyanış ve gizem",
};

const ANIMAL_MEANING = {
  kurt: "sadakat ve yalnız yürüyebilme",
  kus: "perspektif ve özgürlük",
  yilan: "dönüşüm ve eskiyi bırakma",
  kedi: "sınır ve seçici yakınlık",
  balina: "derin hafıza ve duygusal okyanus",
};

const NUMBER_MEANING = {
  "1": "yeni bir başlangıç çizgisi",
  "3": "ifade, yaratım ve tekrarlayan ritim",
  "6": "denge, sorumluluk ve şifa arayışı",
  "7": "sorgulama ve yüzeyin altını görme",
  "9": "tamamlanma ve eski döngüyü kapatma",
};

const WORD_HINT = {
  ruhsal: {
    sessizlik: "konuşulmayanı dinleme ihtiyacı",
    yol: "henüz adı konmamış bir yön",
    isik: "görünmek isteyen bir parça",
    derinlik: "yüzeysel cevaplardan kaçış",
    sure: "zamanın seninle ilişkisi",
  },
  duygu: {
    ozlem: "geri çağrılan ama yerleşmeyen bir yer",
    ofke: "söylenmemiş bir sınır",
    utanc: "görünür olmaktan çekinme",
    sefkat: "hem kendine hem ötekine açılan kapı",
    kayip: "boşluğun doldurulmasını bekleme",
  },
  para: {
    guven: "maddi güvenlik ile özsaygı iç içe",
    kaygi: "yetersizlik korkusunun nabzı",
    ozgurluk: "seçim alanı genişletme arzusu",
    borc: "geçmişten gelen yük hissi",
    deger: "ne kadar “hak ettiğin” sorusu",
  },
  iliski: {
    sinir: "nerede bittiğin ve başladığın",
    yakinlik: "yakın olma biçimin",
    ayna: "karşıdakinde gördüğün sen",
    terk: "bırakılma veya bırakma korkusu",
    sadakat: "bağlılık ve sadakat gerilimi",
  },
};

const HIS_HINT = {
  ruhsal: {
    yalniz: "içsel alanda yalnız hissetme",
    merak: "henüz adı konmamış bir soru",
    yorgun: "ruhsal yorgunluk",
    sakin: "durgun ama farkında olma",
    gergin: "içte gerilmiş bir tel",
  },
  duygu: {
    bogucu: "taşıması zor bir yoğunluk",
    tatli: "karışık ve tanıdık bir tat",
    durgun: "donmuş veya uyuşmuş his",
    dalgalı: "iniş çıkışlı bir akış",
    bos: "dolu olmayı bekleyen boşluk",
  },
  para: {
    yetersiz: "yetmezlik hissi",
    tutkulu: "kazanma veya kanıtlama ateşi",
    kısıtli: "daralan seçenekler",
    rahat: "nadir bir nefes alanı",
    karmasa: "net olmayan maddi tablo",
  },
  iliski: {
    cekilmek: "mesafe alma ihtiyacı",
    yaklasmak: "birine veya bir şeye yakınlaşma",
    kiskanclik: "kaybetme korkusunun yüzü",
    guvenli: "tanıdık liman arayışı",
    belirsiz: "konumlandıramadığın bir ara durum",
  },
};

const CATEGORY_VOICE = {
  ruhsal: {
    hook: "Seçtiklerin rastgele değil; iç sesin hızlı bir taraması.",
    mid: "Bu dörtlü (renk, sayı, hayvan, kelime) bir desen çizmeye başlıyor — ama desen henüz tam görünmüyor.",
    cliff:
      "Üçüncü katmanda, kelime ile his birleştiğinde ortaya çıkan şey… burada açıklanmıyor. Derine indiğinde hem bağlantılar hem de “neden şimdi?” sorusu netleşir.",
  },
  duygu: {
    hook: "Duygu katmanında zihin yavaş, beden hızlı konuşur.",
    mid: "Aynı seçimler başka bir gün farklı anlam taşırdı; bugünkü kombinasyon sana özel bir anlık fotoğraf.",
    cliff:
      "Hangi duygunun maskelendiği ve hangi kelimenin aslında başka bir şeye işaret ettiği… yüzeyde kalırsa sadece rahatlatır, derinde ise dönüştürür. Devamı kilitli.",
  },
  para: {
    hook: "Para hikâyesi çoğu zaman değer hikâyesidir — rakamlar bunun dilidir.",
    mid: "Seçtiğin sayı ve kelime, kaynak korkusu ile özgürlük arzusu arasındaki gerilimi işaret ediyor olabilir.",
    cliff:
      "Gerçek blokajın ne “kazanamamak” ne de “harcamak” — çoğu zaman görünmeyen bir anlaşma. Tam harita, derin okumada açılır.",
  },
  iliski: {
    hook: "İlişkilerde tekrar eden sahne, genelde tesadüf değildir.",
    mid: "Hayvan ve his seçimin, yakınlık biçimini ve çekildiğin mesafeyi aynı cümlede anlatıyor — henüz son cümlesi yazılmadı.",
    cliff:
      "Ayna dediğin kelime bazen karşıyı, bazen kendini gösterir; hangisi olduğu burada söylenmez. Derine inince sınır ve ihtiyaç ayrı ayrı konuşur.",
  },
};

/**
 * 2–3 paragraf: kişisel ama tamamlanmamış (paywall öncesi)
 */
export function generateTeaserReading(catId, a) {
  const voice = CATEGORY_VOICE[catId] || CATEGORY_VOICE.ruhsal;
  const c = COLOR_MEANING[a.renk] || "belirsiz bir ton";
  const an = ANIMAL_MEANING[a.hayvan] || "bir iç güç";
  const n = NUMBER_MEANING[a.sayi] || "bir ritim";
  const wKey = WORD_HINT[catId]?.[a.kelime] || "henüz adı konmamış bir tema";
  const hKey = HIS_HINT[catId]?.[a.his] || "belirsiz bir titreşim";

  const p1 = `${voice.hook}\n\nSeçtiğin renk (${c}) ile içinden gelen hayvan (${an}) yan yana gelince, ${voice.mid.toLowerCase()}`;
  const p2 = `Sayının söylediği (${n}) ve çarpan kelimenin gölgesi (${wKey}) birbirine yaklaşıyor. Şu an baskın his (${hKey}) bu tabloyu ya netleştirir ya da bilinçaltında ikinci bir hikâye açar.`;
  const p3 = voice.cliff;

  return `${p1}\n\n${p2}\n\n${p3}`;
}

/** Derin okuma şablonları için kelime katmanı (sembol yerine) */
export const WORD_LAYER_DEEP = {
  ruhsal: {
    sessizlik: "iç sessizliğe güven veya kaçış",
    yol: "yön arayışı — henüz seçilmemiş",
    isik: "görünür olma cesareti",
    derinlik: "yüzeyin altına inme ihtiyacı",
    sure: "zamanla barışık olmama",
  },
  duygu: {
    ozlem: "geri dönüş arzusu",
    ofke: "sınır ihlali algısı",
    utanc: "değersizlik korkusu",
    sefkat: "yumuşama ve kabul kapısı",
    kayip: "tamamlanmamış bir ayrılık",
  },
  para: {
    guven: "istikrar ihtiyacı",
    kaygi: "kaybetme senaryoları",
    ozgurluk: "kısıtlardan çıkma arzusu",
    borc: "geçmiş yükü",
    deger: "hak ediş inancı",
  },
  iliski: {
    sinir: "nerede durduğun",
    yakinlik: "ne kadar yakın olabileceğin",
    ayna: "yansıma ve projeksiyon",
    terk: "bağ kopma korkusu",
    sadakat: "sadakat beklentisi ve testi",
  },
};

export const EMOTION_FREQ_HIS = {
  yalniz: "içsel yalnızlık frekansı",
  merak: "açık uçlu merak",
  yorgun: "tükenmişlik sinyali",
  sakin: "durgun ama bilinçli alan",
  gergin: "yüksek tansiyonlu iç alan",
  bogucu: "nefes aldırmayan yoğunluk",
  tatli: "karışık duygusal tat",
  durgun: "donuk veya uyuşuk tabaka",
  dalgalı: "dalgalı duygusal spektrum",
  bos: "boşluk — doldurulmayı bekleyen",
  yetersiz: "yetersizlik titreşimi",
  tutkulu: "yüksek sürüşlü arzu",
  kısıtli: "daralmış seçenek hissi",
  rahat: "nadir rahatlama",
  karmasa: "parçalı maddi-duygusal tablo",
  cekilmek: "mesafe alma ihtiyacı",
  yaklasmak: "yakınlaşma çekimi",
  kiskanclik: "kaybetme kaygısı",
  guvenli: "tanıdıklık arayışı",
  belirsiz: "konum belirsizliği",
};

export function getCategoryMeta(catId) {
  return ANKOD_CATEGORIES.find((c) => c.id === catId) || ANKOD_CATEGORIES[0];
}
