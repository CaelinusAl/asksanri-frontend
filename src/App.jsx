import React, { useEffect, useState, useRef, useCallback, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import usePageView from "./hooks/usePageView";
import { syncPurchasesFromServer } from "./data/shopierConfig";
import { useAuth } from "./contexts/AuthContext";
import PurchaseToast from "./components/PurchaseToast";
import ErrorBoundary from "./components/ErrorBoundary";

import AnlasilmaShell from "./pages/AnlasilmaShell";
import AnlasilmaHomePage from "./pages/AnlasilmaHomePage";

const FrekansAlaniPage = lazy(() => import("./pages/FrekansAlaniPage"));
const YankiAlaniPage = lazy(() => import("./pages/YankiAlaniPage"));
const YankiPostDetail = lazy(() => import("./pages/YankiPostDetail"));
const YankiYeniPage = lazy(() => import("./pages/YankiYeniPage"));
const YankiProfilPage = lazy(() => import("./pages/YankiProfilPage"));
const YankiShareLanding = lazy(() => import("./pages/YankiShareLanding"));
const RolOkumaPage = lazy(() => import("./pages/RolOkumaPage"));

const HomePage = lazy(() => import("./pages/HomePage"));
const SanriyaSorPage = lazy(() => import("./pages/SanriyaSorPage"));
const AwakenedCitiesPage = lazy(() => import("./pages/AwakendCitiesPage"));
const PortalPage = lazy(() => import("./pages/PortalPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const BookReader = lazy(() => import("./pages/BookReader"));
const RituelAlaniPage = lazy(() => import("./pages/RituelAlaniPage"));
const RitualDetailPage = lazy(() => import("./pages/RitualDetailPage"));
const RitualSessionPage = lazy(() => import("./pages/RitualSessionPage"));
const OkumaAlaniPage = lazy(() => import("./pages/OkumaAlaniPage"));
const OkumaDetayPage = lazy(() => import("./pages/OkumaDetayPage"));
const SanriMeshPage = lazy(() => import("./pages/SanriMeshPage"));
const KodEgitmeniPage = lazy(() => import("./pages/KodEgitmeniPage"));
const KodGirisDersPage = lazy(() => import("./pages/KodGirisDersPage"));
const AnKodPage = lazy(() => import("./pages/AnKodPage"));
const GozAcikGunesPage = lazy(() => import("./pages/GozAcikGunesPage"));
const BenimAlanimPage = lazy(() => import("./pages/BenimAlanimPage"));
const CitiesPage = lazy(() => import("./pages/CitiesPage"));
const CityDetailPage = lazy(() => import("./pages/CityDetailPage"));

const GirisPage = lazy(() => import("./pages/GirisPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const GizlilikPage = lazy(() => import("./pages/GizlilikPage"));
const HakkimizdaPage = lazy(() => import("./pages/LegalPages").then(m => ({ default: m.HakkimizdaPage })));
const GizlilikPolitikasiPage = lazy(() => import("./pages/LegalPages").then(m => ({ default: m.GizlilikPolitikasiPage })));
const MesafeliSatisPage = lazy(() => import("./pages/LegalPages").then(m => ({ default: m.MesafeliSatisPage })));
const IadeKosullariPage = lazy(() => import("./pages/LegalPages").then(m => ({ default: m.IadeKosullariPage })));

const HavaleOdemePage = lazy(() => import("./pages/HavaleOdemePage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentCancelPage = lazy(() => import("./pages/PaymentCancelPage"));
const IyzicoCallbackPage = lazy(() => import("./pages/IyzicoCallbackPage"));
const OdemeBasariliPage = lazy(() => import("./pages/OdemeBasariliPage"));

const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminGuard = lazy(() => import("./components/admin/AdminGuard"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminOkumaPage = lazy(() => import("./pages/admin/AdminOkumaPage"));
const AdminLibraryPage = lazy(() => import("./pages/admin/AdminLibraryPage"));
const AdminYankiPage = lazy(() => import("./pages/admin/AdminYankiPage"));
const AdminRituelPage = lazy(() => import("./pages/admin/AdminRituelPage"));
const AdminPremiumPage = lazy(() => import("./pages/admin/AdminPremiumPage"));
const AdminRevenuePage = lazy(() => import("./pages/admin/AdminRevenuePage"));
const AdminNotificationsPage = lazy(() => import("./pages/admin/AdminNotificationsPage"));
const AdminSystemPage = lazy(() => import("./pages/admin/AdminSystemPage"));
const AdminContentEnginePage = lazy(() => import("./pages/admin/AdminContentEnginePage"));
const AdminCalendarPage = lazy(() => import("./pages/admin/AdminCalendarPage"));
const AdminGrowthPage = lazy(() => import("./pages/admin/AdminGrowthPage"));
const AdminBillingPage = lazy(() => import("./pages/admin/AdminBillingPage"));
const AdminFunnelPage = lazy(() => import("./pages/admin/AdminFunnelPage"));
const AdminMuhasebePage = lazy(() => import("./pages/admin/AdminMuhasebePage"));
const AdminBankTransferPage = lazy(() => import("./pages/admin/AdminBankTransferPage"));
const AdminDeliverablesPage = lazy(() => import("./pages/admin/AdminDeliverablesPage"));

const AuthCallback = lazy(() => import("./components/AuthCallback"));
const LandingRolOkumaPage = lazy(() => import("./pages/LandingRolOkumaPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
import PendingPurchaseRecovery from "./components/PendingPurchaseRecovery";
import EmailCaptureModal from "./components/EmailCaptureModal";
import PushOptIn from "./components/PushOptIn";

const LazyFallback = () => (
  <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07080d" }}>
    <div style={{ color: "rgba(180,160,240,0.5)", fontSize: 13, letterSpacing: "0.1em" }}>...</div>
  </div>
);

const okumaAreaErrorStyle = {
  minHeight: "100vh",
  background: "#07080d",
  color: "#e8e4f0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  textAlign: "center",
  fontFamily: "system-ui, sans-serif",
};

function renderOkumaAreaError(err) {
  console.error("[Okuma alanı] error boundary:", err);
  return (
    <div style={okumaAreaErrorStyle}>
      <p style={{ margin: "0 0 20px", maxWidth: 420, lineHeight: 1.55 }}>
        Okuma alanında beklenmeyen bir hata oluştu. Listeye dönüp tekrar deneyebilir veya sayfayı
        yenileyebilirsin.
      </p>
      <button
        type="button"
        style={{
          padding: "12px 24px",
          borderRadius: 12,
          border: "1px solid rgba(200,160,255,0.35)",
          background: "rgba(200,160,255,0.15)",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
        onClick={() => window.location.assign("/okuma-alani")}
      >
        Okuma alanına dön
      </button>
    </div>
  );
}

export default function App() {
  usePageView();
  const { isAuthenticated, user } = useAuth();
  const [toastItems, setToastItems] = useState(null);
  const authSyncDone = useRef(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("sanri_token")) return;
    } catch {}
    syncPurchasesFromServer();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || authSyncDone.current) return;
    authSyncDone.current = true;
    const email = user?.email || "";
    syncPurchasesFromServer({ returnDetails: true, email }).then((items) => {
      if (Array.isArray(items) && items.length > 0) {
        setToastItems(items);
      }
    });
  }, [isAuthenticated, user]);

  const dismissToast = useCallback(() => setToastItems(null), []);

  return (
    <>
    {toastItems && <PurchaseToast items={toastItems} onDismiss={dismissToast} />}
    <PendingPurchaseRecovery />
    <EmailCaptureModal trigger="timer" page="global" />
    <PushOptIn />
    <Suspense fallback={<LazyFallback />}>
    <Routes>
      {/* Sanrı = Anlaşılma Alanı — ana kabuk */}
      <Route path="/" element={<AnlasilmaShell />}>
        <Route index element={<AnlasilmaHomePage />} />
        <Route path="frekans" element={<FrekansAlaniPage />} />
        <Route path="yanki/yeni" element={<YankiYeniPage />} />
        <Route path="yanki/profil/:userId" element={<YankiProfilPage />} />
        <Route path="yanki/post/:id" element={<YankiPostDetail />} />
        <Route path="yanki" element={<YankiAlaniPage />} />
        <Route
          path="rol-okuma"
          element={
            <ErrorBoundary
              renderError={(err) => {
                console.error("[Matrix Rol] üst error boundary:", err);
                return (
                  <div
                    style={{
                      minHeight: "100vh",
                      background: "#07080d",
                      color: "#e8e4f0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 24,
                      textAlign: "center",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    <p style={{ margin: "0 0 20px", maxWidth: 380, lineHeight: 1.55 }}>
                      Matrix Rol sayfasında beklenmeyen bir hata oluştu. Sayfayı yenileyerek tekrar deneyebilirsin.
                    </p>
                    <button
                      type="button"
                      style={{
                        padding: "12px 24px",
                        borderRadius: 12,
                        border: "1px solid rgba(200,160,255,0.35)",
                        background: "rgba(200,160,255,0.15)",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      onClick={() => window.location.assign("/rol-okuma")}
                    >
                      Yenile
                    </button>
                  </div>
                );
              }}
            >
              <RolOkumaPage />
            </ErrorBoundary>
          }
        />
      </Route>

      <Route path="/kapilar" element={<HomePage />} />
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
      <Route path="/frekans-alani" element={<Navigate to="/frekans" replace />} />
      <Route path="/anlasilma-alani" element={<Navigate to="/" replace />} />
      <Route path="/uyanan-sehirler" element={<AwakenedCitiesPage />} />
      <Route path="/sehirler" element={<CitiesPage />} />
      <Route path="/sehir/:cityId" element={<CityDetailPage />} />

      <Route path="/rituel-alani" element={<RituelAlaniPage />} />
      <Route path="/rituel-alani/:id" element={<RitualDetailPage />} />
      <Route path="/rituel-alani/:id/session" element={<RitualSessionPage />} />

      {/* Dış paylaşım linki — /yanki/:id (iç uygulama /yanki/post/:id kullanır) */}
      <Route path="/yanki/:id" element={<YankiShareLanding />} />
      <Route path="/yanki-alani" element={<Navigate to="/yanki" replace />} />
      <Route path="/yanki-alani/yeni" element={<Navigate to="/yanki/yeni" replace />} />
      <Route path="/yanki-alani/profil/:userId" element={<Navigate to="/yanki/profil/:userId" replace />} />
      <Route path="/yanki-alani/:id" element={<Navigate to="/yanki/post/:id" replace />} />

      <Route
        path="/okuma-alani"
        element={
          <ErrorBoundary renderError={renderOkumaAreaError}>
            <OkumaAlaniPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/okuma-alani/gama-gamet-rolex-ust-bilinc-okuma"
        element={<Navigate to="/okuma-alani/gama-gamet-rouleaux-ust-bilinc-okuma" replace />}
      />
      <Route
        path="/okuma-alani/:slug"
        element={
          <ErrorBoundary renderError={renderOkumaAreaError}>
            <OkumaDetayPage />
          </ErrorBoundary>
        }
      />
      <Route path="/1999" element={<Navigate to="/okuma-alani/1999-kapanmayan-frekans" replace />} />

      <Route path="/kod-egitmeni" element={<KodEgitmeniPage />} />
      <Route path="/kod-okuma-sistemi" element={<KodEgitmeniPage />} />
      <Route path="/kod-ogrenmeye-giris" element={<KodGirisDersPage />} />
      <Route
        path="/an-kod"
        element={
          <ErrorBoundary
            renderError={(err) => {
              console.error("[AN-KOD] üst error boundary:", err);
              return (
                <div
                  style={{
                    minHeight: "100vh",
                    background: "#07080d",
                    color: "#e8e4f0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                    textAlign: "center",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  <h1
                    style={{
                      margin: "0 0 16px",
                      fontSize: "clamp(1rem, 4vw, 1.25rem)",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(200,160,255,0.95)",
                    }}
                  >
                    SANRI İNZİVADA
                  </h1>
                  <p style={{ margin: "0 0 12px", maxWidth: 380, lineHeight: 1.55, opacity: 0.75 }}>
                    Sayfa beklenmedik şekilde durdu. Yenileyerek tekrar deneyebilirsin.
                  </p>
                  <button
                    type="button"
                    style={{
                      marginTop: 8,
                      padding: "12px 24px",
                      borderRadius: 12,
                      border: "1px solid rgba(200,160,255,0.35)",
                      background: "rgba(200,160,255,0.15)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    onClick={() => window.location.assign("/an-kod")}
                  >
                    Yenile
                  </button>
                </div>
              );
            }}
          >
            <AnKodPage />
          </ErrorBoundary>
        }
      />
      <Route path="/goz-acik-gunes" element={<GozAcikGunesPage />} />
      <Route path="/benim-alanim" element={<BenimAlanimPage />} />

      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/cancel" element={<PaymentCancelPage />} />
      <Route path="/payment/iyzico-callback" element={<IyzicoCallbackPage />} />
      <Route path="/odeme-basarili" element={<OdemeBasariliPage />} />
      <Route path="/havale-odeme" element={<HavaleOdemePage />} />
      <Route path="/sanri-ag" element={<SanriMeshPage />} />
      <Route path="/d/rol-okuma" element={<LandingRolOkumaPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />

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
        <Route path="muhasebe" element={<AdminMuhasebePage />} />
        <Route path="banka-odemeleri" element={<AdminBankTransferPage />} />
        <Route path="teslimatlar" element={<AdminDeliverablesPage />} />
        <Route path="billing" element={<AdminBillingPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="system" element={<AdminSystemPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
    </>
  );
}
