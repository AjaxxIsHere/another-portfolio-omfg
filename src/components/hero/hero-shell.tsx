"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
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
const postClockSections = [
  "leetcode",
  "education",
  "projects",
  "projects-gap",
  "work",
  "footer",
] as const;
const postClockScrollSpeed = 0.0018;
 
const postClockFadeLead = 0.24;
const postClockWorkLead = 0.6;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const postClockFadeInRadius = 0.45;

const fadeInOnly = (progress: number, center: number, radius = postClockFadeInRadius) =>
  clamp01((progress - (center - radius)) / radius);
type PostClockSection = (typeof postClockSections)[number];
type SecondarySection = "milestones" | "about" | PostClockSection;

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
  const postClockMaxIndex = postClockSections.length - 1;
  const stackRowHeight = 100 / (postClockSections.length + 1);

  const [activePanel, setActivePanel] = useState<0 | 1>(0);
  const [activeSecondarySection, setActiveSecondarySection] = useState<SecondarySection>("about");
  const [postClockProgress, setPostClockProgress] = useState(0);
  const [hasSeenMilestones, setHasSeenMilestones] = useState(false);
  const [hasSeenLeetCode, setHasSeenLeetCode] = useState(false);
  const [hasSeenEducation, setHasSeenEducation] = useState(false);
  const [hasSeenProjects, setHasSeenProjects] = useState(false);
  const [hasSeenWork, setHasSeenWork] = useState(false);
  const [hasSeenFooter, setHasSeenFooter] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const settleTimeoutRef = useRef<number | null>(null);

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    pointerX.set(-1000);
    pointerY.set(-1000);
  };

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const isPostClockSection =
        activeSecondarySection !== "about" &&
        activeSecondarySection !== "milestones";

      if (!window.matchMedia("(min-width: 768px)").matches) {
        return;
      }

      if (Math.abs(event.deltaY) < 28) {
        return;
      }

      event.preventDefault();

      if (isSnapping) {
        return;
      }

      if (event.deltaY > 0) {
        if (activePanel === 0) {
          // hero -> about (first in-panel section)
          setActivePanel(1);
          setActiveSecondarySection("about");
          setIsSnapping(true);
          return;
        }

        if (activePanel === 1 && activeSecondarySection === "about") {
          // about -> milestones
          setActiveSecondarySection("milestones");
          setHasSeenMilestones(true);
          setIsSnapping(true);
          return;
        }

        if (activePanel === 1 && activeSecondarySection === "milestones") {
          // milestones -> leetcode (continuous downward transition)
          setActiveSecondarySection("leetcode");
          setPostClockProgress(0);
          setHasSeenLeetCode(true);
          setIsSnapping(true);
          return;
        }

        if (activePanel === 1 && isPostClockSection) {
          // Continuous wheel-driven progress for leetcode -> education (and future sections).
          const nextProgress = Math.min(
            postClockMaxIndex,
            postClockProgress + event.deltaY * postClockScrollSpeed,
          );

          if (nextProgress !== postClockProgress) {
            setPostClockProgress(nextProgress);
          }

          const nearestSection = postClockSections[Math.round(nextProgress)];
          if (nearestSection !== activeSecondarySection) {
            setActiveSecondarySection(nearestSection);
          }

          if (nextProgress > 0.02) {
            setHasSeenEducation(true);
          }
          if (nextProgress > 0.92) {
            setHasSeenProjects(true);
          }
          if (nextProgress > 2.84) {
            setHasSeenWork(true);
          }
          if (nextProgress > 4.1) {
            setHasSeenFooter(true);
          }

          return;
        }
      }

      if (event.deltaY < 0) {
        if (activePanel === 1 && isPostClockSection) {
          const nextProgress = Math.max(
            0,
            postClockProgress + event.deltaY * postClockScrollSpeed,
          );

          if (nextProgress !== postClockProgress) {
            setPostClockProgress(nextProgress);
          }

          if (nextProgress <= 0.001 && postClockProgress <= 0.001) {
            // Exit continuous region back to milestones.
            setActiveSecondarySection("milestones");
            setHasSeenMilestones(true);
            setPostClockProgress(0);
            setIsSnapping(true);
            return;
          }

          const nearestSection = postClockSections[Math.round(nextProgress)];
          if (nearestSection !== activeSecondarySection) {
            setActiveSecondarySection(nearestSection);
          }

          return;
        }

        if (activePanel === 1 && activeSecondarySection === "milestones") {
          // milestones -> about
          setActiveSecondarySection("about");
          setIsSnapping(true);
          return;
        }

        if (activePanel === 1 && activeSecondarySection === "about") {
          // about -> hero
          setActivePanel(0);
          setIsSnapping(true);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [
    activePanel,
    activeSecondarySection,
    isSnapping,
    postClockProgress,
    postClockMaxIndex,
  ]);

  useEffect(() => {
    if (!isSnapping) {
      return;
    }

    settleTimeoutRef.current = window.setTimeout(() => {
      setIsSnapping(false);
    }, 760);

    return () => {
      if (settleTimeoutRef.current) {
        window.clearTimeout(settleTimeoutRef.current);
      }
    };
  }, [isSnapping]);

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
          animate={{ x: activePanel === 1 ? "-100vw" : "0vw" }}
          transition={{ duration: 0.78, ease: easeOut }}
        >
          <section className="relative h-screen w-screen">
            <motion.main
              className="relative mx-auto grid h-full w-full max-w-[1440px] items-center gap-10 px-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:px-14"
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

              <motion.section
                variants={riseIn}
                className="relative z-10 hidden h-[38rem] lg:block"
                aria-hidden="true"
              />
            </motion.main>

            <motion.p
              className="pointer-events-none absolute bottom-9 left-10 z-20 text-xs uppercase tracking-[0.26em] text-white/45 lg:left-14"
              animate={{ opacity: activePanel === 0 ? 1 : 0 }}
              transition={{ duration: 0.28, ease: easeOut }}
            >
              Scroll to view About
            </motion.p>
          </section>

          <section className="relative h-screen w-screen">
            <div className="relative h-full">
              <AnimatePresence mode="wait">
                {activeSecondarySection === "about" ? (
                  <motion.div
                    key="about"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: easeOut }}
                  >
                    <AboutSection
                      reveal={true}
                      contentClassName="md:ml-auto md:max-w-[72vw] lg:max-w-[68vw] xl:max-w-[64vw]"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="progress-stack"
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: easeOut }}
                  >
                    <motion.div
                      className="relative"
                      style={{ height: `${(postClockSections.length + 1) * 100}%` }}
                      animate={{
                        y:
                          activeSecondarySection === "milestones"
                            ? "0%"
                            : `${-(1 + postClockProgress) * stackRowHeight}%`,
                      }}
                      transition={{ duration: 0.72, ease: easeOut }}
                    >
                      <motion.div
                        style={{ height: `${stackRowHeight}%` }}
                        animate={{ opacity: activeSecondarySection === "milestones" ? 1 : 0 }}
                        transition={{ duration: 0.38, ease: easeOut }}
                      >
                        <MilestonesSection
                          stats={milestones}
                          reveal={hasSeenMilestones}
                          contentClassName="md:ml-auto md:max-w-[72vw] lg:max-w-[68vw] xl:max-w-[64vw]"
                        />
                      </motion.div>

                      <motion.div
                        style={{ height: `${stackRowHeight}%` }}
                        animate={{
                          opacity:
                            activeSecondarySection === "milestones"
                              ? 0
                              : fadeInOnly(postClockProgress + postClockFadeLead, 0),
                        }}
                        transition={{ duration: 0.18, ease: easeOut }}
                      >
                        <LeetCodeActivitySection
                          reveal={hasSeenLeetCode}
                          username={"AjaxxIsHere"}
                          contentClassName="md:ml-auto md:max-w-[72vw] lg:max-w-[68vw] xl:max-w-[64vw]"
                        />
                      </motion.div>

                      <motion.div
                        style={{ height: `${stackRowHeight}%` }}
                        animate={{
                          opacity:
                            activeSecondarySection === "milestones"
                              ? 0
                              : fadeInOnly(postClockProgress + postClockFadeLead, 1),
                        }}
                        transition={{ duration: 0.18, ease: easeOut }}
                      >
                        <EducationSection
                          reveal={hasSeenEducation}
                          contentClassName="mx-auto max-w-[1120px]"
                        />
                      </motion.div>

                      <motion.div
                        style={{ height: `${stackRowHeight}%` }}
                        animate={{
                          opacity:
                            activeSecondarySection === "milestones"
                              ? 0
                              : fadeInOnly(postClockProgress + postClockFadeLead, 2),
                        }}
                        transition={{ duration: 0.18, ease: easeOut }}
                      >
                        <PersonalProjectsSection
                          reveal={hasSeenProjects}
                          contentClassName="mx-auto max-w-[1280px]"
                        />
                      </motion.div>

                      <motion.div
                        style={{ height: `${stackRowHeight}%` }}
                        animate={{
                          opacity:
                            activeSecondarySection === "milestones"
                              ? 0
                              : fadeInOnly(postClockProgress + postClockFadeLead, 3, 0.5),
                        }}
                        transition={{ duration: 0.18, ease: easeOut }}
                      >
                        <div className="h-full w-full bg-transparent" />
                      </motion.div>

                      <motion.div
                        style={{ height: `${stackRowHeight}%` }}
                        animate={{
                          opacity:
                            activeSecondarySection === "milestones"
                              ? 0
                              : fadeInOnly(
                                  postClockProgress + postClockFadeLead + postClockWorkLead,
                                  4,
                                ),
                        }}
                        transition={{ duration: 0.18, ease: easeOut }}
                      >
                        <WorkExperienceSection
                          reveal={hasSeenWork}
                          contentClassName="mx-auto max-w-[1320px]"
                        />
                      </motion.div>

                      <motion.div
                        style={{ height: `${stackRowHeight}%` }}
                        animate={{
                          opacity:
                            activeSecondarySection === "milestones"
                              ? 0
                              : fadeInOnly(postClockProgress + postClockFadeLead, 5),
                        }}
                        transition={{ duration: 0.18, ease: easeOut }}
                      >
                        <FooterSection
                          reveal={hasSeenFooter}
                          socials={socials}
                          contentClassName="mx-auto max-w-[1320px]"
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Keep the clock straddling the panel boundary: 70% in panel one, 30% in panel two. */}
          <motion.div
            className="pointer-events-none absolute left-[100vw] top-1/2 z-[12] -translate-x-[65%] -translate-y-1/2"
            animate={{
              y: `${-110 * postClockProgress}vh`,
              opacity: Math.max(0, 1 - postClockProgress),
            }}
            transition={{ duration: 0.3, ease: easeOut }}
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
