"use client";

import { motion } from "framer-motion";
import { EASINGS } from "@/lib/constants";

type PrimaryCTAProps = {
  href: string;
  label: string;
  delay?: number;
  className?: string;
};

export default function PrimaryCTA({
  href,
  label,
  delay = 0,
  className = "",
}: PrimaryCTAProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: EASINGS.premium }}
      className={`group inline-flex items-center justify-center gap-1.5 rounded-full bg-[#57EEA1] px-5 py-2.5 md:px-6 md:py-3 text-[#023236] text-[13px] md:text-[15px] font-bold tracking-[0.01em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:shadow-[0_8px_32px_rgba(87,238,161,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57EEA1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#023236] ${className}`}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
      >
        →
      </span>
    </motion.a>
  );
}
