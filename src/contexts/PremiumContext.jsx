
 import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * FEATURES: PremiumComponents.jsx bunu import ediyor.
 * Bu yüzden burada mutlaka export olmalı.
 */
export const FEATURES = {
  SANRI_UNLIMITED: "sanri_unlimited",
  RITUEL_ALANI: "rituel_alani",
  FREKANS_ALANI: "frekans_alani",
  BILINC_ALANI: "bilinc_alani",
};

const PremiumContext = createContext(null);

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within PremiumProvider");
  return ctx;
}

/**
 * B-Mode: Backend yokken bile crash etmeyen "SAFE" provider.
 * Şimdilik her şeyi free gibi davranır.
 */
export function PremiumProvider({ children }) {
  // şimdilik sabit free
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [requestedFeature, setRequestedFeature] = useState(FEATURES.SANRI_UNLIMITED);

  const isPremium = false;
  const currentPlan = "free"; // sadece UI için

  const showUpgradeModal = useCallback((featureKey = FEATURES.SANRI_UNLIMITED) => {
    setRequestedFeature(featureKey);
    setIsUpgradeModalOpen(true);
  }, []);

  const hideUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(false);
  }, []);

  // Kapı kilidi: premium yoksa false döner (istersen bazılarına true yaparız)
  const hasFeature = useCallback((_featureKey) => {
    return false;
  }, []);

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