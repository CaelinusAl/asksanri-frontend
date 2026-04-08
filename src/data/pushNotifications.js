/**
 * Browser push notification opt-in.
 * Uses the Notification API + stores preference so we don't re-ask.
 */

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

const PUSH_OPTED_KEY = "sanri_push_opted";
const PUSH_DENIED_KEY = "sanri_push_denied";

export function isPushSupported() {
  return "Notification" in window;
}

export function isPushOptedIn() {
  try {
    return localStorage.getItem(PUSH_OPTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function isPushDenied() {
  try {
    return localStorage.getItem(PUSH_DENIED_KEY) === "1";
  } catch {
    return false;
  }
}

export function shouldPromptPush() {
  if (!isPushSupported()) return false;
  if (isPushOptedIn() || isPushDenied()) return false;
  if (Notification.permission === "denied") return false;
  if (Notification.permission === "granted") return false;
  return true;
}

export async function requestPushPermission() {
  if (!isPushSupported()) return { ok: false, reason: "unsupported" };

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      localStorage.setItem(PUSH_OPTED_KEY, "1");
      return { ok: true };
    }
    if (permission === "denied") {
      localStorage.setItem(PUSH_DENIED_KEY, "1");
    }
    return { ok: false, reason: permission };
  } catch (e) {
    return { ok: false, reason: String(e) };
  }
}

export async function registerDeviceToken(userId) {
  if (!isPushSupported() || Notification.permission !== "granted") return;

  try {
    const token = localStorage.getItem("sanri_token");
    const deviceId =
      localStorage.getItem("sanri_device_id") ||
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("sanri_device_id", deviceId);

    const platform = /Mobi|Android/i.test(navigator.userAgent)
      ? "mobile_web"
      : "desktop_web";

    await fetch(`${API}/device/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        user_id: userId,
        device_token: deviceId,
        platform,
        lang: document.documentElement.lang || "tr",
      }),
    });
  } catch {
    /* silent */
  }
}

export function showLocalNotification(title, body, options = {}) {
  if (!isPushSupported() || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/assets/gates/sanri.jpg", ...options });
  } catch {
    /* silent */
  }
}
