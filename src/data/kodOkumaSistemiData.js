/**
 * SANRI Kod Okuma Sistemi™ — 21 ders (3 × 7)
 * Üretim içeriği. Ön izleme ders sayısı aşağıda.
 */

/** Ücretsiz ön izleme dersi sayısı (global sıra 1…N) — sadece ilk N ders */
export const FREE_PREVIEW_LESSON_COUNT = 2;
/** Ön izleme sırasında toplam SANRI yorum hakkı (ücretsiz derslerde) */
export const FREE_PREVIEW_SANRI_COUNT = 2;

export const MODUL_1_ID = "modul-1-kodu-gormek";
export const MODUL_2_ID = "modul-2-frekans-okuma";
export const MODUL_3_ID = "modul-3-matrix-okuma";

export const DEFAULT_LESSON_INTRO = `Bu ders sana bir şey öğretmeyecek.
Sana zaten bildiğini gösterecek.`;

export const DEFAULT_LESSON_CLOSE = "Bazı şeyler öğrenilmez. Sadece görünür hale gelir.";

function mkLesson(spec) {
  return {
    type: "read",
    duration: "10 dk",
    hasInput: true,
    introLine: spec.introLine ?? DEFAULT_LESSON_INTRO,
    closingLine: spec.closingLine ?? DEFAULT_LESSON_CLOSE,
    codeBox: spec.codeBox ?? null,
    ...spec,
  };
}

const L1 = mkLesson({
  id: "kod-nedir",
  title: "Kod Nedir?",
  shortDescription: "Gördüğün şeyin altında başka bir katman olduğunu fark et.",
  duration: "8 dk",
  introLine: DEFAULT_LESSON_INTRO,
  content: `**Kod**, yazdığın program değil.
**Kod**, gerçeğin üstüne giydirilmiş düzen.

Bir cümle kod taşır.
Bir tarih kod taşır.
Bir tekrar eden olay — en yüksek sesle konuşan koddur.

---

Çoğu insan “anlam” arar.
Kod okuyan ise **yön** arar:
Bu beni nereye çağırıyor?
Bu tekrar neyi hatırlatıyor?

---

Gördüğün şey sadece görünen değil.
Görünen, çoğu zaman **en üst katman**.

---

Bu modülde öğreneceğin şey basit:
Yüzeyi geçmek.
Panik yapmadan, mistik dağılmadan — sadece **bir adım aşağı inmek**.`,
  codeBox: `Örnek (kelime çözümü)

İnsan = in + san
in → iç
san → oluşturmak

Okuma: içinden yaratan

(Bu bir “doğru” değil; bir **bakış**. Bakış değişince, dünya değişmez — senin okuman değişir.)`,
  inputPrompt: "Bugün gözünün önünden geçen bir cümleyi yaz. Altında ne olabilir?",
  closingLine: DEFAULT_LESSON_CLOSE,
});

const L2 = mkLesson({
  id: "insan-kod",
  title: "İnsan = Kod",
  shortDescription: "İsim, anlam parçaları ve senin hikâyenin yapı taşları.",
  duration: "9 dk",
  content: `Sen düşündüğünü sanıyorsun.

Ama çoğu şey sana ait değil.

O korku — belki senin değil.
O “yetmiyorum” hissi — belki taşınan bir frekans.

---

**İnsan = Kod** demek, insanı küçültmek değil.
İnsanı **yapı** olarak görmek.

İsimler, lakaplar, seni çağıran sesler…
Hepsi birer işaret.

---

Bu derste yapacağın şey:
Kendini bir hata listesi gibi değil,
bir **desen** gibi okumak.`,
  codeBox: `İsim çözümü (örnek)

Selin → ses + lin
Ses: duyulan
Lin: çizgi / bağ

Okuma: duyulanla çizilen bağ

(Kendi adınla dene. Zorlamadan.)`,
  inputPrompt: "Adının veya seni çağıran bir kelimenin üzerinde 2 dakika kal. Sana ne hissettirdi?",
  closingLine: DEFAULT_LESSON_CLOSE,
});

const L3 = mkLesson({
  id: "kelimeyi-parcalamak",
  title: "Kelimeyi Parçalamak",
  shortDescription: "Kelimeyi harf ve heceye bölmek; kökün sana fısıldadığını duymak.",
  duration: "9 dk",
  content: `Dil, iletişimden önce **düzen** taşır. Kelimeler tesadüfen dizilmez; sesler ve anlam parçaları bir araya gelir.

**Parçalamak** kelimeyi yok saymak değildir. Kelimenin içindeki **ritmi** görmektir: nerede kesiliyor, nerede birleşiyor, hangi hece vurgulanıyor?

---

Çocukken hecelere bölerdin; sonra “doğru yazım” ve “hızlı okuma” geldi, parçalar tekrar tek blok oldu. Kod okuma, o çocuksu dikkati geri getirir — acele etmeden.

---

Bazı kelimeler bedende bir yerde oturur: boğazda, göğüste, çenede. Parçaladığında hangi hecenin sıkıştığını fark edebilirsin. Bu bedensel ipucu, zihnin “bu kelimeyle ne yapıyorum?” sorusuna cevap verir.

---

Burada amaç etimoloji dersi vermek değil. Amaç: **kelimeye mesafeli bakabilmek**. Mesafe getirince kelime seni yönetmekten çıkar, sen kelimeyi incelemeye başlarsın.`,
  codeBox: `Örnek çözüm

Korku → kor + ku
Kor: çevrelemek, sınır çizmek
Ku: küçük titreşim, kuşku

Okuma (bir katman): Zihin tehdidi “çevreleyerek” içeride tutar; hareket alanını daraltır.

Başka bir kelimeyle dene; aynı yöntem, farklı desen.`,
  inputPrompt: "Son günlerde sık kullandığın veya içini sıkıştıran bir kelimeyi yaz. Hecelere böl ve her parçaya tek satırlık bir his notu düş.",
});

