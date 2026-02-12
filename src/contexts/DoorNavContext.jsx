// src/contexts/DoorNavContext.jsx
import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playSfx, unlockAudio } from "../utils/sfx";

const DoorNavContext = createContext(null);

export function DoorNavProvider({ children }) {
  const navigate = useNavigate();
  const [doorOpen, setDoorOpen] = useState(true);
  const busyRef = useRef(false);

  const go = (path, navOptions) => {
    if (!path || busyRef.current) return;
    busyRef.current = true;

    unlockAudio();

    // 1) sadece kapı "whoosh"
    playSfx("/sfx/door-whoosh.mp3", { volume: 0.75 });

    // 2) kapı kapanır
    setDoorOpen(false);

    // 3) route değiştir
    window.setTimeout(() => {
      navigate(path, navOptions);
      // 4) kapıyı aç
      window.setTimeout(() => {
        setDoorOpen(true);
        busyRef.current = false;
      }, 220);
    }, 520);
  };

  const value = useMemo(() => ({ doorOpen, go }), [doorOpen]);

  return <DoorNavContext.Provider value={value}>{children}</DoorNavContext.Provider>;
}

export function useDoor() {
  const ctx = useContext(DoorNavContext);
  if (!ctx) throw new Error("useDoor must be used inside DoorNavProvider");
  return ctx;
}