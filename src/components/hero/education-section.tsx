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
  image: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

const defaultItems: EducationItem[] = [
  {
    id: "school-one",
    schoolName: "Heriot-Watt University",
    degree: "BSc Computer Science (Expected 2026)",
    duration: "2023 - 2026",
    location: "Dubai, UAE",
    description:
      "Currently pursuing a degree in Computer Science with a focus on software development, algorithms, and systems design. Engaged in projects ranging from mobile app development to AI research, while actively participating in coding clubs and hackathons to sharpen my skills and collaborate with fellow tech enthusiasts.",
    image: "/school1.jpg", // Replace with your image
  },
  {
    id: "school-two",
    schoolName: "Universal College Lanka",
    degree: "BSc Computer Science",
    duration: "2021 - 2022",
    location: "Colombo, Sri Lanka",
    description:
      "Completed foundational coursework in computer science, covering programming languages, data structures, and software engineering principles. Here is where I first discovered my passion for coding and started building small projects, which laid the groundwork for my further studies and career in software development.",
    image: "/school2.jpg", // Replace with your image
  },
  {
    id: "school-three",
    schoolName: "The Asian International School",
    degree: "High School Diploma",
    duration: "2017 - 2021",
    location: "Colombo, Sri Lanka",
    description:
      "Graduated with a focus on business and mathematics, excelling in subjects like commerce, economics, and calculus. Actively involved in the school's football team, where i discovered my love for sports and teamwork. This period was crucial in developing my analytical thinking and discipline, which I carry into my software development journey.",
    image: "/school3.jpg", // Replace with your image
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
          A quick look at my learning path. Each step has been a building block in my development journey.
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
          className="mt-10 grid gap-10 lg:gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          {/* LEFT COLUMN: Static Snap Accordion with Drop-Up Animation */}
          <div className="p-0">
            <p className="text-xs uppercase tracking-[0.22em] text-white/52 mb-4">Schools</p>

            <div className="flex flex-col gap-3">
              {defaultItems.map((item, index) => {
                const isActive = selectedId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? "bg-surface/50 border-[0.5px] border-white/20 shadow-lg" 
                        : "bg-transparent hover:bg-white/5"
                    }`}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {isActive ? (
                        /* EXPANDED CINEMA SCOPE STATE */
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35, ease: easeOut }}
                          className="relative aspect-[21/9] w-full"
                        >
                          <img
                            src={item.image}
                            alt={item.schoolName}
                            className="absolute inset-0 h-full w-full object-cover grayscale opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                          />
                          {/* Gradient to make text readable */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent pointer-events-none" />

                          {/* Overlay Text */}
                          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[0.5px] border-[#FA5D19]/60 bg-[#FA5D19]/20 text-xs font-medium uppercase tracking-[0.16em] text-[#FA5D19] backdrop-blur-md">
                              {index + 1}
                            </span>
                            <span className="font-display text-2xl tracking-[0.01em] text-white drop-shadow-md lg:text-3xl">
                              {item.schoolName}
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        /* COLLAPSED BUTTON STATE */
                        <motion.div
                          key="collapsed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex w-full items-center gap-4 py-3 px-2"
                        >
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[0.5px] border-white/10 bg-surface/40 text-xs font-medium uppercase tracking-[0.16em] text-white/64 group-hover:border-white/30 group-hover:text-white/90 transition-colors">
                            {index + 1}
                          </span>
                          <span className="text-base font-medium tracking-[0.01em] text-white/78 group-hover:text-white transition-colors">
                            {item.schoolName}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Just the text details, matching original height exactly */}
          <div className="p-0 lg:pl-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/52">Details:</p>

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