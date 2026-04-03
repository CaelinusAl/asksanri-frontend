const API = import.meta.env.VITE_BACKEND_URL || "https://sanri-api-production-4a7b.up.railway.app";
const getToken = () => localStorage.getItem("sanri_token");

async function adminFetch(path, opts = {}) {
  const token = getToken();
  const headers = { ...opts.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (opts.body && typeof opts.body === "object" && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Dashboard ──
export const fetchDashboard = () => adminFetch("/admin/dashboard");
export const fetchMembership = () => adminFetch("/admin/membership");
export const fetchAnalytics = (period = "7d") => adminFetch(`/admin/analytics?period=${period}`);

// ── Users ──
export const fetchUsers = (params = {}) => {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.role) q.set("role", params.role);
  if (params.limit) q.set("limit", params.limit);
  if (params.offset) q.set("offset", params.offset);
  return adminFetch(`/admin/users-list?${q.toString()}`);
};
export const setUserRole = (userId, role) =>
  adminFetch("/admin/set-user-role", { method: "POST", body: { target_user_id: userId, role } });

// ── Yanki Moderation ──
export const fetchModerationPosts = (status = "all") =>
  adminFetch(`/admin/moderation/posts${status !== "all" ? `?status=${status}` : ""}`);
export const fetchModerationStats = () => adminFetch("/admin/moderation/stats");
export const reviewPost = (postId, action, notes = "") =>
  adminFetch(`/admin/moderation/posts/${postId}/review`, { method: "POST", body: { action, notes } });
export const fetchYankiAdminStats = () => adminFetch("/yanki/admin/stats");

// ── Security / Audit ──
export const fetchAuditLog = () => adminFetch("/admin/security/audit-log");
export const fetchSecuritySummary = () => adminFetch("/admin/security/summary");

// ── Page Views / Visitors ──
export const fetchVisitorStats = () => adminFetch("/analytics/stats");

// ── System ──
export const fetchHealth = () => fetch(`${API}/health`).then((r) => r.json());

// ── Funnel Analytics ──
export const fetchFunnelStats = (days = 7) => adminFetch(`/funnel/admin/stats?days=${days}`);

// ── Muhasebe Merkezi (Shopier + funnel) ──
export const fetchAccounting = (params = {}) => {
  const q = new URLSearchParams();
  if (params.date_from) q.set("date_from", params.date_from);
  if (params.date_to) q.set("date_to", params.date_to);
  if (params.content_id) q.set("content_id", params.content_id);
  if (params.payment_status) q.set("payment_status", params.payment_status);
  if (params.orders_limit) q.set("orders_limit", String(params.orders_limit));
  if (params.orders_offset) q.set("orders_offset", String(params.orders_offset));
  if (params.funnel_days) q.set("funnel_days", String(params.funnel_days));
  const s = q.toString();
  return adminFetch(`/admin/accounting${s ? `?${s}` : ""}`);
};

export const fetchAccountingCustomer = (email) =>
  adminFetch(`/admin/accounting/customer?email=${encodeURIComponent(email)}`);

// ── Havale / EFT (bank_transfer_requests) ──
export const fetchBankTransfers = (status) => {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return adminFetch(`/admin/bank-transfers${q}`);
};
export const fetchBankTransferDetail = (id) => adminFetch(`/admin/bank-transfers/${id}`);
export const approveBankTransfer = (id) =>
  adminFetch(`/admin/bank-transfers/${id}/approve`, { method: "POST", body: {} });
export const rejectBankTransfer = (id, note = "") =>
  adminFetch(`/admin/bank-transfers/${id}/reject`, {
    method: "POST",
    body: { note: note || "" },
  });

export async function downloadAccountingCsv(params = {}) {
  const API = import.meta.env.VITE_BACKEND_URL || "https://sanri-api-production-4a7b.up.railway.app";
  const token = localStorage.getItem("sanri_token");
  const q = new URLSearchParams();
  if (params.date_from) q.set("date_from", params.date_from);
  if (params.date_to) q.set("date_to", params.date_to);
  if (params.content_id) q.set("content_id", params.content_id);
  if (params.payment_status) q.set("payment_status", params.payment_status);
  const res = await fetch(`${API}/admin/accounting/export.csv?${q}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("CSV indirilemedi");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sanri_muhasebe_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Okuma Stats ──
export const fetchOkumaAllStats = () =>
  fetch(
    `${API}/okuma/all-stats`
  ).then((r) => r.json());
