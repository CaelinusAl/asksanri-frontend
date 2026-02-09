import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "sonner";

import Navbar from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import { useAdmin } from "./contexts/AdminContext";

const HomePage = lazy(() => import("./pages/HomePage"));
const CitiesPage = lazy(() => import("./pages/CitiesPage"));
const CityDetailPage = lazy(() => import("./pages/CityDetailPage"));
const ReadingLayersPage = lazy(() => import("./pages/ReadingLayersPage"));
const SanriyaSorPage = lazy(() => import("./pages/SanriyaSorPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BilincPage = lazy(() => import("./pages/BilincPage"));
const FrekansPage = lazy(() => import("./pages/FrekansPage"));
const RituelAlaniPage = lazy(() => import("./pages/RituelAlaniPage"));
const BilincAlaniPage = lazy(() => import("./pages/BilincAlaniPage"));
const GorselinPage = lazy(() => import("./pages/GorselinPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const GirisPage = lazy(() => import("./pages/GirisPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const AuthCallback = lazy(() => import("./components/AuthCallback"));
const GizlilikPage = lazy(() => import("./pages/GizlilikPage"));

const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminSubscriptionPage = lazy(() => import("./pages/admin/AdminSubscriptionPage"));
const RitualsList = lazy(() => import("./pages/admin/RitualsList"));
const RitualBuilder = lazy(() => import("./pages/admin/RitualBuilder"));
const VisualPresetsPage = lazy(() => import("./pages/admin/VisualPresetsPage"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
        <span className="font-serif text-xl text-primary">∞</span>
      </div>
      <p className="text-muted-foreground text-sm">Yükleniyor...</p>
    </div>
  </div>
);

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdmin();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <AdminLoginPage />;
  return <AdminLayout>{children}</AdminLayout>;
};

const LayoutWrapper = ({ children, isDark, toggleTheme }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";
  if (isAdminRoute || isHomePage) return children;

  return (
    <>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("caelinus-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("caelinus-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <LayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sehirler" element={<CitiesPage />} />
            <Route path="/sehir/:cityId" element={<CityDetailPage />} />
            <Route path="/okuma-katmanlari" element={<ReadingLayersPage />} />
            <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
            <Route path="/bilinc" element={<BilincPage />} />
            <Route path="/frekans" element={<FrekansPage />} />
            <Route path="/rituel" element={<RituelAlaniPage />} />
            <Route path="/bilinc-alani" element={<BilincAlaniPage />} />
            <Route path="/gorselin" element={<GorselinPage />} />
            <Route path="/hakkinda" element={<AboutPage />} />
            <Route path="/premium" element={<SubscriptionPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/giris" element={<GirisPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/gizlilik" element={<GizlilikPage />} />
            <Route path="/privacy" element={<GizlilikPage />} />

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptionPage /></AdminRoute>} />
            <Route path="/admin/rituals" element={<AdminRoute><RitualsList /></AdminRoute>} />
            <Route path="/admin/rituals/new" element={<AdminRoute><RitualBuilder /></AdminRoute>} />
            <Route path="/admin/rituals/:id" element={<AdminRoute><RitualBuilder /></AdminRoute>} />
            <Route path="/admin/visual-presets" element={<AdminRoute><VisualPresetsPage /></AdminRoute>} />
          </Routes>
        </Suspense>
      </LayoutWrapper>

      <Toaster position="bottom-right" />
    </div>
  );
}