const L4 = mkLesson({
  id: "anlam-katmanlari",
  title: "Anlam Katmanları",
  shortDescription: "Yüzey, alt katman, derin katman — üç seviyede okuma.",
  duration: "10 dk",
  content: `Her olayın en az üç katmanı vardır:

**Yüzey** — herkesin gördüğü
**Alt** — hissedilen ama söylenmeyen
**Derin** — tekrar ve mesajın bulunduğu yer

---

Kod okumak, her seferinde derine inmek değil.
Doğru katmanda durabilmektir.

---

Çoğu insan yüzeyde boğulur.
Bazıları derinde kaybolur.
Senin görevin: **hangi katmanda ne sorulduğunu** seçmek.`,
  codeBox: `Örnek

Olay: Bir arkadaşın mesajına geç cevap verdin.
Yüzey: İletişim gecikti.
Alt: Suçluluk / korku.
Derin: “Ben değerliyim” mesajını yeniden kurma ihtiyacı.`,
  inputPrompt: "Küçük bir olayı üç katmandan oku. En çok hangi katman seni yakaladı?",
});

const L5 = mkLesson({
  id: "tekrar-eden-kelimeler",
  title: "Tekrar Eden Kelimeler",
  shortDescription: "Aynı kelimenin farklı ağızlardan gelmesi — dikkat çeken tema.",
  duration: "10 dk",
  content: `Bir kelime günde üç kez karşına çıkarsa, bunu “algoritma”ya veya şansa atfedebilirsin. Kod okumada soru farklıdır: **Bu kelime hangi temayı işaret ediyor?**

Tekrar, bilinç için sinyal gibidir. Aynı kök, aynı duygu tonu veya aynı “görev” (örneğin ikna, erteleme, suçluluk) etrafında dönüyorsa, sistem bir şeyi hatırlatmaya çalışıyor olabilir.

---

Burada yapılacak şey kelimeyi kutsallaştırmak değil. Yapılacak şey: tekrarın **bağlamını** not etmek. Kim söyledi? Hangi ortamda? Senin içinde hangi duyguyla çakıştı?

---

Tekrar eden kelimeyi “beni takip ediyor” diye okumak zorunda değilsin. Daha sakin bir okuma: “Bu kelime, şu aralıkta hayatımda hangi alanı temsil ediyor?” — iş, ilişki, beden, para, aidiyet…

---

Bu dersin çıktısı net olsun: tek bir kelime için üç gerçek örnek (nerede duydun / gördün) ve her örnekte bir satırlık duygu notu.`,
  codeBox: `Örnek

Kelime: “Zaman”
1) Patron: “Zaman dar” → baskı, kaygı
2) Arkadaş: “Zamanın var mı?” → suçluluk, meşguliyet
3) Kendi iç ses: “Zamanım yok” → öncelik, sınır

Okuma: Aynı kelime; farklı sahnelerde “baskı ve sınır” teması.`,
  inputPrompt: "Tekrarladığını fark ettiğin bir kelimeyi ve üç farklı ortamda nasıl geçtiğini yaz.",
});

const L6 = mkLesson({
  id: "ic-ses-ayrimi",
  title: "Sana Ait Olan / Olmayan İç Ses",
  shortDescription: "Hangi düşünce senin, hangisi taşınan?",
  duration: "11 dk",
  content: `İç ses diye bir şey var.
Ama her iç ses **iç** değildir.

Bazı sesler:
— aileden gelir
— okuldan gelir
— toplumsal programdan gelir
— korku dalgasından gelir

---

Ayırt etmek için tek soru yetebilir:
**Bu ses beni büyütüyor mu, küçültüyor mu?**

Büyüten çoğu zaman senin.
Küçülten çoğu zaman taşınan.`,
  codeBox: `Mini test

Düşünce: “Bunu hak etmiyorum.”
Soru: Bu cümle beni nereye koyuyor?

Eğer cümle seni “küçük” bir yere koyuyorsa — çoğu zaman kod taşır.`,
  inputPrompt: "Bugün içinden geçen bir cümleyi yaz. Sana ait mi, taşınan mı — tek cümleyle ayır.",
});

const L7 = mkLesson({
  id: "ilk-okuma-pratigi",
  title: "İlk Okuma Pratiği",
  shortDescription: "Kısa bir metni kod gibi oku; sonuç değil süreç.",
  duration: "12 dk",
  content: `Şimdi “bilgi” değil, **pratik**.

Küçük bir metin seç:
— bir cümle
— bir başlık
— bir mesaj

---

Yapacağın şey:
1) yüzeyi söyle
2) altını hisset
3) bir “mesaj” cümlesi kur (iddia değil, okuma)

---

Hata yapabilirsin.
Burada hata yok — sadece **deneysel bakış** var.`,
  inputPrompt: "3–5 cümlelik bir metin yapıştır veya yaz. Üç adımda oku.",
});

