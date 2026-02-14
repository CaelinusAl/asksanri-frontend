// src/components/admin/AdminGuard.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";

export default function AdminGuard({ children }) {
  const { loading, isAdmin } = useAdmin();
  const loc = useLocation();

  if (loading) return null; // istersen loader koyarız

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }

  return children;
}