"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Scrolling stream of hex/binary data — like a military data feed.
 * Purely decorative ambient element.
 */
export function DataStream({ className = "" }: { className?: string }) {
  const [lines, setLines] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    const generateLine = () => {
      const types = [
        () => {
          // Hex dump
          const bytes = Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
          ).join(" ");
          const addr = Math.floor(Math.random() * 65535).toString(16).padStart(4, "0");
          return `0x${addr}  ${bytes}`;
        },
        () => {
          // Status line
          const statuses = ["ACK", "SYN", "FIN", "PSH", "RST", "OK", "RECV", "SEND"];
          const s = statuses[Math.floor(Math.random() * statuses.length)];
          const port = Math.floor(Math.random() * 65535);
          return `[${s}] :${port} → ██████`;
        },
        () => {
          // Coordinates
          const lat = (33 + Math.random() * 0.05).toFixed(4);
          const lng = (117 + Math.random() * 0.05).toFixed(4);
          return `GEO ${lat}°N ${lng}°W`;
        },
        () => {
          // Hash fragment
          const hash = Array.from({ length: 12 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");
          return `SHA-256 ${hash}...`;
        },
      ];

      return types[Math.floor(Math.random() * types.length)]();
    };

    // Initialize - use queueMicrotask to avoid synchronous setState warning
    queueMicrotask(() => setLines(Array.from({ length: 6 }, generateLine)));

    intervalRef.current = setInterval(() => {
      setLines((prev) => {
        const next = [...prev.slice(1), generateLine()];
        return next;
      });
    }, 1800);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <motion.div
      className={`font-mono text-[9px] leading-relaxed text-text-light/50 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      {lines.map((line, i) => (
        <motion.div
          key={`${i}-${line}`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="whitespace-nowrap"
        >
          {line}
        </motion.div>
      ))}
    </motion.div>
  );
}
