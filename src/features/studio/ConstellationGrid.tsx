"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { Ground } from "@/features/persona/personas";
import { ConstellationScene } from "./ConstellationScene";
import { OFFSCREEN } from "./constellation";

type Props = { ground: Ground; className?: string };

function attachPointer(scene: ConstellationScene): () => void {
  const move = (e: MouseEvent) => scene.pointer(e.clientX, e.clientY);
  const leave = () => scene.pointer(OFFSCREEN, OFFSCREEN);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseleave", leave);
  return () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseleave", leave);
  };
}

export function ConstellationGrid({ ground, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const scene = new ConstellationScene(canvas, ground);
    const ro = new ResizeObserver(([entry]) => scene.resize(entry.contentRect.width, entry.contentRect.height));
    ro.observe(wrap);
    // Reduced motion gets one still frame of the grid at rest.
    const stop = reduced ? () => {} : scene.start();
    const detach = reduced ? () => {} : attachPointer(scene);
    return () => {
      stop();
      detach();
      ro.disconnect();
    };
  }, [ground, reduced]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
}