const L8 = mkLesson({
  id: "donguler-tekrar",
  title: "Döngüler ve Tekrar",
  shortDescription: "Aynı his, farklı yüzler; köken aile ve bedende; bırakamadığın şey çoğu zaman histir.",
  duration: "14 dk",
  introLine: `İlişkilerde insanlar değişir.
Ama yaşadığın his çoğu zaman aynı kalır.
Yüz tanımadın sandığın şey, aslında tanıdık bir son.`,
  content: `İsimler değişir. Mesajlar değişir. Şehir bile değişir.
Ama içerde biten yer çoğu zaman aynıdır: **aynı boşluk, aynı sıkışma, aynı “yine ben” düşüşü.**

Farklı insanlarla aynı filmi yaşadığını fark ettiğinde, suçu kişiye yapıştırmak kolay gelir.
Asıl soru başkadır: **Bu sefer hangi duygusal sonuçla kalktın masadan?**

---

Bu sadece bugünün ilişkisiyle ilgili değil.

Bu düzen çoğu zaman **senden önce** kurulmuştur. Evde hangi konu konuşulmadan büyüdün? Hangi duygu “fazla” sayıldı? Kim sustu, kim taşıdı, kim hep affetti?

Ebeveynlerinin arasındaki sessizlik bile senin içinde **bir dil** öğretebilir: yakınlık böyle mi olur, yoksa böyle mi acıtır?

---

Atadan gelen dediğimiz şey masal değil; **tekrar eden cümleler**, **tekrar eden fedakârlıklar**, **tekrar eden “dayan”lar**… Sen fark etmeden aynı cümleyi ağzına alırsın. Sanki sen yazmışsın gibi.

---

Bazı insanlar hayatına tesadüf gibi girmez.

Onlar bir şeyi **tamamlamak** veya **göstermek** için gelir: sınırını, suskunluğunu, korkunu… Ama sen görmezsen, döngü devam eder. Güçlü çekim bazen aşk değildir; **tanıdık acının manyetik alanıdır.**

Bırakılamaz sandığın şey, çoğu zaman kişi değildir. **Bitmemiş bir histir** — “bir daha şans”, “bu sefer farklı”, “belki düzelir”…

---

**Derin şok — dur ve oku**

Sen aynı insanı seçmiyorsun.
**Aynı duyguyu seçiyorsun.**

Sevgi sandığın şey bazen tanıdık acıdır.

Bırakamadığın kişi değil,
**bırakamadığın histir.**

---

Döngü ceza değildir.

Döngü, **henüz görülmemiş bir seçimdir.** Görülmeden tekrar eder; görülünce yavaşlar. Burada suç yok; **bilinçsiz sadakat** var — eski bir düzene sadık kalan beden ve zihin.

---

Bu döngü önce düşüncede değil, **bedende** başlar.

Göğüste sıkışma, çenede kilit, midede alarm… Zihin sonra hikâye uydurur: “normal”, “ben abartıyorum”, “belki ben yanlış anladım”. Beden ise çoğu zaman önce doğruyu söyler.

---

Şimdi bir adım geri çekil.
Tekrar sadece “kötü şans” değil.
**Hatırlanmayı bekleyen bir desen** olabilir.`,
  codeBox: `Kod kutusu — örnek

İlişki A: Soğuma → sen toparlama → kısa barış → yine mesafe
İlişki B: Farklı isim, aynı ritim
Ortak his: “Yine yalnız kaldım.”
Kök iz (olası): çocuklukta duygu taşıyıcısı olmak
Kod adı: tanıdık yalnızlık döngüsü`,
  inputPrompt: `Şimdi sen gör.

Son yaşadığın ilişkiyi düşün (bitmiş veya süren).
• Aynı his nerede tekrar etti? (birkaç kelime)
• Bu sana kimi hatırlatıyor? (anne, baba, eski bir figür — isim vermeden de yazabilirsin)
• Bu duygu sana ne kadar tanıdık? (0–10 değil; “çocukluktan mı, ergenlikten mi, hep mi?” diye tarif et)

Kısa yaz; dürüst yaz.`,
  closingLine: `Bu ders ilişkiyi değiştirmek için değil.
İlişkiyi görmek için.

Bunu okurken aklına biri geldiyse…
o kişi de bu döngünün içinde.`,
});

