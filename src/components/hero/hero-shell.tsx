"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { MotionStyle } from "framer-motion";
import type { MouseEvent } from "react";
import { DialClock } from "@/components/hero/dial-clock";
import { GlitchText } from "@/components/portfolio/glitch-text";

export type SocialIcon = "github" | "linkedin" | "email" | "website";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

export type HeroShellProps = {
  name: string;
  about: string;
  stack: string[];
  socials?: SocialLink[];
  clockStyle?: MotionStyle;
};

const defaultSocials: SocialLink[] = [
  { label: "GitHub", href: "#", icon: "github" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Email", href: "#", icon: "email" },
  { label: "Website", href: "#", icon: "website" },
];

function SocialGlyph({ icon }: { icon: SocialIcon }) {
  if (icon === "github") {
    return (
      <svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth="1.5" 
  strokeLinecap="round" 
  strokeLinejoin="round" 
  className="h-5 w-5 text-neutral-400 hover:text-[#FA5D19] transition-colors duration-200"
>
  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
  <path d="M9 18c-4.51 2-5-2-7-2" />
</svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" role="img" aria-labelledby="linkedin-title">
  <title id="linkedin-title">LinkedIn Profile</title>
  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
  <rect width="4" height="12" x="2" y="9" />
  <circle cx="4" cy="4" r="2" />
</svg>
    );
  }

  if (icon === "email") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" role="img" aria-labelledby="email-title">
  <title id="email-title">Send an Email</title>
  <rect width="20" height="16" x="2" y="4" rx="2" />
  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
</svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" role="img" aria-labelledby="instagram-title">
  <title id="instagram-title">Instagram Profile</title>
  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
</svg>
  );
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const riseIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export function HeroShell({
  name,
  about,
  stack,
  socials = defaultSocials,
  clockStyle,
}: HeroShellProps) {
  const pointerX = useMotionValue(-1000);
  const pointerY = useMotionValue(-1000);

  const smoothX = useSpring(pointerX, {
    stiffness: 100,
    damping: 20,
    mass: 0.3,
  });
  const smoothY = useSpring(pointerY, {
    stiffness: 100,
    damping: 20,
    mass: 0.3,
  });

  // Expanding dot matrix mask based on absolute coordinates in container
  const maskImage = useMotionTemplate`radial-gradient(circle 380px at ${smoothX}px ${smoothY}px, black 15%, transparent 100%)`;

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = event.clientX - rect.left;
    const nextY = event.clientY - rect.top;

    pointerX.set(nextX);
    pointerY.set(nextY);
  };

  const handlePointerLeave = () => {
    pointerX.set(-1000);
    pointerY.set(-1000);
  };

  return (
    <div
      className="relative isolate min-h-screen overflow-hidden bg-background"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: easeOut }}
        >
          {/* Base dim dot matrix layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(237,237,237,0.1)_1px,transparent_0)] [background-size:24px_24px] opacity-25" />

          {/* Brighter expanding dot matrix that follows the mouse */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_1.5px_1.5px,rgba(250,93,25,0.45)_1.5px,transparent_0)] [background-size:24px_24px] opacity-80"
            style={{
              WebkitMaskImage: maskImage,
              maskImage: maskImage,
            }}
          />
        </motion.div>
      </div>

      <motion.main
        className="relative mx-auto grid min-h-screen w-full max-w-[1440px] gap-8 px-5 py-10 sm:px-6 sm:py-12 md:gap-10 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:items-center lg:px-14 lg:py-14"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.12,
            },
          },
        }}
      >
        <motion.section
          variants={riseIn}
          className="relative z-10 flex min-h-[18rem] items-start justify-center sm:min-h-[22rem] md:min-h-[26rem] lg:order-2 lg:min-h-[38rem]"
          aria-hidden="true"
        >
          <DialClock
            className="relative mx-auto lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
            style={clockStyle}
          />
        </motion.section>

        <motion.section variants={riseIn} className="relative z-10 mx-auto w-full max-w-2xl lg:order-1 lg:mx-0">
          <motion.p
            variants={riseIn}
            className="text-xs uppercase tracking-[0.3em] text-white/58"
          >
            Software Engineer
          </motion.p>

          <motion.h1
            variants={riseIn}
            className="mt-4 max-w-[13ch] text-balance font-display text-[clamp(2.4rem,11vw,8.6rem)] leading-[1.02] tracking-[-0.03em] text-foreground sm:max-w-[14ch]"
          >
            <GlitchText text={name} />
          </motion.h1>

          <motion.p
            variants={riseIn}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/74 sm:text-lg"
          >
            {about}
          </motion.p>

          <motion.div variants={riseIn} className="mt-9 flex flex-wrap gap-2.5">
            {stack.map((item, index) => (
              <motion.span
                key={item}
                className="rounded-full border-[0.5px] border-white/10 bg-surface/70 px-3 py-1.5 text-sm text-white/78 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35 + index * 0.04,
                  duration: 0.45,
                  ease: easeOut,
                }}
              >
                {item}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            variants={riseIn}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {socials.map((social, index) => {
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border-[0.5px] border-white/12 bg-surface/65 text-white/70 transition-colors hover:border-accent/70 hover:text-accent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.45 + index * 0.06,
                    duration: 0.45,
                    ease: easeOut,
                  }}
                >
                  <SocialGlyph icon={social.icon} />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.section>
      </motion.main>
    </div>
  );
}
