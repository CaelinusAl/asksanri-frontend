/**
 * Unified analytics helper — sends events to GA4 + Meta Pixel.
 *
 * Usage:
 *   import { trackEvent, trackPurchase } from "../data/analytics";
 *   trackEvent("quiz_start", { quiz: "ankod" });
 *   trackPurchase({ contentId: "okuma_1", value: 9.9, productTitle: "Okuma Devamı" });
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

/**
 * @param {{ contentId: string, value: number, currency?: string, productTitle?: string, skipMetaPixel?: boolean }} opts
 */
export function trackPurchase(opts) {
  const {
    contentId,
    value,
    currency = "TRY",
    productTitle,
    skipMetaPixel = false,
  } = opts || {};
  const cid = String(contentId ?? "purchase");
  const v = Number(value);
  const title = String(productTitle || cid);
  if (!Number.isFinite(v) || v <= 0) return;

  gtag("event", "purchase", {
    transaction_id: `${cid}_${Date.now()}`,
    value: v,
    currency,
    items: [{ item_id: cid, item_name: title, price: v }],
  });

  if (!skipMetaPixel) {
    fbq("track", "Purchase", {
      value: v,
      currency,
      content_name: title,
      content_ids: [cid],
      content_type: "product",
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

/**
 * Göz Açık Güneş — hero “Sırrı aç” (Instagram vb. kapı trafiği).
 * Meta: custom event + ViewContent (özel dönüşüm / kitle için).
 */
export function trackGunesSirriAc(contentId) {
  const cid = String(contentId || "okuma_goz_acik_gunes");
  trackEvent("gunes_sirri_ac", {
    content_id: cid,
    gate: "goz_acik_gunes",
  });
  fbq("track", "ViewContent", {
    content_ids: [cid],
    content_type: "product",
    content_name: "Göz Açık Güneş — Sırrı aç",
  });
}

export function trackShopierRedirect(contentId, value) {
  trackAddToCart(contentId, value);
  trackEvent("shopier_redirect", { content_id: contentId, value: Number(value) || 0 });
}

if (typeof window !== "undefined") {
  window.__sanri_trackShopierRedirect = trackShopierRedirect;
}
