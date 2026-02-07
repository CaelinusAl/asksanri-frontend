// CAELINUS AI - Authentication Context
// Google OAuth + JWT Auth + Bilinç Profili

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL; // e.g. https://sanri-api-production-8eee.up.railway.app

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Create a single axios client
  const api = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }, []);

  // Check auth status on mount
  const checkAuth = useCallback(async () => {
    // If env is missing, don't keep app stuck in loading
    if (!API_URL) {
      console.error("[AuthContext] VITE_BACKEND_URL is missing. Please set it in Vercel env vars.");
      setUser(null);
      setIsAuthenticated(false);
      setHasProfile(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/api/auth/me");

      if (response.data && response.data.user_id) {
        setUser(response.data);
        setIsAuthenticated(true);
        setHasProfile(!!response.data.has_profile);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setHasProfile(false);
      }
    } catch (error) {
      // Log once to see what's happening in prod
      console.warn("[AuthContext] checkAuth failed:", error?.message, error?.response?.status);
      setUser(null);
      setIsAuthenticated(false);
      setHasProfile(false);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Google OAuth login
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const loginWithGoogle = useCallback(() => {
    const redirectUrl = window.location.origin + "/auth/callback";
    window.location.href = https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)};
  }, []);

  // Apple Sign In (iOS App Store requirement)
  const loginWithApple = useCallback(() => {
    const redirectUrl = window.location.origin + "/auth/callback";
    window.location.href = https://auth.emergentagent.com/?provider=apple&redirect=${encodeURIComponent(redirectUrl)};
  }, []);

  // Email/Password login
  const loginWithEmail = useCallback(async (email, password) => {
    if (!API_URL) return { success: false, error: "Backend URL missing (VITE_BACKEND_URL)" };

    try {
      const response = await api.post("/api/auth/email/login", { email, password });

      if (response.data?.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setHasProfile(!!response.data.has_profile);
        return { success: true, hasProfile: !!response.data.has_profile };
      }
      return { success: false, error: "Giriş başarısız" };
    } catch (error) {
      const message = error.response?.data?.detail || "Giriş başarısız";
      return { success: false, error: message };
    }
  }, [api]);

  // Email/Password register
  const registerWithEmail = useCallback(async (email, password, name, profile = null) => {
    if (!API_URL) return { success: false, error: "Backend URL missing (VITE_BACKEND_URL)" };

    try {
      const response = await api.post("/api/auth/email/register", { email, password, name, profile });

      if (response.data?.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setHasProfile(!!response.data.has_profile);
        return { success: true, isNewUser: true, hasProfile: !!response.data.has_profile };
      }
      return { success: false, error: "Kayıt başarısız" };
    } catch (error) {
      const message = error.response?.data?.detail || "Kayıt başarısız";
      return { success: false, error: message };
    }
  }, [api]);

  // Process Google OAuth callback
  const processGoogleCallback = useCallback(async (sessionId) => {
    if (!API_URL) return { success: false, error: "Backend URL missing (VITE_BACKEND_URL)" };

    try {
      const response = await api.post("/api/auth/google/session", { session_id: sessionId });

      if (response.data?.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setHasProfile(!!response.data.has_profile);
        return {
          success: true,
          isNewUser: !!response.data.is_new_user,
          hasProfile: !!response.data.has_profile,
          user: response.data.user,
        };
      }
      return { success: false, error: "Oturum işleme hatası" };
    } catch (error) {
      const message = error.response?.data?.detail || "Oturum işleme hatası";
      return { success: false, error: message };
    }
  }, [api]);

  // Complete onboarding
  const completeOnboarding = useCallback(async (profileData) => {
    if (!API_URL) return { success: false, error: "Backend URL missing (VITE_BACKEND_URL)" };

    try {
      const response = await api.post("/api/auth/onboarding", profileData);

      if (response.data?.success) {
        setHasProfile(true);
        await checkAuth();
        return { success: true };
      }
      return { success: false, error: "Profil oluşturma hatası" };
    } catch (error) {
      const message = error.response?.data?.detail || "Profil oluşturma hatası";
      return { success: false, error: message };
    }
  }, [api, checkAuth]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout", {});
    } catch (error) {
      console.warn("[AuthContext] logout error:", error?.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setHasProfile(false);
    }
  }, [api]);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    if (!API_URL) return { success: false, error: "Backend URL missing (VITE_BACKEND_URL)" };

    try {
      const response = await api.put("/api/user/profile", profileData);

      if (response.data?.success) {
        await checkAuth();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  }, [api, checkAuth]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    hasProfile,
    loginWithGoogle,
    loginWithApple,
    loginWithEmail,
    registerWithEmail,
    processGoogleCallback,
    completeOnboarding,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;