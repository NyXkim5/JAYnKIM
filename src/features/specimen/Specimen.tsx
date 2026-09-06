"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Ground } from "@/features/persona/personas";
import { breathe, emptyFrame, interpolate, paint, render } from "./renderer";
import type { SpecimenFrame } from "./types";

type Props = { frame: SpecimenFrame; ground: Ground; idle?: boolean; className?: string };

const DISSOLVE_MS = 600;
const BREATHE_MS = 1000;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function useCanvasSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

function resolveMonoFamily(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim() || "ui-monospace, monospace";
}

function draw(canvas: HTMLCanvasElement, frame: SpecimenFrame, ground: Ground, w: number, h: number) {
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const family = resolveMonoFamily();
  paint(ctx, render(frame, w, h, ground), ground, family);
}

export function Specimen({ frame, ground, idle = true, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shownRef = useRef<SpecimenFrame>(frame);
  const busyRef = useRef(false);
  const { w, h } = useCanvasSize(wrapRef);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || w === 0 || h === 0) {
      busyRef.current = false;
      return;
    }
    if (reduced) {
      shownRef.current = frame;
      draw(canvas, frame, ground, w, h);
      busyRef.current = false;
      return;
    }
    let raf = 0;
    let cancelled = false;
    busyRef.current = true;
    const from = shownRef.current;
    const sameDims = from.cols === frame.cols && from.rows === frame.rows;
    const outTarget = sameDims ? frame : emptyFrame(from.cols, from.rows);
    const inStart = sameDims ? null : emptyFrame(frame.cols, frame.rows);
    const t0 = performance.now();
    const step = (now: number) => {
      if (cancelled) return;
      const t = (now - t0) / DISSOLVE_MS;
      if (t < 1) {
        shownRef.current = interpolate(from, outTarget, easeInOut(t));
      } else if (inStart && t < 2) {
        shownRef.current = interpolate(inStart, frame, easeInOut(t - 1));
      } else {
        shownRef.current = frame;
        draw(canvas, frame, ground, w, h);
        busyRef.current = false;
        return;
      }
      draw(canvas, shownRef.current, ground, w, h);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      busyRef.current = false;
    };
  }, [frame, ground, w, h, reduced]);

  useEffect(() => {
    if (!idle || reduced || w === 0 || h === 0) return;
    let tick = 0;
    const id = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas || busyRef.current) return;
      tick += 1;
      draw(canvas, breathe(shownRef.current, 11, tick), ground, w, h);
    }, BREATHE_MS);
    return () => clearInterval(id);
  }, [idle, reduced, ground, w, h]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" style={{ width: w, height: h, display: "block" }} />
    </div>
  );
}
