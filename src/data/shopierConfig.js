/* ═══════════════════════════════════════════════════
   SHOPIER PAYMENT CONFIGURATION
   ═══════════════════════════════════════════════════
   Product links and access management for Shopier integration.
   Update SHOPIER_PRODUCTS with your actual Shopier product URLs.
*/

const SITE_URL =
  (typeof window !== "undefined" && window.location.origin) ||
  "https://asksanri.com";

// ── Shopier product definitions ──
// Replace the `url` values with your actual Shopier product links.
export const SHOPIER_PRODUCTS = {
  premium_monthly: {
    id: "premium_monthly",
    label: "SANRI Premium (Aylık)",
    price: "99.90",
    url: "https://shopier.com/asksanri/45786456",
  },
  kod_egitmeni: {
    id: "kod_egitmeni",
    label: "Kod Eğitmeni — Tam Erişim",
    price: "49.90",
    url: "https://shopier.com/asksanri/45786456",
  },
  single_okuma: {
    id: "single_okuma",
    label: "Tek Okuma Erişimi",
    price: "9.90",
    url: "https://shopier.com/asksanri/45786456",
  },
  library_book: {
    id: "library_book",
    label: "Kitap Erişimi",
    price: "19.90",
    url: "https://shopier.com/asksanri/45786456",
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
  return Boolean(access.premium || access[contentId]);
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
 * Redirect to Shopier with return URL.
 * After payment, Shopier redirects back to /odeme-basarili with params.
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
