// Pure timing and brightness for the Stealth grid. The canvas component only
// draws what these functions return, so the cycle can be tested without a DOM.

import { CELL, MAJOR_EVERY } from "@/features/projects/gridBackdrop";

export type Phase = "breathe" | "converge" | "hold" | "release";

export const ORDER: readonly Phase[] = ["breathe", "converge", "hold", "release"];
export const DURATIONS: Record<Phase, number> = { breathe: 4200, converge: 1500, hold: 2800, release: 1100 };
export const CYCLE_MS = ORDER.reduce((sum, p) => sum + DURATIONS[p], 0);
// One grid for the whole site: the same cell, origin and major-line cadence
// as the Projects backdrop, so the pages never disagree about spacing.
export const SPACING = CELL;
export const MAJOR = MAJOR_EVERY;
export const BASE_ALPHA = 0.11;

// Short lines about warfare. Jay's voice, no figures, nothing attributed.
export const SAYINGS: readonly string[] = [
  "Whoever sees first decides first.",
  "Cheap sensors, expensive decisions.",
  "A swarm is a question. Coverage is the answer.",
  "Terrain still votes.",
  "Range is a budget. Spend it on surprise.",
  "The map is the first weapon.",
  "Every second of warning is a mile of options.",
  "Detection without a decision is a diary.",
];

export type Focus = { x: number; y: number; saying: string };

export function phaseAt(elapsed: number): { phase: Phase; t: number } {
  let rest = ((elapsed % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
  for (const phase of ORDER) {
    if (rest < DURATIONS[phase]) return { phase, t: rest / DURATIONS[phase] };
    rest -= DURATIONS[phase];
  }
  return { phase: "breathe", t: 0 };
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// How far the grid's attention has moved to the focus: nothing while
// breathing, rising through converge, full during hold, letting go through release.
export function pull(phase: Phase, t: number): number {
  if (phase === "breathe") return 0;
  if (phase === "converge") return easeOut(t);
  if (phase === "hold") return 1;
  return 1 - easeOut(t);
}

// The resting grid takes one breath per breathe phase: full strength at both
// ends, dipping to 70 percent in the middle, so the phase joins cleanly.
export function breath(t: number): number {
  return 1 - 0.3 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
}

// Everything outside the focus dims as the focus takes hold, down to about a
// fifth of resting strength.
export function dimAlpha(k: number, rest: number): number {
  return BASE_ALPHA * rest * (1 - 0.78 * k);
}

// The focused region breathes faster than the resting grid, about one breath
// every 1.3 seconds.
export function focusPulse(elapsed: number): number {
  return 0.8 + 0.2 * Math.sin((elapsed / 1300) * Math.PI * 2);
}

// Line strength at the centre of the focus. It climbs with the pull and
// carries the pulse, capped well below solid white so the text stays on top.
export function focusAlpha(k: number, pulse: number): number {
  return Math.min(0.85, BASE_ALPHA * (1 + 5 * k) * pulse);
}

export function chooseFocus(width: number, height: number, random: () => number, previous?: Focus): Focus {
  const x = width * (0.18 + 0.64 * random());
  const y = height * (0.2 + 0.6 * random());
  const pool = SAYINGS.filter((s) => s !== previous?.saying);
  return { x, y, saying: pool[Math.floor(random() * pool.length)] ?? SAYINGS[0] };
}

export type Stage = "coords" | "saying" | "fading";

// What the label shows in each phase. Derived from time, not from having seen
// the previous phase, so a tab that skips frames still lands in the right state.
export function stageFor(phase: Phase): Stage | null {
  if (phase === "converge") return "coords";
  if (phase === "hold") return "saying";
  if (phase === "release") return "fading";
  return null;
}

export function cycleIndex(elapsed: number): number {
  return Math.floor(elapsed / CYCLE_MS);
}

export function coordsLabel(focus: Focus): string {
  const pad = (n: number) => String(Math.round(n)).padStart(4, "0");
  return `${pad(focus.x)} · ${pad(focus.y)}`;
}
