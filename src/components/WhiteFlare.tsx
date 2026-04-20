"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Direction =
  | "left-to-right"
  | "right-to-left"
  | "diagonal-down"
  | "diagonal-up"
  | "top-to-bottom";

type Flare = {
  id: number;
  direction: Direction;
  y: number;
  duration: number;
};

const DIRECTIONS: Direction[] = [
  "left-to-right",
  "right-to-left",
  "diagonal-down",
  "diagonal-up",
];

function getFlareAnimation(direction: Direction, y: number) {
  switch (direction) {
    case "left-to-right":
      return {
        initial: { x: "-20vw", y: `${y}vh`, opacity: 0 },
        animate: {
          x: "120vw",
          y: `${y}vh`,
          opacity: [0, 0.8, 0.8, 0],
        },
      };
    case "right-to-left":
      return {
        initial: { x: "120vw", y: `${y}vh`, opacity: 0 },
        animate: {
          x: "-20vw",
          y: `${y}vh`,
          opacity: [0, 0.8, 0.8, 0],
        },
      };
    case "diagonal-down":
      return {
        initial: { x: "-10vw", y: `${y - 20}vh`, opacity: 0 },
        animate: {
          x: "110vw",
          y: `${y + 20}vh`,
          opacity: [0, 0.7, 0.7, 0],
        },
      };
    case "diagonal-up":
      return {
        initial: { x: "-10vw", y: `${y + 20}vh`, opacity: 0 },
        animate: {
          x: "110vw",
          y: `${y - 20}vh`,
          opacity: [0, 0.7, 0.7, 0],
        },
      };
    case "top-to-bottom":
      return {
        initial: { x: "50vw", y: "-10vh", opacity: 0 },
        animate: {
          x: "50vw",
          y: "110vh",
          opacity: [0, 0.7, 0.7, 0],
        },
      };
  }
}

export default function WhiteFlare() {
  const reduced = useReducedMotion();
  const [flares, setFlares] = useState<Flare[]>([]);

  useEffect(() => {
    if (reduced) return;

    let nextId = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const createFlare = () => {
      const direction =
        DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const y = 20 + Math.random() * 50;
      const duration = 1.8 + Math.random() * 0.8;

      const flare: Flare = { id: nextId++, direction, y, duration };
      setFlares((prev) => [...prev, flare]);

      const cleanup = setTimeout(() => {
        setFlares((prev) => prev.filter((f) => f.id !== flare.id));
      }, duration * 1000 + 200);
      timeouts.push(cleanup);
    };

    const scheduleNext = () => {
      const nextDelay = 8000 + Math.random() * 7000;
      const t = setTimeout(() => {
        createFlare();
        scheduleNext();
      }, nextDelay);
      timeouts.push(t);
    };

    const first = setTimeout(createFlare, 5000);
    timeouts.push(first);
    const loopStart = setTimeout(scheduleNext, 12000);
    timeouts.push(loopStart);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden"
    >
      <AnimatePresence>
        {flares.map((flare) => {
          const anim = getFlareAnimation(flare.direction, flare.y);
          return (
            <motion.span
              key={flare.id}
              initial={anim.initial}
              animate={anim.animate}
              transition={{
                duration: flare.duration,
                ease: "easeInOut",
                opacity: { times: [0, 0.15, 0.85, 1] },
              }}
              style={{
                position: "absolute",
                width: "200px",
                height: "4px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 10%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 90%, transparent 100%)",
                filter: "blur(2px)",
                boxShadow:
                  "0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3)",
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
