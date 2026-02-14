// src/contexts/DoorNavContext.jsx
import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { unlockAudio } from "../utils/sfx"; // ✅ gerekli (mobilde tıklayınca audio izni)

const DoorNavContext = createContext(null);

/**
 * DoorNav: sadece "kapıdan geçiş" navigasyonu yönetir.
 * ❌ burada SES yok. (SFX sadece SanriyaSorPage içinde)
 */
export function DoorNavProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = useCallback(
    (path, opts = {}) => {
      // Mobilde audio izinlerini tek dokunuşta açmak için:
      try {
        unlockAudio();
      } catch {}

      // aynı sayfadaysak tekrar navigate etme
      if (location.pathname === path) return;

      navigate(path, { replace: false, state: opts.state || {} });
    },
    [navigate, location.pathname]
  );

  const value = useMemo(() => ({ go }), [go]);

  return <DoorNavContext.Provider value={value}>{children}</DoorNavContext.Provider>;
}

export function useDoor() {
  const ctx = useContext(DoorNavContext);
  if (!ctx) throw new Error("useDoor must be used inside DoorNavProvider");
  return ctx;
}