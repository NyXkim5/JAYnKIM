"use client";

import { useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Ground } from "@/features/persona/personas";
import { bandTop, COVER_MS, glitchLayout, REVEAL_MS, type Band, type Block } from "./glitchLayout";

export type RevealPhase = "cover" | "reveal";

type Props = { phase: RevealPhase; ground: Ground; seed: number; onDone: () => void; label?: string };

const PINK = "#ff69b4";
// Sharp in, sharp out: a tear, not a slide.
const TEAR = [0.9, 0, 0.1, 1] as const;

function offscreen(block: Block): string {
  return block.from === "left" ? "-102%" : "102%";
}

// Cover: the block snaps in from its side, landing a few pixels out of
// register before it settles. Reveal: it tears back out, and a flickering
// block stutters before it goes.
function motionFor(block: Block, cover: boolean) {
  if (cover) {
    return {
      initial: { x: offscreen(block), y: block.jitter, opacity: 1 },
      animate: { x: "0%", y: 0, opacity: 1 },
      transition: {
        delay: block.coverDelay,
        duration: block.coverDuration,
        ease: TEAR,
        y: { delay: block.coverDelay + block.coverDuration * 0.7, duration: 0.12, ease: TEAR },
      },
    };
  }
  const opacity = block.flicker ? [1, 0.2, 1, 0.15, 1, 1] : [1, 1];
  return {
    initial: { x: "0%", y: 0, opacity: 1 },
    animate: { x: offscreen(block), y: -block.jitter, opacity },
    transition: {
      delay: block.revealDelay,
      duration: block.revealDuration,
      ease: TEAR,
      opacity: { delay: Math.max(0, block.revealDelay - 0.12), duration: 0.12 + block.revealDuration, ease: "linear" as const },
    },
  };
}

function Noise({ block, cover, ink }: { block: Block; cover: boolean; ink: string }) {
  if (!block.glyphs) return null;
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap px-3 font-mono text-[10px] tracking-[0.35em]"
      style={{ color: ink }}
      initial={{ opacity: 0 }}
      animate={{ opacity: cover ? [0, 1, 0.2, 1, 0] : [0, 0.8, 0] }}
      transition={{ delay: cover ? block.coverDelay : block.revealDelay, duration: cover ? block.coverDuration + 0.2 : block.revealDuration, ease: "linear" }}
    >
      {block.glyphs}
    </motion.span>
  );
}

function Strip({ block, cover, fill, ink, last, onDone }: { block: Block; cover: boolean; fill: string; ink: string; last: boolean; onDone: () => void }) {
  const m = motionFor(block, cover);
  // The edge that leads the tear carries a pink hairline while the block moves.
  const edge = block.from === "left" ? { right: 0 } : { left: 0 };
  return (
    <motion.div
      className="relative h-full"
      style={{ width: `${block.width * 100}%`, backgroundColor: fill }}
      initial={m.initial}
      animate={m.animate}
      transition={m.transition}
      onAnimationComplete={last ? onDone : undefined}
    >
      <Noise block={block} cover={cover} ink={ink} />
      <motion.span
        aria-hidden
        className="absolute inset-y-0 w-[2px]"
        style={{ ...edge, backgroundColor: PINK }}
        initial={{ opacity: cover ? 1 : 0 }}
        animate={{ opacity: cover ? [1, 1, 0] : [0, 1, 1] }}
        transition={{ delay: cover ? block.coverDelay : block.revealDelay, duration: cover ? block.coverDuration + 0.12 : block.revealDuration, ease: "linear" }}
      />
    </motion.div>
  );
}

// The destination's name, bracketed, flashing on one band while the screen is
// covered, then gone with the reveal.
function Tag({ bands, band, label, cover, ink, budget }: { bands: Band[]; band: number; label: string; cover: boolean; ink: string; budget: number }) {
  return (
    <motion.div
      aria-hidden
      data-transition-tag
      className="pointer-events-none absolute inset-x-0 flex items-center justify-center font-mono text-[12px] uppercase tracking-[0.35em]"
      style={{ top: `${bandTop(bands, band) * 100}%`, height: `${bands[band].height * 100}%` }}
      initial={{ opacity: cover ? 0 : 1 }}
      animate={{ opacity: cover ? [0, 1, 0, 1, 1] : [1, 1, 0] }}
      transition={{ duration: budget / 1000, ease: "linear" }}
    >
      <span style={{ color: PINK }}>[</span>
      <span style={{ color: ink }}>{label}</span>
      <span style={{ color: PINK }}>]</span>
    </motion.div>
  );
}

// Full-screen glitch between the discipline pages. Cover tears strips of the
// next page's ground in over the old view, in a scatter with pink leading
// edges, glyph noise on a few blocks and the destination's tag flashing on one
// band. Reveal tears them out again, some stuttering, so the new view shows
// through block by block. Reduced motion gets a plain crossfade.
export function GlitchReveal({ phase, ground, seed, onDone, label }: Props) {
  const layout = useMemo(() => glitchLayout(seed), [seed]);
  const reduced = useReducedMotion() ?? false;
  const cover = phase === "cover";
  const black = ground === "black";
  const fill = black ? "#0a0a0a" : "#ffffff";
  const ink = black ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.85)";
  const budget = cover ? COVER_MS : REVEAL_MS;

  // Safety net: if the frame loop stalls (background tab), finish the phase
  // on a timer so the overlay can never stay stuck over the page.
  useEffect(() => {
    const id = setTimeout(onDone, budget + 400);
    return () => clearTimeout(id);
  }, [phase, budget, onDone]);

  if (reduced) {
    return (
      <motion.div
        key={phase}
        aria-hidden="true"
        className="pointer-events-auto fixed inset-0 z-[9999]"
        style={{ backgroundColor: fill }}
        initial={{ opacity: cover ? 0 : 1 }}
        animate={{ opacity: cover ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        onAnimationComplete={onDone}
      />
    );
  }

  const last = cover ? layout.lastCover : layout.lastReveal;
  return (
    <div key={phase} aria-hidden="true" className="pointer-events-auto fixed inset-0 z-[9999] overflow-hidden">
      <div className="flex h-full w-full flex-col">
        {layout.bands.map((band, bi) => (
          <div key={bi} className="flex w-full" style={{ height: `${band.height * 100}%` }}>
            {band.blocks.map((block, ki) => (
              <Strip key={ki} block={block} cover={cover} fill={fill} ink={ink} last={bi === last.band && ki === last.block} onDone={onDone} />
            ))}
          </div>
        ))}
      </div>
      {label && <Tag bands={layout.bands} band={layout.tagBand} label={label} cover={cover} ink={ink} budget={budget} />}
    </div>
  );
}
