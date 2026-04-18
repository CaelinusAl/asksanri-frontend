import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDeviceFingerprint } from "../data/shopierConfig";
import { trackLead } from "../data/analytics";
import { isAdminPath } from "../utils/adminPath";

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

const DISMISS_KEY = "sanri_email_dismiss";
const COLLECTED_KEY = "sanri_email_collected";

function shouldShow() {
  try {
    if (localStorage.getItem(COLLECTED_KEY)) return false;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    // Re-show after 4 hours instead of 24
    if (dismissed && Date.now() - parseInt(dismissed) < 4 * 3600000) return false;
  } catch {}
  return true;
}

export default function EmailCaptureModal({ trigger = "timer", page = "" }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [fieldError, setFieldError] = useState("");
  const shownRef = useRef(false);

  // Timer trigger — show after 12 seconds
  useEffect(() => {
    if (trigger !== "timer") return;
    if (isAdminPath(pathname)) return;
    if (shownRef.current || !shouldShow()) return;

    const t = setTimeout(() => {
      shownRef.current = true;
      setOpen(true);
    }, 12000);
    return () => clearTimeout(t);
  }, [trigger, pathname]);

  // Scroll trigger — show at 35% scroll depth
  useEffect(() => {
    if (trigger !== "scroll") return;
    if (isAdminPath(pathname)) return;
    if (shownRef.current || !shouldShow()) return;

    const handler = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = window.scrollY / total;
      if (pct > 0.35 && !shownRef.current) {
        shownRef.current = true;
        setOpen(true);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [trigger, pathname]);

  // Exit-intent trigger — mouse leaves viewport (desktop)
  useEffect(() => {
    if (trigger !== "exit_intent") return;
    if (isAdminPath(pathname)) return;
    if (shownRef.current || !shouldShow()) return;

    const handler = (e) => {
      if (e.clientY <= 5 && !shownRef.current) {
        shownRef.current = true;
        setOpen(true);
      }
    };
    document.addEventListener("mouseout", handler);
    return () => document.removeEventListener("mouseout", handler);
  }, [trigger, pathname]);

  // Page-leave trigger for mobile — fires on visibilitychange
  useEffect(() => {
    if (trigger !== "exit_intent") return;
    if (isAdminPath(pathname)) return;
    if (shownRef.current || !shouldShow()) return;

    const handler = () => {
      if (document.visibilityState === "hidden" && !shownRef.current) {
        shownRef.current = true;
        setTimeout(() => setOpen(true), 300);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [trigger, pathname]);

  const handleSubmit = async () => {
    setFieldError("");
    const em = email.trim().toLowerCase();
    if (!em) {
      setFieldError("E-posta zorunludur.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setFieldError("Geçerli bir e-posta gir.");
      return;
    }
    setStatus("sending");
    try {
      const token = localStorage.getItem("sanri_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API}/shopier/collect-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: em,
          source: trigger,
          page,
          device_fp: getDeviceFingerprint(),
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const d = errBody.detail;
        const msg =
          typeof d === "string"
            ? d
            : d && typeof d === "object"
              ? d.message || d.message_tr || JSON.stringify(d)
              : `Hata ${res.status}`;
        setFieldError(msg);
        setStatus("idle");
        return;
      }
      localStorage.setItem(COLLECTED_KEY, "1");
      trackLead(page || trigger);
      setStatus("done");
      setTimeout(() => setOpen(false), 2200);
    } catch {
      setStatus("error");
    }
  };

  const handleDismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setOpen(false);
  };

  if (isAdminPath(pathname)) return null;

  return (
    <AnimatePresence>
      {open && (
        <div style={S.backdrop} onClick={handleDismiss}>
          <motion.div
            style={S.card}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {status === "done" ? (
              <>
                <div style={S.glyph}>&#10024;</div>
                <p style={S.title}>Kayıt alındı.</p>
                <p style={S.desc}>SANRI sana ulaşacak.</p>
              </>
            ) : (
              <>
                <div style={S.glyph}>&#9670;</div>
                <p style={S.title}>Bir katman daha aç</p>
                <p style={S.desc}>
                  E-posta adresini bırak, SANRI sana özel içerik ve frekans
                  okumaları göndersin.
                </p>
                <input
                  style={S.input}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="E-posta adresin"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
                {fieldError ? (
                  <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 6 }}>{fieldError}</p>
                ) : null}
                <button
                  style={{
                    ...S.btn,
                    opacity: status === "sending" ? 0.6 : 1,
                  }}
                  onClick={handleSubmit}
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Gönderiliyor..." : "Gönder"}
                </button>
                {status === "error" && (
                  <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 8 }}>
                    Bir hata oluştu. Tekrar dene.
                  </p>
                )}
                <button style={S.dismiss} onClick={handleDismiss}>
                  Şimdi değil
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function EmailCaptureInline({ page = "", label }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [fieldError, setFieldError] = useState("");

  if (typeof window !== "undefined") {
    try {
      if (localStorage.getItem(COLLECTED_KEY)) return null;
    } catch {}
  }

  const handleSubmit = async () => {
    setFieldError("");
    const em = email.trim().toLowerCase();
    if (!em) {
      setFieldError("E-posta zorunludur.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setFieldError("Geçerli bir e-posta gir.");
      return;
    }
    setStatus("sending");
    try {
      const token = localStorage.getItem("sanri_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API}/shopier/collect-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: em,
          source: "inline",
          page,
          device_fp: getDeviceFingerprint(),
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const d = errBody.detail;
        const msg =
          typeof d === "string"
            ? d
            : d && typeof d === "object"
              ? d.message || d.message_tr || JSON.stringify(d)
              : `Hata ${res.status}`;
        setFieldError(msg);
        setStatus("idle");
        return;
      }
      localStorage.setItem(COLLECTED_KEY, "1");
      trackLead(page);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div style={S.inlineWrap}>
        <p style={{ color: "#78f7d8", fontSize: 14, fontWeight: 600 }}>
          Kayıt alındı. SANRI seninle.
        </p>
      </div>
    );
  }

  return (
    <div style={S.inlineWrap}>
      <p style={S.inlineLabel}>
        {label || "SANRI'dan özel içerik almak ister misin?"}
      </p>
      <div style={S.inlineRow}>
        <input
          style={S.inlineInput}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="E-posta adresin"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          style={S.inlineBtn}
          onClick={handleSubmit}
          disabled={status === "sending"}
        >
          {status === "sending" ? "..." : "Gönder"}
        </button>
      </div>
      {fieldError ? (
        <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 8 }}>{fieldError}</p>
      ) : null}
    </div>
  );
}

const S = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 11000,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    maxWidth: 400,
    width: "100%",
    padding: "32px 28px 28px",
    borderRadius: 22,
    background: "linear-gradient(170deg, #14121e 0%, #0a0a10 100%)",
    border: "1px solid rgba(200,160,255,0.2)",
    boxShadow: "0 0 80px rgba(200,160,255,0.08)",
    textAlign: "center",
  },
  glyph: {
    fontSize: 28,
    color: "rgba(200,160,255,0.5)",
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#e8e4f4",
    margin: "0 0 8px",
    letterSpacing: "0.03em",
  },
  desc: {
    fontSize: 14,
    color: "rgba(200,160,255,0.5)",
    margin: "0 0 22px",
    lineHeight: 1.7,
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid rgba(200,160,255,0.2)",
    background: "rgba(200,160,255,0.06)",
    color: "#e8e4f4",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 12,
  },
  btn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "1px solid rgba(120,247,216,0.3)",
    background: "rgba(120,247,216,0.1)",
    color: "#78f7d8",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s",
  },
  dismiss: {
    marginTop: 14,
    background: "none",
    border: "none",
    color: "rgba(200,160,255,0.35)",
    fontSize: 13,
    cursor: "pointer",
  },
  inlineWrap: {
    padding: "20px 0",
    textAlign: "center",
  },
  inlineLabel: {
    fontSize: 14,
    color: "rgba(200,160,255,0.5)",
    margin: "0 0 12px",
  },
  inlineRow: {
    display: "flex",
    gap: 8,
    maxWidth: 380,
    margin: "0 auto",
  },
  inlineInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(200,160,255,0.2)",
    background: "rgba(200,160,255,0.06)",
    color: "#e8e4f4",
    fontSize: 14,
    outline: "none",
  },
  inlineBtn: {
    padding: "12px 20px",
    borderRadius: 10,
    border: "1px solid rgba(120,247,216,0.3)",
    background: "rgba(120,247,216,0.1)",
    color: "#78f7d8",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};
