/* ═══════════════════════════════════════════════════
   SHOPIER PAYMENT CONFIGURATION — Multi-tier
   ═══════════════════════════════════════════════════
   FREE      : Nurun Frekansı, OKU
   MICRO 9.90: Okuma devamları
   CORE  49  : Kod Eğitmeni
   PREMIUM   : 112. Kitap (369₺), Matrix Code İkra (470₺)
*/

const SITE_URL =
  (typeof window !== "undefined" && window.location.origin) ||
  "https://asksanri.com";

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
};

// ── Access key management ──
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

export function unlockViaShopier(contentId) {
  const access = getShopierAccess();
  if (contentId === "premium") {
    access.premium = true;
    access.premium_at = new Date().toISOString();
  } else {
    access[contentId] = { unlocked: true, at: new Date().toISOString() };
  }
  saveShopierAccess(access);
}

export function getUnlockedItems() {
  const access = getShopierAccess();
  const items = [];
  for (const [key, val] of Object.entries(access)) {
    if (key === "premium" && val) {
      items.push({ id: "premium", label: "Premium Erişim", at: access.premium_at });
    } else if (val?.unlocked) {
      const product = SHOPIER_PRODUCTS[key];
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
