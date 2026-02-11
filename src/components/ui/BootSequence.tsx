"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLines = [
  { text: "> BIOS CHECK .............. OK", delay: 0 },
  { text: "> MEM 0x00000000-0x7FFFFFFF .. 2048MB", delay: 200 },
  { text: "> LOADING KERNEL MODULES ...", delay: 400 },
  { text: "  [mod] display.drv ........ loaded", delay: 550 },
  { text: "  [mod] network.drv ....... loaded", delay: 650 },
  { text: "  [mod] audio.drv ......... loaded", delay: 750 },
  { text: "> INITIALIZING SUBSYSTEMS ...", delay: 900 },
  { text: "  [sys] renderer .......... online", delay: 1050 },
  { text: "  [sys] animation ......... online", delay: 1150 },
  { text: "  [sys] interaction ....... online", delay: 1250 },
  { text: "> DECRYPTING PAYLOAD .......", delay: 1400 },
  { text: "  SHA-256: 4a7f3c...e91b02 VERIFIED", delay: 1600 },
  { text: "> ESTABLISHING SECURE CONNECTION", delay: 1800 },
  { text: "", delay: 1950 },
  { text: "  ██████████████████████████ 100%", delay: 2000 },
  { text: "", delay: 2200 },
  { text: "> JAY_KIM.PORTFOLIO v1.0", delay: 2300 },
  { text: "> STATUS: SYSTEM ONLINE", delay: 2500 },
];

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("boot-seen");
    if (seen) return;

    queueMicrotask(() => setVisible(true));
    sessionStorage.setItem("boot-seen", "1");

    // Reveal lines one by one
    bootLines.forEach(({ text, delay }) => {
      setTimeout(() => {
        setLines((prev) => [...prev, text]);
      }, delay);
    });

    // Fade out after all lines
    setTimeout(() => {
      setDone(true);
    }, 3200);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="w-full max-w-lg px-6">
            <div className="font-mono text-[11px] leading-[1.8] text-green-400/80 space-y-0">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {line || "\u00A0"}
                </motion.div>
              ))}
              <motion.span
                className="inline-block w-2 h-4 bg-green-400/80 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
