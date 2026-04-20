"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const SCORE_TICK_MS = 500;
const STROKE_WINDOW_MS = 650;
const MIN_DRAG_DELTA_Y = 8;
const MIN_STROKE_DISTANCE = 24;
const WATCH_COMB_GRACE_MS = 300;
const WATCH_COMB_CHECK_MS = 50;

type GameStatus = "playing" | "game-over";

const easeOut = [0.16, 1, 0.3, 1] as const;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function CatCombGame() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<GameStatus>("playing");
  const lastDirectionRef = useRef<1 | -1 | 0>(0);
  const lastTurnYRef = useRef<number | null>(null);
  const lastStrokeAtRef = useRef(0);
  const combingWhileWatchedSinceRef = useRef<number | null>(null);
  const watchSoundRef = useRef<HTMLAudioElement | null>(null);
  const explodeSoundRef = useRef<HTMLAudioElement | null>(null);

  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [isDragging, setIsDragging] = useState(false);
  const [isCombOverBody, setIsCombOverBody] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [roundSeed, setRoundSeed] = useState(0);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  

  const isPointerOverBody = useCallback((x: number, y: number) => {
    const rect = bodyRef.current?.getBoundingClientRect();
    if (!rect) {
      return false;
    }

    const insetX = rect.width * 0.08;
    const insetTop = rect.height * 0.12;
    const insetBottom = rect.height * 0.06;

    return (
      x >= rect.left + insetX &&
      x <= rect.right - insetX &&
      y >= rect.top + insetTop &&
      y <= rect.bottom - insetBottom
    );
  }, []);

  const triggerGameOver = useCallback(() => {
    if (statusRef.current === "game-over") {
      return;
    }
    // play explosion sound on game over
    try {
      if (explodeSoundRef.current) explodeSoundRef.current.currentTime = 0;
      explodeSoundRef.current?.play().catch(() => {});
    } catch {
      // ignore
    }
    statusRef.current = "game-over";
    setStatus("game-over");
    setIsWatching(false);
    setIsDragging(false);
    setIsCombOverBody(false);
    combingWhileWatchedSinceRef.current = null;
  }, []);

  // preload audio assets
  useEffect(() => {
    if (typeof Audio !== "undefined") {
      try {
        watchSoundRef.current = new Audio("/ceeday-huh-sound-effect.mp3");
        watchSoundRef.current.preload = "auto";
      } catch {
        watchSoundRef.current = null;
      }

      try {
        explodeSoundRef.current = new Audio("/explosion-meme_dTCfAHs.mp3");
        explodeSoundRef.current.preload = "auto";
      } catch {
        explodeSoundRef.current = null;
      }
    }
  }, []);

  // play a short 'huh' sound when the cat head appears
  useEffect(() => {
    if (isWatching && status === "playing") {
      try {
        if (watchSoundRef.current) watchSoundRef.current.currentTime = 0;
        watchSoundRef.current?.play().catch(() => {});
      } catch {
        // ignore play errors (autoplay blocked)
      }
    }
  }, [isWatching, status]);

  const isCombingNow = useCallback(() => {
    if (statusRef.current === "game-over") {
      return false;
    }

    const hasRecentStroke =
      performance.now() - lastStrokeAtRef.current <= STROKE_WINDOW_MS;

    return isDragging && isCombOverBody && hasRecentStroke;
  }, [isDragging, isCombOverBody]);

  const handleDragStart = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (statusRef.current === "game-over") {
        return;
      }

      setIsDragging(true);
      setIsCombOverBody(isPointerOverBody(info.point.x, info.point.y));
    },
    [isPointerOverBody],
  );

  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (statusRef.current === "game-over") {
        return;
      }

      const overBody = isPointerOverBody(info.point.x, info.point.y);
      setIsCombOverBody(overBody);

      if (!overBody) {
        lastDirectionRef.current = 0;
        lastTurnYRef.current = null;
        return;
      }

      const deltaY = info.delta.y;
      if (Math.abs(deltaY) < MIN_DRAG_DELTA_Y) {
        return;
      }

      const direction: 1 | -1 = deltaY > 0 ? 1 : -1;
      const previousDirection = lastDirectionRef.current;
      const currentY = info.point.y;

      if (previousDirection === 0) {
        lastDirectionRef.current = direction;
        lastTurnYRef.current = currentY;
        return;
      }

      if (direction !== previousDirection) {
        const previousPivotY = lastTurnYRef.current ?? currentY;
        const travelDistance = Math.abs(currentY - previousPivotY);

        if (travelDistance >= MIN_STROKE_DISTANCE) {
          lastStrokeAtRef.current = performance.now();
        }

        lastDirectionRef.current = direction;
        lastTurnYRef.current = currentY;
      }
    },
    [isPointerOverBody],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setIsCombOverBody(false);
    lastDirectionRef.current = 0;
    lastTurnYRef.current = null;
  }, []);

  const restartGame = useCallback(() => {
    statusRef.current = "playing";
    setStatus("playing");
    setScore(0);
    setIsWatching(false);
    setIsDragging(false);
    setIsCombOverBody(false);
    // setShowScareFlash(false);
    lastDirectionRef.current = 0;
    lastTurnYRef.current = null;
    lastStrokeAtRef.current = 0;
    combingWhileWatchedSinceRef.current = null;
    setRoundSeed((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    const scoreTimer = window.setInterval(() => {
      if (!isCombingNow()) {
        return;
      }

      setScore((prev) => prev + 1);
    }, SCORE_TICK_MS);

    return () => {
      window.clearInterval(scoreTimer);
    };
  }, [isCombingNow, status]);

  useEffect(() => {
    if (status !== "playing") {
      combingWhileWatchedSinceRef.current = null;
      return;
    }

    const dangerCheckTimer = window.setInterval(() => {
      const combing = isCombingNow();

      if (!isWatching || !combing) {
        combingWhileWatchedSinceRef.current = null;
        return;
      }

      const now = performance.now();

      if (combingWhileWatchedSinceRef.current === null) {
        combingWhileWatchedSinceRef.current = now;
        return;
      }

      if (now - combingWhileWatchedSinceRef.current >= WATCH_COMB_GRACE_MS) {
        triggerGameOver();
      }
    }, WATCH_COMB_CHECK_MS);

    return () => {
      window.clearInterval(dangerCheckTimer);
    };
  }, [isCombingNow, isWatching, status, triggerGameOver]);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    let cancelled = false;
    let watchStartTimer: number | null = null;
    let watchStopTimer: number | null = null;

    const scheduleWatchCycle = () => {
      const waitDuration = randomInt(1800, 4800);
      watchStartTimer = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        setIsWatching(true);

        const watchDuration = randomInt(850, 1700);
        watchStopTimer = window.setTimeout(() => {
          if (cancelled) {
            return;
          }

          setIsWatching(false);
          scheduleWatchCycle();
        }, watchDuration);
      }, waitDuration);
    };

    scheduleWatchCycle();

    return () => {
      cancelled = true;

      if (watchStartTimer !== null) {
        window.clearTimeout(watchStartTimer);
      }

      if (watchStopTimer !== null) {
        window.clearTimeout(watchStopTimer);
      }
    };
  }, [status, roundSeed]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#121212] text-foreground">
      <motion.section
        key={roundSeed}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="relative h-full w-full"
      >
        {status === "playing" ? (
          <div className="pointer-events-none absolute left-3 top-2 z-40 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-white/50 sm:left-6 sm:top-3">
            <span>Score {score}</span>
            {isWatching ? <span className="text-[#FA5D19]">Watching</span> : null}
          </div>
        ) : null}

        <div className="relative h-full overflow-hidden">
          {/* orange scare flash removed */}

          <div
            ref={bodyRef}
            className="pointer-events-none absolute left-1/2 top-[53%] z-10 w-[min(74vw,560px)] -translate-x-1/2 -translate-y-1/2 select-none"
          >
            <Image
              src="/catBody.png"
              alt="Cat body"
              width={750}
              height={900}
              priority
              className="h-auto w-full object-contain"
              draggable={false}
            />

            {isWatching || status === "game-over" ? (
              <div className="absolute left-[69%] top-[30%] z-30 w-[42%] max-w-[230px] -translate-x-1/2 -translate-y-1/2">
                <Image
                  src={status === "game-over" ? "/lionHead.png" : "/catHead.png"}
                  alt={status === "game-over" ? "Roaring lion" : "Cat watching"}
                  width={420}
                  height={420}
                  className="h-auto w-full object-contain drop-shadow-[0_18px_26px_rgba(0,0,0,0.45)]"
                  draggable={false}
                  priority={status === "game-over"}
                />
              </div>
            ) : null}

            {status === "game-over" ? (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.28 }}
                  className="text-center"
                >
                  <div className="font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-none text-[#FA5D19]">
                    {score}
                  </div>
                  <div className="mt-2 text-sm text-white/70 uppercase tracking-[0.18em]">Final Score</div>
                </motion.div>
              </div>
            ) : null}
          </div>

          <motion.div
            drag={status !== "game-over"}
            dragMomentum={false}
            dragElastic={0.08}
            dragConstraints={{ top: -280, bottom: 280, left: -520, right: 520 }}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileDrag={status === "game-over" ? undefined : { scale: 1.02 }}
            className="absolute left-[62%] top-[57%] z-20 w-[160px] cursor-grab touch-none select-none active:cursor-grabbing sm:w-[200px]"
          >
            <Image
              src="/comb.png"
              alt="Comb"
              width={460}
              height={300}
              className={`h-auto w-full object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.45)] ${
                status === "game-over" ? "opacity-70" : "opacity-100"
              }`}
              draggable={false}
              priority
            />
          </motion.div>

          {status === "game-over" ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease: easeOut }}
              className="absolute bottom-5 left-4 z-50 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] sm:bottom-7 sm:left-6"
            >
              <button
                type="button"
                onClick={restartGame}
                className="text-[#FA5D19] transition-colors hover:text-[#ff8a55]"
              >
                Restart
              </button>
              <Link
                href="/"
                className="text-white/72 transition-colors hover:text-white"
              >
                Back Home
              </Link>
            </motion.div>
          ) : null}
        </div>
      </motion.section>
    </main>
  );
}
