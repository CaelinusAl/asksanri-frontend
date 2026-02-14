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
import AdminMembersPage from "./pages/AdminMembersPage";
import AdminPanelPage from "./pages/AdminPanelPage";


// YAŞAM KOÇU
import YasamKocuPage from "./pages/YasamKocuPage";

// (Opsiyonel) Admin
import AdminLayout from "./components/admin/AdminLayout"; // varsa
// import AdminDashboard from "./pages/admin/AdminDashboard"; // varsa

export default function App() {
  return (
    <Routes>
      {/* HOME / GATES */}
      <Route path="/" element={<HomePage />} />

      {/* PAGES */}
      <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
      <Route path="/bilinc-alani" element={<BilincAlaniPage />} />
      <Route path="/frekans-alani" element={<FrekansAlaniPage />} />
      <Route path="/rituel-alani" element={<RituelAlaniPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/uyanan-sehirler" element={<AwakenedCitiesPage />} />
      <Route path="/admin-stats" element={<AdminStatsPage />} />
      <Route path="/admin/members" element={<AdminMembersPage />} />
      <Route path="/admin/panel" element={<AdminPanelPage />} />

      {/* SANRI YAŞAM KOÇU */}
      <Route path="/yasam-kocu" element={<YasamKocuPage />} />

      {/* ADMIN (varsa) */}
      <Route path="/admin/*" element={<AdminLayout />}>
        {/* <Route index element={<AdminDashboard />} /> */}
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}