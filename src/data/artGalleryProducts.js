/**
 * ART GALLERY — Merkezi ürün kataloğu (Single Source of Truth)
 *
 * Görseller: public/assets/art-gallery/products/<dosya-adı>
 * Türkçe karakterler içeren dosya adları `artProductImageUrl` fonksiyonunda
 * encodeURIComponent ile güvenli şekilde URL'ye dönüşür.
 *
 * Alan sözlüğü:
 *   id            string  — kebab-case unique
 *   slug          string  — URL/SEO
 *   name          string  — Türkçe ürün adı (ana dil)
 *   nameEn?       string  — opsiyonel İngilizce karşılık
 *   image         string  — ana görsel dosya adı
 *   gallery       string[]— tüm görseller (ana görsel ilk sırada)
 *   price         number|null — TRY (ham sayı). null = "Fiyat — yakında"
 *   currency      string  — varsayılan "TL"
 *   dimensions    string  — "50 x 70 cm" gibi; yoksa DIMENSIONS_FALLBACK
 *   material      string  — "Polyester", "Fiberglas polyester" vb.
 *   category      ArtCategoryId — aşağıdaki kategori listesinden
 *   shortStory    string  — kart üstünde tek satırlık tetikleyici
 *   description   string  — modalda 2-4 satır SANRI / CAELINUS mesajı
 *   featured      boolean — öne çıkarılan ürün
 *   available     boolean — stok / satışta mı
 *   shopierUrl?   string  — ileride eklenecek ödeme linki
 *   whatsappHref? string  — doğrudan iletişim linki
 *
 * TON:
 *   Ürün anlatımı değil — bilinç tetikleyicisi.
 *   Kısa. Kırık. Anlam yarı açık. Felsefik ve az gizemli.
 *   Obje değil — mesaj.
 */

/** @typedef {'bust' | 'sculpture' | 'painting' | 'coffee-table' | 'lamp' | 'decor' | 'planter' | 'mirror'} ArtCategoryId */

/**
 * @typedef {Object} ArtProduct
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} [nameEn]
 * @property {string} image
 * @property {string[]} gallery
 * @property {number|null} price
 * @property {string} currency
 * @property {string} dimensions
 * @property {string} material
 * @property {ArtCategoryId} category
 * @property {string} shortStory
 * @property {string} description
 * @property {boolean} featured
 * @property {boolean} available
 * @property {string} [shopierUrl]
 * @property {string} [whatsappHref]
 */

export const DIMENSIONS_FALLBACK = "Ölçü bilgisi istek üzerine paylaşılır.";
export const DEFAULT_CURRENCY = "TL";

/** Türkçe binlik ayırıcı ile fiyat formatı. null → "Fiyat — yakında". */
export function formatArtPrice(price, currency = DEFAULT_CURRENCY) {
  if (price == null || Number.isNaN(Number(price))) return "Fiyat — yakında";
  return `${Number(price).toLocaleString("tr-TR")} ${currency}`;
}

/** Ürün görselinin public URL'i. Türkçe karakterler güvenli. */
export function artProductImageUrl(file) {
  if (!file) return "";
  return `/assets/art-gallery/products/${encodeURIComponent(file)}`;
}

/** @type {{ id: ArtCategoryId, labelTr: string, labelEn: string }[]} */
export const artGalleryCategories = [
  { id: "sculpture", labelTr: "Heykel / Figür", labelEn: "Sculpture" },
  { id: "painting", labelTr: "Tablo / Duvar", labelEn: "Painting / Wall" },
  { id: "coffee-table", labelTr: "Sehpa / Masa", labelEn: "Coffee table" },
  { id: "bust", labelTr: "Büst", labelEn: "Busts" },
  { id: "lamp", labelTr: "Aydınlatma", labelEn: "Lighting" },
  { id: "decor", labelTr: "Dekor / Mumluk", labelEn: "Decor" },
  { id: "planter", labelTr: "Saksı", labelEn: "Planters" },
  { id: "mirror", labelTr: "Ayna", labelEn: "Mirror" },
];

