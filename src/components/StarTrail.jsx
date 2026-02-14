import { useEffect } from "react";

export default function StarTrail() {
  useEffect(() => {
    const spawn = (x, y, { big = false, drift = true } = {}) => {
      const el = document.createElement("div");
      el.className = big ? "sparkle sparkle-big" : "sparkle";

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

    const onPointerMove = (e) => spawn(e.clientX, e.clientY);
    const onPointerDown = (e) => {
      spawn(e.clientX, e.clientY, { big: true, drift: false });
      spawn(e.clientX + 10, e.clientY - 6);
      spawn(e.clientX - 12, e.clientY + 8);
      spawn(e.clientX + 5, e.clientY + 14);
    };

    // ✅ MOBİL touch
    const onTouchMove = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      spawn(t.clientX, t.clientY);
    };
    const onTouchStart = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      spawn(t.clientX, t.clientY, { big: true, drift: false });
      spawn(t.clientX + 10, t.clientY - 6);
      spawn(t.clientX - 12, t.clientY + 8);
      spawn(t.clientX + 5, t.clientY + 14);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return null;
}