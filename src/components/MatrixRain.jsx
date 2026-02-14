import React, { useEffect, useRef } from "react";

/**
 * Fullscreen Matrix rain overlay (canvas).
 * Props:
 * - active: boolean
 * - durationMs: number (default 1400)
 * - onDone: () => void
 */
export default function MatrixRain({ active, durationMs = 1400, onDone }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ";
    const fontSize = 16;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops = new Array(columns).fill(1);

    let last = performance.now();

    const draw = (t) => {
      const dt = t - last;
      last = t;

      // fade
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // green-ish rain
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // glow
        ctx.fillStyle = "rgba(160, 255, 180, 0.95)";
        ctx.fillText(text, x, y);

        if (y > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
        drops[i] += Math.max(1, dt / 16);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    timeoutRef.current = window.setTimeout(() => {
      if (onDone) onDone();
    }, durationMs);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, durationMs, onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        pointerEvents: "none",
        opacity: active ? 1 : 0,
        transition: "opacity 220ms ease",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}