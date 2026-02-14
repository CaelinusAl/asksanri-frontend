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
import AwakenedCitiesPage from "./pages/AwakenedCitiesPage";
import YasamKocuPage from "./pages/YasamKocuPage";

// ADMIN PAGES
import AdminPanelPage from "./pages/AdminPanelPage";
import AdminMembersPage from "./pages/AdminMembersPage";

// Eğer gerçekten kullanıyorsan bırak, kullanmıyorsan silebilirsin
// import AdminLayout from "./components/admin/AdminLayout";

export default function App() {
  return (
    <Routes>

      {/* HOME */}
      <Route path="/" element={<HomePage />} />

      {/* CORE PAGES */}
      <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
      <Route path="/bilinc-alani" element={<BilincAlaniPage />} />
      <Route path="/frekans-alani" element={<FrekansAlaniPage />} />
      <Route path="/rituel-alani" element={<RituelAlaniPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/uyanan-sehirler" element={<AwakenedCitiesPage />} />
      <Route path="/yasam-kocu" element={<YasamKocuPage />} />

      {/* ADMIN */}
      <Route path="/admin/panel" element={<AdminPanelPage />} />
      <Route path="/admin/members" element={<AdminMembersPage />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}