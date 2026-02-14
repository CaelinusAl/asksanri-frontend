// src/contexts/AdminContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const AdminContext = createContext(null);

const LS_KEY = "sanri_admin_session_v1";

function safeNow() {
  return Math.floor(Date.now() / 1000);
}

function sha256Hex(str) {
  // Browser SHA-256 (WebCrypto)
  const enc = new TextEncoder().encode(str);
  return crypto.subtle.digest("SHA-256", enc).then((buf) => {
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  });
}

export function AdminProvider({ children }) {
  const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || "";

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // session = { email, exp, sig }
  const readSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s?.email || !s?.exp || !s?.sig) return null;
      if (safeNow() > Number(s.exp)) return null;
      return s;
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setIsAdmin(false);
    setAdminEmail("");
  }, []);

  const validateSession = useCallback(async () => {
    setLoading(true);

    if (!ADMIN_KEY) {
      // env yoksa admin KAPALI
      clear();
      setLoading(false);
      return;
    }

    const s = readSession();
    if (!s) {
      clear();
      setLoading(false);
      return;
    }

    // Signature check (client-side lock)
    // sig = sha256(email|exp|ADMIN_KEY)
    const expected = await sha256Hex(`${s.email}|${s.exp}|${ADMIN_KEY}`);
    if (expected !== s.sig) {
      clear();
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    setAdminEmail(String(s.email));
    setLoading(false);
  }, [ADMIN_KEY, clear, readSession]);

  useEffect(() => {
    // validate on load
    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async ({ email, key, rememberHours = 12 }) => {
      if (!ADMIN_KEY) throw new Error("VITE_ADMIN_KEY missing (Vercel env).");

      const cleanEmail = String(email || "").trim().toLowerCase();
      const cleanKey = String(key || "").trim();

      if (!cleanEmail) throw new Error("Email required.");
      if (!cleanKey) throw new Error("Key required.");

      if (cleanKey !== ADMIN_KEY) {
        throw new Error("Invalid admin key.");
      }

      const exp = safeNow() + Math.max(1, Number(rememberHours)) * 60 * 60;
      const sig = await sha256Hex(`${cleanEmail}|${exp}|${ADMIN_KEY}`);
      localStorage.setItem(LS_KEY, JSON.stringify({ email: cleanEmail, exp, sig }));

      setIsAdmin(true);
      setAdminEmail(cleanEmail);
    },
    [ADMIN_KEY]
  );

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  const value = useMemo(
    () => ({
      loading,
      isAdmin,
      adminEmail,
      login,
      logout,
      refresh: validateSession,
    }),
    [loading, isAdmin, adminEmail, login, logout, validateSession]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}