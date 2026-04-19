"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  duration: number;
};

export default function WhiteSparkles() {
  const reduced = useReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (reduced) return;

    let nextId = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    let initialTimeout: ReturnType<typeof setTimeout> | undefined;

    const createSparkle = () => {
      const x = 30 + Math.random() * 40;
      const y = 30 + Math.random() * 40;
      const dx = (Math.random() - 0.5) * 10;
      const dy = (Math.random() - 0.5) * 10;
      const size = 2 + Math.random() * 3;
      const duration = 1.5 + Math.random() * 1;

      const sparkle: Sparkle = {
        id: nextId++,
        x,
        y,
        dx,
        dy,
        size,
        duration,
      };

      setSparkles((prev) => [...prev, sparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
      }, duration * 1000 + 100);
    };

    initialTimeout = setTimeout(createSparkle, 3000);
    interval = setInterval(
      () => createSparkle(),
      2000 + Math.random() * 2000,
    );

    return () => {
      if (initialTimeout) clearTimeout(initialTimeout);
      if (interval) clearInterval(interval);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            initial={{
              opacity: 0,
              scale: 0,
              x: `${sparkle.x}vw`,
              y: `${sparkle.y}vh`,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              x: `${sparkle.x + sparkle.dx}vw`,
              y: `${sparkle.y + sparkle.dy}vh`,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: sparkle.duration,
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1],
            }}
            style={{
              position: "absolute",
              width: sparkle.size,
              height: sparkle.size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 70%)",
              boxShadow: "0 0 8px rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
