"use client";

import { motion } from "framer-motion";
import GradientBackground from "@/components/GradientBackground";
import ParadeyesEye from "@/components/ParadeyesEye";
import ParadeyesLogo from "@/components/ParadeyesLogo";
import SocialIcons from "@/components/SocialIcons";
import { EASINGS, EMAIL, SITE_TAGLINE } from "@/lib/constants";

const premium = EASINGS.premium;

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: premium }}
          className="absolute top-6 left-6 md:top-12 md:left-12"
        >
          <ParadeyesLogo size="small" />
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-28 md:pt-40 md:pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 1.2, ease: premium }}
          >
            <ParadeyesEye />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.8, ease: premium }}
            className="mt-12 md:mt-16 text-center text-white text-[22px] md:text-[28px] font-light tracking-[0.01em]"
          >
            {SITE_TAGLINE}
          </motion.h1>

          <motion.a
            href={`mailto:${EMAIL}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8, ease: premium }}
            className="mt-12 md:mt-16 text-white/80 text-[15px] md:text-[16px] tracking-[0.01em] group focus-visible:outline-none"
          >
            <span className="relative inline-block">
              {EMAIL}
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 block h-px w-0 bg-[#57EEA1] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full group-focus-visible:w-full"
              />
            </span>
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8, ease: premium }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <SocialIcons />
        </motion.div>
      </div>
    </main>
  );
}
