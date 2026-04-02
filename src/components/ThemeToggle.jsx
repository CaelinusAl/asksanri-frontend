import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Gece modu" : "Gündüz modu"}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9990,
        width: 46,
        height: 46,
        borderRadius: "50%",
        border: isLight
          ? "1px solid rgba(100,80,160,0.2)"
          : "1px solid rgba(200,160,255,0.2)",
        background: isLight
          ? "rgba(255,255,255,0.9)"
          : "rgba(20,18,30,0.85)",
        backdropFilter: "blur(12px)",
        boxShadow: isLight
          ? "0 2px 16px rgba(0,0,0,0.1)"
          : "0 2px 20px rgba(200,160,255,0.1)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        transition: "all 0.3s ease",
        padding: 0,
      }}
    >
      {isLight ? "\u{1F319}" : "\u2600\uFE0F"}
    </button>
  );
}
