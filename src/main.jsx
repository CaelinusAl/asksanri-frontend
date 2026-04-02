import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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

import "./index.css";
import "./data/analytics";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LanguageProvider>
        <AuthProvider>
          <AdminProvider>
            <PremiumProvider>
              <DoorNavProvider>
                <App />
                <Footer />
                <MicroPayModal />
                <ThemeToggle />
              </DoorNavProvider>
            </PremiumProvider>
          </AdminProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
    </ThemeProvider>
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);