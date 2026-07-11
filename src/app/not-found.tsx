"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 bg-bg-white">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-mono text-[120px] md:text-[180px] font-bold leading-none text-text-black"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6 space-y-6"
        >
          <p className="text-sm text-text-mid max-w-sm mx-auto">
            This page does not exist. It may have been moved or deleted.
          </p>
          <Link
            href="/"
            className="inline-block font-mono text-xs tracking-wider uppercase text-text-mid hover:text-text-black transition-colors border-b border-border-mid hover:border-text-black pb-1"
          >
            Back home &#8599;
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
