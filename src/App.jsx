// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import DoorTransition from "./components/DoorTransition";
import { useDoor } from "./contexts/DoorNavContext";

// Pages
import HomePage from "./pages/HomePage";
import SanriyaSorPage from "./pages/SanriyaSorPage";
import BilincAlaniPage from "./pages/BilincAlaniPage";
import FrekansPage from "./pages/FrekansPage";
import RituelAlaniPage from "./pages/RituelAlaniPage";

export default function App() {
  const location = useLocation();
  const { doorOpen } = useDoor();

  return (
    <>
      <DoorTransition isOpen={doorOpen} />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
          <Route path="/bilinc-alani" element={<BilincAlaniPage />} />
          <Route path="/frekans" element={<FrekansPage />} />
          <Route path="/rituel-alani" element={<RituelAlaniPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}