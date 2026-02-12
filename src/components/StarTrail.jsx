import { useEffect, useRef } from "react";

export default function StarTrail() {
  const lastMoveRef = useRef(0);

  useEffect(() => {
    const spawnStar = (x, y, { big = false, drift = true } = {}) => {
      const el = document.createElement("div");
      el.className = big ? "sparkle sparkle--big" : "sparkle";

      // random offsets + rotation
      const rot = Math.floor(Math.random() * 360);
      const dx = drift ? (Math.random() * 2 - 1) * (big ? 46 : 26) : 0;
      const dy = drift ? (Math.random() * 2 - 1) * (big ? 46 : 26) : 0;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty("--rot", `${rot}deg`);
      el.style.setProperty("--dx", `${dx}px`);
      el.style.setProperty("--dy", `${dy}px`);

      document.body.appendChild(el);

      window.setTimeout(() => el.remove(), big ? 1100 : 820);
    };

    const burst = (x, y) => {
      // meteor burst (tap)
      const count = 10 + Math.floor(Math.random() * 6); // 10-15
      spawnStar(x, y, { big: true, drift: false });

      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 6 + Math.random() * 10;
        spawnStar(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, {
          big: false,
          drift: true,
        });
      }
    };

    const onPointerDown = (e) => {
      // tap/click => magical burst
      burst(e.clientX, e.clientY);
    };

    const onPointerMove = (e) => {
      // drag/mouse move => gentle trailing
      const now = performance.now();
      if (now - lastMoveRef.current < 24) return; // throttle
      lastMoveRef.current = now;

      spawnStar(e.clientX, e.clientY, { big: false, drift: true });
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return null;
}