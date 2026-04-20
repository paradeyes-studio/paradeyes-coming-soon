"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  PRE_CTA_TEXT,
  TITLE_TEXT,
} from "@/lib/constants";

const premium = EASINGS.premium;
const dmSansStyle = { fontFamily: "var(--font-dm-sans), sans-serif" };

export default function Home() {
  const reduced = useReducedMotion();
  const [showBurst, setShowBurst] = useState(true);

  useEffect(() => {
    if (reduced) {
      setShowBurst(false);
      return;
    }
    const timer = setTimeout(() => setShowBurst(false), 2600);
    return () => clearTimeout(timer);
  }, [reduced]);

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
          {/* Conteneur œil + burst lumineux d'entrée */}
          <div
            className="relative w-[260px] h-[260px] md:w-[380px] md:h-[380px] lg:w-[460px] lg:h-[460px] flex-shrink-0"
            style={{ background: "transparent", isolation: "isolate" }}
          >
            {/* Aura lumineuse qui précède et enrobe l'œil */}
            <AnimatePresence>
              {showBurst && !reduced && (
                <motion.div
                  key="entrance-burst"
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.5, 2, 3],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2.5,
                    ease: premium,
                    times: [0, 0.2, 0.6, 1],
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    width: "400px",
                    height: "400px",
                    background:
                      "radial-gradient(circle, rgba(87, 238, 161, 0.4) 0%, rgba(87, 238, 161, 0.2) 30%, rgba(87, 238, 161, 0.05) 60%, transparent 100%)",
                    filter: "blur(20px)",
                    zIndex: 15,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Œil 3D matérialisation après le burst */}
            <motion.div
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.9, filter: "blur(30px)" }
              }
              animate={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, filter: "blur(0px)" }
              }
              transition={{
                delay: reduced ? 0 : 0.8,
                duration: reduced ? 0.6 : 2.0,
                ease: premium,
                filter: { duration: 1.8 },
              }}
              className="relative w-full h-full z-20"
            >
              <EyeExperience />
            </motion.div>
          </div>

          {/* Signature (DM Sans SemiBold uppercase electric green) - 2 lignes mobile, 1 ligne md+ */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 3.0,
              duration: 0.8,
              ease: premium,
            }}
            style={{
              ...dmSansStyle,
              textShadow: "0 0 20px rgba(87, 238, 161, 0.3)",
            }}
            className="mt-4 md:mt-5 lg:mt-6 text-center font-semibold uppercase text-[#57EEA1] text-[13px] md:text-[14px] lg:text-[15px] tracking-[0.15em] leading-[1.5]"
          >
            Agence créative au service
            <span className="md:hidden">
              <br />
            </span>
            <span className="hidden md:inline"> </span>
            de votre croissance.
          </motion.p>

          {/* Titre central (Satoshi Bold) */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 3.3,
              duration: 0.9,
              ease: premium,
            }}
            className="mt-3 md:mt-4 lg:mt-5 text-center font-sans font-bold text-white text-[22px] md:text-[30px] lg:text-[38px] xl:text-[46px] 2xl:text-[52px] tracking-[-0.02em] leading-[1.15]"
          >
            {TITLE_TEXT}
          </motion.h1>

          {/* Narratif (DM Sans Regular white/70) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 3.7,
              duration: 0.9,
              ease: premium,
            }}
            style={dmSansStyle}
            className="mt-4 md:mt-6 lg:mt-8 max-w-[620px] text-center font-normal text-white/70 text-[13px] md:text-[15px] lg:text-[16px] leading-[1.6]"
          >
            {NARRATIVE}
          </motion.p>

          {/* Phrase pré-CTA (DM Sans Regular white/60, plus discret) */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 4.0,
              duration: 0.8,
              ease: premium,
            }}
            style={dmSansStyle}
            className="mt-5 md:mt-7 lg:mt-8 text-center font-normal text-white/60 text-[12px] md:text-[13px] lg:text-[14px] leading-[1.5]"
          >
            {PRE_CTA_TEXT}
          </motion.p>

          {/* CTA - serré avec la phrase pré-CTA */}
          <PrimaryCTA
            href={CTA_HREF}
            label={CTA_LABEL}
            delay={reduced ? 0 : 4.3}
            className="mt-3 md:mt-4 lg:mt-5"
          />
        </div>

        {/* Socials bottom */}
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
