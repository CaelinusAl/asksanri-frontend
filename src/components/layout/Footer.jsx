import React from "react";
import { Link, useLocation } from "react-router-dom";

const ADMIN_PREFIX = "/admin";
const HIDE_ON = ["/payment/", "/library/"];

export function Footer() {
  const { pathname } = useLocation();

  if (pathname.startsWith(ADMIN_PREFIX)) return null;
  if (HIDE_ON.some((p) => pathname.startsWith(p) && pathname !== "/library")) return null;

  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        {/* Legal links */}
        <nav style={navStyle}>
          <Link to="/hakkimizda" style={linkStyle}>Hakkımızda</Link>
          <span style={sepStyle}>·</span>
          <Link to="/gizlilik-politikasi" style={linkStyle}>Gizlilik Politikası</Link>
          <span style={sepStyle}>·</span>
          <Link to="/mesafeli-satis" style={linkStyle}>Mesafeli Satış Sözleşmesi</Link>
          <span style={sepStyle}>·</span>
          <Link to="/iade-kosullari" style={linkStyle}>İade Koşulları</Link>
          <span style={sepStyle}>·</span>
          <a href="mailto:selin@asksanri.com" style={linkStyle}>İletişim</a>
        </nav>

        {/* Company */}
        <div style={companyStyle}>
          CR YAPIM TEKNOLOJİLERİ REKLAM AJANSI TİC.LTD.ŞTİ.
        </div>
        <div style={detailStyle}>
          Kadıköy Rasimpaşa Vergi Dairesi &nbsp;•&nbsp; İstanbul, Türkiye
        </div>

        {/* Payment logos */}
        <div style={paymentRowStyle}>
          <div style={paymentBadgesStyle}>
            {/* Visa */}
            <svg style={cardLogoStyle} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#1A1F71" fillOpacity="0.3"/>
              <text x="24" y="20" textAnchor="middle" fill="#4169E1" fontSize="13" fontWeight="800" fontFamily="Inter,sans-serif" letterSpacing="1">VISA</text>
            </svg>
            {/* Mastercard */}
            <svg style={cardLogoStyle} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#1A1A1A" fillOpacity="0.3"/>
              <circle cx="19" cy="16" r="8" fill="#EB001B" fillOpacity="0.7"/>
              <circle cx="29" cy="16" r="8" fill="#F79E1B" fillOpacity="0.7"/>
            </svg>
          </div>
          <span style={iyzicoTextStyle}>iyzico ile güvenli ödeme</span>
        </div>

        {/* Copyright */}
        <div style={copyrightStyle}>
          © {new Date().getFullYear()} CaelinusAI • SANRI — Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}

const footerStyle = {
  width: "100%",
  borderTop: "1px solid var(--border)",
  background: "var(--bg-primary)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  padding: "32px 20px 24px",
  fontFamily: "'Inter', system-ui, sans-serif",
};

const innerStyle = {
  maxWidth: 860,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
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
  color: "var(--text-muted)",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 500,
  transition: "color 0.2s",
  padding: "2px 0",
};

const sepStyle = {
  color: "var(--text-dimmed)",
  fontSize: 12,
  userSelect: "none",
};

const companyStyle = {
  marginTop: 8,
  color: "var(--text-muted)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.4,
};

const detailStyle = {
  color: "var(--text-dimmed)",
  fontSize: 11,
  lineHeight: 1.5,
};

const paymentRowStyle = {
  marginTop: 12,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
};

const paymentBadgesStyle = {
  display: "flex",
  gap: 8,
  alignItems: "center",
};

const cardLogoStyle = {
  width: 44,
  height: 28,
  borderRadius: 4,
  border: "1px solid var(--border)",
};

const iyzicoTextStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-dimmed)",
  letterSpacing: 0.3,
};

const copyrightStyle = {
  marginTop: 8,
  color: "var(--text-dimmed)",
  fontSize: 10,
  letterSpacing: 0.3,
};
