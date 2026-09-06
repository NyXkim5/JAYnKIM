// The last few letters of a tab label flicker through symbols on hover. Pure.

export const GLITCH_TAIL = 3;
export const GLITCH_TICKS = 6;
export const GLITCH_TICK_MS = 55;
const POOL = "#%&/<>0123456789";

// Replaces the last GLITCH_TAIL characters with pool glyphs for this tick.
export function glitchTail(text: string, tick: number): string {
  if (text.length <= GLITCH_TAIL) return text;
  const head = text.slice(0, -GLITCH_TAIL);
  let tail = "";
  for (let i = 0; i < GLITCH_TAIL; i++) {
    tail += POOL[(i * 5 + tick * 3) % POOL.length];
  }
  return head + tail;
}
