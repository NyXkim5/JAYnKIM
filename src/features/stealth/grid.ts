// Pure timing and geometry for the Stealth grid. The canvas component only
// draws what these functions return, so the cycle can be tested without a DOM.

export type Phase = "breathe" | "converge" | "hold" | "release";

export const ORDER: readonly Phase[] = ["breathe", "converge", "hold", "release"];
export const DURATIONS: Record<Phase, number> = { breathe: 4200, converge: 1500, hold: 2800, release: 1100 };
export const CYCLE_MS = ORDER.reduce((sum, p) => sum + DURATIONS[p], 0);
export const SPACING = 48;

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

// How hard the grid is pulled toward the focus: nothing while breathing,
// rising through converge, full during hold, letting go through release.
export function pull(phase: Phase, t: number): number {
  if (phase === "breathe") return 0;
  if (phase === "converge") return easeOut(t);
  if (phase === "hold") return 1;
  return 1 - easeOut(t);
}

// Move a grid point toward the focus. Close points move almost all the way,
// far points barely, so lines bend in around the focus instead of sliding.
export function warp(x: number, y: number, focus: Focus, k: number, radius: number): [number, number] {
  if (k <= 0) return [x, y];
  const dx = focus.x - x;
  const dy = focus.y - y;
  const d2 = dx * dx + dy * dy;
  const f = k * 0.92 * Math.exp(-d2 / (2 * radius * radius));
  return [x + dx * f, y + dy * f];
}

// The resting grid breathes: line strength and scale drift with one slow wave.
export function breath(t: number): { alpha: number; scale: number } {
  const wave = Math.sin(t * Math.PI * 2);
  return { alpha: 0.8 + 0.2 * wave, scale: 1 + 0.012 * wave };
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
