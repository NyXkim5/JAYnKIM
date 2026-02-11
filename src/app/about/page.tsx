"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { GridReveal } from "@/components/ui/GridReveal";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { RevealUp, RevealLeft, RevealRight, RevealBlur, StaggerContainer, StaggerItem, RevealLine } from "@/components/ui/RevealAnimations";
import { HelloWorldTyper } from "@/components/ui/HelloWorldTyper";
import { Redacted } from "@/components/ui/Redacted";
import { SynthWave } from "@/components/ui/SynthWave";
import { LiveClock } from "@/components/ui/LiveClock";
import { BallisticCalendar } from "@/components/ui/BallisticCalendar";
import { StatusIndicator, SecurityBadge, HexCode, SectionScanLine, NodeIndicator } from "@/components/ui/CyberAccents";

const skills = {
  "Design": ["Figma", "Prototyping", "Design Systems", "UI/UX", "User Research", "Wireframing"],
  "AI/ML": ["Python", "PyTorch", "CUDA", "ML Pipelines", "Computer Vision", "NLP"],
  "Engineering": ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
  "tic +": ["C/C++", "Embedded Systems", "Docker", "CI/CD", "HIPAA Compliance"],
};



export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-14">
          {/* Header */}
          <section className="px-5 md:px-8 pt-16 pb-12 border-b border-border-light relative overflow-hidden">
            <GridReveal />
            <SectionScanLine />

            {/* Document header */}
            <motion.div
              className="flex items-center justify-between mb-6 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-text-light border border-border-light px-2 py-0.5">
                  Dossier
                </span>
                <span className="font-mono text-[9px] text-text-light">
                  REF: JK-<Redacted>2025</Redacted>-001
                </span>
                <StatusIndicator label="FILE" status="ACTIVE" />
              </div>
              <div className="flex items-center gap-4">
                <HexCode />
                <span className="font-mono text-[9px] text-text-light tracking-wider uppercase">
                  UTC <LiveClock className="text-[9px] text-text-light" />
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
            {/* Left — Bio */}
            <div className="px-5 md:px-8 py-12 md:border-r border-border-light">
              {/* Clearance label */}
              <motion.div
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-text-light">
                  Clearance Level: <Redacted>Alpha</Redacted>
                </span>
              </motion.div>

              <RevealLeft delay={0.3}>
                <p className="text-text-dark text-base leading-relaxed mb-6">
                  I&apos;m <Redacted>Jay</Redacted>. I live in <Redacted>Orange County</Redacted>. I study computer engineering at <Redacted>UC Irvine</Redacted>.
                </p>
              </RevealLeft>
              <RevealBlur delay={0.5}>
                <p className="text-text-mid text-base leading-relaxed mb-6">
                  I lift weights six days a week. I run 5Ks on weekends. Staying active keeps my head clear.
                </p>
              </RevealBlur>
              <RevealBlur delay={0.7}>
                <p className="text-text-mid text-base leading-relaxed mb-6">
                  I watch a lot of <Redacted>anime</Redacted>. Current favorites: Frieren, Vinland Saga, Solo Leveling. I keep a running list of shows I want to get to.
                </p>
              </RevealBlur>
              <RevealBlur delay={0.9}>
                <p className="text-text-mid text-base leading-relaxed mb-6">
                  I hunt for good food spots. Ramen, sushi, Korean BBQ, hole-in-the-wall tacos. I track every restaurant I try. I drink <Redacted>matcha</Redacted> daily. I order iced oat milk lattes when I find a good cafe.
                </p>
              </RevealBlur>
              <RevealLeft delay={1.1}>
                <p className="text-text-dark text-base leading-relaxed">
                  I shoot <Redacted>photography</Redacted>. Street, food, travel. I carry my camera when I explore new places. I care about design. How things look matters as much as how they work.
                </p>
              </RevealLeft>

              {/* Synthwave visualizer — reacts to mouse */}
              <RevealBlur delay={1.3}>
                <div className="mt-8 border border-border-light rounded-sm overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-light">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      <span className="font-mono text-[9px] tracking-wider uppercase text-text-light">
                        Signal Monitor
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-text-light/50">
                      FREQ: <Redacted>████</Redacted> MHz
                    </span>
                  </div>
                  <SynthWave />
                </div>
              </RevealBlur>

              {/* Ballistic Calendar */}
              <RevealBlur delay={1.5}>
                <div className="mt-6 border border-border-light rounded-sm overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-light">
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-accent-amber"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="font-mono text-[9px] tracking-wider uppercase text-text-light">
                        Temporal Log
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-text-light/50">
                      ACTIVE
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <BallisticCalendar />
                  </div>
                </div>
              </RevealBlur>
            </div>

            {/* Right — Illustration */}
            <div className="px-5 md:px-8 py-12 flex flex-col items-center">
              {/* HomeVid Illustration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -125 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex justify-center"
              >
                <img
                  src="/homevid.svg"
                  alt="Jay Kim illustration"
                  className="w-full max-w-[1030px]"
                />
              </motion.div>

              {/* Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="-mt-[350px] space-y-3 w-full max-w-[300px]"
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
                  <span className="font-mono text-[9px] text-text-light/40 tracking-wider uppercase">
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
