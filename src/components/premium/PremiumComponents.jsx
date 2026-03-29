import React from "react";
import { Crown } from "lucide-react";

export function PremiumBadge({ label = "PREMIUM", className = "" }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 999,
        background: "linear-gradient(90deg,#d8b4ff,#9f7aea)",
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
      }}
    >
      <Crown style={{ width: 12, height: 12 }} />
      {label}
    </span>
  );
}

export function UpgradeModal({ isOpen, onClose, feature }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1a1030 0%, #0d0f1a 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 22,
          padding: "36px 32px",
          maxWidth: 420,
          width: "90%",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 0 60px rgba(170,120,255,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Crown style={{ width: 40, height: 40, margin: "0 auto 16px", color: "#d8b4ff" }} />
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          Premium Gerekli
        </h2>
        <p style={{ opacity: 0.75, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          Bu alan Premium abonelik gerektirir. Yukselt ve tum kapilari ac.
        </p>
        <button
          onClick={onClose}
          style={{
            padding: "12px 28px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(170,120,255,0.25)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

export default function PremiumComponents() {
  return null;
}
