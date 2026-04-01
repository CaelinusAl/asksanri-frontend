const API_BASE = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  ""
).replace(/\/$/, "");

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  try {
    const token = localStorage.getItem("sanri_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } catch { /* noop */ }
  return headers;
}

async function apiFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { ...getAuthHeaders(), ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.detail || `API ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
}

/**
 * POST /billing/checkout-session
 * Returns { checkout_url, session_id }
 */
export async function createCheckoutSession({ productKey, contentId }) {
  return apiFetch("/billing/checkout-session", {
    method: "POST",
    body: JSON.stringify({
      product_key: productKey,
      content_id: contentId || null,
    }),
  });
}

/**
 * GET /billing/me/access — SINGLE SOURCE OF TRUTH
 * Returns full access manifest: is_premium, entitlements, unlocked_content_ids, subscription
 */
export async function fetchMyAccess(contentId) {
  const qs = contentId ? `?content_id=${encodeURIComponent(contentId)}` : "";
  return apiFetch(`/billing/me/access${qs}`);
}

/**
 * GET /billing/status — backward compat wrapper
 */
export async function fetchBillingStatus() {
  return apiFetch("/billing/status");
}

/**
 * GET /billing/content-access/:id — check single content
 */
export async function checkContentAccess(contentId) {
  return apiFetch(`/billing/content-access/${contentId}`);
}

/**
 * GET /billing/config — public: publishable key + product catalog
 */
export async function fetchBillingConfig() {
  return apiFetch("/billing/config");
}

/**
 * POST /billing/free-unlock — one-time free content unlock
 */
export async function useFreeUnlock({ contentId, contentType = "okuma" }) {
  return apiFetch("/billing/free-unlock", {
    method: "POST",
    body: JSON.stringify({
      content_id: contentId,
      content_type: contentType,
    }),
  });
}

/**
 * Admin: GET /billing/admin/summary
 */
export async function fetchAdminBillingSummary() {
  const adminKey = import.meta.env.VITE_ADMIN_KEY || "";
  return apiFetch("/billing/admin/summary", {
    headers: { "X-Admin-Secret": adminKey },
  });
}
