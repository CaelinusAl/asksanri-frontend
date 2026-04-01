import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const AdminContext = createContext(null);
const API = import.meta.env.VITE_BACKEND_URL || "";
const TOKEN_KEY = "sanri_token";

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), []);

  const validateAdmin = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      setIsAdmin(false);
      setAdminUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("unauthorized");
      const data = await res.json();
      if (data.role === "admin") {
        setIsAdmin(true);
        setAdminUser(data);
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
    } catch {
      setIsAdmin(false);
      setAdminUser(null);
    }
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    validateAdmin();
  }, [validateAdmin]);

  const login = useCallback(async ({ email, password }) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Login failed");
    }
    const data = await res.json();
    if (!data.access_token) throw new Error("No token received");
    localStorage.setItem(TOKEN_KEY, data.access_token);

    const meRes = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    if (!meRes.ok) throw new Error("Failed to verify user");
    const me = await meRes.json();
    if (me.role !== "admin") {
      localStorage.removeItem(TOKEN_KEY);
      throw new Error("Bu hesap admin yetkisine sahip değil.");
    }
    setIsAdmin(true);
    setAdminUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAdmin(false);
    setAdminUser(null);
  }, []);

  const adminFetch = useCallback(async (path, options = {}) => {
    const token = getToken();
    const headers = { ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }
    const res = await fetch(`${API}${path}`, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      setIsAdmin(false);
      setAdminUser(null);
      throw new Error("Unauthorized");
    }
    return res;
  }, [getToken]);

  const value = useMemo(
    () => ({ loading, isAdmin, adminUser, login, logout, adminFetch, refresh: validateAdmin }),
    [loading, isAdmin, adminUser, login, logout, adminFetch, validateAdmin]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
