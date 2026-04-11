# Meta Reklam Haz\u0131rl\u0131k ve A/B Test Plan\u0131

## 1. Hesap Kurulumu

### Business Manager
1. business.facebook.com adresine git
2. "Hesap Olu\u015ftur" > "\u0130\u015fletme ad\u0131": SANRI
3. Reklam hesab\u0131 olu\u015ftur (T\u00fcrkiye, TRY)
4. \u00d6deme y\u00f6ntemi ekle (kredi kart\u0131)

### Meta Pixel Kontrolü
- Mevcut Pixel ID: `970415639263912` (zaten kurulu)
- Kontrol edilmesi gerekenler:
  - `ViewContent` \u2014 ürün sayfas\u0131 g\u00f6r\u00fcnt\u00fcleme
  - `InitiateCheckout` \u2014 Shopier'a y\u00f6nlendirme an\u0131
  - `Purchase` \u2014 ba\u015far\u0131l\u0131 \u00f6deme sonras\u0131
- Events Manager'dan test et: https://business.facebook.com/events_manager

### Domain Do\u011frulama
1. Business Settings > Brand Safety > Domains
2. "asksanri.com" ekle
3. DNS TXT kayd\u0131 veya HTML meta tag ile do\u011frula

---

## 2. Hedef Kitle Setleri

### Kitle A \u2014 \u0130lgi Bazl\u0131 (So\u011fuk)
- **Ya\u015f:** 22-38
- **Cinsiyet:** Kad\u0131n a\u011f\u0131rl\u0131kl\u0131 (%70)
- **Konum:** T\u00fcrkiye
- **\u0130lgi alanlar\u0131:**
  - Numeroloji, Astroloji
  - Ki\u015fisel geli\u015fim, Meditasyon
  - Spiritüel ya\u015fam
  - Bilinçalt\u0131
- **Davran\u0131\u015f:** Engaged shoppers

### Kitle B \u2014 Benzer Kitle (Lookalike)
- Kaynak: Email listesi (sat\u0131n alan m\u00fc\u015fteriler)
- Custom Audience: "Sat\u0131n alanlar" email listesinden
- Lookalike: %1-2 benzerlik (T\u00fcrkiye)
- **Not:** En az 100 email gerekli; mevcut m\u00fc\u015fteri say\u0131s\u0131 yeterli oldu\u011funda olu\u015ftur

### Kitle C \u2014 Retargeting (S\u0131cak)
- Pixel bazl\u0131: Son 30 g\u00fcnde siteye giren ama sat\u0131n almayan
- Exclusion: Sat\u0131n alan ki\u015fileri \u00e7\u0131kar

---

## 3. A/B Test Kampanyalar\u0131

### Kampanya 1: Traffic / Conversions Test

**Ad Set A \u2014 "G\u00f6r\u00fcnenin Alt\u0131ndaki Katman"**
- Format: Reels (15-30 sn video)
- G\u00f6rsel: Koyu arka plan, mor \u0131\u015f\u0131lt\u0131l\u0131 metin
- Metin: "G\u00f6r\u00fcnenin alt\u0131ndaki katman\u0131 a\u00e7. Do\u011fum tarihini gir, SANRI sana kim oldu\u011funu g\u00f6stersin."
- CTA: "Daha Fazla Bilgi" > asksanri.com/d/rol-okuma?utm_source=meta&utm_campaign=test_a&utm_content=gorununen_alti
- B\u00fct\u00e7e: G\u00fcnl\u00fck 75 TL, 5 g\u00fcn

**Ad Set B \u2014 "\u0130smin Ne Anlama Geliyor?"**
- Format: Carousel (3 kart: isim \u00f6rnekleri)
- G\u00f6rsel: Her kartta bir isim + numerolojik de\u011fer
- Metin: "Ad\u0131n\u0131n ta\u015f\u0131d\u0131\u011f\u0131 gizli frekans\u0131 ke\u015ffet. 2 dakikada sonu\u00e7."
- CTA: "Hemen Dene" > asksanri.com/d/rol-okuma?utm_source=meta&utm_campaign=test_b&utm_content=isim_analizi
- B\u00fct\u00e7e: G\u00fcnl\u00fck 75 TL, 5 g\u00fcn

### De\u011ferlendirme (5 g\u00fcn sonras\u0131)
- **Kazanan metrik:** Landing page CPC, Conversion rate
- **Karar:** D\u00fc\u015f\u00fck CPC olan\u0131 scale et, di\u011ferini kapat
- **Sonraki ad\u0131m:** Kazanan kreatifi 3 farkl\u0131 kitlede test et (A, B, C)

---

## 4. Kreatif Spesifikasyonlar\u0131

### Video (Reels/Stories)
- **Boyut:** 1080x1920 (9:16)
- **S\u00fcre:** 15-30 sn (ideal 20 sn)
- **\u0130lk 3 saniye:** Hook (dikkat çekici soru/ifade)
- **Altyaz\u0131:** Mutlaka ekle
- **CTA:** Son 5 saniyede net y\u00f6nlendirme

### Carousel
- **Boyut:** 1080x1080 (1:1)
- **Kart say\u0131s\u0131:** 3-5
- **Her kart:** Tek bir bilgi, net metin

### Static Image
- **Boyut:** 1080x1080 veya 1080x1350 (4:5)
- **Metin:** %20'den az (Facebook kural\u0131)
- **Stil:** Koyu arka plan, mor aksan, minimal

---

## 5. B\u00fct\u00e7e Tahsisi (\u0130lk Ay)

| Kalem | Günlük | Ayl\u0131k |
|---|---|---|
| A/B Test (ilk 5 gün) | 150 TL | 750 TL |
| Kazanan kreatif scale | 100 TL | 2,500 TL |
| Retargeting | 50 TL | 1,250 TL |
| **Toplam** | | **~4,500 TL** |

---

## 6. Tracking Checklist

- [x] Meta Pixel kurulu (970415639263912)
- [ ] Domain do\u011frulama yap\u0131ld\u0131
- [x] UTM parametreleri frontend'de parse ediliyor (funnelTracker.js)
- [x] Landing page haz\u0131r (/d/rol-okuma)
- [ ] Custom Audience olu\u015fturuldu (email listesi y\u00fcklendi)
- [ ] Retargeting kitlesi olu\u015fturuldu
- [ ] Purchase event test edildi
- [ ] A/B test kampanyalar\u0131 draft olarak haz\u0131rland\u0131
