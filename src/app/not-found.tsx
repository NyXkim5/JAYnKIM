"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlitchText } from "@/components/ui/GlitchText";

export default function NotFound() {
  return (
    <main className="page-dark min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-5">
      {/* Broken grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "skewY(-2deg) scale(1.1)",
        }}
      />

      {/* Scan lines */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
        animate={{ top: ["-2px", "100vh"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ top: ["100vh", "-1px"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-mono text-[120px] md:text-[180px] font-bold leading-none text-white/10">
            <GlitchText text="404" interval={2000} />
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 space-y-4"
        >
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-red-400/60">
            Signal Lost
          </p>
          <p className="font-mono text-xs text-white/30 max-w-sm mx-auto">
            The requested resource could not be located. The page may have been moved, deleted, or never existed.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <motion.div
              className="h-px bg-white/10"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            />
            <Link
              href="/"
              className="font-mono text-xs tracking-wider uppercase text-white/50 hover:text-white transition-colors border-b border-white/20 hover:border-white/50 pb-1"
            >
              Return to base &#8599;
            </Link>
            <motion.div
              className="h-px bg-white/10"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Error details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 font-mono text-[10px] text-white/15 space-y-1"
        >
          <p>ERR_NOT_FOUND: Resource unavailable</p>
          <p>TRACE: 0x0000404F → 0xDEADBEEF</p>
          <p>STATUS: CONNECTION TERMINATED</p>
        </motion.div>
      </div>
    </main>
  );
}
