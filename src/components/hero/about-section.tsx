"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AboutSectionProps = {
  reveal: boolean;
  className?: string;
  contentClassName?: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

const initialLikes = [
  "Building apps from scratch",
  "Cats",
  "Late-night debugging",
  "Minimal UI systems",
  "Team play in games",
  "Placeholder like",
];

const initialDislikes = [
  "Messy handoffs",
  "Unclear requirements",
  "Shipping without testing",
  "Long silent meetings",
  "Broken hot reload",
  "Placeholder dislike",
];

export function AboutSection({ reveal, className, contentClassName }: AboutSectionProps) {
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [dislikes, setDislikes] = useState<string[]>(initialDislikes);
  const [active, setActive] = useState<string | null>(null);

  const likesRef = useRef<HTMLDivElement | null>(null);
  const dislikesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // nothing for now, placeholder for future persistence
  }, []);

  function handleChipDrop(item: string, from: "likes" | "dislikes", point: { x: number; y: number }) {
    const likesRect = likesRef.current?.getBoundingClientRect();
    const dislikesRect = dislikesRef.current?.getBoundingClientRect();

    if (!likesRect || !dislikesRect) return;

    const inLikes = point.x >= likesRect.left && point.x <= likesRect.right && point.y >= likesRect.top && point.y <= likesRect.bottom;
    const inDislikes = point.x >= dislikesRect.left && point.x <= dislikesRect.right && point.y >= dislikesRect.top && point.y <= dislikesRect.bottom;

    if (from === "likes" && inDislikes) {
      setLikes((s) => s.filter((v) => v !== item));
      setDislikes((s) => (s.includes(item) ? s : [...s, item]));
      return true;
    }

    if (from === "dislikes" && inLikes) {
      setDislikes((s) => s.filter((v) => v !== item));
      setLikes((s) => (s.includes(item) ? s : [...s, item]));
      return true;
    }

    return false;
  }

  // Local chip component to provide per-chip motion values for snapping
  function DraggableChip({
    item,
    from,
  }: {
    item: string;
    from: "likes" | "dislikes";
  }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const onDragEnd = (_event: unknown, info: PanInfo) => {
      const moved = handleChipDrop(item, from, info.point);
      if (!moved) {
        // snap back
        animate(x, 0, { type: "spring", stiffness: 300, damping: 28 });
        animate(y, 0, { type: "spring", stiffness: 300, damping: 28 });
      } else {
        // reset values to avoid leftover transforms
        x.set(0);
        y.set(0);
      }
    };

    return (
      <motion.span
        style={{ x, y }}
        drag
        dragMomentum={false}
        onDragEnd={onDragEnd}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setActive((s) => (s === item ? null : item));
          }
        }}
        onClick={() => setActive((s) => (s === item ? null : item))}
        role="button"
        aria-pressed={active === item}
        className={`rounded-full border-[0.5px] border-white/10 bg-background/45 px-3 py-1.5 text-sm text-white/78 cursor-grab select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30 ${
          active === item ? "bg-accent/12 text-accent border-accent" : ""
        }`}
      >
        {item}
      </motion.span>
    );
  }

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
              delayChildren: 0.1,
            },
          },
        }}
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.42, ease: easeOut },
            },
          }}
          className="text-xs uppercase tracking-[0.3em] text-white/58"
        >
          About
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.52, ease: easeOut },
            },
          }}
          className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.6vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
        >
          Who am I?
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.48, ease: easeOut },
            },
          }}
          className="mt-5 max-w-3xl text-base leading-relaxed text-white/72 sm:text-lg"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: easeOut },
            },
          }}
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          <section className="rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-5 backdrop-blur-sm">
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/58">Likes</h3>
            <div ref={likesRef} className="mt-4 flex flex-wrap gap-2.5">
              {likes.map((item) => (
                <DraggableChip key={item} item={item} from="likes" />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border-[0.5px] border-white/10 bg-surface/70 p-5 backdrop-blur-sm">
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/58">Dislikes</h3>
            <div ref={dislikesRef} className="mt-4 flex flex-wrap gap-2.5">
              {dislikes.map((item) => (
                <DraggableChip key={item} item={item} from="dislikes" />
              ))}
            </div>
          </section>
        </motion.div>
      </motion.div>
    </section>
  );
}
