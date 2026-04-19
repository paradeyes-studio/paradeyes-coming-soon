"use client";

import { motion, useReducedMotion } from "framer-motion";
import EyeExperience from "@/components/EyeExperience";
import GradientBackground from "@/components/GradientBackground";
import ParadeyesLogo from "@/components/ParadeyesLogo";
import PrimaryCTA from "@/components/PrimaryCTA";
import SocialIcons from "@/components/SocialIcons";
import WhiteSparkles from "@/components/WhiteSparkles";
import {
  CTA_HREF,
  CTA_LABEL,
  EASINGS,
  NARRATIVE,
  SIGNATURE,
  TITLE_TEXT,
} from "@/lib/constants";

const premium = EASINGS.premium;
const dmSansStyle = { fontFamily: "var(--font-dm-sans), sans-serif" };

export default function Home() {
  const reduced = useReducedMotion();

  return (
    <main className="relative h-[100dvh] min-h-[100dvh] overflow-hidden">
      <GradientBackground />
      <WhiteSparkles />

      <div className="relative z-10 h-[100dvh] safe-top safe-bottom safe-x">
        {/* Logo top-left */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.3, duration: 0.8, ease: premium }}
          className="absolute top-5 left-5 md:top-8 md:left-8 lg:top-12 lg:left-12 z-20"
        >
          <ParadeyesLogo
            size="small"
            className="w-[130px] md:w-[180px] lg:w-[220px]"
          />
        </motion.div>

        {/* Zone centrale */}
        <div className="flex h-full flex-col items-center justify-center px-6 pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28">
          {/* Œil 3D avec fade in smooth + brume + scale subtil */}
          <motion.div
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, filter: "blur(40px)" }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            transition={{
              duration: reduced ? 0.6 : 2.5,
              ease: premium,
              filter: { duration: 2.2 },
            }}
            className="w-[220px] h-[220px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] flex-shrink-0"
          >
            <EyeExperience />
          </motion.div>

          {/* Signature (DM Sans Medium uppercase electric green) */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 2.8,
              duration: 0.8,
              ease: premium,
            }}
            style={dmSansStyle}
            className="mt-4 md:mt-5 lg:mt-6 text-center font-medium uppercase text-[#57EEA1] text-[11px] md:text-[13px] lg:text-[14px] tracking-[0.18em] leading-[1.4]"
          >
            {SIGNATURE}
          </motion.p>

          {/* Titre central (Satoshi Bold) */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 3.1,
              duration: 0.9,
              ease: premium,
            }}
            className="mt-3 md:mt-4 lg:mt-5 text-center font-sans font-bold text-white text-[22px] md:text-[36px] lg:text-[44px] xl:text-[56px] 2xl:text-[64px] tracking-[-0.02em] leading-[1.1] md:whitespace-nowrap"
          >
            {TITLE_TEXT}
          </motion.h1>

          {/* Narratif (DM Sans Regular white/70) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 3.5,
              duration: 0.9,
              ease: premium,
            }}
            style={dmSansStyle}
            className="mt-4 md:mt-6 lg:mt-8 max-w-[620px] text-center font-normal text-white/70 text-[13px] md:text-[15px] lg:text-[16px] leading-[1.6]"
          >
            {NARRATIVE}
          </motion.p>

          {/* CTA */}
          <PrimaryCTA
            href={CTA_HREF}
            label={CTA_LABEL}
            delay={reduced ? 0 : 3.9}
            className="mt-5 md:mt-7 lg:mt-8"
          />
        </div>

        {/* Socials bottom */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduced ? 0 : 4.3,
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
