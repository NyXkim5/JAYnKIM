"use client";

import { useRef, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────
type EffectProps = {
  phase: "cover" | "reveal";
  onCoverDone: () => void;
  onRevealDone: () => void;
};

type OverlayProps = {
  target: string;
  phase: "cover" | "reveal";
  onCoverDone: () => void;
  onRevealDone: () => void;
};

// ─── Helpers ────────────────────────────────────────────────────────

/** Tracks cover/reveal completion so the right callback fires. */
function usePhaseCallback(
  onCoverDone: () => void,
  onRevealDone: () => void
) {
  const coverCalledRef = useRef(false);
  return useCallback(() => {
    if (!coverCalledRef.current) {
      coverCalledRef.current = true;
      onCoverDone();
    } else {
      onRevealDone();
    }
  }, [onCoverDone, onRevealDone]);
}

const EASE = [0.76, 0, 0.24, 1] as const;
const BG = "#0a0a0a";

// ─── Route → Effect map ─────────────────────────────────────────────

function getEffect(route: string): React.ComponentType<EffectProps> {
  if (route === "/") return HorizontalBlinds;
  if (route.startsWith("/projects")) return ColumnWipe;
  if (route === "/lab") return PixelGrid;
  if (route === "/contact") return AsciiScramble;
  if (route.startsWith("/writing")) return LineWipe;
  if (route === "/matcha") return BlocksScatter;
  if (route === "/music") return WaveColumns;
  return ColumnWipe;
}

// ═════════════════════════════════════════════════════════════════════
// EFFECTS — All use clipPath (proven to work with framer-motion)
// ═════════════════════════════════════════════════════════════════════

// 1. Horizontal Blinds — Home (/)
// 8 horizontal strips wipe in from alternating sides
function HorizontalBlinds({ phase, onCoverDone, onRevealDone }: EffectProps) {
  const count = 8;
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col pointer-events-auto">
      {Array.from({ length: count }).map((_, i) => {
        const fromLeft = i % 2 === 0;
        return (
          <motion.div
            key={i}
            style={{ flex: 1, background: BG }}
            initial={{
              clipPath: fromLeft
                ? "inset(0% 100% 0% 0%)"
                : "inset(0% 0% 0% 100%)",
            }}
            animate={{
              clipPath: isReveal
                ? fromLeft
                  ? "inset(0% 0% 0% 100%)"
                  : "inset(0% 100% 0% 0%)"
                : "inset(0% 0% 0% 0%)",
            }}
            transition={{
              duration: 0.45,
              delay: i * 0.04,
              ease: EASE,
            }}
            onAnimationComplete={() => {
              if (i === count - 1) onDone();
            }}
          />
        );
      })}
    </div>
  );
}

// 2. Column Wipe — Work (/projects)
// 6 vertical columns wipe down staggered left-to-right
function ColumnWipe({ phase, onCoverDone, onRevealDone }: EffectProps) {
  const count = 6;
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-row pointer-events-auto">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          style={{ flex: 1, background: BG }}
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{
            clipPath: isReveal
              ? "inset(100% 0% 0% 0%)"
              : "inset(0% 0% 0% 0%)",
          }}
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: EASE,
          }}
          onAnimationComplete={() => {
            if (i === count - 1) onDone();
          }}
        />
      ))}
    </div>
  );
}

// 3. Pixel Grid — Lab (/lab)
// 8x5 grid of squares appear/disappear in random order via circle clips
function PixelGrid({ phase, onCoverDone, onRevealDone }: EffectProps) {
  const cols = 8;
  const rows = 5;
  const total = cols * rows;
  const maxDelay = 0.5;
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  // Deterministic shuffle (Park-Miller PRNG + Fisher-Yates)
  const order = useMemo(() => {
    const arr = Array.from({ length: total }, (_, i) => i);
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [total]);

  const lastCell = order[total - 1];

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const delay = (order.indexOf(i) / total) * maxDelay;
        return (
          <motion.div
            key={i}
            style={{ background: BG }}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{
              clipPath: isReveal
                ? "circle(0% at 50% 50%)"
                : "circle(100% at 50% 50%)",
            }}
            transition={{ duration: 0.3, delay, ease: EASE }}
            onAnimationComplete={() => {
              if (i === lastCell) onDone();
            }}
          />
        );
      })}
    </div>
  );
}

