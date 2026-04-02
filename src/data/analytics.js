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

export function trackPageView(path) {
  gtag("event", "page_view", { page_path: path });
  fbq("track", "PageView");
}

export function trackPurchase(contentId, value, currency = "TRY") {
  gtag("event", "purchase", {
    transaction_id: `${contentId}_${Date.now()}`,
    value,
    currency,
    items: [{ item_id: contentId, item_name: contentId, price: value }],
  });
  fbq("track", "Purchase", { content_ids: [contentId], value, currency });
}

export function trackAddToCart(contentId, value, currency = "TRY") {
  gtag("event", "add_to_cart", {
    items: [{ item_id: contentId, item_name: contentId, price: value }],
    value,
    currency,
  });
  fbq("track", "AddToCart", { content_ids: [contentId], value, currency });
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
  trackEvent("shopier_redirect", { content_id: contentId, value });
}

if (typeof window !== "undefined") {
  window.__sanri_trackShopierRedirect = trackShopierRedirect;
}
