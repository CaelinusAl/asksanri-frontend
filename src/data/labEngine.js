/**
 * LAB: Rewrite Engine — Bilinç Kodu Yeniden Yazım Motoru
 *
 * Each city's consciousness theme is translated into a "code rewrite":
 * - command: the type of consciousness operation (based on element)
 * - rule: the limiting belief / old pattern
 * - newRule: the awakened understanding / rewritten pattern
 * - description: intro text for the lab experience
 */

const COMMANDS = {
  fire: "REWRITE",
  water: "DECODE",
  earth: "OBSERVE",
  air: "ACTIVATE",
};

const COMMAND_INTROS = {
  REWRITE:
    "Kod gözü aktif. Artık olay okumuyorsun—kural motorunu görüyorsun.",
  DECODE:
    "Yüzey altına indin. Şimdi gizli kodları çözüyorsun.",
  OBSERVE:
    "Gözlemci modu devrede. Yargılamadan, sadece fark et.",
  ACTIVATE:
    "Yeni frekans algılandı. Bilincin yeni bir katmanı açılıyor.",
};

const CUSTOM_LABS = {
  "01": {
    rule: "Bahane = güvenlik",
    newRule: "Eylem = güvenlik",
  },
  "02": {
    rule: "Seçmemek = kayıp yaşamamak",
    newRule: "Seçmek = özgürleşmek",
  },
  "03": {
    rule: "Sis = kaybolmak",
    newRule: "Sis = bilinçaltının konuşması",
  },
  "04": {
    rule: "Yavaşlık = başarısızlık",
    newRule: "Sabır = güçlü yapı",
  },
  "05": {
    rule: "Bilmemek = zayıflık",
    newRule: "Hatırlamak = bilgelik",
  },
  "06": {
    rule: "Kontrol = güç",
    newRule: "Farkındalık = güç",
  },
  "07": {
    rule: "Açılmak = risk",
    newRule: "Açılmak = özgürlük",
  },
  "08": {
    rule: "Doğadan kopuş = modernlik",
    newRule: "Köklenme = gerçek güç",
  },
  "09": {
    rule: "Bilgi = yük",
    newRule: "Anlam = dönüşüm",
  },
  "10": {
    rule: "Tüketmek = yaşamak",
    newRule: "Üretmek = var olmak",
  },
  "11": {
    rule: "Temel = sıkıcı",
    newRule: "Temel = her şeyin başlangıcı",
  },
  "12": {
    rule: "Tek olmak = güçlü olmak",
    newRule: "Çoğul olmak = derinlik",
  },
  "13": {
    rule: "Sessizlik = yalnızlık",
    newRule: "Sessizlik = berraklık",
  },
  "14": {
    rule: "Değişim = tehdit",
    newRule: "Dönüşüm = yenilenme",
  },
  "15": {
    rule: "Sınır = engel",
    newRule: "Sınır = odak",
  },
  "16": {
    rule: "Bilmek = zorlanmak",
    newRule: "Merak = kapı",
  },
  "17": {
    rule: "İzlemek = pasiflik",
    newRule: "Gözlem = bilgeliğin ilk adımı",
  },
  "18": {
    rule: "Geçmiş = yük",
    newRule: "Hafıza = rehber",
  },
  "19": {
    rule: "Sert olmak = güçlü olmak",
    newRule: "Esneklik = dayanıklılık",
  },
  "20": {
    rule: "Derin = karanlık",
    newRule: "Derin = anlam",
  },
  "21": {
    rule: "Sur = kapanmak",
    newRule: "Sınır = koruma bilinci",
  },
  "22": {
    rule: "Kaos = düşman",
    newRule: "Kaos = yaratıcılığın tohumu",
  },
  "23": {
    rule: "Mesafe = kopukluk",
    newRule: "Mesafe = netlik",
  },
  "24": {
    rule: "Soğuk = sevgisizlik",
    newRule: "Buz = saklanan potansiyel",
  },
  "25": {
    rule: "Acı = ceza",
    newRule: "Acı = sinyal",
  },
  "26": {
    rule: "Fırtına = yıkım",
    newRule: "Fırtına = arınma",
  },
  "27": {
    rule: "Yükseliş = hedef",
    newRule: "Yükseliş = süreç",
  },
  "28": {
    rule: "Zorlamak = başarmak",
    newRule: "Akış = güç",
  },
  "29": {
    rule: "Sınır = cezalandırılmak",
    newRule: "Sınır = kendini bilmek",
  },
  "30": {
    rule: "Hız = ilerleme",
    newRule: "Sabır = olgunlaşma",
  },
  "31": {
    rule: "Boşluk = hiçlik",
    newRule: "Boşluk = yaratım alanı",
  },
  "32": {
    rule: "Kaybolmak = başarısızlık",
    newRule: "Kaybolmak = yeni yol bulmak",
  },
  "33": {
    rule: "Gömülü = erişilmez",
    newRule: "Gömülü = henüz keşfedilmemiş",
  },
  "34": {
    rule: "Rutin = hapishane",
    newRule: "Ritüel = bilinçli yaşam",
  },
  "35": {
    rule: "Bekleme = zaman kaybı",
    newRule: "Bekleme = hazırlık",
  },
  "36": {
    rule: "Tanınmamak = var olmamak",
    newRule: "Sessiz güç = en derin etki",
  },
  "37": {
    rule: "Savaş = zafer",
    newRule: "Barış = gerçek zafer",
  },
  "38": {
    rule: "Volkan = yıkım",
    newRule: "Volkan = içsel enerji",
  },
  "39": {
    rule: "Düzen = sıkıcılık",
    newRule: "Düzen = iç huzur",
  },
  "40": {
    rule: "Kurak = tükenmiş",
    newRule: "Kurak = arınmış",
  },
  "41": {
    rule: "Eski = geçersiz",
    newRule: "Eski = tecrübe",
  },
  "42": {
    rule: "Sis = karmaşa",
    newRule: "Sis = sezgisel navigasyon",
  },
  "43": {
    rule: "Karışım = kimliksizlik",
    newRule: "Karışım = zenginlik",
  },
  "44": {
    rule: "Küçük = önemsiz",
    newRule: "Küçük = özlü",
  },
  "45": {
    rule: "Yenilgi = son",
    newRule: "Yenilgi = yeniden doğuş",
  },
  "46": {
    rule: "Lezzet = dünyevi",
    newRule: "Lezzet = yaşamı hissetmek",
  },
  "47": {
    rule: "Gizli = yok",
    newRule: "Gizli = korunmuş",
  },
  "48": {
    rule: "Direnç = güçsüzlük",
    newRule: "Direnç = sınırları bilmek",
  },
  "49": {
    rule: "Geçici = değersiz",
    newRule: "Geçici = anın gücü",
  },
  "50": {
    rule: "Yalnız = terk edilmiş",
    newRule: "Yalnız = özle bağlantı",
  },
  "51": {
    rule: "Farklı = yanlış",
    newRule: "Farklı = özgün",
  },
  "52": {
    rule: "Çatışma = düşmanlık",
    newRule: "Çatışma = sınır farkındalığı",
  },
  "53": {
    rule: "Bilinmeyen = tehlikeli",
    newRule: "Bilinmeyen = potansiyel",
  },
  "54": {
    rule: "Durağanlık = gerileme",
    newRule: "Durağanlık = kök salma",
  },
  "55": {
    rule: "Akıntı = sürüklenme",
    newRule: "Akıntı = doğal yol",
  },
  "56": {
    rule: "Yıkım = kayıp",
    newRule: "Yıkım = yeni alan açma",
  },
  "57": {
    rule: "Parçalanma = zayıflık",
    newRule: "Parçalanma = yeniden birleşme fırsatı",
  },
  "58": {
    rule: "Katılık = güvenlik",
    newRule: "Esneklik = gerçek güvenlik",
  },
  "59": {
    rule: "Düz = sıkıcı",
    newRule: "Düz = berrak",
  },
  "60": {
    rule: "Kuru = cansız",
    newRule: "Kuru = özüne inmiş",
  },
  "61": {
    rule: "Çay = küçük şey",
    newRule: "Çay = meditasyon",
  },
  "62": {
    rule: "Geçit = engel",
    newRule: "Geçit = dönüşüm noktası",
  },
  "63": {
    rule: "Sıcaklık = zayıflık",
    newRule: "Sıcaklık = iyileştirme gücü",
  },
  "64": {
    rule: "Göl = durgunluk",
    newRule: "Göl = derinlik aynası",
  },
  "65": {
    rule: "Taş = engel",
    newRule: "Taş = kalıcılık",
  },
  "66": {
    rule: "Yıldız = ulaşılmaz",
    newRule: "Yıldız = iç pusula",
  },
  "67": {
    rule: "Dar = sıkışmak",
    newRule: "Dar = odaklanmak",
  },
  "68": {
    rule: "Nehir = kontrolsüzlük",
    newRule: "Nehir = doğal akış",
  },
  "69": {
    rule: "Peri bacası = hayal",
    newRule: "Hayal = yaratıcılığın kaynağı",
  },
  "70": {
    rule: "Bitki = pasif",
    newRule: "Kök = sessiz güç",
  },
  "71": {
    rule: "Keşfetmek = riskli",
    newRule: "Keşfetmek = genişlemek",
  },
  "72": {
    rule: "Basit = yetersiz",
    newRule: "Basit = saf bilgelik",
  },
  "73": {
    rule: "Ayrılık = acı",
    newRule: "Ayrılık = bireyselleşme",
  },
  "74": {
    rule: "Yükseklik = tehlike",
    newRule: "Yükseklik = perspektif",
  },
  "75": {
    rule: "Karanlık = korku",
    newRule: "Karanlık = dinlenme",
  },
  "76": {
    rule: "Yıldırım = tehdit",
    newRule: "Yıldırım = aydınlanma anı",
  },
  "77": {
    rule: "Kale = izolasyon",
    newRule: "Kale = iç güç merkezi",
  },
  "78": {
    rule: "Isı = tükenme",
    newRule: "Isı = dönüşüm enerjisi",
  },
  "79": {
    rule: "Dalgalanma = istikrarsızlık",
    newRule: "Dalgalanma = hayatın ritmi",
  },
  "80": {
    rule: "Maden = gömülü kalmak",
    newRule: "Maden = işlenmeyi bekleyen değer",
  },
  "81": {
    rule: "Kenar = dışlanmak",
    newRule: "Kenar = sınırsız perspektif",
  },
};

export function getLabContent(city) {
  const cmd = COMMANDS[city.element] || "REWRITE";
  const custom = CUSTOM_LABS[city.code];

  if (!custom) {
    return {
      command: cmd,
      description: COMMAND_INTROS[cmd],
      rule: `${city.gate.title} = sınır`,
      newRule: `${city.gate.title} = geçiş`,
    };
  }

  return {
    command: cmd,
    description: COMMAND_INTROS[cmd],
    rule: custom.rule,
    newRule: custom.newRule,
  };
}
