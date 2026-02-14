import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * MatrixRainOverlay
 * - route değişince kısa süreli görünür
 * - canvas üstünde matrix rain efekti
 */
export default function MatrixRainOverlay({
  triggerKey,
  durationMs = 650,
  opacity = 0.55,
  zIndex = 999999,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const colsRef = useRef([]);
  const [show, setShow] = useState(false);

  // karakter seti: rakam ağırlıklı (matrix hissi)
  const chars = useMemo(() => "01⌁⌁⌁0123456789", []);

  useEffect(() => {
    if (!triggerKey) return;

    // göster
    setShow(true);
    const hideTimer = window.setTimeout(() => setShow(false), durationMs);

    // canvas setup + animation
    const canvas = canvasRef.current;
    if (!canvas) return () => window.clearTimeout(hideTimer);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return () => window.clearTimeout(hideTimer);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontSize = 16;
      const columns = Math.ceil(window.innerWidth / fontSize);
      colsRef.current = new Array(columns).fill(0).map(() => Math.random() * 1000);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    };

    resize();
    window.addEventListener("resize", resize);

    const fontSize = 16;
    const draw = () => {
      // hafif fade (cam gibi)
      ctx.fillStyle = `rgba(0,0,0,0.18)`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // “mor ayna” hissi için: beyaz yerine morumsu parıltı
      // (renk set etmiyoruz demediğin için burada hafif mor kullanıyorum)
      ctx.fillStyle = `rgba(190,150,255,0.85)`;

      const cols = colsRef.current;
      for (let i = 0; i < cols.length; i++) {
        const x = i * fontSize;
        const y = cols[i] * fontSize;

        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, x, y);

        // aşağı akış
        if (y > window.innerHeight && Math.random() > 0.975) cols[i] = 0;
        cols[i] += 0.7; // hız
      }

      rafRef.current = window.requestAnimationFrame(draw);
    };

    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.clearTimeout(hideTimer);
      window.removeEventListener("resize", resize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [triggerKey, durationMs, chars]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
        opacity,
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}