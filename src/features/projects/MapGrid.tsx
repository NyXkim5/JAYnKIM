"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { CELL, drawMapGrid, nextSpawnAt, stepBlips, type Blip } from "./gridBackdrop";

const FONT = 'var(--font-jetbrains), "JetBrains Mono", ui-monospace, monospace';

type Size = { w: number; h: number; dpr: number };

function fit(canvas: HTMLCanvasElement): Size {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  return { w, h, dpr };
}

function resolveFont(canvas: HTMLCanvasElement): string {
  const v = getComputedStyle(canvas).getPropertyValue("--font-jetbrains").trim();
  return v ? `${v}, ui-monospace, monospace` : FONT;
}

// Runs the frame loop against a canvas. The grid always breathes; reduced
// motion only leaves out the crosshair blips that appear and vanish.
function runMapGrid(canvas: HTMLCanvasElement, withBlips: boolean): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;
  let size = fit(canvas);
  const font = resolveFont(canvas);
  let blips: Blip[] = [];
  let spawnAt = nextSpawnAt(performance.now(), Math.random);
  let raf = 0;
  const frame = (t: number) => {
    ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
    const cols = Math.floor(size.w / CELL);
    const rows = Math.floor(size.h / CELL);
    if (withBlips) ({ blips, spawnAt } = stepBlips(blips, t, spawnAt, cols, rows, Math.random));
    drawMapGrid(ctx, size.w, size.h, t, blips, font);
    raf = requestAnimationFrame(frame);
  };
  const onResize = () => {
    size = fit(canvas);
  };
  window.addEventListener("resize", onResize);
  frame(performance.now());
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}

// The map-grid backdrop for the Projects page. Pointer events pass through.
export function MapGrid({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion() ?? false;
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    return runMapGrid(canvas, !reduced);
  }, [reduced]);
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
