"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { useHeroCamera } from "@/components/hero/use-hero-camera";
import { DialClock } from "@/components/hero/dial-clock";
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
  { label: "GitHub", href: "#", icon: "github" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Email", href: "#", icon: "email" },
  { label: "Website", href: "#", icon: "website" },
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
      <title id="website-title">Website</title>
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

  const maskImage = useMotionTemplate`radial-gradient(circle 380px at ${smoothX}px ${smoothY}px, black 15%, transparent 100%)`;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { cameraState } = useHeroCamera(scrollContainerRef);

  // Track the native scrollbar inside the container
  const { scrollY } = useScroll({ container: scrollContainerRef });

  // Map the native scroll position to the Clock's Y position and Opacity
  // When scroll reaches 800px, the clock is pushed entirely off screen natively!
  const clockY = useTransform(scrollY, [0, 800], ["-50%", "-150%"]);
  const clockOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    pointerX.set(-1000);
    pointerY.set(-1000);
  };

  // camera hook handles wheel + snapping logic

  return (
    <div
      className="relative isolate min-h-screen overflow-hidden bg-background md:h-screen"
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(237,237,237,0.1)_1px,transparent_0)] [background-size:24px_24px] opacity-25" />

          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_1.5px_1.5px,rgba(250,93,25,0.45)_1.5px,transparent_0)] [background-size:24px_24px] opacity-80"
            style={{
              WebkitMaskImage: maskImage,
              maskImage,
            }}
          />
        </motion.div>
      </div>

      <div className="hidden md:block">
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
            {/* Unlocks the scrollbar only when cameraState is 'native-content' */}
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
              {/* LeetCode is back in the native scroll container! */}
              <div className="min-h-screen">
                <LeetCodeActivitySection reveal={cameraState === "native-content"} username="AjaxxIsHere" contentClassName="md:ml-auto md:max-w-[72vw] lg:max-w-[68vw] xl:max-w-[64vw]" />
              </div>

              <div className="min-h-screen">
                <EducationSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1120px]" />
              </div>

              <div className="min-h-screen pb-16">
                <PersonalProjectsSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1280px]" />
              </div>

              {/* Dynamic height! Let it flow natively. */}
              <div className="h-auto pb-24 pt-10">
                <WorkExperienceSection reveal={cameraState === "native-content"} contentClassName="mx-auto max-w-[1320px]" />
              </div>

              <div className="min-h-screen flex items-end">
                <FooterSection reveal={cameraState === "native-content"} socials={socials} contentClassName="mx-auto max-w-[1320px]" />
              </div>
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

      <div className="md:hidden">
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
      </div>
    </div>
  );
}
