"use client";

import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHeroCamera } from "@/components/hero/use-hero-camera";
import type { MilestoneStat } from "@/components/hero/milestones-section";
import { GlitchText } from "@/components/portfolio/glitch-text";

type SocialIcon = "github" | "linkedin" | "email" | "website";

type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

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
  {
    label: "Age",
    value: "--",
    note: "Placeholder value",
  },
  {
    label: "Years Coding",
    value: "--",
    note: "Placeholder value",
  },
  {
    label: "Projects Completed",
    value: "--",
    note: "Placeholder value",
  },
  {
    label: "Projects Deployed",
    value: "--",
    note: "Placeholder value",
  },
];

const HalftoneBlobsBackground = dynamic(
  () =>
    import("@/components/portfolio/halftone-lava-lamp").then(
      (mod) => mod.HalftoneBlobsBackground,
    ),
  {
    ssr: false,
  },
);

const DialClock = dynamic(
  () => import("@/components/hero/dial-clock").then((mod) => mod.DialClock),
  {
    ssr: false,
  },
);

const AboutSection = dynamic(
  () => import("@/components/hero/about-section").then((mod) => mod.AboutSection),
  {
    loading: () => <div className="min-h-[55vh]" />,
  },
);

const MilestonesSection = dynamic(
  () =>
    import("@/components/hero/milestones-section").then(
      (mod) => mod.MilestonesSection,
    ),
  {
    loading: () => <div className="min-h-[55vh]" />,
  },
);

const LeetCodeActivitySection = dynamic(
  () =>
    import("@/components/hero/leetcode-activity-section").then(
      (mod) => mod.LeetCodeActivitySection,
    ),
  {
    loading: () => <div className="min-h-[55vh]" />,
  },
);

const EducationSection = dynamic(
  () =>
    import("@/components/hero/education-section").then(
      (mod) => mod.EducationSection,
    ),
  {
    loading: () => <div className="min-h-[55vh]" />,
  },
);

const PersonalProjectsSection = dynamic(
  () =>
    import("@/components/hero/personal-projects-section").then(
      (mod) => mod.PersonalProjectsSection,
    ),
  {
    loading: () => <div className="min-h-[55vh]" />,
  },
);

const WorkExperienceSection = dynamic(
  () =>
    import("@/components/hero/work-experience-section").then(
      (mod) => mod.WorkExperienceSection,
    ),
  {
    loading: () => <div className="min-h-[55vh]" />,
  },
);

const FooterSection = dynamic(
  () =>
    import("@/components/hero/footer-section").then((mod) => mod.FooterSection),
  {
    loading: () => <div className="min-h-[40vh]" />,
  },
);

const easeOut = [0.16, 1, 0.3, 1] as const;

const riseIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

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
        className="h-5 w-5 text-neutral-400 transition-colors duration-200 hover:text-[#FA5D19]"
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-labelledby="linkedin-title"
      >
        <title id="linkedin-title">LinkedIn Profile</title>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }

  if (icon === "email") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-labelledby="email-title"
      >
        <title id="email-title">Send an Email</title>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-labelledby="website-title"
    >
      <title id="website-title">Instagram</title>
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
      className={
        className ?? "relative z-10 mx-auto w-full max-w-2xl lg:mx-0"
      }
    >
      <motion.p
        variants={riseIn}
        className="text-xs uppercase tracking-[0.3em] text-white/58"
      >
        Web Developer | Software Engineer
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
            className="rounded-full border-[0.5px] border-white/10 bg-surface/70 px-3 py-1.5 text-sm text-white/78 backdrop-blur-sm transition-colors duration-150 hover:bg-accent/10 hover:text-accent active:bg-accent/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30 select-none"
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
  const { cameraState, hasEnteredNativeContent } = useHeroCamera(scrollContainerRef);
  const [showMobileLongform, setShowMobileLongform] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setShowMobileLongform(true);
    }, 450);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const shouldRenderNativeSections =
    cameraState === "native-content" || hasEnteredNativeContent;

  // Track the native scrollbar inside the container
  const { scrollY, scrollYProgress } = useScroll({ container: scrollContainerRef });

  // Map the native scroll position to the Clock's Y position and Opacity
  // When scroll reaches 800px, the clock is pushed entirely off screen natively!
  const clockY = useTransform(scrollY, [0, 800], ["-50%", "-150%"]);
  const clockOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  // Rail progress and section thresholds
  const railProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const sections = ["LeetCode", "Education", "Projects", "Work", "Footer"] as const;
  // explicit per-dot transforms (avoid calling hooks inside callbacks to satisfy lint rules)
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

  // camera hook handles wheel + snapping logic

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background md:h-screen">
      <HalftoneBlobsBackground />

      <div className="relative z-10 hidden md:block">
        {/* Sticky progress rail (desktop only) - moved outside the transformed container so it stays fixed to viewport */}
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
          {/* PANEL 1: HERO */}
          <section className="relative h-screen w-screen">
            <motion.main className="relative mx-auto grid h-full w-full max-w-[1440px] items-center gap-10 px-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:px-14">
              <HeroTextBlock name={name} about={about} stack={stack} socials={socials} />
            </motion.main>
          </section>

          {/* PANEL 2: THE DECK */}
          <section className="relative h-screen w-screen overflow-hidden">
            {/* SLIDESHOW SECTIONS */}
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

              {/* (LeetCode is handled in the native scroll container) */}
            </AnimatePresence>

            {/* FREE VERTICAL SCROLL SECTION */}
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
              {shouldRenderNativeSections ? (
                <>
                  {/* LEETCODE: Must stay min-h-screen to perfectly catch the slideshow crossfade */}
                  <div className="min-h-screen">
                    <LeetCodeActivitySection reveal={cameraState === "native-content"} username="AjaxxIsHere" contentClassName="md:ml-auto md:max-w-[72vw] lg:max-w-[68vw] xl:max-w-[64vw]" />
                  </div>

                  {/* ALL OTHER SECTIONS: Changed to h-auto to remove massive gaps! */}
                  <div className="h-auto">
                    <EducationSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1120px]" />
                  </div>

                  <div className="h-auto">
                    <PersonalProjectsSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1120px]" />
                  </div>

                  <div className="h-auto">
                    <WorkExperienceSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1120px]" />
                  </div>

                  <div className="h-auto">
                    <FooterSection reveal={cameraState === "native-content"} socials={socials} contentClassName="mx-auto max-w-[1320px]" />
                  </div>
                </>
              ) : (
                <div className="h-full w-full" />
              )}
            </motion.div>
          </section>

          {/* STRADDLING CLOCK */}
          {/* Because it's positioned at left: 100vw, it naturally straddles the two panels when the container shifts left! */}
          <motion.div
            // Note: Framer Motion `y` controls vertical transform; remove the translate-y utility.
            className="pointer-events-none absolute left-[100vw] top-1/2 z-[12] -translate-x-[65%]"
            style={{ y: clockY, opacity: clockOpacity }}
          >
            <DialClock className="relative" edgeOffset={false} />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 md:hidden">
        <motion.main
          className="relative mx-auto grid min-h-screen w-full max-w-[1440px] gap-8 px-5 py-10 sm:px-6 sm:py-12"
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
          <HeroTextBlock
            name={name}
            about={about}
            stack={stack}
            socials={socials}
          />

          {/* Mobile: enlarged clock, higher, behind hero and faded to right */}
          <div
            className="pointer-events-none absolute right-0 top-[58%] z-0 translate-x-[35%] scale-170"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
              maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
            }}
          >
            <DialClock className="relative" edgeOffset={false} />
          </div>
        </motion.main>

        {showMobileLongform ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.48, ease: easeOut }}
            >
              <AboutSection reveal={true} className="min-h-screen" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <MilestonesSection stats={milestones} reveal={true} className="min-h-screen" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.56, ease: easeOut }}
            >
              <LeetCodeActivitySection reveal={true} username={"AjaxxIsHere"} className="min-h-screen" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.56, ease: easeOut }}
            >
              <EducationSection reveal={true} className="min-h-screen" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.56, ease: easeOut }}
            >
              <PersonalProjectsSection reveal={true} className="min-h-screen" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.62, ease: easeOut }}
            >
              <WorkExperienceSection reveal={true} className="min-h-[120vh]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.58, ease: easeOut }}
            >
              <FooterSection reveal={true} socials={socials} className="min-h-[90vh]" />
            </motion.div>
          </>
        ) : (
          <div className="space-y-4 px-5 pb-10 sm:px-6">
            <div className="h-24 rounded-2xl border-[0.5px] border-white/10 bg-surface/60" />
            <div className="h-24 rounded-2xl border-[0.5px] border-white/10 bg-surface/50" />
            <div className="h-24 rounded-2xl border-[0.5px] border-white/10 bg-surface/40" />
          </div>
        )}
      </div>
    </div>
  );
}
