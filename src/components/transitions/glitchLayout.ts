// Layout and timing for the glitch transition between the discipline pages.
// Pure and seeded, so a transition can be reasoned about without a DOM.

export const BANDS = 14;
export const MAX_BLOCKS = 3;
export const COVER_MS = 460;
export const REVEAL_MS = 680;

// Block-element glyphs, letters only, so a burst of noise never reads as a figure.
export const GLYPHS = "▖▗▘▝▚▞▙▛▜▟";
export const MAX_JITTER = 10;

export type Side = "left" | "right";
export type Block = {
  width: number;
  from: Side;
  coverDelay: number;
  coverDuration: number;
  revealDelay: number;
  revealDuration: number;
  flicker: boolean;
  // Vertical misregistration in px while the block moves, 0 for most blocks.
  jitter: number;
  // A short run of glyph noise flashed on the block, null for most blocks.
  glyphs: string | null;
};
export type Band = { height: number; blocks: Block[] };
export type Slot = { band: number; block: number };
export type GlitchLayout = { bands: Band[]; lastCover: Slot; lastReveal: Slot; tagBand: number };

function lcg(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function normalized(weights: number[]): number[] {
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => w / total);
}

function glyphRun(rnd: () => number): string {
  const length = 5 + Math.floor(rnd() * 8);
  return Array.from({ length }, () => GLYPHS[Math.floor(rnd() * GLYPHS.length)]).join("");
}

function block(width: number, rnd: () => number): Block {
  return {
    width,
    from: rnd() < 0.5 ? "left" : "right",
    coverDelay: rnd() * 0.2,
    coverDuration: 0.16 + rnd() * 0.1,
    revealDelay: rnd() * 0.3,
    revealDuration: 0.22 + rnd() * 0.12,
    flicker: rnd() < 0.3,
    jitter: rnd() < 0.4 ? Math.round((rnd() * 2 - 1) * MAX_JITTER) : 0,
    glyphs: rnd() < 0.22 ? glyphRun(rnd) : null,
  };
}

function band(rnd: () => number, height: number): Band {
  const count = 1 + Math.floor(rnd() * MAX_BLOCKS);
  const widths = normalized(Array.from({ length: count }, () => 0.5 + rnd()));
  return { height, blocks: widths.map((w) => block(w, rnd)) };
}

function lastSlot(bands: Band[], end: (b: Block) => number): Slot {
  let best: Slot = { band: 0, block: 0 };
  let max = -1;
  bands.forEach((bd, bi) =>
    bd.blocks.forEach((bl, ki) => {
      if (end(bl) > max) {
        max = end(bl);
        best = { band: bi, block: ki };
      }
    }),
  );
  return best;
}

// Horizontal bands of uneven height, each torn into one to three blocks.
// Every block has its own side, delay and duration, so the screen covers and
// clears as a scatter of tearing strips rather than a sweep. One band in the
// middle third carries the destination's tag.
export function glitchLayout(seed: number): GlitchLayout {
  const rnd = lcg(seed);
  const heights = normalized(Array.from({ length: BANDS }, () => 0.6 + rnd()));
  const bands = heights.map((h) => band(rnd, h));
  const third = Math.floor(BANDS / 3);
  return {
    bands,
    lastCover: lastSlot(bands, (b) => b.coverDelay + b.coverDuration),
    lastReveal: lastSlot(bands, (b) => b.revealDelay + b.revealDuration),
    tagBand: third + Math.floor(rnd() * third),
  };
}

// Where a band starts, as a fraction of the screen height.
export function bandTop(bands: Band[], index: number): number {
  return bands.slice(0, index).reduce((sum, b) => sum + b.height, 0);
}
