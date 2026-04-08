import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  shouldPromptPush,
  requestPushPermission,
  registerDeviceToken,
  isPushOptedIn,
} from "../data/pushNotifications";

const DELAY_MS = 45000;

export default function PushOptIn() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    if (isPushOptedIn()) {
      registerDeviceToken(user.id);
      return;
    }
    if (!shouldPromptPush()) return;

    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [user]);

  if (!visible) return null;

  const handleAllow = async () => {
    const res = await requestPushPermission();
    if (res.ok && user?.id) {
      registerDeviceToken(user.id);
    }
    setVisible(false);
  };

  const handleDismiss = () => {
    try { localStorage.setItem("sanri_push_denied", "1"); } catch {}
    setVisible(false);
  };

  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      zIndex: 9990, maxWidth: 380, width: "calc(100% - 32px)",
      padding: "16px 20px", borderRadius: 16,
      background: "rgba(13, 8, 24, 0.95)",
      border: "1px solid rgba(200, 160, 255, 0.18)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <p style={{
        margin: "0 0 12px", fontSize: 14, fontWeight: 600,
        color: "rgba(255,255,255,0.9)", lineHeight: 1.4,
      }}>
        Yeni okumalar ve frekans analizleri yayınlandığında bildirim almak ister misin?
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={handleAllow}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
            background: "rgba(200, 160, 255, 0.2)", color: "#e0d6f0",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}
        >
          Bildirimleri Aç
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            padding: "10px 14px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent", color: "rgba(255,255,255,0.4)",
            fontSize: 13, cursor: "pointer",
          }}
        >
          Şimdi Değil
        </button>
      </div>
    </div>
  );
}
