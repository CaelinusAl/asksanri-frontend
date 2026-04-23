#!/usr/bin/env node
/**
 * Admin: e-posta(lar) ile müşteri satın alma & erişim durumunu hızlıca sorgula.
 *
 * Endpoint:
 *   GET /admin/accounting/customer?email=<email>
 *   GET /admin/deliverables?email=<email>
 *
 * Kullanım:
 *   SANRI_ADMIN_TOKEN=<jwt> node scripts/check-purchase.mjs <email1> [email2 ...]
 *
 * Token nasıl alınır:
 *   1) /admin/login sayfasından admin hesabıyla giriş yap.
 *   2) DevTools → Application → Local Storage → "sanri_token" değerini kopyala.
 *   3) PowerShell: $env:SANRI_ADMIN_TOKEN="eyJ..." ; node scripts/check-purchase.mjs ...
 *
 * VITE_BACKEND_URL env'i yoksa prod backend kullanılır.
 */

const API =
  process.env.VITE_BACKEND_URL ||
  process.env.SANRI_API ||
  "https://sanri-api-production-4a7b.up.railway.app";

const TOKEN = process.env.SANRI_ADMIN_TOKEN || process.env.ADMIN_TOKEN;
const emails = process.argv.slice(2).filter(Boolean);

if (!TOKEN) {
  console.error("❌ SANRI_ADMIN_TOKEN env değişkeni yok.");
  console.error("   PowerShell'de: $env:SANRI_ADMIN_TOKEN=\"<jwt>\"");
  process.exit(1);
}
if (emails.length === 0) {
  console.error("❌ En az bir e-posta argümanı gerekli.");
  console.error("   Örn: node scripts/check-purchase.mjs a@x.com b@y.com");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

async function fetchJson(path) {
  const res = await fetch(`${API}${path}`, { headers });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} — ${data?.detail || text.slice(0, 200)}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

function tryDate(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
  } catch {
    return String(v);
  }
}

function money(v, c = "TRY") {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString("tr-TR")} ${c}`;
}

async function checkOne(email) {
  console.log("\n" + "═".repeat(72));
  console.log(`📧 ${email}`);
  console.log("═".repeat(72));

  // 1) Muhasebe müşteri kaydı
  try {
    const c = await fetchJson(`/admin/accounting/customer?email=${encodeURIComponent(email)}`);

    const orders = c.orders || c.purchases || c.shopier_purchases || [];
    const user = c.user || c.users || null;
    const totals = c.totals || c.summary || null;

    if (user) {
      console.log(`👤 User: id=${user.id ?? "—"}  role=${user.role ?? "—"}  created=${tryDate(user.created_at)}`);
    } else {
      console.log("👤 User: (kayıt yok — Shopier satın alma yine bağımsız olabilir)");
    }

    if (totals) {
      const paid = totals.paid_total ?? totals.total_paid ?? totals.total;
      const cnt = totals.orders_count ?? totals.count;
      console.log(`💰 Toplam: ödenen=${money(paid)}  sipariş=${cnt ?? "—"}`);
    }

    if (!orders.length) {
      console.log("🧾 Sipariş kaydı: YOK (shopier_purchases boş)");
    } else {
      console.log(`🧾 Siparişler (${orders.length}):`);
      orders.forEach((o, i) => {
        console.log(
          `  ${i + 1}. ${tryDate(o.created_at)}` +
            `  | ${o.product_name || o.content_id || "?"}` +
            `  | ${money(o.amount, o.currency || "TRY")}` +
            `  | status=${o.status || o.payment_status || "?"}` +
            `  | order_id=${o.shopier_order_id || o.order_id || "?"}` +
            (o.content_id ? `  | content_id=${o.content_id}` : "")
        );
      });
    }
  } catch (e) {
    console.log(`❌ /admin/accounting/customer → ${e.message}`);
  }

  // 2) Kişisel teslimatlar (Matrix Rol Okuma çıktıları)
  try {
    const d = await fetchJson(`/admin/deliverables?email=${encodeURIComponent(email)}&limit=50`);
    const items = d.items || d.deliverables || d.rows || [];
    if (!items.length) {
      console.log("📦 Teslimat: YOK (user_deliverables boş) → rol okuma çıktısı henüz üretilmemiş / kullanıcıya düşmemiş olabilir");
    } else {
      console.log(`📦 Teslimatlar (${items.length}):`);
      items.forEach((it, i) => {
        console.log(
          `  ${i + 1}. ${tryDate(it.created_at)}` +
            `  | ${it.kind || it.type || it.product || "?"}` +
            `  | status=${it.status || "?"}` +
            (it.delivered_at ? `  | delivered=${tryDate(it.delivered_at)}` : "") +
            (it.id ? `  | id=${it.id}` : "")
        );
      });
    }
  } catch (e) {
    console.log(`⚠️  /admin/deliverables → ${e.message}`);
  }
}

(async () => {
  console.log(`🔌 Backend: ${API}`);
  console.log(`🔑 Token: ${TOKEN.slice(0, 12)}...${TOKEN.slice(-6)}`);
  for (const em of emails) {
    try {
      await checkOne(em.trim());
    } catch (e) {
      console.error(`💥 ${em}: ${e.message}`);
    }
  }
  console.log("\n" + "═".repeat(72));
  console.log("✅ Kontrol tamam.");
})();
