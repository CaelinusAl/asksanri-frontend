#!/usr/bin/env node
/**
 * Titan SMTP üzerinden Matrix Rol Okuma erişim linki maili gönderir.
 *
 * Kullanım:
 *   # Tek müşteri:
 *   node scripts/send-role-unlock-mail.mjs zeynepyanturali@hotmail.com
 *
 *   # Birden çok müşteri (boşluk ya da yeni satırla ayrılmış):
 *   node scripts/send-role-unlock-mail.mjs zeynep@... ceyla@... burcin@...
 *
 *   # İsimle birlikte (opsiyonel, mail gövdesinde "Merhaba <isim>," der):
 *   node scripts/send-role-unlock-mail.mjs "Zeynep <zeynep@hotmail.com>"
 *
 *   # Kuru çalıştırma (SMTP'ye basmaz, sadece ne atacağını gösterir):
 *   node scripts/send-role-unlock-mail.mjs --dry-run zeynep@...
 *
 * Gerekli env (bir kere girilip kaydedilebilir):
 *   SMTP_USER=selin@asksanri.com
 *   SMTP_PASS=<titan_mail_şifren>
 *   SMTP_HOST=smtp.titan.email           (varsayılan)
 *   SMTP_PORT=465                        (varsayılan; 587 de olur)
 *   SMTP_FROM="SANRI <selin@asksanri.com>"  (opsiyonel)
 *   SITE_URL=https://asksanri.com        (varsayılan)
 *
 * PowerShell örneği:
 *   $env:SMTP_USER="selin@asksanri.com"
 *   $env:SMTP_PASS="xxxxxx"
 *   node scripts/send-role-unlock-mail.mjs zeynepyanturali@hotmail.com ceylakartal87@gmail.com burcinyilmaz3401@gmail.com
 */

import nodemailer from "nodemailer";

const SITE = (process.env.SITE_URL || "https://asksanri.com").replace(/\/$/, "");
const SMTP_HOST = process.env.SMTP_HOST || "smtp.titan.email";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM = process.env.SMTP_FROM || `SANRI <${SMTP_USER || "selin@asksanri.com"}>`;
const REPLY_TO = process.env.SMTP_REPLY_TO || "selin@asksanri.com";

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const targets = argv.filter((a) => a !== "--dry-run").filter(Boolean);

if (targets.length === 0) {
  console.error("Hata: en az bir e-posta adresi ver.");
  console.error(
    "Örnek: node scripts/send-role-unlock-mail.mjs zeynepyanturali@hotmail.com"
  );
  process.exit(1);
}

if (!dryRun && (!SMTP_USER || !SMTP_PASS)) {
  console.error(
    "Hata: SMTP_USER ve SMTP_PASS env değişkenlerini ayarla. (--dry-run ile test edebilirsin)"
  );
  process.exit(1);
}

function parseTarget(raw) {
  // "İsim <mail@x>" ya da "mail@x" formatı
  const m = String(raw).trim().match(/^\s*([^<]+?)\s*<([^>]+)>\s*$/);
  if (m) {
    return { name: m[1].trim(), email: m[2].trim().toLowerCase() };
  }
  return { name: "", email: String(raw).trim().toLowerCase() };
}

function buildAccessLink(email, contentId = "role_unlock") {
  const params = new URLSearchParams();
  params.set("content", contentId);
  params.set("email", email);
  params.set("src", "mail");
  return `${SITE}/odeme-basarili?${params.toString()}`;
}