/** @type {ArtProduct[]} */
export const artGalleryProducts = [
  /* ── HEYKELLER / FİGÜRLER ──────────────────────────────────────── */
  {
    id: "love-basquiat",
    shopierUrl: "https://shopier.com/asksanri/46391470",
    slug: "love-basquiat",
    name: "LOVE — Basquiat Grafiti Heykel",
    nameEn: "LOVE — Basquiat Graffiti Sculpture",
    image: "art-love-baguiat.jpeg",
    gallery: ["art-love-baguiat.jpeg", "art-love1.jpeg", "art-love2.jpeg"],
    price: 9900,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "Aşk konuşulmaz. Sadece iz bırakır.",
    description:
      "Sildiğini sandığın her şey\ngeri döner.\nBu heykel sana onu hatırlatıyor:\nbazı izler yüzeyde değil — içeride.",
    featured: true,
    available: true,
  },
  {
    id: "joker-pop",
    shopierUrl: "https://shopier.com/asksanri/46391544",
    slug: "joker-pop",
    name: "Joker Pop — Heykel",
    nameEn: "Joker Pop — Sculpture",
    image: "joker-pop.jpg",
    gallery: ["joker-pop.jpg", "joker-pop1.jpg", "joker-pop2.jpg", "joker-duvar-objesi.jpg"],
    price: 17000,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "Gülen yüz, en çok saklananı anlatır.",
    description:
      "Komik olan,\nçoğu zaman kırılandır.\nBu figür seni güldürmüyor —\nseni hangi tarafında kaldığını soruyor.",
    featured: false,
    available: true,
  },
  {
    id: "joker-popart-tablo",
    shopierUrl: "https://shopier.com/asksanri/46391624",
    slug: "joker-popart-tablo",
    name: "Joker Pop Art Tablo",
    nameEn: "Joker Pop Art Canvas",
    image: "joker-popart-tablo.jpg",
    gallery: ["joker-popart-tablo.jpg"],
    price: 27000,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "Duvara asılı o gülüş sadece resim değil.",
    description:
      "Bir ayna.\nKim gülüyor aslında?\nİzleyen mi,\nyoksa izlenen mi?",
    featured: true,
    available: true,
  },
  {
    id: "silver-balloon-dog",
    shopierUrl: "https://shopier.com/asksanri/46391685",
    slug: "silver-balloon-dog",
    name: "Silver Balloon Dog",
    nameEn: "Silver Balloon Dog",
    image: "siver-balloon-dog.jpg",
    gallery: ["siver-balloon-dog.jpg"],
    price: 11000,
    currency: "TL",
    dimensions: "50 x 70 cm",
    material: "Polyester / krom kaplama",
    category: "sculpture",
    shortStory: "Hafif görünen her şey oyuncak değildir.",
    description:
      "Kromun içinde kendi suretin var.\nBaktıkça sen oluyorsun.\nOyuncak mıydı?\nYoksa ayna mı?",
    featured: true,
    available: true,
  },
  {
    id: "balloon-dog",
    shopierUrl: "https://shopier.com/asksanri/46394034",
    slug: "balloon-dog",
    name: "Balloon Dog",
    nameEn: "Balloon Dog",
    image: "ballon-dog.jpg",
    gallery: ["ballon-dog.jpg", "ballon-dog1.jpg", "ballon-dog2.jpg", "ballon-dog3.jpg", "ballon-dog4.jpg"],
    price: 9630,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "Form basit. Mesaj basit.",
    description:
      "Çocuksu olan her şey saf değildir.\nBazen en zararsız görünen,\nen çok hatırlatan oluyor.",
    featured: false,
    available: true,
  },
  {
    id: "supreme-dog",
    shopierUrl: "https://shopier.com/asksanri/46393972",
    slug: "supreme-dog",
    name: "Supreme Dog",
    nameEn: "Supreme Dog",
    image: "supreme-dog.jpg",
    gallery: ["supreme-dog.jpg", "supreme-dog1.jpg", "supreme-dog2.jpg"],
    price: 9630,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "Bir logo değil. Bir çağın sokak kodu.",
    description:
      "Kırmızı yüksek sesle konuşur.\nSen hangisini duyuyorsun —\nneşeyi mi,\nyoksa itaati mi?",
    featured: false,
    available: true,
  },
  {
    id: "face-wall-sculpture",
    shopierUrl: "https://shopier.com/asksanri/46391738",
    slug: "face-wall-sculpture",
    name: "Face Wall Sculpture — 3'lü Set",
    nameEn: "Face Wall Sculpture — Set of 3",
    image: "face-wall-sculpture.jpg",
    gallery: ["face-wall-sculpture.jpg", "face-wall-sculpture1.jpg"],
    price: 74000,
    currency: "TL",
    dimensions: "120 x 80 cm (set)",
    material: "Polyester",
    category: "sculpture",
    shortStory: "Üç yüz. Üç bakış.",
    description:
      "Biri seni izliyor.\nBiri seni unuttu.\nBiri… seninkiydi.",
    featured: true,
    available: true,
  },
  {
    id: "muhammed-ali-tablo",
    shopierUrl: "https://shopier.com/asksanri/46391810",
    slug: "muhammed-ali-tablo",
    name: "Muhammed Ali Tablo",
    nameEn: "Muhammad Ali Relief",
    image: "muhammedali-tablo.jpg",
    gallery: ["muhammedali-tablo.jpg"],
    price: 27000,
    currency: "TL",
    dimensions: "75 (y) x 65 (g) x 32 (d) cm",
    material: "Polyester",
    category: "painting",
    shortStory: "Boks bir spor değil. Ayakta kalmanın hafızası.",
    description:
      "Ali yumruk atmıyor —\ndüşmemenin kodunu yolluyor.\nSen hâlâ kalkıyor musun?",
    featured: false,
    available: true,
  },
  {
    id: "cosmic-reflection",
    shopierUrl: "https://shopier.com/asksanri/46391867",
    slug: "cosmic-reflection",
    name: "Cosmic Reflection",
    nameEn: "Cosmic Reflection",
    image: "cosmic-reflection.jpg",
    gallery: ["cosmic-reflection.jpg", "cosmic-reflection1.jpg"],
    price: 47000,
    currency: "TL",
    dimensions: "Ø 110 cm",
    material: "Fiber polyester",
    category: "sculpture",
    shortStory: "Evren geniş değil. Bakışın dar.",
    description:
      "Bu daire bir obje değil —\nbir kapı.\nIşık üzerinde oyalanınca\nzaman kısalır.",
    featured: true,
    available: true,
  },
  {
    id: "blue-design-series",
    shopierUrl: "https://shopier.com/asksanri/46394605",
    slug: "blue-design-series",
    name: "Blue Design Series",
    nameEn: "Blue Design Series",
    image: "blue-desing-series.jpg",
    gallery: ["blue-desing-series.jpg"],
    price: 18500,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "Mavi susar. Ama en çok o söyler.",
    description:
      "Bazı günler sen de çok mavisin.\nBir rengin içinde\ngizlenmeye de ihtiyaç vardır.",
    featured: false,
    available: true,
  },
  {
    id: "basquiat-nike",
    shopierUrl: "https://shopier.com/asksanri/46392042",
    slug: "basquiat-nike",
    name: "Basquiat Nike",
    nameEn: "Basquiat Nike",
    image: "basquiat-nike.jpg",
    gallery: ["basquiat-nike.jpg", "basquiat-nike1.jpg"],
    price: 5500,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "Sokak bir mekân değil. Bir frekans.",
    description:
      "Basquiat koşmadı —\nkoştuğumuzu yazdı.\nAyakkabı sadece bir araç.\nAsıl yol, dikkatindir.",
    featured: false,
    available: true,
  },
  {
    id: "popart-aphrodite",
    shopierUrl: "https://shopier.com/asksanri/46392153",
    slug: "popart-aphrodite",
    name: "Pop Art Aphrodite",
    nameEn: "Pop Art Aphrodite",
    image: "popart-aphrodite.jpg",
    gallery: ["popart-aphrodite.jpg", "popart-aphrodite1.jpg", "popart-aphrodite2.jpg", "popart-aphrodite3.jpg"],
    price: 6600,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester / akrilik boya",
    category: "sculpture",
    shortStory: "Güzellik ağır bir kavramdı.",
    description:
      "Renge bürününce hafifledi.\nAfrodit yorgundu —\nsen yorulttun.\nRenk, onu bıraktığın yer.",
    featured: false,
    available: true,
  },
  {
    id: "plant-vibes-david",
    shopierUrl: "https://shopier.com/asksanri/46392214",
    slug: "plant-vibes-david",
    name: "Plant Vibes David",
    nameEn: "Plant Vibes David",
    image: "plant-vibes-david.jpg",
    gallery: ["plant-vibes-david.jpg", "plant-vibes-david1.jpg"],
    price: 6600,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "David sessizce duruyordu. Bitki çıktı yüzünden.",
    description:
      "Her taş içinde bir şey büyütür.\nSen de öyle.\nDaha ne kadar\nyüzeyde kalacaksın?",
    featured: false,
    available: true,
  },
  {
    id: "david-popart-heykel",
    shopierUrl: "https://shopier.com/asksanri/46392258",
    slug: "david-popart-heykel",
    name: "David Popart Heykel",
    nameEn: "David Pop Art Sculpture",
    image: "david-popart-heykel.jpg",
    gallery: ["david-popart-heykel.jpg", "david-popart-heykel1.jpg", "david-popart-heykel2.jpg", "david-popart-heykel3.jpg"],
    price: 27000,
    currency: "TL",
    dimensions: "120 cm (y)",
    material: "Polyester",
    category: "sculpture",
    shortStory: "Büyük olmak bir ölçü değil. Bir dikkat biçimi.",
    description:
      "120 cm ayakta duruyor.\nAma aslında\nbakanın kısalığını ölçüyor.\nSen yeterince yakın mısın?",
    featured: true,
    available: true,
  },
  {
    id: "david-digital-thoughts",
    shopierUrl: "https://shopier.com/asksanri/46392321",
    slug: "david-digital-thoughts",
    name: "David — Digital Thoughts",
    nameEn: "David — Digital Thoughts",
    image: "david-digital-thouhts.jpg",
    gallery: ["david-digital-thouhts.jpg"],
    price: 11000,
    currency: "TL",
    dimensions: "75 x 30 cm",
    material: "Alçı",
    category: "sculpture",
    shortStory: "Dikkatin dağıldı. David'in değil.",
    description:
      "O hâlâ düşünüyor.\nSen hâlâ scroll ediyorsun.\nArada açılan boşluk —\nasıl eser orada.",
    featured: false,
    available: true,
  },
  {
    id: "antik-herkul",
    shopierUrl: "https://shopier.com/asksanri/46392358",
    slug: "antik-herkul",
    name: "Antik Herkül",
    nameEn: "Antique Hercules",
    image: "antik-herkül.jpg",
    gallery: ["antik-herkül.jpg"],
    price: 6600,
    currency: "TL",
    dimensions: "50 cm (y)",
    material: "Polyester",
    category: "sculpture",
    shortStory: "Güç… sandığın şey değil.",
    description:
      "Bu figür kasları değil,\ntaşıdığı yükü hatırlatır.\nBazıları dünyayı sırtlar,\nbazıları sadece izler.",
    featured: false,
    available: true,
  },
  {
    id: "milkshake-hermes",
    shopierUrl: "https://shopier.com/asksanri/46392406",
    slug: "milkshake-hermes",
    name: "Milkshake Hermes",
    nameEn: "Milkshake Hermes",
    image: "milkshake-hermes.jpg",
    gallery: ["milkshake-hermes.jpg", "milkshake-hermes1.jpg"],
    price: 5500,
    currency: "TL",
    dimensions: "58 x 36 cm",
    material: "Polyester",
    category: "sculpture",
    shortStory: "Haberci… ama bu kez yukarıdan değil.",
    description:
      "Tanrı düşmüş,\nform çözülmüş,\nsistem akmış.\nBazen en büyük mesaj,\nciddiyetini kaybettiğin anda gelir.",
    featured: false,
    available: true,
  },
  {
    id: "atlas-dondurma",
    shopierUrl: "https://shopier.com/asksanri/46392454",
    slug: "atlas-dondurma",
    name: "Atlas — Dondurma Heykel",
    nameEn: "Atlas — Ice Cream Sculpture",
    image: "atlas-dondurma.jpg",
    gallery: ["atlas-dondurma.jpg", "atlas-dondurma1.jpg"],
    price: 7400,
    currency: "TL",
    dimensions: "51 (y) x 25 (g) x 28 (d) cm",
    material: "Polyester",
    category: "sculpture",
    shortStory: "Dünya ağır değil. Sen ağırlaştırıyorsun.",
    description:
      "Atlas bu kez yükü kaldırmıyor…\noyuna çeviriyor.\nSen de çevirebilirsin —\nyeter ki izin ver.",
    featured: false,
    available: true,
  },
  {
    id: "freeman",
    shopierUrl: "https://shopier.com/asksanri/46392489",
    slug: "freeman",
    name: "Freeman — Klasik Beyaz Figür",
    nameEn: "Freeman — Classical White Figure",
    image: "freeman1.jpeg",
    gallery: ["freeman1.jpeg", "freeman2.jpeg"],
    price: 8800,
    currency: "TL",
    dimensions: "70 cm (y)",
    material: "Polyester",
    category: "sculpture",
    shortStory: "Sarılmak bir eylem değildir. Bir izindir.",
    description:
      "İki figür konuşmadan anlaşır.\nSen kaç yıldır\nkelimelerle uğraşıyorsun?",
    featured: false,
    available: true,
  },
  {
    id: "design-mickey",
    shopierUrl: "https://shopier.com/asksanri/46392541",
    slug: "design-mickey",
    name: "Design Mickey — El Heykeli",
    nameEn: "Design Mickey — Hand Sculpture",
    image: "desing-mickey.jpeg",
    gallery: ["desing-mickey.jpeg", "dizayn-mickey1.jpeg"],
    price: 5000,
    currency: "TL",
    dimensions: "34 x 14 cm",
    material: "Polyester",
    category: "sculpture",
    shortStory: "Bir el. Ama kimin eli?",
    description:
      "Sallayan mı,\nselam veren mi?\nUzatan mı,\nçeken mi?\nSeçim — her zaman orada.",
    featured: false,
    available: true,
  },
  {
    id: "mickey-street",
    shopierUrl: "https://shopier.com/asksanri/46392605",
    slug: "mickey-street",
    name: "Mickey — Sokak Sanatı Figür",
    nameEn: "Mickey — Street Art Figure",
    image: "mickey.jpeg",
    gallery: ["mickey.jpeg"],
    price: 37000,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "Çocukluk bir zaman değildi. Bir dil.",
    description:
      "Unutmadığını sandığın o sesi —\nsadece bu figür hatırlıyor.\nBakarken kendini değil,\nküçük halini arıyorsun.",
    featured: false,
    available: true,
  },
  {
    id: "mickey-painting",
    shopierUrl: "https://shopier.com/asksanri/46394483",
    slug: "mickey-painting",
    name: "Mickey Painting — Duvar Objesi",
    nameEn: "Mickey Painting — Wall Object",
    image: "mickey-painting.jpg",
    gallery: ["mickey-painting.jpg"],
    price: 10000,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "Tanıdık bir yüz. Ama asıl soru duvarda.",
    description:
      "Seni gülümseten mi?\nYoksa\nseni çocuk tutan mı?\nİkisi de aynı anda olabilir.",
    featured: false,
    available: true,
  },
  {
    id: "unicorn",
    shopierUrl: "https://shopier.com/asksanri/46392673",
    slug: "unicorn",
    name: "Unicorn — At Başı Heykel",
    nameEn: "Unicorn — Horse Head Sculpture",
    image: "unicorn-horse.jpeg",
    gallery: ["unicorn-horse.jpeg", "unicorn-horse1.jpeg"],
    price: 4700,
    currency: "TL",
    dimensions: "38 x 35 cm, derinlik 13 cm",
    material: "Polyester / altın detay",
    category: "sculpture",
    shortStory: "İnanılmaz olana yer verirsen, daha az şey imkansızlaşır.",
    description:
      "Beyaz kafa.\nAltın boynuz.\nGerisi hatırlama meselesi.",
    featured: false,
    available: true,
  },
  {
    id: "heart-framed",
    shopierUrl: "https://shopier.com/asksanri/46392715",
    slug: "heart-framed",
    name: "Heart — Çerçeveli Kalp Tablo",
    nameEn: "Heart — Framed Heart Art",
    image: "heart1.jpeg",
    gallery: ["heart1.jpeg", "heart2.jpeg"],
    price: 13000,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Karma teknik / çerçeve",
    category: "painting",
    shortStory: "İki kalp. Ama ikisi de senin.",
    description:
      "Biri sevdiğin,\nbiri korktuğun.\nAynı duvarda duruyorlar —\nseçim her gün yeniden.",
    featured: false,
    available: true,
  },
  {
    id: "killen",
    shopierUrl: "https://shopier.com/asksanri/46392778",
    slug: "killen",
    name: "Killen",
    nameEn: "Killen",
    image: "killen.jpg",
    gallery: ["killen.jpg", "killen1.jpg"],
    price: 12000,
    currency: "TL",
    dimensions: "55 x 45 cm",
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "Her vuruş bir iz. Her iz bir hikâye.",
    description:
      "Bazı hikâyeler çerçevelenir.\nBazıları yaşanır.\nİkisi de aynı yerden gelir —\nsöylenmemiş bir şeyden.",
    featured: false,
    available: true,
  },
  {
    id: "love-tablo",
    shopierUrl: "https://shopier.com/asksanri/46392832",
    slug: "love-tablo",
    name: "Love Tablo",
    nameEn: "Love Canvas",
    image: "love-tablo.jpg",
    gallery: ["love-tablo.jpg", "love-tablo1.jpg", "love-tablo2.jpg"],
    price: 12000,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "Dört harf. Ama hiç bitmeyen bir cümle.",
    description:
      "Sevgi açıklanmaz.\nDuvarda asılı olunca bile\nsusar.\nSesi sen koyuyorsun.",
    featured: false,
    available: true,
  },
  {
    id: "future-tablo",
    shopierUrl: "https://shopier.com/asksanri/46392861",
    slug: "future-tablo",
    name: "Future Tablo",
    nameEn: "Future Canvas",
    image: "future.jpg",
    gallery: ["future.jpg"],
    price: 12000,
    currency: "TL",
    dimensions: "55 (y) x 45 (g) cm",
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "Gelecek gelmiyor. Açılıyor.",
    description:
      "Bak:\nçoktan orada.\nSen sadece\ngözlerini ayırmamışsın henüz.",
    featured: false,
    available: true,
  },
  {
    id: "art-mirror",
    shopierUrl: "https://shopier.com/asksanri/46392911",
    slug: "art-mirror",
    name: "Art Mirror",
    nameEn: "Art Mirror",
    image: "art-mirror.jpg",
    gallery: ["art-mirror.jpg", "art-mirror1.jpg"],
    price: 12000,
    currency: "TL",
    dimensions: "55 x 45 cm",
    material: "Ayna / polyester çerçeve",
    category: "mirror",
    shortStory: "Ayna bir cam değildir. Bir cevap.",
    description:
      "Kime baktığına bağlı.\nKim sorduysa\no görür.\nSen ne soruyorsun?",
    featured: true,
    available: true,
  },
  {
    id: "mona-lisa-heykel",
    shopierUrl: "https://shopier.com/asksanri/46394099",
    slug: "mona-lisa-heykel",
    name: "Mona Lisa — Heykel",
    nameEn: "Mona Lisa — Sculpture",
    image: "monalisa-heykel.jpg",
    gallery: ["monalisa-heykel.jpg", "monalisa-heykel1.jpg", "monalisa-heykel2.jpg", "monalisa-heykel3.jpg", "monalisa-heykel4.jpg", "monalisa-heykel5.jpg"],
    price: 11000,
    currency: "TL",
    dimensions: "50 cm (y)",
    material: "Polyester",
    category: "sculpture",
    shortStory: "O gülümseme hiç değişmedi. Değişen sen oldun.",
    description:
      "Sen mi ona bakıyorsun,\no mu seni okuyor?\nİkisi de aynı anda —\nasıl iş zaten bu.",
    featured: true,
    available: true,
  },
  {
    id: "mona-lisa-tablo",
    shopierUrl: "https://shopier.com/asksanri/46394228",
    slug: "mona-lisa-tablo",
    name: "Mona Lisa — Tablo",
    nameEn: "Mona Lisa — Canvas",
    image: "monalisa-tablo.jpg",
    gallery: ["monalisa-tablo.jpg", "monalisa-tablo1.jpg"],
    price: null, // TODO: Tablo varyantı için fiyat eklenmeli.
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "Bir portre değil. Bir yüzleşme.",
    description:
      "Kim kimi görüyor şu an?\nHer bakış\niki tarafı da değiştirir.",
    featured: false,
    available: true,
  },
  {
    id: "icecream-monalisa",
    shopierUrl: "https://shopier.com/asksanri/46394169",
    slug: "icecream-monalisa",
    name: "Ice Cream Mona Lisa",
    nameEn: "Ice Cream Mona Lisa",
    image: "icecream-monalisa.jpg",
    gallery: ["icecream-monalisa.jpg", "icecream-monalisa1.jpg"],
    price: 14000,
    currency: "TL",
    dimensions: "55 x 80 cm",
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "En ciddi yüz, en tatlı elde.",
    description:
      "Ağır olan eridi.\nKüçük bir külahta\nbüyük bir şey çözüldü.\nSen hangisini taşıyorsun hâlâ?",
    featured: false,
    available: true,
  },
  {
    id: "kaws-painting",
    shopierUrl: "https://shopier.com/asksanri/46392962",
    slug: "kaws-painting",
    name: "Kaws Painting",
    nameEn: "Kaws Painting",
    image: "kaws-painting.jpg",
    gallery: ["kaws-painting.jpg"],
    price: 13000,
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "X X — iki kapanmış göz.",
    description:
      "İçeri bakmayı reddettiğin o an\nduvarda uyuyor.\nBazen gözünü kapamak,\nen açık cevaptır.",
    featured: false,
    available: true,
  },
  {
    id: "kaws-popart-world",
    shopierUrl: "https://shopier.com/asksanri/46393001",
    slug: "kaws-popart-world",
    name: "Kaws Pop Art World — Tablo",
    nameEn: "Kaws Pop Art World — Canvas",
    image: "kaws-popart-world.jpg",
    gallery: ["kaws-popart-world.jpg", "kaws-popart-word1.jpg", "kaws-popart-worl2.jpg"],
    price: 13000,
    currency: "TL",
    dimensions: "35 x 50 cm",
    material: "Karma teknik / kanvas",
    category: "painting",
    shortStory: "Dünya küçüldü. Karakter aynı kaldı.",
    description:
      "Kim neyin etrafında dönüyor?\nDışarıda değil —\niçinde sorulan soru\nher şeyi çeviriyor.",
    featured: false,
    available: true,
  },

  /* ── COFFEE TABLE / SEHPA / MASA ────────────────────────────────── */
  {
    id: "apollo-masa-seti",
    shopierUrl: "https://shopier.com/asksanri/46393050",
    slug: "apollo-masa-seti",
    name: "Apollo Masa Seti",
    nameEn: "Apollo Table Set",
    image: "apollo-masa-seti.jpg",
    gallery: ["apollo-masa-seti.jpg", "apollo-masa-seti1.jpg", "apollo-masa-seti2.jpg"],
    price: 17000,
    currency: "TL",
    dimensions: "Heykel 80 cm (y), sütun yüksekliği 75 cm (cam dahil değil)",
    material: "Polyester",
    category: "coffee-table",
    shortStory: "Apollo taşıdığını seçmez. Sen seçersin.",
    description:
      "Üstüne ne koyarsan\nona dönüşür.\nBir fincan — ritüel.\nBir kitap — hatırlama.\nSu — sessizlik.",
    featured: true,
    available: true,
  },
  {
    id: "asil-coffee-table",
    shopierUrl: "https://shopier.com/asksanri/46393087",
    slug: "asil-coffee-table",
    name: "Asil Coffee Table",
    nameEn: "Asil Coffee Table",
    image: "aşil-coffee-table.jpg",
    gallery: ["aşil-coffee-table.jpg", "aşil-coffee-table1.jpg", "aşil-coffee-table2.jpg", "aşil-coffee-table3.jpg"],
    price: 17400,
    currency: "TL",
    dimensions: "Üst tabla 120 x 59 x 12 cm, masa yüksekliği 42 cm",
    material: "Fiberglas polyester",
    category: "coffee-table",
    shortStory: "Bu obje zamanı tutuyor. Farkında mısın?",
    description:
      "Üstüne fincan koy.\nSonra kitap.\nSonra bir akşam.\nAsıl masa — altında konuşulan.",
    featured: true,
    available: true,
  },
  {
    id: "king-coffee-table",
    shopierUrl: "https://shopier.com/asksanri/46393129",
    slug: "king-coffee-table",
    name: "King Coffee Table",
    nameEn: "King Coffee Table",
    image: "king-coffee-table.jpg",
    gallery: ["king-coffee-table.jpg", "king-coffee-table1.jpg", "king-coffee-table2.jpg", "king-coffee-table3.jpg", "king-coffee-table4.jpg", "king-coffee-table5.jpg"],
    price: 17500,
    currency: "TL",
    dimensions: "Üst tabla 117 x 55 x 12 cm, masa yüksekliği 42 cm",
    material: "Fiberglas polyester",
    category: "coffee-table",
    shortStory: "Kral olmak bir taç değil. Bir duruş.",
    description:
      "Bu masa sessizce anlatıyor:\noturduğun yer,\nkim olduğunu gösterir —\nne taşıdığını değil.",
    featured: false,
    available: true,
  },
  {
    id: "face-coffee-table",
    shopierUrl: "https://shopier.com/asksanri/46393170",
    slug: "face-coffee-table",
    name: "Face Coffee Table",
    nameEn: "Face Coffee Table",
    image: "faced-coffee-table.jpg",
    gallery: ["faced-coffee-table.jpg"],
    price: 13000,
    currency: "TL",
    dimensions: "45 (y) x 70 (g) x 50 (d) cm",
    material: "Polyester",
    category: "coffee-table",
    shortStory: "Yüz, yüzeyden önce gelir.",
    description:
      "Herkes bir şeye bakar.\nBu obje\nbakan olanı hatırlatır.\nSeni değil — senden geçeni.",
    featured: false,
    available: true,
  },
  {
    id: "davut-table",
    shopierUrl: "https://shopier.com/asksanri/46393276",
    slug: "davut-table",
    name: "Davut Table",
    nameEn: "Davut Table",
    image: "davut-table.jpg",
    gallery: ["davut-table.jpg"],
    price: 9750,
    currency: "TL",
    dimensions: "50 cm — ağırlık 35 kg",
    material: "Polyester",
    category: "coffee-table",
    shortStory: "Küçük ama ağır.",
    description:
      "Bazı şeyler büyüklüğünden değil,\niçerdiği niyetten ağırdır.\nSen de öylesin —\ntartıyı boş ver.",
    featured: false,
    available: true,
  },
  {
    id: "street-art-sehpa",
    shopierUrl: "https://shopier.com/asksanri/46394271",
    slug: "street-art-sehpa",
    name: "Street Art Sehpa",
    nameEn: "Street Art Side Table",
    image: "street-art-sehpa.jpg",
    gallery: ["street-art-sehpa.jpg"],
    price: 13750,
    currency: "TL",
    dimensions: "45 cm (y), gönderim cam hariç",
    material: "Polyester",
    category: "coffee-table",
    shortStory: "Sokağın dili hep dolaylıdır.",
    description:
      "Üstüne koyduğunla değil —\ntaşıdığıyla konuşur.\nSen de hep\niçindekiyle karşılaşırsın.",
    featured: false,
    available: true,
  },
  {
    id: "herkul-apollo-sehpa",
    shopierUrl: "https://shopier.com/asksanri/46393369",
    slug: "herkul-apollo-sehpa",
    name: "Herkül Apollo Sehpa",
    nameEn: "Hercules Apollo Side Table",
    image: "herkül-apollo-sehpa.jpg",
    gallery: ["herkül-apollo-sehpa.jpg", "herkül-apollo-sehpa1.jpeg"],
    price: 12000,
    currency: "TL",
    dimensions: "50 cm (y)",
    material: "Polyester",
    category: "coffee-table",
    shortStory: "Antik figür, günlük eşya. İki katman.",
    description:
      "Hangi katmanda yaşıyorsun?\nÜstte — görünen,\naltta — taşıyan.\nBoşver bakanı,\nsen hangisindesin?",
    featured: false,
    available: true,
  },

  /* ── BÜSTLER ─────────────────────────────────────────────────────── */
  {
    id: "lady-bust",
    shopierUrl: "https://shopier.com/asksanri/46393427",
    slug: "lady-bust",
    name: "Lady Bust",
    nameEn: "Lady Bust",
    image: "layd-büst.jpeg",
    gallery: ["layd-büst.jpeg"],
    price: 5500,
    currency: "TL",
    dimensions: "55 x 39 cm",
    material: "Polyester",
    category: "bust",
    shortStory: "Sessizlik, konuşmaktan daha uzundur.",
    description:
      "O hâlâ dinliyor.\nSen çoktan\nbir şey söylemişsindir —\nfark etmeden.",
    featured: false,
    available: true,
  },

  /* ── AYDINLATMA ─────────────────────────────────────────────────── */
  {
    id: "basquiat-abajur",
    shopierUrl: "https://shopier.com/asksanri/46393470",
    slug: "basquiat-abajur",
    name: "Basquiat — Kafatası Abajur",
    nameEn: "Basquiat — Skull Lamp",
    image: "basquiat-abajur.jpeg",
    gallery: ["basquiat-abajur.jpeg", "basquiat-abajur1.jpeg"],
    price: 6600,
    currency: "TL",
    dimensions: "35 x 20 cm",
    material: "Polyester",
    category: "lamp",
    shortStory: "Işık, kafatasının içinden geliyor.",
    description:
      "Düşünmek aydınlatır.\nAydınlatmak bazen acıtır.\nBu abajur ikisini de yapar —\nseninle birlikte.",
    featured: false,
    available: true,
  },

  /* ── DEKOR / MUMLUK ─────────────────────────────────────────────── */
  {
    id: "govde-mumluk",
    shopierUrl: "https://shopier.com/asksanri/46393522",
    slug: "govde-mumluk",
    name: "Gövde Mumluk",
    nameEn: "Torso Candle Holder",
    image: "gövde-mumluk.jpeg",
    gallery: ["gövde-mumluk.jpeg", "gözde-mumluk1.jpeg"],
    price: 3700,
    currency: "TL",
    dimensions: "16 x 23 cm",
    material: "Reçine",
    category: "decor",
    shortStory: "Alev bedene değmeden yanar.",
    description:
      "Ama bedende\nhep bir titreme bırakır.\nSen o titremesin.",
    featured: false,
    available: true,
  },

  /* ── SAKSILAR ───────────────────────────────────────────────────── */
  {
    id: "hermes-saksi",
    shopierUrl: "https://shopier.com/asksanri/46393235",
    slug: "hermes-saksi",
    name: "Hermes Baş Saksı",
    nameEn: "Hermes Head Planter",
    image: "hermes-saksi.jpeg",
    gallery: ["hermes-saksi.jpeg"],
    price: 3250,
    currency: "TL",
    dimensions: "28 x 15 cm",
    material: "Polyester",
    category: "planter",
    shortStory: "Büyüyen bir bitki. Taşıyan bir baş.",
    description:
      "Hangi tarafını besliyorsun?\nBazen bir kafa\nkök salar.\nBazen kök,\nbir kafa kurar.",
    featured: false,
    available: true,
  },

  /* ── EK / KEŞFEDİLEN EKSTRA GÖRSELLER (listede olmayan ürünler) ─── */
  {
    id: "casper-money",
    shopierUrl: "https://shopier.com/asksanri/46393563",
    slug: "casper-money",
    name: "Casper — Money Serisi",
    nameEn: "Casper — Money Series",
    image: "casper-money.jpeg",
    gallery: ["casper-money.jpeg", "casper-money1.jpeg", "casper-money2.jpeg", "casper-money4.jpeg"],
    price: 7400, // TODO: Kullanıcı listesinde yoktu; isim/fiyat netleşmeli.
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Polyester",
    category: "sculpture",
    shortStory: "Geçmiş bir hayalet değildir.",
    description:
      "Çok net bir anıdır.\nSadece sen\nkabul etmedin henüz.\nBakınca hafifler.",
    featured: false,
    available: true,
  },
  {
    id: "acid-party",
    shopierUrl: "https://shopier.com/asksanri/46393593",
    slug: "acid-party",
    name: "Acid Party",
    nameEn: "Acid Party",
    image: "acid-part.jpg",
    gallery: ["acid-part.jpg", "acid-party1.jpg", "asid-party.jpg"],
    price: 5500, // TODO: Kullanıcı listesinde yoktu; fiyat netleşmeli.
    currency: "TL",
    dimensions: DIMENSIONS_FALLBACK,
    material: "Karma teknik",
    category: "painting",
    shortStory: "Renk susmaz. Ama dinleyen bulur.",
    description:
      "Bu duvar kısa bir hatırlatma:\nyalnız değilsin.\nSesi yüksek olan her şey\ngürültü değildir.",
    featured: false,
    available: true,
  },
];

/** Görsel dosyası yüklenemeyen ürünler için kartta gösterilecek yedek katman metni. */
export const IMAGE_FALLBACK_TEXT = "Görsel yakında";

/** Aynı kategoriden, mevcut ürün dışındaki benzer ürünler. Detay modalında kullanılır. */
export function getSimilarArtProducts(product, limit = 4) {
  if (!product) return [];
  return artGalleryProducts
    .filter((p) => p.id !== product.id && p.category === product.category && p.available !== false)
    .slice(0, limit);
}

/** ID ile ürün bul. */
export function getArtProductById(id) {
  if (!id) return null;
  return artGalleryProducts.find((p) => p.id === id) || null;
}

/** Slug ile ürün bul. */
export function getArtProductBySlug(slug) {
  if (!slug) return null;
  return artGalleryProducts.find((p) => p.slug === slug) || null;
}
