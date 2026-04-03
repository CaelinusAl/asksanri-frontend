/**
 * Unified analytics helper — sends events to GA4 + Meta Pixel.
 *
 * Usage:
 *   import { trackEvent, trackPurchase } from "../data/analytics";
 *   trackEvent("quiz_start", { quiz: "ankod" });
 *   trackPurchase("rol_okuma", 369);
 */

function gtag(...args) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

function fbq(...args) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
}

export function trackEvent(eventName, params = {}) {
  gtag("event", eventName, params);
  fbq("trackCustom", eventName, params);
}

/**
 * @param {string} [path]
 * @param {{ skipMetaPageView?: boolean }} [opts] — true on first SPA hit when index.html already fired fbq PageView
 */
export function trackPageView(path, opts = {}) {
  const { skipMetaPageView = false } = opts;
  const pagePath = path || window.location.pathname + window.location.search;
  const pageLocation = window.location.origin + pagePath;
  const pageTitle = typeof document !== "undefined" ? document.title : "";
  gtag("event", "page_view", {
    page_path: pagePath,
    page_location: pageLocation,
    page_title: pageTitle,
  });
  if (!skipMetaPageView) {
    fbq("track", "PageView");
  }
}

export function trackPurchase(contentId, value, currency = "TRY") {
  const cid = String(contentId ?? "purchase");
  const v = Number(value);
  const validValue = Number.isFinite(v) && v > 0;

  gtag("event", "purchase", {
    transaction_id: `${cid}_${Date.now()}`,
    value: validValue ? v : 0,
    currency,
    items: [{ item_id: cid, item_name: cid, price: validValue ? v : 0 }],
  });

  // Meta Pixel standard Purchase (ödeme başarı — Shopier dönüşü)
  if (validValue) {
    fbq("track", "Purchase", {
      value: v,
      currency,
      content_ids: [cid],
      content_type: "product",
      num_items: 1,
    });
  }
}

/** Shopier’e tıklanınca: GA4 add_to_cart + Meta AddToCart */
export function trackAddToCart(contentId, value, currency = "TRY") {
  const cid = String(contentId ?? "item");
  const v = Number(value);
  const num = Number.isFinite(v) && v >= 0 ? v : 0;

  gtag("event", "add_to_cart", {
    items: [{ item_id: cid, item_name: cid, price: num }],
    value: num,
    currency,
  });

  // Meta Pixel standard AddToCart
  fbq("track", "AddToCart", {
    value: num,
    currency,
    content_ids: [cid],
    content_type: "product",
    contents: [{ id: cid, quantity: 1 }],
  });
}

export function trackLead(source = "unknown") {
  gtag("event", "generate_lead", { event_category: "engagement", source });
  fbq("track", "Lead", { source });
}

export function trackQuizStart(quizName) {
  trackEvent("quiz_start", { quiz: quizName });
}

export function trackQuizComplete(quizName) {
  trackEvent("quiz_complete", { quiz: quizName });
}

export function trackPaywallView(contentId) {
  trackEvent("paywall_view", { content_id: contentId });
}

export function trackShopierRedirect(contentId, value) {
  trackAddToCart(contentId, value);
  trackEvent("shopier_redirect", { content_id: contentId, value: Number(value) || 0 });
}

if (typeof window !== "undefined") {
  window.__sanri_trackShopierRedirect = trackShopierRedirect;
}
