import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Eğer senin sayfaların varsa bunları import edeceğiz.
// Şimdilik en minimal çalışan yapı:
function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#07080d", color: "white", padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 22 }}>AskSanri</h1>
      <p style={{ opacity: 0.7, marginTop: 8 }}>
        Web frontend ayağa kalktı. (Vercel build OK)
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Bilinmeyen route'ları anasayfaya yönlendir (SPA fix) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}