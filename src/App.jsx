import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SanriyaSorPage from "./pages/SanriyaSorPage";
import AwakenedCitiesPage from "./pages/AwakendCitiesPage";
import PortalPage from "./pages/PortalPage";
import FrekansAlaniPage from "./pages/FrekansAlaniPage";
import LibraryPage from "./pages/LibraryPage";
import BookReader from "./pages/BookReader";
import RituelAlaniPage from "./pages/RituelAlaniPage";
import RitualDetailPage from "./pages/RitualDetailPage";
import RitualSessionPage from "./pages/RitualSessionPage";
import YankiAlaniPage from "./pages/YankiAlaniPage";
import YankiPostDetail from "./pages/YankiPostDetail";
import YankiYeniPage from "./pages/YankiYeniPage";
import YankiProfilPage from "./pages/YankiProfilPage";
import YankiAdminPage from "./pages/admin/YankiAdminPage";
import YankiShareLanding from "./pages/YankiShareLanding";
import OkumaAlaniPage from "./pages/OkumaAlaniPage";
import OkumaDetayPage from "./pages/OkumaDetayPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/sanri" element={<SanriyaSorPage />} />
      <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
      <Route path="/ask" element={<SanriyaSorPage />} />

      <Route path="/bilinc-alani" element={<PortalPage />} />
      <Route path="/frekans-alani" element={<FrekansAlaniPage />} />
      <Route path="/uyanan-sehirler" element={<AwakenedCitiesPage />} />

      <Route path="/rituel-alani" element={<RituelAlaniPage />} />
      <Route path="/rituel-alani/:id" element={<RitualDetailPage />} />
      <Route path="/rituel-alani/:id/session" element={<RitualSessionPage />} />

      <Route path="/yanki/:id" element={<YankiShareLanding />} />
      <Route path="/yanki-alani" element={<YankiAlaniPage />} />
      <Route path="/yanki-alani/yeni" element={<YankiYeniPage />} />
      <Route path="/yanki-alani/profil/:userId" element={<YankiProfilPage />} />
      <Route path="/yanki-alani/admin" element={<YankiAdminPage />} />
      <Route path="/yanki-alani/:id" element={<YankiPostDetail />} />

      <Route path="/okuma-alani" element={<OkumaAlaniPage />} />
      <Route path="/okuma-alani/:slug" element={<OkumaDetayPage />} />
      <Route path="/1999" element={<Navigate to="/okuma-alani/1999-kapanmayan-frekans" replace />} />

      <Route path="/library" element={<LibraryPage />} />
      <Route path="/library/:bookId" element={<BookReader />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
