"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SceneWrapper } from "@/components/three/SceneWrapper";
import { MetroMap } from "@/components/ui/MetroMap";
import { StatusIndicator, HexCode, SecurityBadge, NodeIndicator, BinaryLine } from "@/components/ui/CyberAccents";

const roles = [
  "Product Designer",
  "AI/ML Engineer",
  "Full Stack Developer",
  "UI/UX Designer",
];

function TypeWriter() {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex]);

  return (
    <span className="font-mono text-lg md:text-xl text-accent-cyan">
      {text}
      <span className="animate-blink ml-0.5 text-accent-cyan">_</span>
    </span>
  );
}

function DataTicker({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="font-mono text-[10px] tracking-wider text-white/30 uppercase"
    >
      <span className="text-white/50">{label}:</span> {value}
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <SceneWrapper />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-defense-grid opacity-30 z-[1]" />

      {/* Vignette */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_30%,#050505_100%)]" />

      {/* Top-left industrial data readouts */}
      <div className="absolute top-20 left-5 md:left-8 z-10 space-y-2">
        <StatusIndicator label="SYS" status="ONLINE" />
        <DataTicker label="LAT" value="33.6846° N" delay={1.8} />
        <DataTicker label="LNG" value="117.8265° W" delay={2.1} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        >
          <NodeIndicator id="NODE-01" active />
        </motion.div>
      </div>

      {/* Top-right industrial data */}
      <div className="absolute top-20 right-5 md:right-8 z-10 space-y-2 text-right">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
        >
          <SecurityBadge level="SECURED" />
        </motion.div>
        <DataTicker label="BUILD" value="v1.0.0" delay={2.2} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <HexCode />
        </motion.div>
      </div>

      {/* Binary line decoration */}
      <motion.div
        className="absolute top-16 left-0 right-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <BinaryLine />
      </motion.div>

      {/* Main content — centered */}
      <div className="relative z-10 text-center px-5 flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="h-px bg-accent-green/40"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
            <span className="font-mono text-[10px] tracking-[0.3em] text-accent-green/60 uppercase">
              Design × Code × AI
            </span>
            <motion.div
              className="h-px bg-accent-green/40"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>

          <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white text-glow-cyan mb-4">
            JAY KIM
          </h1>

          <div className="h-8 mb-6">
            <TypeWriter />
          </div>

          {/* What I Do - clear value proposition */}
          <p className="max-w-lg mx-auto text-white/60 text-base leading-relaxed mb-8">
            I <span className="text-white/80">design products</span>, <span className="text-white/80">write the code</span>, and
            <span className="text-white/80"> build the AI</span> that powers them. Currently at UC Irvine studying
            Computer Engineering, joining Optum as an AI/ML Engineer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-sm tracking-wider uppercase bg-accent-green/20 text-accent-green border border-accent-green/30 hover:bg-accent-green/30 px-6 py-3 rounded transition-all"
            >
              View Projects
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm tracking-wider uppercase text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-6 py-3 rounded transition-all"
            >
              Resume ↗
            </a>
          </div>

          {/* Experience logos/companies */}
          <motion.div
            className="mt-10 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4 text-center">
              Experience
            </p>
            <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
              <div className="text-center">
                <div className="font-mono text-lg md:text-xl font-bold text-accent-green">Optum</div>
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">AI/ML Engineer</div>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="font-mono text-lg md:text-xl font-bold text-white">Archv</div>
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">CEO & Founder</div>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="font-mono text-lg md:text-xl font-bold text-white">Cactus</div>
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">Software Eng.</div>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="font-mono text-lg md:text-xl font-bold text-white">MedVanta</div>
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">Software Eng.</div>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="font-mono text-lg md:text-xl font-bold text-white/70">UCI</div>
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">CompE Student</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Metro map — bottom section */}
      <div className="relative z-10 px-5 md:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase">
              Site Map
            </span>
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-mono text-[9px] text-white/20">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/40">⌘K</kbd> to navigate
            </span>
          </div>
          <MetroMap />
        </motion.div>
      </div>

      {/* Bottom scan line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent z-20"
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}
