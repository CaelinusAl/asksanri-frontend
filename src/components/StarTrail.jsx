import { useEffect } from "react";

export default function StarTrail() {
  useEffect(() => {
    const handler = (e) => {
      const star = document.createElement("div");
      star.className = "star-trail";
      star.style.left = `${e.clientX}px`;
      star.style.top = `${e.clientY}px`;
      document.body.appendChild(star);

      window.setTimeout(() => star.remove(), 700);
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return null;
}