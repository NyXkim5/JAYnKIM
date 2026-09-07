"use client";

import { useEffect, useRef, useState } from "react";

// Digits, symbols, and Korean jamo. Compact glyphs that read as one voice in
// a handwriting face, so the sweep looks composed instead of noisy.
export const WARP_POOL = "0123456789#%&*+=/<>[]{}~^ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ";
export const WARP_DURATION = 700;
const TICK = 60;
const LEAD = 90;
const WIDTH_PHASE = 0.4;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// One frame of the warp from `from` to `to` at `elapsed` ms. Pure.
// Slot count eases between the two lengths; each slot cycles the pool on a
// fixed tick, then resolves in order from left to right.
export function warpFrame(from: string, to: string, elapsed: number, pool = WARP_POOL): string {
  if (elapsed >= WARP_DURATION) return to;
  const slots = Math.round(from.length + (to.length - from.length) * clamp01(elapsed / (WARP_DURATION * WIDTH_PHASE)));
  const stagger = (WARP_DURATION - LEAD) / Math.max(1, to.length);
  const tick = Math.floor(elapsed / TICK);
  let out = "";
  for (let i = 0; i < slots; i++) {
    const final = to[i];
    if (final === " ") {
      out += " ";
    } else if (final !== undefined && elapsed >= LEAD + i * stagger) {
      out += final;
    } else {
      out += pool[(i * 7 + tick) % pool.length];
    }
  }
  return out;
}

// Returns the displayed text and whether a warp is in flight.
export function useWarpText(target: string, reduced: boolean): { text: string; active: boolean } {
  const [text, setText] = useState(target);
  const [active, setActive] = useState(false);
  const shownRef = useRef(target);

  useEffect(() => {
    if (reduced) {
      shownRef.current = target;
      queueMicrotask(() => setText(target));
      return;
    }
    const from = shownRef.current;
    const start = performance.now();
    let raf = 0;
    let lastTick = -1;
    queueMicrotask(() => setActive(true));
    const step = (now: number) => {
      const elapsed = now - start;
      const tick = Math.floor(elapsed / TICK);
      if (tick !== lastTick) {
        lastTick = tick;
        setText(warpFrame(from, target, elapsed));
      }
      if (elapsed < WARP_DURATION) {
        raf = requestAnimationFrame(step);
        return;
      }
      shownRef.current = target;
      setText(target);
      setActive(false);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced]);

  return { text, active };
}
