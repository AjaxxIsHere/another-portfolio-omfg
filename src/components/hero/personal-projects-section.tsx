"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
  bannerUrl?: string;
  githubUrl: string;
  liveUrl: string;
};

const defaultProjects: ProjectItem[] = [
  {
    id: "project-1",
    title: "Larry's Wordle",
    description: "A mobile game inspired by Wordle, built with Flutter and AWS. It features a custom word list, daily challenges, and a sleek UI.",
    stack: ["Flutter", "Riverpod", "AWS", "DynamoDB"],
    githubUrl: "https://github.com/AjaxxIsHere/Larry-s-Wordle-A-wordle-inspired-mobile-game",
    liveUrl: "https://drive.usercontent.google.com/download?id=1dq8AhOxZu4l5by8WaAXgb9OZuVb4mSd_&export=download&authuser=0",
    bannerUrl: "/wordle.png", 
  },
  {
    id: "project-2",
    title: "WattHome",
    description: "Open-source smart home system to monitor, analyze, and optimize energy consumption via real-time data.",
    stack: ["Flutter", "Firebase", "GCP", "MySQL"],
    githubUrl: "https://github.com/WattHome-SmartHome/WattHome-Public",
    liveUrl: "#",
    bannerUrl: "/watthome.jpeg",
  },
  {
    id: "project-3",
    title: "Squash Web Browser",
    description: "A fast, minimalist desktop web browser focusing on speed, simplicity, and privacy with essential features.",
    stack: ["Avalonia UI", "C#", "WebView2"],
    githubUrl: "https://github.com/AjaxxIsHere/Squash_Web_Browser",
    liveUrl: "#",
    bannerUrl: "/squash.png",
  },
  {
    id: "project-4",
    title: "JobHuntingSucks",
    description: "A robust, modular web scraping system to aggregate tech jobs in the UAE, featuring skill-based filtering.",
    stack: ["Python", "BeautifulSoup", "Streamlit", "SQLite"],
    githubUrl: "https://github.com/AjaxxIsHere/JobHuntingSucks-A-python-tech-job-webscraper",
    liveUrl: "#",
  },
  {
    id: "project-5",
    title: "NextMovie",
    description: "A Flutter application that allows users to browse, search, and review movies, integrated with the TMDB API.",
    stack: ["Flutter", "Firebase", "Provider", "TMDB API"],
    githubUrl: "https://github.com/AjaxxIsHere/nextmovie_v2",
    liveUrl: "#",
    bannerUrl: "/nextmovie.PNG",
  },
  {
    id: "project-6",
    title: "P.U.R.R Pipeline",
    description: "Dissertation: A machine learning pipeline using BERT and scikit-learn to categorize software requirements.",
    stack: ["Python", "scikit-learn", "BERT", "Hugging Face"],
    githubUrl: "https://github.com/AjaxxIsHere/P.U.R.R-Pipeline-for-Understanding-Requirements-Reliability-Implementation",
    liveUrl: "#",
    bannerUrl: "/purr.png",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// --- PROJECT ROW COMPONENT ---
function ProjectRow({
  project,
  index,
  setHoveredProject,
}: {
  project: ProjectItem;
  index: number;
  setHoveredProject: (id: string | null) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: easeOut }}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
      className="group relative flex flex-col items-start justify-between border-b-[0.5px] border-white/10 py-12 transition-colors hover:border-[#FA5D19]/50 md:flex-row md:items-center cursor-crosshair"
    >
      {/* MOBILE IMAGE FALLBACK */}
      {project.bannerUrl && (
        <div className="relative mb-8 h-48 w-full overflow-hidden rounded-xl border-[0.5px] border-white/10 md:hidden">
          <Image src={project.bannerUrl} alt={project.title} fill className="object-cover grayscale" sizes="(max-width: 768px) 100vw, 0vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        </div>
      )}

      <div className="flex max-w-3xl flex-col z-10">
        <h3 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-none tracking-tight text-white transition-colors duration-300 group-hover:text-[#FA5D19]">
          {project.title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200 md:max-w-xl">
          {project.description}
        </p>
      </div>

      <div className="mt-10 flex w-full flex-col items-start justify-end gap-8 md:mt-0 md:w-auto md:items-end z-10">
        {/* SYNCHRONIZED CHIPS: Same as About Section */}
        <div className="flex flex-wrap gap-2.5 md:justify-end">
          {project.stack.map((tech) => (
            <span 
              key={tech} 
              className="rounded-full border-[0.5px] border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md transition-all duration-300 group-hover:border-[#FA5D19]/30 group-hover:bg-[#FA5D19]/10 group-hover:text-[#FA5D19]"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-white/10 bg-background/50 text-white/40 transition-all hover:border-[#FA5D19] hover:text-[#FA5D19] hover:scale-105 backdrop-blur-md">
            <GithubIcon />
          </a>
          {project.liveUrl !== "#" && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-white/10 bg-background/50 text-white/40 transition-all hover:border-[#FA5D19] hover:text-[#FA5D19] hover:scale-105 backdrop-blur-md">
              <LinkIcon />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- PROJECT CARD COMPONENT ---
function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: easeOut }}
      className="group flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-white/10 bg-white/[0.02] backdrop-blur-xl transition-colors hover:border-white/20"
    >
      <div className="relative h-56 w-full overflow-hidden border-b-[0.5px] border-white/10 bg-background/50">
        {project.bannerUrl ? (
          <Image src={project.bannerUrl} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="absolute inset-0 h-full w-full object-cover grayscale opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-[#FA5D19]/40">{project.title}</div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="font-display text-2xl leading-tight text-white transition-colors group-hover:text-[#FA5D19]">{project.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {project.stack.map((tech) => (
              <span key={tech} className="rounded-full border-[0.5px] border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-medium text-zinc-400 backdrop-blur-md transition-all group-hover:text-[#FA5D19]/90">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 border-t-[0.5px] border-white/10 pt-5">
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-[#FA5D19]"><GithubIcon /></a>
          {project.liveUrl !== "#" && (<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition-colors hover:text-[#FA5D19]"><LinkIcon /></a>)}
        </div>
      </div>
    </motion.div>
  );
}

export function PersonalProjectsSection({ reveal, className, contentClassName }: PersonalProjectsSectionProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });
  const containerRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || viewMode !== "list") return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left - 160); 
    mouseY.set(e.clientY - top - 110);  
  };

  const activeProject = defaultProjects.find((p) => p.id === hoveredProject);

  return (
    <section ref={containerRef} onMouseMove={handleMouseMove} className={`relative mx-auto flex h-full w-full max-w-[1440px] flex-col px-6 py-12 sm:px-8 md:px-10 md:py-24 lg:px-14 ${className ?? ""}`}>
      <motion.div className="pointer-events-none absolute left-0 top-0 z-0 hidden h-[220px] w-[320px] overflow-hidden rounded-2xl border-[0.5px] border-white/20 shadow-2xl md:block" style={{ x: smoothX, y: smoothY }} animate={{ opacity: hoveredProject && activeProject?.bannerUrl && viewMode === "list" ? 1 : 0, scale: hoveredProject && activeProject?.bannerUrl && viewMode === "list" ? 1 : 0.8 }} transition={{ duration: 0.3, ease: "easeOut" }}>
        <AnimatePresence mode="popLayout">
          {activeProject?.bannerUrl && (
            <motion.div key={activeProject.id} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="absolute inset-0 h-full w-full">
              <Image src={activeProject.bannerUrl} alt="Preview" fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className={`w-full ${contentClassName ?? ""}`} initial={false} animate={reveal ? "visible" : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}>
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="flex flex-col items-start gap-4">
            <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="text-xs font-bold uppercase tracking-[0.3em] text-[#FA5D19]">Portfolio</motion.p>
            <motion.h2 variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="max-w-3xl font-display text-[clamp(2.5rem,5.6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-white">Personal Projects</motion.h2>
            <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">A curated index of side projects, mobile applications, and technical deep-dives outside of my professional roles.</motion.p>
          </div>

          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex items-center rounded-full border-[0.5px] border-white/10 bg-white/[0.02] p-1 backdrop-blur-md">
            <button onClick={() => setViewMode("list")} className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none ${viewMode === "list" ? "bg-[#FA5D19]/10 text-[#FA5D19]" : "text-zinc-500 hover:text-zinc-100"}`}>List</button>
            <button onClick={() => setViewMode("grid")} className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none ${viewMode === "grid" ? "bg-[#FA5D19]/10 text-[#FA5D19]" : "text-zinc-500 hover:text-zinc-100"}`}>Grid</button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div key="list" className="flex w-full flex-col border-t-[0.5px] border-white/10">
              {defaultProjects.map((project, index) => <ProjectRow key={project.id} project={project} index={index} setHoveredProject={setHoveredProject} />)}
            </motion.div>
          ) : (
            <motion.div key="grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {defaultProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}