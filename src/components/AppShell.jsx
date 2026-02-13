// src/components/AppShell.jsx
import React from "react";
import StarTrail from "./StarTrail";
import { unlockAudio } from "../utils/sfx";

export default function AppShell({ children }) {
  return (
    <div onPointerDown={unlockAudio}>
      <StarTrail />
      {children}
    </div>
  );
}