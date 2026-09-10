"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Ground } from "@/features/persona/personas";
import { ConstellationScene } from "./ConstellationScene";
import { OFFSCREEN, type EvidenceMark } from "./constellation";
import { glowFor, sampleVideoLuma, smooth } from "./videoLuma";

type Props = {
  ground: Ground;
  marks: EvidenceMark[];
  videoRef?: RefObject<HTMLVideoElement | null>;
  onSelect?: (mark: EvidenceMark) => void;
  className?: string;
};

const LUMA_INTERVAL_MS = 250;

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

// Samples the film a few times a second and eases the grid's glow toward it.
function attachGlow(scene: ConstellationScene, video: HTMLVideoElement | null): () => void {
  if (!video) return () => {};
  const scratch = document.createElement("canvas");
  let glow = 1;
  const id = setInterval(() => {
    const luma = sampleVideoLuma(video, scratch);
    if (luma === null) return;
    glow = smooth(glow, glowFor(luma));
    scene.setGlow(glow);
  }, LUMA_INTERVAL_MS);
  return () => clearInterval(id);
}

export function ConstellationGrid({ ground, marks, videoRef, onSelect, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ConstellationScene | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const scene = new ConstellationScene(canvas, ground);
    sceneRef.current = scene;
    scene.seed(marks);
    const ro = new ResizeObserver(([entry]) => scene.resize(entry.contentRect.width, entry.contentRect.height));
    ro.observe(wrap);
    // The grid drifts slowly and answers the pointer, which is calm enough to
    // keep under reduced motion. A frozen grid read as a broken page.
    const stop = scene.start();
    const detach = attachPointer(scene);
    const stopGlow = attachGlow(scene, videoRef?.current ?? null);
    return () => {
      stop();
      detach();
      stopGlow();
      ro.disconnect();
      sceneRef.current = null;
    };
  }, [ground, marks, videoRef]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const mark = sceneRef.current?.pick(e.clientX, e.clientY);
    if (mark && onSelect) onSelect(mark);
  };

  return (
    <div ref={wrapRef} className={className} onClick={handleClick}>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
}
