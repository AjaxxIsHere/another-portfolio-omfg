"use client";

import { useEffect, useState, useRef } from "react";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▀▄■□▪▫●○◆◇◈◊※†‡⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏";

export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecoded, setIsDecoded] = useState(false);
  const [activeGlitches, setActiveGlitches] = useState<Record<number, string>>({});

  // --- PHASE 1: Initial Left-to-Right Decode ---
  useEffect(() => {
    let iteration = 0;
    let animationFrameId: number;

    const scramble = () => {
      iteration += 1 / 3;

      const scrambled = text
        .split("")
        .map((char, index) => {
          if (char === " " || char === "\n") return char;
          if (index < iteration) return text[index];
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (iteration < text.length) {
        animationFrameId = requestAnimationFrame(scramble);
      } else {
        setDisplayText(text);
        setIsDecoded(true); // Trigger Phase 2
      }
    };

    animationFrameId = requestAnimationFrame(scramble);

    return () => cancelAnimationFrame(animationFrameId);
  }, [text]);

  // --- PHASE 2: Ambient Idle Glitches ---
  useEffect(() => {
    if (!isDecoded) return;

    let nextGlitchTimeout: NodeJS.Timeout;
    const runningGlitches = new Map<number, { interval: NodeJS.Timeout; timeout: NodeJS.Timeout }>();

    const triggerGlitch = () => {
      const validIndices: number[] = [];
      for (let i = 0; i < text.length; i++) {
        // Only glitch characters that aren't spaces/newlines and aren't ALREADY glitching
        if (text[i] !== " " && text[i] !== "\n" && !runningGlitches.has(i)) {
          validIndices.push(i);
        }
      }

      if (validIndices.length > 0) {
        // Pick 1 letter to glitch (rarely 2, to keep it subtle)
        const numGlitches = Math.random() > 0.9 ? 2 : 1;

        for (let i = 0; i < numGlitches; i++) {
          const idx = validIndices[Math.floor(Math.random() * validIndices.length)];
          if (idx === undefined) continue;

          // Randomize how long the letter stays glitched (200ms to 600ms)
          const duration = 200 + Math.random() * 400;
          // Randomize how fast the character flips during the glitch (30ms to 80ms)
          const speed = 30 + Math.random() * 50;

          const intervalId = setInterval(() => {
            setActiveGlitches((prev) => ({
              ...prev,
              [idx]: GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
            }));
          }, speed);

          const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            setActiveGlitches((prev) => {
              const next = { ...prev };
              delete next[idx];
              return next;
            });
            runningGlitches.delete(idx);
          }, duration);

          runningGlitches.set(idx, { interval: intervalId, timeout: timeoutId });
        }
      }

      // Schedule the next ambient glitch (between 3 to 7 seconds from now)
      nextGlitchTimeout = setTimeout(triggerGlitch, 3000 + Math.random() * 4000);
    };

    // Start the first ambient glitch after a short delay
    nextGlitchTimeout = setTimeout(triggerGlitch, 2000);

    return () => {
      clearTimeout(nextGlitchTimeout);
      runningGlitches.forEach(({ interval, timeout }) => {
        clearInterval(interval);
        clearTimeout(timeout);
      });
    };
  }, [isDecoded, text]);

  // --- TOKENIZATION & RENDERING ---
  const tokens: Array<
    | { type: "word"; chars: Array<{ char: string; index: number }> }
    | { type: "space"; index: number }
    | { type: "newline"; index: number }
  > = [];

  let currentWord: Array<{ char: string; index: number }> = [];

  const flushWord = () => {
    if (currentWord.length > 0) {
      tokens.push({ type: "word", chars: currentWord });
      currentWord = [];
    }
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === " ") {
      flushWord();
      tokens.push({ type: "space", index: i });
      continue;
    }
    if (char === "\n") {
      flushWord();
      tokens.push({ type: "newline", index: i });
      continue;
    }
    currentWord.push({ char, index: i });
  }
  flushWord();

  const renderCharacter = (index: number) => {
    const targetChar = text[index];
    let displayChar = targetChar;
    let isGlitched = false;

    if (!isDecoded) {
      displayChar = displayText[index] || targetChar;
      isGlitched = displayChar !== targetChar;
    } else {
      if (activeGlitches[index]) {
        displayChar = activeGlitches[index];
        isGlitched = true;
      }
    }

    return (
      <span key={index} className="relative inline-block">
        <span className="invisible">{targetChar}</span>
        <span
          className="absolute left-0 top-0 w-full text-center"
          style={{
            opacity: isGlitched ? 0.9 : 1,
            color: isGlitched ? "var(--color-accent)" : "inherit",
            textShadow: isGlitched
              ? "2px 0 var(--color-accent), -2px 0 rgba(255,255,255,0.8)"
              : "none",
          }}
        >
          {displayChar}
        </span>
      </span>
    );
  };

  return (
    <span className={className}>
      {tokens.map((token, tokenIndex) => {
        if (token.type === "space") {
          return <span key={`space-${token.index}`}> </span>;
        }

        if (token.type === "newline") {
          return (
            <span key={`newline-${token.index}`}>
              <br className="md:hidden" />
              <span className="hidden md:inline"> </span>
            </span>
          );
        }

        return (
          <span key={`word-${tokenIndex}`} className="inline-flex whitespace-nowrap">
            {token.chars.map(({ index }) => renderCharacter(index))}
          </span>
        );
      })}
    </span>
  );
}