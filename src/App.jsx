import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SanriyaSorPage from "./pages/SanriyaSorPage";

// Eğer bu sayfalar sende varsa aç:
// import AwakenedCitiesPage from "./pages/AwakenedCitiesPage";
// import BilincAlaniPage from "./pages/BilincAlaniPage";

export default function App() {
  return (
    <Routes>
      {/* Kapılar */}
      <Route path="/" element={<HomePage />} />

      {/* SANRI’ya Sor */}
      <Route path="/sanri" element={<SanriyaSorPage />} />

      {/* Eski linkler / geri uyumluluk */}
      <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
      <Route path="/ask" element={<SanriyaSorPage />} />

      {/* (Opsiyonel) diğer kapılar sende varsa aç */}
      {/* <Route path="/sehirler" element={<AwakenedCitiesPage />} /> */}
      {/* <Route path="/bilinc" element={<BilincAlaniPage />} /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
