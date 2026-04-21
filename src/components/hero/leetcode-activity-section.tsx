"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fetchLeetCodeUser, type LeetCodeUserData } from "@/lib/leetcodeService";

type LeetCodeActivitySectionProps = {
  reveal: boolean;
  username?: string;
  className?: string;
  contentClassName?: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

const intensityClasses = [
  "bg-white/[0.04]",
  "bg-[#FA5D19]/28",
  "bg-[#FA5D19]/52",
  "bg-[#FA5D19]/82",
] as const;

const placeholderHeatmap = Array.from({ length: 365 }, (_, dayIndex) => {
  if (dayIndex % 13 === 0 || dayIndex % 29 === 0) {
    return 0;
  }

  return ((dayIndex * 17 + Math.floor(dayIndex / 5) * 3) % 3) + 1;
});
const placeholderCounts = placeholderHeatmap.map((lvl) => {
  // map intensity back to an approximate count for placeholder tooltips
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
  const [tooltip, setTooltip] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!username) return;

    (async () => {
      // yield to avoid synchronous setState inside effect
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
        setError(String((e as Error)?.message ?? e));
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
    // <section
    //   className={`relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 py-16 sm:px-8 md:px-10 lg:px-14 ${className ?? ""}`}
    // >
    <section
      // Removed 'items-center', added 'pt-[30vh]'
      className={`relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-start px-6 pt-[8vh] pb-16 sm:px-8 md:px-10 lg:px-14 ${className ?? ""}`}
    >
      <motion.div
        className={`w-full translate-y-4 md:translate-y-15 ${contentClassName ?? ""}`}
        initial={false}
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.12,
            },
          },
        }}
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.44, ease: easeOut },
            },
          }}
          className="text-xs uppercase tracking-[0.3em] text-white/58"
        >
          LeetCode Activity
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.56, ease: easeOut },
            },
          }}
          className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
        >
          Submission Heatmap
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.46, ease: easeOut },
            },
          }}
          className="mt-5 max-w-2xl text-base text-white/72 sm:text-lg"
        >
          Last 365 days of Leetcode submissions. You could say I like to keep busy solving problems, or maybe I just really like heatmaps.
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
          className="mt-10 rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-4 backdrop-blur-sm sm:p-6"
        >
          <div className="overflow-x-auto">
              <div className="min-w-[42rem] relative" ref={containerRef}>
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {(data?.heatmap ?? placeholderHeatmap).map((level, index) => {
                    const countsArr = data?.counts ?? placeholderCounts;
                    const count = countsArr[index] ?? 0;
                    return (
                      <motion.span
                        key={`day-${index}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`${count} submissions`}
                        onMouseEnter={(e) => {
                          setHoverIndex(index);
                          const rect = containerRef.current?.getBoundingClientRect();
                          if (rect) {
                            const left = e.clientX - rect.left + 8;
                            const top = e.clientY - rect.top - 36;
                            setTooltip({ left, top });
                          }
                        }}
                        onMouseMove={(e) => {
                          const rect = containerRef.current?.getBoundingClientRect();
                          if (rect) {
                            const left = e.clientX - rect.left + 8;
                            const top = e.clientY - rect.top - 36;
                            setTooltip({ left, top });
                          }
                        }}
                        onMouseLeave={() => {
                          setHoverIndex(null);
                          setTooltip(null);
                        }}
                        onFocus={(e) => {
                          setHoverIndex(index);
                          const rect = containerRef.current?.getBoundingClientRect();
                          if (rect) {
                            const left = (e.target as Element).getBoundingClientRect().left - rect.left + 8;
                            const top = (e.target as Element).getBoundingClientRect().top - rect.top - 36;
                            setTooltip({ left, top });
                          }
                        }}
                        onBlur={() => {
                          setHoverIndex(null);
                          setTooltip(null);
                        }}
                        initial={{ opacity: 0, scale: 0.86 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.24,
                          delay: 0.16 + (index % 35) * 0.008,
                          ease: easeOut,
                        }}
                        className={`h-3 w-3 rounded-[3px] border-[0.5px] border-white/6 ${intensityClasses[level]}`}
                      />
                    );
                  })}
                </div>

                {hoverIndex !== null && tooltip ? (
                  <div
                    style={{ left: tooltip.left, top: tooltip.top }}
                    className="absolute z-50 pointer-events-none"
                  >
                    <div className="rounded-md border-[0.5px] border-white/12 bg-surface/95 px-2 py-1 text-sm text-foreground">
                      {(() => {
                        const today = new Date();
                        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        start.setDate(start.getDate() - (365 - 1));
                        const d = new Date(start);
                        d.setDate(start.getDate() + hoverIndex);
                        const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
                        const cnt = (data?.counts ?? placeholderCounts)[hoverIndex] ?? 0;
                        return `${dateStr} — ${cnt} ${cnt === 1 ? "submission" : "submissions"}`;
                      })()}
                    </div>
                  </div>
                ) : null}
              </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-white/60">
            <span>Less</span>
            {intensityClasses.map((intensity) => (
              <span
                key={intensity}
                className={`h-3 w-3 rounded-[3px] border-[0.5px] border-white/8 ${intensity}`}
              />
            ))}
            <span>More</span>
            {loading ? <span className="ml-3 text-xs text-white/60">Loading...</span> : null}
            {error ? <span className="ml-3 text-xs text-rose-400">{error}</span> : null}
          </div>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.44, ease: easeOut },
            },
          }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <article className="rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-white/52">Total Submissions</p>
            <p className="mt-3 font-display text-5xl leading-none text-foreground">{data ? data.total : "--"}</p>
          </article>

          <article className="rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-white/52">Current Streak</p>
            <p className="mt-3 font-display text-5xl leading-none text-foreground">{data ? data.streak : "--"}</p>
          </article>
        </motion.div>
      </motion.div>
    </section>
  );
}
