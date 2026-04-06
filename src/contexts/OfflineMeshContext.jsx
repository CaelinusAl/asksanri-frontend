import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { runNomadSync } from "../lib/offline/syncManager";
import { announceLocalPresence, fetchLanBeaconPeers } from "../lib/mesh/lanDiscovery";
import {
  createHostOffer,
  createGuestAnswer,
  hostApplyAnswer,
  waitDataChannelOpen,
  attachConnectionStateWatch,
} from "../lib/mesh/webrtcTransport";
import { establishSecureSession } from "../lib/mesh/meshHandshake";

const Ctx = createContext(null);

const API =
  (import.meta?.env?.VITE_BACKEND_URL && String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

function useOnlineStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  return online;
}

function randomPeerId() {
  const a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function OfflineMeshProvider({ children }) {
  const online = useOnlineStatus();
  const [swReady, setSwReady] = useState(false);
  const peerIdRef = useRef(randomPeerId());
  const [localPeers, setLocalPeers] = useState([]);
  const [lanPeers, setLanPeers] = useState([]);
  const [meshMessages, setMeshMessages] = useState([]);
  const [meshStatus, setMeshStatus] = useState("idle");
  const hostPcRef = useRef(null);
  const hostDcRef = useRef(null);
  const guestPcRef = useRef(null);
  const guestDcRef = useRef(null);
  const sessionRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import("virtual:pwa-register")
      .then(({ registerSW }) => {
        if (cancelled) return;
        registerSW({
          immediate: true,
          onRegistered() {
            if (!cancelled) setSwReady(true);
          },
          onRegisterError() {
            if (!cancelled) setSwReady(false);
          },
        });
      })
      .catch(() => {
        if (!cancelled) setSwReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const authFetch = useCallback(async (path, init = {}) => {
    const token = localStorage.getItem("sanri_token");
    const headers = { ...(init.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${API}${path}`, { ...init, headers });
  }, []);

  const prevOnlineRef = useRef(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const wasOffline = prevOnlineRef.current === false;
    prevOnlineRef.current = online;
    if (!online) return;
    runNomadSync((path, init) => authFetch(path, init), {
      onResult: (r) => {
        if (wasOffline) {
          if (r.pendingProcessed > 0) {
            toast.success(
              `Bağlantı geri geldi — ${r.pendingProcessed} yerel işlem sunucuya iletildi.`,
            );
          } else if (r.pendingFailed > 0 && r.message) {
            toast.message(r.message);
          } else {
            toast.success("Bağlantı geri geldi.");
          }
        } else if (r.pendingProcessed > 0) {
          toast.success(
            r.message || `${r.pendingProcessed} çevrimdışı işlem sunucuya iletildi.`,
          );
        } else if (r.pendingFailed > 0 && r.message) {
          toast.message(r.message);
        }
      },
    }).catch(() => {});
  }, [online, authFetch]);

  useEffect(() => {
    const seen = new Map();
    const cleanup = announceLocalPresence(peerIdRef.current, "SANRI", (data) => {
      if (data.peerId === peerIdRef.current) return;
      seen.set(data.peerId, { id: data.peerId, label: data.label || "SANRI", ts: data.ts, source: "broadcast" });
      setLocalPeers([...seen.values()].sort((a, b) => b.ts - a.ts));
    });
    return cleanup;
  }, []);

  const refreshLanBeacon = useCallback(async () => {
    const list = await fetchLanBeaconPeers();
    setLanPeers(list.map((p, i) => ({ id: p.id || `lan-${i}`, label: p.name || p.id, source: "beacon" })));
  }, []);

  /** Sadece offer üret; answer sonrası completeHostSession çağrılır. */
  const prepareHostOffer = useCallback(async () => {
    setMeshStatus("offer-ready");
    const { pc, dc, offerSdp } = await createHostOffer();
    hostPcRef.current = pc;
    hostDcRef.current = dc;
    sessionRef.current = null;
    attachConnectionStateWatch(pc, {
      onFailed: () => setMeshStatus("disconnected"),
      onDisconnected: () => setMeshStatus("disconnected"),
    });
    return { offerSdp };
  }, []);

  const completeHostSession = useCallback(async (answerSdp, pairingCode) => {
    const pc = hostPcRef.current;
    const dc = hostDcRef.current;
    if (!pc || !dc) throw new Error("Önce offer oluşturun");
    setMeshStatus("connecting");
    try {
      await hostApplyAnswer(pc, answerSdp);
      await waitDataChannelOpen(dc, 60000);
      const session = await establishSecureSession(dc, "host", pairingCode);
      sessionRef.current = session;
      session.onEncrypted((plain) => {
        setMeshMessages((m) => [...m, { id: crypto.randomUUID(), direction: "in", text: plain, ts: Date.now() }]);
      });
      setMeshStatus("connected");
    } catch (e) {
      setMeshStatus("error");
      throw e;
    }
  }, []);

  /** Guest: offer’dan answer üret (host answer uygulayana kadar kanal kapalı olabilir). */
  const prepareGuestAnswer = useCallback(async (offerSdp) => {
    setMeshStatus("answer-ready");
    const { pc, dc, answerSdp } = await createGuestAnswer(offerSdp);
    if (!dc) throw new Error("Veri kanalı oluşturulamadı — offer SDP tam mı? Önce host’un offer’ını yapıştırın.");
    guestPcRef.current = pc;
    guestDcRef.current = dc;
    sessionRef.current = null;
    attachConnectionStateWatch(pc, {
      onFailed: () => setMeshStatus("disconnected"),
      onDisconnected: () => setMeshStatus("disconnected"),
    });
    return { answerSdp };
  }, []);

  /** Host answer’ı uyguladıktan sonra guest tarafında şifreli oturumu başlat. */
  const completeGuestSession = useCallback(async (pairingCode) => {
    const dc = guestDcRef.current;
    if (!dc) throw new Error("Önce host SDP ile katılın");
    setMeshStatus("connecting");
    try {
      await waitDataChannelOpen(dc, 60000);
      const session = await establishSecureSession(dc, "guest", pairingCode);
      sessionRef.current = session;
      session.onEncrypted((plain) => {
        setMeshMessages((m) => [...m, { id: crypto.randomUUID(), direction: "in", text: plain, ts: Date.now() }]);
      });
      setMeshStatus("connected");
    } catch (e) {
      setMeshStatus("error");
      throw e;
    }
  }, []);

  const sendMeshMessage = useCallback(async (text) => {
    const s = sessionRef.current;
    if (!s?.sendEncrypted) throw new Error("Oturum yok");
    await s.sendEncrypted(text);
    setMeshMessages((m) => [...m, { id: crypto.randomUUID(), direction: "out", text, ts: Date.now() }]);
  }, []);

  const disconnectMesh = useCallback(() => {
    try {
      hostPcRef.current?.close();
      guestPcRef.current?.close();
    } catch {
      /* ignore */
    }
    hostPcRef.current = null;
    hostDcRef.current = null;
    guestPcRef.current = null;
    guestDcRef.current = null;
    sessionRef.current = null;
    setMeshStatus("idle");
    setMeshMessages([]);
  }, []);

  const value = useMemo(
    () => ({
      online,
      offlineMode: !online,
      swReady,
      peerId: peerIdRef.current,
      localPeers,
      lanPeers,
      refreshLanBeacon,
      meshStatus,
      meshMessages,
      prepareHostOffer,
      completeHostSession,
      prepareGuestAnswer,
      completeGuestSession,
      sendMeshMessage,
      disconnectMesh,
    }),
    [
      online,
      swReady,
      localPeers,
      lanPeers,
      refreshLanBeacon,
      meshStatus,
      meshMessages,
      prepareHostOffer,
      completeHostSession,
      prepareGuestAnswer,
      completeGuestSession,
      sendMeshMessage,
      disconnectMesh,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOfflineMesh() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOfflineMesh requires OfflineMeshProvider");
  return v;
}
