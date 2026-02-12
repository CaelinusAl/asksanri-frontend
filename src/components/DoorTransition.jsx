 // src/components/DoorTransition.jsx
import React from "react";
import { motion } from "framer-motion";

export default function DoorTransition({ isOpen }) {
  // isOpen=true => ekran açık; false => kapanma animasyonu oynar
  return (
    <div
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
      }}
      aria-hidden="true"
    >
      {/* Sol kanat */}
      <motion.div
        initial={{ x: "-110%" }}
        animate={{ x: isOpen ? "-110%" : "0%" }}
        transition={{ duration: 0.55, ease: [0.2, 0.9, 0.2, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(12,16,28,1) 0%, rgba(20,24,40,1) 55%, rgba(12,16,28,1) 100%)",
          boxShadow: "inset -12px 0 40px rgba(120,120,255,0.12)",
        }}
      />

      {/* Sağ kanat */}
      <motion.div
        initial={{ x: "110%" }}
        animate={{ x: isOpen ? "110%" : "0%" }}
        transition={{ duration: 0.55, ease: [0.2, 0.9, 0.2, 1] }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(12,16,28,1) 0%, rgba(20,24,40,1) 55%, rgba(12,16,28,1) 100%)",
          boxShadow: "inset 12px 0 40px rgba(120,120,255,0.12)",
        }}
      />

      {/* Ortadaki portal çizgisi */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.6 }}
        animate={{ opacity: isOpen ? 0 : 1, scaleY: isOpen ? 0.6 : 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: "100%",
          background: "rgba(140,170,255,0.85)",
          boxShadow: "0 0 24px rgba(140,170,255,0.55)",
        }}
      />
    </div>
  );
}