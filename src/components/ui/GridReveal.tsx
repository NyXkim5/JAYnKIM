"use client";

import { motion } from "framer-motion";

/**
 * Subtle looping grid animation — grid lines and X marks that
 * fade in/out at intersections. Renders as an absolute overlay.
 * Darker, more industrial feel.
 */
export function GridReveal({ className = "" }: { className?: string }) {
  const points = [
    { x: "15%", y: "20%", delay: 0, repeatDelay: 4.2 },
    { x: "85%", y: "15%", delay: 2.5, repeatDelay: 5.1 },
    { x: "45%", y: "80%", delay: 1.2, repeatDelay: 3.8 },
    { x: "75%", y: "60%", delay: 3.8, repeatDelay: 6.3 },
    { x: "25%", y: "55%", delay: 5, repeatDelay: 4.7 },
    { x: "60%", y: "30%", delay: 1.8, repeatDelay: 5.5 },
    { x: "90%", y: "85%", delay: 4, repeatDelay: 3.2 },
    { x: "10%", y: "75%", delay: 0.6, repeatDelay: 6.8 },
    { x: "50%", y: "45%", delay: 2.2, repeatDelay: 4.4 },
    { x: "35%", y: "70%", delay: 3.2, repeatDelay: 5.9 },
    { x: "70%", y: "10%", delay: 4.5, repeatDelay: 3.6 },
    { x: "5%", y: "40%", delay: 1.5, repeatDelay: 6.1 },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Persistent grid — darker */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Pulsing grid overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      {/* Grid line scan — horizontal */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/[0.1] to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Grid line scan — vertical */}
      <motion.div
        className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-black/[0.1] to-transparent"
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* Second horizontal scan — opposite direction, offset */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/[0.06] to-transparent"
        animate={{ top: ["100%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* X marks at grid intersections */}
      {points.map((pt, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: pt.x, top: pt.y }}
          animate={{
            opacity: [0, 0.25, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 5,
            delay: pt.delay,
            repeat: Infinity,
            repeatDelay: pt.repeatDelay,
            ease: "easeInOut",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1" className="text-text-mid" />
            <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1" className="text-text-mid" />
          </svg>
        </motion.div>
      ))}

      {/* Pulsing dots along edges */}
      {[
        { x: "0", y: "33%" }, { x: "0", y: "66%" },
        { x: "100%", y: "33%" }, { x: "100%", y: "66%" },
        { x: "33%", y: "0" }, { x: "66%", y: "0" },
        { x: "33%", y: "100%" }, { x: "66%", y: "100%" },
      ].map((pt, i) => (
        <motion.div
          key={`edge-${i}`}
          className="absolute w-1 h-1 rounded-full bg-text-mid"
          style={{ left: pt.x, top: pt.y, transform: "translate(-50%, -50%)" }}
          animate={{ opacity: [0.05, 0.3, 0.05] }}
          transition={{
            duration: 2.5,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Corner brackets — industrial */}
      {[
        { left: 0, top: 0, r: 0 },
        { right: 0, top: 0, r: 90 },
        { right: 0, bottom: 0, r: 180 },
        { left: 0, bottom: 0, r: 270 },
      ].map((pos, i) => (
        <motion.div
          key={`bracket-${i}`}
          className="absolute"
          style={{ ...pos, transform: `rotate(${pos.r}deg)` } as React.CSSProperties}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 4, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M0 12 L0 0 L12 0" stroke="currentColor" strokeWidth="1" fill="none" className="text-text-light" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

