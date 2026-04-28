"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

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
    image: "/school1.jpg", 
  },
  {
    id: "school-two",
    schoolName: "Universal College Lanka",
    degree: "BSc Computer Science",
    duration: "2021 - 2022",
    location: "Colombo, Sri Lanka",
    description:
      "Completed foundational coursework in computer science, covering programming languages, data structures, and software engineering principles. Here is where I first discovered my passion for coding and started building small projects, which laid the groundwork for my further studies and career in software development.",
    image: "/school2.jpg", 
  },
  {
    id: "school-three",
    schoolName: "The Asian International School",
    degree: "High School Diploma",
    duration: "2017 - 2021",
    location: "Colombo, Sri Lanka",
    description:
      "Graduated with a focus on business and mathematics, excelling in subjects like commerce, economics, and calculus. Actively involved in the school's football team, where i discovered my love for sports and teamwork. This period was crucial in developing my analytical thinking and discipline, which I carry into my software development journey.",
    image: "/school3.jpg", 
  },
];

export function EducationSection({ reveal, className, contentClassName }: EducationSectionProps) {
  const [selectedId, setSelectedId] = useState(defaultItems[0].id);
  const selectedItem = defaultItems.find((item) => item.id === selectedId) ?? defaultItems[0];

  return (
    <section
      className={`relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 py-12 sm:px-8 md:px-10 md:py-20 lg:px-14 ${className ?? ""}`}
    >
      <motion.div
        className={`w-full ${contentClassName ?? ""}`}
        initial={false}
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
        }}
      >
        {/* Header Section */}
        <div className="mb-16">
          <motion.p
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FA5D19]"
          >
            Education
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-foreground"
          >
            Academic Journey
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            A continuous path of learning. Each institution provided a critical building block in shaping my engineering mindset and problem-solving approach.
          </motion.p>
        </div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } } }}
          className="flex flex-col gap-12 lg:flex-row lg:gap-16"
        >
          {/* LEFT COLUMN: The Luminous Timeline */}
          <div className="relative flex w-full flex-col lg:w-2/5">
            <div className="absolute bottom-4 left-[19px] top-4 w-px bg-white/10" />

            <div className="flex flex-col gap-8">
              {defaultItems.map((item) => {
                const isActive = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className="group relative flex items-center gap-6 text-left outline-none"
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                      <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${isActive ? "bg-[#FA5D19] shadow-[0_0_15px_rgba(250,93,25,0.6)]" : "bg-white/10 group-hover:bg-white/30"}`} />
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="activeRing"
                            className="absolute inset-0 rounded-full border border-[#FA5D19]/40"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col">
                      <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${isActive ? "text-[#FA5D19]/80" : "text-white/20"}`}>
                        {item.duration}
                      </span>
                      <span className={`mt-1 font-display text-2xl transition-all duration-300 md:text-3xl ${isActive ? "text-white" : "text-white/20 group-hover:text-white/40"}`}>
                        {item.schoolName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Details Grid */}
          <div className="w-full lg:w-3/5 lg:pl-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="flex flex-col"
              >
                <div className="group relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl border-[0.5px] border-white/10 bg-white/[0.02]">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.schoolName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="absolute inset-0 h-full w-full object-cover grayscale opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                  <div className="absolute bottom-5 left-6 flex items-center">
                    <span className="font-display text-2xl tracking-[0.01em] text-white lg:text-3xl">
                      {selectedItem.schoolName}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-8">
                  Technical Specifications
                </p>

                <div className="flex flex-wrap gap-x-12 gap-y-8 text-sm">
                  <div className="min-w-[10rem]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Degree</p>
                    <p className="mt-2 font-medium text-sm text-zinc-100">{selectedItem.degree}</p>
                  </div>

                  <div className="min-w-[8rem]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Duration</p>
                    <p className="mt-2 font-medium text-sm text-zinc-100">{selectedItem.duration}</p>
                  </div>

                  <div className="min-w-[8rem]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Location</p>
                    <p className="mt-2 font-medium text-sm text-zinc-100">{selectedItem.location}</p>
                  </div>
                </div>

                <div className="mt-8 border-t-[0.5px] border-white/10 pt-8">
                  <p className="mt-0 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    {selectedItem.description}
                  </p>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}