"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PersonalProjectsSectionProps = {
  reveal: boolean;
  className?: string;
  contentClassName?: string;
};

type ProjectItem = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  bannerUrl?: string; // Optional if you have an actual image
  githubUrl: string;
  liveUrl: string;
};

const defaultProjects: ProjectItem[] = [
  {
    id: "project-1",
    title: "Project Alpha",
    description: "A comprehensive dashboard for tracking analytics in real-time, focusing on user behavior and product engagement metrics.",
    stack: ["React", "Next.js", "Tailwind CSS"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "project-2",
    title: "Project Beta",
    description: "An e-commerce platform boilerplate designed for high conversion rates with seamless Stripe integration and a headless CMS.",
    stack: ["TypeScript", "Stripe", "Sanity"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "project-3",
    title: "Project Gamma",
    description: "A collaborative real-time editor using web sockets allowing multiple users to simultaneously edit and draw diagrams.",
    stack: ["Socket.io", "Canvas API", "Node.js"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "project-4",
    title: "Project Delta",
    description: "Personal finance tracker app that integrates with Plaid API and intelligently categorizes user transactions.",
    stack: ["PostgreSQL", "Prisma", "Express"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "project-5",
    title: "Project Epsilon",
    description: "Machine learning visualization app demonstrating neural network training steps visually directly in the browser.",
    stack: ["TensorFlow.js", "D3.js", "Vite"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "project-6",
    title: "Project Zeta",
    description: "A desktop-class productivity app running natively via Tauri with an offline-first local database mechanism.",
    stack: ["Rust", "Tauri", "SQLite"],
    githubUrl: "#",
    liveUrl: "#",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function PersonalProjectsSection({ reveal, className, contentClassName }: PersonalProjectsSectionProps) {
  const [viewMode, setViewMode] = useState<"carousel" | "list">("carousel");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % defaultProjects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? defaultProjects.length - 1 : prev - 1));
  };

  const renderCard = (project: ProjectItem) => (
    <div key={project.id} className="flex min-h-[14rem] flex-col sm:flex-row overflow-hidden rounded-2xl border-[0.5px] border-white/10 bg-surface/70 backdrop-blur-sm transition-colors hover:border-white/20">
      {/* Banner Image Placeholder */}
      <div className="relative h-40 w-full shrink-0 border-b-[0.5px] border-white/10 bg-background/50 sm:h-auto sm:w-1/3 sm:border-b-0 sm:border-r-[0.5px]">
        <div className="absolute inset-0 flex items-center justify-center text-white/20">
          <span className="text-xs uppercase tracking-widest text-[#FA5D19]/40">{project.title}</span>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-display text-2xl leading-none text-foreground">{project.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/72">{project.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="rounded-full border-[0.5px] border-white/10 bg-background/35 px-2.5 py-1 text-[11px] uppercase tracking-wider text-white/60">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t-[0.5px] border-white/10 pt-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="text-white/40 transition-colors hover:text-[#FA5D19]"
          >
            <GithubIcon />
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live Project"
            className="text-white/40 transition-colors hover:text-[#FA5D19]"
          >
            <LinkIcon />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section className={`relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 py-16 sm:px-8 md:px-10 lg:px-14 ${className ?? ""}`}>
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
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: easeOut } } }} className="text-xs uppercase tracking-[0.3em] text-white/58">
              Portfolio
            </motion.p>

            <motion.h2 variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: easeOut } } }} className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-foreground">
              Personal Projects
            </motion.h2>
          </div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } } }}
            className="flex items-center rounded-full border-[0.5px] border-white/10 bg-surface/70 p-1 backdrop-blur-md"
          >
            <button
              onClick={() => setViewMode("carousel")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FA5D19]/40 ${
                viewMode === "carousel" ? "bg-[#FA5D19]/10 text-[#FA5D19]" : "text-white/60 hover:text-white/90"
              }`}
            >
              Carousel
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FA5D19]/40 ${
                viewMode === "list" ? "bg-[#FA5D19]/10 text-[#FA5D19]" : "text-white/60 hover:text-white/90"
              }`}
            >
              Grid
            </button>
          </motion.div>
        </div>

        <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: easeOut } } }} className="mt-5 max-w-3xl text-base leading-relaxed text-white/72 sm:text-lg">
          A showcase of side projects, experiments, and technical explorations. 
        </motion.p>

        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } } }} className="mt-10 min-h-[360px]">
          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid gap-5 lg:grid-cols-2"
              >
                {defaultProjects.map((project) => renderCard(project))}
              </motion.div>
            ) : (
              <motion.div
                key="carousel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                    >
                      {renderCard(defaultProjects[currentIndex])}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button onClick={handlePrev} className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 bg-surface/70 text-white/60 transition-colors hover:text-white/90 hover:border-[#FA5D19]/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FA5D19]/40" aria-label="Previous Project">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                    {currentIndex + 1} / {defaultProjects.length}
                  </span>
                  <button onClick={handleNext} className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 bg-surface/70 text-white/60 transition-colors hover:text-white/90 hover:border-[#FA5D19]/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FA5D19]/40" aria-label="Next Project">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}