const L9 = mkLesson({
  id: "karmik-bag-nedir",
  title: "Karmik Bağ Nedir?",
  shortDescription: "Bırakılamayan çekim: yoğun yakınlık, yoğun yıkım, tamamlanmamış döngü.",
  duration: "15 dk",
  introLine: `Bazı insanlar “mantıklı” değildir.
Ama bırakılmaz.
Orada sadece aşk yok; tamamlanmamış bir döngü vardır.`,
  content: `Karmik bağ, burada ceza veya “geçmiş hayattan borç” masalı değil. **Enerji ve bilinçaltı düzeyinde kilitlenmiş tekrar** demek.

Neden bazı ilişkiler biter gibi olur ama bitmez? Çünkü zihin “bitti” der; beden ve alan **hâlâ aynı soruyu soruyordur**: “Bu sefer farklı bitecek mi?” “Bu sefer ben seçilir miyim?” “Bu sefer o değişecek mi?”

---

Yoğun çekim ile yoğun yıkım aynı bağın iki yüzü olabilir. Aynı frekansta hem yakınlık hem çarpışma üretilir. Sen bunu “tutku” sanırsın; bazen altında **eski bir yarayı kanatmaya devam etme** vardır.

---

Tamamlanmamış döngü şudur: senaryo kapanmadan yeni perde açılır. Kapatılması gereken şey çoğu zaman karşıdaki kişi değil; **senin o ilişkide verdiğin söz**dir — kendine verdiğin: “Kendimi küçülteceğim”, “Göreceğim ve susacağım”, “Bekleyeceğim”, “Bir gün anlayacak”…

---

**Derin şok**

Bırakamadığın kişi bazen “o” değildir.
Bırakamadığın şey, **o ilişkide kendini terk ettiğin andır**.
O anı bırakınca kişi çoğu zaman elinin tüyü gibi düşer.

---

Bu ders seni suçlamıyor.
Sadece şunu gösteriyor: **bağ, sevgi kadar alışkanlık ve korku ile de örülür.**`,
  codeBox: `Kod kutusu — örnek

Belirtiler: kopamama + sürekli geri dönüş + “bu sefer farklı” cümlesi
Alt titreşim: seçilmeme / terk edilme korkusu üzerinden kanıt arama
Döngü: ayrılık → boşluk → panik → tekrar birleşme → tekrar aynı kırılma
Kod adı: kapanmamış hesap — ama hesap çoğu zaman karşıda değil, sende`,
  inputPrompt: `Şimdi sen oku.

Aklına gelen bir “bırakamadığın” ilişkiyi seç.
Üç kısa madde:
1) Seni en çok neye bağlı tuttu? (çekim / korku / alışkanlık / utanç)
2) Bedende nerede tutuyordun? (mide, boğaz, göğüs…)
3) Bitmemiş cümle neydi? (tek cümle)`,
  closingLine: `Bağı görmek, bağı koparmak demek değildir. Önce göreceksin.

Bunu okurken aklına biri geldiyse… o kişi de bu döngünün içinde.`,
});

const L10 = mkLesson({
  id: "ruhsal-bag-travma-bagi",
  title: "Ruhsal Bağ ve Travma Bağı",
  shortDescription: "Gerçek bağ ile bağımlılık: “onsuz yapamam” hangi kodun dilidir?",
  duration: "14 dk",
  introLine: `Ruhsal bağ, seni büyütür.
Travma bağı, seni aynı yaraya geri iter.
İkisini karıştırdığında “kader” sanırsın.`,
  content: `Ruhsal bağda iki taraf da **nefes alır**. Karşılıklı alan açılır; sen hem verirsin hem alırsın; “ben yok olmadan da sevilebilirim” hissi büyür.

Travma bağında ise çoğu zaman tek ritim vardır: **tetiklenme — kaçınma — tekrar yapışma**. Sevgi varmış gibi görünür; altında “kaybetme korkusu” ve “kendini eritme” çalışır.

---

“Onsuz yapamam” cümlesi romantik durur. Kod okumada soru şudur: Bu cümle **genişletiyor mu**, yoksa **köleleştiriyor mu**? Genişleten bağ, yalnız kaldığında da seni yere sermez. Köleleştiren bağ, yalnızlığı ceza gibi gösterir.

---

Travma bağında karşı taraf bazen “kötü” olmak zorunda değildir. Senin içindeki **eski bir çocuk** onu “kurtarıcı” veya “tehlike” olarak okur; ikisi de aynı kilit anahtarı olabilir.

---

**Derin şok**

Gerçek bağda “git” dediğinde içten bir hüzün olur ama **saygı** kalır.
Travma bağında “git” dediğinde panik olur; çünkü korktuğun yalnızlık değil, **değersiz kalma**dır.

---

Bu ders ayrılık emri değil.
**Ayırt etme pratiğidir.**`,
  codeBox: `Kod kutusu — örnek

Sen: “O olmadan hiçbir şey anlamlı değil.”
Davranış: onay bekleme, ruh halini ona teslim etme
Karşı taraf: dalgalı ilgi — arada sıcak, arada yok
Kod adı: travma bağı — değerini dış onaya bağlama

Ruhsal bağ işareti (olası): ayrı kaldığında bile içerde temel saygı ve sınır korunur.`,
  inputPrompt: `Şimdi sen oku.

“Onsuz yapamam” veya buna yakın bir cümleyi içinden geçir.
• Bu cümle seni genişletiyor mu, daraltıyor mu? (iki satır)
• Bu bağda sen “seçilen” miydin, yoksa “ikna edilen” mi? (tek cümle)`,
  closingLine: `Bağı isimlendirmek, bağı düşman ilan etmek değildir. Kendine dürüst olmaktır.

Bunu okurken aklına biri geldiyse… o kişi de bu döngünün içinde.`,
});

