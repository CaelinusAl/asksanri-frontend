import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "sanri_token";

function getStoredToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function storeToken(token) {
  try { if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY); } catch {}
}

function authHeaders(token) {
  const h = { "Content-Type": "application/json" };
  if (token) {
    h["Authorization"] = `Bearer ${token}`;
  }
  return h;
}

export function AuthProvider({ children }) {
  const API = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const refreshMe = useCallback(async (overrideToken) => {
    const t = overrideToken ?? getStoredToken();
    if (!API || !t) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const meRes = await fetch(`${API}/auth/me`, {
        method: "GET",
        headers: authHeaders(t),
      });

      const me = await meRes.json().catch(() => ({}));

      if (!meRes.ok) {
        storeToken(null);
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      let sub = {};
      try {
        const subRes = await fetch(`${API}/api/subscription/status`, {
          method: "GET",
          headers: authHeaders(t),
        });
        sub = await subRes.json().catch(() => ({}));
      } catch {
        sub = {};
      }

      const normalized = {
        ...me,
        authenticated: true,
        email: me?.email ?? "",
        is_premium:
          me?.is_premium ?? me?.isPremium ??
          sub?.is_premium ?? sub?.isPremium ?? sub?.active ?? false,
        plan: sub?.plan ?? sub?.current_plan ?? me?.plan ?? null,
      };

      setUser(normalized);
      setLoading(false);
    } catch {
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

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || "Login failed");

      if (data?.token) {
        storeToken(data.token);
        setToken(data.token);
        await refreshMe(data.token);
      }

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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || "Register failed");

      if (data?.token) {
        storeToken(data.token);
        setToken(data.token);
        await refreshMe(data.token);
      }

      return data;
    },
    [API, refreshMe]
  );

  const logout = useCallback(() => {
    storeToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => {
    const isAuthenticated = Boolean(user?.authenticated);
    const isPremium = Boolean(user?.is_premium);

    return {
      loading,
      token,
      user,
      error,
      isAuthenticated,
      isPremium,
      refreshMe,
      loginEmail,
      registerEmail,
      logout,
    };
  }, [loading, token, user, error, refreshMe, loginEmail, registerEmail, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}