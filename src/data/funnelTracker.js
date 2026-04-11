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

function _getUtmParams() {
  try {
    const sp = new URLSearchParams(window.location.search);
    const utm = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = sp.get(k);
      if (v) utm[k] = v;
    }
    if (Object.keys(utm).length) {
      sessionStorage.setItem("sanri_utm", JSON.stringify(utm));
      return utm;
    }
    const cached = sessionStorage.getItem("sanri_utm");
    return cached ? JSON.parse(cached) : {};
  } catch { return {}; }
}

function getSource() {
  const utm = _getUtmParams();
  if (utm.utm_source) return utm.utm_source;
  const ref = document.referrer || "";
  if (ref.includes("instagram.com")) return "instagram";
  if (ref.includes("tiktok.com")) return "tiktok";
  if (ref.includes("twitter.com") || ref.includes("x.com")) return "twitter";
  if (ref.includes("facebook.com")) return "facebook";
  if (ref.includes("google.com")) return "google";
  const sp = new URLSearchParams(window.location.search);
  return sp.get("ref") || "direct";
}

function getDeviceType() {
  const ua = navigator.userAgent || "";
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

const _sent = new Set();

export function trackFunnelEvent(eventType, extra) {
  const extraStr = extra ? (typeof extra === "string" ? extra : JSON.stringify(extra)) : "";
  const key = `${eventType}_${extraStr}_${getSessionId()}`;
  if (_sent.has(key)) return;
  _sent.add(key);

  const utm = _getUtmParams();
  const body = {
    event_type: eventType,
    session_id: getSessionId(),
    source: getSource(),
    device_type: getDeviceType(),
  };
  if (utm.utm_campaign) body.campaign = utm.utm_campaign;
  if (utm.utm_medium) body.medium = utm.utm_medium;
  if (utm.utm_content) body.utm_content = utm.utm_content;
  if (extraStr) body.extra = extraStr;

  fetch(`${API}/funnel/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export { _getUtmParams as getUtmParams };
