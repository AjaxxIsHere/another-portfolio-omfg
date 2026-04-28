"use client";

import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react"; // Added useState for the Magnetic logic
import type { ReactNode } from "react";
import Link from "next/link";
import { useHeroCamera } from "@/components/hero/use-hero-camera";
import {
  MilestonesSection,
  type MilestoneStat,
} from "@/components/hero/milestones-section";
import { LeetCodeActivitySection } from "@/components/hero/leetcode-activity-section";
import { EducationSection } from "@/components/hero/education-section";
import { PersonalProjectsSection } from "@/components/hero/personal-projects-section";
import { WorkExperienceSection } from "@/components/hero/work-experience-section";
import { FooterSection } from "@/components/hero/footer-section";
import { AboutSection } from "@/components/hero/about-section";
import { GlitchText } from "@/components/portfolio/glitch-text";

// DYNAMIC IMPORTS: Deferring heavy graphics until after first paint
const DialClock = dynamic(
  () => import("@/components/hero/dial-clock").then((mod) => mod.DialClock),
  { ssr: false } 
);

const HalftoneBlobsBackground = dynamic(
  () => import("../portfolio/halftone-lava-lamp").then((mod) => mod.HalftoneBlobsBackground),
  { ssr: false } 
);

type SocialIcon = "github" | "linkedin" | "email" | "website";

type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

// --- NEW: MAGNETIC WRAPPER (REUSABLE) ---
function MagneticWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const boundingRect = ref.current?.getBoundingClientRect();
    if (boundingRect) {
      const { height, width, left, top } = boundingRect;
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX * 0.35, y: middleY * 0.35 });
    }
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

type HeroShellProps = {
  name: string;
  about: string;
  stack: string[];
  socials?: SocialLink[];
  milestones?: MilestoneStat[];
};

const defaultSocials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/AjaxxIsHere", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mohamad-ajaz/", icon: "linkedin" },
  { label: "Email", href: "mailto:ajaz2468@gmail.com", icon: "email" },
  { label: "Instagram", href: "https://www.instagram.com/yours.truly__aj/profilecard/", icon: "website" },
];

