"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type EducationSectionProps = {
  reveal: boolean;
  className?: string;
  contentClassName?: string;
};

type EducationItem = {
  id: string;
  schoolName: string;
  degree: string;
  duration: string;
  location: string;
  description: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

const defaultItems: EducationItem[] = [
  {
    id: "school-one",
    schoolName: "School One",
    degree: "Degree Placeholder",
    duration: "20XX - 20XX",
    location: "City, Country",
    description:
      "Placeholder description for this school. Add key coursework, achievements, and highlights later.",
  },
  {
    id: "school-two",
    schoolName: "School Two",
    degree: "Degree Placeholder",
    duration: "20XX - 20XX",
    location: "City, Country",
    description:
      "Placeholder description for this school. Add clubs, leadership roles, and project experience here.",
  },
  {
    id: "school-three",
    schoolName: "School Three",
    degree: "Degree Placeholder",
    duration: "20XX - 20XX",
    location: "City, Country",
    description:
      "Placeholder description for this school. Mention focus areas, milestones, and relevant outcomes.",
  },
];

export function EducationSection({ reveal, className, contentClassName }: EducationSectionProps) {
  const [selectedId, setSelectedId] = useState(defaultItems[0].id);
  const selectedItem = defaultItems.find((item) => item.id === selectedId) ?? defaultItems[0];

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
              staggerChildren: 0.08,
              delayChildren: 0.1,
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
          Education
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.52, ease: easeOut },
            },
          }}
          className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
        >
          Academic Journey
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.48, ease: easeOut },
            },
          }}
          className="mt-5 max-w-3xl text-base leading-relaxed text-white/72 sm:text-lg"
        >
          A quick look at my learning path. Select a school on the left to view more details on the right.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: easeOut },
            },
          }}
          className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          <div className="p-0">
            <p className="text-xs uppercase tracking-[0.22em] text-white/52">Schools</p>

            <div className="mt-3 divide-y divide-white/6">
              {defaultItems.map((item, index) => {
                const isActive = selectedId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`group flex w-full items-center gap-3 py-3 px-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40 ${
                      isActive ? "text-foreground" : "text-white/78 hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-medium uppercase tracking-[0.16em] ${
                        isActive ? "text-accent border-accent/60 bg-accent/6" : "text-white/64 border-white/6 bg-transparent"
                      } border-[0.5px]`}
                      aria-hidden
                    >
                      {index + 1}
                    </span>

                    <span className="text-sm font-medium tracking-[0.01em]">{item.schoolName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-0">
            <p className="text-xs uppercase tracking-[0.22em] text-white/52">Selected School Details</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: easeOut }}
                className="mt-5"
              >
                <h3 className="font-display text-3xl leading-none text-foreground sm:text-4xl">
                  {selectedItem.schoolName}
                </h3>

                <div className="mt-6 flex flex-wrap gap-6 text-sm">
                  <div className="min-w-[10rem]">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/52">Degree</p>
                    <p className="mt-1 text-sm text-white/80">{selectedItem.degree}</p>
                  </div>

                  <div className="min-w-[8rem]">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/52">Duration</p>
                    <p className="mt-1 text-sm text-white/80">{selectedItem.duration}</p>
                  </div>

                  <div className="min-w-[8rem]">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/52">Location</p>
                    <p className="mt-1 text-sm text-white/80">{selectedItem.location}</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/6 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/52">Description</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/72">{selectedItem.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}