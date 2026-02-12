import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Kapılara geri: önce history geri, yoksa direkt kapılar (intro değil)
export default function useBackToGates() {
  const navigate = useNavigate();

  return useCallback(() => {
    // Browser'da history varsa geri dön
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    // Fallback: kapılar sayfası (intro değil!)
    navigate("/", { replace: true, state: { skipIntro: true } });
  }, [navigate]);
}