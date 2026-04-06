import React from "react";
import { useAdmin } from "../../contexts/AdminContext";
import { Navigate, useLocation } from "react-router-dom";

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        background: "#0a0a12",
        color: "rgba(255, 255, 255, 0.88)",
        fontSize: "0.9375rem",
        letterSpacing: "0.06em",
        colorScheme: "dark",
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <title>Loading</title>
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 24 24"
            to="360 24 24"
            dur="0.9s"
            repeatCount="indefinite"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="#c8a0ff"
            strokeWidth="3"
            strokeDasharray="31.4 94.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <span>Loading…</span>
    </div>
  );
}

export default function AdminGuard({ children }) {
  const { loading, isAdmin } = useAdmin();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
