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
  "Gaming",
];

const initialDislikes = [
  "Messy handoffs",
  "Unclear requirements",
  "Shipping without testing",
  "Long silent meetings",
  "Grapes",
  "Functional Programming",
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
        animate(x, 0, { type: "spring", stiffness: 300, damping: 28 });
        animate(y, 0, { type: "spring", stiffness: 300, damping: 28 });
      } else {
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
        className={`rounded-full border-[0.5px] border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 backdrop-blur-md cursor-grab select-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FA5D19]/40 hover:bg-white/[0.08] hover:text-white ${
          active === item ? "bg-[#FA5D19]/10 text-[#FA5D19] border-[#FA5D19]/50" : ""
        }`}
      >
        {item}
      </motion.span>
    );
  }

  return (
    <section
      className={`relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 py-12 sm:px-8 md:px-10 md:py-20 lg:px-14 ${className ?? ""}`}
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
            visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: easeOut } },
          }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FA5D19]"
        >
          About
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: easeOut } },
          }}
          className="mt-4 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.02em] text-foreground"
        >
          Who am I?
        </motion.h2>

        {/* INCREASED MAX-WIDTH to 5xl to fill the right-side gap */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: easeOut } },
          }}
          className="mt-8 max-w-5xl text-base leading-relaxed text-zinc-300 sm:text-lg md:text-xl md:leading-loose"
        >
          Hi, I&apos;m Ajaz, but feel free to call me AJ. I&apos;m a mobile / web developer, and an aspiring software engineer currently studying at Heriot-Watt University Dubai, graduating in 2026. I enjoy building high quality applications and turning ideas into real, usable products. Outside of development, I like experimenting with Linux, tinkering with hardware, and keeping up with the latest in tech and gaming. I&apos;m always open to new challenges and collaborations, let&apos;s build something great!
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
          }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8"
        >
          <section className="rounded-2xl border-[0.5px] border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 mb-6">Likes</h3>
            <div ref={likesRef} className="flex flex-wrap gap-3">
              {likes.map((item) => (
                <DraggableChip key={item} item={item} from="likes" />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border-[0.5px] border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 mb-6">Dislikes</h3>
            <div ref={dislikesRef} className="flex flex-wrap gap-3">
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