export const ANLASILMA_SESSION_KEY = "sanri_anlasilma_sid";

/** Ortak anonim oturum — Anlaşılma + hissel yankı aynı kimlik. */
export function getAnlasilmaSessionId() {
  try {
    let id = localStorage.getItem(ANLASILMA_SESSION_KEY);
    if (!id || id.length < 8) {
      id = crypto.randomUUID();
      localStorage.setItem(ANLASILMA_SESSION_KEY, id);
    }
    return id;
  } catch {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  }
}

const API_BASE = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "https://sanri-api-production-4a7b.up.railway.app"
).replace(/\/$/, "");

function headers() {
  const h = { "Content-Type": "application/json" };
  try {
    const token = localStorage.getItem("sanri_token");
    if (token) h.Authorization = `Bearer ${token}`;
  } catch {
    /* noop */
  }
  return h;
}

async function apiFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  let res;
  try {
    res = await fetch(url, {
      ...opts,
      headers: { ...headers(), ...opts.headers },
    });
  } catch (networkErr) {
    const err = new Error(networkErr.message || "Network error");
    err.status = 0;
    err.body = { detail: err.message };
    err.isNetworkError = true;
    throw err;
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.detail || `API ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

/** POST /api/anlasilma/enter */
export function anlasilmaEnter({ sessionId, frequencyHz, intentText, emotionTags }) {
  return apiFetch("/api/anlasilma/enter", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      frequency_hz: frequencyHz,
      intent_text: intentText,
      emotion_tags: emotionTags || [],
    }),
  });
}

/** POST /api/anlasilma/chat/queue */
export function anlasilmaChatQueue({ sessionId, frequencyHz }) {
  return apiFetch("/api/anlasilma/chat/queue", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, frequency_hz: frequencyHz }),
  });
}

/** POST /api/anlasilma/chat/queue/poll */
export function anlasilmaChatPoll({ sessionId, frequencyHz }) {
  return apiFetch("/api/anlasilma/chat/queue/poll", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, frequency_hz: frequencyHz }),
  });
}

/** POST /api/anlasilma/chat/send */
export function anlasilmaChatSend({ sessionId, roomId, text }) {
  return apiFetch("/api/anlasilma/chat/send", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, room_id: roomId, text }),
  });
}

/** GET /api/anlasilma/chat/messages */
export function anlasilmaChatMessages({ roomId, sessionId, afterId = 0 }) {
  const q = new URLSearchParams({
    room_id: String(roomId),
    session_id: sessionId,
    after_id: String(afterId),
  });
  return apiFetch(`/api/anlasilma/chat/messages?${q}`);
}

export function getAnlasilmaFrequencies() {
  return apiFetch("/api/anlasilma/meta/frequencies");
}

/** POST /yanki/field/share — niyeti kolektif hissel akışa anonim bırak */
export function shareIntentToYankiField({ sessionId, frequencyHz, text, emotionTags }) {
  return apiFetch("/yanki/field/share", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      frequency_hz: frequencyHz,
      text: text.trim(),
      emotion_tags: emotionTags || [],
    }),
  });
}
