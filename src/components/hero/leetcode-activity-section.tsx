"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  fetchLeetCodeUser,
  type LeetCodeUserData,
} from "@/lib/leetcodeService";

type LeetCodeActivitySectionProps = {
  reveal: boolean;
  username?: string;
  className?: string;
  contentClassName?: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

// --- 1. COUNTER COMPONENT ---
function Counter({
  value,
  reveal,
}: {
  value: number | string;
  reveal: boolean;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const numericValue =
    typeof value === "string"
      ? parseInt(value.replace(/[^0-9]/g, ""), 10) || 0
      : value;

  useEffect(() => {
    if (reveal && numericValue > 0) {
      const controls = animate(count, numericValue, {
        duration: 2,
        ease: "easeOut",
        delay: 0.5,
      });
      return controls.stop;
    }
  }, [reveal, numericValue, count]);

  return <motion.span>{rounded}</motion.span>;
}

const intensityClasses = [
  "bg-white/[0.04] border-white/5",
  "bg-[#FA5D19]/25 border-[#FA5D19]/20 shadow-[0_0_8px_rgba(250,93,25,0.1)]",
  "bg-[#FA5D19]/50 border-[#FA5D19]/30 shadow-[0_0_12px_rgba(250,93,25,0.2)]",
  "bg-[#FA5D19] border-[#FA5D19]/40 shadow-[0_0_15px_rgba(250,93,25,0.4)]",
] as const;

const placeholderHeatmap = Array.from({ length: 365 }, (_, dayIndex) => {
  if (dayIndex % 13 === 0 || dayIndex % 29 === 0) return 0;
  return ((dayIndex * 17 + Math.floor(dayIndex / 5) * 3) % 3) + 1;
});

const placeholderCounts = placeholderHeatmap.map((lvl) => {
  if (lvl === 0) return 0;
  if (lvl === 1) return 1;
  if (lvl === 2) return 3;
  return 6;
});

export function LeetCodeActivitySection({
  reveal,
  username,
  className,
  contentClassName,
}: LeetCodeActivitySectionProps) {
  const [data, setData] = useState<LeetCodeUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ left: number; top: number } | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;
    if (!username) return;

    (async () => {
      await Promise.resolve();
      if (!mounted) return;
      setLoading(true);
      setError(null);
      try {
        const d = await fetchLeetCodeUser(username);
        if (!mounted) return;
        setData(d);
      } catch (e) {
        if (!mounted) return;
        setError("Unable to sync LeetCode data");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [username]);

  return (
    <section
      className={`relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-start px-6 pt-[6vh] pb-12 sm:px-8 md:px-10 md:pt-[8vh] md:pb-16 lg:px-14 ${className ?? ""}`}
    >
      <motion.div
        className={`w-full translate-y-4 md:translate-y-15 ${contentClassName ?? ""}`}
        initial={false}
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
        }}
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FA5D19]"
        >
          LeetCode Activity
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0 },
          }}
          className="mt-4 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.02em] text-foreground"
        >
          Submission Heatmap
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          Last 365 days of Leetcode submissions. You could say I like to keep
          busy solving problems, or maybe I just really like heatmaps.
        </motion.p>

        {/* --- HEATMAP CARD --- */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="mt-10 rounded-2xl border-[0.5px] border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl sm:p-8"
        >
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-[42rem] relative" ref={containerRef}>
              <div className="grid grid-flow-col grid-rows-7 gap-1.5">
                {(data?.heatmap ?? placeholderHeatmap).map((level, index) => {
                  const count = (data?.counts ?? placeholderCounts)[index] ?? 0;
                  return (
                    <motion.span
                      key={`day-${index}`}
                      onMouseEnter={(e) => {
                        setHoverIndex(index);
                        const rect =
                          containerRef.current?.getBoundingClientRect();
                        if (rect)
                          setTooltip({
                            left: e.clientX - rect.left + 12,
                            top: e.clientY - rect.top - 40,
                          });
                      }}
                      onMouseLeave={() => setHoverIndex(null)}
                      className={`h-[11px] w-[11px] rounded-[2px] border-[0.5px] transition-all duration-300 ${intensityClasses[level]}`}
                    />
                  );
                })}
              </div>

              {/* Enhanced Tooltip */}
              <AnimatePresence>
                {hoverIndex !== null && tooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ left: tooltip.left, top: tooltip.top }}
                    className="absolute z-50 pointer-events-none"
                  >
                    <div className="rounded border-[0.5px] border-[#FA5D19]/30 bg-surface/95 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xl backdrop-blur-md">
                      {(() => {
                        const today = new Date();
                        const start = new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate() - 364,
                        );
                        const d = new Date(start);
                        d.setDate(start.getDate() + hoverIndex);
                        const dateStr = d.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                        const cnt =
                          (data?.counts ?? placeholderCounts)[hoverIndex] ?? 0;
                        return `${dateStr} • ${cnt} ${cnt === 1 ? "SOLVED" : "SOLVED"}`;
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <span>Less</span>
            <div className="flex gap-1.5">
              {intensityClasses.map((intensity, i) => (
                <div
                  key={i}
                  className={`h-[11px] w-[11px] rounded-[2px] border-[0.5px] ${intensity}`}
                />
              ))}
            </div>
            <span>More</span>
            {loading && (
              <span className="ml-auto text-[#FA5D19] animate-pulse">
                Syncing...
              </span>
            )}
          </div>
        </motion.div>

        {/* --- STATS GRID --- */}
        {/* --- STATS GRID --- */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.article
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            className="rounded-2xl border-[0.5px] border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.04]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              Total Solved
            </p>
            <p className="mt-3 font-display text-5xl leading-none text-white">
              <Counter value={data?.total ?? 0} reveal={reveal && !!data} />
            </p>
          </motion.article>

          <motion.article
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            className="rounded-2xl border-[0.5px] border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.04]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
              Current Streak
            </p>
            <p className="mt-3 font-display text-5xl leading-none text-white">
              <Counter value={data?.streak ?? 0} reveal={reveal && !!data} />
            </p>
          </motion.article>
        </div>
      </motion.div>
    </section>
  );
}
