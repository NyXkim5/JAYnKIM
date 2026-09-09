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

// Only Jay's own lines: the sentences of his Stealth statement and his
// studio quote. Nothing here was written for him.
export const SAYINGS: readonly string[] = [
  "Make every battlefield an American battlefield.",
  "Manifest destiny did not stop at California.",
  "It stopped where we stopped looking.",
  "Irregular thinking leads to irregular designs.",
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

// The statement sits in the middle of the screen. Nothing the grid picks may
// land on it: not the point, not its marker, not the label beside it.
export const CENTER_W = 720;
export const CENTER_H = 280;
export const LABEL_W = 280;
export const LABEL_H = 48;
export const LABEL_GAP = 18;
export const LABEL_RISE = 8;
export const MARKER_MARGIN = 24;

type Box = { x0: number; y0: number; x1: number; y1: number };

function centerBox(width: number, height: number): Box {
  const w = Math.min(CENTER_W, width);
  return { x0: width / 2 - w / 2, y0: height / 2 - CENTER_H / 2, x1: width / 2 + w / 2, y1: height / 2 + CENTER_H / 2 };
}

// Where the label sits for a point: to the right of it, or to the left when
// the point is in the right half of the screen. The component uses the same
// offsets, so this box is the real footprint.
export function labelBox(x: number, y: number, width: number): Box {
  const x0 = x > width / 2 ? x - LABEL_GAP - LABEL_W : x + LABEL_GAP;
  return { x0, y0: y - LABEL_RISE, x1: x0 + LABEL_W, y1: y - LABEL_RISE + LABEL_H };
}

function overlaps(a: Box, b: Box): boolean {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
}

export function clearOfCenter(x: number, y: number, width: number, height: number): boolean {
  const center = centerBox(width, height);
  const marker = { x0: x - MARKER_MARGIN, y0: y - MARKER_MARGIN, x1: x + MARKER_MARGIN, y1: y + MARKER_MARGIN };
  return !overlaps(marker, center) && !overlaps(labelBox(x, y, width), center);
}

function candidate(width: number, height: number, random: () => number): [number, number] {
  return [width * (0.14 + 0.72 * random()), height * (0.16 + 0.68 * random())];
}

// Draws points until one keeps clear of the statement, then falls back to the
// top left band, which is always clear. The saying never repeats the last one.
export function chooseFocus(width: number, height: number, random: () => number, previous?: Focus): Focus {
  const pool = SAYINGS.filter((s) => s !== previous?.saying);
  const saying = pool[Math.floor(random() * pool.length)] ?? SAYINGS[0];
  for (let i = 0; i < 60; i++) {
    const [x, y] = candidate(width, height, random);
    if (clearOfCenter(x, y, width, height)) return { x, y, saying };
  }
  return { x: width * 0.2, y: height * 0.14, saying };
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
