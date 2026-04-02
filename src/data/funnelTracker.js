const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

function getSessionId() {
  let sid = sessionStorage.getItem("sanri_session_id");
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("sanri_session_id", sid);
  }
  return sid;
}

function getSource() {
  const ref = document.referrer || "";
  if (ref.includes("instagram.com")) return "instagram";
  if (ref.includes("tiktok.com")) return "tiktok";
  if (ref.includes("twitter.com") || ref.includes("x.com")) return "twitter";
  if (ref.includes("facebook.com")) return "facebook";
  if (ref.includes("google.com")) return "google";
  const sp = new URLSearchParams(window.location.search);
  return sp.get("utm_source") || sp.get("ref") || "direct";
}

function getDeviceType() {
  const ua = navigator.userAgent || "";
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

const _sent = new Set();

export function trackFunnelEvent(eventType, extra) {
  const key = `${eventType}_${getSessionId()}`;
  if (_sent.has(key)) return;
  _sent.add(key);

  const body = {
    event_type: eventType,
    session_id: getSessionId(),
    source: getSource(),
    device_type: getDeviceType(),
  };
  if (extra) body.extra = typeof extra === "string" ? extra : JSON.stringify(extra);

  fetch(`${API}/funnel/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}