const L11 = mkLesson({
  id: "neden-aldatiliriz",
  title: "Neden Aldatılırız?",
  shortDescription: "Sadece değer değil: rol kırılması, görmezden gelinen sinyaller, kendini terk ettiğin yer.",
  duration: "15 dk",
  introLine: `Aldatılma hikâyesi çoğu zaman “yetersizlik” diye anlatılır.
Oysa derin katmanda çoğu zaman **rol kırılması** ve **görmeme sözleşmesi** vardır.`,
  content: `Burada ahlak dersi yok; **okuma** var. Aldatılma, sadece “ben değerli değildim” cümlesine sığmaz. O cümle doğru hissedilir ama eksik kalır — çünkü altında başka bir şey daha vardır: **senin kendi sınırlarını ve sezgini ne zaman susturduğun.**

İlişkide aldatma çoğu zaman tek gecede doğmaz. Önce küçük kopukluklar olur: ilgi azalır, göz kaçırır, cümleler değişir, beden mesafesi büyür. Sen bunu görürsün; sonra **görmeme** seçersin — çünkü görmenin bedeli, kırılmak ve karar vermektir.

---

“Değer” konusu burada tuzaklıdır. İnsan değersiz olduğu için değil; **değerini ispat etmekten yorulduğu** için de kalabilir. Aldatma sahnesi patladığında yıkılan şey çoğu zaman sadece güven değil; **“ben fark ettim ama ses çıkarmadım”** gerçeğidir.

---

Enerji düzeyinde aldatma, birinin sözünden çok **alanın** ihlalidir. Alan ihlali önceden hissedilir: içerde bir sıkışma, bir “bir şey yanlış” hali… Bunu bastırdığında zihin hikâye üretir: “Yoğunmuş”, “Ben paranoyakmışım”… Bazen paranoyak değilsindir; **sadece erken uyarıyı dinlememişsindir.**

---

**Derin şok**

Aldatılmak bazen “ben seçilmedim” değildir.
**Sen kendini seçmediğin yerde başlar.**
Orada zaten içerden bir ses “dur” diyordur; sen “belki geçer” dersin.

---

Bu ders seni suçlamıyor.
Sana **nerede sustuğunu** gösteriyor.`,
  codeBox: `Kod kutusu — örnek

Görmezden gelinen sinyaller: mesajlarda kopukluk, ilgi asimetrisi, suçlayıcı “sen hassassın” tonu
Senin rolün: uyum sağlayan, kanıt istemeyen, “büyütmeyeyim” diyen
Kırılma anı: tek bir olay değil; uzun süredir biriken alan ihlali
Kod adı: kendini terk + gerçeği erteleme`,
  inputPrompt: `Şimdi sen oku.

Bir ilişkiyi düşün (şimdiki veya geçmiş).
• Hangi küçük sinyali erken gördün ama sustun? (madde madde, kısa)
• O süreçte sen kendini nerede terk ettin? (tek paragraf)`,
  closingLine: `Görmek acıtır; ama görmemek aynı sahneyi tekrar ettirir.

Bunu okurken aklına biri geldiyse… o kişi de bu döngünün içinde.`,
});

const L12 = mkLesson({
  id: "neden-kandiriliriz",
  title: "Neden Kandırılırız?",
  shortDescription: "Görmek istemediğin şeyi görmezsin; sezgi bastırılır, gerçek yerine hikâye seçilir.",
  duration: "14 dk",
  introLine: `Kandırılmak sadece “karşı taraf yalan söyledi” değildir.
Çoğu zaman senin içinde **görmek istemediğin bir köşe** vardır.
Orası kapanınca, hikâye rahatlatır.`,
  content: `İnsan gerçeği değil, **toleransını** sever. Gerçek sarsınca zihin hızlıca alternatif senaryo üretir: “Öyle demek istemedi”, “Şartlar zordu”, “Ben abartıyorum”… Bu cümlelerin bazıları bazen doğrudur; ama hepsi aynı anda doğru olamaz. Kod sorusu şudur: **Hangi cümle seni güvende hissettiriyor, hangisi doğruyu gösteriyor?**

---

Sezgi bastırıldığında beden konuşmaya devam eder. Uykusuzluk, mide, gerginlik, içten gelmeyen bir “tamam” hali… Zihin “mantık” ders; beden **uyumsuzluk** taşır.

---

Kandırılma, çoğu zaman tek bir yalan değildir. **Senin de katıldığın bir anlatıdır**: “O böyle seviyor”, “Ben anlayışlı olmalıyım”, “Aşk fedakârlıktır”… Fedakârlık ile kendini silmek arasındaki çizgi incedir.

---

**Derin şok**

Kandırılmuyorsundur bazen.
**Beraber oynanan bir oyundasın.**
Sen de masada oturursun; çünkü masadan kalkmak, yalnızlığı ve sorumluluğu üstlenmek demektir.

---

Bu ders seni yargılamıyor.
Gözünü **hikâyedeki kör noktaya** açıyor.`,
  codeBox: `Kod kutusu — örnek

Dış anlatı: “Her şey yolunda, sen düşünme.”
İç anlatı: “Belki ben fazla istiyorum.”
Beden: rahatsız, ama gerekçe üretiliyor
Kod adı: gerçek yerine uyum hikâyesi — sezgi susturma`,
  inputPrompt: `Şimdi sen oku.

Son zamanlarda “sonradan fark ettim” dediğin bir durumu yaz.
• O anda bedenin ne söylüyordu? (kısa)
• Zihin hangi hikâyeyi seçti? (tek cümle)
• O hikâye seni neyden koruyordu? (tek cümle)`,
  closingLine: `Hikâye yumuşatır; kod ise netleştirir. İkisi aynı anda hakim olamaz.

Bunu okurken aklına biri geldiyse… o kişi de bu döngünün içinde.`,
});

