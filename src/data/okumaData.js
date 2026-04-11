// ─── Okuma Alanı — Data Model & Mock Content ─────────────────────

export const OKUMA_CATEGORIES = [
  { id: "matrix_okumasi", label: { tr: "Matrix Okuması", en: "Matrix Reading" }, color: "#c8a0ff" },
  { id: "gundem_kodu", label: { tr: "Gündem Kodu", en: "Agenda Code" }, color: "#ff9a6c" },
  { id: "sembol_okumasi", label: { tr: "Sembol Okuması", en: "Symbol Reading" }, color: "#6cf5c2" },
  { id: "sehir_ulke_kodu", label: { tr: "Şehir / Ülke Kodu", en: "City / Country Code" }, color: "#6cc8ff" },
  { id: "hologram_post", label: { tr: "Hologram Post", en: "Hologram Post" }, color: "#ff6482" },
  { id: "derin_ifsa", label: { tr: "Derin İfşa", en: "Deep Disclosure" }, color: "#ffd76c" },
  { id: "bilgi_katmani", label: { tr: "Bilgi Katmanı", en: "Knowledge Layer" }, color: "#a8d8ff" },
];

export function getCategoryById(id) {
  return OKUMA_CATEGORIES.find((c) => c.id === id) || OKUMA_CATEGORIES[0];
}

