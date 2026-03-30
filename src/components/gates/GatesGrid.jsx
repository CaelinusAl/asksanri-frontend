import React from "react";
import GateFeatureCard from "./GateFeatureCard";

export default function GatesGrid({ gates, onGateClick }) {
  return (
    <div
      className="g-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
      }}
    >
      {gates.map((g, i) => (
        <GateFeatureCard
          key={g.key}
          gate={g}
          delay={i}
          onClick={() => onGateClick?.(g)}
        />
      ))}
    </div>
  );
}
