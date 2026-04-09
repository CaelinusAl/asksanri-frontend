import React, { useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildSanriShareText,
  SANRI_SHARE_URL,
  truncateForTwitter,
  parseReflectionShareLine,
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

function drawShareCard(canvas, bodyText, titleLine) {
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
  ctx.font = "600 48px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(titleLine, w / 2, 200);

  const body = String(bodyText || "").trim() || "—";
  ctx.fillStyle = "rgba(232, 228, 244, 0.92)";
  ctx.font = "400 32px system-ui, -apple-system, Segoe UI, sans-serif";
  const maxW = w - 160;
  const lines = wrapCanvasLines(ctx, body, maxW).slice(0, 12);
  let y = 320;
  for (const ln of lines) {
    ctx.fillText(ln, w / 2, y);
    y += 46;
  }

  ctx.fillStyle = "rgba(200, 160, 255, 0.35)";
  ctx.font = "italic 26px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("Bu rastgele değilmiş.", w / 2, h - 220);

  ctx.fillStyle = "rgba(120, 247, 216, 0.9)";
  ctx.font = "600 30px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("asksanri.com", w / 2, h - 140);
}

/**
 * @param {object} props
 * @param {string} [props.anaTema] — Matrix ana tema (reflectionText yoksa)
 * @param {string} [props.reflectionText] — Sanrı yansıması ham metni (varsa öncelik)
 * @param {string} [props.shareUrl] — paylaşım linki (Yankı / yönlendirme)
 * @param {"full"|"compact"} [props.variant]
 * @param {"rol"|"yanki"} [props.cardKind] — PNG başlığı
 * @param {boolean} [props.isTR]
 */
export default function SanriSharePanel({
  anaTema = "",
  reflectionText = null,
  shareUrl = null,
  variant = "full",
  cardKind = "rol",
  className = "",
  isTR = true,
  headline = "",
}) {
  const pageUrl = useMemo(
    () => String(shareUrl || "").trim() || SANRI_SHARE_URL,
    [shareUrl]
  );

  const summaryLine = useMemo(() => {
    if (reflectionText && String(reflectionText).trim()) {
      return parseReflectionShareLine(reflectionText);
    }
    return String(anaTema || "").trim() || (isTR ? "Matrix Rol okumamı denedim." : "I tried Matrix Rol on Sanrı.");
  }, [reflectionText, anaTema, isTR]);

  const shareText = useMemo(
    () => buildSanriShareText(summaryLine, pageUrl),
    [summaryLine, pageUrl]
  );

  const canvasTitle = cardKind === "yanki"
    ? (isTR ? "Yankı Yanıtı" : "Echo Reply")
    : (isTR ? "Rolünü Hatırla" : "Remember Your Role");

  const [igOpen, setIgOpen] = useState(false);
  const [tiktokNote, setTiktokNote] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  const compact = variant === "compact";

  const copyShareText = useCallback(async () => {
    trackEvent("share_click", { platform: "copy", context: cardKind });
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      /* ignore */
    }
  }, [shareText, cardKind]);

  const openUrl = useCallback((url, platform) => {
    trackEvent("share_click", { platform, context: cardKind });
    window.open(url, "_blank", "noopener,noreferrer");
  }, [cardKind]);

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
    const u = encodeURIComponent(pageUrl);
    const q = encodeURIComponent(shareText);
    openUrl(
      `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${q}`,
      "facebook"
    );
  }, [openUrl, shareText, pageUrl]);

  const instagram = useCallback(async () => {
    trackEvent("share_click", { platform: "instagram", context: cardKind });
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch {
      /* ignore */
    }
    setIgOpen(true);
  }, [shareText, cardKind]);

  const tiktok = useCallback(async () => {
    trackEvent("share_click", { platform: "tiktok", context: cardKind });
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n\n${pageUrl}`);
      }
    } catch {
      /* ignore */
    }
    setTiktokNote(true);
    window.setTimeout(() => setTiktokNote(false), 6000);
  }, [shareText, pageUrl, cardKind]);

  const downloadCard = useCallback(async () => {
    trackEvent("share_click", { platform: "share_card_download", context: cardKind });
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawShareCard(canvas, summaryLine, canvasTitle);

    const fileName = cardKind === "yanki" ? "sanri-yanki-karti.png" : "sanri-rol-karti.png";

    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
        if (blob) {
          const file = new File([blob], fileName, { type: "image/png" });
          await navigator.share({ files: [file], title: "SANRI" });
          return;
        }
      } catch { /* fallback to download */ }
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 500);
    }, "image/png");
  }, [summaryLine, canvasTitle, cardKind]);

  const t = {
    trigger1: isTR ? "Bu sana dokunduysa…" : "If this moved you…",
    trigger2: isTR ? "bir kişiyle paylaş." : "share it with someone.",
    cardBtn: isTR ? "Paylaşım kartı indir (PNG)" : "Download share card (PNG)",
    preview: isTR ? "Paylaşım özeti" : "Share preview",
    copied: isTR ? "Kopyalandı" : "Copied",
    copy: isTR ? "Kopyala" : "Copy",
    tiktokBtn: isTR ? "TikTok (metin kopyala)" : "TikTok (copy text)",
    igHint: isTR
      ? <>Metni panoya kopyaladık. Instagram’da <strong>Hikaye</strong> veya <strong>Gönderi</strong> açıp yapıştırarak paylaşabilirsin.</>
      : <>We copied the text. Paste it in an Instagram <strong>Story</strong> or <strong>Post</strong>.</>,
    igOk: isTR ? "Tamam" : "OK",
    tiktokHint: isTR
      ? "TikTok’ta paylaşmak için metni kopyaladık; uygulamada açıklamaya yapıştırıp linki ekleyebilirsin."
      : "Text copied — paste it in TikTok’s caption and add the link.",
  };

  return (
    <motion.div
      className={`${styles.panel} ${compact ? styles.panelCompact : ""} ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <canvas ref={canvasRef} className={styles.hiddenCanvas} aria-hidden />

      <p className={styles.triggerLine}>
        {headline ? headline : <>{t.trigger1}<br />{t.trigger2}</>}
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
          {copied ? t.copied : t.copy}
        </button>
        <button type="button" className={styles.shareBtnGhost} onClick={tiktok}>
          <span className={styles.shareIcon} aria-hidden>♪</span>
          {t.tiktokBtn}
        </button>
      </div>

      <button type="button" className={compact ? styles.cardBtnCompact : styles.cardBtn} onClick={downloadCard}>
        {t.cardBtn}
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
            <p className={styles.hintText}>{t.igHint}</p>
            <button type="button" className={styles.hintClose} onClick={() => setIgOpen(false)}>
              {t.igOk}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {tiktokNote ? (
        <p className={styles.tiktokHint} role="status">
          {t.tiktokHint}
        </p>
      ) : null}

      {!compact && (
        <>
          <p className={styles.previewLabel}>{t.preview}</p>
          <pre className={styles.previewText}>{shareText}</pre>
        </>
      )}
    </motion.div>
  );
}
