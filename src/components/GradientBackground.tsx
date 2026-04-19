"use client";

import { useEffect, useRef, useState } from "react";

export default function GradientBackground() {
  const targetRef = useRef({ x: 50, y: 100 });
  const [coords, setCoords] = useState({ x: 50, y: 100 });

  useEffect(() => {
    let rafId = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const relX = event.clientX / innerWidth;
      const relY = event.clientY / innerHeight;
      const amplitude = 0.1;
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
      <div
        className="absolute inset-0 gradient-breathing"
        style={{
          ["--gradient-x" as string]: `${coords.x}%`,
          ["--gradient-y" as string]: `${coords.y}%`,
          background:
            "radial-gradient(ellipse 100% 70% at var(--gradient-x, 50%) var(--gradient-y, 100%), rgba(87, 238, 161, 0.45) 0%, rgba(87, 238, 161, 0.25) 25%, rgba(87, 238, 161, 0.08) 55%, transparent 80%)",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
