"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { GridReveal } from "@/components/ui/GridReveal";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { RevealUp, RevealLeft, RevealBlur, StaggerContainer, StaggerItem, RevealLine } from "@/components/ui/RevealAnimations";
import { HelloWorldTyper } from "@/components/ui/HelloWorldTyper";
import { Redacted } from "@/components/ui/Redacted";
import { SynthWave } from "@/components/ui/SynthWave";
import { LiveClock } from "@/components/ui/LiveClock";
import { BallisticCalendar } from "@/components/ui/BallisticCalendar";
import { StatusIndicator, SecurityBadge, HexCode, SectionScanLine, NodeIndicator } from "@/components/ui/CyberAccents";
import { skills } from "@/data/skills";

function AboutImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 100, damping: 30 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: -125 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex justify-center pointer-events-none"
    >
      <div ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: 1200 }} className="pointer-events-auto">
        <motion.div style={{ rotateX, rotateY }}>
          <Image
            src="/homevid.svg"
            alt="Jay Kim illustration"
            width={810}
            height={1013}
            className="w-full"
            priority
            unoptimized
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function TypewriterOnce({ text, delay = 0, speed = 55 }: { text: string; delay?: number; speed?: number }) {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (indexRef.current >= text.length) return;
    const timer = setTimeout(() => {
      indexRef.current += 1;
      setDisplay(text.slice(0, indexRef.current));
    }, speed + Math.random() * 30);
    return () => clearTimeout(timer);
  }, [started, display, text, speed]);

  return (
    <span>
      {display}
      {display.length < text.length && started && (
        <span className="animate-blink">|</span>
      )}
    </span>
  );
}

export default function HomeContent() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-14">
          {/* Header */}
          <section className="px-5 md:px-8 pt-16 pb-12 border-b border-border-light relative overflow-hidden">
            <GridReveal />
            <SectionScanLine />

            <motion.div
              className="flex items-center justify-between mb-6 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 md:gap-4">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-light border border-border-light px-2 py-0.5">
                  Dossier
                </span>
                <span className="font-mono text-[10px] text-text-light hidden sm:inline">
                  REF: JK-<Redacted>2025</Redacted>-001
                </span>
                <StatusIndicator label="FILE" status="ACTIVE" />
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline"><HexCode /></span>
                <span className="font-mono text-[10px] text-text-light tracking-wider uppercase">
                  UTC <LiveClock className="text-[10px] text-text-light" />
                </span>
              </div>
            </motion.div>

            <RevealUp>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-black relative z-10">
                <HelloWorldTyper />
              </h1>
            </RevealUp>
          </section>

          <RevealLine delay={0.5} />

          {/* Content */}
          <section className="grid md:grid-cols-2 gap-0 relative">
            {/* Left: Bio */}
            <div className="px-5 md:px-8 py-12 md:border-r border-border-light">
              <motion.div
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light">
                  Clearance Level: Alpha
                </span>
              </motion.div>

              <RevealLeft delay={0.3}>
                <p className="text-text-dark text-base leading-relaxed mb-6">
                  I&apos;m Jay Kim. I love drawing, working out, and trying new food. I have always loved designing and coding since high school, making websites for others and wanting to be an architecture major at one point.
                </p>
              </RevealLeft>
              <RevealBlur delay={0.7}>
                <p className="text-text-mid text-base leading-relaxed mb-6">
                  I watch a lot of anime. Favorites: <TypewriterOnce text="Code Geass, Cowboy Bebop, and Solo Leveling." delay={2000} speed={50} />
                </p>
              </RevealBlur>
              <RevealBlur delay={0.9}>
                <p className="text-text-mid text-base leading-relaxed mb-6">
                  I hunt for good food spots. Ramen, sushi, Korean BBQ, hole-in-the-wall tacos. I track every restaurant I try. I drink matcha daily. I order iced oat milk lattes when I find a good cafe.
                </p>
              </RevealBlur>
              <RevealLeft delay={1.1}>
                <p className="text-text-dark text-base leading-relaxed">
                  I shoot photography. Street, food, travel. I carry my camera when I explore new places. I care about design. How things look matters as much as how they work.
                </p>
              </RevealLeft>

              <RevealBlur delay={1.3}>
                <div className="mt-8 border border-border-light rounded-sm overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      <span className="font-mono text-[10px] tracking-wider uppercase text-text-light">
                        Signal Monitor
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-text-light/50">
                      FREQ: <Redacted>████</Redacted> MHz
                    </span>
                  </div>
                  <SynthWave />
                </div>
              </RevealBlur>

              <RevealBlur delay={1.5}>
                <div className="mt-6 border border-border-light rounded-sm overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-light">
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-accent-amber"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="font-mono text-[10px] tracking-wider uppercase text-text-light">
                        Temporal Log
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-text-light/50">
                      ACTIVE
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <BallisticCalendar />
                  </div>
                </div>
              </RevealBlur>
            </div>

            {/* Right: Illustration */}
            <div className="px-5 md:px-8 py-12 flex flex-col items-center overflow-hidden">
              <div className="scale-[0.85] origin-top">
                <AboutImage />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="hidden md:block -mt-[420px] space-y-3 w-full max-w-[300px] relative z-10"
              >
                <a
                  href="https://github.com/NyXkim5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-baseline py-3 border-b border-border-light group"
                >
                  <span className="font-mono text-[11px] tracking-wider uppercase text-text-light">
                    GitHub
                  </span>
                  <span className="text-sm text-text-black group-hover:text-text-mid transition-colors">
                    NyXkim5 &#8599;
                  </span>
                </a>
                <a
                  href="https://www.linkedin.com/in/joonhyuknkim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-baseline py-3 border-b border-border-light group"
                >
                  <span className="font-mono text-[11px] tracking-wider uppercase text-text-light">
                    LinkedIn
                  </span>
                  <span className="text-sm text-text-black group-hover:text-text-mid transition-colors">
                    joonhyuknkim &#8599;
                  </span>
                </a>
              </motion.div>
            </div>
          </section>

          {/* Skills */}
          <section className="border-t border-border-light relative overflow-hidden">
            <SectionScanLine />
            <div className="px-5 md:px-8 py-12 relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-light">
                    <ScrambleText text="Technical Skills" delay={400} speed={30} stagger={25} />
                  </h2>
                  <SecurityBadge level="VERIFIED" />
                </div>
                <div className="flex items-center gap-4">
                  <NodeIndicator id="SKILL-DB" active />
                  <span className="font-mono text-[10px] text-text-light/40 tracking-wider uppercase">
                    Capability Assessment
                  </span>
                </div>
              </div>
              <StaggerContainer delay={0.6} stagger={0.12} className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {Object.entries(skills).map(([category, items]) => (
                  <StaggerItem key={category} direction="up">
                    <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-text-black mb-4">
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {items.map((skill) => (
                        <li key={skill} className="text-sm text-text-mid">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
