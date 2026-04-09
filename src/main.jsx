import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import App from "./App";
import { Footer } from "./components/layout/Footer";
import MicroPayModal from "./components/MicroPayModal";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { DoorNavProvider } from "./contexts/DoorNavContext";
import { PremiumProvider } from "./contexts/PremiumContext";
import { OfflineMeshProvider } from "./contexts/OfflineMeshContext";
import OfflineBanner from "./components/offline/OfflineBanner";
import { NomadToaster } from "./components/NomadToaster";

import "./index.css";
import "./data/analytics";
import ErrorBoundary from "./components/ErrorBoundary";

function renderRootError(err, reset) {
  const msg = err?.message || String(err);
  const devDetail = import.meta.env.DEV ? `\n\n${err?.stack || ""}` : "";
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#0d0818",
        color: "#e9ecff",
        fontFamily: "system-ui, sans-serif",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", margin: "0 0 12px" }}>Sanrı yüklenemedi</h1>
      <p style={{ margin: "0 0 16px", lineHeight: 1.55, opacity: 0.9 }}>
        Yerelde beyaz ekran genelde bir JavaScript hatasıdır. Aşağıdaki metni kopyalayıp geliştiriciye veya
        konsoldaki kırmızı hataya bakın. <code style={{ opacity: 0.85 }}>npm run dev</code> ile açtığınızdan
        emin olun (dosyayı çift tıklayıp file:// ile açmayın).
      </p>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 12,
          padding: 12,
          background: "rgba(0,0,0,0.35)",
          borderRadius: 8,
          border: "1px solid rgba(167,139,250,0.25)",
        }}
      >
        {msg}
        {devDetail}
      </pre>
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: 20,
          padding: "10px 18px",
          borderRadius: 999,
          border: "1px solid rgba(167,139,250,0.4)",
          background: "rgba(124,58,237,0.25)",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Tekrar dene
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary renderError={renderRootError}>
      <HelmetProvider>
        <ThemeProvider>
          <NomadToaster />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <LanguageProvider>
              <AuthProvider>
                <AdminProvider>
                  <PremiumProvider>
                    <OfflineMeshProvider>
                      <DoorNavProvider>
                        <OfflineBanner />
                        <App />
                        <Footer />
                        <MicroPayModal />
                        <ThemeToggle />
                      </DoorNavProvider>
                    </OfflineMeshProvider>
                  </PremiumProvider>
                </AdminProvider>
              </AuthProvider>
            </LanguageProvider>
          </BrowserRouter>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);