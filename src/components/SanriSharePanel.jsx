import React, { useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildSanriShareText,
  SANRI_SHARE_URL,
  truncateForTwitter,
} from "../data/sanriShare";
import { trackEvent } from "../data/analytics";
import styles from "./SanriSharePanel.module.css";

function wrapCanvasLines(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawShareCard(canvas, anaTema) {
  const w = 1080;
  const h = 1350;
  const dpr = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 2;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.textBaseline = "top";

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#0f0618");
  g.addColorStop(0.45, "#120a1e");
  g.addColorStop(1, "#061218");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(200, 160, 255, 0.22)";
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, w - 96, h - 96);

  ctx.fillStyle = "rgba(120, 247, 216, 0.55)";
  ctx.font = "600 28px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SANRI", w / 2, 120);

  ctx.fillStyle = "rgba(200, 160, 255, 0.95)";
  ctx.font = "600 52px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("Rolünü Hatırla", w / 2, 200);

  const body = String(anaTema || "").trim() || "Matrix Rol";
  ctx.fillStyle = "rgba(232, 228, 244, 0.92)";
  ctx.font = "400 34px system-ui, -apple-system, Segoe UI, sans-serif";
  const maxW = w - 160;
  const lines = wrapCanvasLines(ctx, body, maxW).slice(0, 12);
  let y = 340;
  for (const ln of lines) {
    ctx.fillText(ln, w / 2, y);
    y += 48;
  }

  ctx.fillStyle = "rgba(200, 160, 255, 0.35)";
  ctx.font = "italic 26px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("Bu rastgele değilmiş.", w / 2, h - 220);

  ctx.fillStyle = "rgba(120, 247, 216, 0.9)";
  ctx.font = "600 30px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("asksanri.com", w / 2, h - 140);
}

export default function SanriSharePanel({ anaTema, className = "" }) {
  const shareText = useMemo(() => buildSanriShareText(anaTema), [anaTema]);
  const [igOpen, setIgOpen] = useState(false);
  const [tiktokNote, setTiktokNote] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const copyShareText = useCallback(async () => {
    trackEvent("share_click", { platform: "copy" });
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      /* ignore */
    }
  }, [shareText]);

  const openUrl = useCallback((url, platform) => {
    trackEvent("share_click", { platform });
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const whatsapp = useCallback(() => {
    openUrl(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "whatsapp");
  }, [openUrl, shareText]);

  const twitter = useCallback(() => {
    const tweetText = truncateForTwitter(shareText);
    openUrl(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      "twitter"
    );
  }, [openUrl, shareText]);

  const facebook = useCallback(() => {
    const u = encodeURIComponent(SANRI_SHARE_URL);
    const q = encodeURIComponent(shareText);
    openUrl(
      `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${q}`,
      "facebook"
    );
  }, [openUrl, shareText]);

  const instagram = useCallback(async () => {
    trackEvent("share_click", { platform: "instagram" });
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch {
      /* ignore */
    }
    setIgOpen(true);
  }, [shareText]);

  const tiktok = useCallback(async () => {
    trackEvent("share_click", { platform: "tiktok" });
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n\n${SANRI_SHARE_URL}`);
      }
    } catch {
      /* ignore */
    }
    setTiktokNote(true);
    window.setTimeout(() => setTiktokNote(false), 6000);
  }, [shareText]);

  const downloadCard = useCallback(() => {
    trackEvent("share_click", { platform: "share_card_download" });
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawShareCard(canvas, anaTema);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sanri-rol-karti.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [anaTema]);

  return (
    <motion.div
      className={`${styles.panel} ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <canvas ref={canvasRef} className={styles.hiddenCanvas} aria-hidden />

      <p className={styles.triggerLine}>
        Bu sana dokunduysa…
        <br />
        bir kişiyle paylaş.
      </p>

      <div className={styles.btnGrid}>
        <button type="button" className={styles.shareBtn} onClick={whatsapp}>
          <span className={styles.shareIcon} aria-hidden>💬</span>
          WhatsApp
        </button>
        <button type="button" className={styles.shareBtn} onClick={twitter}>
          <span className={styles.shareIcon} aria-hidden>𝕏</span>
          X (Twitter)
        </button>
        <button type="button" className={styles.shareBtn} onClick={facebook}>
          <span className={styles.shareIcon} aria-hidden>f</span>
          Facebook
        </button>
        <button type="button" className={styles.shareBtn} onClick={instagram}>
          <span className={styles.shareIcon} aria-hidden>◎</span>
          Instagram
        </button>
        <button type="button" className={styles.shareBtn} onClick={copyShareText}>
          <span className={styles.shareIcon} aria-hidden>📋</span>
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
        <button type="button" className={styles.shareBtnGhost} onClick={tiktok}>
          <span className={styles.shareIcon} aria-hidden>♪</span>
          TikTok (metin kopyala)
        </button>
      </div>

      <button type="button" className={styles.cardBtn} onClick={downloadCard}>
        Paylaşım kartı indir (PNG)
      </button>

      <AnimatePresence>
        {igOpen && (
          <motion.div
            className={styles.hintCard}
            role="status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className={styles.hintText}>
              Metni panoya kopyaladık. Instagram’da <strong>Hikaye</strong> veya{" "}
              <strong>Gönderi</strong> açıp yapıştırarak paylaşabilirsin.
            </p>
            <button type="button" className={styles.hintClose} onClick={() => setIgOpen(false)}>
              Tamam
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {tiktokNote ? (
        <p className={styles.tiktokHint} role="status">
          TikTok’ta paylaşmak için metni kopyaladık; uygulamada açıklamaya yapıştırıp linki ekleyebilirsin.
        </p>
      ) : null}

      <p className={styles.previewLabel}>Paylaşım özeti</p>
      <pre className={styles.previewText}>{shareText}</pre>
    </motion.div>
  );
}
