// Yanki Alani — Real API client (backed by /yanki/* endpoints)

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

// ─── Posts ───────────────────────────────────────────────────────

export async function fetchPosts({ category, section, limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (section) params.set("section", section);
  params.set("limit", limit);
  params.set("offset", offset);
  const qs = params.toString();
  return apiFetch(`/yanki/posts${qs ? "?" + qs : ""}`);
}

export async function fetchPostById(id) {
  return apiFetch(`/yanki/posts/${id}`);
}

export async function createPost({ content, title, category, anonymous, image_url, audio_url }) {
  return apiFetch("/yanki/posts", {
    method: "POST",
    body: JSON.stringify({
      content,
      title: title || null,
      category: category || "genel",
      anonymous: anonymous ?? true,
      image_url: image_url || null,
      audio_url: audio_url || null,
    }),
  });
}

export async function fetchMyPosts({ limit = 20, offset = 0 } = {}) {
  return apiFetch(`/yanki/me/posts?limit=${limit}&offset=${offset}`);
}

export async function fetchFeaturedPost() {
  return apiFetch("/yanki/posts/featured");
}

// ─── Reactions ──────────────────────────────────────────────────

export async function reactToPost(postId, reactionType) {
  return apiFetch(`/yanki/posts/${postId}/react`, {
    method: "POST",
    body: JSON.stringify({ reaction_type: reactionType }),
  });
}

export async function fetchMyReactions(postIds = []) {
  const qs = postIds.length ? `?post_ids=${postIds.join(",")}` : "";
  return apiFetch(`/yanki/me/reactions${qs}`);
}

// ─── Comments ───────────────────────────────────────────────────

export async function fetchComments(postId, { limit = 50, offset = 0 } = {}) {
  return apiFetch(`/yanki/posts/${postId}/comments?limit=${limit}&offset=${offset}`);
}

export async function addComment(postId, content, { parentId, mentions } = {}) {
  return apiFetch(`/yanki/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({
      content,
      parent_id: parentId || null,
      mentions: mentions || [],
    }),
  });
}

export async function fetchKindredSpirits(postId) {
  return apiFetch(`/yanki/posts/${postId}/kindred`);
}

export async function fetchUserPublicProfile(userId) {
  return apiFetch(`/yanki/users/${userId}/profile`);
}

// ─── Reports ────────────────────────────────────────────────────

export async function reportPost(postId, reason) {
  return apiFetch(`/yanki/posts/${postId}/report`, {
    method: "POST",
    body: JSON.stringify({ reason: reason || null }),
  });
}

// ─── Sanri Reflection ───────────────────────────────────────────

export async function askSanriReflection(postId, prompt) {
  return apiFetch(`/yanki/posts/${postId}/sanri-reflect`, {
    method: "POST",
    body: JSON.stringify({ prompt: prompt || null }),
  });
}

export async function fetchReflections(postId) {
  return apiFetch(`/yanki/posts/${postId}/reflections`);
}

// ─── Profile ────────────────────────────────────────────────────

export async function fetchMyProfile() {
  return apiFetch("/yanki/me/profile");
}

export async function updateMyProfile({ display_name, bio }) {
  return apiFetch("/yanki/me/profile", {
    method: "PUT",
    body: JSON.stringify({ display_name, bio }),
  });
}

// ─── Notifications ──────────────────────────────────────────────

export async function fetchNotifications({ limit = 30 } = {}) {
  return apiFetch(`/yanki/me/notifications?limit=${limit}`);
}

export async function markAllNotificationsRead() {
  return apiFetch("/yanki/me/notifications/read-all", { method: "POST" });
}

export async function markNotificationRead(notifId) {
  return apiFetch(`/yanki/me/notifications/${notifId}/read`, { method: "POST" });
}

// ─── Admin ──────────────────────────────────────────────────────

export async function fetchAdminPosts({ status = "pending_review", limit = 30, offset = 0 } = {}) {
  return apiFetch(`/yanki/admin/posts?status_filter=${status}&limit=${limit}&offset=${offset}`);
}

export async function reviewPost(postId, { action, reject_reason, sanri_note }) {
  return apiFetch(`/yanki/admin/posts/${postId}/review`, {
    method: "POST",
    body: JSON.stringify({ action, reject_reason, sanri_note }),
  });
}

export async function fetchAdminStats() {
  return apiFetch("/yanki/admin/stats");
}

// ─── Referral / Share ────────────────────────────────────────────

export async function fetchPostPreview(postId, refUserId) {
  const params = refUserId ? `?ref=${refUserId}` : "";
  return apiFetch(`/yanki/posts/${postId}/preview${params}`);
}

export async function trackReferral({ referrer_id, post_id, fingerprint }) {
  return apiFetch("/yanki/referrals/track", {
    method: "POST",
    body: JSON.stringify({ referrer_id, post_id, fingerprint: fingerprint || null }),
  });
}

export async function claimReferral(referralId) {
  return apiFetch("/yanki/referrals/claim", {
    method: "POST",
    body: JSON.stringify({ referral_id: referralId }),
  });
}

export async function fetchMyReferrals() {
  return apiFetch("/yanki/me/referrals");
}

// ─── Auth check helper ──────────────────────────────────────────

export function isLoggedIn() {
  try {
    return !!localStorage.getItem("sanri_token");
  } catch {
    return false;
  }
}
