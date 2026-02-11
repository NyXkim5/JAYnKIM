"use client";

import { motion } from "framer-motion";

/**
 * Page transition with horizontal wipe clip-path effect.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
      animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      transition={{
        clipPath: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
}
