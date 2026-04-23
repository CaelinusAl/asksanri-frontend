import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restorePurchasesByEmail } from "../data/shopierConfig";
import { useAuth } from "../contexts/AuthContext";
import { WHATSAPP_SUPPORT_URL as WHATSAPP_LINK } from "../constants/whatsappSupport";

/**
 * "Satın alımımı geri yükle" modalı.
 *
 * Akış:
 *  1. Kullanıcıdan e-posta alır (giriş yapmışsa otomatik doldurur).
 *  2. Sunucudan o e-postaya bağlı tüm Shopier satın alımlarını çeker.
 *  3. Bulunanları localStorage'a doğrulanmış unlock olarak yazar.
 *  4. Sonucu kullanıcıya bildirir; success durumunda sayfa kendiliğinden yenilenir.
 *
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   contentLabel?: string   — "Matrix Rol Okuma" gibi bağlam etiketi (opsiyonel)
 *   onRestored?: (items) => void — başarılı durumda listeyi parent'a bildir
 */
export default function RestorePurchaseModal({
  open,
  onClose,
  contentLabel = "",
  onRestored,
}) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | empty | error
  const [errorMsg, setErrorMsg] = useState("");
  const [restored, setRestored] = useState([]);

  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    setErrorMsg("");
    setRestored([]);
    const prefill = user?.email && user.email.includes("@") ? user.email : "";
    if (prefill) setEmail(prefill);
  }, [open, user?.email]);

  const handleRestore = useCallback(async () => {
    const em = email.trim().toLowerCase();
    if (!em || !em.includes("@")) {
      setErrorMsg("Geçerli bir e-posta gir.");
      return;
    }
    setErrorMsg("");
    setStatus("loading");

    const result = await restorePurchasesByEmail(em);

    if (!result.ok) {
      if (result.reason === "bad_email") {
        setErrorMsg("Geçerli bir e-posta gir.");
      } else {
        setErrorMsg("Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.");
      }
      setStatus("error");
      return;
    }

    if (result.totalUnlocked === 0 || result.newItems.length === 0 && result.reason === "empty") {
      setStatus("empty");
      return;
    }

    setRestored(result.newItems);
    setStatus("success");
    if (typeof onRestored === "function") {
      try { onRestored(result.newItems); } catch {}
    }

    /* Yeni erişim açıldıysa sayfa içindeki kilitli görünümü temiz yenilemek için reload. */
    if (result.newItems.length > 0) {
      window.setTimeout(() => {
        try { window.location.reload(); } catch {}
      }, 1400);
    }
  }, [email, onRestored]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div style={S.backdrop} onClick={onClose}>
        <motion.div
          style={S.card}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {status === "success" ? (
            <>
              <div style={S.glyphOk}>✓</div>
              <p style={S.titleOk}>Erişimin açıldı</p>
              <p style={S.desc}>
                {restored.length === 1
                  ? "1 satın alımın bu cihaza yüklendi."
                  : `${restored.length} satın alımın bu cihaza yüklendi.`}
              </p>
              <ul style={S.list}>
                {restored.map((it) => (
                  <li key={it.content_id} style={S.listItem}>
                    ✦ {it.label}
                  </li>
                ))}
              </ul>
              <p style={S.descSoft}>Sayfa yenileniyor…</p>
            </>
          ) : status === "empty" ? (
            <>
              <div style={S.glyph}>◇</div>
              <p style={S.title}>Bu e-posta ile eşleşen satın alım bulunamadı</p>
              <p style={S.desc}>
                • Shopier'da kullandığın e-posta ile tam olarak eşleşmeli{"\n"}
                • Ödemenin birkaç dakika gecikmesi normaldir — tekrar dene{"\n"}
                • Farklı bir e-posta denemek istersen aşağıdan değiştir
              </p>
              <input
                style={S.input}
                type="email"
                placeholder="ornek@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleRestore()}
                autoFocus
              />
              <button
                type="button"
                style={S.btnPrimary}
                onClick={handleRestore}
              >
                Tekrar dene
              </button>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={S.whatsapp}
              >
                WhatsApp ile destek al
              </a>
              <button type="button" style={S.btnGhost} onClick={onClose}>
                Kapat
              </button>
            </>
          ) : (
            <>
              <div style={S.glyph}>✦</div>
              <p style={S.title}>Satın alımımı geri yükle</p>
              <p style={S.desc}>
                {contentLabel
                  ? `${contentLabel} için satın aldığın e-postayı gir.\nBu cihaza anında yüklenir.`
                  : "Shopier'da kullandığın e-postayı gir. Satın alımların bu cihaza yüklenir."}
              </p>
              <input
                style={S.input}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="ornek@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleRestore()}
                disabled={status === "loading"}
                autoFocus
              />
              {errorMsg ? <p style={S.error}>{errorMsg}</p> : null}
              <button
                type="button"
                style={{ ...S.btnPrimary, opacity: status === "loading" ? 0.55 : 1 }}
                onClick={handleRestore}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Kontrol ediliyor…" : "Satın alımımı yükle"}
              </button>
              <button type="button" style={S.btnGhost} onClick={onClose}>
                Kapat
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const S = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 11500,
    background: "rgba(0,0,0,0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    maxWidth: 420,
    width: "100%",
    padding: "30px 28px 24px",
    borderRadius: 22,
    background: "linear-gradient(170deg, #14121e 0%, #0a0a10 100%)",
    border: "1px solid rgba(200,160,255,0.2)",
    boxShadow: "0 0 80px rgba(200,160,255,0.08)",
    textAlign: "center",
    color: "#e8e4f4",
  },
  glyph: {
    fontSize: 28,
    color: "rgba(200,160,255,0.55)",
    marginBottom: 14,
  },
  glyphOk: {
    fontSize: 34,
    color: "#78f7d8",
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: 700,
    color: "#e8e4f4",
    margin: "0 0 10px",
    letterSpacing: "0.02em",
  },
  titleOk: {
    fontSize: 20,
    fontWeight: 700,
    color: "#78f7d8",
    margin: "0 0 10px",
    letterSpacing: "0.02em",
  },
  desc: {
    fontSize: 14,
    color: "rgba(200,160,255,0.6)",
    margin: "0 0 18px",
    lineHeight: 1.65,
    whiteSpace: "pre-line",
    textAlign: "left",
  },
  descSoft: {
    fontSize: 13,
    color: "rgba(200,160,255,0.4)",
    margin: "10px 0 0",
    fontStyle: "italic",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0 8px",
    textAlign: "left",
  },
  listItem: {
    padding: "8px 12px",
    borderRadius: 10,
    background: "rgba(120,247,216,0.06)",
    border: "1px solid rgba(120,247,216,0.15)",
    color: "#cfeee0",
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid rgba(200,160,255,0.25)",
    background: "rgba(255,255,255,0.05)",
    color: "#e8e4f4",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 10,
  },
  error: {
    color: "#f6ad55",
    fontSize: 13,
    margin: "0 0 10px",
    textAlign: "left",
  },
  btnPrimary: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #c8a0ff, #a07aff)",
    color: "#07080d",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s",
    marginBottom: 10,
  },
  btnGhost: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid rgba(200,160,255,0.15)",
    background: "transparent",
    color: "rgba(200,160,255,0.55)",
    fontSize: 13,
    cursor: "pointer",
  },
  whatsapp: {
    display: "block",
    padding: "12px 16px",
    borderRadius: 12,
    background: "rgba(37,211,102,0.12)",
    border: "1px solid rgba(37,211,102,0.3)",
    color: "#25d366",
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
    textAlign: "center",
    marginBottom: 10,
  },
};
