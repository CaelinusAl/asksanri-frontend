// src/hooks/useDoorNav.js
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useDoorNav() {
  const navigate = useNavigate();
  const [doorOpen, setDoorOpen] = useState(true);
  const nextPathRef = useRef(null);

  const go = useCallback((path) => {
    if (!path) return;
    nextPathRef.current = path;

    setDoorOpen(false);

    window.setTimeout(() => {
      navigate(nextPathRef.current);
      window.setTimeout(() => setDoorOpen(true), 120);
    }, 560);
  }, [navigate]);

  return { doorOpen, go };
}