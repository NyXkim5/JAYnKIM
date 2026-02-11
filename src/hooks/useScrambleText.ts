"use client";

import { useState, useEffect, useRef } from "react";

// Korean Hangul syllables for scrambling
const KOREAN_CHARS = "가나다라마바사아자차카타파하갈날달랄말발살알잘찰칼탈팔할견결녈렬멸별설열절철켤텰펼혈";

/**
 * Hook that scrambles text from Korean characters to the target English text.
 * Each character independently resolves from Korean → random chars → final English letter.
 */
export function useScrambleText(
  target: string,
  options?: {
    delay?: number;       // ms before starting
    speed?: number;       // ms per scramble tick (lower = faster)
    staggerPerChar?: number; // ms stagger between chars resolving
  }
) {
  const { delay = 0, speed = 40, staggerPerChar = 30 } = options || {};
  const [display, setDisplay] = useState("");
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!target) {
      queueMicrotask(() => setDisplay(""));
      return;
    }

    let cancelled = false;
    const chars = target.split("");

    // Initialize with Korean chars (spaces stay as spaces)
    const current = chars.map((ch) =>
      ch === " " ? " " : KOREAN_CHARS[Math.floor(Math.random() * KOREAN_CHARS.length)]
    );
    queueMicrotask(() => setDisplay(current.join("")));

    const timeout = setTimeout(() => {
      if (cancelled) return;
      startTimeRef.current = performance.now();

      const animate = (now: number) => {
        if (cancelled) return;
        const elapsed = now - startTimeRef.current;

        let allDone = true;
        const next = chars.map((ch, i) => {
          if (ch === " ") return " ";
          const charStart = i * staggerPerChar;
          const charElapsed = elapsed - charStart;

          if (charElapsed < 0) {
            allDone = false;
            return KOREAN_CHARS[Math.floor(Math.random() * KOREAN_CHARS.length)];
          }

          // Resolve after ~6 ticks of scrambling
          const resolveAt = speed * 6;
          if (charElapsed >= resolveAt) {
            return ch;
          }

          allDone = false;
          // Still scrambling — mix Korean and Latin chars
          const progress = charElapsed / resolveAt;
          if (progress > 0.6 && Math.random() > 0.5) {
            // Start showing Latin-ish chars near the end
            const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return latin[Math.floor(Math.random() * latin.length)];
          }
          return KOREAN_CHARS[Math.floor(Math.random() * KOREAN_CHARS.length)];
        });

        setDisplay(next.join(""));

        if (!allDone) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      // Run at ~25fps for the scramble tick feel
      const tick = () => {
        if (cancelled) return;
        frameRef.current = requestAnimationFrame((now) => {
          animate(now);
          // Schedule next tick
          if (!cancelled) {
            setTimeout(tick, speed);
          }
        });
      };
      tick();
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [target, delay, speed, staggerPerChar]);

  return display;
}
