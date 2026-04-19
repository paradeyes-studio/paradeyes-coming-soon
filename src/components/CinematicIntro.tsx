"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CinematicIntro() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduced) {
      setShow(false);
      return;
    }
    document.body.style.overflow = "hidden";
    const timeout = window.setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 2600);
    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[60] pointer-events-none"
    >
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "#023236" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "#000000" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0.08, 2.6], opacity: [0, 1, 0] }}
        transition={{
          duration: 1.3,
          delay: 0.85,
          times: [0, 0.25, 1],
          ease: EASE,
        }}
        className="absolute top-1/2 left-1/2 w-[48vmin] h-[48vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(87,238,161,1) 0%, rgba(87,238,161,0.55) 32%, rgba(87,238,161,0.12) 58%, transparent 78%)",
          filter: "blur(3px)",
        }}
      />
    </div>
  );
}
