import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DoorNavProvider } from "./contexts/DoorNavContext";

import "./index.css";

window.addEventListener("error", (e) => {
  document.body.innerHTML =
    "<pre style='white-space:pre-wrap;color:#fff;background:#000;padding:16px;'>" +
    (e?.error?.stack || e?.message || String(e)) +
    "</pre>";
});

window.addEventListener("unhandledrejection", (e) => {
  document.body.innerHTML =
    "<pre style='white-space:pre-wrap;color:#fff;background:#000;padding:16px;'>" +
    (e?.reason?.stack || e?.reason?.message || String(e?.reason || e)) +
    "</pre>";
});



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <DoorNavProvider>
            <App />
          </DoorNavProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);