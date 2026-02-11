"use client";

import { motion } from "framer-motion";

/**
 * Animated metro/transit map — lines spread outward like a growing tree,
 * with black station dots filling in at intersections.
 */

interface Station {
  x: number;
  y: number;
  delay: number;
  size?: number;
}

interface Line {
  d: string;
  delay: number;
  duration: number;
}

const lines: Line[] = [
  // Main trunk — thick, grows upward from bottom center
  { d: "M 400 580 L 400 420 L 380 320 L 360 240 L 340 180", delay: 0, duration: 1.8 },
  // Branch right upper
  { d: "M 380 320 L 420 280 L 480 260 L 540 230 L 580 200", delay: 0.8, duration: 1.4 },
  // Branch left upper
  { d: "M 360 240 L 300 220 L 240 200 L 180 170", delay: 1.0, duration: 1.2 },
  // Branch far right
  { d: "M 480 260 L 520 300 L 560 310 L 620 300", delay: 1.4, duration: 1.0 },
  // Branch left mid
  { d: "M 400 420 L 340 400 L 280 380 L 220 340 L 180 300", delay: 0.6, duration: 1.4 },
  // Branch right mid
  { d: "M 400 420 L 460 400 L 520 420 L 580 400", delay: 0.5, duration: 1.2 },
  // Sub-branch upper left
  { d: "M 240 200 L 220 160 L 200 120 L 160 100", delay: 1.6, duration: 1.0 },
  // Sub-branch from right mid
  { d: "M 520 420 L 540 460 L 580 480 L 640 490", delay: 1.2, duration: 1.0 },
  // Small twig left
  { d: "M 280 380 L 260 420 L 240 460", delay: 1.4, duration: 0.8 },
  // Small twig upper right
  { d: "M 540 230 L 560 190 L 600 160 L 640 140", delay: 1.6, duration: 1.0 },
  // Sub-branch far upper
  { d: "M 340 180 L 320 140 L 280 110 L 260 80", delay: 1.8, duration: 0.8 },
  // Cross connector
  { d: "M 300 220 L 320 260 L 340 300 L 380 320", delay: 2.0, duration: 0.8 },
  // Lower left spur
  { d: "M 180 300 L 140 280 L 100 260", delay: 1.8, duration: 0.7 },
  // Lower right spur
  { d: "M 580 400 L 620 420 L 660 450", delay: 1.6, duration: 0.7 },
  // Tiny twigs
  { d: "M 160 100 L 140 80 L 120 60", delay: 2.2, duration: 0.5 },
  { d: "M 640 140 L 660 120 L 680 100", delay: 2.4, duration: 0.5 },
  { d: "M 260 80 L 240 60 L 220 40", delay: 2.4, duration: 0.5 },
];

const stations: Station[] = [
  // Main trunk
  { x: 400, y: 580, delay: 0.2, size: 8 },
  { x: 400, y: 420, delay: 0.6, size: 7 },
  { x: 380, y: 320, delay: 1.0, size: 6 },
  { x: 360, y: 240, delay: 1.4, size: 5 },
  { x: 340, y: 180, delay: 1.8, size: 5 },
  // Right upper branch
  { x: 420, y: 280, delay: 1.2 },
  { x: 480, y: 260, delay: 1.5, size: 5 },
  { x: 540, y: 230, delay: 1.8 },
  { x: 580, y: 200, delay: 2.0, size: 4 },
  // Left upper branch
  { x: 300, y: 220, delay: 1.4 },
  { x: 240, y: 200, delay: 1.6, size: 5 },
  { x: 180, y: 170, delay: 1.8, size: 4 },
  // Far right
  { x: 520, y: 300, delay: 1.8 },
  { x: 560, y: 310, delay: 2.0 },
  { x: 620, y: 300, delay: 2.2, size: 4 },
  // Left mid
  { x: 340, y: 400, delay: 1.0 },
  { x: 280, y: 380, delay: 1.2, size: 5 },
  { x: 220, y: 340, delay: 1.4 },
  { x: 180, y: 300, delay: 1.6, size: 4 },
  // Right mid
  { x: 460, y: 400, delay: 0.9 },
  { x: 520, y: 420, delay: 1.2, size: 5 },
  { x: 580, y: 400, delay: 1.4, size: 4 },
  // Sub-branches
  { x: 220, y: 160, delay: 1.8 },
  { x: 200, y: 120, delay: 2.0 },
  { x: 160, y: 100, delay: 2.2, size: 4 },
  { x: 540, y: 460, delay: 1.6 },
  { x: 580, y: 480, delay: 1.8 },
  { x: 640, y: 490, delay: 2.0, size: 4 },
  { x: 260, y: 420, delay: 1.8 },
  { x: 240, y: 460, delay: 2.0, size: 4 },
  { x: 560, y: 190, delay: 2.0 },
  { x: 600, y: 160, delay: 2.2 },
  { x: 640, y: 140, delay: 2.4, size: 4 },
  // Far ends
  { x: 320, y: 140, delay: 2.0 },
  { x: 280, y: 110, delay: 2.2 },
  { x: 260, y: 80, delay: 2.4, size: 4 },
  { x: 140, y: 280, delay: 2.0 },
  { x: 100, y: 260, delay: 2.2, size: 4 },
  { x: 620, y: 420, delay: 2.0 },
  { x: 660, y: 450, delay: 2.2, size: 4 },
  // Tiny tips
  { x: 140, y: 80, delay: 2.6, size: 3 },
  { x: 120, y: 60, delay: 2.8, size: 3 },
  { x: 660, y: 120, delay: 2.8, size: 3 },
  { x: 680, y: 100, delay: 3.0, size: 3 },
  { x: 240, y: 60, delay: 2.8, size: 3 },
  { x: 220, y: 40, delay: 3.0, size: 3 },
];

export function MetroMap() {
  return (
    <div className="w-full flex justify-center">
      <svg
        viewBox="0 0 780 620"
        className="w-full max-w-[700px] h-auto"
        fill="none"
      >
        {/* Lines */}
        {lines.map((line, i) => (
          <motion.path
            key={`line-${i}`}
            d={line.d}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={i === 0 ? 3 : i < 6 ? 2 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: line.delay, duration: line.duration, ease: "easeOut" as const },
              opacity: { delay: line.delay, duration: 0.3 },
            }}
          />
        ))}

        {/* Station dots — fill in as lines reach them */}
        {stations.map((s, i) => (
          <motion.circle
            key={`station-${i}`}
            cx={s.x}
            cy={s.y}
            r={s.size || 4.5}
            fill="#050505"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: s.delay + 0.1,
              duration: 0.3,
              ease: "backOut" as const,
            }}
          />
        ))}

        {/* Some station dots get a subtle pulse ring */}
        {stations
          .filter((_, i) => i % 5 === 0)
          .map((s, i) => (
            <motion.circle
              key={`pulse-${i}`}
              cx={s.x}
              cy={s.y}
              r={s.size || 4.5}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 2.5, 3],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                delay: s.delay + 0.5,
                duration: 2,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeOut" as const,
              }}
            />
          ))}
      </svg>
    </div>
  );
}
