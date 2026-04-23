# Auto‑Email: Rol Okuma açılımı

Bu doküman, **Shopier** üzerinden **Matrix Rol Okuma** (`content_id = role_unlock`)
satın alındığında müşteriye **otomatik e‑posta** ile hem erişim linki hem de
açılım metninin gönderilmesi için **Railway backend**'de yapılması gereken
işleri tek parça halinde tarif eder.

Frontend tarafında gereken tüm kancalar (admin butonları, mailto taslağı,
payload → düz metin renderer, access link üretimi) `C:\sanri` reposunda
aşağıdaki dosyalarda zaten bağlı durumdadır:

- `src/data/deliverableEmail.js` — link + subject + body üretir (tek kaynak)
- `src/data/adminApi.js` — `sendDeliverableEmail(id, opts)` ve
  `sendAccessLinkEmail(payload)` helper'ları
- `src/pages/admin/AdminDeliverablesPage.jsx` — "Otomatik Gönder" / "Mail
  Tasla" / "Sadece Link" / "Link Kopyala" aksiyonları ve mail önizlemesi

Backend uç noktaları yayına alındığı an, admin panelinden "Otomatik Gönder"
butonu çalışır; ayrıca webhook otomasyonu yurt dışı / müşteri hatası ayrımı
olmadan tüm satın alımlarda çalışmaya başlar.

---

## 1. Akış (happy path)

```
Shopier ödeme
     │
     ▼
POST /shopier/webhook                (Railway, var olan)
     │
     ├─ shopier_purchases INSERT
     │
     ├─ if content_id = role_unlock:
     │     ├─ user_deliverables UPSERT  (açılım metni)
     │     └─ enqueue "send_role_unlock_email"  (yeni)
     │
     ▼
send_role_unlock_email(user_id / email, deliverable_id)
     │
     ├─ compose e-mail  (subject + html/text + access link)
     ├─ sendgrid / resend / postmark / smtp
     └─ user_deliverables.email_sent_at = now()
```

Yetişemezse veya `email_sent_at` boş kalırsa:
- Admin **AdminDeliverablesPage** → "Otomatik Gönder" → **POST**
  `/admin/deliverables/:id/send-email` aynı kodu çalıştırır
- Veya **POST** `/admin/deliverables/send-access-link` yalnızca erişim linki
  maili atar (deliverable yoksa)

---

## 2. DB migration

`user_deliverables` tablosuna mail takibi için aşağıdaki kolonları ekle:

```sql
ALTER TABLE user_deliverables
  ADD COLUMN IF NOT EXISTS email_sent_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_send_count  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS email_last_error  TEXT;

CREATE INDEX IF NOT EXISTS idx_user_deliverables_email_sent_at
  ON user_deliverables (email_sent_at);
```

Admin listesi zaten `email_sent_at` alanını render ediyor (varsa rozet
olarak gösteriliyor), ek frontend değişikliği gerekmez.

---

## 3. Transactional mail sağlayıcısı

İki öneri (ikisi de düşük trafikte ücretsiz):

| Sağlayıcı | Avantaj | Entegrasyon |
|-----------|---------|-------------|
| **Resend** | En az kurulum, modern API, domain onayı kolay | `POST https://api.resend.com/emails` |
| **Postmark** | Yüksek deliverability, düzgün reporting | `POST https://api.postmarkapp.com/email` |

Gerekli env değişkenleri (Railway):

```
MAIL_PROVIDER=resend
MAIL_FROM="SANRI <selin@asksanri.com>"
MAIL_REPLY_TO=selin@asksanri.com
RESEND_API_KEY=...              # veya POSTMARK_SERVER_TOKEN
MAIL_SITE_URL=https://asksanri.com
```

DNS tarafında **DKIM + SPF + DMARC** kayıtları eklenmeli (sağlayıcının
verdiği değerlerle). Aksi halde Gmail/Outlook spam'e atar.

---

## 4. Yeni uç noktalar

### 4.1 Webhook hook (otomatik, içeride)

Mevcut Shopier webhook handler'ı içinde `content_id == "role_unlock"` koşulu
sağlanıyorsa `user_deliverables` oluşturulduktan sonra:

```python
if content_id == "role_unlock" and deliverable is not None:
    await email_deliverable(deliverable_id=deliverable.id, force=False)
```

`email_deliverable(...)`:
1. Satırı çek, `email_sent_at` zaten doluysa ve `force` False ise pas geç
2. `access_link = f"{MAIL_SITE_URL}/odeme-basarili?content={content_id}&email={quote(email)}&src=mail"`
3. `subject`, `text`, `html` üret (bkz. §5)
4. Provider API'ına POST et
5. Başarı: `email_sent_at = now(), email_send_count += 1, email_last_error = null`
6. Hata: `email_last_error = str(e)`; log'a yaz; kuyrukta retry (3x, exp backoff)

### 4.2 `POST /admin/deliverables/:id/send-email`

