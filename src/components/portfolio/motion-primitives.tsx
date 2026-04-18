"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ClassNameProps = {
  children: ReactNode;
  className?: string;
};

type RevealItemProps = ClassNameProps & {
  delay?: number;
  layoutId?: string;
};

export function StaggerGroup({ children, className }: ClassNameProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.08,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, delay = 0, layoutId }: RevealItemProps) {
  return (
    <motion.div
      layout
      layoutId={layoutId}
      className={className}
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
