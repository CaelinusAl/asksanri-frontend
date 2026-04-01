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

// ── System ──
export const fetchHealth = () => fetch(`${API}/health`).then((r) => r.json());
