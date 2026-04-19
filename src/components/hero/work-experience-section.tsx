"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type WorkExperienceSectionProps = {
  reveal: boolean;
  className?: string;
  contentClassName?: string;
};

type ExperienceItem = {
  id: string;
  role: string;
  description: string;
  images: string[];
};

const defaultExperiences: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Frontend Engineer - Studio Atlas",
    description:
      "Built and maintained high-performance marketing surfaces and dashboards, collaborating with design and product to ship animation-heavy interfaces with clean component architecture.",
    images: ["UI Sprint", "Dashboard Revamp", "Experiment Lab"],
  },
  {
    id: "exp-2",
    role: "Full Stack Developer - Northbeam Labs",
    description:
      "Led feature delivery across Next.js and Node.js services, integrating payment flows, analytics pipelines, and internal tooling while improving deployment reliability.",
    images: ["Checkout Flow", "Ops Console", "Release Metrics"],
  },
  {
    id: "exp-3",
    role: "Software Engineer - Orbit Systems",
    description:
      "Designed robust APIs and developer-friendly UI systems for a B2B platform, with a focus on scale, accessibility, and consistent product experience across modules.",
    images: ["API Explorer", "System Map", "Team Demo"],
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

function CarouselPanel({
  item,
  index,
}: {
  item: ExperienceItem;
  index: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border-[0.5px] border-white/10 bg-background/45">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${item.id}-${index}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="relative flex h-40 items-end bg-[radial-gradient(circle_at_30%_20%,rgba(250,93,25,0.18),transparent_58%),radial-gradient(circle_at_75%_75%,rgba(237,237,237,0.08),transparent_55%),linear-gradient(120deg,rgba(18,18,18,0.95),rgba(26,26,26,0.95))] p-4 sm:h-48"
        >
          <span className="rounded-full border-[0.5px] border-white/12 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#FA5D19]/90">
            {item.images[index]}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        {item.images.map((_, dotIndex) => (
          <span
            key={`${item.id}-dot-${dotIndex}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              dotIndex === index
                ? "w-6 bg-[#FA5D19]"
                : "w-1.5 bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function WorkExperienceSection({
  reveal,
  className,
  contentClassName,
}: WorkExperienceSectionProps) {
  const [slideIndexes, setSlideIndexes] = useState<number[]>(
    defaultExperiences.map(() => 0),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndexes((current) =>
        current.map((value, index) => {
          const total = defaultExperiences[index].images.length;
          return (value + 1) % total;
        }),
      );
    }, 3200);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section
      className={`relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 py-16 sm:px-8 md:px-10 lg:px-14 ${className ?? ""}`}
    >
      <motion.div
        className={`w-full ${contentClassName ?? ""}`}
        initial={false}
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.12,
            },
          },
        }}
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.42, ease: easeOut },
            },
          }}
          className="text-xs uppercase tracking-[0.3em] text-white/58"
        >
          Career Path
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.56, ease: easeOut },
            },
          }}
          className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
        >
          Work Experience
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: easeOut },
            },
          }}
          className="mt-5 max-w-3xl text-base leading-relaxed text-white/72 sm:text-lg"
        >
          A timeline of roles where I shipped products, improved systems, and learned to balance speed with long-term engineering quality.
        </motion.p>

        <div className="mt-10 md:hidden">
          <div className="space-y-6">
            {defaultExperiences.map((item, index) => (
              <motion.article
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: easeOut,
                      delay: index * 0.08,
                    },
                  },
                }}
                className="rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-5 backdrop-blur-sm"
              >
                <h3 className="font-display text-2xl leading-tight text-foreground">
                  {item.role}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/72 sm:text-base">
                  {item.description}
                </p>
                <div className="mt-4">
                  <CarouselPanel item={item} index={slideIndexes[index]} />
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="relative mt-10 hidden md:block">
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/18 to-transparent" />

          <div className="space-y-10">
            {defaultExperiences.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.article
                  key={item.id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: isLeft ? -32 : 32,
                      y: 26,
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: {
                        duration: 0.62,
                        ease: easeOut,
                        delay: index * 0.12,
                      },
                    },
                  }}
                  className={`relative flex ${isLeft ? "justify-start" : "justify-end"}`}
                >
                  <div className="absolute left-1/2 top-10 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[0.5px] border-[#FA5D19]/70 bg-[#FA5D19]/20 shadow-[0_0_24px_rgba(250,93,25,0.2)]" />

                  <div className="w-[calc(50%-2.2rem)] rounded-2xl border-[0.5px] border-white/10 bg-surface/72 p-6 backdrop-blur-sm">
                    <h3 className="font-display text-2xl leading-tight text-foreground lg:text-[2rem]">
                      {item.role}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/72 lg:text-base">
                      {item.description}
                    </p>
                    <div className="mt-5">
                      <CarouselPanel item={item} index={slideIndexes[index]} />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
