import React from "react";
import { useNavigate } from "react-router-dom";

export default function LibraryPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", padding: 32, color: "white" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: 24,
          padding: "8px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.05)",
          color: "white",
          cursor: "pointer"
        }}
      >
        ← Kapılara Dön
      </button>

      <h1 style={{ fontSize: 36, marginBottom: 16 }}>
        📚 Kütüphane
      </h1>

      <p style={{ opacity: 0.7 }}>
        112. Kitap • Sesli Bölümler • Ritüel Arşivi
      </p>
    </div>
  );
}