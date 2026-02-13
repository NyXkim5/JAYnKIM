"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Pulsing green status dot with label */
export function StatusIndicator({ label, status = "ACTIVE" }: { label: string; status?: string }) {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-accent-green"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="font-mono text-[10px] tracking-wider text-accent-green/70 uppercase">
        {label}: {status}
      </span>
    </div>
  );
}

/** Green hex code that changes */
export function HexCode({ className = "" }: { className?: string }) {
  const [hex, setHex] = useState("0x00000000");

  useEffect(() => {
    const interval = setInterval(() => {
      const newHex = "0x" + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, "0");
      setHex(newHex);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`font-mono text-[10px] text-accent-green/50 tracking-wider ${className}`}>
      {hex}
    </span>
  );
}

/** Corner brackets decoration */
export function CornerBrackets({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Top left */}
      <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-accent-green/30" />
      {/* Top right */}
      <span className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-accent-green/30" />
      {/* Bottom left */}
      <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-accent-green/30" />
      {/* Bottom right */}
      <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-accent-green/30" />
      {children}
    </div>
  );
}

/** Scrolling binary line */
export function BinaryLine({ className = "" }: { className?: string }) {
  const [binary, setBinary] = useState("");

  useEffect(() => {
    const generateBinary = () => {
      let str = "";
      for (let i = 0; i < 64; i++) {
        str += Math.random() > 0.5 ? "1" : "0";
      }
      return str;
    };
    queueMicrotask(() => setBinary(generateBinary()));
    const interval = setInterval(() => setBinary(generateBinary()), 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`overflow-hidden ${className}`}>
      <span className="font-mono text-[10px] text-accent-green/20 tracking-[0.2em] whitespace-nowrap">
        {binary}
      </span>
    </div>
  );
}

/** Animated connection line */
export function ConnectionLine({ vertical = false }: { vertical?: boolean }) {
  return (
    <div className={`relative ${vertical ? "w-px h-full" : "h-px w-full"}`}>
      <div className={`absolute inset-0 ${vertical ? "bg-gradient-to-b" : "bg-gradient-to-r"} from-transparent via-accent-green/30 to-transparent`} />
      <motion.div
        className={`absolute ${vertical ? "w-full h-4" : "h-full w-8"} bg-gradient-to-r from-transparent via-accent-green/60 to-transparent`}
        animate={vertical ? { top: ["0%", "100%"] } : { left: ["0%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/** Data readout with green accent */
export function DataReadout({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-2 font-mono text-[10px] tracking-wider"
    >
      <span className="text-accent-green/50 uppercase">{label}</span>
      <span className="text-accent-green/30">:</span>
      <span className="text-text-light">{value}</span>
    </motion.div>
  );
}

/** Green scan line overlay for sections */
export function SectionScanLine() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-green/20 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

/** Security badge/tag */
export function SecurityBadge({ level = "SECURED" }: { level?: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-accent-green/30 rounded-sm">
      <motion.span
        className="w-1 h-1 rounded-full bg-accent-green"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span className="font-mono text-[10px] tracking-[0.15em] text-accent-green/70 uppercase">
        {level}
      </span>
    </div>
  );
}

/** Network node indicator */
export function NodeIndicator({ id, active = true }: { id: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative w-2 h-2 ${active ? "bg-accent-green/20" : "bg-text-light/20"} rounded-full`}>
        {active && (
          <motion.div
            className="absolute inset-0 rounded-full bg-accent-green/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <div className={`absolute inset-[2px] rounded-full ${active ? "bg-accent-green" : "bg-text-light/50"}`} />
      </div>
      <span className={`font-mono text-[10px] tracking-wider ${active ? "text-accent-green/60" : "text-text-light/40"}`}>
        {id}
      </span>
    </div>
  );
}

/** Encrypted data marker */
export function EncryptedMarker() {
  return (
    <span className="font-mono text-[10px] tracking-wider text-accent-green/40 uppercase">
      [AES-256]
    </span>
  );
}
