/**
 * Rol Okuma / kişisel teslimat mailleri için yardımcılar.
 *
 * İki amaçla kullanılır:
 *  1) Admin panelinde "Mail Tasla" butonu — mailto: linki ile yerel mail
 *     istemcisinde hazır bir taslak açar (backend bağımlılığı yok).
 *  2) Backend otomasyonu devreye girdiğinde aynı link formatı ve içerik
 *     gövdesi kullanılır; bu sayede kullanıcının gördüğü mailin yapısı
 *     manuel ve otomatik gönderimlerde aynı kalır.
 */

const DEFAULT_SITE =
  (typeof window !== "undefined" && window.location && window.location.origin) ||
  "https://asksanri.com";

/** Müşteriye gönderilecek tek tık erişim linki. */
export function buildAccessLink({
  email,
  contentId = "role_unlock",
  site = DEFAULT_SITE,
} = {}) {
  const em = String(email || "").trim().toLowerCase();
  const cid = encodeURIComponent(String(contentId || "role_unlock"));
  const params = new URLSearchParams();
  params.set("content", cid);
  if (em) params.set("email", em);
  params.set("src", "mail");
  return `${site.replace(/\/$/, "")}/odeme-basarili?${params.toString()}`;
}

/**
 * Kişisel teslimat payload'ını düz metne çevirir (mailto body için).
 * Backend bu formatın aynısını HTML/metin olarak kullanabilir.
 */
export function renderDeliverablePlainText(row) {
  if (!row || typeof row !== "object") return "";
  const payload = row.payload || {};
  const title = row.title || row.card_title || payload.title || "Matrix Rol Okuma";
  const preview = row.preview_text || payload.preview_text || "";
  const summaryLines = Array.isArray(payload.summary_lines) ? payload.summary_lines : [];
  const sections = Array.isArray(payload.sections) ? payload.sections : [];

  const out = [];
  out.push(title);
  out.push("─".repeat(Math.min(40, Math.max(12, title.length))));
  if (preview) {
    out.push("");
    out.push(preview);
  }
  if (summaryLines.length) {
    out.push("");
    out.push("— Özet —");
    summaryLines.forEach((line) => {
      if (line) out.push(String(line));
    });
  }
  sections.forEach((s) => {
    if (!s) return;
    const h = String(s.heading || "").trim();
    const body = String(s.body || "").trim();
    out.push("");
    if (h) out.push(h);
    if (body) out.push(body);
  });
  return out.join("\n");
}

/**
 * Müşteriye gönderilecek mailin konu + gövdesini üretir.
 * lang: "tr" | "en"
 */
export function buildDeliverableEmail({ row, email, lang = "tr", site } = {}) {
  const isTR = lang !== "en";
  const name = row?.card_title || row?.title || (isTR ? "Matrix Rol Okuma" : "Matrix Role Reading");
  const accessLink = buildAccessLink({
    email,
    contentId: row?.content_id || "role_unlock",
    site,
  });
  const content = renderDeliverablePlainText(row);

  const subject = isTR
    ? `SANRI — ${name} açılımınız hazır`
    : `SANRI — your ${name} is ready`;

  const greeting = isTR ? "Merhaba," : "Hi,";
  const introTR =
    "Satın aldığın Matrix Rol Okuma açılımın aşağıda. İstediğin zaman hesabından tekrar görmek için aşağıdaki tek tık linkini kullanabilirsin:";
  const introEN =
    "Your purchased Matrix Role Reading is below. You can revisit it any time via the one-click link:";
  const linkLabelTR = "Açılıma erişim linkin";
  const linkLabelEN = "Your access link";
  const signatureTR =
    "Sorun, görüş ya da ek bilgi için bu maili cevaplaman yeterli.\n\nSANRI\nselin@asksanri.com";
  const signatureEN =
    "Feel free to reply to this email for questions or follow-ups.\n\nSANRI\nselin@asksanri.com";

  const body = [
    greeting,
    "",
    isTR ? introTR : introEN,
    "",
    `${isTR ? linkLabelTR : linkLabelEN}: ${accessLink}`,
    "",
    "— — — — — — — — — —",
    "",
    content,
    "",
    "— — — — — — — — — —",
    "",
    isTR ? signatureTR : signatureEN,
  ].join("\n");

  return { subject, body, accessLink };
}

/**
 * mailto: URI üretir. Çok uzun metinlerde bazı istemciler kırpabilir,
 * o yüzden gövdeyi panoya kopyalama fallback'i UI tarafında önerilir.
 */
export function buildDeliverableMailto({ row, email, lang = "tr", site } = {}) {
  const em = String(email || "").trim();
  if (!em) return "";
  const { subject, body } = buildDeliverableEmail({ row, email: em, lang, site });
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  return `mailto:${encodeURIComponent(em)}?${params.toString()}`;
}

/**
 * Kısa erişim maili — payload'a gerek yok, sadece link gönderir.
 * "Mailini açtım, sen de alabilirsin" tarzı hızlı kurtarma senaryoları için.
 */
export function buildAccessOnlyMailto({ email, contentId = "role_unlock", lang = "tr", site } = {}) {
  const em = String(email || "").trim();
  if (!em) return "";
  const isTR = lang !== "en";
  const link = buildAccessLink({ email: em, contentId, site });
  const subject = isTR
    ? "SANRI — Matrix Rol Okuma erişim linkin"
    : "SANRI — your Matrix Role Reading access";
  const body = isTR
    ? `Merhaba,\n\nMatrix Rol Okuma erişimini açmak için aşağıdaki linke tıklaman yeterli:\n\n${link}\n\nBu link mail adresinle eşleşen satın alımını doğrular ve içerik sende açılır. Takıldığın yer olursa bu maile cevap verebilirsin.\n\nSANRI\nselin@asksanri.com`
    : `Hi,\n\nClick the link below to unlock your Matrix Role Reading:\n\n${link}\n\nThis link verifies your purchase against your email and opens the content on your device. Reply any time if anything feels off.\n\nSANRI\nselin@asksanri.com`;
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  return `mailto:${encodeURIComponent(em)}?${params.toString()}`;
}
