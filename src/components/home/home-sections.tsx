"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroShell, type SocialLink } from "@/components/hero/hero-shell";
import { MilestonesSection } from "@/components/milestones/milestones-section";

type HomeSectionsProps = {
  name: string;
  about: string;
  stack: string[];
  socials?: SocialLink[];
};

const PANEL_COUNT = 2;

export function HomeSections({
  name,
  about,
  stack,
  socials,
}: HomeSectionsProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.28,
  });

  const horizontalShift = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", `-${((PANEL_COUNT - 1) / PANEL_COUNT) * 100}%`],
  );

  const clockScaleX = useTransform(
    smoothProgress,
    [0, 0.45, 0.78, 1],
    [1, 1, -1, -1],
  );

  const heroOpacity = useTransform(smoothProgress, [0, 0.86], [1, 0.88]);

  return (
    <>
      {/* Mobile keeps natural vertical flow for usability. */}
      <div className="md:hidden">
        <HeroShell name={name} about={about} stack={stack} socials={socials} />
        <MilestonesSection />
      </div>

      {/* Tablet/Desktop: vertical scroll drives horizontal section movement. */}
      <div
        ref={trackRef}
        className="relative hidden md:block"
        style={{ height: `${PANEL_COUNT * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            className="flex h-full"
            style={{ x: horizontalShift, width: `${PANEL_COUNT * 100}vw` }}
          >
            <motion.div className="h-screen w-screen shrink-0" style={{ opacity: heroOpacity }}>
              <HeroShell
                name={name}
                about={about}
                stack={stack}
                socials={socials}
                clockStyle={{ scaleX: clockScaleX, transformOrigin: "50% 50%" }}
              />
            </motion.div>

            <div className="h-screen w-screen shrink-0">
              <MilestonesSection progress={smoothProgress} />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
