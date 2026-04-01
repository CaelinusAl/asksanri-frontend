
 import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
 import { useAuth } from "./AuthContext";

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
  const { isPremium: authPremium } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [requestedFeature, setRequestedFeature] = useState(FEATURES.SANRI_UNLIMITED);

  const devOverride = typeof window !== "undefined"
    ? localStorage.getItem("sanri_mock_premium")
    : null;
  const isPremium = devOverride !== null ? devOverride === "true" : Boolean(authPremium);
  const currentPlan = isPremium ? "premium" : "free";

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

  // Limit sistemi: şimdilik sınırsız gibi
  const checkDailyLimit = useCallback(() => {
    return { allowed: true, remaining: null, limit: null };
  }, []);

  // UI metni
  const upgradePrompt = useCallback((_featureKey) => {
    return {
      title: "Premium gerekli",
      desc: "Bu kapı Premium. Devam etmek için yükselt.",
      cta: "Yükselt",
    };
  }, []);

  const value = useMemo(
    () => ({
      isPremium,
      currentPlan,

      // gating
      hasFeature,
      getRequiredPlan,
      checkDailyLimit,

      // upgrade modal
      isUpgradeModalOpen,
      requestedFeature,
      showUpgradeModal,
      hideUpgradeModal,

      // copy
      upgradePrompt,
    }),
    [
      isPremium,
      currentPlan,
      hasFeature,
      getRequiredPlan,
      checkDailyLimit,
      isUpgradeModalOpen,
      requestedFeature,
      showUpgradeModal,
      hideUpgradeModal,
      upgradePrompt,
    ]
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export default PremiumContext;