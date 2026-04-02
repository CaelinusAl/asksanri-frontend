import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../data/analytics";

const API = import.meta.env.VITE_BACKEND_URL || "https://sanri-api-production-4a7b.up.railway.app";

let sessionId = null;
function getSessionId() {
  if (!sessionId) {
    sessionId = sessionStorage.getItem("pv_sid");
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("pv_sid", sessionId);
    }
  }
  return sessionId;
}

export default function usePageView() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    const path = location.pathname + location.search;
    if (path === lastPath.current) return;
    lastPath.current = path;

    trackPageView(path);

    const token = localStorage.getItem("sanri_token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API}/analytics/pageview`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
        session_id: getSessionId(),
      }),
    }).catch(() => {});
  }, [location.pathname, location.search]);
}
