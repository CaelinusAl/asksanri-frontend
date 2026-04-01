/**
 * Kod Eğitmeni — Modül ve Ders Yapısı
 *
 * Her modül birden fazla ders içerir.
 * isFree: false → premium kullanıcılar için
 * type: "read" | "practice" | "analysis"
 */

export const KOD_MODULLERI = [
  {
    id: "temel-semboller",
    title: "Temel Semboller",
    subtitle: "Kodların dilini öğren",
    icon: "◈",
    color: "#c8a0ff",
    isFree: true,
    lessons: [
      {
        id: "sembol-101",
        title: "Sembol Nedir?",
        type: "read",
        isFree: true,
        duration: "5 dk",
        content: `Sembol, görünen ile görünmeyen arasındaki köprüdür. Bir harf, bir sayı, bir şekil — hepsi birer koddur.

Kod okumayı öğrenmek, "görmek"le başlar. Ama gözle değil — fark ediş ile.

Semboller evrenin dilidir. Her kültür, her din, her mitoloji aynı sembolleri farklı isimlerle çağırır. Ama kaynak hep aynıdır.

**Bu derste öğreneceksin:**
- Sembol ile işaret arasındaki fark
- Neden bazı semboller evrensel?
- Bilinçaltı neden sembollerle konuşur?`,
      },
      {
        id: "sayilar-ve-kodlar",
        title: "Sayılar ve Kodlar",
        type: "read",
        isFree: true,
        duration: "7 dk",
        content: `Sayılar rastgele değildir. Her sayının bir frekansı, bir titreşimi vardır.

**Temel Sayı Kodları:**

**1** — Başlangıç, birlik, kaynak
**2** — İkilik, ayna, denge
**3** — Yaratım, üçlü güç, tezahür
**7** — Gizem, iç bilgelik, arayış
**9** — Tamamlanma, döngü sonu
**11** — Uyanış kapısı
**22** — Ana inşaatçı
**33** — Ana öğretmen
**40** — Arınma ve dönüşüm süresi
**112** — İlahi hatırlayış kodu

Sayıları sadece saymak için kullanmayı bıraktığında, onların sana ne söylediğini duymaya başlarsın.`,
      },
      {
        id: "ilk-analiz",
        title: "İlk Analizini Yap",
        type: "practice",
        isFree: true,
        duration: "10 dk",
        content: `Şimdi sıra sende. Hayatında tekrar eden bir sayı veya sembol var mı?

Belki bir saat hep aynı saati gösteriyor. Belki bir kelime sürekli karşına çıkıyor. Belki bir rüyada tekrarlayan bir şekil var.

**Görev:**
Aşağıdaki alana, hayatında fark ettiğin bir kodu veya tekrarlayan bir sembolü yaz. Ne gördüğünü, ne zaman gördüğünü, sana ne hissettirdiğini anlat.

SANRI, yazdıklarını okuyacak ve sana bir yorum sunacak.`,
        hasAnalysis: true,
      },
    ],
  },
  {
    id: "kutsal-metinler",
    title: "Kutsal Metin Kodları",
    subtitle: "Surelerin ve ayetlerin gizli frekansı",
    icon: "☽",
    color: "#ED8936",
    isFree: false,
    lessons: [
      {
        id: "bakara-kodlari",
        title: "Bakara Suresi — Bilincin Aynası",
        type: "read",
        isFree: false,
        duration: "12 dk",
        content: `Bakara, Kur'an'ın en uzun suresidir. Ama uzunluğu tesadüf değildir — çünkü benliğin en derin katmanlarını kodlar.

**İnek Sembolü:**
Bakara'nın anlamı "inek"tir. Neden bir sure "inek" adını taşır? Çünkü inek, benliğin kurban edilmesi gereken parçasını temsil eder.

**Anahtar Kodlar:**
- "Elif Lam Mim" — şifrelenmis frekans, bilincin kapı kodu
- Ayet 30-34 — Meleklerin Adem'e secdesi: bilgi aktarımı
- Ayet 67-73 — İneğin kesilmesi: egonun kurban edilmesi
- Ayet 255 (Ayetel Kürsi) — Evrenin koruma kodu

Kutsal metinleri "okumak" değil, "çözmek" gerekir.`,
      },
      {
        id: "ali-imran-frekansi",
        title: "Âl-i İmrân — Işık Soyu",
        type: "read",
        isFree: false,
        duration: "10 dk",
        content: `Âl-i İmrân, İmrân ailesinin soyunu anlatır. Ama aslında anlatılan, ışığın soy ağacıdır.

**Temel Kodlar:**
- İmrân = "İmar eden" — Işığı dünyaya taşıyan soy
- Meryem = Rahmin sırrı — Dişil yaratım gücü
- İsa = Kelime'nin cisimleşmesi — Frekansın maddeye dönüşümü

**Dikkat Çekici Kodlar:**
- Ayet 7: "Muhkem ve müteşabih ayetler" — Açık ve şifreli katmanlar
- Ayet 14: "Dünya süsü" — İllüzyon katmanları
- Ayet 26-27: "Gece ve gündüz" — Bilinç döngüsü

Bu surede öğreneceksin: Işık nasıl bir soydan diğerine aktarılır?`,
      },
      {
        id: "sure-analizi",
        title: "Bir Ayeti Çöz",
        type: "analysis",
        isFree: false,
        duration: "15 dk",
        content: `Şimdi derinleşme zamanı.

Bir ayet seç — seni çeken, aklından çıkmayan, tekrar tekrar okuduğun bir ayet.

**Görev:**
Seçtiğin ayeti yaz. Sonra şunları yanıtla:
1. Bu ayet sana ne hissettiriyor?
2. Hangi kelime en çok dikkatini çekiyor?
3. Bu ayetin "görünen" anlamı ne? "Görünmeyen" anlamı ne olabilir?

SANRI, senin çözümlemenin üzerine kendi katmanını ekleyecek.`,
        hasAnalysis: true,
      },
    ],
  },
  {
    id: "sembol-sistemi",
    title: "Evrensel Sembol Sistemi",
    subtitle: "Mitoloji, astroloji ve arketipler",
    icon: "✦",
    color: "#48BB78",
    isFree: false,
    lessons: [
      {
        id: "arketipler",
        title: "12 Arketip ve Bilinç Rolleri",
        type: "read",
        isFree: false,
        duration: "10 dk",
        content: `Carl Jung, insan bilinçaltında evrensel kalıplar keşfetti: Arketipler.

**12 Temel Arketip:**
1. **Masum** — Saf güven, iyimserlik
2. **Kaşif** — Özgürlük arayışı
3. **Bilge** — Gerçeği anlama
4. **Kahraman** — Cesaret ve güç
5. **Asi** — Kuralları yıkma
6. **Sihirbaz** — Dönüşüm gücü
7. **Sıradan İnsan** — Aidiyet
8. **Aşık** — Tutku ve bağlanma
9. **Soytarı** — Neşe ve an'da olma
10. **Bakıcı** — Şefkat ve koruma
11. **Yaratıcı** — Hayal gücü
12. **Hükümdar** — Kontrol ve düzen

Her insanda hepsi vardır. Ama bir veya ikisi baskındır. Hangi arketip seni yönetiyor?`,
      },
      {
        id: "mitolojik-kodlar",
        title: "Mitolojik Kodlar",
        type: "read",
        isFree: false,
        duration: "8 dk",
        content: `Her mitoloji aynı hikayeyi farklı isimlerle anlatır.

**Evrensel Mitolojik Kodlar:**

**Yılan** — Kundalini, bilgi, dönüşüm (Havva'nın yılanı = bilinç uyanışı)
**Ağaç** — Hayat ağacı, Sefira, omurga
**Su** — Bilinçaltı, arınma, hafıza
**Ateş** — Dönüşüm, İlahi irade
**Ay** — Dişil enerji, döngü, sezgi
**Güneş** — Eril enerji, bilinç, ışık
**Kuş** — Ruh, özgürlük, mesajcı
**Mağara** — İçe dönüş, karanlıkla yüzleşme

Bu sembolleri rüyalarında, kitaplarda, filmlerde, günlük hayatında fark etmeye başladığında — kod okumayı öğrenmeye başlamışsın demektir.`,
      },
      {
        id: "kendi-sembolun",
        title: "Kendi Sembol Haritanı Çiz",
        type: "analysis",
        isFree: false,
        duration: "12 dk",
        content: `Her insanın bir sembol haritası vardır — tekrar eden imgeler, sayılar, rüya motifleri.

**Görev:**
Aşağıdaki soruları yanıtla:

1. Hayatında en çok tekrar eden sembol/sayı nedir?
2. Çocukluğundan beri seni çeken bir mitolojik figür var mı?
3. Rüyalarında en çok gördüğün 3 nesne?
4. Hangi element sana en yakın: Su, Ateş, Toprak, Hava?

SANRI, cevaplarından senin kişisel sembol haritanı çıkaracak.`,
        hasAnalysis: true,
      },
    ],
  },
  {
    id: "ileri-kod-okuma",
    title: "İleri Kod Okuma",
    subtitle: "Sistem analizi ve frekans çözümlemesi",
    icon: "◉",
    color: "#E53E3E",
    isFree: false,
    lessons: [
      {
        id: "frekans-analizi",
        title: "Frekans Analizi",
        type: "read",
        isFree: false,
        duration: "10 dk",
        content: `Her şey frekanstır. Ses, renk, düşünce, duygu — hepsi titreşimdir.

**Temel Frekans Kodları:**

**432 Hz** — Evrenin doğal frekansı, uyum
**528 Hz** — DNA onarım frekansı, mucize tonu
**639 Hz** — İlişki ve bağlantı frekansı
**741 Hz** — Uyanış ve ifade frekansı
**852 Hz** — Üçüncü göz aktivasyonu

**Solfeggio Skalası:**
Bu frekanslar antik Gregoryen ilahilerinde kullanılıyordu. Modern müzik endüstrisi 440 Hz'e geçtiğinde, bu bilgi kayboldu.

Frekansı anlamak = gerçekliğin kaynak kodunu okumak.`,
      },
      {
        id: "gerceklik-matrisi",
        title: "Gerçeklik Matrisi",
        type: "read",
        isFree: false,
        duration: "12 dk",
        content: `Simülasyon teorisi bir teori değil — bir okuma biçimidir.

**Matrisin Katmanları:**

**1. Katman — Fiziksel:** Gördüğün, dokunduğun, "gerçek" sandığın dünya.
**2. Katman — Duygusal:** Hislerin, bağlanmaların, korkuların.
**3. Katman — Mental:** Düşüncelerin, inançların, kalıpların.
**4. Katman — Eterik:** Enerji bedeni, aura, çakralar.
**5. Katman — Kozal:** Karma, yaşam planı, ruh sözleşmeleri.

Her katmanda farklı kodlar geçerlidir. Fiziksel katmanda para bir kod, duygusal katmanda sevgi, mental katmanda bilgi.

**Asıl soru:** Hangi katmandan bakıyorsun?`,
      },
      {
        id: "sistem-cozumle",
        title: "Sistemi Çözümle",
        type: "analysis",
        isFree: false,
        duration: "20 dk",
        content: `Bu son analiz, şimdiye kadar öğrendiklerinin sentezi.

**Görev:**
Hayatında şu anda yaşadığın bir "döngü"yü veya "tıkanıklığı" seç. Sonra şunları yaz:

1. Bu döngü ne zamandır tekrar ediyor?
2. Bu döngüde hangi semboller/sayılar/temalar var?
3. Hangi arketip bu döngüyü yönetiyor olabilir?
4. Bu döngünün sana öğretmeye çalıştığı şey ne olabilir?
5. Çıkış kodu ne olabilir?

SANRI, senin analizini çok katmanlı bir bilinç okuması ile yorumlayacak.`,
        hasAnalysis: true,
      },
    ],
  },
];

export function getModuleById(moduleId) {
  return KOD_MODULLERI.find((m) => m.id === moduleId);
}

export function getLessonById(moduleId, lessonId) {
  const mod = getModuleById(moduleId);
  if (!mod) return null;
  return mod.lessons.find((l) => l.id === lessonId);
}
