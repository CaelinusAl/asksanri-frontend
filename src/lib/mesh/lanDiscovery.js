/**
 * Yerel keşif — tarayıcı kısıtları:
 * - Saf web’de aynı Wi‑Fi’de UDP/mDNS yok; gerçek LAN listesi için isteğe bağlı HTTP beacon (VITE_LAN_MESH_BEACON_URL).
 * - Aynı cihaz / aynı origin sekmeleri: BroadcastChannel ile “yakında” bildirimi.
 */

const CHAN = "sanri-mesh-local-v1";

export function openLocalMeshChannel() {
  if (typeof BroadcastChannel === "undefined") return null;
  try {
    return new BroadcastChannel(CHAN);
  } catch {
    return null;
  }
}

/**
 * @param {(msg: { type: string, peerId: string, label?: string, ts: number }) => void} onMessage
 */
export function announceLocalPresence(peerId, label, onMessage) {
  const bc = openLocalMeshChannel();
  if (!bc) return () => {};
  const handler = (ev) => {
    try {
      const data = typeof ev.data === "object" ? ev.data : JSON.parse(String(ev.data));
      if (data?.type === "sanri-peer-ping" || data?.type === "sanri-peer-pong") onMessage(data);
    } catch {
      /* ignore */
    }
  };
  bc.addEventListener("message", handler);
  const ping = () => {
    bc.postMessage({
      type: "sanri-peer-ping",
      peerId,
      label: label || "SANRI",
      ts: Date.now(),
    });
  };
  ping();
  const interval = setInterval(ping, 8000);
  return () => {
    clearInterval(interval);
    bc.removeEventListener("message", handler);
    bc.close();
  };
}

/**
 * İsteğe bağlı: aynı ağda çalışan küçük bir HTTP servisi (ör. ev ağında Raspberry Pi)
 * GET → { peers: [{ id, name }] }
 */
export async function fetchLanBeaconPeers() {
  const base = typeof import.meta !== "undefined" ? import.meta.env?.VITE_LAN_MESH_BEACON_URL : "";
  if (!base || typeof fetch !== "function") return [];
  try {
    const url = String(base).replace(/\/$/, "") + "/peers";
    const r = await fetch(url, { method: "GET", cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j?.peers) ? j.peers : [];
  } catch {
    return [];
  }
}
