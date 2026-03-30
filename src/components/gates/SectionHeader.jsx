import React from "react";

export default function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 40, animation: "g-fade-up .6s ease both" }}>
      <h1
        className="g-section-title"
        style={{
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: "-0.5px",
          lineHeight: 1.1,
          marginBottom: 14,
          background: "linear-gradient(135deg, #ffffff 20%, #d4b8ff 55%, #ffcc80 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: 16,
          color: "rgba(255,255,255,.50)",
          lineHeight: 1.65,
          maxWidth: 560,
          fontWeight: 400,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