function buildMail({ name, email }) {
  const greetingName = name ? ` ${name}` : "";
  const accessLink = buildAccessLink(email);
  const subject = "SANRI — Matrix Rol Okuma erişim linkin";
  const text = [
    `Merhaba${greetingName},`,
    "",
    "SANRI'dan Matrix Rol Okuma satın alımın için teşekkür ederim.",
    "Açılımına aşağıdaki tek tık linki ile ulaşabilirsin:",
    "",
    accessLink,
    "",
    "Bu link mail adresinle eşleşen satın alımını doğrular ve Matrix Rol",
    "okuman kendi cihazında açılır. İstediğin zaman \"Benim Alanım\"",
    "sayfasından tekrar görebilirsin.",
    "",
    "Takıldığın bir yer olursa bu maili doğrudan cevaplaman yeterli.",
    "",
    "SANRI",
    "selin@asksanri.com",
  ].join("\n");

  const html = `<!doctype html>
<html lang="tr">
<body style="margin:0;padding:24px;background:#0b0b10;color:#e9e9f0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;">
  <div style="max-width:560px;margin:0 auto;background:#111117;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;">
    <div style="font-family:Georgia,serif;font-size:18px;letter-spacing:0.18em;color:#d4af37;text-transform:uppercase;margin-bottom:18px;">SANRI</div>
    <h1 style="font-size:20px;font-weight:600;margin:0 0 14px;color:#fff;">Matrix Rol Okuma erişim linkin</h1>
    <p style="margin:0 0 12px;">Merhaba${greetingName},</p>
    <p style="margin:0 0 12px;">SANRI'dan <strong>Matrix Rol Okuma</strong> satın alımın için teşekkür ederim. Açılımına aşağıdaki tek tık linki ile ulaşabilirsin:</p>
    <p style="margin:20px 0;text-align:center;">
      <a href="${accessLink}" style="display:inline-block;background:#d4af37;color:#0b0b10;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:12px;letter-spacing:0.04em;">Açılımımı Aç</a>
    </p>
    <p style="margin:0 0 12px;font-size:13px;color:rgba(233,233,240,0.65);">Buton açılmazsa: <a style="color:#d4af37;word-break:break-all;" href="${accessLink}">${accessLink}</a></p>
    <p style="margin:18px 0 12px;">Bu link mail adresinle eşleşen satın alımını doğrular ve Matrix Rol okuman kendi cihazında açılır. İstediğin zaman <em>Benim Alanım</em> sayfasından tekrar görebilirsin.</p>
    <p style="margin:0 0 12px;">Takıldığın bir yer olursa bu maili doğrudan cevaplaman yeterli.</p>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:22px 0;" />
    <p style="margin:0;font-size:13px;color:rgba(233,233,240,0.55);">SANRI · <a style="color:#d4af37;" href="mailto:selin@asksanri.com">selin@asksanri.com</a></p>
  </div>
</body></html>`;

  return { subject, text, html, accessLink };
}

async function main() {
  const parsed = targets.map(parseTarget);
  for (const t of parsed) {
    if (!t.email || !t.email.includes("@")) {
      console.warn(`Atla (geçersiz adres): ${JSON.stringify(t)}`);
    }
  }

  if (dryRun) {
    console.log(`DRY RUN — ${parsed.length} mail üretilecek (gönderilmez):\n`);
    for (const t of parsed) {
      const mail = buildMail(t);
      console.log("─".repeat(60));
      console.log(`To:      ${t.email}${t.name ? ` (${t.name})` : ""}`);
      console.log(`Subject: ${mail.subject}`);
      console.log(`Link:    ${mail.accessLink}`);
      console.log("");
      console.log(mail.text);
      console.log("");
    }
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  console.log(`SMTP doğrulanıyor (${SMTP_HOST}:${SMTP_PORT})...`);
  try {
    await transporter.verify();
    console.log("  ✓ SMTP bağlantısı tamam.\n");
  } catch (e) {
    console.error("  ✗ SMTP doğrulama başarısız:", e?.message || e);
    console.error(
      "  İpucu: Titan'da mail şifreni kullan (hesap şifresi değil). 2FA açıksa uygulama şifresi oluştur."
    );
    process.exit(2);
  }

  let sent = 0;
  let failed = 0;
  for (const t of parsed) {
    if (!t.email || !t.email.includes("@")) {
      failed += 1;
      continue;
    }
    const mail = buildMail(t);
    process.stdout.write(`→ ${t.email}  `);
    try {
      const info = await transporter.sendMail({
        from: FROM,
        to: t.name ? `${t.name} <${t.email}>` : t.email,
        replyTo: REPLY_TO,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
      sent += 1;
      console.log(`✓ ${info.messageId}`);
    } catch (e) {
      failed += 1;
      console.log(`✗ ${e?.message || e}`);
    }
  }

  console.log(`\nBitti. Gönderildi: ${sent}  Hata: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
