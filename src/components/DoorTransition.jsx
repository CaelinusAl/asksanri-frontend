// src/components/DoorTransition.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/door.css";

/**
 * isOpen=true => kapı açık (overlay görünmez)
 * isOpen=false => kapı kapanır (overlay görünür, kanatlar kapanır)
 */
export default function DoorTransition({ isOpen }) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="door-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Sol kanat */}
          <motion.div
            className="door-leaf door-left"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.55, ease: [0.2, 0.9, 0.2, 1] }}
          />

          {/* Sağ kanat */}
          <motion.div
            className="door-leaf door-right"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.2, 0.9, 0.2, 1] }}
          />

          {/* Orta çizgi parıltı */}
          <motion.div
            className="door-seam"
            initial={{ opacity: 0, scaleY: 0.9 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.9 }}
            transition={{ duration: 0.25 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}