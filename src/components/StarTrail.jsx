import { useEffect } from "react";

export default function StarTrail() {
  useEffect(() => {
    const spawn = (x, y) => {
      const star = document.createElement("div");
      star.className = "star-trail";
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      document.body.appendChild(star);
      window.setTimeout(() => star.remove(), 700);
    };

    const onPointerMove = (e) => {
      // mouse + touch drag
      spawn(e.clientX, e.clientY);
    };

    const onPointerDown = (e) => {
      // tap/click patlama
      spawn(e.clientX, e.clientY);
      spawn(e.clientX + 10, e.clientY - 8);
      spawn(e.clientX - 12, e.clientY + 6);
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