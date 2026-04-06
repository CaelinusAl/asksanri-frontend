/**
 * WebRTC DataChannel — SDP el ile veya sinyal sunucusu ile değiştirilebilir.
 * ICE: STUN varsayılan; TURN için env.
 */

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  ...(typeof import.meta !== "undefined" && import.meta.env?.VITE_MESH_TURN_URLS
    ? String(import.meta.env.VITE_MESH_TURN_URLS)
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)
        .map((urls) => ({ urls }))
    : []),
];

/** Kopyala-yapıştır: kod bloğu, BOM, satır sonları. */
export function sanitizeSdp(raw) {
  if (raw == null || typeof raw !== "string") return "";
  let s = raw.replace(/^\uFEFF/, "").trim();
  if (s.startsWith("```")) {
    s = s
      .replace(/^```(?:sdp|SDP)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();
  }
  return s.replace(/\r\n/g, "\n").trim();
}

export function waitIceGatheringComplete(pc, timeoutMs = 20000) {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === "complete") {
      resolve();
      return;
    }
    const done = () => {
      clearTimeout(t);
      resolve();
    };
    const t = setTimeout(done, timeoutMs);
    pc.addEventListener(
      "icegatheringstatechange",
      () => {
        if (pc.iceGatheringState === "complete") done();
      },
      { once: true },
    );
  });
}

export function createPeerConnection() {
  try {
    return new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceCandidatePoolSize: 10,
    });
  } catch {
    return new RTCPeerConnection({ iceServers: ICE_SERVERS });
  }
}

/**
 * @param {RTCPeerConnection} pc
 * @param {{ onDisconnected?: () => void, onFailed?: () => void }} cb
 */
export function attachConnectionStateWatch(pc, cb) {
  const fireFailed = () => cb?.onFailed?.();
  const maybeDisconnected = () => {
    if (pc.connectionState !== "disconnected") return;
    setTimeout(() => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        cb?.onDisconnected?.();
      }
    }, 3500);
  };
  pc.addEventListener("connectionstatechange", () => {
    if (pc.connectionState === "failed") fireFailed();
    if (pc.connectionState === "disconnected") maybeDisconnected();
  });
  pc.addEventListener("iceconnectionstatechange", () => {
    if (pc.iceConnectionState === "failed") fireFailed();
  });
}

/**
 * Host: data channel aç, offer üret (answer gelene kadar kanal açılmaz).
 * @returns {Promise<{ pc: RTCPeerConnection, dc: RTCDataChannel, offerSdp: string }>}
 */
export async function createHostOffer() {
  const pc = createPeerConnection();
  const dc = pc.createDataChannel("sanri-mesh", { ordered: true });
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitIceGatheringComplete(pc);
  const sdp = pc.localDescription?.sdp || "";
  return { pc, dc, offerSdp: sdp };
}

/** @param {RTCDataChannel} dc */
export function waitDataChannelOpen(dc, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    if (dc.readyState === "open") {
      resolve();
      return;
    }
    const t = setTimeout(() => reject(new Error("Veri kanalı zaman aşımı")), timeoutMs);
    dc.addEventListener(
      "open",
      () => {
        clearTimeout(t);
        resolve();
      },
      { once: true },
    );
  });
}

/**
 * Misafir: remote offer ile answer üret.
 */
export async function createGuestAnswer(offerSdp) {
  const sdpOffer = sanitizeSdp(offerSdp);
  if (!sdpOffer.startsWith("v=")) {
    throw new Error("Geçersiz offer SDP (v=0 ile başlamalı).");
  }
  const pc = createPeerConnection();
  const dcPromise = new Promise((resolve) => {
    pc.ondatachannel = (ev) => resolve(ev.channel);
  });
  await pc.setRemoteDescription({ type: "offer", sdp: sdpOffer });
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await waitIceGatheringComplete(pc);
  const sdp = pc.localDescription?.sdp || "";
  const dc = /** @type {RTCDataChannel} */ (
    await Promise.race([
      dcPromise,
      new Promise((r) => setTimeout(() => r(null), 60000)),
    ])
  );
  return { pc, dc, answerSdp: sdp };
}

/**
 * Host: misafir answer’ını uygula.
 */
export async function hostApplyAnswer(pc, answerSdp) {
  const sdp = sanitizeSdp(answerSdp);
  if (!sdp.startsWith("v=")) {
    throw new Error("Geçersiz answer SDP (v=0 ile başlamalı).");
  }
  await pc.setRemoteDescription({ type: "answer", sdp });
}
