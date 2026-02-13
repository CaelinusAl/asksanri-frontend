// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// PAGES
import HomePage from "./pages/HomePage";
import SanriyaSorPage from "./pages/SanriyaSorPage";
import BilincAlaniPage from "./pages/BilincAlaniPage";
import FrekansAlaniPage from "./pages/FrekansAlaniPage";
import RituelAlaniPage from "./pages/RituelAlaniPage";
import LibraryPage from "./pages/LibraryPage";

// (Opsiyonel) Admin
import AdminLayout from "./components/admin/AdminLayout"; // varsa
// import AdminDashboard from "./pages/admin/AdminDashboard"; // varsa

export default function App() {
  return (
    <Routes>
      {/* Home / Gates */}
      <Route path="/" element={<HomePage />} />

      {/* Gates */}
      <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
      <Route path="/bilinc-alani" element={<BilincAlaniPage />} />
      <Route path="/frekans-alani" element={<FrekansAlaniPage />} />
      <Route path="/rituel-alani" element={<RituelAlaniPage />} />
      <Route path="/library" element={<LibraryPage />} />

      {/* Admin (varsa) */}
      <Route path="/admin/*" element={<AdminLayout />}>
        {/* <Route index element={<AdminDashboard />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
