import React from "react";

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 22,
        padding: "18px 16px",
        borderTop: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(10,10,16,0.65)",
        color: "rgba(255,255,255,0.80)",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ fontSize: 12, lineHeight: 1.6 }}>
          <b>SANRI</b> bir sembolik farkındalık aynasıdır. Kehanet/teşhis/yargı üretmez.
          Nihai sorumluluk kullanıcıdadır.
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/docs/Ask-SANRI-Policy.pdf" target="_blank" rel="noreferrer" style={linkStyle}>
            Policy
          </a>
          <a href="/docs/Ask-SANRI-Policy.pdf" target="_blank" rel="noreferrer" style={linkStyle}>
            Terms
          </a>
          <a href="/docs/Ask-SANRI-Policy.pdf" target="_blank" rel="noreferrer" style={linkStyle}>
            Disclaimer
          </a>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
          © {new Date().getFullYear()} CaelinusAI • SANRI
        </div>
      </div>
    </footer>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(0,0,0,0.25)",
};