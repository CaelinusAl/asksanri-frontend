
 import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
 import { useAuth } from "./AuthContext";
 import { getAllPricingOptions } from "../data/microPayment";
 import { fetchMyAccess, createIyzicoCheckout, createCheckoutSession, useFreeUnlock as apiFreeUnlock } from "../data/billingApi";

export const FEATURES = {
  SANRI_UNLIMITED: "sanri_unlimited",
  RITUEL_ALANI: "rituel_alani",
  FREKANS_ALANI: "frekans_alani",
  BILINC_ALANI: "bilinc_alani",
  PROFILE_MIRROR: "profile_mirror",
  OKUMA_PREMIUM: "okuma_premium",
  LIBRARY_PREMIUM: "library_premium",
};

const PremiumContext = createContext(null);

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within PremiumProvider");
  return ctx;
}

export function PremiumProvider({ children }) {
  const { isPremium: authPremium, isAuthenticated, refreshMe, user } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [requestedFeature, setRequestedFeature] = useState(FEATURES.SANRI_UNLIMITED);

  const [microPayOpen, setMicroPayOpen] = useState(false);
  const [microPayContentId, setMicroPayContentId] = useState(null);
  const [microPayContentType, setMicroPayContentType] = useState("single_okuma");

  const [accessData, setAccessData] = useState(null);
  const [accessLoading, setAccessLoading] = useState(false);

  const devOverride = typeof window !== "undefined"
    ? localStorage.getItem("sanri_mock_premium")
    : null;

  const isAdmin = user?.role === "admin";

  const isPremium = isAdmin
    ? true
    : devOverride !== null
      ? devOverride === "true"
      : Boolean(accessData?.is_premium ?? authPremium);

  const currentPlan = accessData?.plan || (isPremium ? "premium" : "free");
  const hasFreeUnlock = Boolean(accessData?.has_free_unlock);

  const refreshAccess = useCallback(async () => {
    if (!isAuthenticated) return;
    setAccessLoading(true);
    try {
      const data = await fetchMyAccess();
      setAccessData(data);
    } catch { /* silent */ }
    setAccessLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    refreshAccess();
  }, [refreshAccess]);

  const showUpgradeModal = useCallback((featureKey = FEATURES.SANRI_UNLIMITED) => {
    setRequestedFeature(featureKey);
    setIsUpgradeModalOpen(true);
  }, []);

  const hideUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(false);
  }, []);

  const hasFeature = useCallback((_featureKey) => {
    return isPremium;
  }, [isPremium]);

  const getRequiredPlan = useCallback((_featureKey) => {
    return "premium";
  }, []);

  const checkDailyLimit = useCallback(() => {
    return { allowed: true, remaining: null, limit: null };
  }, []);

  const upgradePrompt = useCallback((_featureKey) => {
    return {
      title: "Premium gerekli",
      desc: "Bu kapı Premium. Devam etmek için yükselt.",
      cta: "Yükselt",
    };
  }, []);

  const isContentUnlocked = useCallback((contentId) => {
    if (isPremium) return true;
    const ids = accessData?.unlocked_content_ids || [];
    return ids.includes(String(contentId));
  }, [isPremium, accessData]);

  const showMicroPayModal = useCallback((contentId, contentType = "single_okuma") => {
    setMicroPayContentId(contentId);
    setMicroPayContentType(contentType);
    setMicroPayOpen(true);
  }, []);

  const hideMicroPayModal = useCallback(() => {
    setMicroPayOpen(false);
    setMicroPayContentId(null);
  }, []);

  const startCheckout = useCallback(async (productKey, contentId) => {
    const data = await createIyzicoCheckout({ productKey, contentId });
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    }
    return data;
  }, []);

  const claimFreeUnlock = useCallback(async (contentId, contentType = "okuma") => {
    const result = await apiFreeUnlock({ contentId, contentType });
    await refreshAccess();
    await refreshMe();
    setMicroPayOpen(false);
    setMicroPayContentId(null);
    return result;
  }, [refreshAccess, refreshMe]);

  const onPaymentSuccess = useCallback(async () => {
    await refreshMe();
    await refreshAccess();
    setMicroPayOpen(false);
    setMicroPayContentId(null);
  }, [refreshMe, refreshAccess]);

  const value = useMemo(
    () => ({
      isPremium,
      currentPlan,
      accessData,
      accessLoading,
      hasFreeUnlock,

      hasFeature,
      getRequiredPlan,
      checkDailyLimit,

      isUpgradeModalOpen,
      requestedFeature,
      showUpgradeModal,
      hideUpgradeModal,

      upgradePrompt,

      isContentUnlocked,
      microPayOpen,
      microPayContentId,
      microPayContentType,
      showMicroPayModal,
      hideMicroPayModal,
      startCheckout,
      claimFreeUnlock,
      onPaymentSuccess,
      refreshAccess,
      pricingOptions: getAllPricingOptions(),
    }),
    [
      isPremium,
      currentPlan,
      accessData,
      accessLoading,
      hasFreeUnlock,
      hasFeature,
      getRequiredPlan,
      checkDailyLimit,
      isUpgradeModalOpen,
      requestedFeature,
      showUpgradeModal,
      hideUpgradeModal,
      upgradePrompt,
      isContentUnlocked,
      microPayOpen,
      microPayContentId,
      microPayContentType,
      showMicroPayModal,
      hideMicroPayModal,
      startCheckout,
      claimFreeUnlock,
      onPaymentSuccess,
      refreshAccess,
    ]
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export default PremiumContext;
