"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { Reveal, StaggerContainer, StaggerItem, RevealLine } from "@/components/ui/RevealAnimations";
import { BallisticCalendar } from "@/components/ui/BallisticCalendar";
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
      transition={{ delay: 0.2, duration: 0.6 }}
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

export default function HomeContent() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-16">
          {/* Header */}
          <section className="px-5 md:px-8 pt-16 pb-12 border-b border-border-light">
            <Reveal>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-text-black">
                Jay Kim
              </h1>
            </Reveal>
          </section>

          <RevealLine delay={0.2} />

          {/* Content */}
          <section className="grid md:grid-cols-2 gap-0 relative">
            {/* Left: Bio */}
            <div className="px-5 md:px-8 py-12 md:border-r border-border-light">
              <Reveal delay={0.1}>
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-text-mid block mb-6">
                  About
                </span>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="text-text-black text-base leading-relaxed mb-4">
                  I&apos;m Jay Kim. I build software for regulated domains: healthcare, defense, compliance. The systems are complex and the stakes are real, so I care as much about the interface someone uses as the pipeline underneath it.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-text-mid text-base leading-relaxed mb-6">
                  I have always loved designing and coding since high school, making websites for others and wanting to be an architecture major at one point.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="text-text-mid text-base leading-relaxed mb-6">
                  I watch a lot of anime. Favorites: Code Geass, Cowboy Bebop, and Solo Leveling.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-text-mid text-base leading-relaxed mb-6">
                  I hunt for good food spots. Ramen, sushi, Korean BBQ, hole-in-the-wall tacos. I track every restaurant I try. I drink matcha daily. I order iced oat milk lattes when I find a good cafe.
                </p>
              </Reveal>
              <Reveal delay={0.35}>
                <p className="text-text-dark text-base leading-relaxed">
                  I shoot photography. Street, food, travel. I carry my camera when I explore new places. I care about design. How things look matters as much as how they work.
                </p>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="mt-8 border border-border-light rounded-sm overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-border-light">
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-text-mid">
                      Daily Quote
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <BallisticCalendar />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Illustration */}
            <div className="px-5 md:px-8 py-12 flex flex-col items-center overflow-hidden">
              <div className="scale-100 sm:scale-[0.85] origin-top mt-[75px] sm:mt-0">
                <AboutImage />
              </div>

              <Reveal delay={0.4} className="hidden md:block -mt-[420px] space-y-3 w-full max-w-[300px] relative z-10">
                <a
                  href="https://github.com/NyXkim5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-baseline py-3 border-b border-border-light group"
                >
                  <span className="font-mono text-xs tracking-wider uppercase text-text-mid">
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
                  <span className="font-mono text-xs tracking-wider uppercase text-text-mid">
                    LinkedIn
                  </span>
                  <span className="text-sm text-text-black group-hover:text-text-mid transition-colors">
                    joonhyuknkim &#8599;
                  </span>
                </a>
              </Reveal>
            </div>
          </section>

          {/* Skills */}
          <section className="border-t border-border-light">
            <div className="px-5 md:px-8 py-12">
              <Reveal>
                <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-text-mid mb-10">
                  Technical Skills
                </h2>
              </Reveal>
              <StaggerContainer delay={0.15} stagger={0.08} className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {Object.entries(skills).map(([category, items]) => (
                  <StaggerItem key={category}>
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
