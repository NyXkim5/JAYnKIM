"use client";

import { useEffect, useRef } from "react";

const TRAIL_COUNT = 6;

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef({ x: 0, y: 0 });
  const trailPositions = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 })));
  const showTrail = useRef(true);

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.style.cursor = "none";

    // Hide cursor on body only — interactive elements (links, buttons, drag handles)
    // keep their native cursors for accessibility
    const style = document.createElement("style");
    style.textContent = "body { cursor: none; }";
    document.head.appendChild(style);

    // Fade out trail after 4 seconds
    const trailTimeout = setTimeout(() => {
      showTrail.current = false;
      trailRefs.current.forEach((el) => {
        if (el) el.style.opacity = "0";
      });
    }, 4000);

    const getZoom = () => {
      const z = parseFloat(getComputedStyle(document.documentElement).zoom || "1");
      return z || 1;
    };

    const move = (e: MouseEvent) => {
      const zoom = getZoom();
      const x = e.clientX / zoom;
      const y = e.clientY / zoom;
      pos.current = { x, y };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const rafId = { current: 0 };

    const animate = () => {
      if (document.hidden) {
        rafId.current = requestAnimationFrame(animate);
        return;
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

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(trailTimeout);
      document.documentElement.style.cursor = "";
      style.remove();
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* Trail particles */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={`trail-${i}`}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="pointer-events-none fixed top-0 left-0 z-[9997] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff69b4]/50"
          style={{
            width: 4 - i * 0.4,
            height: 4 - i * 0.4,
            opacity: 0.4 - i * 0.06,
            willChange: "transform",
            transition: "opacity 1s ease",
          }}
        />
      ))}

      {/* A plain pink arrow with the tip on the pointer, and a name tag under
          it, the way a collaborator's cursor is drawn in a shared canvas. The
          dark hairline keeps it readable on the white pages. */}
      <div
        ref={dotRef}
        data-cursor
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ willChange: "transform" }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" className="block" aria-hidden="true">
          <path
            d="M3 2 L3 18.5 L7.3 14.4 L10.4 21 L13 19.8 L9.9 13.3 L16 13.3 Z"
            fill="#ff69b4"
            stroke="#0a0a0a"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
        <span
          data-cursor-tag
          className="absolute left-[14px] top-[22px] whitespace-nowrap bg-[#ff69b4] px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-[#0a0a0a]"
        >
          user
        </span>
      </div>

    </>
  );
}
