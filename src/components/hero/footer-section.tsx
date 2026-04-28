"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

type SocialIcon = "github" | "linkedin" | "email" | "website";

type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

type FooterSectionProps = {
  reveal: boolean;
  socials: SocialLink[];
  className?: string;
  contentClassName?: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

// --- 1. MAGNETIC WRAPPER COMPONENT ---
// This creates that premium physics-based pull effect on hover
function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // The multiplier (0.3) controls the strength of the magnet
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 }); 
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}

// --- 2. ICONS ---
function SocialGlyph({ icon }: { icon: SocialIcon }) {
  if (icon === "github") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (icon === "email") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// --- 3. MAIN FOOTER COMPONENT ---
export function FooterSection({
  reveal,
  socials,
  className,
  contentClassName,
}: FooterSectionProps) {
  return (
    // Changed to semantic <footer> tag
    <footer
      className={`relative mx-auto flex h-full w-full max-w-[1440px] items-end px-6 pb-8 pt-16 sm:px-8 md:px-10 lg:px-14 ${className ?? ""}`}
    >
      <motion.div
        className={`mt-auto flex w-full flex-col ${contentClassName ?? ""}`}
        initial={false}
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
        }}
      >
        
        {/* --- MASSIVE TYPOGRAPHY CTA --- */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
          }}
          className="w-full border-b-[0.5px] border-white/15 pb-8 sm:pb-12"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/58">
            Like what you see?
          </p>
          <Link href="/contact" className="group flex items-center justify-between gap-4">
            <h2 className="font-display text-[clamp(3rem,11vw,14rem)] leading-[0.85] tracking-[-0.03em] text-white transition-colors duration-500 group-hover:text-[#FA5D19]">
              LET&apos;S CONNECT
            </h2>
            {/* Animated Arrow that slides right on hover */}
            <div className="hidden rounded-full border border-white/20 p-6 transition-all duration-500 group-hover:border-[#FA5D19] group-hover:bg-[#FA5D19]/10 md:block">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-white transition-transform duration-500 group-hover:translate-x-2 group-hover:text-[#FA5D19]">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>
        </motion.div>

        {/* --- EDITORIAL BOTTOM GRID --- */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
          }}
          className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8"
        >
          {/* Column 1: The Quote */}
          <div className="md:col-span-6 lg:col-span-5">
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              &quot;To progress again, man must remake himself. And he cannot remake himself without suffering. For he is both the marble and the sculptor. In order to uncover his true visage he must shatter his own substance with heavy blows of his hammer.&quot;
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[#FA5D19]/80">
              — Alexis Carrell
            </p>
          </div>

          {/* Column 2: Social Links (Magnetic) */}
          <div className="flex flex-col justify-end md:col-span-4 lg:col-span-4">
            <div className="flex flex-wrap items-center gap-2">
              {socials.map((social) => (
                <MagneticWrapper key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="group flex h-14 w-14 items-center justify-center rounded-full border-[0.5px] border-white/12 bg-surface/40 text-white/70 backdrop-blur-md transition-colors hover:border-[#FA5D19]/55 hover:text-[#FA5D19]"
                  >
                    <SocialGlyph icon={social.icon} />
                  </a>
                </MagneticWrapper>
              ))}
            </div>
          </div>

          {/* Column 3: Easter Egg Cat */}
          <div className="flex items-end justify-start md:col-span-2 md:justify-end lg:col-span-3">
            <Link href="/easter-egg" aria-label="Open easter egg page" className="group block">
              <motion.div
                whileHover={{ y: -5, rotate: 3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Image
                  src="/cat.png"
                  alt="Cat sticker that says click me"
                  width={160}
                  height={160}
                  className="h-auto w-[100px] select-none object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.4)] sm:w-[120px] md:w-[140px]"
                />
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* --- COPYRIGHT --- */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8, delay: 0.4 } },
          }}
          className="mt-16 flex w-full justify-center md:justify-start"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            ©2026 Made by Mohamad Ajaz - All Rights Reserved
          </p>
        </motion.div>

      </motion.div>
    </footer>
  );
}