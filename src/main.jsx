import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { Footer } from "./components/layout/Footer";
import MicroPayModal from "./components/MicroPayModal";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { DoorNavProvider } from "./contexts/DoorNavContext";
import { PremiumProvider } from "./contexts/PremiumContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LanguageProvider>
        <AuthProvider>
          <AdminProvider>
            <PremiumProvider>
              <DoorNavProvider>
                <App />
                <Footer />
                <MicroPayModal />
              </DoorNavProvider>
            </PremiumProvider>
          </AdminProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);