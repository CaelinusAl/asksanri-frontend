/* ═══════════════════════════════════════════════════
   SHOPIER PAYMENT CONFIGURATION — Multi-tier
   Server-side purchase persistence + localStorage cache
   ═══════════════════════════════════════════════════ */

const SITE_URL =
  (typeof window !== "undefined" && window.location.origin) ||
  "https://asksanri.com";

const API =
  (typeof window !== "undefined" &&
    import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

export const SHOPIER_PRODUCTS = {
  okuma_devami: {
    id: "okuma_devami",
    label: "Okuma Devamı",
    price: "9.90",
    url: "https://shopier.com/asksanri/45786803",
  },
  kod_egitmeni: {
    id: "kod_egitmeni",
    label: "Kod Eğitmeni — Tam Erişim",
    price: "49",
    url: "https://shopier.com/asksanri/45786456",
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
    url: "https://shopier.com/asksanri/45786763",
  },
  para_akisi: {
    id: "para_akisi",
    label: "Para Akışı Açılımı",
    price: "369",
    url: "https://shopier.com/asksanri/45786763",
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
    url: "https://shopier.com/asksanri/45786763",
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
    url: "https://shopier.com/asksanri/45786763",
  },
};

/** localStorage unlock key → SHOPIER_PRODUCTS key (labels, server record, analytics) */
export const CONTENT_TO_PRODUCT = {
  role_unlock: "rol_okuma",
  ankod_unlock: "ankod",
  subconscious_unlock: "ankod",
};

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

export function isShopierUnlocked(contentId) {
  const access = getShopierAccess();
  if (access.premium) return true;
  return Boolean(access[contentId]);
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

export function unlockViaShopier(contentId) {
  const access = getShopierAccess();
  if (contentId === "premium") {
    access.premium = true;
    access.premium_at = new Date().toISOString();
  } else {
    access[contentId] = { unlocked: true, at: new Date().toISOString() };
  }
  saveShopierAccess(access);
  recordPurchaseToServer(contentId);
}

export function recordPurchaseToServer(contentId) {
  const productKey = CONTENT_TO_PRODUCT[contentId] || contentId;
  const product = SHOPIER_PRODUCTS[productKey];
  return fetch(`${API}/shopier/record`, {
    method: "POST",
    headers: _getAuthHeaders(),
    body: JSON.stringify({
      content_id: contentId,
      product_id: product?.id || productKey,
      device_fp: getDeviceFingerprint(),
      amount: product ? parseFloat(product.price) : 0,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});
}

export async function syncPurchasesFromServer() {
  try {
    const fp = getDeviceFingerprint();
    const res = await fetch(
      `${API}/shopier/my-purchases?device_fp=${fp}`,
      { headers: _getAuthHeaders() }
    );
    const data = await res.json();
    if (!data.purchases?.length) return 0;
    const access = getShopierAccess();
    let changed = 0;
    for (const p of data.purchases) {
      if (!access[p.content_id]) {
        access[p.content_id] = { unlocked: true, at: p.purchased_at };
        changed++;
      }
    }
    if (changed) saveShopierAccess(access);
    return changed;
  } catch {
    return 0;
  }
}

export async function checkServerUnlock(contentId) {
  try {
    const fp = getDeviceFingerprint();
    const res = await fetch(
      `${API}/shopier/check/${contentId}?device_fp=${fp}`,
      { headers: _getAuthHeaders() }
    );
    const data = await res.json();
    if (data.unlocked) {
      const access = getShopierAccess();
      if (!access[contentId]) {
        access[contentId] = { unlocked: true, at: data.purchased_at || new Date().toISOString() };
        saveShopierAccess(access);
      }
    }
    return data.unlocked;
  } catch {
    return false;
  }
}

export function getUnlockedItems() {
  const access = getShopierAccess();
  const items = [];
  for (const [key, val] of Object.entries(access)) {
    if (key === "premium" && val) {
      items.push({ id: "premium", label: "Premium Erişim", at: access.premium_at });
    } else if (val?.unlocked) {
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
  const returnUrl = `${SITE_URL}/odeme-basarili?key=${key}&content=${encodeURIComponent(
    contentId || ""
  )}&ref=${encodeURIComponent(returnPath || "/")}`;

  const shopierUrl = `${product.url}?dpiurl=${encodeURIComponent(returnUrl)}`;
  window.location.href = shopierUrl;
}

export function hasAnyShopierPremium() {
  return Boolean(getShopierAccess().premium);
}
