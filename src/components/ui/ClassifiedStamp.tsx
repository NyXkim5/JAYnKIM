"use client";

import { motion } from "framer-motion";

/**
 * "CLASSIFIED" / "CONFIDENTIAL" watermark stamp that fades in
 * rotated at an angle — like a declassified government document.
 */
export function ClassifiedStamp({
  text = "CLASSIFIED",
  delay = 1.5,
}: {
  text?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none flex items-center justify-center z-[2] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1.5, ease: "easeOut" }}
    >
      <span
        className="font-mono text-[80px] md:text-[120px] lg:text-[160px] font-bold tracking-[0.3em] uppercase text-black/[0.03] select-none whitespace-nowrap"
        style={{ transform: "rotate(-18deg)" }}
      >
        {text}
      </span>
    </motion.div>
  );
}
