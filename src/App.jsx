import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SanriyaSorPage from "./pages/SanriyaSorPage";
import GizlilikPage from "./pages/GizlilikPage";
import TermsPage from "./pages/TermsPage";

import BilincAlaniPage from "./pages/BilincAlaniPage";
import FrekansAlaniPage from "./pages/FrekansAlaniPage";
import RituelAlaniPage from "./pages/RituelAlaniPage";
import LibraryPage from "./pages/LibraryPage";
import UyananSehirlerPage from "./pages/UyananSehirlerPage";
import YasamKocuPage from "./pages/YasamKocuPage";

import AdminPage from "./pages/AdminPage";

import YankiAlaniPage from "./pages/YankiAlaniPage";
import YankiYeniPage from "./pages/YankiYeniPage";


import ProfilePage from "./pages/ProfilePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import OnboardingPage from "./pages/OnboardingPage";
import CoachPanelPage from "./pages/CoachPanelPage";
import CoachOnboardingPage from "./pages/CoachOnboardingPage";
import AwakenedCitiesPage from "./pages/AwakendCitiesPage";
import CityDetailPage from "./pages/CityDetailPage";
import FrekansPage from "./pages/FrekansPage";
import BilincPage from "./pages/BilincPage";
import AskSanriPage from "./pages/AskSanriPage";
import GorselinPage from "./pages/GorselinPage";
import ReadingLayersPage from "./pages/ReadingLayersPage";
import GirisPage from "./pages/GirisPage";
import CitiesPage from "./pages/CitiesPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Main gates (HomePage kapıları) */}
      <Route path="/sanri" element={<SanriyaSorPage />} />
      <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
      <Route path="/ask" element={<SanriyaSorPage />} />
      <Route path="/ask-sanri" element={<AskSanriPage />} />

      <Route path="/bilinc-alani" element={<BilincAlaniPage />} />
      <Route path="/bilinc" element={<BilincPage />} />

      <Route path="/frekans-alani" element={<FrekansAlaniPage />} />
      <Route path="/frekans" element={<FrekansPage />} />

      <Route path="/rituel-alani" element={<RituelAlaniPage />} />

      <Route path="/library" element={<LibraryPage />} />

      <Route path="/uyanan-sehirler" element={<UyananSehirlerPage />} />
      <Route path="/awakened-cities" element={<AwakenedCitiesPage />} />
      <Route path="/cities" element={<CitiesPage />} />
      <Route path="/city/:cityId" element={<CityDetailPage />} />

      <Route path="/yasam-kocu" element={<YasamKocuPage />} />
      <Route path="/coach/panel" element={<CoachPanelPage />} />
      <Route path="/coach/onboarding" element={<CoachOnboardingPage />} />

      {/* User pages */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/giris" element={<GirisPage />} />
      <Route path="/gorsel" element={<GorselinPage />} />
      <Route path="/reading-layers" element={<ReadingLayersPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Yankı Alanı */}
      <Route path="/yanki-alani" element={<YankiAlaniPage />} />
      <Route path="/yanki-alani/yeni" element={<YankiYeniPage />} />

      {/* Admin pages */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/panel" element={<AdminPage />} />
      <Route path="/admin/members" element={<AdminPage />} />
      <Route path="/admin/stats" element={<AdminPage />} />
      <Route path="/admin/yanki" element={<AdminPage />} />

      {/* Legal pages - App Store / Play Store required */}
      <Route path="/privacy" element={<GizlilikPage />} />
      <Route path="/gizlilik" element={<GizlilikPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/kullanim-sartlari" element={<TermsPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
