/**
 * Matrix Rol Okuma — kişiselleştirilmiş anlatı (deterministik varyasyon).
 * Çıktı: bölümlü stringler + share_trigger. Hedef ~800–1200 karakter.
 */

function hashSeed(...parts) {
  const s = parts.filter(Boolean).join("|");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function pick(arr, seed, offset = 0) {
  if (!arr?.length) return "";
  return arr[(seed + offset) % arr.length];
}

const OPENING =
  "Bu bir analiz değil. Sana zaten bildiğin şeyi hatırlatıyor.";

const DONGU_ACIKLAMASI =
  "Bu döngü bilinçli değil.\nBu bir tekrar programı.";

const KIRILMA =
  "Bu döngüyü kırabilirsin.\nAma önce görmen gerekiyor.";

const SANRI_IMZA =
  "Buraya kadar geldiysen…\nzaten çağrıldın.";

const PAYLASIM =
  "Bunu okurken aklına biri geldiyse…\no kişi de bu döngünün içinde.";

const LOOP_FRAGMENTS = [
  "sürekli aynı duygusal kırılmayı yaşamak",
  "çok verip az aldığın ilişkileri tekrar seçmek",
  "kontrol ederek güvende kalacağını sanıp yine kaybetmek",
  "aynı korkuyu farklı maskeyle yaşamak",
  "bağlanıp sonra suçlulukla geri çekilmek",
  "değerini ispat etmeye çalışıp tükenmek",
  "duygularını erteleyip bir gün patlamak",
  "güven arayıp hep aynı türde insanı çekmek",
];

const ANA_TEMA_PREFIX = "Senin hayatındaki ana döngü:";

function resolveLoop(role, lpArch, seed) {
  const r = `${role} ${lpArch}`.toLowerCase();
  if (/kontrol|düzen|otorite|yönetici|planlayıcı/.test(r)) {
    return pick(
      [
        "kontrol ettiğini sandığın şeyin aslında seni kontrol etmesine izin vermek.",
        "düzeni kurup içerde yine de kaosu hissetmek.",
      ],
      seed,
      1
    );
  }
  if (/şifa|hizmet|veren|besleyen|6/.test(r)) {
    return pick(
      [
        "kendini sonraya koyup başkalarını kurtarırken tükenmek.",
        "ihtiyaç duymayı göstermemek; hep güçlü görünmek zorunda hissetmek.",
      ],
      seed,
      2
    );
  }
  if (/yaratıcı|sanat|ifade|3/.test(r)) {
    return pick(
      [
        "içindekini dışarı vurmadan yaşayıp içeride birikmek.",
        "onaylanmadan değersiz hissedip sustuğun anları biriktirmek.",
      ],
      seed,
      3
    );
  }
  if (/gölge|derin|dönüşüm|8|11/.test(r)) {
    return pick(
      [
        "yüzleşmeden kaçıp aynı dersi farklı insanlarla almak.",
        "karanlığı bastırıp onun seni gizlice yönetmesine izin vermek.",
      ],
      seed,
      4
    );
  }
  return pick(LOOP_FRAGMENTS, seed, 5);
}

const DERIN_ILISKI = (s) => [
  [
    "İnsanlara güveniyorsun.",
    "Ama hep aynı yerde kırılıyorsun.",
    "Çünkü sen bağlanıyorsun; karşı taraf aynı derinlikte bağlanmıyor.",
  ],
  [
    "Yakınlık istiyorsun.",
    "Sonra fazla verdiğini fark edip içeri çekiliyorsun.",
    "Bu çekilme seni yalnız bırakıyor — ama sen yine aynı ritmi seçiyorsun.",
  ],
  [
    "Seçtiğin insanlar tesadüf değil.",
    "Tanıdık bir acıyı tekrar etmek için seçiliyorlar.",
    "Fark ettiğin an, seçimin değişebileceğini de görürsün.",
  ],
  [
    "İlişkide hep sen anlayan oluyorsun.",
    "Anlaşılmayı en sona bırakıyorsun.",
    "O zaman da artık sesin kısılmış oluyor.",
  ],
];

const DERIN_PARA = (s) => [
  [
    "Para senin için güven meselesi.",
    "Yetmez korkusu seni ya tutup ya kaçırtıyor.",
    "İkisi de aynı program: değerini dışarıdan onaylatmak.",
  ],
  [
    "Kazanmak istiyorsun ama rahat hissetmiyorsun.",
    "Rahat hissetsen suçlanacakmışsın gibi bir yer var içinde.",
    "Bu çelişki paranın sana akmasını yavaşlatır.",
  ],
  [
    "Fiyatını düşürüyorsun — ücret değil, kendini.",
    "Sonra neden yorulduğunu anlamıyorsun.",
    "Bedenin biliyor; zihin henüz itiraf etmiyor.",
  ],
  [
    "Bolluk dediğin şey aslında izin.",
    "İzin vermiyorsun; çünkü hazır değilmişsin gibi hissediyorsun.",
    "Hazırlık sonsuza uzuyor.",
  ],
];

const DERIN_ICSEL = (s) => [
  [
    "İçerde iki ses var: biri sakinleştiren, biri suçlayan.",
    "Çoğu zaman suçlayan kazanıyor.",
    "O ses seni tanıdık acıya bağlı tutuyor.",
  ],
  [
    "Kendine karşı merhametin düşük.",
    "Başkasına söylemeyeceğin şeyi kendine söylüyorsun.",
    "Bu iç sertlik dışarıda yumuşak görünmenle çelişir.",
  ],
  [
    "Hissettiklerinin hepsi gerçek — ama hepsi gerçeklik değil.",
    "Duygu ile gerçeği ayırmayı öğrenmediğin sürece içsel fırtına bitmez.",
  ],
  [
    "Kim olduğunu bilmek istiyorsun.",
    "Ama tanımlandığın an sıkışıyorsun.",
    "Bu gerilim seni sürekli arayışa itiyor.",
  ],
];

const DERIN_DAVRANIS = (s) => [
  [
    "Aynı tetikte aynı tepkiyi veriyorsun.",
    "Sonra 'yine ben' diyorsun.",
    "Evet — yine sen; çünkü program değişmedi.",
  ],
  [
    "Kaçtığın şey peşini bırakmıyor.",
    "Çünkü kaçış da bir seçim ve o seçim seni döngüye geri bağlıyor.",
  ],
  [
    "Uyarı işaretlerini erken görüyorsun.",
    "Yine de 'belki bu sefer' diyorsun.",
    "Bu 'belki' döngünün en güçlü cümlesi.",
  ],
  [
    "Davranışın tutarlı; bilincin değil.",
    "Tutarlılık rahatlatır — ama seni aynı sonuca götürür.",
  ],
];

const KOR_NOKTALAR = (s) => [
  [
    "En büyük gücün sezgi.",
    "Ama aynı şey seni zayıflatıyor.",
    "Çünkü hissettiğin şeyi sorgulamadan gerçek sanıyorsun.",
  ],
  [
    "En çok güvendiğin şey: mantığın.",
    "Oysa en çok kaçırdığın da o: bedeninin 'hayır' dediği anlar.",
  ],
  [
    "Başkalarına çok net görünüyorsun.",
    "Kendinde aynı netliği kullanmıyorsun.",
    "Bu körlük bilinçli değil; alışkanlık.",
  ],
  [
    "Affedersin diye bekliyorsun.",
    "Asıl bekleyen içerdeki çocuk.",
    "Onu duymayıp başkalarını ikna etmeye çalışıyorsun.",
  ],
];

function joinLines(lines) {
  return lines.filter(Boolean).join("\n");
}

function trimToMax(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1).trim();
  const last = cut.lastIndexOf("\n");
  return (last > max * 0.5 ? cut.slice(0, last) : cut) + "…";
}

