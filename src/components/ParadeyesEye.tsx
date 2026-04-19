"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type ParadeyesEyeProps = {
  className?: string;
};

export default function ParadeyesEye({ className }: ParadeyesEyeProps) {
  return (
    <motion.div
      animate={{ scale: [1, 1.04, 1] }}
      transition={{
        duration: 4,
        ease: [0.4, 0, 0.6, 1],
        repeat: Infinity,
      }}
      className={className}
      style={{
        filter: "drop-shadow(0 0 40px rgba(87, 238, 161, 0.2))",
      }}
    >
      <Image
        src="/logos/paradeyes-eye.svg"
        alt=""
        width={380}
        height={219}
        priority
        aria-hidden="true"
        className="w-[240px] h-auto md:w-[320px] lg:w-[380px]"
      />
    </motion.div>
  );
}