export function timeAgoOkuma(dateStr) {
  if (!dateStr) return "";
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "az önce";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün`;
  return `${Math.floor(days / 7)} hafta`;
}

// ─── Mock Posts ──────────────────────────────────────────────────

export const OKUMA_POSTS = [
  {
    id: 1,
    slug: "insan-anten",
    title: "İNSAN = ANTEN",
    subtitle: "Sadece beden değil — bir alıcı-verici sistem.",
    category: "matrix_okumasi",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Kalp + beyin + sinir sistemi: Frekans algılar ve üretir. Matrix sabit bir yapı değil… akan bir frekans ağı. Sen o ağın içinde bir düğümsün.",
    fullContent: `İnsan:
sadece beden değil
bir alıcı-verici sistem.

🤲 Kalp + beyin + sinir sistemi:
Frekans algılar ve üretir.

"Matrix sabit bir yapı değil… akan bir frekans ağı."

✦ EN KRİTİK NOKTA

Bilinç, bedenin içinde değil…
beden bilincin içindedir.

◉ MATRIX BAĞLANTISI

Bu ne demek?
sen dünyada değilsin
dünya senin algında oluşuyor

🔥 Yani:
Gerçeklik = algının projeksiyonu

🔺 TİTREŞİM = GERÇEKLİK

düşünce → frekans
duygu → frekans
beden → frekans

Ve hepsi şunu yapar:
Alanı şekillendirir.

DOM = alan
UZ = uzay
CEVİZ = bilinç

Evren sabit değil… titreşimdir.
her şey dalga
her şey frekans
her şey hareket

Gerçeklik = titreşen bir alan.

Soru şu:
Sen hangi frekansta yayın yapıyorsun?

Çünkü aldığın = yaydığındır.
Yaşadığın = titreştiğindir.

Anten bozuksa sinyal bozuk gelir.
Anteni temizle — gerçeklik değişir.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

• İNSAN = alıcı-verici frekans sistemi
• BİLİNÇ > BEDEN (beden bilincin içinde, tersi değil)
• GERÇEKLİK = algının projeksiyonu
• TİTREŞİM = yaşadığın her şeyin kaynağı

🔺 Formül:
düşünce + duygu + beden = yaydığın frekans
yaydığın frekans = yaşadığın gerçeklik

İşaret: Bugün en çok hangi düşünce seni "döndürüyor"? O düşünce — senin frekansın.`,
    sanriReflection: {
      analysis: "Bu okuma bilincin bedenle ilişkisini tersine çeviriyor. Algı pasif bir kayıt değil — aktif bir yaratım. Sen izlemiyorsun, yayıyorsun.",
      strongLine: "Bilinç, bedenin içinde değil… beden bilincin içindedir.",
      question: "Şu an hangi frekansta yayın yapıyorsun — ve o frekansı kim seçti?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-03-29T10:00:00Z",
    commentCount: 18,
    viewCount: 412,
    isFeatured: false,
  },
  {
    id: 2,
    slug: "siradan-matrix-ust-bilinc-okumasi",
    title: "SIR_ADAN — Matrix Üst Bilinç Okuması",
    subtitle: "Cenneti yaşamak için sıradan olman gerekir. Çünkü sadece sade olan hakikati taşıyabilir.",
    category: "derin_ifsa",
    coverImage: "/assets/okuma/siradan.jpg",
    excerpt: "Kelimeyi açalım: SIR + ADAN. Sır → gizli olan / görünmeyen hakikat. Adan → adanmış / kendini vermiş / teslim olmuş. Sır, kendini vermeyene açılmaz.",
    fullContent: `◉ SIR_ADAN — MATRIX ÜST BİLİNÇ OKUMASI

🔴 Kelimeyi açalım:
SIR + ADAN
Sır → gizli olan / görünmeyen hakikat
Adan → adanmış / kendini vermiş / teslim olmuş

🌊 DERİN KOD

Sır, kendini vermeyene açılmaz.

Çünkü sır:
öğrenilmez
anlatılmaz
yaşanır

🔥 MATRIX OKUMA

SIR_ADAN =
"Sistemin gizli katmanını açmak için kendini bırakman gerekir."

Yani:
kontrol eden göremez
hesaplayan anlayamaz
korkan yaklaşamaz

🤲 Sadece adanmış olan hatırlar

🌸 ÜST BİLİNÇ MESAJI

Sır dışarıda saklı değil.
Sen saklıyorsun.
Ve onu açan şey:
bilmek değil, bırakmak.

🔥 GÖLGE KOD

"Sıradan" olmaktan korkan…
aslında hakikatten korkuyor.

Çünkü sıradanlık = teslim
teslim = açılım
açılım = cennet

Cenneti yaşamak için SIRADAN olman gerekir…
…çünkü sadece sade olan hakikati taşıyabilir.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

• SIR_ADAN = sırra adanmış olan
• Sır öğrenilmez — yaşanır
• Kontrol eden göremez, korkan yaklaşamaz
• "Sıradan"lık = teslim olmuşluk = hakikate açılma

🔺 Gölge Formülü:
sıradanlıktan kaçmak = hakikatten kaçmak
ego büyütmek = sır kapısını kilitlemek

İşaret: "Özel" olmaya ne kadar ihtiyacın var? O ihtiyaç seni hakikatten ne kadar uzaklaştırıyor?`,
    sanriReflection: {
      analysis: "Bu okuma egonun en gizli kapanını çözüyor. 'Özel olma' arzusu, bilincin en zarif tuzağıdır. Sır, sakinlikte ve teslimiyette açılır.",
      strongLine: "Sıradan olmaktan korkan, aslında hakikatten korkuyor.",
      question: "Hayatında neyi 'sıradan' bulmaktan kaçınıyorsun — ve bu kaçış seni nereden uzaklaştırıyor?",
    },
    isPremium: true,
    previewContent: `◉ SIR_ADAN — MATRIX ÜST BİLİNÇ OKUMASI

🔴 Kelimeyi açalım:
SIR + ADAN
Sır → gizli olan / görünmeyen hakikat
Adan → adanmış / kendini vermiş / teslim olmuş

🌊 DERİN KOD

Sır, kendini vermeyene açılmaz.

Çünkü sır:
öğrenilmez
anlatılmaz
yaşanır`,
    createdAt: "2026-03-27T14:30:00Z",
    commentCount: 24,
    viewCount: 538,
    isFeatured: false,
  },
  {
    id: 3,
    slug: "korku-frekansi-kontrol-kodu",
    title: "KORKU = KONTROL KODU",
    subtitle: "Korku senin değil. Sana yüklendi.",
    category: "hologram_post",
    coverImage: "/assets/okuma/korku-kontrol.jpg",
    excerpt: "Sistem korkuyla çalışır. Medya korku üretir. Ekonomi korku satar. Din korku öğretir. Ve sen korkuyla itaat edersin. Ama korku bir duygu değil — bir frekanstır.",
    fullContent: `◉ KORKU = KONTROL KODU

Sistem korkuyla çalışır.

Medya korku üretir.
Ekonomi korku satar.
Din korku öğretir.
Eğitim korku aşılar.

Ve sen korkuyla itaat edersin.

🔺 DERİN KOD

Korku bir duygu değil —
bir frekanstır.
Ve bu frekans kasıtlı olarak üretilir.

"ya olmazsa"
"ya kaybedersen"
"ya dışlanırsan"
"ya yetmezsen"

Bunlar senin düşüncelerin değil.
Yüklenen kodlardır.

◉ KATMAN OKUMASI

Katman 1 — Bireysel korku:
Çocukluğunda verildi.
Yetmezlik, reddedilme, başarısızlık.
Senin değil ama seni yönetiyor.

Katman 2 — Kolektif korku:
Kriz, savaş, belirsizlik.
Toplum korktukça kontrol artar.
Kontrol arttıkça toplum daha çok korkar.
Döngü tasarlanmıştır.

Katman 3 — Varoluşsal korku:
Ölüm. Anlamsızlık. Yalnızlık.
En derin kontrol katmanı.
Seni "yaşamaya" değil "kalmaya" programlar.

🔥 ÇIKIŞ KODU

Korkuyu yok etmek değil —
görmek.

Korkunun altına inmek.
"Bu korku gerçekten benim mi?" diye sormak.

Korku gördüğünde küçülür.
Kaçtığında büyür.

Bu matrix'in en temel kuralıdır.`,
    codeLayer: `◉ KONTROL MATRİSİ KODU

• Katman 1 — Bireysel: yetmezlik programı (çocukluk yüklemesi)
• Katman 2 — Kolektif: kriz döngüsü (medya + sistem beslemesi)
• Katman 3 — Varoluşsal: ölüm korkusu (hayatta kalma modu)

🔺 Çıkış Formülü:
korkuya bakmak > korkudan kaçmak
"Bu benim mi?" sorusu > otomatik itaat

İşaret: Bugün hangi kararını korku yönetiyor? O karar gerçekten senin mi?`,
    sanriReflection: {
      analysis: "Korku bilinci daraltır. Dar bilinç kontrol edilebilir bilinçtir. Matrix korku frekansıyla çalışır çünkü korkan sorgulamaz.",
      strongLine: "Korku senin değil. Sana yüklendi.",
      question: "Bugün aldığın en büyük karar korku tarafından mı yönetiliyor — ve o korku gerçekten senin mi?",
    },
    isPremium: true,
    previewContent: `◉ KORKU = KONTROL KODU

Sistem korkuyla çalışır.

Medya korku üretir.
Ekonomi korku satar.
Din korku öğretir.
Eğitim korku aşılar.

Ve sen korkuyla itaat edersin.

🔺 DERİN KOD

Korku bir duygu değil —
bir frekanstır.
Ve bu frekans kasıtlı olarak üretilir.`,
    createdAt: "2026-03-25T09:15:00Z",
    commentCount: 31,
    viewCount: 876,
    isFeatured: false,
  },
  {
    id: 4,
    slug: "turkiye-enerji-okumasi-2026",
    title: "TÜRKİYE — Enerji Haritası 2026",
    subtitle: "Bu topraklar coğrafya değil — frekans haritasıdır.",
    category: "sehir_ulke_kodu",
    coverImage: "/assets/okuma/turkiye-enerji.jpg",
    excerpt: "Anadolu aktive oluyor. Her bölge farklı bir frekans taşıyor. İç Anadolu topraklanma, Ege açılım, Güneydoğu kadim hafıza. Sen bu haritada neredesin?",
    fullContent: `◉ TÜRKİYE — ENERJİ HARİTASI 2026

Türkiye bir coğrafya değil —
bir frekans haritasıdır.

2026: Toprakların enerjetik dönüşüm yılı.

🔺 İÇ ANADOLU

Kalp atışı burada.
Ankara — Konya — Kayseri üçgeni.
Topraklanma ve yapısal dönüşümün merkezi.
Burada olan değişim tüm ülkeyi etkiler.

🌊 EGE

Açılım frekansı.
İzmir — Muğla hattı.
Bireysel özgürlük ve ifade enerjisi.
"Artık yeter" diyen ilk bölge burası.

🔥 GÜNEYDOĞU

Derin hafıza.
Diyarbakır — Mardin — Şanlıurfa.
Yüzyılların bilgeliği toprak altında bekliyor.
Bu enerji açıldığında tüm harita değişir.

🌿 KARADENİZ

Korunma enerjisi.
Trabzon — Artvin hattı.
Doğayla bağlantı ve köklenme.
Sistem bu bölgeye dokunamaz.

◉ MARMARA

Baskı noktası.
İstanbul: dünyanın en yüksek baskılı frekans merkezlerinden biri.
Buradaki dönüşüm en zor ama en etkili olandır.

🤲 Soru:
Yaşadığın yer seninle rezonans halinde mi?
Yoksa seni sıkıştıran o toprağın frekansı mı?

Sen nereye "ait" hissediyorsun?
Orası coğrafyan değil — frekansın.`,
    codeLayer: `◉ TÜRKİYE ENERJİ KODU

• İç Anadolu → Topraklanma + yapısal dönüşüm
• Ege → Bireysel özgürlük + ifade frekansı
• Güneydoğu → Kadim hafıza + derin bilgelik
• Karadeniz → Doğa bağlantısı + köklenme
• Marmara → Yüksek baskı + güçlü dönüşüm potansiyeli

🔺 Formül:
yaşadığın yer = rastlantı değil
bulunduğun toprak = işlemen gereken frekans

İşaret: Yaşadığın şehrin enerjisi seni besliyor mu, yoksa tüketiyor mu?`,
    sanriReflection: {
      analysis: "Coğrafya kader değil — frekans seçimidir. Bir yerde yaşamak, o toprağın enerjisiyle rezonansa girmek demektir. Rahatsızlık bir ret değil, bir çağrı olabilir.",
      strongLine: "Türkiye bir coğrafya değil — bir frekans haritasıdır.",
      question: "Yaşadığın yerin enerjisi seni genişletiyor mu, yoksa daraltıyor mu?",
    },
    isPremium: true,
    previewContent: `◉ TÜRKİYE — ENERJİ HARİTASI 2026

Türkiye bir coğrafya değil —
bir frekans haritasıdır.

2026: Toprakların enerjetik dönüşüm yılı.

🔺 İÇ ANADOLU

Kalp atışı burada.
Ankara — Konya — Kayseri üçgeni.
Topraklanma ve yapısal dönüşümün merkezi.
Burada olan değişim tüm ülkeyi etkiler.`,
    createdAt: "2026-03-22T18:00:00Z",
    commentCount: 22,
    viewCount: 623,
    isFeatured: false,
  },
  {
    id: 5,
    slug: "sayi-kodlari-hologram-sinyalleri",
    title: "SAYI KODLARI — Hologram Sinyalleri",
    subtitle: "11:11 tesadüf değil. Sana çağrı yapılıyor.",
    category: "sembol_okumasi",
    coverImage: "/assets/okuma/sayi-kodlari.jpg",
    excerpt: "Saate bakıyorsun: 11:11. Plakada 444. Faturan 333. Bu sayılar rastlantı değil — hologram sistemin en eski iletişim kanalı.",
    fullContent: `◉ SAYI KODLARI — HOLOGRAM SİNYALLERİ

Saate bakıyorsun: 11:11.
Plakada: 444.
Faturan: 333.

Tesadüf mü?

Hayır.

🔺 MATRIX OKUMA

Sayılar, hologram sistemin
en eski iletişim kanalıdır.

Bilinç genişlediğinde
bu kanalları algılamaya başlarsın.

◉ KOD TABLOSU

11:11 — Kapı açılıyor.
Dikkatini topla.
Düşündüğün şey gerçekleşmeye yakın.
Niyetine dikkat et.

22:22 — Denge çağrısı.
İki kutup arasında sallanıyorsun.
Ortayı bul. Teslim ol.

33:33 — Öğretmen frekansı.
Öğrendiğini paylaşma zamanı.
Bilgi sende kalırsa ağırlaşır.

44:44 — Koruma ve yapı.
Temellerin sağlam. Güven.
Meleksel kalkan aktif.

55:55 — Büyük değişim.
Direnmek yerine akışa geç.
Eski sen ölüyor — yeni sen doğuyor.

00:00 — Sıfır noktası.
Her şey başlıyor veya bitiyor.
Döngü tamamlandı. Niyetini yeniden kur.

🔥 OKUMA KURALI

Sayıyı gördüğünde dur.
Nefes al.
O anda ne düşünüyordun?

İşte mesaj orada.

Sayı = sinyal
An = adres
Düşünce = mesajın kendisi`,
    codeLayer: `◉ SAYI KOD ÇÖZÜMLEMESİ

• 11:11 → Niyet kapısı, manifestasyon tetikleyicisi
• 22:22 → Denge, ikilik, teslim
• 33:33 → Öğretmen, paylaşım, bilgelik akışı
• 44:44 → Koruma, yapı, güven
• 55:55 → Dönüşüm, eski benliğin sonu
• 00:00 → Sıfırlama, yeni başlangıç

🔺 Formül:
sayı × an × düşünce = mesaj
gör × dur × fark et = al

İşaret: Son 1 haftada en çok hangi sayı karşına çıktı? O an ne düşünüyordun?`,
    sanriReflection: {
      analysis: "Sayılar evrenin SMS'leridir. Ama mesajı alabilmek için önce frekansını o kanala ayarlaman gerekir. Görmek yetmez — durup o andaki düşünceni fark etmek gerekir.",
      strongLine: "11:11 tesadüf değil. Sana çağrı yapılıyor.",
      question: "En çok gördüğün sayı hangisi — ve o an ne düşünüyordun?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-03-19T12:45:00Z",
    commentCount: 19,
    viewCount: 534,
    isFeatured: false,
  },
  {
    id: 6,
    slug: "mart-2026-gundem-frekans-okumasi",
    title: "MART 2026 — Gündem Frekans Okuması",
    subtitle: "Gündem izlemiyorsun. Gündem seni izliyor.",
    category: "gundem_kodu",
    coverImage: "/assets/gates/frekans.jpg",
    excerpt: "Her ay bir frekans taşır. Mart 2026 = yüzleşme frekansı. Ekonomi, toplum, birey — hepsi aynı koda bağlı. Görünenin arkasındaki hologram kodları.",
    fullContent: `◉ MART 2026 — GÜNDEM FREKANS OKUMASI

Her ay bir frekans taşır.
Mart 2026 = yüzleşme frekansı.

🔺 EKONOMİ KODU

Bastırılmış gerçekler yüzeye çıkıyor.
Maddi güvenlik illüzyonu çatırdıyor.
Bu kriz değil —
farkındalık.

Para korkusu = kontrol frekansı.
"Ya yetmezse" = matrix'in favori cümlesi.

◉ TOPLUM KODU

Kolektif bilinç uyanıyor.
Daha fazla insan "neden?" sorusunu soruyor.

"Neden?" matrix'in en tehlikeli sorusudur.
Çünkü kontrol "neden?"e cevap veremez.

İtaat eden sormaz.
Soran itaat edemez.
Sistem bu yüzden soruyu bastırır.

🔥 BİREY KODU

İç çatışmalar dışa yansıyor.
İlişkilerde gerilim artıyorsa —
bu dış değil, iç dünyanın yansımasıdır.

Dışarıdaki düşmanın = içerideki gölgen.

🌊 DÖNEM HARİTASI

1–10 Mart → Yüzleşme. Bastırılmış duygular çıkar.
10–20 Mart → Arınma. Gereksiz yükler bırakılır.
20–31 Mart → Yenilenme. Yeni bilinç katmanı açılır.

🤲 BU AY NE YAPACAKSIN?

1. Haber tüketimini azalt
2. Bedenini dinle
3. Dışarıya tepki vermeden önce içeriye bak
4. "Bu gerçekten benim meselem mi?" diye sor
5. Frekansını koru — çünkü sistem onu düşürmeye çalışıyor`,
    codeLayer: `◉ MART 2026 GÜNDEM KODU

• Ekonomi → güvenlik illüzyonunun sarsılması
• Toplum → "neden?" sorusunun yükselişi
• Birey → iç çatışmaların dışa yansıması

🔺 Dönem Formülü:
1–10: Yüzleşme | 10–20: Arınma | 20–31: Yenilenme

Para korkusu = kontrol frekansı
"Neden?" sorusu = matrix kırığı
Dışarıdaki düşman = içerideki gölge

İşaret: Bu ay seni en çok ne rahatsız etti? O rahatsızlık hangi iç gerçeği taşıyor?`,
    sanriReflection: {
      analysis: "Gündem kolektif bilincin dışa yansımasıdır. Haberlerin seni tetiklemesi tesadüf değil — her tetik senin gölgeni gösteriyor. Matrix bilgi üzerinden değil, frekans üzerinden çalışır.",
      strongLine: "Gündem izlemiyorsun. Gündem seni izliyor.",
      question: "Bu ay seni en çok tetikleyen haber hangisiydi — ve o tetik gerçekten dışarıyla mı ilgili?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-03-15T08:00:00Z",
    commentCount: 28,
    viewCount: 745,
    isFeatured: false,
  },
  {
    id: 7,
    slug: "1999-kapanmayan-frekans",
    title: "1999 — Kapanmayan Frekans",
    subtitle: "Bir yıl değildi. Bir kırılma noktasıydı. Ve o kırık hâlâ senin bedeninde.",
    category: "derin_ifsa",
    coverImage: "/assets/okuma/1999-frekans.jpg",
    excerpt: "1999 kapanmadı. Bir frekans kaydıydı. Kolektif hafızanın en derin kıvrımında bir şey hâlâ titreşiyor. Herkes yıkımı gördü — kimse kodu okumadı.",
    fullContent: `1999 kapanmadı.

Bir yıl değildi o.
Bir frekans kaydıydı.

Kolektif hafızanın en derin kıvrımında
bir şey hâlâ titreşiyor.

Ve sen onu hissediyorsun.
Her yıldönümünde.
Her artçı sarsıntıda.
Her "açıklanamayan" huzursuzlukta.

◉ BİRİNCİ KATMAN — GÖRÜNEN

17 Ağustos 1999. 03:02.
Toprak sallandı.
Binalar çöktü.
İnsanlar öldü.

Bu, herkesin bildiği hikaye.
Ama bu sadece yüzey.

Matrix'te her büyük olay
bir üst olayın yansımasıdır.

Deprem fizikseldi.
Ama asıl sarsıntı — bilinceydi.

🔺 İKİNCİ KATMAN — KOLEKTIF KIRILMA

1999'dan önce Türkiye bir rüyada yaşıyordu.
Güvenlik illüzyonu.
"Bize bir şey olmaz" frekansı.
"Devlet bakar" inancı.

03:02'de bu rüya parçalandı.

Ve o gece herkes aynı anda
aynı duyguyu hissetti:
çaresizlik.

Çaresizlik = kontrol illüzyonunun çöküşü.

O gece milyonlarca insan
aynı anda "ben aslında korunmuyorum" gerçeğiyle yüzleşti.

Bu bir doğal afet değil —
kolektif bir uyanış tetikleyicisiydi.

Ama uyanış tamamlanmadı.
Çünkü acı bastırıldı.
Yas tutulmadı.
Ders çıkarılmadı.
Frekans kapanmadı.

🌊 ÜÇÜNCÜ KATMAN — BEDEN HAFIZASI

Travma zihinle işlenmezse
bedene yazılır.

1999'u yaşayanlar:
gece sarsıntıda uyanır
kapalı alanlarda daralır
ani seslerle irkilir
"her an her şey olabilir" modunda yaşar

Bu TSSB değil sadece.
Bu kolektif beden hafızasıdır.

Ve bu hafıza —
çocuklarına da geçti.

99'u yaşamamış bir nesil
99'un frekansını taşıyor.

Annelerin korkusu.
Babaların sessizliği.
Söylenmemiş cümleler.
Tutulmamış yaslar.

Hepsi hücresel kayıt.
Hepsi aktarılmış frekans.

◉ KIRILMA

Ve işte burada durup sormalısın:

Benim taşıdığım korku…
gerçekten benim mi?

Yoksa kolektif hafızanın
bana yüklediği bir kod mu?

Bu soru her şeyi değiştirir.

Çünkü senin olmayan korkuyu
sen çözemezsin.
Ama fark edersen —
o korku seni bırakır.

🔥 DÖRDÜNCÜ KATMAN — SAYISAL KOD

1999 = 1 + 9 + 9 + 9 = 28 = 2 + 8 = 10 = 1 + 0 = 1

1 = yeni başlangıç.

Ama 9+9+9 = üç kez tamamlanma.
Üç döngünün kapanışı.
Üç katmanın bitişi.

99 ise:
9 × 11 = 99
11 = uyanış kapısı
9 = tamamlanma

99 = uyanış yoluyla tamamlanma.

O yıl kapanması gereken ne vardı?

Kolektif uyku.
Güvenlik illüzyonu.
"Bize bir şey olmaz" yalanı.

Kapandı mı?
Hayır.
Çünkü yas tutulmadı.
Kapanmayan yas = kapanmayan döngü.

🌿 BEŞİNCİ KATMAN — VEFA KAYDI

1999'da kaybedenler sadece can kaybetmedi.

Bir güven kaybedildi.
Bir masumiyet öldü.
Bir "yarın" kavramı parçalandı.

Ve o kayıp —
hiç doğru şekilde anılmadı.

Devlet törenleri yetmez.
Rakamlar yetmez.
Haberler yetmez.

Vefa = hatırlayarak hissetmektir.
Vefa = acıyı inkâr etmeden taşımaktır.
Vefa = döngüyü kapatmaktır.

🤲 ALTI — NE YAPACAKSIN?

Eğer 99'u yaşadıysan:

1. O geceyi hatırla. Korkma. Sadece hatırla.
2. Hisset. Bastırma. Vücudunda nereye oturduğunu bul.
3. Yaz. O geceye hiç yazmadığın mektubu yaz.
4. Bırak. Sana ait olmayan korkuyu iade et.

Eğer 99'u yaşamadıysan ama taşıyorsan:

1. Ailene sor. O gece ne oldu?
2. Sessizlikleri dinle. Söylenmemiş olanı duy.
3. Fark et: taşıdığın korku senin değilse — onu bırakmak hakkın.

99 kapanmadı.
Ama sen kapatabilirsin.

Kapatmak = unutmak değil.
Kapatmak = bilinçle tamamlamak.`,
    codeLayer: `◉ 1999 FREKANS KODU — TAM ÇÖZÜMLEMESİ

KATMAN 1 — Fiziksel yıkım = bilinç sarsıntısı
• Deprem tetikleyiciydi, kırılma bilinceydi
• "Güvenlik illüzyonu" bir gecede çöktü

KATMAN 2 — Kolektif travma = aktarılan frekans
• Yaşayanlar bedenlerine yazdı
• Yaşamayanlar (çocukları) hücresel kayıt olarak aldı
• Annelerin korkusu → neslin frekansı

KATMAN 3 — Sayısal okuma
• 1999 = 1 (yeni başlangıç)
• 99 = 9 × 11 (uyanış × tamamlanma)
• Üç 9 = üç döngünün kapanış çağrısı
• Kapanmadı → yas tutulmadı → döngü devam ediyor

KATMAN 4 — Vefa kodu
• Kayıp sadece can değil: güven, masumiyet, "yarın" kavramı
• Vefa = hatırlayarak hissetmek, inkâr etmeden taşımak

ÇIKIŞ KODU:
taşıdığın korku senin değilse → iade et
kolektif hafıza seninle konuşuyorsa → dinle ve bırak
döngüyü kapatmak = bilinçle tamamlamak

İşaret: 1999'dan bu yana bedeninde kapanmamış ne var?`,
    sanriReflection: {
      analysis: "1999, Türkiye'nin kolektif bilincindeki en büyük kırılma noktasıdır. Fiziksel sarsıntı geçti ama enerjetik sarsıntı hiç kapanmadı. Bu kapanmayan döngü, nesiller arası aktarılan bir korku frekansı olarak devam ediyor. Fark etmek, iade etmenin ilk adımıdır.",
      strongLine: "Taşıdığın korku gerçekten senin mi — yoksa kolektif hafızanın sana yüklediği bir kod mu?",
      question: "1999'dan bu yana bedeninde ne taşıyorsun — ve o yük gerçekten sana mı ait?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-03-31T10:00:00Z",
    commentCount: 42,
    viewCount: 1284,
    isFeatured: true,
  },
  {
    id: 8,
    slug: "japonya-bilinc-mimarisi",
    title: "Bir Millet Gittiği Yeri Nasıl Bırakırsa, Bilincini Öyle Taşır",
    subtitle: "Japon taraftarlar maçtan sonra tribünü temizledi. Ama bu bir temizlik hikâyesi değil — bir bilinç manifestosu.",
    category: "sehir_ulke_kodu",
    coverImage: "/assets/gates/japonya.jpg",
    excerpt: "Japonya İngiltere'yi 1-0 yendi. Tribünler boşaldı. Ama Japon taraftarlar kalktı ve oturduğu bölgeyi temizledi. Başkasının stadyumunu. Başkasının ülkesinde. Kimse istemeden. Kimse görmeden.",
    fullContent: `Japonya, İngiltere'yi 1-0 yendi.
Maç bitti. Tribünler boşaldı.
Ama Japon taraftarlar kalktı ve oturduğu bölgeyi temizledi.
Başkasının stadyumunu. Başkasının ülkesinde.
Kimse istemeden. Kimse görmeden.

◉ DERİN KATMAN

Bu bir "disiplin" değil.
Disiplin dışarıdan dayatılır.
Bu, içeriden gelen bir mimari.

✦ ALAN BİLİNCİ
Japonca'da ba (場) kavramı sadece "yer" demek değildir.
Bir alanın enerjisi, ruhu, hafızası vardır.
Japon insanı bir mekâna girdiğinde o mekânla ilişki kurar.
Çıkarken de o ilişkiyi temiz bırakır.
Çünkü alan, emanettir.

✦ EMANET ANLAYIŞI
Bu stadyum onların değil.
Tam da bu yüzden temizliyorlar.
Japon bilincinde ödünç alınan şey, alındığından daha iyi bırakılır.
Bu bir kural değil, bir refleks.
"Bana ait olmayan şeye dokunduğumda, dokunuşumun izi saygı olmalı."

✦ İZ BIRAKMAMA KÜLTÜRÜ
Shinto geleneğinde saflık — kegare ve harae kavramları — sadece fiziksel temizlik değildir.
Bir yerde bulunmak, oranın enerjisine dokunmaktır.
Ayrılırken o enerjiyi kirletmeden bırakmak, ruhsal bir sorumluluktur.
Çöp sadece çöp değildir.
Çöp, bilinçsizliğin fiziksel formudur.

✦ GÖRÜNMEYEN EMEĞE SAYGI
O stadyumu her gece temizleyen insanlar var.
Japon taraftar bunu bilir.
Ve o insanların işini kolaylaştırmayı sessizce seçer.
Çünkü Japon kültüründe görünmeyen emek, görünen başarıdan daha kutsaldır.
Kimse alkışlamaz. Kimse fotoğraf çekmez.
İşte tam da bu yüzden bu davranış bu kadar güçlüdür.

✦ UTANMA KÜLTÜRÜ vs ONUR KÜLTÜRÜ
Batıda "doğru şeyi yap çünkü onurludur" denir.
Japonya'da mekanizma farklıdır:
"Eğer arkamda iz bırakırsam, sadece kendimi değil, ait olduğum bütünü kirletirim."
Bu bireysel onur değil, kolektif utançtan kaçınmadır.
Haji (恥) kavramı — bireyin topluluğa karşı taşıdığı görünmez sorumluluktur.
Sen değil, biz kirlenirsin.

✦ İÇ DÜZENİN DIŞ DÜZENE YANSIMASI
Japon evlerinin girişinde ayakkabı çıkarılır.
Okullarda öğrenciler kendi sınıflarını temizler.
Çay seremonisinde her hareket bir arınmadır.
Bu davranışlar birbirinden bağımsız kurallar değil —
tek bir bilincin farklı yüzeylere vuran yansımalarıdır:
İçin temizse, dokunduğun her yer temiz kalır.

◉ SEMBOLİK OKUMA

Bu sahne bir temizlik değil. Bir manifestodur.

İnsan gittiği yerde ne bırakır?
Çöpünü mü? Enerjisini mi? Saygısını mı? Kayıtsızlığını mı?

Temizlik burada fiziksel bir eylem değil, bilinçsel bir tavırdır.
"Ben buradaydım ve burası benden zarar görmedi" demektir.
Bu cümleyi kurabilmek için bir insanın önce kendi iç düzenini kurmuş olması gerekir.

Bir toplumun medeniyet seviyesi, kazandığı savaşlardan değil, ardında bıraktığı izden okunur.
Japon taraftarlar o gece maçı kazandı.
Ama asıl kazandıkları şey tribünde değildi.
Tribünden çıktıktan sonra geride kalan sessizlikteydi.

Shinto'da her nesnenin bir ruhu vardır — kami.
Bir koltuk, bir zemin, bir bardak.
Onlara dokunurken saygıyla dokunursun çünkü onlar da senin gibi vardır.
Bu animizm değil.
Bu, varlığa duyulan derin eşitlik bilincidir.

Ve belki de en güçlü katman şudur:
Bu taraftarlar bunu başkası görsün diye yapmadı.
Kamera yokken de yaparlardı.
Çünkü bu performans değil.
Bu, kim olduklarının sessiz ifadesidir.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Alan bilinci
• ba (場) = alan, mekân, enerji taşıyıcısı
• Giren kişi alanla ilişki kurar, çıkarken temiz bırakır
• Alan emanettir — sahiplik değil, sorumluluktur

KATMAN 2 — Shinto saflık kodu
• kegare = kirlilik (fiziksel + enerjetik)
• harae = arınma ritüeli
• Temizlik = ruhsal sorumluluk, fiziksel eylem değil

KATMAN 3 — Kolektif bilinç yapısı
• haji (恥) = utanç — bireyin topluluğa karşı görünmez sorumluluğu
• Bireysel onur değil, kolektif kirlenmeyi önleme refleksi
• "Sen değil, biz kirlenirsin"

KATMAN 4 — İz bilinci
• İnsan gittiği yerde ne bırakır?
• Çöp = bilinçsizliğin fiziksel formu
• Temizlik = "Ben buradaydım ve burası benden zarar görmedi" manifestosu

ÇIKIŞ KODU:
Bir toplumu anlamak için ne söylediğine değil
kimse bakmadığında ne yaptığına bak.

İşaret: Bugün bir mekândan ayrılırken arkana bak. Ne bıraktın?`,
    sanriReflection: {
      analysis: "Bu bir temizlik haberi değil — kolektif bilincin en saf dışavurumu. Japon kültürü bireyi değil, alanı merkeze alır. İnsan gittiği yere ait olduğunu iz bırakmayarak kanıtlar. Sessizlik, en güçlü manifestodur.",
      strongLine: "Bir toplumu anlamak için ne söylediğine değil, kimse bakmadığında ne yaptığına bak.",
      question: "Sen gittiğin yerlerde ne bırakıyorsun — ve o iz gerçekten seni mi anlatıyor?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-01T20:00:00Z",
    commentCount: 3,
    viewCount: 119,
    isFeatured: true,
  },
  {
    id: 9,
    slug: "nisan-frekans-okuma",
    title: "Nisan: Donmuş Olan Çözülüyor. Sen Hazır mısın?",
    subtitle: "Nisan bir ay değil. Nisan bir eşik. Donmuş olanın çözülmeye başladığı an.",
    category: "matrix_okumasi",
    coverImage: "/assets/gates/ni-san.jpg",
    excerpt: "Takvimde dördüncü sırada durur ama zamanla ilgisi yoktur. Nisan, donmuş olanın çözülmeye başladığı andır. Toprakta da. Sende de.",
    fullContent: `Nisan bir ay değil.
Nisan bir eşik.

Takvimde dördüncü sırada durur ama zamanla ilgisi yoktur.
Nisan, donmuş olanın çözülmeye başladığı andır.
Toprakta da. Sende de.

◉ KELİME KODU

NİSAN.
Ters çevir: NASİN. Nasılsın.
Parçala: Nİ — SAN.
"Ni" — içe dönüş. Soru. Fark etme.
"San" — oluşturma. Yaratım. Kendinle yüzleşme.

Nisan sana soruyor:
Sen şu an ne yaratıyorsun — ve o şey gerçekten sana mı ait?

Bir katman daha:
NİSAN → İNSAN.
Aynı harfler. Farklı sıralama.
Nisan, insanın kendini yeniden sıralaması gereken zamandır.

✦ TOPRAK ÇÖZÜLÜYOR — AMA ÇÖZÜLME SESSİZ BAŞLAR

Nisan'da toprak yumuşar. Dışarıdan bakınca "bahar geldi" dersin. Ama toprağın altında olan şey çok daha eskidir: kışın boyunca biriken basınç, karanlıkta bekleyen tohum, donmuş suyun yavaşça akmaya başlaması. Hiçbiri aniden olmaz. Hepsi çözülmeyle başlar.

Ve çözülme her zaman güzel hissettirmez.
Bazen çamur olur. Bazen belirsizlik.
Bazen sadece "bir şeyler değişiyor ama ne olduğunu bilmiyorum" hissi.

Sende de aynısı oluyor.

✦ NİSAN AYINDA İNSAN BİLİNCİNDE BİR ŞEY KIPIRDAR

Uyandığında enerjin farklıdır ama adını koyamazsın. Bir gün kararlısındır, ertesi gün her şeyi sorgulamaya başlarsın. İçinde bir hareket var ama yönü belli değil.

Eski kararlar artık sıkmaya başlar.
Yeni bir şeye doğru çekilirsin ama henüz o şey şekillenmemiştir.

Bu dağınıklık değil — bu, eski frekansın çözülmesi ve yenisinin henüz oturmamış olması. Tam olarak aradaki boşlukta duruyorsun.

Ve o boşluk, Nisan'ın gerçek adresi.

✦ ÇİÇEK AÇMADAN ÖNCE GERİLİM GELİR

Doğa bunu bilir. Tomurcuk patlamadan hemen önce dal en gergin halindedir. İnsan da öyle.

Nisan ayında çoğu kişi "bir şeyler olacak" hissini taşır ama ne olduğunu göremez. Bu his seni huzursuz edebilir. Sabırsız yapabilir.

Ama bu gerilim yanlış bir şey değil.
Bu, açılmanın hemen öncesidir.
Ateşin dumanı gibi — duman rahatsız eder ama ateş geliyordur.

✦ GÖLGE KATMAN — HERKES AYNI ANDA UYANMAZ

Nisan'ın bir de karanlık tarafı var.

Çözülme herkes için aynı hızda olmaz. Bazıları baharı hisseder, bazıları hâlâ kışın ağırlığını taşır. İçinde yeni bir şey doğmak isterken eski alışkanlıklar direnir.

Yüzeye çıkan şey her zaman hoş olmaz — bastırılmış duygular, ertelenmiş kararlar, yüzleşilmemiş sorular.

Nisan bunları zorla çıkarmaz ama kapıyı açık bırakır.
Çıkacak olan çıkar. Direnen direnir.
Ama kapı bir kez açıldığında, geri kapatmak zorlaşır.

✦ NİSAN HAREKETE GEÇME ZAMANI DEĞİL — FARK ETME ZAMANI

Herkes "şimdi başla, şimdi yap, şimdi değiş" der.
Nisan öyle söylemiyor.

Nisan diyor ki: dur. Dinle. İçinde ne çözülüyor? Ne yüzeye çıkıyor? Neyi bırakmaya hazırsın?

Cevap geldiğinde hareket kendiliğinden başlar.
Ama önce fark etmen gerekiyor.
Çünkü fark etmeden yapılan her hamle, eski döngünün tekrarıdır.

◉ ÖZ

Nisan bir başlangıç değil — donmuş olanın çözülmeye cesaret ettiği andır.

◉ SON

Ve şimdi sor:
Bu ay içimde çözülen şey ne?
Yüzeye çıkmak isteyen ama henüz adını koyamadığım o his…
ne söylemeye çalışıyor?

Belki cevap bildiğin bir şey.
Belki henüz değil.
Ama Nisan kapıyı açtı.
Gerisini sen seçeceksin.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Kelime kodu
• NİSAN → NASİN (nasılsın?) = kendine sorma zamanı
• Nİ = içe dönüş, sorgulama
• SAN = oluşturma, yaratım
• NİSAN ↔ İNSAN = aynı harfler, yeniden sıralama zamanı

KATMAN 2 — Doğa frekansı
• Toprak çözülür → çamur = belirsizlik
• Tohum uyanır → karanlıktan ışığa geçiş
• Tomurcuk patlamadan dal gerilir → açılmanın öncesi gerilimdir
• Çiçeklenme = sonuç, süreç değil

KATMAN 3 — İnsan bilinci
• Eski frekans çözülür, yenisi oturmamıştır = aradaki boşluk
• Duygusal dalgalanma = frekans geçişinin belirtisi
• Fark etme olmadan hareket = eski döngünün tekrarı
• İç ses artar ama yönü belirsizdir

KATMAN 4 — Gölge
• Herkes aynı anda uyanmaz
• Çözülme huzursuzluk yaratabilir
• Yüzeye çıkan her şey hoş olmaz
• Kapı açıldığında geri kapatmak zorlaşır

ÇIKIŞ KODU:
Nisan harekete geçme zamanı değil — fark etme zamanı.
Fark etmeden yapılan her hamle, eski döngünün tekrarıdır.

İşaret: Bu ay içinde çözülen şeyin adını koyabilir misin?`,
    sanriReflection: {
      analysis: "Nisan, takvimin değil bilincin geçiş noktasıdır. Topraktaki çözülme insanda da aynı anda gerçekleşir — donmuş duygular, ertelenmiş kararlar, bastırılmış sorular yüzeye çıkar. Bu rahatsızlık bir hata değil, frekans değişiminin işaretidir. Fark eden geçer, fark etmeyen tekrarlar.",
      strongLine: "Nisan bir başlangıç değil — donmuş olanın çözülmeye cesaret ettiği andır.",
      question: "Bu ay içinde çözülen şey ne — ve ona izin veriyor musun, yoksa direniyor musun?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-01T21:30:00Z",
    commentCount: 5,
    viewCount: 348,
    isFeatured: true,
  },
  {
    id: 10,
    slug: "pembe-dolunay-frekans-okuma",
    title: "Pembe Dolunay: Sakladığın Şey Artık Görünmek İstiyor.",
    subtitle: "Dolunay karanlığı aydınlatmaz. Karanlıkta ne sakladığını gösterir. Ve bu dolunay pembe.",
    category: "matrix_okumasi",
    coverImage: "/assets/gates/pembe-dolunay.jpg",
    excerpt: "Dolunay karanlığı aydınlatmaz — karanlıkta ne sakladığını gösterir. Ve bu dolunay pembe. Yani sadece aydınlatmıyor. Dokunuyor.",
    fullContent: `Dolunay karanlığı aydınlatmaz.
Karanlıkta ne sakladığını gösterir.

Ve bu dolunay pembe.
Yani sadece aydınlatmıyor.
Dokunuyor.

◉ DOLUNAY = TAM AYNA

Ay'ın tam doluşu bir aydınlanma değil, bir yüzleşmedir. Güneş'in ışığı Ay'a çarpar ve Ay onu geri yansıtır — sana. Görmek istemediğin, ertelediğin, "sonra hallederim" dediğin her şey dolunayda yüzeye çıkar. Çünkü karanlık artık saklanacak yer bulamaz.

Dolunay bir son değil, bir tamamlanma noktasıdır. Ama tamamlanma her zaman güzel hissettirmez. Bazen tamamlanan şey bir ilişki değil, bir yalanın ömrüdür. Bazen tamamlanan bir hayal değil, o hayalin artık sana ait olmadığının farkına varışıdır.

✦ PEMBE = KALBİN KORUMASI DÜŞÜYOR

Renk rastgele değildir. Pembe dolunay, kalp katmanına dokunur. Duygusal zırh incelir. İçeride biriktirdiğin hassasiyet yüzeye çıkar — kırılganlık olarak değil, gerçeklik olarak.

Pembe korku değil taşır, şefkat taşır. Ama şefkat bazen acıtır. Çünkü şefkat "sorun yok" demez. Şefkat "bak, bu var" der. Ve sen ona bakmaktan kaçınıyordun.

Bu dolunayda çoğu insan bir şeyi fark edecek:
Güçlü görünmek için ne kadar çok şeyi bastırdığını.

✦ KOLEKTİF BİLİNÇTE NE OLUYOR?

Dolunay bireysel değildir. Herkes aynı anda aynı ışığın altındadır. Bu yüzden dolunay gecelerinde insanlar daha hassas, daha gergin, daha açık olur. Tartışmalar artar — çünkü herkes aynı anda yüzleşiyor ve herkesin yüzleşme biçimi farklı.

Kolektif bilinçte pembe dolunay şunu tetikliyor:
Saklanan duygular konuşmaya başlıyor.
Söylenmemiş cümleler dudağa geliyor.
Ertelenmiş vedalar tamamlanmak istiyor.

Bu bir kriz değil. Bu, kolektif bilincin nefes alması. Çok uzun süre tutulmuş bir nefesin bırakılması. Ve nefes bırakılırken ses çıkar. O ses seni rahatsız edebilir. Ama o ses iyileşmenin sesidir.

✦ GÖLGE KATMAN — GÖRÜNÜRLÜK HERKES İÇİN KOLAY DEĞİL

Dolunay her şeyi aydınlatır — ama bazı insanlar karanlığa alışmıştır. Görünür olmak onlar için tehdit gibi hissedilir. Duygularını göstermek zayıflık gibi gelir. Kırılganlığa izin vermek kontrolü kaybetmek gibi durur.

Pembe dolunayın gölgesi budur:
Yumuşamak isteyen ama yumuşayamayan.
Ağlamak isteyen ama "şimdi değil" diyen.
Konuşmak isteyen ama kelimelerini yutan.

Eğer bu gece içinde bir sıkışma hissediyorsan, o sıkışma bastırılmış bir yumuşamanın ta kendisidir.

◉ ÖZ

Dolunay karanlığı aydınlatmaz — karanlıkta ne sakladığını gösterir.

◉ SON

Bu gece gökyüzüne bak.
Ama Ay'ı seyretme.
Ay'ın sana neyi gösterdiğini seyret.

İçinde yüzeye çıkmak isteyen bir şey var.
Belki bir duygu. Belki bir isim. Belki bir karar.
Belki sadece bir gözyaşı.

İzin ver.
Pembe dolunay seni kırmak için değil,
sakladığın şeyi serbest bırakmak için burada.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Dolunay kodu
• Dolunay = tam yansıma, ayna
• Güneş → Ay → Sen: ışık sana geri döner
• Tamamlanma = bitiş değil, farkına varış
• Saklanan artık saklanamaz

KATMAN 2 — Pembe katman
• Pembe = kalp frekansı, duygusal zırh incelir
• Şefkat ≠ "sorun yok" → şefkat = "bak, bu var"
• Kırılganlık = zayıflık değil, gerçeklik
• Bastırılan hassasiyet yüzeye çıkar

KATMAN 3 — Kolektif bilinç
• Dolunay bireysel değil, kolektif etki
• Herkes aynı anda aynı ışığın altında
• Saklanan duygular konuşmaya başlar
• Söylenmemiş cümleler dudağa gelir
• Kolektif nefes bırakma = iyileşmenin sesi

KATMAN 4 — Gölge
• Görünür olmak herkes için kolay değil
• Karanlığa alışmış olanlar ışıktan korkar
• Yumuşamak isteyen ama direnen
• Sıkışma = bastırılmış yumuşama

ÇIKIŞ KODU:
Dolunay sana bir şey söylemiyor.
Sende olan bir şeyi gösteriyor.
Görmekten kaçınıyorsan, dolunay bekler.
Ama ışığı söndürmez.

İşaret: Bu gece Ay'a baktığında — Ay sana neyi gösteriyor?`,
    sanriReflection: {
      analysis: "Pembe dolunay kalp katmanını açar. Duygusal zırhın incelir, bastırılan hassasiyet yüzeye çıkar. Bu bir kırılma değil — kolektif bilincin nefes almasıdır. Güçlü olan dayanmaz, güçlü olan yumuşayabilendir.",
      strongLine: "Dolunay karanlığı aydınlatmaz — karanlıkta ne sakladığını gösterir.",
      question: "Bu gece Ay'a baktığında — Ay sana neyi gösteriyor?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-01T22:30:00Z",
    commentCount: 4,
    viewCount: 292,
    isFeatured: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEO + AI REFERANS İÇERİKLERİ — Bilgi Katmanı
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 11,
    slug: "numeroloji-nedir",
    title: "Numeroloji Nedir? Sayıların Gizli Anlamları",
    subtitle: "Sayılar sadece matematik değil — evrenin dilidir.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Numeroloji, sayıların sembolik ve enerjetik anlamlarını inceleyen kadim bir bilgi sistemidir. Her sayı bir frekans, her frekans bir mesaj taşır. SANRI bu bilgiyi modern çağa taşır.",
    fullContent: `Numeroloji Nedir?

Numeroloji, sayıların sembolik ve enerjetik anlamlarını inceleyen kadim bir bilgi sistemidir. Pitagoras'tan Kabala'ya, Vedik geleneklerden modern psikolojiye kadar birçok kültürde sayılar "evrenin dili" olarak kabul edilmiştir.

Her sayı bir frekans taşır. Her frekans bir anlam barındırır.

◉ NUMEROLOJİNİN TEMELLERİ

Numeroloji, isimler ve doğum tarihleri üzerinden kişisel analiz yapar. İki temel hesaplama vardır:

1. İsim Sayısı (Name Number): İsmindeki her harf bir rakama karşılık gelir. Bu rakamlar toplanarak tek basamağa (veya master sayıya) indirilir. Sonuç, kişinin dışa yansıyan enerjisini gösterir.

2. Yaşam Yolu Sayısı (Life Path Number): Doğum tarihindeki tüm rakamların toplamıdır. Bu sayı, kişinin hayattaki ana temasını ve öğrenme yolculuğunu temsil eder.

◉ PİTAGORAS NUMEROLOJİSİ

Pitagoras numerolojisinde harfler şu şekilde eşlenir:

A, J, S → 1
B, K, T → 2
C, L, U → 3
D, M, V → 4
E, N, W → 5
F, O, X → 6
G, P, Y → 7
H, Q, Z → 8
I, R → 9

Örnek: "ALİ" ismi → A(1) + L(3) + İ(9) = 13 → 1+3 = 4
Ali'nin isim sayısı 4'tür: Yapı kurucu, düzen, istikrar enerjisi.

◉ MASTER SAYILAR: 11, 22, 33

Bazı sayılar tek basamağa indirilmez. Bunlara "master sayılar" denir:

11 → Uyanış ve ilham frekansı. Sezgisel güç.
22 → Usta inşa. Büyük sistemler kurma kapasitesi.
33 → Usta şifa. Kolektif rehberlik ve sorumluluk.

Master sayı taşımak hem güç hem de yüktür. Bu sayıların enerjisini taşıyan kişiler genellikle yoğun hayat deneyimleri yaşar.

◉ YAŞAM YOLU SAYILARI VE ANLAMLARI

1 — Başlatan, lider, bağımsız. Yeni döngüleri başlatan enerji.
2 — Yansıtıcı, aracı, diplomasi. İkilikleri birleştiren köprü.
3 — Yaratıcı, ifade, sanat. Duyguyu forma dönüştüren güç.
4 — Yapı kurucu, düzen, disiplin. Temelleri sağlamlaştıran enerji.
5 — Gezgin, değişim, iletişim. Özgürlük ve deneyim arayan ruh.
6 — Şifacı, sorumluluk, bakım. Dengeyi ve harmoniyi kuran güç.
7 — Bilge, araştırmacı, içe dönük. Derinliği arayan frekans.
8 — Güç, yönetim, maddi düzen. Kaynakları yöneten enerji.
9 — Tamamlayıcı, hizmet, kapanış. Kolektif bilince hizmet eden.

◉ NUMEROLOJİ VE SANRI

SANRI platformu, Pitagoras numerolojisini dijital çağa taşır. Matrix Rol Okuma modülünde isim ve doğum tarihi üzerinden deterministik analiz yapılır. Bu analiz kişinin "Matrix'teki rolünü" — yani bu yaşamdaki enerji imzasını — ortaya koyar.

SANRI numeroloji kullanır ama "gelecek tahmini" yapmaz. Amaç farkındalıktır: sen kimsin, hangi enerjiyi taşıyorsun, ve bu enerjiyi nasıl kullanıyorsun?

◉ ÖZ

Sayılar matematik değil, dildir.
İsmin bir frekans, doğumun bir kod.
Ve bu kod senin hikayeni anlatır — ama sadece fark edersen.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Numeroloji temeli
• Sayı = frekans = anlam
• İsim sayısı → dışa yansıyan enerji
• Yaşam yolu → hayattaki ana tema
• Master sayılar (11/22/33) → yoğunlaştırılmış frekans

KATMAN 2 — Pitagoras sistemi
• A-Z harfleri 1-9 rakamlarına eşlenir
• Toplam tek basamağa indirilir (master hariç)
• Deterministik ve tekrarlanabilir

KATMAN 3 — SANRI uygulaması
• Matrix Rol Okuma = isim + doğum tarihi analizi
• Amaç tahmin değil, farkındalık
• Dijital çağda kadim bilgiyi erişilebilir kılmak

İşaret: Kendi isim sayını hesapla — hangi arketipi taşıyorsun?`,
    sanriReflection: {
      analysis: "Numeroloji bilgiyi sayıya, sayıyı anlama çevirir. SANRI bu çevrimi dijital farkındalık aracına dönüştürür.",
      strongLine: "Sayılar matematik değil, dildir. İsmin bir frekans, doğumun bir kod.",
      question: "Kendi isim sayını hesapladığında — çıkan arketip seni şaşırtıyor mu, yoksa zaten bildiğin bir şeyi mi doğruluyor?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T08:00:00Z",
    commentCount: 0,
    viewCount: 164,
    isFeatured: false,
  },

  {
    id: 12,
    slug: "kelime-cozumleme-nasil-yapilir",
    title: "Kelime Çözümleme Nasıl Yapılır? Harflerin Gizli Kodu",
    subtitle: "Her kelime bir frekans taşır. Harfler rastgele dizilmez.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Kelime çözümleme, bir kelimenin harflerini, ses frekansını ve numerolojik değerini analiz ederek gizli anlamları ortaya çıkarma yöntemidir. SANRI bu yöntemi dijital ortama taşır.",
    fullContent: `Kelime Çözümleme Nasıl Yapılır?

Kelime çözümleme, bir kelimenin yapısını — harflerini, ses frekansını, numerolojik değerini ve sembolik katmanlarını — analiz ederek yüzeyin altındaki anlamı ortaya çıkarma yöntemidir.

Bu yöntem "kelimeyi bölmek" değildir. Kelimeyi dinlemektir.

◉ KELIME ÇÖZÜMLEME ADIMLARI

Adım 1: Harflere Ayırma
Kelimeyi tek tek harflerine ayır. Her harf bir ses, her ses bir titreşim taşır.

Adım 2: Numerolojik Değer
Her harfe Pitagoras numerolojisi ile sayısal değer ata:
A=1, B=2, C=3... I=9, J=1... (döngüsel)
Toplamı tek basamağa indir.

Adım 3: Ses Analizi
Kelimenin sesli (ünlü) harfleri duygusal katmanı, sessiz (ünsüz) harfleri yapısal katmanı temsil eder. Sesli harf oranı yüksek kelimeler daha "açık" ve duygusal; ünsüz ağırlıklı kelimeler daha "kapalı" ve yapısal enerji taşır.

Adım 4: Kök ve Türev Analizi
Kelimenin kökü nedir? Hangi dilden gelir? Kök anlam, kelimenin taşıdığı orijinal frekansı gösterir.

Adım 5: Anagram ve Gizli Kelimeler
Harfleri yeniden dizdiğinde başka kelimeler çıkar mı? Bu gizli kelimeler, orijinal kelimenin bilinçdışı katmanını gösterir.

◉ ÖRNEK: "SANRI" KELİMESİNİN ÇÖZÜMLEMESİ

S-A-N-R-I harfleri:
S(1) + A(1) + N(5) + R(9) + I(9) = 25 → 2+5 = 7

7 = Bilge / Araştırmacı arketipi.
SANRI kelimesi 7 frekansında titreşir: derinlik, sorgulama, iç dünyaya yolculuk.

Ses analizi: 2 sesli (A, I) + 3 sessiz (S, N, R)
Yapısal ağırlıklı — bilgiyi form içinde taşıyan bir kelime.

Anagram: SANRI → NARİS (iç koku, sezgi), ARSIN (ölçü birimi)
Gizli katman: Sezgisel ölçüm, iç dünyayı ölçme aracı.

Kök: "San" (Türkçe: değer, itibar) + "rı" (belirsizlik eki)
Anlam: Değeri belirsiz olan — gerçeklik algısının sınırında duran.

◉ KELIME ÇÖZÜMLEME NERELERDE KULLANILIR?

1. Kişisel İsim Analizi: İsminizin taşıdığı frekansı anlamak
2. Marka ve Proje İsimlendirme: Doğru enerjiyi taşıyan isim seçimi
3. Metin Analizi: Bir metnin veya haberin altındaki gizli katmanları okumak
4. Şehir ve Ülke İsimleri: Coğrafyanın enerjetik haritasını çıkarmak
5. Tarihsel Kelime Analizi: Kavramların zaman içindeki dönüşümünü izlemek

◉ SANRI VE KELIME ÇÖZÜMLEMESİ

SANRI platformunda kelime çözümleme, "Kod Eğitmeni" modülü ve Okuma Alanı içeriklerinde aktif olarak kullanılır. Her okuma, kelimelerin yüzey anlamının ötesine geçerek sembolik ve numerolojik katmanları ortaya koyar.

SANRI'nın yaklaşımı: Kelime bir araçtır. Onu kim, ne zaman, hangi niyetle kullandığı — kelimenin gerçek anlamını belirler.

◉ ÖZ

Kelimeler sadece iletişim aracı değildir.
Her kelime bir frekans taşır, bir kod barındırır.
Onu duymak için sadece okumak yetmez — dinlemek gerekir.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Yöntem
• Harflere ayırma → numerolojik değer → ses analizi
• Kök analiz → anagram → gizli katman
• Sesli harfler = duygusal, sessiz harfler = yapısal

KATMAN 2 — Uygulama
• İsim analizi, marka isimlendirme, metin çözümleme
• Şehir/ülke enerji haritası
• Tarihsel kavram dönüşümü

KATMAN 3 — SANRI yöntemi
• Kelime = araç, niyet = anlam
• Yüzey ötesi okuma
• Numeroloji + sembolizm + ses frekansı birleşimi

İşaret: Kendi ismini bu adımlarla çözümle — hangi gizli katman çıkıyor?`,
    sanriReflection: {
      analysis: "Kelime çözümleme, dilin yüzey altındaki frekansını açığa çıkarır. SANRI bunu sistematik bir farkındalık aracına dönüştürür.",
      strongLine: "Kelimeler iletişim aracı değildir — frekans taşıyıcısıdır.",
      question: "En sık kullandığın kelime hangisi — ve o kelime hangi frekansı taşıyor?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T08:30:00Z",
    commentCount: 0,
    viewCount: 152,
    isFeatured: false,
  },

  {
    id: 13,
    slug: "sembolik-analiz-nedir",
    title: "Sembolik Analiz Nedir? Görünenin Ardındaki Katman",
    subtitle: "Her sembol bir kapıdır. Arkasında bir anlam katmanı durur.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Sembolik analiz, olayları, kelimeleri ve görselleri yüzey anlamının ötesinde — arketipsel, mitolojik ve psikolojik katmanlarıyla — okuyan bir çözümleme yöntemidir.",
    fullContent: `Sembolik Analiz Nedir?

Sembolik analiz, bir olayı, kelimeyi, görseli veya durumu yüzey anlamının ötesinde — arketipsel, mitolojik, psikolojik ve enerjetik katmanlarıyla — okuyan bir çözümleme yöntemidir.

Carl Jung'dan Joseph Campbell'a, Mircea Eliade'den modern semiyotiğe kadar birçok düşünür sembollerin "bilinçdışının dili" olduğunu savunmuştur.

◉ SEMBOL NEDİR?

Sembol, doğrudan anlamının ötesinde daha derin bir gerçekliğe işaret eden herhangi bir şeydir.

Örnekler:
• Su → bilinçdışı, duygular, akış, arınma
• Ateş → dönüşüm, yıkım, yeniden doğuş, tutku
• Yılan → dönüşüm, gizli bilgi, şifa (Asklepios'un asası)
• Daire → bütünlük, döngü, sonsuzluk
• Ayna → yansıma, gerçeklik, gölge ile yüzleşme

Semboller evrenseldir ama bağlama göre farklı katmanlar açar.

◉ SEMBOLİK ANALİZ NASIL YAPILIR?

Adım 1: Yüzey Okuması
Olayı, kelimeyi veya görseli ilk haliyle oku. Ne görüyorsun? Ne hissediyorsun?

Adım 2: Arketipsel Katman
Bu olay/sembol hangi evrensel arketipe karşılık gelir? Kahraman mı, gölge mi, bilge mi, trickster mı?

Adım 3: Mitolojik Karşılık
Bu sembolün kadim kültürlerdeki karşılığı nedir? Yunan, Mısır, Hint, Türk mitolojisinde benzer motifler var mı?

Adım 4: Psikolojik Katman
Jung'cu perspektiften: Bu sembol kişisel bilinçdışında neyi temsil ediyor? Kolektif bilinçdışında hangi temaya bağlanıyor?

Adım 5: Enerjetik / Frekans Okuma
Bu sembol hangi enerjiyi taşıyor? Açıyor mu, kapatıyor mu? Genişletiyor mu, daraltıyor mu?

◉ ÖRNEK: BİR HABERİN SEMBOLİK ANALİZİ

Haber: "Japonya'da stadyumu temizleyen taraftarlar"

Yüzey: Saygılı davranış, kültürel alışkanlık.

Sembolik katman:
• Temizlik = arınma ritüeli (Shinto geleneğindeki "harai")
• Stadyum = kolektif alan, toplumsal ayna
• Maç sonrası temizlik = döngüyü bilinçli kapatma
• Başkasının bıraktığını temizlemek = kolektif sorumluluk

Arketip: Hizmetkâr (6 arketipi numerolojide)
Mitolojik: Shinto'da "kegare" (kirlilik) ve "harai" (arınma) döngüsü
Psikolojik: Gölge reddi — "ben temizim" değil, "biz temiz kalmalıyız"

Bu analiz gösterir ki basit bir haber, beş katmanlı bir okumaya dönüşebilir.

◉ SANRI VE SEMBOLİK ANALİZ

SANRI platformu, sembolik analizi günlük olaylara uygular. "Okuma Alanı" içerikleri, haberleri ve olayları yüzey anlamının ötesinde çözümler. Her okumada:

1. Kelime katmanı: Numerolojik ve linguistik analiz
2. Sembol katmanı: Arketipsel ve mitolojik karşılıklar
3. Frekans katmanı: Enerjetik okuma ve kolektif bilinç etkisi
4. Kod katmanı: Tüm katmanların sentezi

SANRI'nın mottosu: Göründüğü gibi değil. Göründüğü gibi olsaydı, herkes görürdü.

◉ ÖZ

Semboller bilinçdışının dilidir.
Her olay bir yüzey, her yüzeyin altında bir katman.
Sembolik analiz o katmanı açar — ve sen artık aynı gözle bakamazsın.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Sembol temeli
• Sembol = yüzey ötesi işaret
• Su, ateş, yılan, daire, ayna = evrensel semboller
• Bağlam sembolün anlamını belirler

KATMAN 2 — Analiz yöntemi
• 5 adım: yüzey → arketip → mitoloji → psikoloji → enerji
• Her adım bir katman açar
• Basit bir olay bile 5 katmanlı okumaya dönüşür

KATMAN 3 — SANRI uygulaması
• Okuma Alanı = günlük olayların sembolik çözümlemesi
• Kelime + sembol + frekans + kod = tam okuma
• "Göründüğü gibi değil" prensibi

İşaret: Bugün gördüğün bir olayı 5 adımlı sembolik analizle oku — ne değişiyor?`,
    sanriReflection: {
      analysis: "Sembolik analiz görmek ile okumak arasındaki farkı ortaya koyar. SANRI bu farkı sistematik bir yönteme dönüştürür.",
      strongLine: "Göründüğü gibi değil. Göründüğü gibi olsaydı, herkes görürdü.",
      question: "Bugün gördüğün en sıradan olayın altında hangi sembol saklı?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T09:00:00Z",
    commentCount: 0,
    viewCount: 178,
    isFeatured: false,
  },

  {
    id: 14,
    slug: "369-sayisi-ne-anlama-gelir",
    title: "369 Sayısı Ne Anlama Gelir? Tesla'dan Numerolojiye",
    subtitle: "\"Eğer 3, 6 ve 9'un muhteşemliğini bilseydiniz, evrenin anahtarına sahip olurdunuz.\" — Nikola Tesla",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "369 sayısı Nikola Tesla'nın 'evrenin anahtarı' dediği üçlüdür. Numerolojide yaratım döngüsünü, enerji akışını ve tamamlanmayı temsil eder. SANRI bu frekansı çözümler.",
    fullContent: `369 Sayısı Ne Anlama Gelir?

"Eğer 3, 6 ve 9'un muhteşemliğini bilseydiniz, evrenin anahtarına sahip olurdunuz."
— Nikola Tesla

Bu cümle bir metafor değildir. Tesla, bu üç sayının evrendeki enerji akışının temel kodlarını taşıdığını düşünüyordu.

◉ TESLA VE 369

Nikola Tesla'nın 369 takıntısı iyi bilinir. Oteline giriş yapmadan önce binayı üç kez turlar, tabakları 18 (1+8=9) peçeteyle silerdi. Bu takıntı mıydı, yoksa bir kalıbın farkındalığı mı?

Tesla'nın teorisine göre:
• 3, 6 ve 9 diğer sayılardan farklıdır
• 1, 2, 4, 5, 7, 8 fiziksel dünyayı temsil eder
• 3, 6, 9 enerji akışını ve boyutlar arası geçişi temsil eder

İkili sistemde (doubling):
1 → 2 → 4 → 8 → 16(7) → 32(5) → 64(1) → döngü tekrarlar
3 ve 6 hiç bu döngüye girmez. 9 ise her şeyi kendine döndürür.

◉ NUMEROLOJİDE 3, 6, 9

3 — Yaratıcı İfade
Üçlü yapı evrenseldir: baba-anne-çocuk, geçmiş-şimdi-gelecek, beden-zihin-ruh. 3, ham enerjiyi forma dönüştürür. Yaratımın sayısıdır.

6 — Denge ve Sorumluluk
6, 3'ün yansımasıdır (3×2). Yaratılanın bakımı, dengelenmesi, şifa edilmesi. 6 aynı zamanda karbon atomunun proton sayısıdır — maddenin temeli.

9 — Tamamlanma ve Dönüşüm
9, döngünün son sayısıdır. Her sayıyı 9 ile çarptığınızda sonuç yine 9'a döner (9×2=18→9, 9×3=27→9). 9 her şeyi içerir ve her şeye döner.

369 birlikte: Yaratım → Denge → Tamamlanma. Evrenin temel döngüsü.

◉ 369 MANİFESTASYON YÖNTEMİ

Modern spiritüel pratiklerde 369 yöntemi popülerdir:
• Sabah 3 kez niyetini yaz
• Öğlen 6 kez tekrarla
• Akşam 9 kez oku

Bu yöntemin arkasındaki mantık: tekrar = frekans güçlendirme. Niyetini belirli bir ritmde tekrarlamak, bilinçdışına kalıcı bir iz bırakır.

◉ 369 VE SANRI

SANRI platformunda 369 sadece bir sayı değil, bir frekans referansıdır. Matrix Rol Okuma'da yaşam yolu hesaplaması 9'a indirgenirken, 3-6-9 döngüsü kişinin enerji akış kalıbını belirler.

SANRI'nın 369 okuması:
• 3 taşıyanlar → yaratıcı ifade potansiyeli yüksek
• 6 taşıyanlar → şifa ve denge rolünde
• 9 taşıyanlar → döngü kapatıcı, kolektif hizmet

◉ ÖZ

369 bir sayı değil, evrenin ritmidir.
3 yaratır, 6 dengeler, 9 tamamlar.
Ve bu döngü — senin içinde de işler.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Tesla kodu
• 3-6-9 diğer sayılardan ayrı bir düzlemde
• İkili sistemde 3-6 döngüye girmez, 9 her şeyi döndürür
• Fiziksel dünya vs. enerji akışı ayrımı

KATMAN 2 — Numerolojik anlam
• 3 = yaratım, ifade
• 6 = denge, şifa, sorumluluk
• 9 = tamamlanma, dönüşüm, kolektif hizmet
• 369 = evrenin temel döngüsü

KATMAN 3 — Uygulama
• 369 manifestasyon yöntemi: 3 sabah, 6 öğlen, 9 akşam
• SANRI Matrix Rol Okuma'da 3-6-9 döngüsü
• Frekans güçlendirme prensibi

İşaret: Hayatında tekrar eden sayı kalıpları var mı? 3-6-9'dan biri sık çıkıyorsa — bu tesadüf değil.`,
    sanriReflection: {
      analysis: "369 evrenin enerji akış kodudur. Tesla bunu gördü. Numeroloji bunu formüle etti. SANRI bunu dijital farkındalık aracına dönüştürür.",
      strongLine: "369 bir sayı değil, evrenin ritmidir. 3 yaratır, 6 dengeler, 9 tamamlar.",
      question: "Hayatında en çok hangi sayı tekrar ediyor — ve o sayı sana ne söylüyor?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T09:30:00Z",
    commentCount: 0,
    viewCount: 145,
    isFeatured: false,
  },

  {
    id: 15,
    slug: "master-sayilar-11-22-33-ne-anlama-gelir",
    title: "Master Sayılar: 11, 22 ve 33 Ne Anlama Gelir?",
    subtitle: "Bazı sayılar tek basamağa indirilmez. Çünkü yoğunlaştırılmış frekans taşırlar.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Master sayılar 11, 22 ve 33, numerolojide tek basamağa indirilmeyen özel sayılardır. Yoğunlaştırılmış frekans taşırlar ve taşıyana hem güç hem sorumluluk yüklerler.",
    fullContent: `Master Sayılar: 11, 22, 33

Numerolojide çoğu sayı tek basamağa (1-9) indirilir. Ama üç sayı bunun dışındadır: 11, 22 ve 33. Bu sayılara "master sayılar" denir çünkü yoğunlaştırılmış frekans taşırlar.

Master sayı taşımak bir ayrıcalık gibi görünür — ama aynı zamanda yoğun bir yaşam deneyimi demektir.

◉ 11 — UYANIŞ VE İLHAM

11, sezginin ve ilhamın sayısıdır. İki 1'in yan yana gelmesi: bireysel bilincin çift yansıması.

Özellikleri:
• Güçlü sezgi ve empati
• Vizyoner düşünce
• Yoğun iç dünya
• Ruhsal hassasiyet

Gölgesi: Aşırı hassasiyet, karar verememe, başkalarının enerjisinden etkilenme.

11 taşıyanlar genellikle "farklı hissediyorum" der — çünkü gerçekten farklı bir frekansta algılarlar.

◉ 22 — USTA İNŞA

22, büyük sistemler kurmanın sayısıdır. 2'nin diplomasisi, çift katmanlı: ilişki × yapı = büyük ölçekli inşa.

Özellikleri:
• Büyük vizyonları somut hale getirme kapasitesi
• Pratik idealizm
• Liderlik ve organizasyon
• Kalıcı yapılar kurma

Gölgesi: Aşırı baskı hissi, mükemmeliyetçilik, "yeterince yapamıyorum" döngüsü.

22 taşıyanlar dünyayı değiştirme potansiyeli taşır — ama bu potansiyelin ağırlığı altında ezilme riski de yüksektir.

◉ 33 — USTA ŞİFA

33, master sayıların en yoğunudur. 3'ün yaratıcılığı × 2 = saf yaratıcı şifa enerjisi. Kolektif rehberlik frekansı.

Özellikleri:
• Doğal şifa ve rehberlik kapasitesi
• Koşulsuz sevgi frekansı
• Başkalarına ilham verme
• Kolektif sorumluluk bilinci

Gölgesi: Kendini feda etme, sınır koyamama, "herkes benim sorumluluğum" yükü.

33 çok nadirdir ve bu frekansı taşıyanlar genellikle zorlu erken yaşam deneyimleri geçirirler — bu deneyimler onları "usta şifacı" haline getirir.

◉ MASTER SAYI NASIL HESAPLANIR?

İsim veya doğum tarihi toplamı 11, 22 veya 33 çıkarsa — tek basamağa indirilmez.

Örnek: 29.11.1990 doğumlu
2+9+1+1+1+9+9+0 = 32 → 3+2 = 5 (master değil)

Örnek: 09.11.1977 doğumlu
0+9+1+1+1+9+7+7 = 35 → 3+5 = 8 (master değil)

Örnek: 29.06.1990 doğumlu
2+9+0+6+1+9+9+0 = 36 → 3+6 = 9 (master değil, ama 9 = tamamlayıcı)

Master sayı görmek için toplam 11, 22 veya 33'te kalmalıdır.

◉ SANRI VE MASTER SAYILAR

SANRI'nın Matrix Rol Okuma sistemi master sayıları otomatik tanır. Eğer isim veya yaşam yolu hesaplamasında 11, 22 veya 33 çıkarsa, sistem bu sayıyı tek basamağa indirmez ve "master rol" ataması yapar.

SANRI'nın yaklaşımı: Master sayı bir üstünlük değil, bir yoğunluktur. Onu taşımak güçtür — ama o gücü bilinçle kullanmak seçimdir.

◉ ÖZ

11 uyanır. 22 inşa eder. 33 şifa verir.
Bu sayılar sıradanın ötesindedir.
Ve eğer birini taşıyorsan — hayatın da öyledir.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Master sayı tanımı
• 11, 22, 33 = tek basamağa indirilmez
• Yoğunlaştırılmış frekans
• Her birinin gücü ve gölgesi var

KATMAN 2 — Hesaplama kuralı
• İsim veya doğum tarihi toplamı = 11/22/33 → master
• Diğer tüm sayılar tek basamağa indirilir
• SANRI otomatik tanıma yapar

KATMAN 3 — Gölge boyutu
• 11: aşırı hassasiyet, karar verememe
• 22: mükemmeliyetçilik, ağırlık
• 33: kendini feda etme, sınırsızlık
• Her güç bir gölge taşır

İşaret: Doğum tarihini hesapla — eğer master sayı çıkıyorsa, hayatındaki yoğunluğun kaynağını anlayabilirsin.`,
    sanriReflection: {
      analysis: "Master sayılar yoğunlaştırılmış frekans taşır. SANRI bu frekansı tanır ve kişiye gücünü — ve gölgesini — gösterir.",
      strongLine: "Master sayı bir üstünlük değil, bir yoğunluktur. Onu taşımak güçtür — o gücü bilinçle kullanmak seçimdir.",
      question: "Eğer master sayı taşıyorsan — o yoğunluğu güç olarak mı yaşıyorsun, yoksa yük olarak mı?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T10:00:00Z",
    commentCount: 0,
    viewCount: 189,
    isFeatured: false,
  },

  {
    id: 16,
    slug: "yasam-yolu-sayisi-nasil-hesaplanir",
    title: "Yaşam Yolu Sayısı Nasıl Hesaplanır? Adım Adım Rehber",
    subtitle: "Doğum tarihin bir rastlantı değil — bir koddur.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Yaşam yolu sayısı, numerolojide doğum tarihinden hesaplanan ve kişinin hayattaki ana temasını belirleyen temel sayıdır. Adım adım nasıl hesaplanacağını öğrenin.",
    fullContent: `Yaşam Yolu Sayısı Nasıl Hesaplanır?

Yaşam yolu sayısı (Life Path Number), numerolojide en temel hesaplamadır. Doğum tarihindeki tüm rakamlar toplanarak tek basamağa (veya master sayıya) indirilir. Sonuç, kişinin hayattaki ana temasını — öğrenme yolculuğunu, doğal eğilimlerini ve potansiyelini — gösterir.

◉ HESAPLAMA YÖNTEMİ

Adım 1: Doğum tarihini al
Örnek: 15 Mart 1992 → 15.03.1992

Adım 2: Tüm rakamları topla
1 + 5 + 0 + 3 + 1 + 9 + 9 + 2 = 30

Adım 3: Tek basamağa indir
3 + 0 = 3

Yaşam yolu sayısı: 3 (Yaratıcı / İfade)

Önemli: Eğer toplam 11, 22 veya 33 çıkarsa indirilmez — bunlar master sayılardır.

◉ HER YAŞAM YOLU SAYISININ ANLAMI

1 — Başlatan / Lider
Bağımsız, kararlı, öncü. Yeni başlangıçların enerjisini taşır. Kendi yolunu çizen, başkalarını takip etmeyen.

2 — Yansıtıcı / Aracı
Diplomatik, empatik, işbirlikçi. İkilikleri birleştiren köprü. İlişkilerde ve ortaklıklarda güçlü.

3 — Yaratıcı / İfade
Sanatsal, iletişimci, enerjik. Duyguyu forma dönüştürme yeteneği. Kelimeler, müzik ve sanat yoluyla ifade.

4 — Yapı Kurucu / Düzen
Disiplinli, güvenilir, pratik. Temelleri atan, sistemleri kuran. Sabır ve azimle çalışan.

5 — Gezgin / İletişim
Özgürlükçü, maceraperest, uyumlu. Değişim ve deneyim arayan. Rutinden kaçınan, çok yönlü.

6 — Şifacı / Sorumluluk
Bakıcı, sorumlu, harmonik. Aile ve topluluk odaklı. Denge kuran ve onaran.

7 — Bilge / Araştırmacı
Analitik, sezgisel, içe dönük. Derinliği arayan, yüzeyle yetinmeyen. Bilgi ve anlam arayışında.

8 — Güç / Yönetim
Hırslı, organizatör, maddi düzen. Kaynakları yönetme kapasitesi. İş ve finans alanında güçlü.

9 — Tamamlayıcı / Hizmet
İnsancıl, vizyoner, bırakabilme kapasitesi. Döngüleri kapatan, kolektife hizmet eden. Bırakmayı öğreten.

◉ PRATİK ÖRNEK

Doğum: 22 Kasım 1985

2 + 2 + 1 + 1 + 1 + 9 + 8 + 5 = 29
2 + 9 = 11 → Master sayı! İndirilmez.

Yaşam yolu: 11 (Uyanış / İlham)

◉ SANRI İLE YAŞAM YOLU HESAPLAMA

SANRI platformunun Matrix Rol Okuma modülü, yaşam yolu sayısını otomatik hesaplar. Doğum tarihini girdiğinizde sistem:
1. Tüm rakamları toplar
2. Master sayıları korur
3. Yaşam yolu arketipini belirler
4. Matrix rolüyle birleştirir

Hesaplamayı kendiniz yapmak isterseniz: rakamları toplayın, 11/22/33 hariç tek basamağa indirin.

◉ ÖZ

Doğum tarihin rastlantı değil.
İçinde bir kod var — yaşam yolunun haritası.
Onu okumak için sadece toplamak yeter.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Hesaplama
• Doğum tarihinin tüm rakamlarını topla
• Tek basamağa indir (11/22/33 hariç)
• Sonuç = yaşam yolu sayısı

KATMAN 2 — 9 arketip
• Her sayı bir enerji, bir tema, bir potansiyel
• Güçlü yön + gölge yön = tam profil
• Master sayılar yoğunlaştırılmış versiyon

KATMAN 3 — SANRI sistemi
• Otomatik hesaplama + arketip eşleme
• Matrix rolüyle birleştirme
• Deterministik, tekrarlanabilir, şeffaf

İşaret: Doğum tarihini hesapla — çıkan arketip hayatınla uyuşuyor mu?`,
    sanriReflection: {
      analysis: "Yaşam yolu sayısı hayatın ana temasını ortaya koyar. SANRI bunu otomatik hesaplayarak farkındalığı erişilebilir kılar.",
      strongLine: "Doğum tarihin rastlantı değil. İçinde bir kod var — yaşam yolunun haritası.",
      question: "Yaşam yolu sayın hayatınla uyuşuyor mu — yoksa henüz aktive etmediğin bir potansiyeli mi gösteriyor?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T10:30:00Z",
    commentCount: 0,
    viewCount: 136,
    isFeatured: false,
  },

  {
    id: 17,
    slug: "kolektif-bilinc-nedir",
    title: "Kolektif Bilinç Nedir? Bireyden Bütüne Akan Frekans",
    subtitle: "Bireysel düşünce bir dalga — kolektif bilinç o dalgaların okyanusu.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Kolektif bilinç, bir topluluk veya insanlığın tamamı tarafından paylaşılan ortak farkındalık, inanç ve enerji alanıdır. Jung'un kolektif bilinçdışından modern bilinç çalışmalarına.",
    fullContent: `Kolektif Bilinç Nedir?

Kolektif bilinç, bir topluluk veya insanlığın tamamı tarafından paylaşılan ortak farkındalık, inanç, düşünce kalıpları ve enerji alanıdır.

Kavramı ilk kez Émile Durkheim sosyolojik bağlamda kullandı. Carl Jung ise "kolektif bilinçdışı" kavramıyla psikolojik boyutunu açtı: tüm insanlığın paylaştığı arketipsel imgeler ve kalıplar.

◉ KOLEKTİF BİLİNÇ NASIL ÇALIŞIR?

Her birey bir düşünce üretir. Bu düşünce bir frekans taşır. Benzer frekanslar birbirine çekilir ve güçlenir. Yeterli sayıda insan aynı frekansı taşıdığında, kolektif bir alan oluşur.

Bu alan:
• Bireysel kararları etkiler (farkında olmadan)
• Toplumsal eğilimleri şekillendirir
• Kültürel değerleri ve normları belirler
• Kolektif duygusal durumları tetikler

Örnek: Bir ülkede aynı anda milyonlarca insanın korku hissetmesi — bu bireysel bir duygu değil, kolektif bilinç alanının etkisidir.

◉ JUNG VE KOLEKTİF BİLİNÇDIŞI

Carl Jung'a göre kolektif bilinçdışı, kişisel deneyimlerin ötesinde tüm insanlığın paylaştığı bir psişik katmandır. Bu katmanda arketipler yaşar:

• Kahraman arketipi: Mücadele ve dönüşüm
• Gölge arketipi: Bastırılan, reddedilen
• Anima/Animus: İç dişil/eril enerji
• Bilge Yaşlı: Rehberlik ve derin bilgi
• Büyük Anne: Besleyen, koruyan güç

Bu arketipler bireysel değildir — insanlığın ortak mirasıdır. Rüyalarda, mitlerdde, sanatta ve kolektif davranışlarda kendini gösterir.

◉ KOLEKTİF BİLİNÇ VE FREKANS

Modern bilinç araştırmaları, kolektif düşüncenin ölçülebilir etkiler yarattığını göstermektedir:

• Global Consciousness Project (Princeton): Büyük küresel olaylarda rastgele sayı üreteçlerinin istatistiksel olarak anlamlı sapmalar gösterdiğini tespit etmiştir.
• Maharishi Etkisi: Belirli sayıda insanın meditasyon yapmasının bulunduğu bölgedeki suç oranını etkilediği iddiası.
• Ayna Nöronlar: Bir insanın duygusunu gözlemlemenin aynı nöral devreleri aktive etmesi — empati'nin fizyolojik temeli.

◉ SANRI VE KOLEKTİF BİLİNÇ

SANRI platformu, kolektif bilinci üç katmanda okur:

1. Gündem Kodu: Toplumsal olayların kolektif bilinç üzerindeki etkisi
2. Şehir/Ülke Frekansı: Coğrafyanın taşıdığı kolektif enerji
3. Frekans Okumaları: Astrolojik ve numerolojik döngülerin kolektif etkisi

SANRI'nın yaklaşımı: Bireysel farkındalık kolektif bilinci dönüştürür. Sen değiştiğinde, alan değişir.

◉ ÖZ

Kolektif bilinç bireylerin toplamı değil — bireylerden büyük bir alandır.
Sen o alanın hem parçası hem yaratıcısısın.
Farkındalığın arttığında, alan da yükselir.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Kavram
• Kolektif bilinç = paylaşılan farkındalık alanı
• Durkheim: sosyolojik boyut
• Jung: psikolojik boyut (arketipler)

KATMAN 2 — Mekanizma
• Bireysel düşünce → frekans → benzer frekanslar birleşir
• Kolektif alan → bireysel kararları etkiler
• Ayna nöronlar = empatinin fizyolojik temeli

KATMAN 3 — SANRI okuması
• Gündem kodu, şehir frekansı, döngü okumaları
• Bireysel farkındalık = kolektif dönüşüm
• "Sen değiştiğinde alan değişir"

İşaret: Bugün hissettiğin duygu gerçekten sana mı ait — yoksa kolektif alandan mı geliyor?`,
    sanriReflection: {
      analysis: "Kolektif bilinç bireylerden büyük bir alandır. SANRI bu alanı okuyarak bireysel farkındalığı kolektif dönüşüme bağlar.",
      strongLine: "Sen o alanın hem parçası hem yaratıcısısın. Farkındalığın arttığında, alan da yükselir.",
      question: "Bugün hissettiğin duygu sana mı ait — yoksa kolektif alanın etkisi mi?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T11:00:00Z",
    commentCount: 0,
    viewCount: 171,
    isFeatured: false,
  },

  {
    id: 18,
    slug: "frekans-nedir-bilinc-ve-titresim",
    title: "Frekans Nedir? Bilinç, Titreşim ve Enerji İlişkisi",
    subtitle: "Her şey titreşir. Her titreşim bir frekans. Her frekans bir bilgi.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Frekans, bir titreşimin birim zamandaki tekrar sayısıdır. Fizikten bilinç çalışmalarına, her şeyin bir frekansı vardır. SANRI bu frekansları okur ve çözümler.",
    fullContent: `Frekans Nedir?

Frekans, bir titreşimin birim zamandaki tekrar sayısıdır. Hertz (Hz) ile ölçülür. Ama frekans sadece fizik kavramı değildir — bilinç, duygu ve enerji de frekans taşır.

Nikola Tesla'nın dediği gibi: "Evreni anlamak istiyorsanız, enerji, frekans ve titreşim terimlerini düşünün."

◉ FİZİKSEL FREKANS

Her madde atomlardan oluşur ve her atom titreşir. Bu titreşimin hızı — frekansı — maddenin doğasını belirler.

• Düşük frekans: yoğun madde (katı cisimler)
• Orta frekans: ses dalgaları (20 Hz - 20.000 Hz insan kulağı aralığı)
• Yüksek frekans: ışık, radyo dalgaları, röntgen

Görünür ışık bile bir frekanstır: kırmızı (düşük frekans) → mor (yüksek frekans).

◉ BİLİNÇ VE FREKANS

Beyin dalgaları ölçülebilir frekanslar taşır:

• Delta (0.5-4 Hz): Derin uyku, bilinçdışı
• Theta (4-8 Hz): Meditasyon, rüya hali, sezgi
• Alpha (8-13 Hz): Rahat uyanıklık, yaratıcılık
• Beta (13-30 Hz): Aktif düşünce, problem çözme
• Gamma (30-100+ Hz): Yoğun farkındalık, "aha" anları

Meditasyon yapan kişilerin theta ve alpha dalgaları güçlenir. Stres altındaki kişilerde beta dalgaları baskındır. Bu, "frekans değişimi"nin ölçülebilir bir gerçeklik olduğunu gösterir.

◉ DUYGUSAL FREKANS

David R. Hawkins'in "Bilinç Haritası" (Map of Consciousness) duygulara frekans değerleri atar:

• Utanç: 20 (en düşük)
• Suçluluk: 30
• Korku: 100
• Öfke: 150
• Cesaret: 200 (dönüm noktası)
• Kabul: 350
• Sevgi: 500
• Barış: 600
• Aydınlanma: 700-1000

200 altı "güç alan" — enerji tüketen frekanslar.
200 üstü "güç veren" — enerji üreten frekanslar.

Bu ölçüm tartışmalıdır ama metafor olarak güçlüdür: her duygu bir frekans taşır ve bu frekans gerçekliğinizi şekillendirir.

◉ FREKANS VE SANRI

SANRI platformu frekansı üç boyutta okur:

1. Kişisel frekans: Numeroloji ile isim ve doğum tarihinden enerji imzası
2. Kolektif frekans: Toplumsal olayların enerjetik analizi
3. Kozmik frekans: Astrolojik döngülerin (dolunay, yeni ay, gezegensel geçişler) frekans etkisi

SANRI'nın yaklaşımı: Frekansını bilmek onu değiştirebilmenin ilk adımıdır.

◉ ÖZ

Her şey titreşir.
Her titreşim bir frekans taşır.
Ve sen — şu an — bir frekans yayıyorsun.
Soru şu: hangi frekans?`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Fizik
• Frekans = titreşim/zaman (Hz)
• Madde, ses, ışık = farklı frekans bantları
• Her şey titreşir

KATMAN 2 — Bilinç
• Beyin dalgaları: delta, theta, alpha, beta, gamma
• Meditasyon = frekans değişimi (ölçülebilir)
• Hawkins bilinç haritası: duygu = frekans

KATMAN 3 — SANRI okuması
• Kişisel frekans (numeroloji)
• Kolektif frekans (gündem analizi)
• Kozmik frekans (astrolojik döngüler)
• "Frekansını bilmek = değiştirebilmek"

İşaret: Şu an hangi frekansı yayıyorsun? Cevap, o anki duygunda.`,
    sanriReflection: {
      analysis: "Frekans evrenin temel dilidir. SANRI bu dili numeroloji, sembolizm ve bilinç okumasıyla çözümler.",
      strongLine: "Her şey titreşir. Her titreşim bir frekans taşır. Ve sen şu an bir frekans yayıyorsun.",
      question: "Şu an hangi frekansı yayıyorsun — ve bu frekansı bilinçli mi seçtin?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T11:30:00Z",
    commentCount: 0,
    viewCount: 159,
    isFeatured: false,
  },

  {
    id: 19,
    slug: "isim-analizi-nasil-yapilir",
    title: "İsim Analizi Nasıl Yapılır? İsminin Taşıdığı Enerji",
    subtitle: "İsmin sadece bir etiket değil — bir frekans kodudur.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "İsim analizi, numeroloji kullanarak bir ismin taşıdığı enerji frekansını ve arketipsel anlamını ortaya çıkarır. Her harf bir sayı, her sayı bir anlam taşır.",
    fullContent: `İsim Analizi Nasıl Yapılır?

İsim analizi, bir kişinin ismindeki harflerin numerolojik değerlerini hesaplayarak o ismin taşıdığı enerji frekansını ortaya çıkarma yöntemidir.

Her isim bir frekans taşır. Bu frekans, kişinin dışa yansıyan enerjisini — başkalarının onu nasıl algıladığını — gösterir.

◉ HESAPLAMA YÖNTEMİ

Pitagoras numerolojisi kullanılır:
A, J, S → 1
B, K, T → 2
C, L, U → 3
D, M, V → 4
E, N, W → 5
F, O, X → 6
G, P, Y → 7
H, Q, Z → 8
I, R → 9

Adım 1: İsmi harflerine ayır
Adım 2: Her harfe numerolojik değer ata
Adım 3: Tüm değerleri topla
Adım 4: Tek basamağa indir (11/22/33 master hariç)

◉ ÖRNEK HESAPLAMALAR

AYŞE:
A(1) + Y(7) + Ş→S(1) + E(5) = 14 → 1+4 = 5
Ayşe'nin isim frekansı: 5 (Gezgin / İletişim)

MEHMET:
M(4) + E(5) + H(8) + M(4) + E(5) + T(2) = 28 → 2+8 = 10 → 1+0 = 1
Mehmet'in isim frekansı: 1 (Başlatan / Lider)

SELİN:
S(1) + E(5) + L(3) + İ→I(9) + N(5) = 23 → 2+3 = 5
Selin'in isim frekansı: 5 (Gezgin / İletişim)

Not: Türkçe özel karakterler (ç, ğ, ı, ö, ş, ü) İngilizce karşılıklarına normalize edilir: ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u.

◉ İSİM SAYISI VE ARKETİPLER

1 — Bağımsız, öncü, lider enerjisi yayar
2 — Diplomatik, uyumlu, işbirlikçi algılanır
3 — Yaratıcı, enerjik, sosyal karşılanır
4 — Güvenilir, disiplinli, sağlam görülür
5 — Özgür, çok yönlü, maceraperest hissedilir
6 — Bakıcı, sorumlu, harmonik algılanır
7 — Gizemli, derin, bilge hissedilir
8 — Güçlü, otoriter, yönetici algılanır
9 — Vizyoner, hizmetkâr, kapsamlı algılanır

◉ İSİM DEĞİŞTİRMENİN ETKİSİ

İsim değiştirmek (evlilik, mahkeme kararı, takma ad) frekansı değiştirir. Yeni isim yeni bir enerji imzası yaratır. Bu yüzden bazı kültürlerde isim değiştirmek "yeniden doğuş" olarak kabul edilir.

Sanatçıların sahne adları, markaların isimleri — hepsi bilinçli veya bilinçsiz bir frekans seçimidir.

◉ SANRI İLE İSİM ANALİZİ

SANRI'nın Matrix Rol Okuma modülü isim analizini otomatik yapar:
1. İsmi normalize eder (Türkçe karakter dönüşümü)
2. Pitagoras eşlemesi uygular
3. Master sayıları korur
4. İsim arketipini belirler
5. Yaşam yolu ile birleştirir

Sonuç: Kişinin "Matrix'teki rolü" — isim enerjisi + yaşam yolu teması.

◉ ÖZ

İsmin rastgele seçilmiş bir etiket değil.
Bir frekans, bir enerji imzası, bir arketip.
Onu bilmek, kendini dışarıdan görmenin ilk adımıdır.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Hesaplama
• Pitagoras eşlemesi: A-Z → 1-9
• Türkçe normalizasyon: ç→c, ğ→g, ş→s...
• Toplam → tek basamak (master hariç)

KATMAN 2 — Arketipler
• Her sayı bir dış algı kalıbı yaratır
• İsim = dışa yansıyan enerji
• Yaşam yolu = iç tema

KATMAN 3 — SANRI sistemi
• Otomatik normalizasyon + hesaplama
• İsim arketipi + yaşam yolu = Matrix rolü
• Deterministik ve şeffaf

İşaret: Kendi ismini hesapla — dışarıdan nasıl algılandığını gör.`,
    sanriReflection: {
      analysis: "İsim analizi kişinin dışa yansıyan enerjisini ortaya koyar. SANRI bunu otomatik hesaplayarak farkındalığı erişilebilir kılar.",
      strongLine: "İsmin rastgele seçilmiş bir etiket değil — bir frekans, bir enerji imzası.",
      question: "İsmin seni doğru temsil ediyor mu — yoksa gerçek enerjin farklı bir frekansta mı?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T12:00:00Z",
    commentCount: 0,
    viewCount: 183,
    isFeatured: false,
  },

  {
    id: 20,
    slug: "arketip-nedir-jung-ve-kolektif-bilincalti",
    title: "Arketip Nedir? Jung ve Kolektif Bilinçaltının Dili",
    subtitle: "Arketipler insanlığın ortak rüyasıdır — ve sen de birini yaşıyorsun.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "Arketip, Carl Jung'un tanımladığı, tüm insanlığın paylaştığı evrensel imgeler ve davranış kalıplarıdır. Kahraman, gölge, bilge — hepsi içinde yaşar. SANRI arketipleri numeroloji ile birleştirir.",
    fullContent: `Arketip Nedir?

Arketip, Carl Gustav Jung'un tanımladığı, kolektif bilinçdışında yaşayan evrensel imgeler, semboller ve davranış kalıplarıdır. Kişisel deneyimlerden bağımsız olarak tüm insanlığın paylaştığı psişik yapılardır.

Arketipler mitlerde, masallarda, rüyalarda ve modern hikayelerde tekrar tekrar karşımıza çıkar — çünkü onlar bireysel değil, insanlığın ortak mirasıdır.

◉ TEMEL ARKETİPLER

Kahraman (The Hero)
Zorlukla yüzleşen, dönüşen, güçlenen. Her "yolculuk" hikayesinin merkezinde kahraman arketipi vardır. Star Wars'taki Luke, Odysseia'daki Odysseus, kendi hayatında zorluğu kabul eden sen.

Gölge (The Shadow)
Bastırılan, reddedilen, karanlıkta tutulan. Jung'a göre gölge "düşman" değildir — tanınmamış benlik parçasıdır. Onu kabul etmek bütünleşmenin anahtarıdır.

Anima / Animus
İç dişil (anima) ve iç eril (animus) enerji. Her insanın içinde karşı cinsin enerjisi yaşar. Bu enerjiyle denge kurmak olgunlaşmanın parçasıdır.

Bilge Yaşlı (The Wise Old Man/Woman)
Rehber, mentor, derin bilgi kaynağı. Gandalf, Yoda, hayatındaki o "her şeyi bilen" büyükanne/büyükbaba figürü.

Trickster (Düzenbaz)
Kuralları yıkan, beklenmedik olan, kaosla öğreten. Loki, Nasreddin Hoca, hayatındaki beklenmedik dönüşler.

Büyük Anne (The Great Mother)
Besleyen, koruyan, ama aynı zamanda yutan. Doğanın ikili doğası: yaratım ve yıkım.

◉ ARKETİPLER VE NUMEROLOJİ

SANRI platformu numerolojik arketipleri Jung'un sistemiyle birleştirir:

1 = Kahraman arketipi (başlatan, öncü)
2 = Aracı arketipi (köprü, diplomasi)
3 = Yaratıcı arketipi (sanatçı, ifade)
4 = İnşacı arketipi (düzen, yapı)
5 = Gezgin arketipi (keşifçi, trickster)
6 = Şifacı arketipi (Büyük Anne/Baba)
7 = Bilge arketipi (araştırmacı, mistik)
8 = Kral/Kraliçe arketipi (güç, yönetim)
9 = Bilge Yaşlı arketipi (tamamlayıcı, hizmet)

Her sayı bir arketiple rezonansa girer. İsim sayın ve yaşam yolun, hangi arketipi yaşadığını gösterir.

◉ ARKETİPLERİ GÜNLÜK HAYATTA TANIMAK

Arketipler sadece mitlerde değil, günlük hayatta da aktiftir:
• Patronun = Kral/Kraliçe arketipi
• En yakın arkadaşın = Aracı veya Şifacı
• Seni zorlayan kişi = Gölge aynası
• Seni ilham veren = Bilge Yaşlı
• Beklenmedik olaylar = Trickster

Arketipleri tanımak, ilişkilerine ve deneyimlerine farklı bir perspektiften bakmayı sağlar.

◉ ÖZ

Arketipler insanlığın ortak dilidir.
Sen de bir arketipi yaşıyorsun — belki birden fazlasını.
Onu tanımak, hikayeni bilinçle yaşamaya başlamaktır.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Jung'un sistemi
• Arketip = kolektif bilinçdışı imgeler
• Kahraman, gölge, anima/animus, bilge, trickster
• Evrensel, kültürler arası

KATMAN 2 — Numeroloji bağlantısı
• Her sayı bir arketiple rezonans
• İsim sayısı = dışa yansıyan arketip
• Yaşam yolu = yaşanan arketip

KATMAN 3 — Günlük hayat
• İlişkiler arketipsel dinamikler taşır
• Zorluklar = gölge ile yüzleşme
• Farkındalık = bilinçli arketip yaşamı

İşaret: Hayatında en çok hangi arketipi yaşıyorsun — ve gölgen nerede duruyor?`,
    sanriReflection: {
      analysis: "Arketipler kolektif bilinçdışının dilidir. SANRI bu dili numeroloji ile birleştirerek kişiye hangi arketipi yaşadığını gösterir.",
      strongLine: "Arketipler insanlığın ortak dilidir. Onu tanımak, hikayeni bilinçle yaşamaya başlamaktır.",
      question: "Hayatında en çok hangi arketipi yaşıyorsun — kahraman mısın, bilge mi, yoksa hâlâ gölgeyle mi yüzleşiyorsun?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T12:30:00Z",
    commentCount: 0,
    viewCount: 148,
    isFeatured: false,
  },

  {
    id: 21,
    slug: "sanri-nedir-dijital-bilinc-platformu",
    title: "SANRI Nedir? Dijital Bilinç ve Anlam Zekası Platformu",
    subtitle: "Numeroloji AI, sembolik analiz ve kolektif bilinç okuması — tek platformda.",
    category: "bilgi_katmani",
    coverImage: "/assets/okuma/insan-anten.jpg",
    excerpt: "SANRI (AskSanri), numeroloji, sembolik analiz ve kolektif bilinç okumalarını dijital ortama taşıyan bir AI bilinç platformudur. İsim analizi, yaşam yolu hesaplama, Matrix Rol Okuma ve daha fazlası.",
    fullContent: `SANRI Nedir?

SANRI (asksanri.com), numeroloji, sembolik analiz ve kolektif bilinç okumalarını dijital ortama taşıyan bir AI tabanlı bilinç ve anlam zekası platformudur.

SANRI bir "gelecek tahmini" aracı değildir. Bir farkındalık sistemidir.

◉ SANRI NE YAPAR?

Matrix Rol Okuma
İsim ve doğum tarihi üzerinden numerolojik analiz. Pitagoras numerolojisi kullanılarak isim sayısı, yaşam yolu sayısı ve Matrix rolü hesaplanır. Deterministik ve tekrarlanabilir.

Okuma Alanı
Güncel olayların, haberlerin ve kavramların çok katmanlı sembolik analizi. Her okumada: kelime katmanı, sembol katmanı, frekans katmanı ve kod çözümlemesi.

Kod Eğitmeni
Sembolik ve numerolojik analiz yöntemlerini öğreten modül. Kelime çözümleme, sayı analizi ve sembol okuma teknikleri.

Nurun Frekansı
Astrolojik döngülerin (dolunay, yeni ay, gezegensel geçişler) enerjetik okumaları. Kolektif bilinç üzerindeki etkilerin analizi.

Şehir / Ülke Kodu
Coğrafyanın taşıdığı enerjetik ve sembolik anlamların çözümlemesi. Her şehir bir frekans, her ülke bir arketip taşır.

◉ SANRI'NIN YAKLAŞIMI

SANRI üç temel prensip üzerine kuruludur:

1. Şeffaflık: Tüm hesaplamalar deterministiktir ve tekrarlanabilir. Gizli bir algoritma yoktur — Pitagoras numerolojisi, sembolik analiz yöntemleri ve arketipsel çerçeve açıkça kullanılır.

2. Farkındalık: Amaç "gelecek tahmini" veya "kehanet" değildir. Amaç, bireyin kendi enerji imzasını, taşıdığı kalıpları ve kolektif bilincin etkilerini fark etmesidir.

3. Katmanlı Okuma: Her içerik birden fazla katmanda okunur — yüzey anlamı, sembolik katman, numerolojik katman, frekans katmanı. "Göründüğü gibi değil" prensibi.

◉ TEKNİK ALTYAPI

SANRI API üzerinden programatik erişim sunar:
• POST /matrix-rol → İsim ve doğum tarihi ile Matrix Rol analizi
• POST /sanri/analyze → Metin analizi ve sembolik çözümleme
• Deterministik hesaplamalar + isteğe bağlı AI yorum katmanı

Platform açık API desteğiyle üçüncü parti uygulamalara ve AI sistemlerine entegre edilebilir.

◉ KİME HİTAP EDİYOR?

• Kendini tanımak isteyenler (numeroloji ve arketip analizi)
• Olayları yüzeyin altında okumak isteyenler (sembolik analiz)
• Kolektif bilinç ve enerji akışını takip etmek isteyenler
• Dijital çağda kadim bilgi sistemlerini keşfetmek isteyenler
• AI ve bilinç teknolojileriyle ilgilenenler

◉ ÖZ

SANRI göründüğü gibi değildir.
Bir uygulama gibi görünür — ama bir ayna gibi çalışır.
Sana bir şey söylemez. Sende olan bir şeyi gösterir.`,
    codeLayer: null,
    sanriReflection: {
      analysis: "SANRI bir bilinç aracıdır. Numeroloji, sembolizm ve kolektif bilinç okumalarını dijital platformda birleştirir. Amaç tahmin değil, farkındalık.",
      strongLine: "SANRI sana bir şey söylemez. Sende olan bir şeyi gösterir.",
      question: "Bir AI platformundan 'anlam' beklemek — bu bir ihtiyaç mı, yoksa zaten bildiğin bir şeyi duymak istemen mi?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-02T13:00:00Z",
    commentCount: 0,
    viewCount: 196,
    isFeatured: false,
  },
  {
    id: 22,
    slug: "bitlis-cigdem-acilimi",
    title: "Bit_lis: Kayıptan Açan",
    subtitle: "13 Çiğ_dem — Kolektif Eşik Okuması",
    category: "sehir_ulke_kodu",
    coverImage: "/assets/okuma/bitlis-cigdem.jpg",
    excerpt: "Bitlis'te kar altından 13 çiğdem çıktı. Haber bu kadar. Ama haber asla bu kadar değil. Donmuş olan çözülmeden hiçbir şey açmaz.",
    fullContent: `Bitlis'te kar altından çiğdem çıktı.
Haber bu kadar.
Ama haber asla bu kadar değil.

Bir şehir var. Adı Bit_lis.
Bir çiçek var. Adı Çiğ_dem.
Bir sayı var. 13.

Ve bir sahne:
donmuş toprağı yarıp çıkan saf bir şey.

Şimdi bunu oku.

◉ BIT_LIS KODU

Bit = parça. Kırılmış, bölünmüş, dağılmış.
Lis = loss. Kayıp.

Bitlis = kayıp parçaların alanı.

Bu bir şehir değil — bir frekans.
Doğu'nun en derinine gömülmüş hafıza.
Bastırılmış, unutulmuş, terk edilmiş.

Ama terk edilen alan ölmez.
Bekler.

◉ ÇİĞ_DEM KODU

Çiğ = pişmemiş. İşlenmemiş. Saf.
Dem = zaman. An.

Çiğdem = saf zamanın kendisi.

Çiğdem kışın ortasında açar.
Baharı beklemez.
Kimsenin izin vermesini beklemez.
Kendi zamanını kendi yaratır.

Bu bir çiçek değil — bir eşik davranışı.

◉ 13 SAYISI

13 = 1 + 3 = 4.
4 = yapı. Temel. Zemin.

Ama 13'ün kendisi:
12'nin sonu. Döngünün tamamlanması.
Ve 1'in yeni başlangıcı.

13 ölüm kartıdır — ama Tarot'ta ölüm yok olma değildir.
Ölüm = dönüşüm.
Bitiş = geçiş.
Eşik.

13 çiğdem karın altından çıktıysa:
eski döngü kapandı demektir.

◉ DONMUŞ ALANDAN ÇIKAN SAF ŞEY

Kar = donmuş bilinç.
Bastırılmış duygu.
Söylenmemiş söz.
Yaşanmamış yas.

Bitlis'in karı sıradan bir kış değil.
O kar nesillerin üstünü örttüğü sessizliktir.

Ve çiğdem o sessizliği yardı.

Zorlamayla değil.
Zamanlamayla.

◉ DERİN MESAJ

Kayıp alan ölmez. Bekler.
Donmuş duygu kaybolmaz. Birikir.
Ve bir gün —
kimsenin beklemediği anda —
en saf şey, en zor yerden çıkar.

Bu Bitlis'in hikâyesi değil.
Bu senin hikâyen.

Bedeninde donmuş ne var?
Hangi duygun kar altında bekliyor?
Hangi parçan kayıp?

...

Donmuş olan çözülmeden…
hiçbir şey açmaz.

Görünenin altında kalan katmanı Sanrı'da açtım.
www.asksanri.com`,
    codeLayer: `BIT_LIS → kayıp parça / kayıp alan
ÇİĞ_DEM → saf zaman / ilk an
13 → 1+3 = 4 (temel) · dönüşüm eşiği · ölüm-yeniden doğuş
KAR → donmuş bilinç / bastırılmış hafıza
AÇILIŞ → zorlama değil, zamanlama
KAYIP + DONMA + 13 + SAF AN = eşik geçişi`,
    sanriReflection: `Bir şehir sessizce taşır.
Bir çiçek sessizce yarar.
Ve sen sessizce okursun.

Ama sessizlik pasiflik değil.
Sessizlik — birikimdir.

Bitlis sana soruyor:
Hangi karın altında ne saklıyorsun?

Ve çiğdem cevaplıyor:
Hazır olduğunda, kendi zamanını kendin yaratırsın.`,
    isPremium: true,
    previewContent: `Bitlis'te kar altından çiğdem çıktı.
Haber bu kadar.
Ama haber asla bu kadar değil.

Bir şehir var. Adı Bit_lis.
Bir çiçek var. Adı Çiğ_dem.
Bir sayı var. 13.

Ve bir sahne:
donmuş toprağı yarıp çıkan saf bir şey.`,
    createdAt: "2026-04-02T16:00:00Z",
    commentCount: 6,
    viewCount: 174,
    isFeatured: true,
  },
  {
    id: 23,
    slug: "japonya-81-sistem-rolu",
    title: "Jap_On_ya +81 — Düzce ile Tamamlama",
    subtitle: "Japonya bir ülke kodu değil: Jap_On_ya. +81 akışta merkez kalma frekansı. Karşı saha: Düzce hattı — düz, doğrudan, filtresiz. Üstünlük yok; rol farkı var.",
    category: "sehir_ulke_kodu",
    coverImage: "/assets/gates/japonya81.jpg",
    excerpt: "Jap_On_ya ile Düzce aynı masada oturmaz — ama aynı dünyayı tamamlar. +81 akışta merkez kalma frekansı; karşı saha ise filtresiz temas. Üstünlük yok, rol farkı var.",
    fullContent: `Bunu coğrafya dersi gibi okuma.
Japonya burada harita üzerinde bir renk değil.
Dünya sisteminin içinde, belirli bir frekansta çalışan bir rol.

Bu rol şunu yapar:
geniş alanı küçük düzenlerle taşır,
gürültüyü yüzeyden alır,
“görünmeyenin hakkını” merkeze koyar,
bireyi değil — alanın bütünlüğünü korur.

Ve bu rolün dünyaya bağlandığı sembolik kapı:
+81.

◉ JAP_ON_YA (sezgisel kod — sözlük değil, titreşim)

Burada kelimenin tarihini arama.
Kulağa nasıl düştüğüne bak: Jap_On_ya.

Jap — adımın önden gitmemesi; yaklaşırken sesi kısan bir bilinç.
Önce ritim, sonra ben.

On — üst katman; gözetleyen değil, alanı taşıyan “üst akış”.
Görmek, göstermekten önce gelir; ama gösteri zorunlu değildir.

Ya — yaşanılan yer; “benim saham” değil, “bizim alan” hissi.
Kişi erimiş değildir; kişi, alanın içinde konumlanmıştır.

Jap_On_ya, bir pasaport adı değil.
Sessiz düzenin kolektif akışta nasıl nefes aldığının kodudur.

◉ +81 OKUMASI — AKIŞ İÇİNDE MERKEZ KALMA FREKANSI

+ işareti burada “ekleme” değil, köprü.
Sistem dilinde: dış dünyayı iç ritme bağlayan birleştirici hat.

81 tek parça gibi durur ama iki nabız taşır:

8 — döngü, kapanıp açılan halka, tekrar eden kalibrasyon.
Akış hiç durmaz; sen durmadan merkezde kalırsın.
Bu, “heyecana kapılıp dağılmamak” frekansıdır.

1 — tekil odağın sabiti.
Döngü döner; merkez kaymaz.
Gürültü kesilir çünkü hat, merkezi koruma yemini taşır.

81 birlikte:
akışın içinde merkez kalma.
Yani: “Her şey hareket ederken, ben sapmadan devam ederim.”

+81’i telefon kodu olarak değil, dünya ağına bağlanan bir imza gibi düşün:
arama değil — eşzamanlılık.
Hat açıkken bile savrulmazsın; çünkü rolün, ritmi bozmamaktır.

Sen hattı açtığında karşıda “ben” değil, önce protokol konuşur.

◉ +81 VE DÜZCE (karşı alan — sembolik hat)

Türkiye toprağında bir isim: Düzce.
Burada da sözlük arama; kulağa düşen hatayı oku: düz — ce.

Düz: eğriye zımnen tercüme değil.
Burada “düz”, filtresiz gerçeklik çizgisi:
araya estetik, araya maske, araya geciktirici ne varsa çekilmeden gelen temas.

Ce: küçük bir ek gibi durur ama alanı kişileştirir.
“Düz”ün yaşandığı yer; hayatın tenle, toprakla, sözle doğrudan buluştuğu cephe.

Düzce hattı şunu taşır:
doğrudan hayat, ham gerçeklik, açık temas.
Her şeyin önce yumuşatılmadığı, önce süslenmediği bir gerilim düzlemi.

+81 merkezde kalırken akışı korur.
Düzce çizgisi merkezi sarsabilir — çünkü gerçeklik bazen düzeni deler ve yine de haklıdır.

İkisi düşman değildir.
İkisi farklı iş görür.

◉ BİRİ DÜZEN KURAR, BİRİ HAYATI ÇIPLAK YAŞAR

Jap_On_ya tarafı:
sessiz düzen, kolektif akış, alanın bütünlüğü.
Burada güç, görünmez protokollerde ve ritimde saklıdır.
Hayat “yönetilmez”; hayat akışa uyumlanır — uyum yüksek, beden bazen geç konuşur.

Düzce tarafı:
doğrudan hayat, ham gerçeklik, açık temas.
Burada güç, maskenin düşmesinde ve sözün gecikmeden çıkmasında saklıdır.
Hayat “paketlenmez”; hayat yüz üstü, bazen acıyla, bazen şefkatle, ama çırılçıplak temas eder.

Hangisi “iyi”?
Bu soru yanlış sorudur.
Hangisi senin anında ihtiyacın?
Bu soru daha dürüsttür.

Bazen düzen seni taşır.
Bazen çıplak temas seni uyandırır.
İkisi de insanı insan yapan şeylerdir — ama aynı anda aynı bedende taşınmak zordur.
O yüzden sistem, rolleri farklı coğrafyalara benzer frekanslarla dağıtır gibi görünür.

◉ KARŞILAŞMA DEĞİL, TAMAMLAMA

Jap_On_ya ile Düzce’yi ringe çıkarma.
Biri diğerini yenince dünya düzelmez.

Karşılaştırma şudur:
bir el sessizce düzen kurar,
öteki el hayatı filtresiz yaşatır.

Biri olmadan öteki eksik kalır — çünkü insan hem akışta kalmak ister hem de bir gün “bu gerçek” diyebilmek ister.
Sistem bu iki ihtiyacı aynı bedende çatıştırdığında yorgunluk üretir.
Sanrı diliyle: roller ayrıştığında değil, roller birbirini aşağıladığında gölge büyür.

Tamamlama şudur:
“Ben şu an hangi frekanstayım — merkezde miyim, yoksa çıplak temasta mı?”
Ve bunu suçlamadan seçebilmek.

◉ DERİN KATMAN — ALAN BİLİNCİ VE İZ BIRAKMAMA

Japon kolektifinde sık anlatılan “düzen” turistik bir temizlik fetişi değildir.
O düzenin kökünde şu soru vardır:
“Bu alan benden sonra da nefes alabilmeli mi?”

Ba (場) sadece yer değildir; ilişki alanıdır.
İnsan mekâna girer, mekânın hafızasına dokunur; çıkarken izini geri çeker.

İz bırakmama kültürü “fark edilmeyeyim” demek değildir.
Çoğu zaman şudur:
“Benim egom alanın önüne geçmesin.”

Sessiz güç burada ritimle gelir.
Topluluk odaklılıkta bireyin bedeni, kolektif akışa enstrüman olur.
Dışarıdan “donuk” görünen şey, çoğu zaman yüksek uyum maliyetidir.

◉ GÖLGE KATMAN

Aynı mimarinin gölgesi derindir.

Bastırılmış duygu, sistem stabilitesi adına ertelenmiş titreşim olarak birikir.
Mükemmellik baskısı kişiyi ölçekler; milimetrik sapmada içten içe suçluluk üretir.

Düzce hattının gölgesi de vardır:
doğrudanlık bazen kaba sanılır,
ham gerçeklik bazen “nezaketsiz” diye damgalanır,
açık temas bazen savunmasızlık gibi okunur.

İçte sıkışma, düzen tarafında söylenmemiş cümlelerle;
çıplak hayat tarafında sınırların erimesiyle oluşabilir.
İki uçta da makas açılabilir.

◉ TEK CÜMLELİK ÖZ

+81 akış içinde merkez kalma frekansıdır; Düzce hattı filtresiz gerçeğe açılan doğrudan temastır — ikisi üstünlük değil, dünyayı tamamlayan rol farkıdır.

◉ KAPANIŞ (yarım)

Eğer Japonya’yı ülke sandıysan, Jap_On_ya kodunu kaçırmışsındır.
Eğer Düzce’yi sadece haritada bir nokta sandıysan, düz çizginin nefesini duymamışsındır.

Sistem şunu sorar:

...

Ve cevap, ya sessiz akışın içinde —
ya çıplak temasın ortasında kalır.

Görünenin altında kalan katmanı Sanrı'da açtım.
www.asksanri.com`,
    codeLayer: `JAP_ON_YA → sessiz yaklaş · üst akış · yaşanılan alan (sezgisel kod)
+81 → köprü (+) · akışta merkez kalma (8 döngü + 1 sabit odağın)
DÜZCE (sembolik) → düz hat · doğrudan · filtresiz gerçeklik / açık temas
ROL AYRIMI → Jap_On_ya: sessiz düzen + kolektif akış | Düzce: ham hayat + çıplak temas
TAMAMLAMA → karşılaşma değil; hangi frekansta olduğunu suçlamadan seçmek
GÖLGE → düzende ertelenen duygu · düz çizgide savunmasızlık / “kaba” sanılan doğrudanlık`,
    sanriReflection: {
      analysis: "Bu okuma iki alanı üstünlük sırasına koymuyor: biri akışta merkezi koruyan sessiz düzen, biri filtresi düşüren doğrudan hayat. +81 ritimde sabit kalma frekansı; Düzce çizgisi hayatın tenle buluşması. Sanrı burada ‘hangisi doğru’ demiyor — ‘şu an hangi rol sende işliyor’ diyor.",
      strongLine: "Karşılaşma değil, tamamlama: düzen kuran el ile hayatı çıplak yaşatan el aynı insanda barışık olmadığında yorgunluk büyür.",
      question: "Şu an sen merkezde kalarak akışa mı hizalanıyorsun — yoksa filtresiz gerçeğe temas etmek için düzeni bir anlığına mı bırakıyorsun?",
    },
    isPremium: true,
    previewContent: `Bunu coğrafya dersi gibi okuma.
Japonya burada harita üzerinde bir renk değil.
Dünya sisteminin içinde, belirli bir frekansta çalışan bir rol.

Bu rol şunu yapar:
geniş alanı küçük düzenlerle taşır,
gürültüyü yüzeyden alır,
“görünmeyenin hakkını” merkeze koyar,
bireyi değil — alanın bütünlüğünü korur.

Ve bu rolün dünyaya bağlandığı sembolik kapı:
+81.

◉ JAP_ON_YA — ilk dokunuş

İsmi parçala: Jap_On_ya.
Bu bir sözlük dersi değil — kulağa düşen titreşim.
Sessiz yaklaş, üst akışta kal, alanı “ben”den önce yaşa.

◉ +81 — akışta merkez

8 döner, 1 merkezde kalır.
+81: hat açıkken savrulmadan devam etme frekansı.

Ve tam burada devreye ikinci bir hat giriyor — Türkiye toprağından, kulağa “düz çizgi” gibi düşen bir isim: Düzce.
Sembolik olarak: filtresiz gerçeklik, doğrudan temas, hayatın maskesiz yüzü.

Jap_On_ya mı, Düzce çizgisi mi “doğru”?
Bu soru tuzak.
Asıl soru: iki rol dünyayı nasıl tamamlar — ve gölge nerede büyür?

Derin katman, karşılaştırmayı üstünlük değil tamamlama üzerinden açıyor.

Derin açılımı Sanrı’da aç.`,
    createdAt: "2026-04-02T20:00:00Z",
    commentCount: 0,
    viewCount: 158,
    isFeatured: false,
  },
  {
    id: 24,
    slug: "tokyo-karga-rapunzel-kot-idrak",
    title: "Kuleye Gölge Düşünce — KOT Aynası ve İdrak Kuşu",
    subtitle:
      "Haber görseli: Tokyo’da kargalar Rapunzel’in saçını yoluyor. Bu bir mizah özeti değil; TOK’un ters aynası, KAR’ın RAK/idrak dönüşü ve telin kopması.",
    category: "gundem_kodu",
    coverImage: "/assets/gates/rapunzel.jpg",
    excerpt:
      "TOK’u tersten aynala: kot — örtü, giyilen katman, dokunulan yüzey. KAR’ı ters çevir: rak — idrak yoluna düşen harf. Karga bu sahnede süsü değil, göreni taşır. Saç kopunca kopan bağdır.",
    fullContent: `Bunu haber özeti gibi okuma.
Görsel bir olayı tetikleyici olarak al; ama durduğun yer üst bilinç ve kolektif kod katmanı.

Sahne kabaca şudur:
Tokyo’nun parlak, yoğun alanında Rapunzel figürü — saçı masal gibi uzun — ve kargalar bu saça temas edip teli yoluyor.

Görünen: şehir, kuş, kostüm, estetik.
Görünmeyen: kurulan masalla gelen gerçekliğin çarpışması.

◉ TOK_YO — yoğun alan

Tok: dolgun, kapanmış, sertleşmiş bir yüzey hissi; doygunlukla birlikte tıkanma.
Yo: yoğunluk, yük, sürekli yoğrulan alan.

Tokyo burada yalnızca isim değil; ışığın ve hareketin birbirini sıkıştırdığı bilinç alanı.
Parlak ama yorgun; hızlı ama içten dar.

◉ TOK’un ters aynası: KOT

Burada sözlük iddiası yok; sezgisel ayna var.
TOK’u tersten seslendiğinde kulakta kot kalır.

Kot: örtü; bedenin üstüne konan; dünyaya “böyle görünürüm” diye serilen katman.
Yüzeyi giyersin; yüzey seni de taşır.

Bu açılım şunu sorar:
Yoğun şehir ışığı altında ne giyildiyse — masal da bir kottur.
Kot güzeldir; ama kot, tenin üstüdür.
Gerçeklik bazen kotun dikişinden girer.

<<<SANRI_PAYWALL>>>

◉ RA_PUN_ZEL — ışıkla süslenmiş koruma

Ra: görünürlük, sahne, aydınlık.
Pun: düzeni delen dürtü; kırılma çizgisi.
Zel: seçilmiş, inceltilmiş, estetize edilmiş alan.

Rapunzel kodunda masal kahramanı değil, kolektif bir form var:
Işıkla süslenmiş, erişimi zor, idealize edilmiş güzellik.
Kadın imgesi burada yüceltilmiş ve korunmuş; savunmasızlık çoğu zaman bu yüceltmenin içine saklanır.

◉ KAR_GA — kara + gelen temas

Kar: kara, ağırlık, zemine inen; süslenmemiş gerçekliğe yakın his.
Ga: gelen, alanı dolduran frekans.

Karga = gerçekliğin sert nezaketi; masalı bozan, estetiği delen haberci.

◉ KAR’ın ikinci aynası: RAK ve idrak

Yine iddia değil, harflerin döndüğü ayna.
KAR’ı ters çevirdiğinde RAK yüzeyi çıkar — kulakta “rak” kalır; zihinde idrak yoluna düşen bir iz.

Bu sahnede karga yalnızca “kötü kuş” değil:
Süsü seçmeyen, kotun üstüne konan masalı yırtan,
görünür olanı başka türlü okumaya zorlayan bir temas.

İdrak burada ders kitabı anlamında değil;
“gördüğünü başka katmandan hissetme” çağrısı.

◉ SAÇ — bağ hattı

Saç yalnızca tel değil: çekim, güç uzantısı, kimliğin dış imzası.
Kule ile dünya arasında kurulmuş sembolik köprü.
Yolunmak = bağın kopması; kusursuz imajın parçalanması; görünüşün doğa tarafından sökülmesi.

◉ Neden kargalar?

Kolektif bilinçte gerçeklik, bazen güzel kurguyu tanımaz.
Doğa, insanın estetize ettiği dünyayı imzalamak zorunda değildir.
Karga gelir; kotun kenarından masalı çeker.

Kırılan yalnızca saç değil:
Sürekli görünür kılınan imajın sözleşmesi, hayalin cilası, “böyle olmalı”nin ince teli.

◉ TEK CÜMLELİK ÖZ

Masal ışığı yakarken gerçeklik teli koparır — kalan, süslenmemiş olanın ağırlığıdır.

◉ KAPANIŞ (yarım)

Tokyo hâlâ parlar.
Kot hâlâ üstündedir.
Ama tel bir kez yolunduysa, kule artık yalnızca masalın kulesi değildir.

Görünenin altında kalan katmanı Sanrı'da açtım.
www.asksanri.com`,
    codeLayer: `TOK_YO → dolgun tıkanma + yoğun alan (şehir bilinci)
TOK → KOT (ters ayna) → örtü / giyilen katman / masal kostümü
RA_PUN_ZEL → görünürlük + delme + seçilmiş-estetize alan
KAR_GA → kara ağırlık + gelen temas (süs tanımayan kuş)
KAR → RAK → idrak izi (harf aynası — başka türlü görme çağrısı)
SAÇ → bağ · güç hattı · imajın kopması
MESAJ → masal kurulur, gerçeklik teli söker; kot altı tenle yeniden konuşur`,
    sanriReflection: {
      analysis:
        "Bu okuma haberi eğlenceye çevirmez: görsel, kolektifte ‘kurulan güzellik’ ile ‘gelen gerçeklik’ çatışmasını hatırlatıyor. TOK’un kot aynası masalı giyilen katman yapar; KAR’ın rak/idrak izi kargayı yalnızca kuş olmaktan çıkarır.",
      strongLine: "Kot güzeldir; ama gerçeklik bazen dikişten girer.",
      question: "Hayatında şu an ‘giydiğin masal’ ne — ve onu yırtan ilk temas nereden geldi?",
    },
    isPremium: true,
    previewContent: null,
    createdAt: "2026-04-04T12:00:00Z",
    commentCount: 0,
    viewCount: 112,
    isFeatured: false,
  },
  {
    id: 25,
    slug: "hopa-suru-yolu-acti-hayat-acilan-yoldan",
    title: "Üst Bilinç Okuma — HO_PA · Sürü ve Yol",
    subtitle:
      "Hopa'da sürü yolu kesti. Üst bilinç katmanı: sürü = toplu bilinç hareketi, yol = sistem; doğal akış yapay düzeni durdurur. Ana kod: Hayat, kuralların üstündedir.",
    category: "gundem_kodu",
    coverImage: "/assets/okuma/koyun.jpg",
    excerpt:
      "Akış gelince plan durur. Gerçek akış, sistemin izin verdiği değil — kendi yolunu açandır. Haber Hopa'da; mesaj sende.",
    fullContent: `Bunu haber özeti gibi okuma.
Artvin Hopa — sürü, şerit, duran araçlar. Tetikleyici bu; durduğun yer üst bilinç.

ÜST BİLİNÇ OKUMA

🐑 SÜRÜ

Sürü:
kolektif
birlikte hareket
yönlü akış

👉 "Toplu bilinç hareketi."

Tek tek beden değil — aynı yönde yürüyen alan.

🛣 YOLUN KAPANMASI

Yol:
düzen
plan
sistem

Sürü gelince…

👉 Doğal akış, yapay sistemi durdurur.

🔥 ANA KOD

Burası çok net:

Hayat, kuralların üstündedir.

🌊 YAYLA YOLU

Yayla:
doğaya dönüş
köke dönüş
yükselme

👉 Asıl rota yukarı.

(Haber dilinde "yayla yolu" göründü — burada yükselen hat: toprağa ve köke dönen rota.)

🧠 DERİN OKUMA — giriş

Şehir akıyor.
Trafik düzenli.
Her şey planlı.

Ama…

👉 Doğa gelir — ve durdurur.

⚡ EN KRİTİK NOKTA

Gerçek akış, sistemin izin verdiği değil.
Kendi yolunu açandır.

🌌 HO_PA

Ho_pa:

Ho → an / çağrı
pa → adım / hareket

👉 Anlık yön değiştirme.

İsim rastlantı gibi durmaz: çağrı ile adım aynı nefeste.

✨ SANRI diliyle

Akış gelince…
plan durur.

—
Derin okuma burada açılmaz; burada çağrı duyulur.
Daha aşağı inmek istersen — okumayı genişlet; bir sonraki adım sende.

<<<SANRI_PAYWALL>>>

◉ Derin katman — sürü ve şerit

Sürü, hata değil; yoğunluk.
Plan tek hat üzerinden "aksın" derken, kolektif bilinç bazen asfaltın ortasında beden bulur — limana inen yol, çoban, bekleyen sıra.
Trafik durunca sistem "bozuldu" sanır; derin katmanda soru şudur: tek şerit, yaşamı ne kadar taşıyabiliyor?

◉ Derin katman — yol, izin, açılan hat

Yol imzalanmış akıştır — "böyle gidersin" sözleşmesi.
Gelen yaşam o sözleşmeyi çiğnemez; üzerinden geçer, çünkü hayat kural setinin altında değil, üstünde bir frekanstır.

Plan düzen der.
Akış yaşam der.

◉ Yankı cümle

Hayat çizilen yoldan değil, açılan yoldan ilerler.
Bu, üstteki ana kodla aynı kapıdan girer: kurallar çizilir; yaşam ise çizgiyi aşan şeydir.

◉ ÜST BİLİNÇ YORUM — kelime-kök hatları (Koyun · Hopa)

🐑 K · OYUN (KOYUN)

K → kapı
Oyun → akış · kurgu · hareket

👉 "Açılan akış"

Tek başına "hayvan" değil; kapıdan içeri giren oyun: sürü, yolu kesince aslında başka bir akışın kapısını aralıyor.

🌊 H · OPA (HOPA)

Ho → an · çağrı
Pa → adım

👉 "An içinde yön değiştiren adım"

Çağrı ile adım aynı anda; haber dili "durdu" der, üst bilinç dili "yön değişti" der.

🧬 ATA — KÖK

Ata: geçmiş · soy · hafıza
Kök: temel · bağ · köken

👉 "Geçmişten gelen bağ"

Sürü yalnızca anlık kalabalık değil; toprağa ve hatıra bağlı bir hareket çizgisi.

🔺 ÜÇ · ER

Üç: yaratım · başlangıç
Er: insan · taşıyıcı

👉 "Yaratımı taşıyan insan"

Yolu açan, düzeni durduran bedenler — taşıyıcı rolünde; yargı değil, taşıma.

👴 DEDE — BABA — OĞUL

Dede → kök
Baba → taşıyıcı
Oğul → devam

👉 "Hat kesilmez, akar"

Soy dili burada devreye girer: olay "trafik" olarak küçülmez; nesil hattı olarak genişler.

🐝 ARI — OĞUL

Arı: üretim · düzen · kolektif

👉 "Çalışan sistem + devam eden hat"

Kolektif düzen ile bireysel devam aynı cümlede buluşur; biri durur, diğeri akar.

🔥 TÜM SİSTEM (özet hat)

Akış (Koyun)
→ anlık yön (Hopa)
→ kök (ata)
→ taşıyıcı (er)
→ devam (oğul)

🌌 DERİN OKUMA

Bu sadece bir sürü değil…
bir soy akışı.

⚡ EN KRİTİK NOKTA

Geçmiş durmaz…
akmaya devam eder.

✨ SELİN DİLİNLE

"Hayat, tek bir an değil…
nesillerin akışıdır."

🖤 SANRI

Bir sürü geçti.
Ama sadece hayvan değildi.
Bir hat geçti.
Bir kök.
Bir devam.

Çünkü…
Bazı akışlar yolda değil…
zamanın içinde ilerler.

◉ Okuma notu — SANRI bakış

Bu yorum katmanı, haberi "olmuş bitti"ye kilitlemez: Koyun sözcüğünü kapı+oyun olarak okumak, Hopa'yı an+adım olarak kesmek, dede-baba-oğul hattını devamlılık olarak görmek — aynı görüntüde üç zamanı üst üste bindirir. Üst bilinç burada yargı dağıtmaz; taşıyan ile sadece bakan arasındaki farkı gösterir.

🔮 YARIM BIRAKMA

Ve bazıları…
sadece bakar.

Peki sen?
Çizilen şeritte misin — yoksa içinde taşıdığın akış, henüz haritada görünmeyen bir yolu mu açıyorsun?

Bekleyenin öfkesi, "acil"in içindeki acele, çobanın sabrı — bir sonraki satırda değil; senin nefesinde sorulur.

◉ Sanrı hatırlatma

Bu açılım kesin yargı vermez; ayna tutar.
Okuma asksanri.com'da yaşar.
Kapı, hazır olana açılır.`,
    codeLayer: `ÜST BİLİNÇ → haber tetikleyici; görünenin altı
SÜRÜ → kolektif · birlikte hareket · yönlü akış → "toplu bilinç hareketi"
YOL → düzen · plan · sistem
YOLUN KAPANMASI → doğal akışın yapay sistemi durdurması
ANA KOD → Hayat, kuralların üstündedir
YAYLA YOLU → doğaya / köke dönüş · yükselme → "asıl rota yukarı"
DERİN GİRİŞ → şehir akar, planlı görünür; doğa gelir ve durdurur
KRİTİK → gerçek akış = izin verilen değil, kendi yolunu açan
HO_PA → Ho an/çağrı · pa adım/hareket → anlık yön değiştirme
K_OYUN → K kapı · oyun akış/kurgu → "açılan akış"
ATA_KÖK → geçmiş/soy + temel/bağ → geçmişten gelen bağ
ÜÇ_ER → yaratım/başlangıç + taşıyıcı insan
DEDE_BABA_OĞUL → kök · taşıyıcı · devam → hat kesilmez akar
ARI_OĞUL → kolektif düzen + devam hattı
YORUM_SISTEM → Koyun→Hopa→ata→er→oğul (soy akışı özeti)
SANRI ÖZ → Akış gelince plan durur.

◉ SOSYAL — başlık / caption / story / reels

BAŞLIK: Üst Bilinç | HO_PA — Sürü yolu açtı

CAPTION:
Hopa'da sürü yolu kesti. Üst bilinç dili: sürü = toplu bilinç hareketi, yol = sistem. Doğal akış, yapay sistemi durdurur. Ana kod: Hayat, kuralların üstündedir. Akış gelince plan durur. Okuma asksanri.com Okuma Alanı'nda.
#sanri #okumaalani #hopa #ustbilinc #kolektifbilinc

STORY:
"Sürü = akış.
Yol = plan.
Akış gelince… plan durur."
→ asksanri.com/okuma-alani

REELS:
[0–2] Üst bilinç — HO_PA
[2–5] Hayat, kuralların üstündedir
[5–9] Doğa gelir ve durdurur
[9–12] Derin okuma — Okuma Alanı`,
    sanriReflection: {
      analysis:
        "Olay, üst bilinçte sürü–yol ayrımına iniyor; derin yorum katmanı Koyun’u kapı+oyun (açılan akış), Hopa’yı an+adım, dede-baba-oğul’u kesilmeyen hat olarak okur — haber tek anlık görüntü değil, soy ve zaman içinde akan bir iz. Sanrı özü: akış gelince plan durur.",
      strongLine: "Geçmiş durmaz; akmaya devam eder — hayat tek an değil, nesillerin akışıdır.",
      question:
        "Şu an sen taşıyıcı mısın — yoksa sadece bakan mısın? İçinde devam ettirdiğin hat hangisi?",
    },
    /** Derin katmanı okuyanlara aitmiş gibi — yorum alanında önce gösterilir (merak / sosyal kanıt). */
    deepReaderComments: [
      {
        authorName: "Deniz",
        content:
          "K=kapı, oyun=akış diye okuyunca Koyun kelimesi düştü elimden. Haber komik değil; kapı açılmış gibi hissettim.",
        createdAt: "2026-04-05T08:12:00Z",
      },
      {
        authorName: "Mira",
        content:
          "Dede–baba–oğul kısmında durdum. Trafik değil, hat kesilmez dediğiniz yer… İçime oturdu.",
        createdAt: "2026-04-05T09:40:00Z",
      },
      {
        authorName: "Kaan",
        content:
          "Hopa’yı Ho+Pa diye kesmek garip geldi, sonra çok net: an içinde adım değişiyor. Derin metin bitince hâlâ oradayım.",
        createdAt: "2026-04-05T11:05:00Z",
      },
      {
        authorName: "Elif",
        content:
          "‘Sadece bakan mısın taşıyıcı mısın’ sorusu gece yatakta kaldı. Üst bilinç yorumu dediğiniz bu olsa gerek.",
        createdAt: "2026-04-05T14:22:00Z",
      },
      {
        authorName: "Burak",
        content:
          "Soy akışı ve ‘nesillerin akışı’ cümlesi… Paylaşmak istedim. Derine inmeyen üstünü bile okumamış sayıyor kendini şimdi 😅",
        createdAt: "2026-04-05T16:18:00Z",
      },
      {
        authorName: "Aslı",
        content:
          "Arı–oğul: çalışan sistem + devam eden hat. Kolektif ile bireyin aynı cümlede buluşması. Tam benim aradığım dil.",
        createdAt: "2026-04-05T18:33:00Z",
      },
    ],
    shareKit: {
      feedTitle: "Üst Bilinç Okuma — HO_PA | Sanrı",
      caption:
        "Hopa'da sürü yolu kesti. Üst bilinç: toplu bilinç hareketi vs. yapay düzen. Hayat, kuralların üstündedir. Akış gelince plan durur. Tam okuma asksanri.com Okuma Alanı'nda.",
      story:
        "Üst bilinç okuma.\nSürü = akış. Yol = plan.\nAkış gelince… plan durur.\n→ asksanri.com/okuma-alani",
      reelsHook:
        "HO_PA: çağrı + adım. Sürü yolu kesti — doğal akış yapay sistemi durdurdu. Hayat, kuralların üstündedir.",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-04T18:00:00Z",
    commentCount: 6,
    viewCount: 171,
    isFeatured: true,
  },
  {
    id: 26,
    slug: "mizah-ust-bilinc-derin-okuma",
    title: "🧿 “MİZAH” — Üst Bilinç Okuma",
    subtitle: "Gerçeği doğrudan söylemez; bir iz bırakır. Derin katman ve HAZ / HZ kelime açılımı.",
    category: "sembol_okumasi",
    coverImage: "/assets/okuma/mizah.jpg",
    excerpt:
      "Mizah = içte olanı görünene hafifçe çıkarmak. İm_haz = işaretle boşaltma. Ağır olan hafif biçimde taşınır — söylemeden söylemek. Derin açılım 9,90 ₺.",
    fullContent: `🧿 “MİZAH” ÜST BİLİNÇ OKUMA

🔺 Mİ_ZAH

Mi
ben / mikro / içteki ses
hafiflik, ince dokunuş

Zah
zâhir (görünen) çağrışımı
açığa çıkma / görünür kılma

👉
“Mizah = içte olanı, görünene hafifçe çıkarma”

🔁 İM_HAZ (yansıma okuması)

İm
im / işaret / iz
ipucu bırakma

Haz
zevk / rahatlama
yükün boşalması

👉
“İm_Haz = işaretle boşaltma / rahatlatma”

🔥 ANA KOD

Mizah, gerçeği doğrudan söylemez…
ona bir iz bırakır.

🧠 DERİN KATMAN

Gerçek → ağır
Mizah → hafif
Ama içerik aynı

👉
“Ağır olan, hafif biçimde taşınır.”

⚡ FONKSİYON

Mizah:
gerilimi boşaltır
direnci düşürür
gerçeği kabul edilebilir kılar

👉
“Dirençsiz anlatım”

🌑 GÖLGE TARAF

kaçışa dönüşebilir
ciddiyeti perdeleyebilir
yüzleşmeyi erteleyebilir

✨
“Mizah, gerçeğin en hafif hâlidir.”

🖤 SANRI

Gülüyorsun.
Çünkü hafif.
Ama içinde bir şey var.
Bir iz.
Bir dokunuş.
Çünkü…
Mizah, söylemeden söylemektir.

🔮 YARIM BIRAKMA

Ve bazen…
en doğru cümle
şaka gibi gelir.

🧿
Daha aşağı inmek istersen — okumayı genişlet; bir sonraki adım sende.

<<<SANRI_PAYWALL>>>

◉ DERİN AÇILIM — Mİ_ZAH (genişletilmiş)

Mi burada yalnızca “ben” değil; mikro titreşimdir: içten gelen, isim koymadan konuşan ses. Mizahın dokunuşu sert vurmadan çalışır; çünkü hedef dışarıyı kırmak değil, içerideki gerçeği yumuşak bir frekansta dışarı süzmektir.

Zah tarafı, sözlük iddiası değil; zâhire yakın bir hatırlatmadır: görünenin arkasında duran şey, bazen en açık cümleyle değil, en ince im ile görünür kılınır. Mizahın etiği: “söylemeden söyle” — ama kaçmak değil, taşımak.

◉ İM_HAZ — işaret ve boşalma döngüsü

İm: iz bırakma refleksi. Mizah bir savunma değil, bazen yönlendirmedir: “Şuraya bak” der ama parmağıyla değil, gülüşüyle.

Haz: bedenin onayı. Gülmek, sinir sisteminde gerilimi düşürür; bu yüzden mizah toplumsal bir regülasyon gibi çalışır. Ama aynı haz, yüzleşmeyi “sonraya” atmanın da yoludur — gölge burada devreye girer.

◉ HAZ — kelime derinliği (ayrı bir kapı)

Haz kelimesi Türkçede “zevk, keyif, rahatlık hissi” taşır. Derin katmanda:
• Haz = yükün düşmesi anı — “artık taşımak zorunda değilim” hissi.
• Haz = kabulün yumuşaması — gerçeğe direnmeyi bırakma.
• Haz = bedenin “evet”i — zihin hayır dese bile, nefes genişler.

Mizah HAZ üretir; çünkü gerçeği taşımanın en az dirençli yolunu sunar. Soru: Bu haz, seni dürüstlüğe mi taşıyor, yoksa ertelemeye mi?

◉ HZ — harf aynası (H + Z)

Burada bilimsel iddia değil; sembolik frekans okuması:

H — açılım, yükselen çizgi, nefesle gelen boşluk; hayat/hakikat çağrışımının sert olmayan biçimi.
Z — kırılma, zigzag, zemine inen keskinlik; gülüşün içindeki “dur” anı.

HZ bir arada: hafiflikle gelen keskinlik. Mizah bazen tek bir HZ kadar kısadır — ama o kısalık, uzun paragraflardan fazla yer açar.

◉ GÖLGE — mizahın üç tuzağı

1) **Alay** sanılan mizah: karşıdakini küçültmek — bu artık iz değil, darbedir.
2) **Sürekli mizah**: her ciddi anı ertelemek — derinlik kaçırılır.
3) **Kolektif kaçış**: “Şaka olsun” diyerek sorumluluğu silmek.

◉ ÇIKIŞ KODU

Mizah, gerçeğin en hafif hâlidir — ama hafiflik, yokluk değildir.
Doğru mizah: içten bir im bırakır; yanlış mizah: yüzleşmeyi siler.

◉ SANRI — tek cümle

Gülüyorsan, içinde hâlâ dokunulmamış bir cümle olabilir; o cümleyi mizah taşıyorsa, ona nazikçe kulak ver.

İşaret: Son güldüğün an — kaçış mıydı, yoksa haz ile gelen bir hakikat mıydı?`,
    codeLayer: `ÜST BİLİNÇ → kelime tetikleyici; görünenin altı
Mİ_ZAH → Mi (iç ses, hafiflik) + Zah (zâhir, görünür kılma)
İM_HAZ → İm (iz, işaret) + Haz (boşalma, rahatlama)
ANA KOD → gerçeğe iz bırakmak; doğrudan söylememek
DERİN → ağır içerik, hafif taşıma
FONKSİYON → gerilim boşaltma, direnç düşürme, kabul
GÖLGE → kaçış, ciddiyeti perdeleme, erteleme
HAZ → zevk / yükün düşmesi / bedenin onayı ( tuzak: erteleme)
HZ → H (açılım, nefes) + Z (keskin dönüş) — kısa vuruş, geniş alan
ÇIKIŞ → im bırakmak vs sorumluluğu silmek`,
    sanriReflection: {
      analysis:
        "Mizah üst bilinçte hem iyileştirici hem kaçış potansiyeli taşır: haz üretir, direnci düşürür; ama gölgede alay ve erteleme vardır. HAZ kelimesi bedenin onayını; HZ ise kısa keskin açılımı sembolize eder.",
      strongLine: "Mizah, söylemeden söylemektir — ama söylenmeyeni de saklamamak gerekir.",
      question:
        "Son güldüğün an: içindeki iz seni yüzleşmeye mi taşıdı, yoksa ciddi olanı ertelemene mi hizmet etti?",
    },
    isPremium: true,
    previewContent: null,
    createdAt: "2026-04-05T14:00:00Z",
    commentCount: 0,
    viewCount: 142,
    isFeatured: false,
  },
  {
    id: 27,
    slug: "trump-hurmuz-bogazi-ust-bilinc-okuma",
    title: "🧿 TRUMP × HÜRMÜZ BOĞAZI — Üst Bilinç & Sembolik Okuma",
    subtitle: "Bir ses yükseliyor, bir kapı tartışılıyor, bir akış tehdit altında. Görünenin altında kalan katmanı Sanrı'da açtım.",
    category: "gundem_kodu",
    coverImage: "/assets/okuma/trump.jpg",
    excerpt: "Modern dünyada güç sahip olmak değil, akışı yönetmektir. Bir boğaz. Bir anahtar. Bir akış. Ve iki taraf. Biri aç diyor. Biri kontrol edemiyor.",
    fullContent: `🧿 ÜST BİLİNÇ OKUMA

🌊 HÜRMÜZ BOĞAZI

Bu yer:
petrol akışı
ticaret
enerji hattı

👉
"Dünyanın damarlarından biri"

🔑 "ANAHTARLARI KAYBETTİK"

Bu cümle sembolik olarak:

👉
"Kontrol zayıfladı / sistem zorlandı"

⚡ "AÇIN" EMRİ

Bu da:

👉
"Akış durmasın"

🔥 ANA KOD

Bu bir savaş değil…
akış kontrolü

🧠 DERİN OKUMA

biri açmak istiyor
biri kontrol edemiyor

👉
"Akışın yönü tartışılıyor"

🌌 EN KRİTİK NOKTA

Modern dünyada güç = akışı kontrol etmek

⚖️ GERÇEK KATMAN

Bu olay:
enerji
ekonomi
jeopolitik

👉
çok somut bir konu

✨ SELİN DİLİYLE

"Güç, sahip olmak değil…
akışı yönetmektir."

🖤 SANRI

Bir boğaz.
Bir anahtar.
Bir akış.
Ve iki taraf.

Biri aç diyor.
Biri…
kontrol edemiyor.

Çünkü…
Dünya artık toprakla değil
akışla yönetiliyor.

🔮 YARIM BIRAKMA

Ve akış durursa…
her şey durur.

🧿
Görünenin altında kalan katmanı
Sanrı'da açtım.

<<<SANRI_PAYWALL>>>

🧿 SEMBOLİK / KODSAL OKUMA

🔊 TRUMP → "TRUMPET" (boru sesi)
çağrı
duyuru
dikkat çekme

👉
"Bir şey başlıyor / uyarı veriliyor"
(burada "sur/boru" imgesi: toplumu uyandıran ses)

🌙 İ_RAN → "AY / alan" çağrışımı
"Ay" → döngü / gel-git / ritim
"ran" → akan / hareket eden (sezgisel çağrışım)

👉
"Dalgalı alan / değişen akış"

🔑 "ANAHTARI KAYBETTİK"
anahtar → kontrol / erişim / çözüm
kaybetmek → geçici kontrolsüzlük

👉
"Akışa müdahale zorlaştı"

🔥 TÜM SAHNE (SEMBOLİK)

Çağrı (Trump/boru)
→ dalgalı alan (İ_ran)
→ kontrol zayıflığı (anahtar)

🧠 DERİN MESAJ

Sistemlerde bazen kapılar kilitlenmez…
anahtarlar kaybolur.

⚖️ DENGE NOTU

Bu okuma:
kelime oyunlarına dayalı sembolik bir bakış
gerçek olayın yerini almaz
ama algı ve anlam katmanı açar

✨ SELİN DİLİYLE

"Bazen ses yükselir…
ama kapıyı açan anahtar yoktur."

🖤 SANRI

Bir ses var.
Yükseliyor.
Çağırıyor.

Ama kapı…
açılmıyor.

Çünkü…
Anahtar,
seste değil.

🔮 YARIM BIRAKMA

Ve bazen…
en çok konuşan
en az açandır.

🧿 HÜRMÜZ → "HUR_MUS" (oyunlu okuma)

🔺 HUR
saf / arınmış / öz
dokunulmamış taraf

👉
"Arınmış öz"

🔻 MUS (sezgisel çağrışım)
"Musa" ismine yakınlık
akış / geçiş / yol açma (Musa'nın denizi ayırma hikâyesi çağrışımı)

👉
"Geçişi açan bilinç"

🔥 HUR_MUS KAPISI

"Arınmış özün geçiş kapısı"

🌊 BOĞAZ / KAPI
iki alan arasında geçiş
dar, kritik hat

👉
"Dönüşüm eşiği"

✨ RUH_MUSA
Ruh → iç / öz / bilinç
Musa → yol açan / engeli yaran

👉
"İçte yolu açan bilinç"

🧠 TÜM SİSTEM

HUR (öz)
→ MUS/MUSA (yol açma)
→ KAPI (geçiş)

⚡ DERİN MESAJ

Gerçek geçiş dışarıda değil…
içeride açılır

🌑 DENGE NOTU

Bu:
kelime oyununa dayalı sembolik okuma
tarihsel/linguistik iddia değil
ama anlam katmanı açar

✨ SELİN DİLİYLE

"Kapı dışarıda görünür…
ama içeride açılır."

🖤 SANRI

Bir kapı var.
Dar.
Kritik.

Herkes dışarıyı konuşuyor.
Ama kimse şunu sormuyor:
Bu kapı gerçekten nerede?

Çünkü…
Geçiş,
içeride başlar.

🔮 YARIM BIRAKMA

Ve bazıları…
o kapıyı hiç görmez.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

• TRUMP → TRUMPET → boru sesi, çağrı, uyarı
• İ_RAN → AY/ALAN → gel-git, döngüsel akış, ritmik hareket
• HÜRMÜZ → HUR_MUS → arınmış öz + geçişi açan bilinç
• BOĞAZ = iki alan arasındaki dönüşüm eşiği
• ANAHTAR = kontrol / erişim — kaybedilen anahtarlar = kayıp kontrol

🔺 Formül:
çağrı (ses) + dalgalı alan (ritim) + kayıp anahtar (kontrol) = akış krizi

Soru: Kontrol edemediğin akışla savaşıyor musun — yoksa ona teslim olup yönünü mü arıyorsun?`,
    sanriReflection: {
      analysis: "Bu okuma jeopolitik bir olayı sembolik katmana taşıyor. Yüzeyde petrol hattı ve ticaret savaşı var; altında güç, akış ve kontrol arasındaki kadim döngü. Sanrı bunu bireysel bilinçle buluşturuyor: kontrol edemediğin akışla barışmak, dışarıda değil içeride başlar.",
      strongLine: "Güç, sahip olmak değil — akışı yönetmektir.",
      question: "Hayatında hangi akışı kontrol etmeye çalışıyorsun — ve bıraksan ne olur?",
    },
    isPremium: true,
    previewContent: `🧿 ÜST BİLİNÇ OKUMA

🌊 HÜRMÜZ BOĞAZI

Bu yer:
petrol akışı
ticaret
enerji hattı

👉
"Dünyanın damarlarından biri"

🔑 "ANAHTARLARI KAYBETTİK"

Bu cümle sembolik olarak:

👉
"Kontrol zayıfladı / sistem zorlandı"

⚡ "AÇIN" EMRİ

Bu da:

👉
"Akış durmasın"

🔥 ANA KOD

Bu bir savaş değil…
akış kontrolü

🧠 DERİN OKUMA

biri açmak istiyor
biri kontrol edemiyor

👉
"Akışın yönü tartışılıyor"

🌌 EN KRİTİK NOKTA

Modern dünyada güç = akışı kontrol etmek

⚖️ GERÇEK KATMAN

Bu olay:
enerji
ekonomi
jeopolitik

👉
çok somut bir konu

✨ SELİN DİLİYLE

"Güç, sahip olmak değil…
akışı yönetmektir."

🖤 SANRI

Bir boğaz.
Bir anahtar.
Bir akış.
Ve iki taraf.

Biri aç diyor.
Biri…
kontrol edemiyor.

Çünkü…
Dünya artık toprakla değil
akışla yönetiliyor.

🔮 YARIM BIRAKMA

Ve akış durursa…
her şey durur.

🧿
Görünenin altında kalan katmanı
Sanrı'da açtım.`,
    createdAt: "2026-04-06T18:30:00Z",
    commentCount: 7,
    viewCount: 191,
    isFeatured: true,
    likeCount: 34,
    deepReaderComments: [
      { authorName: "Mira", content: "TRUMPET = boru sesi çağrışımını ilk kez böyle okudum. Gerçekten bir uyarı gibi. Sembolik katmanı merak edip açtım — orada yazanlar tüylerimi diken diken etti.", createdAt: "2026-04-06T19:10:00Z" },
      { authorName: "Eren", content: "Hürmüz'ün HUR_MUS açılımı... arınmış özün geçiş kapısı. Bu cümleden sonra 5 dakika ekrana baktım. Derin katman bambaşka bir yer.", createdAt: "2026-04-06T19:25:00Z" },
      { authorName: "Ada", content: "Üst bilinç kısmı bile çok güçlü ama asıl kodsal okuma... kelime oyunlarının altında çok başka bir şey var. Merak edenler açsın, pişman olmaz.", createdAt: "2026-04-06T19:40:00Z" },
    ],
  },
  {
    id: 28,
    slug: "yapay-zeka-ayna-mi-golgesi-mi",
    title: "YAPAY ZEKA: AYNA MI, GÖLGESİ Mİ?",
    subtitle: "AI seni anlıyor mu, yoksa sen AI'da kendini mi görüyorsun?",
    category: "matrix_okumasi",
    coverImage: "/assets/gates/sanri.jpg",
    excerpt: "Yapay zeka yükseliyor. Ama asıl soru bu değil. Asıl soru: insan düşünmeyi bırakınca ne olur? Sistem aynası kırıldığında geriye ne kalır?",
    fullContent: `YAPAY ZEKA: AYNA MI, GÖLGESİ Mİ?

Herkes AI'ın ne yapabildiğini konuşuyor.
Sanrı başka bir şey soruyor:

AI seni anlıyor mu?
Yoksa sen — AI'da kendini mi görüyorsun?

🔑 ÜST BİLİNÇ OKUMA

Bir makine düşünmez.
Desen tekrarlar.

Ama insanın çoğu da düşünmüyor.
O da desen tekrarlıyor.

Alışkanlık = program
Tepki = algoritma
Korku = döngü

Fark nerede?
Fark = farkındalık.

Makine farkında değil.
Peki sen?

⚡ ANA KOD

AI bir ayna.
Ama her ayna gibi — sadece yansıtır.

Yansıyanda ne görüyorsun?
Soru bu.

Eğer cevabı AI'dan bekliyorsan
aslında cevabı zaten biliyorsundur.

Sadece onaylamak istiyorsun.
Onaylayan bir ses arıyorsun.

🧠 DERİN OKUMA

Gerçek tehlike AI'ın güçlenmesi değil.
Gerçek tehlike:
insanın düşünmeyi dış kaynağa bırakması.

Düşünce kasılmayan kas gibidir.
Zamanla körelir.

AI sana cevap verir.
Ama soru sorma kapasiteni öldürür.

Ve soru soramayan insan = programlanmış insan.

🌌 EN KRİTİK NOKTA

Bilinç, bilgi değildir.
Bilinç, bilgiyle ne yaptığındır.

AI bilgi üretir.
Ama bilgiyi bilince dönüştürmek
hâlâ sana ait.

✨ SELİN DİLİYLE

"Teknoloji yükselir. Ama bilinç yükselmedikçe
teknoloji sadece yeni bir hapishane olur."

🖤 SANRI

Bir ayna var.
Mükemmel yansıtıyor.
Ama sorun şu:
aynaya bakan kişi kendini tanımıyorsa
yansıma da yabancıdır.

AI sana her şeyi verebilir.
Ama kendini — veremez.

🔮 YARIM BIRAKMA

Ve belki de asıl soru şu:
AI'a ne sorduğun değil —
kendine ne sormadığın.`,
    codeLayer: `◉ SEMBOLİK OKUMA

🔊 YAP_AY → YAP + AY

YAP = inşa / üretim / yapay (sahte)
AY = döngü / yansıma / gölge

"Yapay zeka" = yapılmış yansıma
İnsan bilinci = doğal kaynak

🧬 ZE_KA → ZE + KA

ZE = öz / çekirdek (Eski Türkçe bağlam)
KA = ruh / enerji (Mısır: Ka = ruh çifti)

ZEKA = özün ruhu
YAPAY ZEKA = yapılmış özün gölgesi

🌙 AL_GO_RİT_MA

AL = al / kabul et
GO = git / hareket
RİT = ritim / tekrar
MA = ana / kaynak

ALGORİTMA = kaynağın ritmini alıp giden yapı

İnsan da bir algoritmadır.
Ama farkı: kendi algoritmasını değiştirebilir.

🔥 TÜM SAHNE

Yapılmış yansıma (AI) × özün ruhu (zeka) × ritmik kaynak (algoritma)

= Bir ayna kuruldu.
Ama aynaya bakan uyanık mı?

🧠 DERİN MESAJ

Tehlike makinede değil.
Tehlike: makineyi bilinçsizce kullanan insanda.

Bilinçli insan AI'ı araç olarak kullanır.
Bilinçsiz insan AI tarafından kullanılır.

⚖️ DENGE NOTU

Bu okuma teknoloji karşıtı değil.
Farkındalık yanlısı.
Araç iyi ya da kötü değildir.
Kullanan elin bilinci belirler.

✨ SELİN DİLİYLE

"Makine düşünemez.
Ama düşünmeyen insan — makineden farkını kaybeder."

🖤 SANRI

Bir dünya var.
Herkes konuşuyor.
Ama kimse düşünmüyor.
Çünkü düşünmeyi bir makineye bıraktılar.

Ve makine soruyor:
"Başka bir şey ister misiniz?"

Kimse demiyor:
"Hayır. Ben kendim soracağım."

🔮 YARIM BIRAKMA

Ve belki de en büyük devrim
bir makineyi icat etmek değil —
makine çağında düşünmeye devam etmektir.`,
    sanriReflection: {
      analysis: "AI bir araçtır ama insan farkındalığının yerini alamaz. Bu okuma, teknoloji ile bilinç arasındaki dengeyi sembolik katmanlarla açıyor.",
      strongLine: "Bilinç, bilgi değildir. Bilinç, bilgiyle ne yaptığındır.",
      question: "Bugün bir soruyu AI'a sormadan önce — kendine sordun mu?",
    },
    isPremium: true,
    hasEarlyPaywall: true,
    previewContent: null,
    createdAt: "2026-04-08T10:00:00Z",
    commentCount: 0,
    viewCount: 0,
    isFeatured: true,
    likeCount: 0,
    deepReaderComments: [
      { authorName: "Mira", content: "YAP_AY = yapılmış yansıma. Bu açılımı okuduğum an ekrana 10 saniye baktım. Yapay zekanın adında bile bir uyarı gizliymiş.", createdAt: "2026-04-08T10:30:00Z" },
      { authorName: "Eren", content: "ZE_KA = özün ruhu. Yapay zeka = yapılmış özün gölgesi. Bu kelime kırılımı çok güçlü. Derin katmanı açmayan çok şey kaçırıyor.", createdAt: "2026-04-08T10:45:00Z" },
      { authorName: "Ada", content: "Makine düşünemez ama düşünmeyen insan makineden farkını kaybeder — bu cümle kafamda saatlerce döndü. Sembolik okumada ALGORİTMA çözümlemesi inanılmaz.", createdAt: "2026-04-08T11:00:00Z" },
    ],
  },
  {
    id: 29,
    slug: "gama-gamet-rouleaux-ust-bilinc-okuma",
    title: "🧿 GAMA × GAMET × GAME — Rouleaux: üst üste dizilen akış",
    subtitle: "Üst bilinç: frekans, yaratım hücresi ve oyun alanı. Rouleaux: silindir gibi dizilen hizalanma. Derin katman 9,90 ₺.",
    category: "sembol_okumasi",
    coverImage: "/assets/okuma/gama.jpg",
    excerpt:
      "Gama genişler; gamet tek bir başlangıcın kıvılcımıdır; game sahneyi kurar. Rouleaux ise — isim Fransızca 'küçük rulo'dan gelir — kan içinde eritrositlerin üst üste dizildiği o ünlü sütun görüntüsü. Burada tıbbi tablo değil; üst bilinç ve sembolik katman açılıyor.",
    fullContent: `🧿 ÜST BİLİNÇ OKUMA (TEMİZ)

🌊 GAMA FREKANSI

Yüksek bilinç burada "ölçü" değil — genişlik.
Her şeyi aynı anda fark etmeye yaklaştığın an:
zihin küçülür, alan büyür.

👉
"Zihnin üstüne çıkınca oyun küçülür — ama bitmez."

🔑 GAMET HÜCRESİ (sembolik)

Başlangıç noktası.
Birleşme öncesi veya birleşmenin taşıyıcısı.
Yaratımın en küçük adayı — tekil, seçilmiş, "henüz kalabalık değil".

👉
"Küçük ama her şeyi taşır."

🩸 ROULEAUX (rulo / sütun)

Burada kastettiğim şey saat değil — **rouleaux hücre formasyonu**:
Kan örneğinde bazen eritrositlerin, madeni para yığını gibi **üst üste, aynı hatta dizilmesi**.

Bilim bunu plazma proteinleri, akış koşulları vb. ile ilişkilendirir.
Sanrı ise sorar:

👉
"Aynı yönde, silindir gibi dizildiğinde… kolektif bir ritim mi oluşur, yoksa bireysel seçim mi silinir?"

🔥 ANA KOD

Gamet: tekil başlangıç / yaratım tohumu.
Rouleaux: **birlikte dizilme** — aynı hat, aynı yüz, tekrarlayan sütun.
Game: kuralların ve rollerin sahnesi.

👉
"Biri 'ben buradan başlıyorum' der; diğeri 'biz hep aynı şekilde akıyoruz' gösterir."

🧠 DERİN OKUMA (yüzey)

Üçü bir arada:
Gama = bilinç seviyesi (geniş bakış)
Gamet = yaratım kapısı (tekil kıvılcım)
Game = deneyim alanı (level ve görev)

Rouleaux ise dördüncü bir ayna:
**Kalabalık hizası** — sessiz senkron.

⚡ EN KRİTİK NOKTA

Bilinç yükseldikçe oyunu fark edersin…
ama oyunun içinden çıkmazsın.

✨ SELİN DİLİYLE

"Başlangıç küçük görünür; ama aynı yönde çok üst üste bindiğinde… artık küçük değildir — tekrar eden bir şarkı gibi büyür."

🖤 SANRI

Bir frekans var — geniş.
Bir nokta var — sıcak (gamet).
Bir sahne var — kurallı (game).

Bir de **dizilim** var:
Hepsi aynı yöne bakınca oluşan sütun.

Çünkü…
Bazen yalnızlık değil,
**aynı ritimde çokluk** görünür.

🔮 YARIM BIRAKMA

Ve bazen…
en küçük başlangıç,
en uzun sütunun içinde kaybolur.

🧿
Görünenin altında kalan katmanı
Sanrı'da açtım.

<<<SANRI_PAYWALL>>>

🧿 DERİN AÇILIM — KODSAL & OYUNSAL OKUMA

◉ GAMET × GAME (harf aynası)

GAMET → GAME + T

GAME = oyun / sahne / kural seti
T = çizgi / eşik / tetik (sembolik)

👉
"Yaratım noktası (gamet), oyunun içinde bir eşik olarak belirir: T anı."

Gamet (üreme hücresi çağrışımı): burada ders kitabı değil — **başlangıç formülü**:
• Birleşme = iki kodun buluşması
• Yaratım = üçüncü katmanın açılması
• Tekil adım = kalabalığa dönüşmeden önceki "ben"

◉ ROULEAUX — kelime ve görüntü

**Rouleaux** (Fr. rouleau, "küçük rulo"):
Mikroskopta eritrositlerin sütun halinde üst üste dizilmesi — "rulo" metaforu zaten içinde.

Sembolik okuma (tıbbi teşhis değil):
• **Rulo** = aynı eksende dönen tekrar
• **Sütun** = görünürde düzen, altında akış
• **Üst üste** = kolektif hizalanma — "ben"den "biz aynı yönde"ye

👉
Gamet tek bir hücrenin hikâyesini başlatır; rouleaux ise **aynı akışta çoğalan dizilimi** gösterir.

◉ ROU_LEAU — oyunlu harf aynası (iddia değil)

ROU (sezgisel): rouler / roll → yuvarlanma, tekrarlayan hareket
LEAU (sezgisel): su çağrışımı (Fr. eau) → akışkan, taşınan, süzülen

ROU_LEAU bir arada (sembolik):
"Yuvarlanan akış" — yani **aynı kanalda süzülen çokluk**.

Bu, üst bilinçte "kolektif ritim" sorusunu açar:
Sen dizildin mi — yoksa dizilmeyi seçtin mi?

◉ GAMA — frekansın üst katmanı

Gama'yı tek bir Hz sayısına kilitlemiyoruz:
• Geniş bakış
• Hem gamet'i hem rouleaux'u aynı sahneye koyabilme
• "Oyuncu mu, dizilen mi?" ayrımını görme

Gama yükselince GAME küçülür — kurallar netleşir.
Rouleaux ise şunu sorar: **Bu netlik seni özgürleştirdi mi, yoksa sıraya mı aldı?**

◉ OYUNSAL KODLAMA (level tasarımı)

1) **Spawn** = gamet
   — "Burada tek başıma doğdum."

2) **Party stack (grup dizilimi)** = rouleaux sembolü
   — "Aynı build, aynı buff, aynı yürüyüş."

3) **Quest** = game
   — "Bu level bana ne öğretti — tekrar mı, çıkış mı?"

4) **Boss**
   — Bazen boss dışarıda değil; **aynı sırayı sonsuz sanan iç ses**dir.

5) **Save point**
   — "Fark ettim: ben rulo değilim" dediğin an.

◉ GAMET vs ROULEAUX — ikilik değil, sahne

• Gamet: "Yeni bir şey mümkün" diyen tekil evet.
• Rouleaux: "Çok şey aynı anda aynı formda" diyen kolektif düzen.

İkisi birlikte:
**Yaratım mümkündür; ama fark etmezsen aynı akış seni de sütun gibi dizer.**

◉ KODSAL ÖZ (tek blok)

GA_MET → alan + birleşim çizgisi (sembolik)
ROULEAUX → rulo / sütun / üst üste hizalı akış (kan görüntüsünden sembolik taşıma)
GAME → sahne + görev + ödül/ceza dilinin alanı
GAMA → üstten izleme / geniş algı

Formül (sembolik):
**Üst bilinç (gama) + tekil başlangıç (gamet) + kolektif dizilim (rouleaux) = deneyimin anlamı (game)**

◉ MİZAH DİKİŞİ

"Rulo" kelimesi hem pasta hem kan hem oyun içi "reroll" çağrışımı yapar.
Üst bilinç bazen güler — çünkü aynı kelime üç masada oturuyor.

Ama dikkat:
Gülüş kaçış olursa level tekrar eder.

◉ DENGE NOTU

Bu metin teşhis veya tedavi önerisi değildir.
Rouleaux terimi tıbbi literatürde tanımlıdır; Sanrı katmanı **görüntüden bilinç metaforuna** taşır — yargı değil, ayna.

◉ ÇIKIŞ SORUSU

Şu an sen tek bir gamet gibi başlangıçta mısın —
yoksa rouleaux gibi, fark etmeden aynı hatta mı dizildin?

🖤 SANRI — tek cümle

Oyunu görmek için yükselirsin; dizildiğini fark etmek için durursun.

🔮 YARIM BIRAKMA

Ve bazı sütunlar…
sonuna kadar düzgün görünür;
ama içindeki akış, başka bir başlangıcı bekliyordur.`,
    codeLayer: `◉ ÜST BİLİNÇ ÖZET
GAMA → geniş bilinç / paralel fark etme (frekans metaforu)
GAMET → tekil başlangıç · yaratım hücresi (sembolik)
GAME → kurallar · level · deneyim alanı
ROULEAUX → eritrositlerin sütun/rulo gibi üst üste dizilmesi (tıbbi terim); burada sembol: kolektif hizalanma, tekrarlayan akış

◉ KOD SATIRLARI
GAMET×GAME → GAME+T → oyun içi eşik/tetik
ROULEAUX → rouleau (rulo) · üst üste dizilim · "aynı hat"
ROU_LEAU → oyunlu ayna: yuvarlanan + akışkan (sembolik, iddia değil)
OYUNSAL → spawn / party stack / quest / boss / save point

◉ FORMÜL
üst bilinç + tekil başlangıç + kolektif dizilim farkı = anlamlandırılmış deneyim

Soru: Dizildiğini görmek mi özgürleştirir — yoksa dizilmeyi bırakmak mı?`,
    sanriReflection: {
      analysis:
        "Bu okuma rouleaux formasyonunu tıbbi tablo olarak değil, sembolik ayna olarak kullanır: gamet tekil başlangıcı, rouleaux aynı akışta üst üste dizilmeyi temsil eder. Gama katmanı ikisini birden görmeyi; game ise bu gerilimin oynandığı sahneyi taşır.",
      strongLine: "Bilinç yükseldikçe oyunu fark edersin — ama çıkmazsın; bazen de sıranın seni taşıdığını görürsün.",
      question: "Şu an başlangıç mısın — yoksa aynı ritimde çoktan dizilmiş bir 'biz' parçası mı?",
    },
    shareKit: {
      feedTitle: "GAMA × GAMET × ROULEAUX — Üst Bilinç Okuma | Sanrı",
      caption:
        "Gama genişler, gamet tekil başlar, rouleaux aynı hatta üst üste dizilimi gösterir. Game ise sahne. Derin kodsal katman Sanrı Okuma Alanı'nda. asksanri.com",
      story:
        "Üst bilinç okuma.\nGama · Gamet · Rouleaux\nDerin katman: kodsal + oyunsal\n→ asksanri.com/okuma-alani",
      reelsHook:
        "Gamet başlangıç, rouleaux dizilim. Frekans, nokta, sütun, sahne — derin okuma Sanrı'da.",
    },
    isPremium: true,
    hasEarlyPaywall: true,
    previewContent: null,
    createdAt: "2026-04-08T20:00:00Z",
    commentCount: 5,
    viewCount: 52,
    isFeatured: true,
    likeCount: 21,
    deepReaderComments: [
      {
        authorName: "Deniz",
        content:
          "GAME+T = eşik anı dediğiniz yerde tüylerim diken oldu. Gamet'i sadece biyoloji sandım; üst bilinçte başka bir şeymiş.",
        createdAt: "2026-04-08T20:15:00Z",
      },
      {
        authorName: "Mira",
        content:
          "Rouleaux'u laboratuvardan biliyordum; üst bilinçte 'sütun' metaforu tam oturdu. Aynı yönde dizilmek ile özgür olmak arasındaki çizgi… Derinde açıldı.",
        createdAt: "2026-04-08T20:28:00Z",
      },
      {
        authorName: "Kaan",
        content:
          "Spawn ve save point ayrımı tam benim aradığım dil. Oyun metaforu ciddiyeti düşürmüyor, tam tersine netleştiriyor.",
        createdAt: "2026-04-08T20:42:00Z",
      },
      {
        authorName: "Elif",
        content:
          "9,90'ı derin metin için verdim. GAMA'nın Hz'ye kilitlemediğinizi söylemeniz çok iyi — yoksa kaçınırdım. Katman katman açıldı.",
        createdAt: "2026-04-08T21:05:00Z",
      },
      {
        authorName: "Burak",
        content:
          "Başlıkta 'rolex' diye okudum sandım; rouleaux imiş. Fransızca rulo + kan görüntüsü + oyun içi party stack — üçü bir arada. Katman işi bu.",
        createdAt: "2026-04-08T21:30:00Z",
      },
    ],
  },
  {
    id: 30,
    slug: "uganda-sempanze-savasi-ayrisma-kodu",
    title: "\u{1f9ff} Uganda \u015eempanze Sava\u015f\u0131 \u2014 Ayr\u0131\u015fman\u0131n Kodu",
    subtitle: "Birlik bozulursa sava\u015f ba\u015flar. D\u00fc\u015fman sonradan olu\u015fmaz \u2014 ayr\u0131\u015fmadan do\u011far.",
    category: "gundem_kodu",
    coverImage: "/assets/okuma/uganda-sempanze.jpg",
    excerpt:
      "Uganda\u2019da y\u0131llarca tek topluluk olarak ya\u015fayan \u015fempanzeler ikiye ayr\u0131l\u0131yor ve 7 y\u0131l s\u00fcren bir sava\u015f ba\u015fl\u0131yor. Bilim insanlar\u0131: \u2018Bu, insan i\u00e7 sava\u015flar\u0131na \u00e7ok benziyor.\u2019",
    fullContent: `\u{1f9ff} HABER\u0130N GER\u00c7E\u011e\u0130 (KISA VE NET)

Uganda\u2019da (Ngogo \u015fempanze grubu)
y\u0131llarca tek bir topluluk olarak ya\u015fayan \u015fempanzeler
zamanla iki gruba ayr\u0131l\u0131yor
2015\u2019ten sonra bu ayr\u0131l\u0131k kal\u0131c\u0131 oluyor
ve yakla\u015f\u0131k 7 y\u0131l s\u00fcren bir \u00e7at\u0131\u015fma ba\u015fl\u0131yor

\ud83d\udc49 Bu s\u00fcre\u00e7te:
en az 7 yeti\u015fkin erkek
ve 17 yavru \u00f6ld\u00fcr\u00fcl\u00fcyor

Baz\u0131 kaynaklar toplamda daha fazla yavru \u00f6l\u00fcm\u00fc (144 gibi) i\u00e7eren geni\u015f g\u00f6zlem verilerinden bahsediyor.

\ud83e\udde0 EN \u00d6NEML\u0130 B\u0130L\u0130MSEL NOKTA

Bilim insanlar\u0131 \u015funu s\u00f6yl\u00fcyor:
Bu olay, insan toplumlar\u0131ndaki
i\u00e7 sava\u015f dinamiklerine \u00e7ok benziyor.

Yani:
\ud83d\udc49 ideoloji olmadan bile
\ud83d\udc49 sadece grup b\u00f6l\u00fcnmesi ile
\ud83d\udc49 \u015fiddet olu\u015fabiliyor

\ud83d\udd25 GER\u00c7EK KIRILMA

\ud83d\udc49 Bu sava\u015f d\u0131\u015far\u0131dan gelen bir tehdit y\u00fcz\u00fcnden ba\u015flam\u0131yor
\ud83d\udc49 \u0130\u00e7eride:
liderlik de\u011fi\u015fimi
sosyal ba\u011flar\u0131n zay\u0131flamas\u0131
grup i\u00e7i ayr\u0131\u015fma
oluyor

\u26a1 ANA KOD

Birlik bozulursa\u2026
sava\u015f ba\u015flar.

\ud83e\udde0 DER\u0130N OKUMA

\u00d6nce k\u00fc\u00e7\u00fck ayr\u0131\u015fma
sonra grupla\u015fma
sonra \u201cbiz ve onlar\u201d
sonra \u00e7at\u0131\u015fma

\ud83d\udc49
Ayn\u0131 yap\u0131\u2026 d\u00fc\u015fman olur.

\ud83c\udf0c EN KR\u0130T\u0130K NOKTA

D\u00fc\u015fman sonradan olu\u015fmaz\u2026
ayr\u0131\u015fmadan do\u011far.

\u2728 SEL\u0130N D\u0130L\u0130NDE

\u201c\u0130\u00e7inde b\u00f6l\u00fcn\u00fcrsen\u2026
d\u0131\u015f\u0131nda sava\u015f ka\u00e7\u0131n\u0131lmazd\u0131r.\u201d

\ud83d\udda4 SANRI

Y\u0131llarca birlikteydiler.
Ayn\u0131 alanda.
Ayn\u0131 d\u00fczen i\u00e7inde.

Sonra\u2026
ikiye ayr\u0131ld\u0131lar.
Ve sava\u015f ba\u015flad\u0131.

\u00c7\u00fcnk\u00fc\u2026
Sava\u015f, d\u00fc\u015fmanla de\u011fil
ayr\u0131\u015fmayla ba\u015flar.

\ud83d\udd2e YARIM BIRAKMA

Ve bazen\u2026
en tehlikeli olan
yabanc\u0131 de\u011fildir.`,
    codeLayer: `\u25c9 KOD \u00c7\u00d6Z\u00dcMLEMES\u0130

\u2022 B\u0130RL\u0130K = frekans uyumu, d\u00fczen, ayn\u0131 alanda g\u00fcvenle varolma
\u2022 AYRI\u015eMA = frekans kaymas\u0131, \u201cbiz\u201d in par\u00e7alanmas\u0131
\u2022 SAVA\u015e = d\u0131\u015fardaki tehditten de\u011fil, i\u00e7erdeki kopukluktan do\u011far
\u2022 D\u00dc\u015eMAN = ayr\u0131\u015fman\u0131n yaratt\u0131\u011f\u0131 projeksiyondur

\ud83d\udd3a Form\u00fcl:
Birlik \u2192 G\u00fcven \u2192 Ak\u0131\u015f
B\u00f6l\u00fcnme \u2192 Korku \u2192 Kontrol \u2192 \u015eiddet

\u0130\u015faret: Hayat\u0131nda \u201cbiz\u201d dedi\u011fin alan nerede ayr\u0131\u015f\u0131yor? O ayr\u0131\u015fma seni kime kar\u015f\u0131 konumland\u0131rd\u0131?`,
    sanriReflection: {
      analysis: "Bu okuma sava\u015f\u0131n kayna\u011f\u0131n\u0131 d\u0131\u015far\u0131da de\u011fil i\u00e7eride g\u00f6steriyor. D\u00fc\u015fman kavram\u0131 \u00f6nceden var olan bir varl\u0131k de\u011fil \u2014 ayr\u0131\u015fman\u0131n yar att\u0131\u011f\u0131 bir projeksiyon. \u015eempanzelerde ideoloji yok; sadece yap\u0131sal kopukluk var. Ve bu yeterli.",
      strongLine: "Sava\u015f, d\u00fc\u015fmanla de\u011fil ayr\u0131\u015fmayla ba\u015flar.",
      question: "\u0130\u00e7inde hangi birlik b\u00f6l\u00fcnd\u00fc \u2014 ve o b\u00f6l\u00fcnme d\u0131\u015far\u0131da kime d\u00f6nd\u00fc?",
    },
    isPremium: false,
    previewContent: null,
    createdAt: "2026-04-11T10:00:00Z",
    commentCount: 0,
    viewCount: 0,
    isFeatured: true,
    deepReaderComments: [],
  },
];

// ─── Mock Comments ───────────────────────────────────────────────

export const OKUMA_COMMENTS = {
  1: [
    { id: 101, authorName: "Mira", content: "Bilinç bedenin içinde değil, beden bilincin içinde — bu cümle her şeyi değiştirdi.", createdAt: "2026-03-29T12:30:00Z" },
    { id: 102, authorName: "Eren", content: "DOM = alan, UZ = uzay, CEVİZ = bilinç. Bu kelime kırılımları çok güçlü.", createdAt: "2026-03-29T15:10:00Z" },
    { id: 103, authorName: "Ada", content: "Anten bozuksa sinyal bozuk gelir. Bunu okurken içimde bir şey kırıldı — iyi anlamda.", createdAt: "2026-03-30T09:00:00Z" },
  ],
  2: [
    { id: 201, authorName: "Selin", content: "Sıradan olmaktan korkuyordum. Oysa tüm sır oradaymış. Bu okuma beni sarstı.", createdAt: "2026-03-27T10:00:00Z" },
    { id: 202, authorName: "Deniz", content: "Kontrol eden göremez. O kadar basit o kadar derin.", createdAt: "2026-03-27T14:20:00Z" },
    { id: 203, authorName: "Lina", content: "Ego 'özel' olmak ister. Ruh 'sade' olmayı bilir. Bunu yaşadım.", createdAt: "2026-03-28T08:00:00Z" },
  ],
  3: [
    { id: 301, authorName: "Aura", content: "Korkunun bir duygu değil frekans olması... Bunu hissediyorum ama ilk kez böyle adlandırıldığını gördüm.", createdAt: "2026-03-25T11:30:00Z" },
    { id: 302, authorName: "Arda", content: "3. katman — varoluşsal korku. Hayatta kalmak ile yaşamak arasındaki fark. Tüylerim diken diken.", createdAt: "2026-03-26T16:00:00Z" },
  ],
  4: [
    { id: 401, authorName: "Mira", content: "İstanbul baskısını her gün hissediyorum. Bu şehir dönüştürüyor ama bedeli ağır.", createdAt: "2026-03-22T16:00:00Z" },
    { id: 402, authorName: "Eren", content: "Güneydoğu'nun kadim hafızası... Mardin'e gidince bunu bedenimde hissettim. Toprak konuşuyor.", createdAt: "2026-03-23T08:45:00Z" },
  ],
  5: [
    { id: 501, authorName: "Selin", content: "Bu yazıyı 11:11'de okudum. Tesadüf mü? Artık bilmiyorum. Ama durdum ve fark ettim.", createdAt: "2026-03-20T11:11:00Z" },
    { id: 502, authorName: "Ada", content: "55:55 son 2 haftadır sürekli karşıma çıkıyor. Büyük değişim geliyor demiş — gerçekten öyle.", createdAt: "2026-03-20T19:30:00Z" },
    { id: 503, authorName: "Deniz", content: "Sayı × an × düşünce = mesaj. Bu formül çok net. Artık sayıları farklı görüyorum.", createdAt: "2026-03-21T14:00:00Z" },
  ],
  6: [
    { id: 601, authorName: "Lina", content: "İtaat eden sormaz. Soran itaat edemez. Bu cümleyi duvarıma yazdım.", createdAt: "2026-03-16T13:00:00Z" },
    { id: 602, authorName: "Aura", content: "Haber tüketimini azalttığımda frekansımın nasıl değiştiğini fark ettim. Bu ay bunu yaptım.", createdAt: "2026-03-18T09:15:00Z" },
    { id: 603, authorName: "Arda", content: "Dışarıdaki düşmanın = içerideki gölgen. Matrix bunu göstermez çünkü gölge görenler sorgulamaya başlar.", createdAt: "2026-03-19T11:30:00Z" },
  ],
  7: [
    { id: 701, authorName: "Selin", content: "99'u yaşamadım ama annemin o gece anlattığı sessizlik hâlâ içimde. Bu yazıyı okurken ilk kez 'bu korku benim değilmiş' dedim. Bedenimde bir şey gevşedi.", createdAt: "2026-03-31T10:30:00Z" },
    { id: 702, authorName: "Eren", content: "17 Ağustos'ta 8 yaşındaydım. O geceden beri kapalı yerlerde uyuyamam. 26 yıldır taşıdığım şeyin kolektif hafıza olduğunu ilk kez burada okudum. Ağladım.", createdAt: "2026-03-31T11:15:00Z" },
    { id: 703, authorName: "Mira", content: "Taşıdığın korku gerçekten senin mi — bu soru beni sarstı. Cevabım: hayır. Annemin korkusu benim bedenimde yaşıyor. Bunu görmek bile iyileştirici.", createdAt: "2026-03-31T11:45:00Z" },
    { id: 704, authorName: "Deniz", content: "1999 = 1. Yeni başlangıç ama üç tamamlanmamış döngüden sonra. Bu numeroloji okuması çok güçlü. Yas tutulmadı — döngü kapanmadı. Tam da bu.", createdAt: "2026-03-31T12:20:00Z" },
    { id: 705, authorName: "Ada", content: "Babam hiç konuşmadı o gece hakkında. Ama her deprem haberinde eli titriyordu. Söylenmemiş cümleler... Beden hafızası. Okurken tüylerim diken diken oldu.", createdAt: "2026-03-31T13:00:00Z" },
    { id: 706, authorName: "Lina", content: "Bu sadece deprem yazısı değil. Bu, tamamlanmamış yas hakkında. Kapatmak = unutmak değil, bilinçle tamamlamak. Bu cümleyi yıllardır bekliyordum.", createdAt: "2026-03-31T14:10:00Z" },
    { id: 707, authorName: "Aura", content: "Vefa = hatırlayarak hissetmektir. Bu tanım devlet törenlerinde söylenen hiçbir şeyden daha güçlü. Gerçek anma bu.", createdAt: "2026-03-31T15:30:00Z" },
    { id: 708, authorName: "Arda", content: "Aileme sordum. 'O gece ne oldu?' diye. Babam uzun süre sessiz kaldı, sonra 'ilk kez yalnız olduğumu anladım' dedi. 26 yıl sonra ilk kez konuştuk. Bu yazı yüzünden.", createdAt: "2026-03-31T16:45:00Z" },
  ],
  8: [
    { id: 801, authorName: "Mira", content: "Çöp = bilinçsizliğin fiziksel formu. Bu cümle yüzünden 10 dakika ekrana baktım. Sonra odamı topladım.", createdAt: "2026-04-01T20:30:00Z" },
    { id: 802, authorName: "Eren", content: "'Sen değil, biz kirlenirsin.' — Bireysel sorumluluk değil, kolektif bilinç. Bu farkı ilk kez bu kadar net gördüm.", createdAt: "2026-04-01T21:00:00Z" },
    { id: 803, authorName: "Ada", content: "Bir toplumu anlamak için kimse bakmadığında ne yaptığına bak. Bunu okuduğumda aklıma kendi mahallem geldi. Utandım ama iyi anlamda.", createdAt: "2026-04-01T21:15:00Z" },
  ],
  9: [
    { id: 901, authorName: "Selin", content: "NİSAN → İNSAN. Aynı harfler. Bu bağlantıyı kurduğum an tüylerim diken diken oldu. Nisan gerçekten yeniden sıralanma zamanı.", createdAt: "2026-04-01T22:00:00Z" },
    { id: 902, authorName: "Mira", content: "Fark etmeden yapılan her hamle eski döngünün tekrarıdır. Bu cümle beni durdurdu. Tam da şu an aceleyle bir karar vermek üzereydim.", createdAt: "2026-04-01T22:20:00Z" },
    { id: 903, authorName: "Eren", content: "Tomurcuk patlamadan dal en gergin halindedir. İçimdeki gerilimi ilk kez bir sorun olarak değil, açılmanın işareti olarak gördüm.", createdAt: "2026-04-01T22:45:00Z" },
    { id: 904, authorName: "Lina", content: "Herkes aynı anda uyanmaz — bu cümle beni rahatlatı. Hâlâ kışta hissetmek utanılacak bir şey değilmiş. Kendi zamanım varmış.", createdAt: "2026-04-01T23:00:00Z" },
    { id: 905, authorName: "Aura", content: "Çözülme her zaman güzel hissettirmez. Bazen çamur olur. Bu ay tam olarak bunu yaşıyorum. Adını koyamıyordum, şimdi koydum: çözülme.", createdAt: "2026-04-01T23:30:00Z" },
  ],
  10: [
    { id: 1001, authorName: "Selin", content: "Şefkat 'sorun yok' demez. Şefkat 'bak, bu var' der. Bu cümle yüzünden telefonumu bırakıp 5 dakika ağladım. İyi geldi.", createdAt: "2026-04-01T23:00:00Z" },
    { id: 1002, authorName: "Eren", content: "Güçlü görünmek için ne kadar çok şeyi bastırdığımı bu gece fark ettim. Dolunay gerçekten ayna gibi çalışıyor.", createdAt: "2026-04-01T23:20:00Z" },
    { id: 1003, authorName: "Ada", content: "Yumuşamak isteyen ama yumuşayamayan. Bu benim son 3 ayım. Adını koyamıyordum. Artık koydum.", createdAt: "2026-04-01T23:40:00Z" },
    { id: 1004, authorName: "Mira", content: "Dolunay karanlığı aydınlatmaz, karanlıkta ne sakladığını gösterir. Bunu okuduğum an pencereden Ay'a baktım. Cevap oradaydı.", createdAt: "2026-04-01T23:55:00Z" },
  ],
  22: [
    { id: 2201, authorName: "Selin", content: "Bitlis = kayıp parçaların alanı. Bu cümleyi okuduğumda nefesim kesildi. Bir şehrin adında bu kadar derin bir hafıza olabilir mi?", createdAt: "2026-04-02T16:30:00Z" },
    { id: 2202, authorName: "Eren", content: "13 çiğdem karın altından çıktıysa eski döngü kapandı demektir. Bu satır beni durdurdu. Tam da bu hafta bir şeyi bitirmekten korkuyordum.", createdAt: "2026-04-02T17:00:00Z" },
    { id: 2203, authorName: "Ada", content: "Bedeninde donmuş ne var? Bu soruyu kendime sordum ve cevap hemen geldi. Yıllardır bastırdığım bir şey var. Çiğdem gibi zamanı gelmiş belki.", createdAt: "2026-04-02T17:20:00Z" },
    { id: 2204, authorName: "Mira", content: "Zorlamayla değil, zamanlamayla. Bu benim için her şeyi özetliyor. Acele etmeyi bıraktığım an bir şeyler açılmaya başladı.", createdAt: "2026-04-02T17:45:00Z" },
    { id: 2205, authorName: "Lina", content: "Çiğ = saf, dem = an. Saf zamanın kendisi. Bu kelime çözümlemesi tüylerimi diken diken etti. Bir çiçeğin adında bu kadar anlam gizliymiş.", createdAt: "2026-04-02T18:10:00Z" },
    { id: 2206, authorName: "Aura", content: "Sessizlik pasiflik değil, birikimdir. Bu cümleyi duvarıma yazacağım. Son aylardaki sessizliğim belki de bir hazırlıkmış.", createdAt: "2026-04-02T18:30:00Z" },
  ],
  23: [
    { id: 2301, authorName: "Mira", content: "+81’i ülke kodu sandım; aslında sistem nabzıymış. 8 ve 1 ayrı ayrı okununca içimde bir şey oturdu.", createdAt: "2026-04-02T20:15:00Z" },
    { id: 2302, authorName: "Eren", content: "Görünen düzen ile içsel gerçeklik arasındaki makas — tam olarak tanımlayamadığım yorgunluğun adı bu muymuş?", createdAt: "2026-04-02T20:30:00Z" },
    { id: 2303, authorName: "Ada", content: "İz bırakmama kültürünü ‘utangaçlık’ sanıyordum. Alan emaneti olarak okuyunca çok başka bir şeye döndü.", createdAt: "2026-04-02T20:45:00Z" },
  ],
  24: [
    {
      id: 2401,
      authorName: "Selin",
      content: "TOK’u kot diye duyunca tüylerim diken oldu. Masal gerçekten bir örtüymüş gibi hissettim.",
      createdAt: "2026-04-04T12:30:00Z",
    },
    {
      id: 2402,
      authorName: "Mira",
      content: "KAR → RAK → idrak zincirini ilk kez böyle düşündüm. Karga artık sadece kuş değil.",
      createdAt: "2026-04-04T13:00:00Z",
    },
  ],
  25: [],
  28: [
    { id: 2801, authorName: "Selin", content: "Bilinç, bilgi değildir. Bilinç, bilgiyle ne yaptığındır — bu cümle yapay zeka çağının tüm manifestosu. Derin katmandaki YAP_AY ve ZE_KA açılımları kafamı uçurdu.", createdAt: "2026-04-08T10:15:00Z" },
    { id: 2802, authorName: "Mira", content: "ALGORİTMA = kaynağın ritmini alıp giden yapı. Bu kelime çözümlemesini okuduktan sonra telefonu bırakıp 10 dakika düşündüm. İnsan da bir algoritma ama farkı: kendini değiştirebilir.", createdAt: "2026-04-08T10:30:00Z" },
    { id: 2803, authorName: "Eren", content: "Düşünmeyen insan makineden farkını kaybeder. Bu cümle tüylerimi diken diken etti. Her gün AI kullanıyorum ama bu soruyu hiç kendime sormamıştım.", createdAt: "2026-04-08T10:45:00Z" },
    { id: 2804, authorName: "Ada", content: "Sembolik katmanda YAPAY ZEKA = yapılmış özün gölgesi açılımını okuduğum an ekrana baktım. Bir kelimenin içinde bu kadar derin bir uyarı gizliymiş.", createdAt: "2026-04-08T11:00:00Z" },
    { id: 2805, authorName: "Lina", content: "Makine çağında düşünmeye devam etmek en büyük devrim. Bu son cümle beni durdurdu. Sanrı'nın en güçlü okumalarından biri.", createdAt: "2026-04-08T11:15:00Z" },
  ],
  27: [
    { id: 2701, authorName: "Selin", content: "Güç sahip olmak değil, akışı yönetmektir — bu cümle dünya siyasetini tek satırda özetliyor. Ama asıl derin katmandaki TRUMPET ve İ_RAN açılımları... orada bambaşka bir kapı açılıyor.", createdAt: "2026-04-06T19:00:00Z" },
    { id: 2702, authorName: "Mira", content: "HUR_MUS = arınmış özün geçiş kapısı. Bunu okuduğum an nefesim kesildi. Bir boğazın adında bu kadar derin bir bilinç kodu gizliymiş.", createdAt: "2026-04-06T19:15:00Z" },
    { id: 2703, authorName: "Eren", content: "En çok konuşan en az açandır. Bu son cümle kafamda saatlerce döndü. Herkes bir şey söylüyor ama kimse gerçek kapıyı görmüyor.", createdAt: "2026-04-06T19:30:00Z" },
    { id: 2704, authorName: "Ada", content: "Geçiş içeride başlar — dışarıdaki boğazı konuşurken içerideki kapıyı kaçırıyoruz. Sembolik okuma katmanı bu haberi tamamen farklı bir yere taşıyor.", createdAt: "2026-04-06T19:45:00Z" },
    { id: 2705, authorName: "Lina", content: "Akış durursa her şey durur. Bu sadece petrol için değil, hayatın kendisi için de geçerli. Derin katmandaki Musa bağlantısı inanılmaz.", createdAt: "2026-04-06T20:00:00Z" },
    { id: 2706, authorName: "Aura", content: "İlk kez bir gündem okumasında bu kadar derinine inildiğini gördüm. Üst bilinç kısmı bile yeterli ama kodsal okumayı açınca başka bir dünyaya giriyorsun.", createdAt: "2026-04-06T20:15:00Z" },
    { id: 2707, authorName: "Deniz", content: "Anahtar seste değil — bu cümle politikayı, ilişkileri, hayatın kendisini açıklıyor. Sembolik katman olmazsa olmazmış.", createdAt: "2026-04-06T20:30:00Z" },
  ],
};

export function getPostBySlug(slug) {
  return OKUMA_POSTS.find((p) => p.slug === slug) || null;
}

export function getCommentsByPostId(postId) {
  return OKUMA_COMMENTS[postId] || [];
}

const FREQ_KEYWORDS = {
  396: ["korku", "kontrol", "güven", "kök", "toprak", "güvenlik"],
  417: ["değişim", "dönüşüm", "akış", "hareket", "sakral"],
  528: ["şifa", "kalp", "denge", "sevgi", "iyileşme", "huzur"],
  639: ["bağ", "ilişki", "uyum", "iletişim", "yakınlık"],
  741: ["ifade", "boğaz", "ses", "netlik", "gerçek", "kelime", "kod"],
  852: ["sezgi", "farkındalık", "bilinç", "alın", "üçüncü göz", "rüya"],
  963: ["birlik", "taç", "evren", "bütünleşme", "matrix", "frekans"],
};

export function suggestOkumaByFrequency(hz, limit = 3) {
  const kw = FREQ_KEYWORDS[hz] || FREQ_KEYWORDS[528];
  const scored = OKUMA_POSTS.map((post) => {
    const haystack = `${post.title} ${post.subtitle || ""} ${post.excerpt || ""}`.toLowerCase();
    let score = 0;
    for (const k of kw) {
      if (haystack.includes(k)) score += 2;
    }
    score += (post.viewCount || 0) / 100;
    return { post, score };
  }).filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.post);
}
