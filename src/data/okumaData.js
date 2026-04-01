// ─── Okuma Alanı — Data Model & Mock Content ─────────────────────

export const OKUMA_CATEGORIES = [
  { id: "matrix_okumasi", label: { tr: "Matrix Okuması", en: "Matrix Reading" }, color: "#c8a0ff" },
  { id: "gundem_kodu", label: { tr: "Gündem Kodu", en: "Agenda Code" }, color: "#ff9a6c" },
  { id: "sembol_okumasi", label: { tr: "Sembol Okuması", en: "Symbol Reading" }, color: "#6cf5c2" },
  { id: "sehir_ulke_kodu", label: { tr: "Şehir / Ülke Kodu", en: "City / Country Code" }, color: "#6cc8ff" },
  { id: "hologram_post", label: { tr: "Hologram Post", en: "Hologram Post" }, color: "#ff6482" },
  { id: "derin_ifsa", label: { tr: "Derin İfşa", en: "Deep Disclosure" }, color: "#ffd76c" },
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
    viewCount: 187,
    isFeatured: true,
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
};

export function getPostBySlug(slug) {
  return OKUMA_POSTS.find((p) => p.slug === slug) || null;
}

export function getCommentsByPostId(postId) {
  return OKUMA_COMMENTS[postId] || [];
}
