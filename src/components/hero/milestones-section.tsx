"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export type MilestoneStat = {
  label: string;
  value: string;
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

const cardVariants = {
  hidden: {
    opacity: 0,
    y: -96,
    rotateX: -24,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.62,
      ease: easeOut,
    },
  },
};

export function MilestonesSection({
  stats,
  reveal,
  className,
  contentClassName,
}: MilestonesSectionProps) {
  const [stickerTurns, setStickerTurns] = useState<Record<string, number>>({});
  const stickers = ["/sun.png", "/laptop.png", "/target.png", "/rocket.png"];
  const stickerVariants = [
    { top: -25, right: -40, rotate: -10, size: 176, crawlX: 56, crawlY: -46 },
    { top: -30, right: -70, rotate: 8, size: 198, crawlX: 64, crawlY: -52 },
    { top: -16, right: -48, rotate: -6, size: 196, crawlX: 52, crawlY: -36 },
    { top: -20, right: -60, rotate: 12, size: 178, crawlX: 60, crawlY: -44 },
  ];
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
              delayChildren: 0.12,
            },
          },
        }}
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: -24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: easeOut },
            },
          }}
          className="text-xs uppercase tracking-[0.3em] text-white/58"
        >
          Milestones
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: -26 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.58, ease: easeOut },
            },
          }}
          className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
        >
          Highlights Across My Journey
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: -22 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: easeOut },
            },
          }}
          className="mt-5 max-w-2xl text-base text-white/72 sm:text-lg"
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
                variants={cardVariants}
                transition={{ delay: index * 0.03 }}
                className="relative group rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-5 backdrop-blur-sm"
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{ top: sv.top, right: sv.right, zIndex: 20 }}
                  initial={{ opacity: 0, x: sv.crawlX, y: sv.crawlY, scale: 0.74 }}
                  animate={{
                    opacity: 1,
                    x: [sv.crawlX * 0.55, sv.crawlX * 0.2, 0],
                    y: [sv.crawlY * 0.55, sv.crawlY * 0.2, 0],
                    scale: [0.74, 1.06, 1],
                  }}
                  transition={{
                    duration: 0.86,
                    delay: 0.24 + index * 0.06,
                    ease: easeOut,
                  }}
                >
                  <motion.button
                    type="button"
                    aria-label={`${item.label} sticker`}
                    onClick={() => {
                      setStickerTurns((prev) => ({
                        ...prev,
                        [item.label]: (prev[item.label] ?? 0) + 1,
                      }));
                    }}
                    className="pointer-events-auto block cursor-pointer appearance-none border-0 bg-transparent p-0"
                    animate={{ rotate: sv.rotate + turns * 360 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16, mass: 0.82 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <Image
                      src={sticker}
                      alt=""
                      width={sv.size}
                      height={sv.size}
                      priority={false}
                      draggable={false}
                      className="select-none bg-transparent drop-shadow-2xl"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </motion.button>
                </motion.div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/52">{item.label}</p>
                <p className="mt-3 flex items-end gap-1 font-display text-4xl leading-none text-foreground sm:text-5xl">
                  <span>{item.value}</span>
                  {item.suffix ? <span className="text-2xl text-accent">{item.suffix}</span> : null}
                </p>
                {item.note ? <p className="mt-3 text-sm text-white/65">{item.note}</p> : null}
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
