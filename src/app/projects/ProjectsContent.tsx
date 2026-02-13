"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { GridReveal } from "@/components/ui/GridReveal";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { RevealUp, RevealBlur, RevealLine } from "@/components/ui/RevealAnimations";
import { LiveClock } from "@/components/ui/LiveClock";
import { StatusIndicator, SecurityBadge, HexCode, SectionScanLine } from "@/components/ui/CyberAccents";
import { ScribbleButton } from "@/components/ui/ScribbleButton";

const projects = [
  {
    id: "001",
    slug: "archv",
    title: "Archv",
    description: "Founded AI compliance startup. Built ML inference on NVIDIA GPUs for document classification. HIPAA and SOC 2 compliant from day one. Signed paying law student users in Q1. Cut review time by 71%. Accepted into NVIDIA Inception.",
    tags: ["Python", "PyTorch", "CUDA", "TypeScript", "React", "AWS"],
    status: "Active",
    year: "2025 – Present",
  },
  {
    id: "002",
    slug: "optum",
    title: "Optum, UnitedHealth Group",
    description: "Building production ML pipelines for healthcare data processing. Owning model deployment and monitoring across cloud infrastructure. Python, AWS, Kubernetes. Systems serve 150M+ patients.",
    tags: ["Python", "AI/ML", "AWS", "Kubernetes", "Healthcare"],
    status: "Current",
    year: "Feb 2026 – Present",
  },
  {
    id: "003",
    slug: "medvanta",
    title: "MedVanta Platform",
    description: "Built VantaStat, a mobile app connecting orthopaedic patients to specialists in minutes. Shipped analytics dashboards, HIPAA-compliant backend, and workflow automation saving ~5 hours of admin time per week per practice.",
    tags: ["React", "Python", "FastAPI", "Figma", "HIPAA"],
    status: "Shipped",
    year: "2023 – 2024",
  },
  {
    id: "004",
    slug: "cactus",
    title: "Cactus",
    description: "Built the event ingestion pipeline and React dashboards for a growth platform. Implemented A/B testing infrastructure processing user behavior data. Integrated third-party marketing APIs for campaign automation.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "APIs"],
    status: "Active",
    year: "2025 – Present",
  },
];

export default function ProjectsContent() {
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
              className="flex items-center justify-between mb-4 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-light border border-border-light px-2 py-0.5">
                  Operations Log
                </span>
                <StatusIndicator label="DB" status="SYNC" />
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline"><HexCode /></span>
                <span className="font-mono text-[10px] text-text-light tracking-wider uppercase">
                  <LiveClock className="text-[10px] text-text-light" />
                </span>
              </div>
            </motion.div>
            <RevealUp className="relative z-10">
              <div className="flex items-baseline justify-between">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-black">
                  <ScrambleText text="Work" delay={100} speed={35} stagger={40} />
                </h1>
                <span className="font-mono text-xs text-text-light tracking-wider">
                  {projects.length.toString().padStart(3, "0")} Entries
                </span>
              </div>
            </RevealUp>
            <RevealBlur delay={0.3}>
              <p className="text-sm text-text-mid mt-4 max-w-xl">
                Select a role to view details.
              </p>
            </RevealBlur>
            <motion.div
              className="flex items-center gap-4 mt-4 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <SecurityBadge level="CLEARANCE-A" />
            </motion.div>
          </section>

          <RevealLine delay={0.4} />

          {/* Table header */}
          <div className="hidden md:grid grid-cols-[50px_1fr_1fr_100px_80px] gap-4 px-5 md:px-8 py-3 border-b border-border-light">
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase">No</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase">Name</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase">Description</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase">Status</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase text-right">Year</span>
          </div>

          {/* Project rows */}
          {projects.map((project, i) => (
            <TransitionLink key={project.id} href={`/projects/${project.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group grid grid-cols-1 md:grid-cols-[50px_1fr_1fr_100px_80px] gap-2 md:gap-4 px-5 md:px-8 py-6 border-b border-border-light hover:bg-bg-light transition-colors"
              >
                <span className="font-mono text-xs text-text-light">
                  {project.id}
                </span>

                <div>
                  <span className="text-base font-semibold text-text-black group-hover:text-text-dark transition-colors inline-flex items-center gap-2">
                    {project.title}
                    <span className="text-text-light group-hover:text-text-black transition-colors text-xs">&#8599;</span>
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2 md:hidden">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-text-light">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block">
                  <p className="text-sm text-text-mid leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-text-light">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="font-mono text-[11px] text-text-mid uppercase tracking-wider hidden md:block">
                  {project.status}
                </span>

                <span className="font-mono text-[11px] text-text-light text-right hidden md:block">
                  {project.year}
                </span>

                {/* Mobile: status + year inline */}
                <div className="flex items-center gap-3 md:hidden">
                  <span className="font-mono text-[11px] text-text-mid uppercase tracking-wider">
                    {project.status}
                  </span>
                  <span className="font-mono text-[11px] text-text-light">
                    {project.year}
                  </span>
                </div>
              </motion.div>
            </TransitionLink>
          ))}

          {/* Link to Lab */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="px-5 md:px-8 pt-24 pb-16 flex justify-center"
          >
            <ScribbleButton href="/lab" text="VISIT LAB" />
          </motion.div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
