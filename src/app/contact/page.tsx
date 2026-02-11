"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResumeDownload } from "@/components/ui/ResumeDownload";

// Seeded random for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Star field background
function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 600) * 100,
      y: seededRandom(i * 600 + 1) * 100,
      size: seededRandom(i * 600 + 2) * 2 + 1,
      duration: seededRandom(i * 600 + 3) * 3 + 2,
      delay: seededRandom(i * 600 + 4) * 2,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

// Floating ship
function Starship({ id, delay, startY }: { id: number; delay: number; startY: number }) {
  const curveAmount = useMemo(() => (seededRandom(id * 200) - 0.5) * 100, [id]);

  return (
    <motion.div
      className="absolute pointer-events-none left-0"
      style={{ top: `${startY}%` }}
      animate={{
        x: ["-50px", "110vw"],
        y: [0, curveAmount, 0],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        repeatDelay: 15,
        ease: "linear"
      }}
    >
      <svg width="30" height="15" viewBox="0 0 40 20">
        <path d="M5,10 L15,8 L35,10 L15,12 Z" fill="rgba(255,255,255,0.3)" stroke="rgba(34,197,94,0.5)" strokeWidth="0.5" />
        <ellipse cx="6" cy="10" rx="2" ry="1" fill="rgba(34,197,94,0.8)" />
      </svg>
    </motion.div>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      className="inline-block w-2 h-4 bg-accent-green/80 ml-1"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}

export default function ContactPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 4;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 4;
    setRotate({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      <Navbar variant="dark" />
      <main className="page-dark min-h-screen relative overflow-hidden flex items-center justify-center py-24">
        {/* Star field */}
        <StarField />

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Ships */}
        <Starship id={0} delay={0} startY={20} />
        <Starship id={1} delay={8} startY={70} />

        {/* Terminal Card */}
        <div
          className="relative z-10 px-4 w-full max-w-lg"
          onMouseLeave={handleMouseLeave}
          style={{ perspective: "1500px" }}
        >
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: rotate.x, rotateY: rotate.y }}
            transition={{
              opacity: { duration: 0.6 },
              scale: { duration: 0.6 },
              rotateX: { type: "spring", stiffness: 100, damping: 30 },
              rotateY: { type: "spring", stiffness: 100, damping: 30 },
            }}
            className="rounded-lg overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(34,197,94,0.1)",
            }}
          >
            {/* Terminal chrome */}
            <div className="bg-[#1c1c1c] border-b border-accent-green/20 px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="font-mono text-[9px] text-accent-green/50 tracking-wider">
                STARCOM // jay@portfolio
              </div>
            </div>

            {/* Terminal body */}
            <div className="bg-[#0a0a0a] p-5 font-mono relative">
              {/* Scan lines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,197,94,0.02) 2px, rgba(34,197,94,0.02) 4px)"
                }}
              />

              {/* Header */}
              <div className="mb-4 pb-3 border-b border-accent-green/20">
                <h2 className="text-xl font-bold text-accent-green tracking-wide">
                  JAY KIM
                </h2>
                <p className="text-xs text-accent-green/60 tracking-[0.15em] mt-1">
                  SOFTWARE ENGINEER // AI-ML
                </p>
              </div>

              {/* Contact links */}
              <div className="space-y-2 mb-4">
                <a
                  href="mailto:joonhyuknkim@gmail.com"
                  className="group flex items-center gap-3 hover:bg-accent-green/5 p-1.5 -mx-1.5 rounded transition-colors"
                >
                  <span className="text-accent-green/40 text-[10px] w-12">EMAIL</span>
                  <span className="text-accent-green text-xs group-hover:text-white transition-colors">
                    joonhyuknkim@gmail.com
                  </span>
                  <span className="text-accent-green/30 group-hover:text-accent-green transition-colors ml-auto text-xs">↗</span>
                </a>

                <a
                  href="https://github.com/NyXkim5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 hover:bg-accent-green/5 p-1.5 -mx-1.5 rounded transition-colors"
                >
                  <span className="text-accent-green/40 text-[10px] w-12">GITHUB</span>
                  <span className="text-accent-green text-xs group-hover:text-white transition-colors">
                    github.com/NyXkim5
                  </span>
                  <span className="text-accent-green/30 group-hover:text-accent-green transition-colors ml-auto text-xs">↗</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/joonhyuknkim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 hover:bg-accent-green/5 p-1.5 -mx-1.5 rounded transition-colors"
                >
                  <span className="text-accent-green/40 text-[10px] w-12">LINKED</span>
                  <span className="text-accent-green text-xs group-hover:text-white transition-colors">
                    linkedin.com/in/joonhyuknkim
                  </span>
                  <span className="text-accent-green/30 group-hover:text-accent-green transition-colors ml-auto text-xs">↗</span>
                </a>

                <div className="flex items-center gap-3 p-1.5 -mx-1.5">
                  <span className="text-accent-green/40 text-[10px] w-12">SECTOR</span>
                  <span className="text-accent-green/60 text-xs">
                    Orange County, CA
                  </span>
                </div>
              </div>

              {/* Resume */}
              <div className="border-t border-accent-green/20 pt-3">
                <ResumeDownload variant="dark" />
              </div>

              {/* Prompt */}
              <div className="mt-4 pt-3 border-t border-accent-green/10 flex items-center gap-2">
                <span className="text-accent-green/50 text-[10px]">jay@starcom:~$</span>
                <BlinkingCursor />
              </div>
            </div>

            {/* Status bar */}
            <div className="bg-[#1c1c1c] border-t border-accent-green/20 px-3 py-1 flex items-center justify-between">
              <span className="font-mono text-[8px] text-accent-green/30">
                33.68°N 117.82°W
              </span>
              <span className="font-mono text-[8px] text-accent-green/40 flex items-center gap-1">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-accent-green"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                SECURE
              </span>
            </div>
          </motion.div>

          {/* Helper text */}
          <motion.p
            className="text-center mt-4 font-mono text-[9px] text-white/20 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Hover to interact
          </motion.p>
        </div>
      </main>
      <Footer variant="dark" />
    </>
  );
}
