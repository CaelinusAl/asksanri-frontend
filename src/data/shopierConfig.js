/* ═══════════════════════════════════════════════════
   SHOPIER PAYMENT CONFIGURATION — Multi-tier
   Server-side purchase persistence + localStorage cache
   ═══════════════════════════════════════════════════ */

const SITE_URL =
  (typeof window !== "undefined" && window.location.origin) ||
  "https://asksanri.com";

/** Shopier ödeme sonrası yönlendirme — her zaman canlı domain (preview/local origin değil) */
const SHOPIER_SUCCESS_ORIGIN =
  (import.meta?.env?.VITE_SITE_URL &&
    String(import.meta.env.VITE_SITE_URL).replace(/\/$/, "")) ||
  "https://asksanri.com";

const API =
  (typeof window !== "undefined" &&
    import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

/**
 * 47 TL “SANRI Kod Eğitmeni — Giriş Katmanı” (Shopier ürün kodu 45786456).
 * 9,90 TL ile karıştırma: 45786803 = okuma devamı / haftalık akış vb.
 */
const DEFAULT_KOD_GIRIS_SHOPIER_PATH = "45786456";
const KOD_GIRIS_SHOPIER_URL = String(
  import.meta.env?.VITE_SHOPIER_KOD_GIRIS_URL || ""
).trim() || `https://shopier.com/asksanri/${DEFAULT_KOD_GIRIS_SHOPIER_PATH}`;

export const SHOPIER_PRODUCTS = {
  okuma_devami: {
    id: "okuma_devami",
    label: "Okuma Devamı",
    price: "9.90",
    url: "https://shopier.com/asksanri/45786803",
  },
  kod_egitmeni: {
    id: "kod_egitmeni",
    label: "SANRI Kod Okuma Sistemi™ — Tam Erişim",
    price: "999",
    url: "https://shopier.com/asksanri/45833965",
  },
  kod_giris_ders: {
    id: "kod_giris_ders",
    label: "Kod Öğrenmeye Giriş — Canlı Ders",
    price: "47",
    url: KOD_GIRIS_SHOPIER_URL,
  },
  kitap_112: {
    id: "kitap_112",
    label: "112. Kitap: Kendini Yaratan Tanrıça",
    price: "369",
    url: "https://shopier.com/asksanri/45786763",
  },
  matrix_code: {
    id: "matrix_code",
    label: "Matrix Code: İkra",
    price: "470",
    url: "https://shopier.com/asksanri/45786667",
  },
  rol_okuma: {
    id: "rol_okuma",
    label: "Matrix Rol Okuma — Tam Analiz",
    price: "369",
    url: "https://shopier.com/asksanri/45812975",
  },
  iliski_acilimi: {
    id: "iliski_acilimi",
    label: "İlişki Açılımı",
    price: "369",
    url: "https://shopier.com/asksanri/45812975",
  },
  para_akisi: {
    id: "para_akisi",
    label: "Para Akışı Açılımı",
    price: "369",
    url: "https://shopier.com/asksanri/45812975",
  },
  ankod: {
    id: "ankod",
    label: "AN_KOD — Anın Kodları Tam Analiz",
    price: "99",
    url: "https://shopier.com/asksanri/45813111",
  },
  bilinc_alti: {
    id: "bilinc_alti",
    label: "Bilinçaltın Ne Diyor? — Derin Okuma",
    price: "99",
    url: "https://shopier.com/asksanri/45813111",
  },
  kariyer_acilimi: {
    id: "kariyer_acilimi",
    label: "Kariyer Açılımı",
    price: "369",
    url: "https://shopier.com/asksanri/45812975",
  },
  haftalik_akis: {
    id: "haftalik_akis",
    label: "Haftalık Akış — Bu Haftanın Kodu",
    price: "69",
    url: "https://shopier.com/asksanri/45786803",
  },
  saglik_enerji: {
    id: "saglik_enerji",
    label: "Sağlık & Enerji Katmanı",
    price: "369",
    url: "https://shopier.com/asksanri/45812975",
  },
  genel_derin_acilim: {
    id: "genel_derin_acilim",
    label: "Genel Derin Açılım",
    price: "369",
    url: "https://shopier.com/asksanri/45812975",
  },
};

/** localStorage unlock key → SHOPIER_PRODUCTS key (labels, server record, analytics) */
export const CONTENT_TO_PRODUCT = {
  role_unlock: "rol_okuma",
  ankod_unlock: "ankod",
  subconscious_unlock: "ankod",
  deep_iliski_unlock: "iliski_acilimi",
  deep_kariyer_unlock: "kariyer_acilimi",
  deep_genel_unlock: "genel_derin_acilim",
};

/**
 * Ödeme başarı sayfası: URL contentId + pending.productId ile Shopier ürünü, fiyat ve pixel id.
 * okuma_*, book_*, kod_* dinamik id'ler pending.productId veya prefix ile çözülür.
 */
export function resolveShopierPurchaseMeta(contentId, pendingProductId) {
  const cid = String(contentId || "").trim();
  const pid = String(pendingProductId || "").trim();

  const inferPurchaseKind = (c, productKey) => {
    if (c === "role_unlock" || productKey === "rol_okuma") return "role_unlock";
    if (c.startsWith("okuma_") || productKey === "okuma_devami") return "okuma_unlock";
    if (c === "ankod_unlock" || productKey === "ankod") return "ankod_unlock";
    if (productKey === "matrix_code") return "book_matrix";
    if (productKey === "kitap_112") return "book_112";
    if (productKey === "kod_giris_ders" || c === "kod_giris_ders") return "kod_giris_ders";
    if (productKey === "kod_egitmeni") return "kod_egitmeni";
    if (c.startsWith("deep_") || productKey === "genel_derin_acilim") return "deep_acilim";
    return productKey || "other";
  };

  const build = (productKey, pixelContentId) => {
    const p = SHOPIER_PRODUCTS[productKey];
    if (!p) return null;
    const raw = parseFloat(p.price);
    const actualPrice = Number.isFinite(raw) ? raw : 0;
    return {
      productKey,
      productTitle: p.label,
      actualPrice,
      pixelContentId: pixelContentId || cid || productKey,
      purchaseKind: inferPurchaseKind(cid, productKey),
    };
  };

  if (pid && SHOPIER_PRODUCTS[pid]) {
    const m = build(pid, cid || pid);
    if (m) return m;
  }
  if (cid && SHOPIER_PRODUCTS[cid]) {
    const m = build(cid, cid);
    if (m) return m;
  }
  const mapped = CONTENT_TO_PRODUCT[cid];
  if (mapped && SHOPIER_PRODUCTS[mapped]) {
    const m = build(mapped, cid);
    if (m) return m;
  }
  if (cid.startsWith("okuma_")) {
    const m = build("okuma_devami", cid);
    if (m) return m;
  }
  if (cid.startsWith("book_")) {
    const suffix = cid.slice("book_".length);
    if (suffix && SHOPIER_PRODUCTS[suffix]) {
      const m = build(suffix, cid);
      if (m) return m;
    }
  }
  if (cid.startsWith("kod_")) {
    const m = build("kod_egitmeni", cid);
    if (m) return m;
  }

  return {
    productKey: null,
    productTitle: cid || "purchase",
    actualPrice: 0,
    pixelContentId: cid || pid || "unknown",
    purchaseKind: "unknown",
  };
}

// ── Device fingerprint (stable per browser) ──
const FP_KEY = "sanri_device_fp";

export function getDeviceFingerprint() {
  try {
    let fp = localStorage.getItem(FP_KEY);
    if (!fp) {
      fp =
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 10) +
        Math.random().toString(36).slice(2, 6);
      localStorage.setItem(FP_KEY, fp);
    }
    return fp;
  } catch {
    return "anon";
  }
}

