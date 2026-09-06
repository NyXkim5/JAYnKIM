"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import type { Ground } from "@/features/persona/personas";
import {
  COVER_FADE_MS,
  COVER_SPREAD_MS,
  GRID_COLS,
  GRID_ROWS,
  REVEAL_FADE_MS,
  REVEAL_SPREAD_MS,
  tileDelays,
} from "./tileDelays";

export type RevealPhase = "cover" | "reveal";

type Props = { phase: RevealPhase; ground: Ground; seed: number; onDone: () => void };

// A full-screen grid of tiles. Cover fades them in over the old view; reveal
// fades them out one by one so the new view shows through box by box.
export function GridReveal({ phase, ground, seed, onDone }: Props) {
  const delays = useMemo(() => tileDelays(GRID_COLS, GRID_ROWS, seed), [seed]);
  const last = delays.indexOf(Math.max(...delays));
  const cover = phase === "cover";
  const spread = (cover ? COVER_SPREAD_MS : REVEAL_SPREAD_MS) / 1000;
  const fade = (cover ? COVER_FADE_MS : REVEAL_FADE_MS) / 1000;
  const black = ground === "black";
  const fill = black ? "#0a0a0a" : "#ffffff";
  const line = black ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  // Safety net: if the frame loop stalls (background tab), finish the phase
  // on a timer so the overlay can never stay stuck over the page.
  useEffect(() => {
    const id = setTimeout(onDone, (spread + fade) * 1000 + 400);
    return () => clearTimeout(id);
  }, [phase, spread, fade, onDone]);

  return (
    <div
      key={phase}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 grid"
      style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
    >
      {delays.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: cover ? 0 : 1 }}
          animate={{ opacity: cover ? 1 : 0 }}
          transition={{ delay: d * spread, duration: fade, ease: "easeInOut" }}
          onAnimationComplete={i === last ? onDone : undefined}
          style={{ backgroundColor: fill, boxShadow: `inset 0 0 0 1px ${line}` }}
        />
      ))}
    </div>
  );
}
