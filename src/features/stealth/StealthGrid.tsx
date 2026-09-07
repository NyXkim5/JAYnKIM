"use client";

import { useEffect, useRef, useState } from "react";
import { breath, chooseFocus, coordsLabel, cycleIndex, phaseAt, pull, SPACING, stageFor, warp, type Focus, type Phase, type Stage } from "./grid";

const PINK = "#ff69b4";
const SAMPLES = 48;
type Overlay = { focus: Focus; stage: Stage };

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, focus: Focus | null, k: number, phase: Phase, t: number) {
  const { alpha, scale } = phase === "breathe" ? breath(t) : { alpha: 1, scale: 1 };
  const radius = Math.min(w, h) * 0.34;
  const at = (x: number, y: number): [number, number] => {
    const sx = w / 2 + (x - w / 2) * scale;
    const sy = h / 2 + (y - h / 2) * scale;
    return focus ? warp(sx, sy, focus, k, radius) : [sx, sy];
  };
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.11 * alpha})`;
  const line = (points: [number, number][]) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
  };
  for (let x = SPACING; x < w; x += SPACING) {
    line(Array.from({ length: SAMPLES + 1 }, (_, i) => at(x, (h * i) / SAMPLES)));
  }
  for (let y = SPACING; y < h; y += SPACING) {
    line(Array.from({ length: SAMPLES + 1 }, (_, i) => at((w * i) / SAMPLES, y)));
  }
  if (focus && k > 0) drawMarker(ctx, focus, k);
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

// The grid breathes, then picks a point. Every line bends in toward it, the
// point gets its coordinates and one line about warfare, then it all lets go
// and the grid breathes again before choosing the next point. With reduced
// motion the grid is drawn once, still.
export function StealthGrid() {
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
    let lastStage: Stage | null = null;
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
      const { phase, t } = phaseAt(elapsed);
      const cycle = cycleIndex(elapsed);
      if (cycle !== lastCycle) {
        focus = chooseFocus(size.w, size.h, Math.random, focus ?? undefined);
        lastCycle = cycle;
      }
      const stage = stageFor(phase);
      if (stage !== lastStage) {
        setOverlay(stage && focus ? { focus, stage } : null);
        lastStage = stage;
      }
      drawGrid(ctx, size.w, size.h, focus, pull(phase, t), phase, t);
      frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      drawGrid(ctx, size.w, size.h, null, 0, "hold", 0);
    } else {
      frame = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {overlay && <FocusLabel overlay={overlay} />}
    </div>
  );
}

// Coordinates appear as the lines arrive, the saying once they have settled,
// and both fade as the grid lets go. Placed beside the point, flipped to the
// left when the point sits in the right half of the screen.
function FocusLabel({ overlay }: { overlay: Overlay }) {
  const { focus, stage } = overlay;
  const right = typeof window !== "undefined" && focus.x > window.innerWidth / 2;
  const shown = stage === "fading" ? "opacity-0" : "opacity-100";
  return (
    <div
      data-focus-label
      className={`absolute font-mono transition-opacity duration-700 ${shown} ${right ? "-translate-x-full text-right" : ""}`}
      style={{ left: focus.x + (right ? -18 : 18), top: focus.y - 8 }}
    >
      <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: PINK }}>
        {coordsLabel(focus)}
      </p>
      <p className={`mt-1 max-w-[16rem] text-[12px] leading-relaxed text-white/75 transition-opacity duration-500 ${stage === "coords" ? "opacity-0" : "opacity-100"}`}>
        {focus.saying}
      </p>
    </div>
  );
}
