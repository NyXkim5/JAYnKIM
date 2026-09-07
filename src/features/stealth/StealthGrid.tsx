"use client";

import { useEffect, useRef, useState } from "react";
import {
  breath,
  chooseFocus,
  coordsLabel,
  cycleIndex,
  dimAlpha,
  DURATIONS,
  focusAlpha,
  focusPulse,
  LABEL_W,
  labelBox,
  MAJOR,
  phaseAt,
  pull,
  SPACING,
  stageFor,
  type Focus,
  type Phase,
  type Stage,
} from "./grid";

const PINK = "#ff69b4";
type Overlay = { focus: Focus; stage: Stage };

// The same lattice as the Projects backdrop: lines from the top-left corner on
// the shared cell, snapped to the half pixel, every fourth line drawn a second
// time so it reads as the major line there too.
function strokeGrid(ctx: CanvasRenderingContext2D, w: number, h: number, style: string | CanvasGradient) {
  ctx.strokeStyle = style;
  for (const pass of ["minor", "major"] as const) {
    ctx.beginPath();
    for (let c = 0; c * SPACING <= w; c++) {
      if ((c % MAJOR === 0) !== (pass === "major")) continue;
      ctx.moveTo(c * SPACING + 0.5, 0);
      ctx.lineTo(c * SPACING + 0.5, h);
    }
    for (let r = 0; r * SPACING <= h; r++) {
      if ((r % MAJOR === 0) !== (pass === "major")) continue;
      ctx.moveTo(0, r * SPACING + 0.5);
      ctx.lineTo(w, r * SPACING + 0.5);
    }
    ctx.stroke();
    if (pass === "major") ctx.stroke();
  }
}

// Two passes over the same straight lines: a dim pass for the whole grid, then
// a bright pass whose stroke is a radial gradient centred on the focus, so the
// lines near the point glow and breathe while everything else stays dim.
// Nothing moves, so nothing stretches.
function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, focus: Focus | null, k: number, phase: Phase, t: number, elapsed: number) {
  const rest = phase === "breathe" ? breath(t) : 1;
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1;
  strokeGrid(ctx, w, h, `rgba(255, 255, 255, ${dimAlpha(k, rest)})`);
  if (!focus || k <= 0) return;
  const radius = Math.min(w, h) * 0.32;
  const a = focusAlpha(k, focusPulse(elapsed));
  const glow = ctx.createRadialGradient(focus.x, focus.y, 0, focus.x, focus.y, radius);
  glow.addColorStop(0, `rgba(255, 255, 255, ${a})`);
  glow.addColorStop(0.55, `rgba(255, 255, 255, ${a * 0.35})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  strokeGrid(ctx, w, h, glow);
  drawMarker(ctx, focus, k);
}

function drawMarker(ctx: CanvasRenderingContext2D, focus: Focus, k: number) {
  ctx.strokeStyle = `rgba(255, 105, 180, ${0.9 * k})`;
  ctx.fillStyle = PINK;
  ctx.beginPath();
  ctx.arc(focus.x, focus.y, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(focus.x, focus.y, 10 + 6 * (1 - k), 0, Math.PI * 2);
  ctx.stroke();
}

// The grid breathes, then picks a point. The breath gathers there, the rest of
// the grid dims, the point gets its coordinates and one line about warfare,
// then it all lets go and the grid breathes again before choosing the next
// point. With reduced motion the grid is drawn once, still.
// `quiet` keeps the grid breathing and never picks a point, for screens that
// only want the backdrop.
export function StealthGrid({ quiet = false }: { quiet?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = { w: 0, h: 0 };
    let focus: Focus | null = null;
    let lastCycle = -1;
    // undefined means "not yet compared this cycle", so a new point always
    // refreshes the label even if the stage name happens to repeat.
    let lastStage: Stage | null | undefined = undefined;
    let frame = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = { w: window.innerWidth, h: window.innerHeight };
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Everything derives from the clock. A new point is chosen once per cycle
    // and the label follows the phase, so skipped frames cannot strand a state.
    const tick = (now: number) => {
      const elapsed = now - start;
      if (quiet) {
        drawGrid(ctx, size.w, size.h, null, 0, "breathe", (elapsed % DURATIONS.breathe) / DURATIONS.breathe, elapsed);
        frame = requestAnimationFrame(tick);
        return;
      }
      const { phase, t } = phaseAt(elapsed);
      const cycle = cycleIndex(elapsed);
      if (cycle !== lastCycle) {
        focus = chooseFocus(size.w, size.h, Math.random, focus ?? undefined);
        lastCycle = cycle;
        lastStage = undefined;
      }
      const stage = stageFor(phase);
      if (stage !== lastStage) {
        setOverlay(stage && focus ? { focus, stage } : null);
        lastStage = stage;
      }
      drawGrid(ctx, size.w, size.h, focus, pull(phase, t), phase, t, elapsed);
      frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      drawGrid(ctx, size.w, size.h, null, 0, "hold", 0, 0);
    } else {
      frame = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [quiet]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {overlay && <FocusLabel overlay={overlay} />}
    </div>
  );
}

// Coordinates appear as the focus gathers, the saying once it has settled,
// and both fade as the grid lets go. Placed beside the point, flipped to the
// left when the point sits in the right half of the screen.
function FocusLabel({ overlay }: { overlay: Overlay }) {
  const { focus, stage } = overlay;
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const box = labelBox(focus.x, focus.y, width);
  const right = focus.x > width / 2;
  const shown = stage === "fading" ? "opacity-0" : "opacity-100";
  return (
    <div
      data-focus-label
      className={`absolute font-mono transition-opacity duration-700 ${shown} ${right ? "text-right" : ""}`}
      style={{ left: box.x0, top: box.y0, width: LABEL_W }}
    >
      <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: PINK }}>
        {coordsLabel(focus)}
      </p>
      <p className={`mt-1 text-[12px] leading-relaxed text-white/75 transition-opacity duration-500 ${stage === "coords" ? "opacity-0" : "opacity-100"}`}>
        {focus.saying}
      </p>
    </div>
  );
}
