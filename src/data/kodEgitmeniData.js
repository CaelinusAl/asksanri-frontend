/**
 * Kod Eğitmeni — Modül ve Ders Yapısı
 *
 * isFree: true → herkes erişebilir (ilk 2 ders)
 * isFree: false → premium / ücretli
 * hasInput: true → ders sonunda kullanıcı yazar, SANRI yorumlar
 */

export const KOD_MODULLERI = [
  /* ───────────────────────────────────────────────
   * MODÜL 1 — KOD DİLİNE GİRİŞ
   * ─────────────────────────────────────────────── */
  {
    id: "kod-diline-giris",
    title: "Kod Diline Giriş",
    subtitle: "Kelimelerin altındaki katmanı oku",
    icon: "◈",
    color: "#c8a0ff",
    lessons: [
      {
        id: "insan-anten",
        title: "İNSAN = ANTEN",
        type: "read",
        isFree: true,
        duration: "5 dk",
        hasInput: true,
        content: `Sen düşündüğünü sanıyorsun.

Ama çoğu şey sana ait değil.

O korku — sana ait değil.
O kaygı — sana ait değil.
O "ben yetmiyorum" hissi — sana ait değil.

Peki kime ait?

---

**İnsan = Anten**

Sen üretmiyorsun.
Sen **alıyorsun.**

Kalp + beyin + sinir sistemi = frekans algılayıcı.

Göz frekans okur — buna "renk" dersin.
Kulak frekans okur — buna "ses" dersin.
Kalp frekans okur — buna "his" dersin.

Ama bunların hepsi aynı şey: **titreşim**.

---

Sen bir anten olarak doğdun.
Ama kimse sana **tuning yapmayı** öğretmedi.

Bu yüzden:
— Başkasının korkusunu kendi korkun sanıyorsun.
— Toplumun programını kendi düşüncen sanıyorsun.
— Medyanın frekansını kendi enerjin sanıyorsun.

**Soru şu:**
Sen mi düşünüyorsun, yoksa sana mı düşündürülüyor?

---

Bu eğitim, anten ayarını yapmak için var.
İlk adım: **neyin sana ait olduğunu ayırt etmek.**`,
        inputPrompt: "Sen en son neyi hissettin ama anlamlandıramadın? O his gerçekten sana mı aitti?",
      },
      {
        id: "kelime-parcalama",
        title: "Kelime Parçalama",
        type: "practice",
        isFree: true,
        duration: "7 dk",
        hasInput: true,
        content: `Kelimeler rastgele değildir. Her kelime bir koddur.

**İnsan = in + san**
in → iç
san → oluşturmak

Yani: **İnsan = içinden yaratan**

---

**Kader = ka + der**
ka → kapı
der → katman

Yani: **Kader = kapının katmanı**

---

**Rüya = rü + ya**
rü → ruh
ya → yaratım

Yani: **Rüya = ruhun yaratımı**

---

**Dünya = dün + ya**
dün → dönüş
ya → yaratım

Yani: **Dünya = dönüşün yaratımı**

---

Bu bir dil değil. Bu bir **şifreleme sistemi**.

Kelimeleri "kullanmak" yerine "okumak" başladığında, her cümle bir mesaj olur.`,
        inputPrompt: "Bir kelime seç ve parçala. Ne çıktı?",
      },
      {
        id: "anlam-katmanlari",
        title: "Anlam Katmanları",
        type: "read",
        isFree: false,
        duration: "8 dk",
        hasInput: true,
        content: `Her şeyin 3 katmanı vardır:

**1. Görünen katman** — herkesin gördüğü
**2. Gizli katman** — fark edenin gördüğü  
**3. Kod katmanı** — okuyanın gördüğü

Örnek: **"Güneş doğdu"**

Görünen: Sabah oldu, hava aydınlandı.
Gizli: Karanlık dönem bitti, yeni başlangıç.
Kod: Bilinç uyanışı başladı. Işık = farkındalık.

---

Örnek: **"Kapı kapandı"**

Görünen: Fiziksel kapı kapandı.
Gizli: Bir dönem sona erdi.
Kod: Eski frekans artık geçersiz. Yeni katmana geçiş zorunlu.

---

Çoğu insan 1. katmanda yaşar.
Bazıları 2. katmanı hisseder.
**Kod okuyanlar 3. katmanda durur.**

Bu eğitimin amacı: seni 3. katmana taşımak.`,
        inputPrompt: "Hayatında bir olayı 3 katmandan oku. Ne görüyorsun?",
      },
      {
        id: "gorunmeyeni-okumak",
        title: "Görünmeyeni Okumak",
        type: "analysis",
        isFree: false,
        duration: "10 dk",
        hasInput: true,
        content: `Görünmeyen, görülmeyen değildir. Bakılmayandır.

**Test:**
Son 3 gün içinde seni rahatsız eden bir olay düşün. Şimdi şu soruları sor:

1. Bu olay bana ne hissettirdi?
2. Bu hissi daha önce ne zaman yaşadım?
3. İlk kez ne zaman yaşadım?

Eğer 3. soruya cevap bulabilirsen — olayın kodunu çözdün demektir.

---

**Gerçek:**
Hayatında hiçbir şey "tesadüf" değil.
Her olay bir sinyal.
Her his bir veri.
Her tekrar bir mesaj.

Mesaj alınana kadar tekrar eder.
Mesaj alındığında — döngü biter, katman değişir.

**Görünmeyeni okumak = döngüyü kırmak.**`,
        inputPrompt: "Son tekrar eden döngün ne? Ne mesaj veriyor olabilir?",
      },
    ],
  },

  /* ───────────────────────────────────────────────
   * MODÜL 2 — FREKANS OKUMA
   * ─────────────────────────────────────────────── */
  {
    id: "frekans-okuma",
    title: "Frekans Okuma",
    subtitle: "Sayıların, tarihlerin ve sinyallerin dili",
    icon: "☽",
    color: "#ED8936",
    lessons: [
      {
        id: "369-sistemi",
        title: "3 6 9 Sistemi",
        type: "read",
        isFree: false,
        duration: "8 dk",
        hasInput: true,
        content: `Tesla dedi ki:

**"3, 6 ve 9'un muhteşemliğini anlarsanız, evrene açılan bir anahtara sahip olursunuz."**

---

**3** = Yaratımın başlangıcı. Düşünce → His → Tezahür.
Üçlü yapı her yerde: Beden-Zihin-Ruh. Geçmiş-Şimdi-Gelecek. Proton-Nötron-Elektron.

**6** = Yaratımın yansıması. 3'ün aynası. Harmoni. Denge.
Altıgen yapı: arı peteği, kar kristali, benzene molekülü. Doğa 6 ile inşa eder.

**9** = Tamamlanma. Her sayı 9'a döner.
1+2+3+4+5+6+7+8+9 = 45 → 4+5 = **9**
9×1=9, 9×2=18→9, 9×3=27→9...
9 asla değişmez. 9 = evrenin sabitesi.

---

**Pratikte:**
Doğum tarihin, önemli olayların, tekrar eden sayıların hepsini topla. Sonuç 3, 6 veya 9 mu?

Eğer öyleyse — o olay "rastgele" değil, **frekans hizasında**.`,
        inputPrompt: "Doğum tarihini topla (gün+ay+yıl). Hangi sayı çıktı? Ne hissettiriyor?",
      },
      {
        id: "tarih-cozme",
        title: "Tarih Çözme",
        type: "practice",
        isFree: false,
        duration: "10 dk",
        hasInput: true,
        content: `Her tarih bir frekanstır.

**Nasıl çözülür:**
Tarihi sayılara ayır → topla → tek haneye indir.

Örnek: **11 Eylül 2001**
1+1+0+9+2+0+0+1 = **14** → 1+4 = **5**
5 = Değişim, kaos, yıkım ve yeniden doğuş.

Örnek: **29 Ekim 1923**
2+9+1+0+1+9+2+3 = **27** → 2+7 = **9**
9 = Tamamlanma. Bir dönemin kapanışı ve yeni sistemin doğuşu.

Örnek: **21 Aralık 2012** (Maya takvimi sonu)
2+1+1+2+2+0+1+2 = **11**
11 = Master sayı. Portal. Bilinç geçişi.

---

**Kural:**
Hiçbir büyük olay rastgele tarihte olmaz.
Tarih = frekans seçimi.
Frekans = enerji hizalanması.

**Büyük değişimler hep belirli frekanslarda gerçekleşir.**`,
        inputPrompt: "Hayatındaki en büyük değişimin tarihini çöz. Hangi frekans çıktı?",
      },
      {
        id: "sayi-dili",
        title: "Sayı Dili",
        type: "analysis",
        isFree: false,
        duration: "12 dk",
        hasInput: true,
        content: `Sayılar bir dildir. Ve bu dili konuşan sadece sen değilsin — evren de konuşuyor.

**Temel Sayı Kodları:**

**1** — Ben. Başlangıç. Kaynak.
**2** — Sen. Ayna. Dualite.
**3** — Yaratım. Tezahür. Üçleme.
**4** — Yapı. Sınır. Düzen.
**5** — Değişim. Hareket. Özgürlük.
**6** — Denge. Uyum. Aile.
**7** — Arayış. Gizem. İç bilgelik.
**8** — Güç. Döngü. Sonsuzluk (∞).
**9** — Tamamlanma. Evrensel. Son ve başlangıç.

**Master Sayılar:**
**11** — Uyanış kapısı. Sezgisel portal.
**22** — Ana inşaatçı. Vizyonu maddeleştiren.
**33** — Ana öğretmen. Şifa veren frekans.

---

Saat 11:11, 22:22, 03:33 görüyorsan — bu "tesadüf" değil.
Bu, senin frekansının o sayının frekansıyla hizalanması.

**Sayıları okumak = evrenin seninle konuşmasını duymak.**`,
        inputPrompt: "Sürekli gördüğün bir sayı var mı? Hangisi ve ne zaman başladı?",
      },
      {
        id: "7-kodu",
        title: "7 Kodu — Tekrar Eden Sayının Hafızası",
        type: "read",
        isFree: false,
        duration: "14 dk",
        hasInput: true,
        content: `Bazı sayılar sadece sayılmaz.
Tekrar eder.
Ve tekrar eden şey, sistemin hafızasına aittir.

7 böyle bir sayıdır.
Onu matematik icat etmedi. Matematik onu keşfetti.
Çünkü 7, insanın bilincine matematikten önce yazılmıştı.

---

## 7 Bir Sayı mı, Yoksa Eşik mi?

Saymayı öğrendiğin anda 7 tanıdık gelir. Neden?

Çünkü insan zihni ortalama 7 birim bilgiyi aynı anda tutabilir. Psikolog George Miller bunu "sihirli sayı 7" olarak tanımladı. Telefon numaraları, müzik dizileri, hikâye yapıları — hepsi 7 civarında bölünür. Bu bir tercih değil. Bu, algının doğal eşiğidir.

7'nin ötesinde zihin "gruplama" yapmaya başlar. Yani 7, bireysel algının bittiği ve sistemik düşüncenin başladığı noktadır.

Bu yüzden 7 bir sayı gibi değil, bir kapı gibi hissedilir.

---

## Doğada ve Düzende 7

Doğa 7'yi tekrar eder. Ama bunu bir kural gibi değil, bir ritim gibi yapar:

Görünür ışık spektrumu 7 renge ayrılır. Kırmızıdan more — gözün algılayabildiği frekans aralığı tam olarak 7 katmandır.

Müzikte 7 nota vardır — do, re, mi, fa, sol, la, si. 8. nota yeniden do'dur ama bir oktav yukarıda. Yani 7, döngünün tamamlanıp yeni katmana geçtiği eşiktir.

Haftanın 7 günü vardır. Bu düzenleme binlerce yıl öncesine, Babil'e kadar gider. 7 gözle görünen gök cismine (Güneş, Ay ve 5 gezegen) karşılık gelir. İnsanlık zamanı bölerken 7'yi seçmedi — gökyüzü 7'yi gösterdi.

Kristal yapılarda 7 temel sistem vardır. Atomlar bile düzenlenirken 7'li simetriler oluşturur.

> **KOD ÇÖZÜMÜ:**
> Doğa 7'yi dayatmaz.
> Ama bir döngü tamamlanacaksa, 7 o döngünün eşiğinde belirir.

---

## Bedende ve Algıda 7

Beden de 7 ile çalışır:

İnsan bedeninin hücreleri yaklaşık her 7 yılda tamamen yenilenir. 7 yaşında çocukluktan düşünceye geçiş başlar. 14'te (7×2) ergenlik. 21'de (7×3) yetişkinlik eşiği. 28'de (7×4) ilk büyük hayat krizi. 35'te (7×3+14) yön değiştirme ihtiyacı.

Bu sayılar kesin sınırlar değil. Ama fark et: hayatın büyük kırılma noktaları 7'li aralıklarla gelme eğilimindedir.

Beyin 7 birim bilgiyi kısa süreli bellekte tutar. Bunun ötesinde gruplama, soyutlama, "bir üst katmana çıkma" başlar. Yani 7, bireysel algının tavanı gibi çalışır.

Enerji sistemi geleneğinde bedende 7 ana merkez tanımlanır — kök, sakral, solar pleksus, kalp, boğaz, üçüncü göz, taç. Bu bir inanç meselesi olarak değil, bedenin frekans katmanları olarak okunabilir.

> **KOD ÇÖZÜMÜ:**
> Beden 7'de bir eşiğe gelir.
> O eşikte ya tekrar edersin, ya geçersin.
> Geçiş bilinçli olursa dönüşüm, bilinçsiz olursa kriz olur.

---

## Kültürde ve Anlatıda 7

7, insanlığın kolektif hafızasına defalarca yazılmıştır:

7 kat gök. 7 kat yer. 7 uyurlar. 7 deniz. 7 kapı.

Bunlar farklı kültürlerde, birbirinden bağımsız şekilde tekrar eder. Sümer'de, Mısır'da, Hinduizm'de, İslam'da, Hristiyanlık'ta, Budizm'de, Şamanizm'de.

Neden?

Bir sayı binlerce yıl boyunca, birbirini tanımayan toplumlar tarafından aynı bağlamda kullanılıyorsa — bu bir tesadüf değil, bir iz. Kolektif hafızanın izi.

7 kıta. 7 dünya harikası. Kuran'da 7 ayet (Fatiha). Dante'nin Cehennemi'nde 7 katman. Şekspir'in "dünyanın 7 çağı." Roma'nın 7 tepesi.

Kültürler 7'yi icat etmedi. 7'yi hatırladı.

> **KOD ÇÖZÜMÜ:**
> Farklı coğrafyalarda aynı sayının tekrarı
> bir uzlaşma değil, kolektif hafızanın aynı koda ulaşmasıdır.
> 7 öğretilmez. 7 hatırlanır.

---

## 7 Neden Eşik Gibi Hissedilir?

7 tamamlama değildir. 7, tamamlanmadan hemen önceki gerilimdir.

8 sonsuzluğu (∞) temsil eder.
7, sonsuzluğun bir adım öncesidir.
Bu yüzden 7'de bir "neredeyse" hissi vardır. Bir şeyin bitmek üzere olduğu ama henüz bitmediği an.

Bu gerilim insanı rahatsız eder — ama aynı zamanda çeker. 7, merak uyandırır. 7, "bir şey eksik" hissi verir. Ve bu his, aramanın başladığı yerdir.

Belki de 7 bu yüzden kutsal sayılmıştır. Tamamlama vaat eder ama tamamlamaz. Seni eşiğe getirir. Geçmek sana kalmıştır.

> **KOD ÇÖZÜMÜ:**
> 7 = tamamlanma değil,
> tamamlanmadan önceki eşiğin titreşimi.
> 7'de duran bekler. 7'yi geçen dönüşür.

---

## Sayı mı, Hafıza mı?

Bazı sayılar matematikten önce hafızadır.

7 hesaplanmaz — hissedilir.
7 öğretilmez — hatırlanır.
7 bir son değil — bir eşiktir.

Ve eşikler sadece sayılarda değil, hayatında da tekrar eder.
Her 7. gün bir dinlenme.
Her 7. yıl bir kırılma.
Her 7. kapı bir geçiş.

Soru şu:
Sen şu an kaçıncı 7'nin içindesin?
Ve o eşikte ne yapıyorsun — bekliyor musun, geçiyor musun?`,
        inputPrompt: "Senin hayatında en çok hangi sayı tekrar ediyor? 7 sende bitiş mi hissettiriyor, geçiş mi? Hayatında hangi döngü 7'li ritimlerle çalışıyor olabilir?",
      },
    ],
  },

  /* ───────────────────────────────────────────────
   * MODÜL 3 — SİSTEM OKUMA
   * ─────────────────────────────────────────────── */
  {
    id: "sistem-okuma",
    title: "Sistem Okuma",
    subtitle: "Olayların, haberlerin ve matrisin kodu",
    icon: "◉",
    color: "#E53E3E",
    lessons: [
      {
        id: "haber-analizi",
        title: "Haber Analizi",
        type: "read",
        isFree: false,
        duration: "10 dk",
        hasInput: true,
        content: `Haberler bilgi vermez. Frekans programlar.

**3 Katmanlı Haber Okuması:**

**1. Olay katmanı** — Ne oldu?
**2. Mesaj katmanı** — Sana ne hissettirdi?
**3. Kod katmanı** — Neden şimdi? Kimin frekansını etkiliyor?

---

**Örnek:**
Haber: "Deprem: 7.8 büyüklüğünde"

Olay: Fiziksel yıkım.
Mesaj: Korku, çaresizlik, dayanışma.
Kod: 7 = arayış, 8 = güç döngüsü. Toplumsal bilinç sarsıntısı. Eski yapının çöküşü.

---

**Örnek:**
Haber: "Faiz yüzde 50'ye çıktı"

Olay: Ekonomik karar.
Mesaj: Panik, beklenti, öfke.
Kod: 5 = değişim. Eski düzenin son çırpınışı. Kontrol mekanizması.

---

**Dikkat:**
Haberin içeriği kadar **zamanlaması** da koddur.
Ne söylendiği kadar **ne zaman söylendiği** de önemlidir.

Haberi izleme. **Oku.**`,
        inputPrompt: "Son gördüğün bir haberi 3 katmandan oku. Ne çıktı?",
      },
      {
        id: "olay-mesaj",
        title: "Olay → Mesaj",
        type: "practice",
        isFree: false,
        duration: "10 dk",
        hasInput: true,
        content: `Hayatında hiçbir şey sadece "olan bir şey" değildir.
Her olay bir mesajdır.

**Dönüştürme formülü:**

Olay → Duygu → Kalıp → Mesaj

---

**Örnek:**
Olay: İş yerinde tartışma.
Duygu: Öfke, değersizlik.
Kalıp: Çocuklukta duyulmama.
Mesaj: "Kendi sesini sahiplen. Onay aramayı bırak."

---

**Örnek:**
Olay: Ayrılık.
Duygu: Terk edilme, boşluk.
Kalıp: Bağlanma = kayıp korkusu.
Mesaj: "Önce kendine bağlan. Dışarıdaki ayna, içeridekini gösteriyor."

---

**Örnek:**
Olay: Hastalık.
Duygu: Korku, durma.
Kalıp: Sınırlarını aşma.
Mesaj: "Beden son uyarıyı veriyor. Dinle ya da durdurulursun."

---

Her olay bir **kuryedir**.
Mesajı almadığında — aynı kurye farklı kıyafetle tekrar gelir.`,
        inputPrompt: "Hayatında tekrar eden bir olayı formüle sok: Olay → Duygu → Kalıp → Mesaj",
      },
      {
        id: "matrix-cozum",
        title: "Matrix Çözüm",
        type: "analysis",
        isFree: false,
        duration: "15 dk",
        hasInput: true,
        content: `Matrix bir film değil. Bir **okuma modelidir**.

**Matrisin katmanları:**

**1. Simülasyon** — Gördüğün dünya. Kurallar, normlar, "gerçeklik."
**2. Kod** — Simülasyonu çalıştıran yazılım. Kalıplar, inançlar, toplumsal programlama.
**3. Kaynak** — Kodun yazıldığı yer. Saf bilinç. Gözlemci.

---

Çoğu insan simülasyonda yaşar ve onu "gerçek" sanır.
Bazıları kodu fark eder ama çözemez.
**Kod okuyanlar simülasyonun içinden kaynağı görür.**

---

**Sen neredesin?**

Eğer "neden hep aynı şeyler başıma geliyor?" diyorsan → simülasyondasın.
Eğer "bu kalıpları görüyorum ama kıramıyorum" diyorsan → kodu okuyorsun.
Eğer "kalıbı gördüm, mesajı aldım, değiştim" diyorsan → kaynak seviyesindesin.

---

Bu ders son ders.
Ama bu, bir son değil — bir **geçiş**.

Artık izlemek değil, **görmek** başlıyor.`,
        inputPrompt: "Hayatında fark ettiğin en büyük 'matrix kalıbı' ne? Onu nasıl çözebilirsin?",
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

export function getAllLessonsFlat() {
  const out = [];
  for (const mod of KOD_MODULLERI) {
    for (const lesson of mod.lessons) {
      out.push({ ...lesson, moduleId: mod.id, moduleTitle: mod.title, moduleColor: mod.color });
    }
  }
  return out;
}

export const PRICE_MONTHLY = 99;
export const PRICE_EARLY = 49;
export const EARLY_LIMIT = 100;
export const PRICE_SINGLE = 9.90;
