import React from "react";
import { useLocation } from "react-router-dom";

const ADMIN_PREFIX = "/admin";

export function Footer() {
  const { pathname } = useLocation();

  if (pathname.startsWith(ADMIN_PREFIX)) return null;

  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        <nav style={navStyle}>
          <a href="/terms" style={linkStyle}>Hizmet Şartları</a>
          <span style={separatorStyle}>|</span>
          <a href="/privacy" style={linkStyle}>Gizlilik Politikası</a>
          <span style={separatorStyle}>|</span>
          <a href="/privacy" style={linkStyle}>Çerez Politikası</a>
          <span style={separatorStyle}>|</span>
          <a href="/about" style={linkStyle}>Hakkımızda</a>
          <span style={separatorStyle}>|</span>
          <a href="mailto:caelinus@caelinus.co" style={linkStyle}>İletişim</a>
        </nav>

        <div style={companyStyle}>
          CR YAPIM VE AJANS TEKNOLOJİLERİ TİC.ŞTİ.
        </div>

        <div style={detailStyle}>
          Kadıköy Rasimpaşa Vergi Dairesi &nbsp;•&nbsp; İletişim: caelinus@caelinus.co
        </div>

        <div style={copyrightStyle}>
          © {new Date().getFullYear()} CaelinusAI • SANRI
        </div>
      </div>
    </footer>
  );
}

const footerStyle = {
  width: "100%",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(6,6,14,0.92)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  padding: "28px 20px 22px",
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const innerStyle = {
  maxWidth: 860,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  textAlign: "center",
};

const navStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
};

const linkStyle = {
  color: "rgba(255,255,255,0.65)",
  textDecoration: "none",
  fontSize: 13,
  transition: "color 0.2s",
};

const separatorStyle = {
  color: "rgba(255,255,255,0.20)",
  fontSize: 13,
  userSelect: "none",
};

const companyStyle = {
  marginTop: 8,
  color: "rgba(255,255,255,0.50)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.3,
};

const detailStyle = {
  color: "rgba(255,255,255,0.35)",
  fontSize: 11,
  lineHeight: 1.5,
};

const copyrightStyle = {
  marginTop: 4,
  color: "rgba(255,255,255,0.28)",
  fontSize: 11,
};