/**
 * @param {object} data — API /matrix-rol yanıtı
 * @param {string} fullName
 * @param {string} birthDate — YYYY-MM-DD (varyasyon için)
 * @returns {{ share_trigger: true, sections: Record<string,string>, full_narrative: string, character_count: number }}
 */
export function buildMatrixRolReading(data, fullName, birthDate = "") {
  const role = data?.matrix_role || "Yolcu";
  const lpArch = data?.life_path_archetype || "";
  const nameArch = data?.name_archetype || "";
  const lifePath = data?.life_path ?? "";

  const seed = hashSeed(fullName, birthDate, role, String(lifePath));

  const loop = resolveLoop(role, lpArch, seed);
  const anaTema = `${ANA_TEMA_PREFIX} ${loop}`;

  const iliski = joinLines(pick(DERIN_ILISKI(seed), seed, 0));
  const para = joinLines(pick(DERIN_PARA(seed), seed, 1));
  const icsel = joinLines(pick(DERIN_ICSEL(seed), seed, 2));
  const davranis = joinLines(pick(DERIN_DAVRANIS(seed), seed, 3));
  const korNokta = joinLines(pick(KOR_NOKTALAR(seed), seed, 4));

  const sections = {
    opening: OPENING,
    ana_tema: anaTema,
    derin_iliski: iliski,
    derin_para: para,
    derin_icsel: icsel,
    derin_davranis: davranis,
    kor_nokta: korNokta,
    dongu_aciklamasi: DONGU_ACIKLAMASI,
    kirilma_noktasi: KIRILMA,
    sanri_imza: SANRI_IMZA,
    paylasim_tetikleyici: PAYLASIM,
  };

  const orderedKeys = [
    "opening",
    "ana_tema",
    "derin_iliski",
    "derin_para",
    "derin_icsel",
    "derin_davranis",
    "kor_nokta",
    "dongu_aciklamasi",
    "kirilma_noktasi",
    "sanri_imza",
    "paylasim_tetikleyici",
  ];

  let fullNarrative = orderedKeys.map((k) => sections[k]).join("\n\n");
  if (fullNarrative.length > 1200) {
    fullNarrative = trimToMax(fullNarrative, 1200);
  }

  return {
    share_trigger: true,
    sections,
    full_narrative: fullNarrative,
    character_count: fullNarrative.length,
    /** Katmanlı Açılım / tema tespiti için */
    meta: {
      matrix_role: role,
      name_archetype: nameArch,
      life_path_archetype: lpArch,
      life_path: lifePath,
      teaser: data?.teaser,
    },
  };
}

/** detectThemes için düz metin listesi */
export function narrativeToSectionTexts(narrative) {
  if (!narrative?.sections) return [];
  return Object.values(narrative.sections).filter(Boolean);
}
