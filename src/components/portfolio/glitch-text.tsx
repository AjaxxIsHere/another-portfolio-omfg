"use client";

import { useEffect, useState } from "react";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export function GlitchText({ text, className }: { text: string; className?: string }) {
  const [glitchIndices, setGlitchIndices] = useState<number[]>([]);
  const [glitchChars, setGlitchChars] = useState<Record<number, string>>({});

  useEffect(() => {
    const minDelay = 1200; // Slower frequency
    const maxDelay = 3500;

    let timeoutId: NodeJS.Timeout;

    const glitchCycle = () => {
      if (Math.random() > 0.15) {
        const validIndices = [];
        for (let i = 0; i < text.length; i++) {
          if (text[i] !== " " && text[i] !== "\n") validIndices.push(i);
        }

        if (validIndices.length > 0) {
          // Glitch 1 to 3 characters simultaneously
          const numGlitches = Math.floor(Math.random() * 3) + 1;
          const selectedIndices: number[] = [];
          const newGlitchChars: Record<number, string> = {};

          for (let k = 0; k < numGlitches; k++) {
            const validIdx = validIndices[Math.floor(Math.random() * validIndices.length)];
            if (!selectedIndices.includes(validIdx)) {
              selectedIndices.push(validIdx);
              newGlitchChars[validIdx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            }
          }

          setGlitchIndices(selectedIndices);
          setGlitchChars(newGlitchChars);

          setTimeout(() => {
            setGlitchIndices([]);
          }, 150 + Math.random() * 100); // Slightly longer visible glitch
        }
      }

      const nextDelay = minDelay + Math.random() * (maxDelay - minDelay);
      timeoutId = setTimeout(glitchCycle, nextDelay);
    };

    timeoutId = setTimeout(glitchCycle, minDelay);

    return () => clearTimeout(timeoutId);
  }, [text]);

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

  const renderCharacter = (char: string, index: number) => {
    const isGlitched = glitchIndices.includes(index);

    return (
      <span key={index} className="relative inline-block">
        <span className="invisible">{char}</span>
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
          {isGlitched ? glitchChars[index] : char}
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
            {token.chars.map(({ char, index }) => renderCharacter(char, index))}
          </span>
        );
      })}
    </span>
  );
}
