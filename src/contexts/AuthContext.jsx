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
      const token =
        document.cookie.split(";").find((c) => c.trim().startsWith("access_token=")) ||
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token") ||
        "";

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const meRes = await fetch(`${API}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!meRes.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const me = await meRes.json().catch(() => ({}));

      let sub = {};
      try {
        const subRes = await fetch(`${API}/api/subscription/status`, {
          method: "GET",
          credentials: "include",
        });
        if (subRes.ok) {
          sub = await subRes.json().catch(() => ({}));
        }
      } catch {
        sub = {};
      }

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

      const res = await fetch(`${API}/auth/login`, {
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

      const res = await fetch(`${API}/auth/register`, {
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
      await fetch(`${API}/auth/logout`, {
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