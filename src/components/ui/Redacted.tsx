"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Classified-document style redacted text block.
 * Shows a black box over text; hover to briefly reveal.
 */
export function Redacted({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.span
      className="relative inline-block cursor-pointer select-none"
      onHoverStart={() => setRevealed(true)}
      onHoverEnd={() => setRevealed(false)}
    >
      {/* The actual text — visible only on hover */}
      <span
        className="relative z-10 transition-opacity duration-300"
        style={{ opacity: revealed ? 1 : 0 }}
      >
        {children}
      </span>

      {/* Black redaction bar */}
      <motion.span
        className="absolute inset-0 bg-black rounded-[2px]"
        style={{ zIndex: 5 }}
        animate={{
          opacity: revealed ? 0.15 : 1,
          scaleX: revealed ? 1.02 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* Subtle scan-line on the bar */}
      {!revealed && (
        <motion.span
          className="absolute inset-0 z-[6] overflow-hidden rounded-[2px] pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }}
        />
      )}
    </motion.span>
  );
}
