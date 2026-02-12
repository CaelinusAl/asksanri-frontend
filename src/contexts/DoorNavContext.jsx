// src/contexts/DoorNavContext.jsx
import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSfx } from "../utils/sfx";

const DoorNavContext = createContext(null);

export function DoorNavProvider({ children }) {
  const navigate = useNavigate();

  const [doorOpen, setDoorOpen] = useState(true); // true: sayfa açık (kapı açık)
  const nextPathRef = useRef(null);
  const busyRef = useRef(false);

  const api = useMemo(() => {
    const go = (path) => {
      if (!path || busyRef.current) return;

      busyRef.current = true;
      nextPathRef.current = path;

      // 1) her zaman whoosh (kapı kapanırken)
      playSfx("/sfx/door-whoosh.mp3", { volume: 0.7 });

      // 2) kapıyı kapat
      setDoorOpen(false);

      // 3) route değiştir (kapı kapandıktan sonra)
      window.setTimeout(() => {
        navigate(nextPathRef.current);

        // 4) sadece ilk girişte aura-chime
        const firstEntry = !sessionStorage.getItem("sanriFirstEntryPlayed");
        if (firstEntry) {
          sessionStorage.setItem("sanriFirstEntryPlayed", "true");
          window.setTimeout(() => {
            playSfx("/sfx/aura-chime.mp3", { volume: 0.9 });
          }, 250);
        }

        // 5) küçük nefes, sonra kapıyı aç
        window.setTimeout(() => {
          setDoorOpen(true);
          busyRef.current = false;
        }, 180);
      }, 520);
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