"use client";

import { useEffect, useRef, useState } from "react";

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function GradientBackground() {
  const targetRef = useRef({ x: 50, y: 100 });
  const [coords, setCoords] = useState({ x: 50, y: 100 });

  useEffect(() => {
    let rafId = 0;
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const relX = event.clientX / innerWidth;
      const relY = event.clientY / innerHeight;
      const amplitude = desktopQuery.matches ? 0.08 : 0.04;
      targetRef.current = {
        x: 50 + (relX - 0.5) * amplitude * 100,
        y: 100 + (relY - 0.5) * amplitude * 100,
      };
    };

    const tick = () => {
      setCoords((prev) => {
        const nextX = prev.x + (targetRef.current.x - prev.x) * 0.08;
        const nextY = prev.y + (targetRef.current.y - prev.y) * 0.08;
        return { x: nextX, y: nextY };
      });
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: "#023236" }}
    >
      {/* Radial gradient émergeant du bas, intensité réduite, 5 stops pour transition douce */}
      <div
        className="absolute inset-0 gradient-breathing"
        style={{
          ["--gradient-x" as string]: `${coords.x}%`,
          ["--gradient-y" as string]: `${coords.y}%`,
          background:
            "radial-gradient(ellipse 120% 70% at var(--gradient-x, 50%) var(--gradient-y, 100%), rgba(87, 238, 161, 0.28) 0%, rgba(87, 238, 161, 0.18) 20%, rgba(87, 238, 161, 0.08) 45%, rgba(87, 238, 161, 0.02) 70%, transparent 100%)",
          willChange: "transform, opacity",
        }}
      />
      {/* Noise overlay pour casser le banding du gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          opacity: 1,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
