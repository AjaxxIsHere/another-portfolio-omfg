"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export type MilestoneStat = {
  label: string;
  value: string; // The target number
  suffix?: string;
  note?: string;
};

type MilestonesSectionProps = {
  stats: MilestoneStat[];
  reveal: boolean;
  className?: string;
  contentClassName?: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

// --- 1. COUNTER COMPONENT (For Spinning Numbers) ---
function Counter({ value, reveal }: { value: string; reveal: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  // Clean the string (e.g., "23" -> 23)
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;

  useEffect(() => {
    if (reveal) {
      // Small delay after the card appears for maximum impact
      const timer = setTimeout(() => {
        animate(count, numericValue, {
          duration: 1.8, // Slightly faster, punchier count-up
          ease: "easeOut",
        });
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [reveal, numericValue, count]);

  return <motion.span>{rounded}</motion.span>;
}

// --- 2. MAIN SECTION ---
export function MilestonesSection({
  stats,
  reveal,
  className,
  contentClassName,
}: MilestonesSectionProps) {
  const [stickerTurns, setStickerTurns] = useState<Record<string, number>>({});
  const stickers = ["/sun.png", "/laptop.png", "/target.png", "/rocket.png"];
  
  const stickerVariants = [
    { top: -25, right: -48, rotate: -10, size: 176, crawlX: 56, crawlY: -46 },
    { top: -30, right: -48, rotate: 8, size: 172, crawlX: 64, crawlY: -52 },
    { top: -16, right: -48, rotate: -6, size: 186, crawlX: 52, crawlY: -36 },
    { top: -20, right: -48, rotate: 12, size: 178, crawlX: 60, crawlY: -44 },
  ];

  return (
    <section className={`relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 py-12 sm:px-8 md:px-10 md:py-16 lg:px-14 ${className ?? ""}`}>
      <motion.div
        className={`w-full ${contentClassName ?? ""}`}
        initial={false}
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
        }}
      >
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FA5D19]"
        >
          Milestones
        </motion.p>

        <motion.h2
          variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
          className="mt-4 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.02em] text-foreground"
        >
          Highlights Across My Journey
        </motion.h2>

        {/* UPGRADE: Standard contrast Zinc-400 reading text */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          Building production software with consistency, curiosity, and measurable impact.
        </motion.p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-5">
          {stats.map((item, index) => {
            const sticker = stickers[index % stickers.length];
            const sv = stickerVariants[index % stickerVariants.length];
            const turns = stickerTurns[item.label] ?? 0;
            
            return (
              <motion.article
                key={item.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
                }}
                className="relative group rounded-2xl border-[0.5px] border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
              >
                {/* --- RESTORED & ENHANCED STICKER ANIMATIONS --- */}
                <motion.div
                  className="pointer-events-none absolute"
                  style={{ top: sv.top, right: sv.right, zIndex: 20 }}
                  // Initial "crawl" position for the entrance
                  initial={{ opacity: 0, x: sv.crawlX, y: sv.crawlY, scale: 0.74 }}
                  // Sildes into place on reveal
                  animate={reveal ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: [0.74, 1.06, 1], // Added a slight scale bounce
                  } : {}}
                  transition={{
                    duration: 0.9,
                    delay: 0.4 + index * 0.1,
                    ease: easeOut,
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setStickerTurns(p => ({ ...p, [item.label]: (p[item.label] ?? 0) + 1 }))}
                    className="pointer-events-auto block border-0 bg-transparent p-0 outline-none"
                    // Handles the 360-degree spin on click
                    animate={{ rotate: sv.rotate + turns * 360 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    // RE-ADDED: Slight tilt and scale on hover
                    whileHover={{ scale: 1.03, rotate: sv.rotate + (turns * 360) + 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={sticker}
                      alt=""
                      width={sv.size}
                      height={sv.size}
                      // Heavier shadow makes them look like stickers on glass
                      className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                      style={{ height: "auto" }}
                    />
                  </motion.button>
                </motion.div>

                {/* STAT CONTENT */}
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 transition-colors group-hover:text-zinc-400">
                  {item.label}
                </p>
                
                <p className="mt-3 flex items-baseline gap-1 font-display text-4xl leading-none text-white sm:text-5xl">
                  {/* NEW: Spinning Number count-up */}
                  <Counter value={item.value} reveal={reveal} />
                  {item.suffix ? (
                    <span className="text-2xl text-[#FA5D19]">{item.suffix}</span>
                  ) : null}
                </p>

                {item.note ? (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {item.note}
                  </p>
                ) : null}
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}