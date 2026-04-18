"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";

type MilestoneItem = {
  label: string;
  value: number;
};

type MilestonesSectionProps = {
  progress?: MotionValue<number>;
};

type MilestoneCardProps = {
  item: MilestoneItem;
  index: number;
  progress?: MotionValue<number>;
};

const MILESTONES: MilestoneItem[] = [
  { label: "Age", value: 23 },
  { label: "Years Coding", value: 5 },
  { label: "Projects Completed", value: 11 },
  { label: "Projects Deployed", value: 4 },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

function MilestoneCard({ item, index, progress }: MilestoneCardProps) {
  const fallbackProgress = useMotionValue(1);
  const effectiveProgress = progress ?? fallbackProgress;
  const useProgressStyles = Boolean(progress);

  const start = 0.56 + index * 0.05;
  const end = 0.78 + index * 0.05;

  const y = useTransform(effectiveProgress, [start, end], [-72, 0], {
    clamp: true,
  });
  const opacity = useTransform(effectiveProgress, [start - 0.04, end], [0, 1], {
    clamp: true,
  });
  const scale = useTransform(effectiveProgress, [start, end], [0.96, 1], {
    clamp: true,
  });

  return (
    <motion.article
      className="rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-5 backdrop-blur-sm sm:p-6"
      style={useProgressStyles ? { y, opacity, scale } : undefined}
      initial={useProgressStyles ? undefined : { opacity: 0, y: -24, scale: 0.97 }}
      whileInView={useProgressStyles ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.58, delay: index * 0.08, ease: easeOut }}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-white/55">{item.label}</p>
      <p className="mt-3 font-display text-[clamp(2rem,5vw,3.6rem)] leading-none tracking-[-0.03em] text-foreground">
        {item.value}
      </p>
    </motion.article>
  );
}

export function MilestonesSection({ progress }: MilestonesSectionProps) {
  const fallbackProgress = useMotionValue(1);
  const effectiveProgress = progress ?? fallbackProgress;
  const useProgressStyles = Boolean(progress);

  const headingOpacity = useTransform(effectiveProgress, [0.5, 0.7], [0, 1], {
    clamp: true,
  });
  const headingY = useTransform(effectiveProgress, [0.5, 0.7], [28, 0], {
    clamp: true,
  });

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(237,237,237,0.08)_1px,transparent_0)] [background-size:24px_24px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_82%_24%,rgba(250,93,25,0.16)_0%,transparent_66%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1320px] flex-col justify-center px-5 py-10 sm:px-6 md:px-10 lg:px-14">
        <motion.div
          className="max-w-2xl"
          style={useProgressStyles ? { opacity: headingOpacity, y: headingY } : undefined}
          initial={useProgressStyles ? undefined : { opacity: 0, y: 18 }}
          whileInView={useProgressStyles ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/58">Milestones</p>
          <h2 className="mt-4 max-w-[12ch] text-balance font-display text-[clamp(2.2rem,5.4vw,5.4rem)] leading-[1.02] tracking-[-0.03em] text-foreground">
            Progress In Numbers
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/74 sm:text-lg">
            A quick snapshot of impact and consistency across my engineering journey.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:gap-6">
          {MILESTONES.map((item, index) => (
            <MilestoneCard
              key={item.label}
              item={item}
              index={index}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