const L13 = mkLesson({
  id: "disil-eril-kodlar",
  title: "Dişil ve Eril Kodlar",
  shortDescription: "Bağlanma ve akış; yön ve sınır — dengesizlikte ilişki kırılır.",
  duration: "14 dk",
  introLine: `Dişil kod: bağlanma, akış, sezgi, alan açma.
Eril kod: yön, karar, sınır, netlik.
İkisi çatışmadığında ilişki nefes alır; ikisi çarpıştığında “kim haklı” oyunu başlar.`,
  content: `Burada cinsiyet kimliğinden çok **içsel kutup** konuşuyoruz. Her insanda ikisi de vardır; ilişkide hangi kodun şoför koltuğuna geçtiği sahneyi belirler.

Dişil alan açıldığında ilişkide yumuşaklık, empatri, “birlikte olma” hissi büyür. Ama dişil kod **sınır olmadan** açılırsa, bağlanma kolayca **yutucu** olur: fazla verme, fazla uyum, fazla tahmin…

Eril kod netlik getirir: “Bu benim çizgim”, “Bunu istemiyorum”, “Bu şekilde devam edemem”… Eril kod **yön olmadan** sertleşirse, ilişki cepheleşir: kontrol, soğukluk, duygu suçlaması…

---

Dengesizlikte çoğu zaman şu oyun döner: biri çok verir, öbürü çekilir — ya da biri yönetir, öbürü küçülür. Kod adı değişir ama desen tanıdıktır.

---

İlişkide “haklı olmak” çoğu zaman kazandırmaz.
**Dengeyi görmek** kazandırır.

---

**Derin şok**

“Çok dişil” kalmak bazen sevgi değildir.
**Korkudan erimesidir.**
“Çok eril” kalmak bazen güç değildir.
**Yakınlıktan korkmadır.**

---

Bu ders kutulara koymak için değil.
**Hangi kodun seni yönettiğini görmek** için.`,
  codeBox: `Kod kutusu — örnek

Sen: sürekli uyum + önceden hissedip yine de yumuşayan (aşırı dişil eğilim)
Karşı taraf: net görünür ama duyguda uzak (aşırı eril eğilim)
Dinamik: yakınlık isteği ↔ mesafe
Kod adı: biri eriyor, biri duvar örüyor — ikisi de korkuyla`,
  inputPrompt: `Şimdi sen oku.

Son ilişkide:
• Sen hangi kodda daha çok kaldın? (dişil / eril — veya karışımını tarif et)
• Nerede sınır koyamadın veya nerede yön veremedin? (kısa)
• Bir cümleyle: Bu dengesizliğin bedeli ne oldu?`,
  closingLine: `Kutup kötü değildir; kutup fark edilmeden yönetir.

Bunu okurken aklına biri geldiyse… o kişi de bu döngünün içinde.`,
});

const L14 = mkLesson({
  id: "duygu-kodlari-kritik",
  title: "Duygu Kodları (En Kritik)",
  shortDescription: "Terk edilme, değersizlik, kontrol, görünmeme — ilişkinin motoru olan dört kod.",
  duration: "16 dk",
  introLine: `İlişkiyi yöneten çoğu zaman sözler değil, duygu kodlarıdır.
Onları tanımadan, aynı filmi yaşarsın.`,
  content: `Bu dersin merkezinde dört kod var. Bunlar “tanı” değil; **tekrar eden iç titreşim**lerdir.

**Terk edilme korkusu** — Yakınlık isteğini büyütür; bazen karşıyı boğar, bazen seni küçültür. “Gitme” değil, asıl kod: **“Kalırsam değerliyim”** sanrısıdır.

**Değersizlik hissi** — Kendini ispat etmeye iter. İspat ilişkisinde sevgi değil, **performans** oynanır. Karşı taraf alkışlamayı kesince dünya çökermiş gibi olur.

**Kontrol ihtiyacı** — Belirsizliği tolere edememekten doğar. Mesaj, saat, plan, detay… Kontrol, güvenlik maskesi takar; altında çoğu zaman **çaresizlik** vardır.

**Görünmeme travması** — “Ben yokum, beni görmüyorlar” çocukluğundan gelen bir iz taşır. İlişkide ya görünmez kalırsın ya da aşırı ses çıkarırsın; ikisi de aynı yarayı gösterir.

---

Bu kodlar tek başına da, birlikte de çalışır. Çoğu kavga, “konu” yüzünden değil; **bu kodlardan birinin tetiklenmesi** yüzünden patlar.

---

**Derin şok**

Sen sevilmemekten korkmuyorsun bazen.
**Sevildiğinde yine terk edilmekten korkuyorsun.**
O yüzden ya çok tutarsın ya da çok erken bırakırsın; ikisi de aynı korkunun iki yüzü olabilir.

---

Bu ders seni etiketlemiyor.
**Motoru gösteriyor.**
Motoru görünce, aynı yokuşta aynı hızla gitmek zorunda değilsin.`,
  codeBox: `Kod kutusu — örnek (dört kod kesişimi)

Terk korkusu → mesaj bekleme, içerde alarm
Değersizlik → “daha çok vereyim”
Kontrol → mesajı analiz, anlam arama
Görünmeme → “yine ben görülmüyorum” çöküşü
Kod adı: değersizlik döngüsü — kanıt avı + panik`,
  inputPrompt: `Şimdi sen oku.

Son ilişkini düşün.
Hangi duygu kodu en çok devredeydi? (terk / değersizlik / kontrol / görünmeme — birini veya birkaçını seç)
Her biri için tek örnek: Bunu hangi davranışınla besledin?
Son satır: Bu kod sana neyi yasaklıyordu? (örn. sınır koymak, rahat nefes, güven…)`,
  closingLine: `Duyguyu suçlama. Duygu bilgi taşır. Mesajı oku.

Bunu okurken aklına biri geldiyse… o kişi de bu döngünün içinde.`,
});

