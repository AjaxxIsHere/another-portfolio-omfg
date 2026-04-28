"use client";

import { useEffect, useState, useRef, type RefObject } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type WorkExperienceSectionProps = {
  reveal: boolean;
  className?: string;
  contentClassName?: string;
  scrollContainer?: RefObject<HTMLDivElement | null>;
};

type ExperienceItem = {
  id: string;
  role: string;
  date: string;
  location: string;
  description: string;
  achievements?: string[];
  images?: string[];
};

const defaultExperiences: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Flutter Developer - Blinkr",
    date: "February - April 2026",
    location: "Dubai, UAE",
    description:
      "Optimized the front-end architecture for the social Q&A platform (Blinkr), implementing a grid-based UI layout that improved content discoverability and reduced app load times by streamlining asset delivery.",
    achievements: [
      "Engineered a scalable state management solution reducing unnecessary widget rebuilds by 40%.",
      "Integrated complex RESTful APIs ensuring seamless real-time data synchronization.",
      "Collaborated with UI/UX designers to translate Figma prototypes into pixel-perfect interactive screens."
    ],
  },
  {
    id: "exp-2",
    role: "Flutter & Next.js Developer - Intellident AI",
    date: "June - August 2025",
    location: "Dubai, UAE",
    description:
      "Main contributor to the frontend development for an Intelligent AI Teeth Scanner application in flutter, focusing on intuitive user interface design and engaging animations.",
    achievements: [
      "Built a seamless camera integration pipeline for real-time AI scanning feedback.",
      "Developed a responsive Next.js web dashboard for dentists to review patient analytics.",
      "Optimized 3D rendering performance on low-end mobile devices, boosting FPS by 35%."
    ],
  },
  {
    id: "exp-3",
    role: "Planning Intern - 6thStreet.com",
    date: "June - August 2024",
    location: "Dubai, UAE",
    description:
      "Analyzed competitive UI of top retail apps, proposing actionable improvements to the store checkout page that targeted increased conversion rates.",
    achievements: [
      "Conducted extensive A/B testing analysis resulting in a 12% improvement in checkout flow retention.",
      "Compiled cross-platform UX audits identifying friction points in the mobile shopping experience.",
      "Presented data-driven design overhaul proposals directly to the lead product engineering team."
    ],
    images: ["/apparel1.jpg", "/apparel2.jpg", "/apparel3.jpg"],
  },
  {
    id: "exp-4",
    role: "Software Engineering Intern - ITX 360",
    date: "June - November 2022",
    location: "Colombo, Sri Lanka",
    description:
      "Apprenticed under senior engineers to develop and integrate backend features for a high-traffic transport management platform (SpringBoot), enhancing data integrity and supporting 10,000+ daily transactions",
    achievements: [
      "Designed and optimized SQL database schemas to handle high-concurrency transport logging.",
      "Built secure SpringBoot microservices with robust error handling and JWT authentication.",
      "Wrote comprehensive unit tests achieving 85% code coverage across core booking modules."
    ],
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
  if (!item.images || item.images.length === 0) return null;

  const safeIndex = index % item.images.length;
  const currentImage = item.images[safeIndex];

  return (
    <div className="group relative mt-8 h-48 w-full overflow-hidden rounded-xl border-[0.5px] border-white/10 bg-background/45 sm:h-64 lg:h-72">
      <Image
        key={`${item.id}-${safeIndex}`}
        src={currentImage}
        alt={`${item.role} screenshot`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="absolute inset-0 h-full w-full object-cover grayscale opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

      {item.images.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          {item.images.map((_, dotIndex) => (
            <span
              key={`${item.id}-dot-${dotIndex}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIndex === safeIndex ? "w-8 bg-[#FA5D19]" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AccordionItem({
  item,
  isOpen,
  onClick,
  slideIndex,
}: {
  item: ExperienceItem;
  isOpen: boolean;
  onClick: () => void;
  slideIndex: number;
}) {
  return (
    <div className="group border-b-[0.5px] border-white/10">
      <button
        onClick={onClick}
        className="flex w-full cursor-pointer flex-col items-start justify-between py-6 text-left transition-colors duration-300 hover:bg-white/[0.02] sm:py-8 md:flex-row md:items-center px-2 md:px-4"
      >
        <div className="flex flex-col">
          <h3
            className={`font-display text-2xl tracking-wide transition-colors duration-300 md:text-3xl lg:text-4xl ${
              isOpen ? "text-[#FA5D19]" : "text-white group-hover:text-white/80"
            }`}
          >
            {item.role}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            <span>{item.location}</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className={isOpen ? "text-[#FA5D19]/80" : ""}>{item.date}</span>
          </div>
        </div>

        <div className="mt-4 hidden h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-zinc-500 transition-colors duration-300 group-hover:border-[#FA5D19]/50 group-hover:text-[#FA5D19] md:mt-0 md:flex">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
            className="overflow-hidden"
          >
            <div className="pb-10 px-2 md:px-4">
              {/* READABILITY FIX: Zinc-300 for solid contrast */}
              <p className="max-w-2xl text-base leading-relaxed white">
                {item.description}
              </p>
              
              {item.achievements && item.achievements.length > 0 && (
                <ul className="mt-6 flex max-w-2xl flex-col gap-4">
                  {item.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-2 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#FA5D19]" />
                      {/* READABILITY FIX: Zinc-400 for bullet points */}
                      <span className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <CarouselPanel item={item} index={slideIndex} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WorkExperienceSection({
  reveal,
  className,
  contentClassName,
}: WorkExperienceSectionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultExperiences[0].id);

  const [slideIndexes, setSlideIndexes] = useState<number[]>(
    defaultExperiences.map(() => 0)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndexes((current) =>
        current.map((value, index) => {
          const images = defaultExperiences[index].images;
          if (!images || images.length <= 1) return 0;
          return (value + 1) % images.length;
        })
      );
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className={`relative mx-auto flex h-full w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:flex-row md:gap-16 md:px-10 md:py-32 lg:px-14 lg:gap-24 ${className ?? ""}`}
    >
      <motion.div
        className="w-full md:w-[35%] lg:w-[30%]"
        initial="hidden"
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
        }}
      >
        <div className="sticky top-32 flex flex-col pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FA5D19]">
            Career Path
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.02em] text-white">
            Experience
          </h2>
          <p className="mt-8 max-w-sm text-base leading-relaxed text-zinc-400">
            A timeline of roles where I shipped scalable products, optimized systems, and learned to balance velocity with long-term engineering rigor.
          </p>
        </div>
      </motion.div>

      <motion.div
        className={`mt-16 w-full md:mt-0 md:w-[65%] lg:w-[70%] ${contentClassName ?? ""}`}
        initial="hidden"
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: easeOut } },
        }}
      >
        <div className="flex flex-col border-t-[0.5px] border-white/10">
          {defaultExperiences.map((item, index) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              slideIndex={slideIndexes[index]}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}