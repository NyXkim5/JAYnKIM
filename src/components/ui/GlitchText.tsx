"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Text that occasionally glitches — random characters replace
 * parts of the text for a frame, then snap back. Industrial feel.
 */
export function GlitchText({
  text,
  className = "",
  interval = 4000,
}: {
  text: string;
  className?: string;
  interval?: number;
}) {
  const [display, setDisplay] = useState(text);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const glitchChars = "█▓▒░─│┌┐└┘├┤┬┴┼";

    const doGlitch = () => {
      // Pick 1-3 random positions to glitch
      const count = 1 + Math.floor(Math.random() * 3);
      const positions = new Set<number>();
      while (positions.size < count && positions.size < text.length) {
        positions.add(Math.floor(Math.random() * text.length));
      }

      const glitched = text
        .split("")
        .map((ch, i) =>
          positions.has(i)
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : ch
        )
        .join("");

      setDisplay(glitched);

      // Snap back after a few frames
      setTimeout(() => {
        setDisplay(text);
      }, 80 + Math.random() * 60);
    };

    const schedule = () => {
      timerRef.current = setTimeout(() => {
        doGlitch();
        schedule();
      }, interval + Math.random() * 2000);
    };

    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, interval]);

  return <span className={className}>{display}</span>;
}