const L15 = mkLesson({
  id: "olay-kodlama",
  title: "Olay Kodlama",
  shortDescription: "Haber ve olayı üç satırda okumak: ne oldu, ne hissettirdi, ne çağrıştırdı.",
  duration: "12 dk",
  content: `Dış dünyada olan biten, çoğu zaman “bilgi” kılığında **duygu programı** taşır. Başlık ne söylüyor? Metin hangi kelimeleri tekrar ediyor? Görsel hangi rengi baskın kullanıyor? Zamanlama neden şimdi?

Olay kodlama, haberi yargılamak değildir. Olay kodlama, **senin içinde hangi tuşa basıldığını** görmektir.

---

Üç satırlık çerçeve:
1) **Olay özeti** — manipülasyonsuz, kısa
2) **Duygu** — bedende nerede
3) **Mesaj** — sana özel bir cümle: “Bu bana şunu hatırlatıyor…”

---

Bu pratik, gündemi tüketmekten çıkıp gündemi **okumaya** başlamanı sağlar. Okumak, her şeye inanmak değildir; okumak, kendi merkezini korumaktır.`,
  codeBox: `Örnek

1) Özet: “Ekonomi haberi, belirsizlik vurgusu.”
2) Duygu: göğüste sıkışma
3) Mesaj: “Kontrolü dışarıda arama alışkanığın uyandı.”`,
  inputPrompt: "Okuduğun veya duyduğun tek bir haberi üç satırlık çerçeveye yaz.",
});

const L16 = mkLesson({
  id: "sistem-mesajlari",
  title: "Sistem Mesajları",
  shortDescription: "Kolektif gündemin tekrarlayan temalarını ayırt etmek.",
  duration: "13 dk",
  content: `Sistem mesajları, tek bir haberden çok, **gündemin tekrarında** görünür. Aynı kelime farklı kanallarda dolaşıyorsa, kolektif dikkat oraya kilitlenmiş demektir. Soru: Bu kilitlenme sende hangi duyguyu büyütüyor?

Burada “komplo” okuması yapmıyoruz. Yapılan şey, medya dilini **soğukkanlılıkla** incelemek: öfke mi satılıyor, umut mu, suçluluk mı, rahatlama mı?

---

Küçük egzersiz: bugün gördüğün üç farklı başlıkta ortak geçen bir fiil veya isim bul. Ortak öğe, kolektif hikâyenin “sap”ı olabilir.

---

Bu ders, dünyayı kapatmak için değil. Bu ders, dünyayı izlerken **kendi frekansını seçebilmek** içindir.`,
  codeBox: `Örnek

Ortak kelime: “kriz”
Duygu tonu: sıkışma + suçlama
Kişisel soru: “Ben bu tonda neyi besliyorum?”`,
  inputPrompt: "Bugün gündemde üç başlıktan ortak bir kelime veya tema yakala; kişisel etkini iki cümleyle yaz.",
});

const L17 = mkLesson({
  id: "kisisel-matrix",
  title: "Kişisel Matrix",
  shortDescription: "Hayatının ‘kuralları’: nerede aynı hamleyi yapıyorsun?",
  duration: "14 dk",
  content: `“Matrix” burada film değil; **tekrar eden kurallar kümesi** demek. Sabah rutini, iş konuşması, ilişki başlangıcı, para kararı… Aynı yapı farklı yüzlerle gelir.

Kişisel matrix’i görmek için üç alanı seç: iş, ilişki, beden. Her alanda bir **kural** yaz: “Her zaman şunu yaparım…”

---

Kurallar kötüdür demiyoruz. Kurallar **verimlilik** ve **güvenlik** sağlar. Ama kurallar fark edilmeden büyürse, yaşam daralır.

---

Bu derste matrix’i yıkmak zorunda değilsin. Sadece **haritalamak** yeter: Hangi üç kural hayatını en çok yönetiyor?

---

Harita çıkınca, seçim alanı görünür: kuralı sürdürmek, yumuşatmak veya tek alanda test etmek.`,
  codeBox: `Örnek kurallar

İş: “Önce ben hallederim.”
İlişki: “Önce ben uyum sağlarım.”
Beden: “Önce ertelerim.”

Okuma: “Önce ben” maskesi altında yorgunluk birikiyor.`,
  inputPrompt: "Üç alan için (iş / ilişki / beden) birer ‘her zaman şunu yaparım’ cümlesi yaz ve tek paragrafta bir okuma çıkar.",
});

const L18 = mkLesson({
  id: "kor-noktalar",
  title: "Kör Noktalar",
  shortDescription: "Görmemek için kullandığın stratejiler: meşguliyet, şaka, erteleme.",
  duration: "12 dk",
  content: `Kör nokta, “göremiyorum” değil; çoğu zaman **bakmayı erteliyorum**dur. İnsan bilmediği için değil, bakmanın bedelini henüz ödemek istemediği için görmez.

Bu derste suçlama yok. Strateji var: görmemek için ne kullanıyorsun? Meşguliyet, şaka, öfke, aşırı mantık, sürekli yardım etme…

---

Kör noktayı açmanın ilk adımı yumuşaklıktır. “Bunu görürsem ne kaybederim?” sorusu, korkunun boyutunu gerçekçi yapar.

---

Küçük pratik: Bir konuda “asla düşünmem” dediğin şey var mı? O konuya bir cümlelik merak ekle: “Belki şu kısmı görebilirim…”

---

Amaç her şeyi aynı anda görmek değil. Amaç, görmeme **alışkanlığını** fark etmek.`,
  codeBox: `Örnek

Konu: Sınır koymak
Strateji: “Zaten anlamazlar.”
Bedel (korku): Yalnız kalmak
İlk adım: Tek küçük net cümle`,
  inputPrompt: "Görmemek için kullandığın bir stratejiyi ve sakladığın konuyu yaz; ardından tek cümlelik ‘ilk adım’ ekle.",
});

