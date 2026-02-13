import { useEffect } from "react";

export default function StarTrail() {
  useEffect(() => {
    const spawn = (x, y, { big = false, drift = true } = {}) => {
      const el = document.createElement("div");
      el.className = big ? "sparkle sparkle--big" : "sparkle";

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

    const onPointerMove = (e) => {
      // mouse + dokunmatik sürükleme
      spawn(e.clientX, e.clientY);
    };

    const onPointerDown = (e) => {
      // tek dokunuşta mini patlama
      spawn(e.clientX, e.clientY, { big: true, drift: false });
      spawn(e.clientX + 10, e.clientY - 6);
      spawn(e.clientX - 12, e.clientY + 8);
      spawn(e.clientX + 5, e.clientY + 14);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}