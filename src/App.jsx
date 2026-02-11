import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SanriyaSorPage from "./pages/SanriyaSorPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}