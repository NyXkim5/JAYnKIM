"use client";

import { useEffect, useRef } from "react";

/**
 * Synthwave visualizer — horizontal wave lines that react
 * to mouse position. Industrial / defense-tech aesthetic.
 */
export function SynthWave({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const LINE_COUNT = 12;
    const SEGMENTS = 80;
    let time = 0;

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      for (let l = 0; l < LINE_COUNT; l++) {
        const lineY = (h / (LINE_COUNT + 1)) * (l + 1);
        const distFromMouse = Math.abs((l + 1) / (LINE_COUNT + 1) - my);
        const influence = Math.max(0, 1 - distFromMouse * 2.5);
        const amplitude = 4 + influence * 20;
        const lineOpacity = 0.08 + influence * 0.18;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 0, 0, ${lineOpacity})`;
        ctx.lineWidth = 1;

        for (let s = 0; s <= SEGMENTS; s++) {
          const px = (w / SEGMENTS) * s;
          const segX = s / SEGMENTS;

          // Distance from mouse X for wave distortion
          const dxFromMouse = Math.abs(segX - mx);
          const xInfluence = Math.max(0, 1 - dxFromMouse * 2);

          const wave1 = Math.sin(segX * Math.PI * 3 + time + l * 0.5) * amplitude * 0.6;
          const wave2 = Math.sin(segX * Math.PI * 5 - time * 1.3 + l * 0.3) * amplitude * 0.3;
          const wave3 = Math.sin(segX * Math.PI * 8 + time * 0.7) * amplitude * 0.1;
          const mouseWave = Math.sin(segX * Math.PI * 6 + time * 2) * xInfluence * influence * 15;

          const py = lineY + wave1 + wave2 + wave3 + mouseWave;

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.stroke();
      }

      // Draw faint vertical grid markers
      for (let g = 1; g < 8; g++) {
        const gx = (w / 8) * g;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
        ctx.lineWidth = 1;
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }

      time += 0.015;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ height: 180 }}
    />
  );
}