// ── Access key management (localStorage cache) ──
const SHOPIER_ACCESS_KEY = "sanri_shopier_access";
const SHOPIER_PENDING_KEY = "sanri_shopier_pending";

function generateAccessKey() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  );
}

export function getShopierAccess() {
  try {
    return JSON.parse(localStorage.getItem(SHOPIER_ACCESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveShopierAccess(data) {
  try {
    localStorage.setItem(SHOPIER_ACCESS_KEY, JSON.stringify(data));
  } catch {}
}

function accessRowTrusted(row) {
  if (!row || row === true) return false;
  return Boolean(row.unlocked && row.serverVerified);
}

export function isShopierUnlocked(contentId) {
  const access = getShopierAccess();
  if (access.premium && access.premiumServerVerified) return true;
  if (accessRowTrusted(access[contentId])) return true;
  if (String(contentId).startsWith("okuma_") && contentId !== "okuma_devami") {
    return accessRowTrusted(access["okuma_devami"]);
  }
  return false;
}

/**
 * Yalnızca bu contentId için Shopier kaydı var mı?
 * `premium` global bayrağı sayılmaz — SANRI Kod Okuma™ gibi ayrı ürünlerde
 * genel premium / başka satın alımların tüm müfredatı açmaması için kullanılır.
 */
export function isShopierProductUnlocked(contentId) {
  const cid = String(contentId || "").trim();
  if (!cid) return false;
  return accessRowTrusted(getShopierAccess()[cid]);
}

// ── Server-side purchase recording ──
function _getAuthHeaders() {
  const h = { "Content-Type": "application/json" };
  try {
    const t = localStorage.getItem("sanri_token");
    if (t) h["Authorization"] = `Bearer ${t}`;
  } catch {}
  return h;
}

/**
 * Yalnızca GET /shopier/check doğrulandıktan sonra çağrılmalı.
 * İstemci tek başına erişim açamaz (güvenlik).
 */
export function applyVerifiedShopierUnlock(contentId, purchasedAt) {
  const access = getShopierAccess();
  const at = purchasedAt || new Date().toISOString();
  if (contentId === "premium") {
    access.premium = true;
    access.premium_at = at;
    access.premiumServerVerified = true;
  } else {
    access[contentId] = { unlocked: true, serverVerified: true, at };
  }
  saveShopierAccess(access);
}

/** @deprecated Güvensiz — kullanmayın. */
export function unlockViaShopier(_contentId) {
  if (typeof console !== "undefined" && console.warn) {
    console.warn("[SANRI] unlockViaShopier kaldırıldı; erişim sunucu doğrulaması gerektirir.");
  }
}

export function recordPurchaseToServer(_contentId) {
  return Promise.resolve();
}

export async function syncPurchasesFromServer({ returnDetails = false, email = "" } = {}) {
  try {
    const fp = getDeviceFingerprint();
    const qs = new URLSearchParams();
    if (fp && fp !== "anon") qs.set("device_fp", fp);
    if (email && String(email).includes("@")) qs.set("email", String(email).trim().toLowerCase());
    const res = await fetch(
      `${API}/shopier/my-purchases?${qs.toString()}`,
      { headers: _getAuthHeaders() }
    );
    const data = await res.json();
    if (!data.purchases?.length) return returnDetails ? [] : 0;
    const access = getShopierAccess();
    let changed = 0;
    const newItems = [];
    for (const p of data.purchases) {
      const cur = access[p.content_id];
      if (!cur || !cur.serverVerified) {
        access[p.content_id] = {
          unlocked: true,
          serverVerified: true,
          at: p.purchased_at || cur?.at,
        };
        changed++;
        const pKey = CONTENT_TO_PRODUCT[p.content_id] || p.content_id;
        const product = SHOPIER_PRODUCTS[pKey];
        newItems.push({
          content_id: p.content_id,
          label: product?.label || p.product_name || p.content_id,
          at: p.purchased_at,
        });
      }
    }
    if (changed) saveShopierAccess(access);
    return returnDetails ? newItems : changed;
  } catch {
    return returnDetails ? [] : 0;
  }
}

export async function fetchShopierPurchaseCheck(contentId, email = "") {
  try {
    const fp = getDeviceFingerprint();
    const qs = new URLSearchParams();
    if (fp && fp !== "anon") qs.set("device_fp", fp);
    if (email && String(email).includes("@")) {
      qs.set("email", String(email).trim().toLowerCase());
    }
    const q = qs.toString();
    const cid = encodeURIComponent(String(contentId || ""));
    const res = await fetch(
      `${API}/shopier/check/${cid}${q ? `?${q}` : ""}`,
      { headers: _getAuthHeaders() }
    );
    if (!res.ok) return { unlocked: false, purchased_at: null, purchase: null };
    const data = await res.json();
    const purchase = data.purchase && typeof data.purchase === "object" ? data.purchase : null;
    const purchased_at =
      purchase?.purchased_at ?? data.purchased_at ?? null;
    return {
      unlocked: Boolean(data.unlocked),
      purchased_at,
      purchase,
    };
  } catch {
    return { unlocked: false, purchased_at: null, purchase: null };
  }
}

export async function bindShopierPurchaseEmail(email, contentId) {
  try {
    const res = await fetch(`${API}/shopier/bind-device`, {
      method: "POST",
      headers: { ..._getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(email || "").trim(),
        content_id: String(contentId || ""),
        device_fp: getDeviceFingerprint(),
      }),
    });
    return await res.json();
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function verifyPurchaseByEmail(email, contentId) {
  try {
    const res = await fetch(`${API}/shopier/verify-by-email`, {
      method: "POST",
      headers: { ..._getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(email || "").trim().toLowerCase(),
        content_id: String(contentId || ""),
      }),
    });
    if (!res.ok) return { unlocked: false, reason: "http_error" };
    return await res.json();
  } catch {
    return { unlocked: false, reason: "network_error" };
  }
}

export async function checkServerUnlock(contentId, email = "") {
  const data = await fetchShopierPurchaseCheck(contentId, email);
  if (data.unlocked) {
    applyVerifiedShopierUnlock(contentId, data.purchased_at || data.purchase?.purchased_at);
    return true;
  }
  if (String(contentId).startsWith("okuma_") && contentId !== "okuma_devami") {
    const fallback = await fetchShopierPurchaseCheck("okuma_devami", email);
    if (fallback.unlocked) {
      applyVerifiedShopierUnlock(contentId, fallback.purchased_at || fallback.purchase?.purchased_at);
      applyVerifiedShopierUnlock("okuma_devami", fallback.purchased_at || fallback.purchase?.purchased_at);
      return true;
    }
  }
  return false;
}

export function getUnlockedItems() {
  const access = getShopierAccess();
  const items = [];
  for (const [key, val] of Object.entries(access)) {
    if (key === "premium" && val && access.premiumServerVerified) {
      items.push({ id: "premium", label: "Premium Erişim", at: access.premium_at });
    } else if (val?.unlocked && val?.serverVerified) {
      const pKey = CONTENT_TO_PRODUCT[key] || key;
      const product = SHOPIER_PRODUCTS[pKey];
      items.push({
        id: key,
        label: product?.label || key,
        at: val.at,
      });
    }
  }
  return items;
}

export function setPendingPurchase(productId, contentId, returnPath) {
  const key = generateAccessKey();
  try {
    localStorage.setItem(
      SHOPIER_PENDING_KEY,
      JSON.stringify({ productId, contentId, returnPath, key, ts: Date.now() })
    );
  } catch {}
  return key;
}

export function getPendingPurchase() {
  try {
    const raw = localStorage.getItem(SHOPIER_PENDING_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.ts > 3600000) {
      localStorage.removeItem(SHOPIER_PENDING_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearPendingPurchase() {
  try {
    localStorage.removeItem(SHOPIER_PENDING_KEY);
  } catch {}
}

/**
 * Redirect to Shopier product page.
 * productId must match a key in SHOPIER_PRODUCTS.
 */
export function redirectToShopier(productId, contentId, returnPath) {
  const product = SHOPIER_PRODUCTS[productId];
  if (!product) return;

  try {
    if (window.__sanri_trackShopierRedirect) {
      window.__sanri_trackShopierRedirect(contentId || productId, parseFloat(product.price) || 0);
    }
  } catch {}

  const key = setPendingPurchase(productId, contentId, returnPath);
  const returnUrl = `${SHOPIER_SUCCESS_ORIGIN}/odeme-basarili?key=${key}&content=${encodeURIComponent(
    contentId || ""
  )}&ref=${encodeURIComponent(returnPath || "/")}`;

  const shopierUrl = `${product.url}?dpiurl=${encodeURIComponent(returnUrl)}`;
  window.location.href = shopierUrl;
}

export function hasAnyShopierPremium() {
  const a = getShopierAccess();
  return Boolean(a.premium && a.premiumServerVerified);
}
