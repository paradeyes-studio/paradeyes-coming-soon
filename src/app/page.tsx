"use client";

import { motion } from "framer-motion";
import CinematicIntro from "@/components/CinematicIntro";
import CustomCursor from "@/components/CustomCursor";
import EyeExperience from "@/components/EyeExperience";
import GradientBackground from "@/components/GradientBackground";
import ParadeyesLogo from "@/components/ParadeyesLogo";
import SmoothScroll from "@/components/SmoothScroll";
import SocialIcons from "@/components/SocialIcons";
import {
  EASINGS,
  EMAIL,
  SITE_SUBTAGLINE,
  SITE_TAGLINE,
} from "@/lib/constants";

const premium = EASINGS.premium;

export default function Home() {
  return (
    <main className="relative h-[100dvh] min-h-[100dvh] overflow-hidden">
      <SmoothScroll />
      <CustomCursor />
      <GradientBackground />
      <CinematicIntro />

      <div className="relative z-10 flex h-[100dvh] flex-col safe-top safe-bottom safe-x">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: premium }}
          className="absolute top-5 left-5 md:top-8 md:left-8 lg:top-12 lg:left-12 z-20"
        >
          <ParadeyesLogo
            size="small"
            className="w-[130px] md:w-[180px] lg:w-[220px]"
          />
        </motion.div>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 md:gap-5 lg:gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.0, ease: premium }}
            className="flex-shrink-0"
          >
            <EyeExperience />
          </motion.div>

          <div className="flex flex-col items-center gap-2 md:gap-3">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.9, ease: premium }}
              className="text-center text-white text-[20px] md:text-[28px] lg:text-[32px] font-bold tracking-[0.01em] leading-tight"
            >
              {SITE_TAGLINE}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.9, ease: premium }}
              className="text-center italic text-white/75 text-[16px] md:text-[22px] lg:text-[24px] leading-snug tracking-[-0.005em]"
              style={{ fontFamily: "var(--font-instrument-serif), serif" }}
            >
              {SITE_SUBTAGLINE}
            </motion.p>

            <motion.a
              href={`mailto:${EMAIL}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 0.9, ease: premium }}
              className="mt-1 md:mt-2 py-2 text-white/80 text-[14px] md:text-[15px] lg:text-[16px] tracking-[0.01em] group focus-visible:outline-none transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#57EEA1] hover:translate-x-[2px] focus-visible:text-[#57EEA1]"
              data-cursor="expand"
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
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.8, duration: 0.9, ease: premium }}
          className="flex justify-center pb-6 md:pb-8 lg:pb-12"
        >
          <SocialIcons />
        </motion.div>
      </div>
    </main>
  );
}
