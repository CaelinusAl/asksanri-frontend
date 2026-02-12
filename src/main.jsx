import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { LanguageProvider } from "./contexts/LanguageContext";
import { DoorNavProvider } from "./contexts/DoorNavContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <DoorNavProvider>
          <App />
        </DoorNavProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);