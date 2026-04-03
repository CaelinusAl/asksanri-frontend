import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import usePageView from "./hooks/usePageView";

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
import YankiShareLanding from "./pages/YankiShareLanding";
import OkumaAlaniPage from "./pages/OkumaAlaniPage";
import OkumaDetayPage from "./pages/OkumaDetayPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminOkumaPage from "./pages/admin/AdminOkumaPage";
import AdminLibraryPage from "./pages/admin/AdminLibraryPage";
import AdminYankiPage from "./pages/admin/AdminYankiPage";
import AdminRituelPage from "./pages/admin/AdminRituelPage";
import AdminPremiumPage from "./pages/admin/AdminPremiumPage";
import AdminRevenuePage from "./pages/admin/AdminRevenuePage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";
import AdminSystemPage from "./pages/admin/AdminSystemPage";
import AdminContentEnginePage from "./pages/admin/AdminContentEnginePage";
import AdminCalendarPage from "./pages/admin/AdminCalendarPage";
import AdminGrowthPage from "./pages/admin/AdminGrowthPage";
import AdminBillingPage from "./pages/admin/AdminBillingPage";
import AdminFunnelPage from "./pages/admin/AdminFunnelPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import IyzicoCallbackPage from "./pages/IyzicoCallbackPage";
import OdemeBasariliPage from "./pages/OdemeBasariliPage";
import GirisPage from "./pages/GirisPage";
import ProfilePage from "./pages/ProfilePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import GizlilikPage from "./pages/GizlilikPage";
import { HakkimizdaPage, GizlilikPolitikasiPage, MesafeliSatisPage, IadeKosullariPage } from "./pages/LegalPages";
import KodEgitmeniPage from "./pages/KodEgitmeniPage";
import BenimAlanimPage from "./pages/BenimAlanimPage";
import RolOkumaPage from "./pages/RolOkumaPage";
import AnKodPage from "./pages/AnKodPage";
import GozAcikGunesPage from "./pages/GozAcikGunesPage";
import AuthCallback from "./components/AuthCallback";
import PendingPurchaseRecovery from "./components/PendingPurchaseRecovery";
import EmailCaptureModal from "./components/EmailCaptureModal";

export default function App() {
  usePageView();
  return (
    <>
    <PendingPurchaseRecovery />
    <EmailCaptureModal trigger="timer" page="global" />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/giris" element={<GirisPage />} />
      <Route path="/profil" element={<ProfilePage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/gizlilik" element={<GizlilikPage />} />
      <Route path="/hakkimizda" element={<HakkimizdaPage />} />
      <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasiPage />} />
      <Route path="/mesafeli-satis" element={<MesafeliSatisPage />} />
      <Route path="/iade-kosullari" element={<IadeKosullariPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

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
      <Route path="/yanki-alani/:id" element={<YankiPostDetail />} />

      <Route path="/okuma-alani" element={<OkumaAlaniPage />} />
      <Route path="/okuma-alani/:slug" element={<OkumaDetayPage />} />
      <Route path="/1999" element={<Navigate to="/okuma-alani/1999-kapanmayan-frekans" replace />} />

      <Route path="/kod-egitmeni" element={<KodEgitmeniPage />} />
      <Route path="/rol-okuma" element={<RolOkumaPage />} />
      <Route path="/an-kod" element={<AnKodPage />} />
      <Route path="/goz-acik-gunes" element={<GozAcikGunesPage />} />
      <Route path="/benim-alanim" element={<BenimAlanimPage />} />

      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/cancel" element={<PaymentCancelPage />} />
      <Route path="/payment/iyzico-callback" element={<IyzicoCallbackPage />} />
      <Route path="/odeme-basarili" element={<OdemeBasariliPage />} />

      <Route path="/library" element={<LibraryPage />} />
      <Route path="/library/:bookId" element={<BookReader />} />

      {/* Admin Control Center */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="okuma" element={<AdminOkumaPage />} />
        <Route path="library" element={<AdminLibraryPage />} />
        <Route path="yanki" element={<AdminYankiPage />} />
        <Route path="rituel" element={<AdminRituelPage />} />
        <Route path="engine" element={<AdminContentEnginePage />} />
        <Route path="calendar" element={<AdminCalendarPage />} />
        <Route path="growth" element={<AdminGrowthPage />} />
        <Route path="premium" element={<AdminPremiumPage />} />
        <Route path="revenue" element={<AdminRevenuePage />} />
        <Route path="funnel" element={<AdminFunnelPage />} />
        <Route path="billing" element={<AdminBillingPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="system" element={<AdminSystemPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
