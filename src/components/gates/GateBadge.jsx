import React from "react";

export default function GateBadge({ children, color = "rgba(255,200,100,.85)" }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "5px 14px",
      borderRadius: 8,
      background: `linear-gradient(135deg, ${color.replace(/[\d.]+\)$/, ".12)")}, ${color.replace(/[\d.]+\)$/, ".06)")})`,
      border: `1px solid ${color.replace(/[\d.]+\)$/, ".25)")}`,
      color,
      fontSize: 10,
      fontWeight: 900,
      letterSpacing: "2.5px",
      textTransform: "uppercase",
      lineHeight: 1,
    }}>
      {children}
    </span>
  );
}
