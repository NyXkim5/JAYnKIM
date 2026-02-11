"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 6;

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPositions = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 })));
  const showTrail = useRef(true);

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    document.documentElement.style.cursor = "none";

    // Force cursor:none on all elements
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    // Fade out trail after 4 seconds
    const trailTimeout = setTimeout(() => {
      showTrail.current = false;
      trailRefs.current.forEach((el) => {
        if (el) el.style.opacity = "0";
      });
    }, 4000);

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const animate = () => {
      // Ring
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) scale(${hovering ? 1.8 : 1})`;
      }

      // Trail particles
      if (showTrail.current) {
        for (let i = TRAIL_COUNT - 1; i > 0; i--) {
          trailPositions.current[i].x += (trailPositions.current[i - 1].x - trailPositions.current[i].x) * (0.3 - i * 0.03);
          trailPositions.current[i].y += (trailPositions.current[i - 1].y - trailPositions.current[i].y) * (0.3 - i * 0.03);
        }
        trailPositions.current[0].x += (pos.current.x - trailPositions.current[0].x) * 0.4;
        trailPositions.current[0].y += (pos.current.y - trailPositions.current[0].y) * 0.4;

        trailRefs.current.forEach((el, i) => {
          if (el) {
            el.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px) scale(${1 - i * 0.12})`;
          }
        });
      }

      requestAnimationFrame(animate);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.tagName === "A" ||
        target.tagName === "BUTTON"
      ) {
        setHovering(true);
      }
    };

    const onOut = () => setHovering(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    const raf = requestAnimationFrame(animate);

    return () => {
      clearTimeout(trailTimeout);
      document.documentElement.style.cursor = "";
      style.remove();
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, [hovering]);

  return (
    <>
      {/* Trail particles */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={`trail-${i}`}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="pointer-events-none fixed top-0 left-0 z-[9997] -translate-x-1/2 -translate-y-1/2 mix-blend-difference rounded-full bg-white/40"
          style={{
            width: 4 - i * 0.4,
            height: 4 - i * 0.4,
            opacity: 0.4 - i * 0.06,
            willChange: "transform",
            transition: "opacity 1s ease",
          }}
        />
      ))}

      {/* Center dot — crosshair style */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        {/* X crosshair */}
        <svg width="20" height="20" viewBox="0 0 20 20" className="block">
          <line x1="4" y1="4" x2="16" y2="16" stroke="white" strokeWidth="1.5" />
          <line x1="16" y1="4" x2="4" y2="16" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          width: 36,
          height: 36,
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: "50%",
          willChange: "transform",
          transition: "width 0.3s, height 0.3s, border-color 0.3s",
        }}
      />
    </>
  );
}
