"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import ParadeyesEye from "./ParadeyesEye";

const Eye3D = dynamic(() => import("./Eye3D"), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export default function EyeExperience() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWebgl(supportsWebGL());
    setLowPower(window.innerWidth < 768);
  }, []);

  const use3D = mounted && !prefersReducedMotion && webgl;

  return (
    <div
      role="img"
      aria-label="Œil Paradeyes iridescent, symbole de l'agence"
      className="relative flex items-center justify-center w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(87,238,161,0.22) 0%, rgba(87,238,161,0.08) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      {use3D ? (
        <Eye3D lowPower={lowPower} />
      ) : (
        <div className="flex items-center justify-center">
          <ParadeyesEye />
        </div>
      )}
    </div>
  );
}
