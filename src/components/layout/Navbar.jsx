import React from "react";
import { Link, useLocation } from "react-router-dom";

const modes = [
  { id: "ayna_sade", label: "Ayna • Sade" },
  { id: "ayna_derin", label: "Ayna • Derin" },
  { id: "ayna_eylem", label: "Ayna • Eylem" },
];

export default function Navbar({ mode, setMode }) {
  const location = useLocation();

  const nav = [
    { href: "/", label: "Ask SANRI" },
    { href: "/ask", label: "Soru Alanı" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        background: "rgba(10,10,16,0.65)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/branding/sanri-icon.png"
            alt="SANRI"
            width="34"
            height="34"
            style={{ borderRadius: 10 }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 800, letterSpacing: 1 }}>SANRI</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Consciousness Mirror</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              style={{
                color: "white",
                textDecoration: "none",
                opacity: location.pathname === item.href ? 1 : 0.75,
                fontWeight: location.pathname === item.href ? 700 : 500,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>Mod</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.35)",
              color: "white",
              outline: "none",
            }}
          >
            {modes.map((m) => (
              <option key={m.id} value={m.id} style={{ color: "black" }}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}