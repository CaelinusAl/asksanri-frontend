import React from "react";

export default function ThinkingDots({ label = "Sanrı düşünüyor" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}>
      <span>{label}</span>
      <span className="dots" aria-hidden="true">
        <span className="dot">•</span>
        <span className="dot">•</span>
        <span className="dot">•</span>
      </span>

      <style>{`
        .dots { display:inline-flex; gap:6px; opacity:.9; }
        .dot { animation: dotPulse 1.05s infinite; transform: translateY(1px); }
        .dot:nth-child(2){ animation-delay: .15s; }
        .dot:nth-child(3){ animation-delay: .3s; }
        @keyframes dotPulse {
          0%, 100% { opacity:.25; transform: translateY(1px) scale(.95); }
          50% { opacity:1; transform: translateY(0px) scale(1.05); }
        }
      `}</style>
    </span>
  );
}