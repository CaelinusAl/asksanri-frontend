import React from "react";

export default function Hero({ title, subtitle }) {
  return (
    <div className="mb-10 text-center">
      <h1 className="text-4xl font-serif text-white">{title}</h1>
      <p className="mt-2 text-white/70">{subtitle}</p>
    </div>
  );
}