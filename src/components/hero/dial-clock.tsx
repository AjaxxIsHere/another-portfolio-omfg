"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const SECOND_LABELS = Array.from({ length: 60 }, (_, index) => index);
const MINUTE_LABELS = [60, ...Array.from({ length: 59 }, (_, index) => index + 1)];
const HOUR_LABELS = Array.from({ length: 24 }, (_, index) => index);

type DialClockProps = {
  className?: string;
  edgeOffset?: boolean;
};

type DialRingProps = {
  labels: number[];
  rotation: number;
  radius: number;
  fontSize: string;
  opacity: number;
  isHighlighted: (value: number) => boolean;
};

function DialRing({
  labels,
  rotation,
  radius,
  fontSize,
  opacity,
  isHighlighted,
}: DialRingProps) {
  const step = 360 / labels.length;

  return (
    <div className="absolute inset-0">
      {labels.map((value, index) => {
        const angle = index * step - 90 - rotation;
        const radians = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(radians) * radius;
        const y = 50 + Math.sin(radians) * radius;
        const highlighted = isHighlighted(value);
        const showNumber = value % 5 === 0;
        const markerColor = highlighted
          ? "var(--color-accent)"
          : `rgba(237, 237, 237, ${opacity})`;

        return (
          <span
            key={`${value}-${index}`}
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            {showNumber ? (
              <span
                className="tabular-nums font-medium tracking-[0.08em]"
                style={{
                  fontSize,
                  color: markerColor,
                }}
              >
                {String(value).padStart(2, "0")}
              </span>
            ) : (
              <span
                className="block rounded-full"
                style={{
                  width: "0.28rem",
                  height: "0.28rem",
                  backgroundColor: `rgba(237, 237, 237, ${Math.max(0.16, opacity - 0.18)})`,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

export function DialClock({ className, edgeOffset = true }: DialClockProps) {
  // // Initialize to a deterministic value to avoid SSR/CSR hydration mismatches.
  // const [nowMs, setNowMs] = useState<number>(() => 0);

  // useEffect(() => {
  //   // Start the update loop after mount. The first update will occur
  //   // when the interval callback fires to avoid synchronous setState in effect.
  //   const timerId = window.setInterval(() => {
  //     setNowMs(Date.now());
  //   }, 40);

  //   return () => {
  //     window.clearInterval(timerId);
  //   };
  // }, []);

  const [nowMs, setNowMs] = useState<number>(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 40);

    return () => window.clearInterval(timerId);
  }, []);

  const { secondRotation, minuteRotation, hourRotation } = useMemo(() => {
    const now = new Date(nowMs);
    const secondValue = now.getSeconds() + now.getMilliseconds() / 1000;
    const minuteValue = now.getMinutes() + secondValue / 60;
    const hourValue = now.getHours() + minuteValue / 60;

    return {
      secondRotation: secondValue * 6,
      minuteRotation: minuteValue * 6,
      hourRotation: hourValue * 15,
    };
  }, [nowMs]);

  const positionClassName =
    className ?? "absolute right-0 top-1/2 z-[2] -translate-y-1/2";

  return (
    <motion.div
      className={`pointer-events-none ${positionClassName}`}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <div
        className={`relative h-[clamp(17rem,88vw,29rem)] w-[clamp(17rem,88vw,29rem)] translate-x-0 sm:h-[clamp(20rem,72vw,34rem)] sm:w-[clamp(20rem,72vw,34rem)] lg:h-[clamp(30rem,90vw,70rem)] lg:w-[clamp(30rem,90vw,70rem)] ${
          edgeOffset ? "lg:translate-x-[40%]" : "lg:translate-x-0"
        }`}
      >
        <DialRing
          labels={SECOND_LABELS}
          rotation={secondRotation}
          radius={46}
          fontSize="clamp(0.5rem,0.92vw,0.88rem)"
          opacity={0.46}
          isHighlighted={(value) => value === 0}
        />

        <DialRing
          labels={MINUTE_LABELS}
          rotation={minuteRotation}
          radius={39}
          fontSize="clamp(0.52rem,0.95vw,0.9rem)"
          opacity={0.62}
          isHighlighted={(value) => value === 60}
        />

        <DialRing
          labels={HOUR_LABELS}
          rotation={hourRotation}
          radius={32}
          fontSize="clamp(0.6rem,1.05vw,0.96rem)"
          opacity={0.82}
          isHighlighted={(value) => value === 0}
        />

        <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#1a1a1a]">
          <Image
            src="/profilePhtoo.jpeg"
            alt="Profile photo"
            fill
            priority
            className="object-cover filter grayscale hover:grayscale-0 transition-all duration-200 pointer-events-auto"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.04)_38%,transparent_70%)]" />
        </div>
      </div>
    </motion.div>
  );
}
