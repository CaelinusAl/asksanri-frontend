import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SanriyaSorPage from "./pages/SanriyaSorPage";
import AwakenedCitiesPage from "./pages/AwakendCitiesPage";
import PortalPage from "./pages/PortalPage";
import FrekansAlaniPage from "./pages/FrekansAlaniPage";
import LibraryPage from "./pages/LibraryPage";
import BookReader from "./pages/BookReader";

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

      <Route path="/library" element={<LibraryPage />} />
      <Route path="/library/:bookId" element={<BookReader />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
