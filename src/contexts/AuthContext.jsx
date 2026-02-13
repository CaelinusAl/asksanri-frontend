import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const API = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // { email?, is_premium?, authenticated? ... }
  const [error, setError] = useState("");

  const refreshMe = useCallback(async () => {
    if (!API) {
      setError("VITE_BACKEND_URL missing");
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1) auth/me
      const meRes = await fetch(`${API}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      const me = await meRes.json().catch(() => ({}));

      // Eğer backend 401 dönüyorsa: login değil
      if (!meRes.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 2) subscription/status (premium bilgisini buradan çekelim)
      let sub = {};
      try {
        const subRes = await fetch(`${API}/api/subscription/status`, {
          method: "GET",
          credentials: "include",
        });
        sub = await subRes.json().catch(() => ({}));
      } catch {
        sub = {};
      }

      // normalize
      const normalized = {
        ...me,
        authenticated: me?.authenticated ?? true,
        email: me?.email ?? me?.user?.email ?? "",
        is_premium:
          me?.is_premium ??
          me?.isPremium ??
          sub?.is_premium ??
          sub?.isPremium ??
          sub?.active ??
          false,
        plan: sub?.plan ?? sub?.current_plan ?? me?.plan ?? null,
      };

      setUser(normalized);
      setLoading(false);
    } catch (e) {
      setError("Auth network error");
      setUser(null);
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const loginEmail = useCallback(
    async ({ email, password }) => {
      if (!API) throw new Error("VITE_BACKEND_URL missing");

      const res = await fetch(`${API}/api/auth/email/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || "Login failed");

      await refreshMe();
      return data;
    },
    [API, refreshMe]
  );

  const registerEmail = useCallback(
    async ({ email, password }) => {
      if (!API) throw new Error("VITE_BACKEND_URL missing");

      const res = await fetch(`${API}/api/auth/email/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || "Register failed");

      await refreshMe();
      return data;
    },
    [API, refreshMe]
  );

  const logout = useCallback(async () => {
    if (!API) return;
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    await refreshMe();
  }, [API, refreshMe]);

  const value = useMemo(() => {
    const isAuthenticated = Boolean(user?.authenticated);
    const isPremium = Boolean(user?.is_premium);

    return {
      loading,
      user,
      error,
      isAuthenticated,
      isPremium,
      refreshMe,
      loginEmail,
      registerEmail,
      logout,
    };
  }, [loading, user, error, refreshMe, loginEmail, registerEmail, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}