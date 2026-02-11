"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function KonamiCode() {
  const [activated, setActivated] = useState(false);
  const sequenceRef = useRef<string[]>([]);

  const triggerEasterEgg = useCallback(() => {
    setActivated(true);

    // Play ascending tone
    try {
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      [400, 500, 600, 800].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.3);
      });
    } catch {
      // Audio not available
    }

    // Reset after 3s
    setTimeout(() => setActivated(false), 3000);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      sequenceRef.current.push(e.key);
      // Keep only last 10 keys
      if (sequenceRef.current.length > 10) {
        sequenceRef.current = sequenceRef.current.slice(-10);
      }

      // Check match
      const match = KONAMI.every((key, i) => sequenceRef.current[i] === key);
      if (match && sequenceRef.current.length === 10) {
        sequenceRef.current = [];
        triggerEasterEgg();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [triggerEasterEgg]);

  return (
    <>
      {/* Invert filter */}
      {activated && (
        <style>{`html { filter: invert(1) hue-rotate(180deg); transition: filter 0.3s; }`}</style>
      )}

      {/* Toast */}
      <AnimatePresence>
        {activated && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black border border-green-500/30 rounded-lg px-8 py-4 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
              <p className="font-mono text-sm text-green-400 tracking-wider">
                {`// DEVELOPER MODE ACTIVATED`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
