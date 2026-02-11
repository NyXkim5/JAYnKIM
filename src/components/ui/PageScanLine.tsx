"use client";

import { motion } from "framer-motion";

/**
 * Full-page horizontal scan line that sweeps top to bottom continuously.
 * Subtle CRT / military monitor effect. Mount globally.
 */
export function PageScanLine() {
  return (
    <motion.div
      className="fixed inset-x-0 h-[2px] pointer-events-none z-[100]"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.04) 80%, transparent)",
      }}
      animate={{ top: ["-2px", "100vh"] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