- **Auth**: admin JWT (mevcut `require_admin` dependency)
- **Body**: `{ lang?: "tr"|"en" (default "tr"), force?: bool (default false), access_link?: string }`
- **Davranış**: yukarıdaki `email_deliverable(id, force=body.force, lang=body.lang, access_link_override=body.access_link)`
- **Response**:
  ```json
  {
    "ok": true,
    "deliverable_id": 123,
    "email": "zeynep@...",
    "email_sent_at": "2026-04-21T20:15:02Z",
    "provider_message_id": "..."
  }
  ```
- **Hata**: 404 satır yok, 409 email yok, 502 provider hatası.

### 4.3 `POST /admin/deliverables/send-access-link`

Deliverable henüz üretilmediği ama Shopier satın alımı mevcut olduğu için
müşteriye yalnızca erişim linki göndermek istendiğinde.

- **Body**:
  ```json
  {
    "email": "zeynep@...",
    "content_id": "role_unlock",
    "lang": "tr",
    "access_link": "https://asksanri.com/odeme-basarili?content=role_unlock&email=zeynep%40..."
  }
  ```
- **Davranış**:
  1. `shopier_purchases` içinde bu `email` + `content_id` için `payment_status = "success"` kaydı ara. Yoksa 404.
  2. §5 short template ile mail gönder.
  3. Opsiyonel: `email_send_log` tablosuna yaz (audit için).

---

## 5. Mail şablonu

Frontend `buildDeliverableEmail` ile birebir aynı düz metin yapısını
üretiyor; backend bunu HTML'e çevirebilir. Tavsiye edilen yapı:

**Konu**
- TR: `SANRI — {title} açılımınız hazır`
- EN: `SANRI — your {title} is ready`

**Gövde (text)**

```
Merhaba,

Satın aldığın Matrix Rol Okuma açılımın aşağıda. İstediğin zaman
hesabından tekrar görmek için aşağıdaki tek tık linkini kullanabilirsin:

Açılıma erişim linkin: {access_link}

— — — — — — — — — —

{deliverable_title}
─────────────────────

{preview_text}

— Özet —
{summary_line_1}
{summary_line_2}
...

{section_1_heading}
{section_1_body}

{section_2_heading}
{section_2_body}

— — — — — — — — — —

Sorun, görüş ya da ek bilgi için bu maili cevaplaman yeterli.

SANRI
selin@asksanri.com
```

**Gövde (HTML)** — kısa öneri: siyah arka plan, açık gri tipografi, altın
vurgu. Butonlar için `<a>` (table + inline CSS).

Anahtar kurallar:
- Footer'da "Bu maili ... satın aldığın için aldın" cümlesi (CAN‑SPAM/KVKK).
- Unsubscribe değil — transactional mail; ama `Reply-To` mutlaka
  `selin@asksanri.com`.
- Her mailde unique `Message-ID`; backend tarafından tutulmalı.

---

## 6. İdempotency & yeniden gönderim

- `email_sent_at` var **ve** `force=false` → pas geç, **ok** dön.
- Provider 5xx döndüyse queue retry (max 3).
- Admin force gönderdiğinde `email_send_count += 1` ama `email_sent_at` üstüne yaz.

---

## 7. Adım adım yapılacaklar (Railway repo)

1. Migration çalıştır (§2).
2. `MAIL_*` env değişkenlerini Railway'e gir.
3. `app/email/provider.py` (yeni) — `send_mail(to, subject, text, html)`.
4. `app/email/templates/role_unlock.py` (yeni) — §5 şablonu.
5. `app/services/deliverable_email.py` (yeni) — `email_deliverable(...)`.
6. Webhook handler'da §4.1 kancasını ekle.
7. Yeni iki admin endpoint (`/admin/deliverables/:id/send-email`,
   `/admin/deliverables/send-access-link`) — JWT korumalı.
8. Admin `GET /admin/deliverables` response'una
   `email_sent_at`, `email_send_count`, `email_last_error` ekle.
9. Staging'de end‑to‑end test:
   - Shopier sandbox satın alma → mail inbox'a düşüyor mu?
   - Admin "Otomatik Gönder" → `email_sent_at` güncelleniyor mu?
   - Rol linkine tıklayınca `/odeme-basarili` → `/rol-okuma` unlock oluyor mu?
10. Production deploy, spam test (mail-tester.com), DKIM doğrulama.

---

## 8. Bugünkü açık satın alımlar (elle kurtarma)

Şu an beklemede olduğu bilinen müşteriler için backend hazır olana kadar
admin panelinden **AdminDeliverablesPage** → "Mail Tasla (Açılım + Link)"
veya "Sadece Link" butonu ile elle gönderilebilir. Link formatı:

```
https://asksanri.com/odeme-basarili?content=role_unlock&email={EMAIL}&src=mail
```

Bu link `verifyPurchaseByEmail` üzerinden satın alımı doğrulayıp içeriği
kullanıcıya açar (mevcut `OdemeBasariliPage` akışı).
