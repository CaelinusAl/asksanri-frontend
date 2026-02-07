import { createContext, useContext, useMemo, useState, useCallback } from "react";

const PremiumContext = createContext(null);

export const FEATURES = {
  SANRI_UNLIMITED: "sanri_unlimited",
  // ileride ekleriz
};

export const usePremium = () => {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within PremiumProvider");
  return ctx;
};

/**
 * SAFE Premium Provider
 * - Backend subscription endpointleri yoksa (404) bile crash olmaz.
 * - Şimdilik her şeyi "free" gibi davranır.
 */
export const PremiumProvider = ({ children }) => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [requestedFeature, setRequestedFeature] = useState(FEATURES.SANRI_UNLIMITED);

  const isPremium = false;
  const currentPlan = null;

  const hasFeature = useCallback(() => {
    // Şimdilik: premium yok
    return false;
  }, []);

  const checkDailyLimit = useCallback(() => {
    // Şimdilik: limit bloklamıyoruz. (istersen burada günlük limit koyarız)
    return { allowed: true, remaining: null, limit: null };
  }, []);

  const showUpgradeModal = useCallback((feature) => {
    setRequestedFeature(feature || FEATURES.SANRI_UNLIMITED);
    setIsUpgradeModalOpen(true);
  }, []);

  const hideUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isPremium,
      currentPlan,
      hasFeature,
      checkDailyLimit,
      showUpgradeModal,
      hideUpgradeModal,
      isUpgradeModalOpen,
      requestedFeature,
    }),
    [isPremium, currentPlan, hasFeature, checkDailyLimit, showUpgradeModal, hideUpgradeModal, isUpgradeModalOpen, requestedFeature]
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
};

export default PremiumContext;