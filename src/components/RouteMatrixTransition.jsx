import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const CHARS = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%*+=-";

export default function RouteMatrixTransition() {
  const { pathname } = useLocation();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // önce varsa temizle
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setShow(true);

    const canvas = canvasRef.current;
    if (!canvas) {
      setShow(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setShow(false);
      return;
    }

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const fontSize = 16;

    let w = 0;
    let h = 0;
    let cols = 0;
    let drops = [];
    let startedAt = performance.now();
    const durationMs = 520; // kısa, hızlı

    const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const resize = () => {
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.floor(Math.random() * h));
    };

    resize();

    const draw = (t) => {
      const elapsed = t - startedAt;
      const fade = Math.max(0, 1 - elapsed / durationMs);

      // arka planı hafif boyayıp akıtıyoruz (BLUR YOK)
      ctx.fillStyle = `rgba(6, 7, 14, ${0.55 * fade})`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = `rgba(120, 255, 190, ${0.9 * fade})`;

      for (let i = 0; i < cols; i++) {
        const x = i * fontSize;
        const y = drops[i];

        ctx.fillText(randChar(), x, y);

        drops[i] += fontSize * (0.9 + Math.random() * 0.6);
        if (drops[i] > h + 20 && Math.random() > 0.975) {
          drops[i] = -Math.random() * 200;
        }
      }

      if (elapsed >= durationMs) {
        setShow(false);
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // ekstra güvenlik: 700ms sonra kesin kapat
    timeoutRef.current = setTimeout(() => setShow(false), 2800);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      rafRef.current = null;
      timeoutRef.current = null;
      setShow(false);
    };
  }, [pathname]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        pointerEvents: "none",
        // ⚠️ BLUR YOK
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}