"use client";

import { motion, useReducedMotion } from "framer-motion";
import EyeExperience from "@/components/EyeExperience";
import GradientBackground from "@/components/GradientBackground";
import ParadeyesLogo from "@/components/ParadeyesLogo";
import PrimaryCTA from "@/components/PrimaryCTA";
import SocialIcons from "@/components/SocialIcons";
import {
  CTA_HREF,
  CTA_LABEL,
  EASINGS,
  NARRATIVE,
  SIGNATURE,
  TITLE_LINE_1,
  TITLE_LINE_2,
} from "@/lib/constants";

const premium = EASINGS.premium;

export default function Home() {
  const reduced = useReducedMotion();

  return (
    <main className="relative h-[100dvh] min-h-[100dvh] overflow-hidden">
      <GradientBackground />

      {/* Flash electric green initial — part du centre, grossit et s'estompe */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 8, 15] }}
          transition={{
            duration: 0.8,
            times: [0, 0.3, 1],
            ease: "easeOut",
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#57EEA1] blur-xl pointer-events-none z-30"
        />
      )}

      <div className="relative z-10 h-[100dvh] safe-top safe-bottom safe-x">
        {/* Logo top-left */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 3.0, duration: 0.8, ease: premium }}
          className="absolute top-5 left-5 md:top-8 md:left-8 lg:top-12 lg:left-12 z-20"
        >
          <ParadeyesLogo
            size="small"
            className="w-[130px] md:w-[180px] lg:w-[200px]"
          />
        </motion.div>

        {/* Centre : œil + textes + CTA */}
        <div className="flex h-full flex-col items-center justify-center gap-3 md:gap-5 lg:gap-5 px-6 pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28">
          <div className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] lg:w-[340px] lg:h-[340px] flex-shrink-0">
            <EyeExperience />
          </div>

          {/* Signature italic electric green */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 3.2,
              duration: 0.8,
              ease: premium,
            }}
            className="text-center italic text-[#57EEA1] text-[14px] md:text-[16px] lg:text-[18px] tracking-[0.01em]"
            style={{ fontFamily: "var(--font-instrument-serif), serif" }}
          >
            {SIGNATURE}
          </motion.p>

          {/* Titre principal bold blanc */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 3.5,
              duration: 0.9,
              ease: premium,
            }}
            className="text-center text-white font-sans font-bold tracking-[-0.01em] leading-[1.1] text-[22px] md:text-[34px] lg:text-[42px]"
          >
            <span className="block">{TITLE_LINE_1}</span>
            <span className="block">{TITLE_LINE_2}</span>
          </motion.h1>

          {/* Narratif */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 3.9,
              duration: 0.9,
              ease: premium,
            }}
            className="text-center text-white/70 font-sans font-normal leading-[1.55] text-[12.5px] md:text-[14px] lg:text-[15px] max-w-[540px]"
          >
            {NARRATIVE}
          </motion.p>

          {/* CTA electric green */}
          <PrimaryCTA
            href={CTA_HREF}
            label={CTA_LABEL}
            delay={reduced ? 0 : 4.3}
            className="mt-1 md:mt-2"
          />
        </div>

        {/* Socials bottom center - absolute so center flex can use full viewport */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduced ? 0 : 4.6,
            duration: 0.8,
            ease: premium,
          }}
          className="absolute bottom-5 left-0 right-0 flex justify-center md:bottom-7 lg:bottom-9"
        >
          <SocialIcons />
        </motion.div>
      </div>
    </main>
  );
}
