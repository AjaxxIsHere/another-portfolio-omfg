"use client";

import { useEffect, useState, useRef, type RefObject } from "react";

type WorkExperienceSectionProps = {
  reveal: boolean;
  className?: string;
  contentClassName?: string;
  scrollContainer?: RefObject<HTMLDivElement | null>; // ADDED THIS PROP
};

type ExperienceItem = {
  id: string;
  role: string;
  date: string;
  location: string;
  description: string;
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
    // images: ["/blinkr-1.jpg", "/blinkr-2.jpg", "/blinkr-3.jpg"], 
  },
  {
    id: "exp-2",
    role: "Flutter & Next.js Developer - Intellident AI",
    date: "June - August 2025",
    location: "Dubai, UAE",
    description:
      "Main contributor to the frontend development for an Intelligent AI Teeth Scanner application in flutter, focusing on intuitive user interface design and engaging animations.",
    // images: ["intellident1.png", "intellident2.png", "intellident3.jpg"], 
  },
  {
    id: "exp-3",
    role: "Planning Intern - 6thStreet.com",
    date: "June - August 2024",
    location: "Dubai, UAE",
    description:
      "Analyzed competitive UI of top retail apps, proposing actionable improvements to the store checkout page that targeted increased conversion rates.",
    images: ["apparel1.jpg", "apparel2.jpg", "apparel3.jpg"], 
  },
  {
    id: "exp-4",
    role: "Software Engineering Intern - ITX 360",
    date: "June - November 2022",
    location: "Colombo, Sri Lanka",
    description:
      "Apprenticed under senior engineers to develop and integrate backend features for a high-traffic transport management platform (SpringBoot), enhancing data integrity and supporting 10,000+ daily transactions",
  }
];

const easeOut = [0.16, 1, 0.3, 1] as const;

function CarouselPanel({
  item,
  index,
}: {
  item: ExperienceItem;
  index: number;
}) {
  if (!item.images || item.images.length === 0) {
    return null;
  }

  const safeIndex = index % item.images.length;
  const currentImage = item.images[safeIndex];

  return (
    <div className="group relative overflow-hidden rounded-xl border-[0.5px] border-white/10 bg-background/45 h-40 sm:h-48">
      <img
        key={`${item.id}-${safeIndex}`}
        src={currentImage}
        alt={`${item.role} screenshot`}
        // Added the transition and group-hover classes here to trigger the zoom and color pop
        className="absolute inset-0 h-full w-full object-cover grayscale opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      {item.images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
          {item.images.map((_, dotIndex) => (
            <span
              key={`${item.id}-dot-${dotIndex}`}
              // Added a smooth transition to the dots so they slide nicely between active states
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIndex === safeIndex ? "w-6 bg-[#FA5D19]" : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

  function DesktopTimelineItem({
  item,
  index,
  slideIndex,
  scrollContainer,
}: {
  item: ExperienceItem;
  index: number;
  slideIndex: number;
  scrollContainer?: RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;
    // Animations removed: render static content only

  const CardContent = (
    <div className="w-full rounded-2xl border-[0.5px] border-white/10 bg-surface/72 p-6 backdrop-blur-sm shadow-xl">
      <h3 className="font-display text-2xl leading-tight text-foreground lg:text-[2rem]">
        {item.role}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/72 lg:text-base">
        {item.description}
      </p>
      {item.images && item.images.length > 0 && (
        <div className="mt-5">
          <CarouselPanel item={item} index={slideIndex} />
        </div>
      )}
    </div>
  );

  const MetaContent = (
    <div className={`pt-6 ${isLeft ? "pl-8 lg:pl-16 text-left" : "pr-8 lg:pr-16 text-right"}`}>
      <p className="font-display text-3xl tracking-wide text-[#FA5D19] lg:text-4xl">
        {item.date}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {item.location}
      </p>
    </div>
  );

  return (
    <article ref={ref} className="relative flex w-full items-start justify-between">
      <div className="absolute left-1/2 top-10 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[0.5px] bg-white/20 border-white/20" />

      <div className="flex w-[calc(50%-2.2rem)] justify-end">
        {isLeft ? CardContent : MetaContent}
      </div>

      <div className="flex w-[calc(50%-2.2rem)] justify-start">
        {isLeft ? MetaContent : CardContent}
      </div>
    </article>
  );
}

export function WorkExperienceSection({
  reveal,
  className,
  contentClassName,
  scrollContainer,
}: WorkExperienceSectionProps) {
  const [slideIndexes, setSlideIndexes] = useState<number[]>(
    defaultExperiences.map(() => 0),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Animations removed: no scroll-driven transforms

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndexes((current) =>
        current.map((value, index) => {
          const images = defaultExperiences[index].images;
          if (!images || images.length <= 1) return 0;
          return (value + 1) % images.length;
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
      <div className={`w-full ${contentClassName ?? ""}`}>
        <p className="text-xs uppercase tracking-[0.3em] text-white/58">Career Path</p>

        <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-foreground">Work Experience</h2>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/72 sm:text-lg">
          A timeline of roles where I shipped products, improved systems, and learned to balance speed with long-term engineering quality.
        </p>

        {/* MOBILE LAYOUT */}
        <div className="mt-10 md:hidden">
          <div className="space-y-6">
            {defaultExperiences.map((item, index) => (
              <article
                key={item.id}
                className="rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-5"
              >
                <h3 className="font-display text-2xl leading-tight text-foreground">
                  {item.role}
                </h3>
                <div className="mt-2 mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50">
                  <span className="text-[#FA5D19]/90">{item.date}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{item.location}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/72 sm:text-base">
                  {item.description}
                </p>
                {item.images && item.images.length > 0 && (
                  <div className="mt-4">
                    <CarouselPanel item={item} index={slideIndexes[index]} />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* DESKTOP LAYOUT (static timeline) */}
        <div ref={containerRef} className="relative mt-10 hidden md:block">
          {/* Dimmed Background Line */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-white/10" />

          <div className="space-y-16">
            {defaultExperiences.map((item, index) => (
              <DesktopTimelineItem
                key={item.id}
                item={item}
                index={index}
                slideIndex={slideIndexes[index]}
                scrollContainer={scrollContainer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}