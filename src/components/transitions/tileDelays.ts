// Timing for the tile-grid transition between landing views. Pure.

export const GRID_COLS = 12;
export const GRID_ROWS = 8;
export const COVER_SPREAD_MS = 320;
export const COVER_FADE_MS = 180;
export const REVEAL_SPREAD_MS = 900;
export const REVEAL_FADE_MS = 360;

function lcg(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// One delay per tile in 0..1, row-major. A diagonal sweep from the top-left
// with a little jitter, so the grid reads as a wave rather than a checkerboard.
export function tileDelays(cols: number, rows: number, seed: number): number[] {
  const rnd = lcg(seed);
  const span = cols + rows - 2 || 1;
  const out: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const diagonal = (c + r) / span;
      out.push(Math.min(1, Math.max(0, diagonal * 0.8 + rnd() * 0.2)));
    }
  }
  return out;
}