const L19 = mkLesson({
  id: "kirilma-noktalari",
  title: "Kırılma Noktaları",
  shortDescription: "Kriz anında kaybedilen ve kazanılan: eski rol mü, yeni yön mü?",
  duration: "13 dk",
  content: `Kırılma, çoğu zaman son değildir. Kırılma, **eski düzenin çatlama sesidir**. Çatlayınca iki yol vardır: aynı yapıyı hızlıca onarmak veya yeni bir düzen denemek.

Bu dersde kırılmayı romantize etmiyoruz. Kırılma acıtır. Ama kırılmayı okumak, acıyı **anlamsızlığa** mahkûm etmez.

---

Kırılma anında üç soru:
1) Hangi masal bitti? (kendin hakkında anlattığın hikâye)
2) Hangi duygu en baskındı? (öfke, utanç, rahatlama…)
3) Bugün o andan hangi tek cümle kaldı?

---

Kırılma, bazen dışarıdan gelir; bazen içeriden. İkisinde de okuma benzerdir: ne bitti, ne başlamak istiyor?

---

Bu ders, geçmişi yeniden yaşatmak için değil; geçmişe **net bir çerçeve** vermek içindir.`,
  codeBox: `Örnek

Masal: “Her şeyi ben çözerim.”
Kırılma: Tükenme
Kalan cümle: “Yardım istemek zayıflık değil.”`,
  inputPrompt: "Hayatından bir kırılma anını kısaca anlat; üç soruya cevap ver (madde madde yeter).",
});

const L20 = mkLesson({
  id: "kendi-kodunu-yaz",
  title: "Kendi Kodunu Yaz",
  shortDescription: "Kendi sistemin: kuralların, işaretlerin, dilin.",
  duration: "14 dk",
  content: `Artık hazır olduğun şey bilgi değil: **kendi dilini seçmek**.

Kendi kodunu yazmak:
— kendine yalan söylememek
— tekrarları sahiplenmek
— mesajı aldığında döngüyü bırakmak

---

Bu dersde küçük bir “manifest” yazacaksın.
Uzun olmak zorunda değil.
**Net** olmak zorunda.`,
  inputPrompt: "5 maddelik mini manifest: Ben şunu tekrar etmeyi bırakırım / şunu seçerim…",
});

const L21 = mkLesson({
  id: "final-hatirlama",
  title: "Final — Hatırlama",
  shortDescription: "Kapanış: öğrenmedin; hatırladın.",
  duration: "10 dk",
  introLine: `Bu son ders.
Ama bu bir bitiş değil — bir eşik.`,
  content: `Buraya kadar yürüdün.

Bazen anladın, bazen sadece hissettin.
İkisi de yeter.

---

Kod okumak, dünyayı değiştirmez.
Ama **okuyanın** dünyayla ilişkisini değiştirir.

---

Son cümle:

**Sen öğrenmedin.
Hatırladın.**`,
  codeBox: null,
  closingLine: "Kapı açık kalsın. İçeri girmek için izin istemezsin.",
  inputPrompt: "Bu yolculukta senin için tek bir cümlede ne değişti? (Hatırlatma cümlesi yaz.)",
});

export const KOD_MODULLERI = [
  {
    id: MODUL_1_ID,
    title: "MODÜL 1 — KODU GÖRMEK",
    subtitle: "Gördüğün şeyin altında başka bir katman olduğunu fark et.",
    aim: "Yüzeyin ötesini seçmek.",
    icon: "◈",
    color: "#c8a0ff",
    lessons: [L1, L2, L3, L4, L5, L6, L7],
  },
  {
    id: MODUL_2_ID,
    title: "MODÜL 2 — İLİŞKİ KODLARI",
    subtitle: "Döngü ve tekrar, köken ve karmik bağ, ruhsal–travma bağı, aldatılma ve kandırılma, dişil–eril kodlar, duygu motorları.",
    aim: "İlişkide yüzün değil, döngüyü ve kodu okumak.",
    icon: "☽",
    color: "#D4AF37",
    lessons: [L8, L9, L10, L11, L12, L13, L14],
  },
  {
    id: MODUL_3_ID,
    title: "MODÜL 3 — MATRIX OKUMA",
    subtitle: "Olay, sistem ve kişisel hayatı mesaj olarak görmek.",
    aim: "Oyun tahtasını görmek.",
    icon: "◉",
    color: "#7B68EE",
    lessons: [L15, L16, L17, L18, L19, L20, L21],
  },
];

(function applyGlobalFlags() {
  let i = 0;
  for (const mod of KOD_MODULLERI) {
    for (const les of mod.lessons) {
      les.globalNo = i + 1;
      les.isFree = i < FREE_PREVIEW_LESSON_COUNT;
      i++;
    }
  }
})();

export function getGlobalLessonIndex(moduleId, lessonId) {
  let idx = 0;
  for (const mod of KOD_MODULLERI) {
    for (const les of mod.lessons) {
      if (mod.id === moduleId && les.id === lessonId) return idx;
      idx++;
    }
  }
  return -1;
}