// 4. ASCII Scramble — Contact (/contact)
// Circle clip-path expands/contracts over rapidly scrambling monospace characters
function AsciiScramble({ phase, onCoverDone, onRevealDone }: EffectProps) {
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{ background: BG }}
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{
        clipPath: isReveal
          ? "circle(0% at 50% 50%)"
          : "circle(150% at 50% 50%)",
      }}
      transition={{ duration: isReveal ? 0.5 : 0.6, ease: EASE }}
      onAnimationComplete={onDone}
    />
  );
}

// 5. Line Wipe — Writing (/writing)
// 12 horizontal lines sweep in from left, staggered like typewriter
function LineWipe({ phase, onCoverDone, onRevealDone }: EffectProps) {
  const count = 12;
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col pointer-events-auto">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          style={{ flex: 1, background: BG }}
          initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
          animate={{
            clipPath: isReveal
              ? "inset(0% 0% 0% 100%)"
              : "inset(0% 0% 0% 0%)",
          }}
          transition={{
            duration: 0.3,
            delay: i * 0.03,
            ease: EASE,
          }}
          onAnimationComplete={() => {
            if (i === count - 1) onDone();
          }}
        />
      ))}
    </div>
  );
}

// 6. Blocks Scatter — Recs (/matcha)
// 4x3 grid blocks with diamond clip-path expand/contract in staggered order
function BlocksScatter({ phase, onCoverDone, onRevealDone }: EffectProps) {
  const cols = 4;
  const rows = 3;
  const total = cols * rows;
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  // Spiral order: center blocks first, edges last
  const delays = useMemo(() => {
    return Array.from({ length: total }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = (cols - 1) / 2;
      const cy = (rows - 1) / 2;
      const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
      const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
      return (dist / maxDist) * 0.25;
    });
  }, [total, cols, rows]);

  const maxDelayIdx = delays.indexOf(Math.max(...delays));

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          style={{ background: BG }}
          initial={{
            clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
          }}
          animate={{
            clipPath: isReveal
              ? "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)"
              : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
          transition={{
            duration: 0.4,
            delay: delays[i],
            ease: EASE,
          }}
          onAnimationComplete={() => {
            if (i === maxDelayIdx) onDone();
          }}
        />
      ))}
    </div>
  );
}

// 7. Wave Columns — Music (/music)
// 10 columns grow from bottom with sinusoidal timing (center first)
function WaveColumns({ phase, onCoverDone, onRevealDone }: EffectProps) {
  const count = 10;
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-row pointer-events-auto">
      {Array.from({ length: count }).map((_, i) => {
        const t = i / (count - 1);
        // Center columns animate first, edges last
        const delay = (1 - Math.abs(Math.sin(t * Math.PI))) * 0.15;

        return (
          <motion.div
            key={i}
            style={{ flex: 1, background: BG }}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{
              clipPath: isReveal
                ? "inset(0% 0% 100% 0%)"
                : "inset(0% 0% 0% 0%)",
            }}
            transition={{ duration: 0.4, delay, ease: EASE }}
            onAnimationComplete={() => {
              if (i === count - 1) onDone();
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Main Overlay ───────────────────────────────────────────────────

export function TransitionOverlay({
  target,
  phase,
  onCoverDone,
  onRevealDone,
}: OverlayProps) {
  const Effect = getEffect(target);
  return (
    <Effect
      phase={phase}
      onCoverDone={onCoverDone}
      onRevealDone={onRevealDone}
    />
  );
}
