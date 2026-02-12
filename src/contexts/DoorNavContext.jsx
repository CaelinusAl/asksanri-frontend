// src/contexts/DoorNavContext.jsx
import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSfx } from "../utils/sfx";

const DoorNavContext = createContext(null);

export function DoorNavProvider({ children }) {
  const navigate = useNavigate();
  const [doorOpen, setDoorOpen] = useState(true);
  const nextPathRef = useRef(null);
  const busyRef = useRef(false);

  const api = useMemo(() => {
    const go = (path) => {
      if (!path || busyRef.current) return;
      busyRef.current = true;
      nextPathRef.current = path;

      // 1) whoosh (kapı kapanırken)
      playSfx("/sfx/door-whoosh.mp3", { volume: 0.8 });

      // 2) kapıyı kapat
      setDoorOpen(false);

      // 3) route değiştir
      window.setTimeout(() => {
        navigate(nextPathRef.current);
        // 4) aura chime (içeri girerken)
        playSfx("/sfx/aura-chime.mp3", { volume: 0.55 });

        // 5) kapıyı aç
        window.setTimeout(() => {
          setDoorOpen(true);
          busyRef.current = false;
        }, 240);
      }, 560);
    };

    return { doorOpen, go };
  }, [doorOpen, navigate]);

  return <DoorNavContext.Provider value={api}>{children}</DoorNavContext.Provider>;
}

export function useDoor() {
  const ctx = useContext(DoorNavContext);
  if (!ctx) throw new Error("useDoor must be used inside DoorNavProvider");
  return ctx;
}