const defaultMilestones: MilestoneStat[] = [
  { label: "Age", value: "--", note: "Placeholder value" },
  { label: "Years Coding", value: "--", note: "Placeholder value" },
  { label: "Projects Completed", value: "--", note: "Placeholder value" },
  { label: "Projects Deployed", value: "--", note: "Placeholder value" },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

const riseIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

function DownloadGlyph() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="h-4 w-4"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}
function SocialGlyph({ icon }: { icon: SocialIcon }) {
  if (icon === "github") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-colors duration-200">
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

type HeroTextBlockProps = {
  name: string;
  about: string;
  stack: string[];
  socials: SocialLink[];
  className?: string;
};
function HeroTextBlock({
  name,
  about,
  stack,
  socials,
  className,
}: HeroTextBlockProps) {
  return (
    <motion.section
      variants={riseIn}
      className={className ?? "relative z-10 mx-auto w-full max-w-2xl lg:mx-0"}
    >
      <motion.p variants={riseIn} className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FA5D19]">
        Web Developer | Software Engineer
      </motion.p>

      <motion.h1 variants={riseIn} className="mt-4 max-w-[13ch] text-balance font-display text-[clamp(2.4rem,11vw,8.6rem)] leading-[1.02] tracking-[-0.03em] text-foreground sm:max-w-[14ch]">
        <GlitchText text={name} />
      </motion.h1>

      <motion.p variants={riseIn} className="mt-8 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
        {about}
      </motion.p>

      {/* Tech Stack Chips */}
      <motion.div variants={riseIn} className="mt-9 flex flex-wrap gap-2.5">
        {stack.map((item, index) => (
          <motion.span
            key={item}
            className="rounded-full border-[0.5px] border-white/10 bg-white/[0.05] px-4 py-1.5 text-sm text-zinc-300 backdrop-blur-md transition-colors hover:bg-[#FA5D19]/10 hover:text-[#FA5D19] select-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + index * 0.04, duration: 0.45, ease: easeOut }}
          >
            {item}
          </motion.span>
        ))}
      </motion.div>

      <motion.div variants={riseIn} className="mt-12 flex flex-wrap items-center gap-4 sm:gap-8">
        
        {/* MAGNETIC DOWNLOAD CV */}
        <MagneticWrapper>
          <motion.a
            href="/AjazCV2026.pdf" 
            download="Mohamad_Ajaz_CV.pdf"
            className="group flex h-12 items-center justify-center gap-3 rounded-full border-[0.5px] border-white/12 bg-white/[0.05] px-8 text-sm font-bold tracking-wide text-zinc-100 backdrop-blur-lg transition-all hover:border-[#FA5D19]/50 hover:text-[#FA5D19]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.45, ease: easeOut }}
          >
            <span>Download CV</span>
            <DownloadGlyph />
          </motion.a>
        </MagneticWrapper>

        <motion.div className="hidden h-8 w-[1px] bg-white/10 sm:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

        {/* MAGNETIC SOCIAL LINKS */}
        <div className="flex flex-wrap items-center gap-4">
          {socials.map((social, index) => (
            <MagneticWrapper key={social.label}>
              <motion.a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="group flex h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-white/12 bg-white/[0.05] text-zinc-400 backdrop-blur-lg transition-all hover:border-[#FA5D19]/50 hover:text-[#FA5D19]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.06, duration: 0.45, ease: easeOut }}
              >
                <SocialGlyph icon={social.icon} />
              </motion.a>
            </MagneticWrapper>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

export function HeroShell({
  name,
  about,
  stack,
  socials = defaultSocials,
  milestones = defaultMilestones,
}: HeroShellProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { cameraState } = useHeroCamera(scrollContainerRef);

  const { scrollY, scrollYProgress } = useScroll({ container: scrollContainerRef });

  const clockY = useTransform(scrollY, [0, 800], ["-50%", "-150%"]);
  const clockOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  const railProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const sections = ["LeetCode", "Education", "Projects", "Work", "Footer"] as const;
  
  const t0 = 0;
  const t1 = 1 / 4;
  const t2 = 2 / 4;
  const t3 = 3 / 4;
  const t4 = 1;

  const dotScale0 = useTransform(scrollYProgress, [Math.max(0, t0 - 0.06), Math.min(1, t0 + 0.06)], [0.9, 1.4]);
  const dotScale1 = useTransform(scrollYProgress, [Math.max(0, t1 - 0.06), Math.min(1, t1 + 0.06)], [0.9, 1.4]);
  const dotScale2 = useTransform(scrollYProgress, [Math.max(0, t2 - 0.06), Math.min(1, t2 + 0.06)], [0.9, 1.4]);
  const dotScale3 = useTransform(scrollYProgress, [Math.max(0, t3 - 0.06), Math.min(1, t3 + 0.06)], [0.9, 1.4]);
  const dotScale4 = useTransform(scrollYProgress, [Math.max(0, t4 - 0.06), Math.min(1, t4 + 0.06)], [0.9, 1.4]);

  const dotOpacity0 = useTransform(scrollYProgress, [Math.max(0, t0 - 0.08), Math.min(1, t0 + 0.08)], [0.5, 1]);
  const dotOpacity1 = useTransform(scrollYProgress, [Math.max(0, t1 - 0.08), Math.min(1, t1 + 0.08)], [0.5, 1]);
  const dotOpacity2 = useTransform(scrollYProgress, [Math.max(0, t2 - 0.08), Math.min(1, t2 + 0.08)], [0.5, 1]);
  const dotOpacity3 = useTransform(scrollYProgress, [Math.max(0, t3 - 0.08), Math.min(1, t3 + 0.08)], [0.5, 1]);
  const dotOpacity4 = useTransform(scrollYProgress, [Math.max(0, t4 - 0.08), Math.min(1, t4 + 0.08)], [0.5, 1]);

  const dotScales = [dotScale0, dotScale1, dotScale2, dotScale3, dotScale4];
  const dotOpacities = [dotOpacity0, dotOpacity1, dotOpacity2, dotOpacity3, dotOpacity4];

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background md:h-screen">
      <HalftoneBlobsBackground />

      <div className="relative z-10 hidden md:block">
        <motion.div className="pointer-events-none fixed left-6 top-1/2 z-30 -translate-y-1/2 hidden md:flex items-center">
          <div className="relative h-[60vh] w-1 rounded-full bg-white/6 overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full w-full origin-top bg-accent"
              style={{ scaleY: railProgress, transformOrigin: "top" }}
            />
          </div>
          <div className="ml-3 flex flex-col gap-4">
            {sections.map((label, idx) => (
              <motion.div
                key={label}
                aria-hidden
                style={{ scale: dotScales[idx], opacity: dotOpacities[idx] }}
                className="h-3 w-3 rounded-full bg-white/80"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative flex h-screen w-[200vw]"
          animate={{ x: cameraState === "hero" ? "0vw" : "-100vw" }}
          transition={{ duration: 0.78, ease: easeOut }}
        >
          <section className="relative h-screen w-screen">
            <motion.main className="relative mx-auto grid h-full w-full max-w-[1440px] items-center gap-10 px-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:px-14">
              <HeroTextBlock name={name} about={about} stack={stack} socials={socials} />
            </motion.main>
          </section>

          <section className="relative h-screen w-screen overflow-hidden">
            <AnimatePresence mode="wait">
              {cameraState === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <AboutSection reveal={true} contentClassName="md:ml-auto md:max-w-[72vw] lg:max-w-[68vw] xl:max-w-[64vw]" />
                </motion.div>
              )}

              {cameraState === "milestones" && (
                <motion.div
                  key="milestones"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <MilestonesSection stats={milestones} reveal={true} contentClassName="md:ml-auto md:max-w-[72vw] lg:max-w-[68vw] xl:max-w-[64vw]" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              ref={scrollContainerRef}
              className={`absolute inset-0 h-full w-full ${cameraState === "native-content" ? "pointer-events-auto overflow-y-auto" : "pointer-events-none overflow-hidden"}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: cameraState === "native-content" ? 1 : 0,
                y: cameraState === "native-content" ? 0 : 40,
              }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <div className="min-h-screen">
                <LeetCodeActivitySection reveal={cameraState === "native-content"} username="AjaxxIsHere" contentClassName="md:ml-auto md:max-w-[72vw] lg:max-w-[68vw] xl:max-w-[64vw]" />
              </div>

              <div className="h-auto">
                <EducationSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1320px]" />
              </div>

              <div className="h-auto">
                <PersonalProjectsSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1320px]" />
              </div>

              <div className="h-auto">
                <WorkExperienceSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1320px]" />
              </div>

              <div className="h-auto">
                <FooterSection reveal={cameraState === "native-content"} socials={socials} contentClassName="mx-auto max-w-[1320px]" />
              </div>
            </motion.div>
          </section>

          <motion.div
            className="pointer-events-none absolute left-[100vw] top-1/2 z-[12] -translate-x-[65%]"
            style={{ y: clockY, opacity: clockOpacity }}
          >
            <DialClock className="relative" edgeOffset={false} />
          </motion.div>
        </motion.div>
      </div>

      {/* MOBILE SECTION */}
      <div className="relative z-10 md:hidden">
        <motion.main
          className="relative mx-auto grid min-h-screen w-full max-w-[1440px] gap-2 px-5 py-10 sm:px-6 sm:py-12 mb-42"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.04, 
                delayChildren: 0.05,  
              },
            },
          }}
        >
          <HeroTextBlock
            name={name}
            about={about}
            stack={stack}
            socials={socials}
          />

          <div
            className="pointer-events-none absolute right-0 top-[80%] z-0 translate-x-[35%] scale-170"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
              maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
            }}
          >
            <DialClock className="relative" edgeOffset={false} />
          </div>
        </motion.main>

        {/* EAGER REVEAL FIX: These sections now wait to trigger their animations until scrolled into view */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: easeOut } }
          }}
        >
          <AboutSection reveal={true} className="min-h-[85vh]" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
          }}
        >
          <MilestonesSection stats={milestones} reveal={true} className="min-h-[85vh]" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 28 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease: easeOut } }
          }}
        >
          <LeetCodeActivitySection reveal={true} username={"AjaxxIsHere"} className="min-h-[85vh]" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 28 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease: easeOut } }
          }}
        >
          <EducationSection reveal={true} className="min-h-[85vh]" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 28 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease: easeOut } }
          }}
        >
          <PersonalProjectsSection reveal={true} className="min-h-[85vh]" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: easeOut } }
          }}
        >
          <WorkExperienceSection reveal={true} className="min-h-[85vh]" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 26 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: easeOut } }
          }}
        >
          <FooterSection reveal={true} socials={socials} className="min-h-[85vh]" />
        </motion.div>
      </div>
    </div>
  );
}