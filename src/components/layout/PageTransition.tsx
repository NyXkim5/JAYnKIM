"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

let hasAnimated = false;

/**
 * Page transition with horizontal wipe clip-path effect.
 * Only animates on the very first page load. Subsequent navigations render instantly.
 * Uses useAnimationControls to avoid hydration mismatch from module-level state.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const controls = useAnimationControls();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    if (!hasAnimated) {
      hasAnimated = true;
      controls.set({ clipPath: "inset(0 100% 0 0)", opacity: 0 });
      controls.start({
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        transition: {
          clipPath: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
          opacity: { duration: 0.3 },
        },
      });
    }
  }, [controls]);

  return <motion.div animate={controls}>{children}</motion.div>;
}
