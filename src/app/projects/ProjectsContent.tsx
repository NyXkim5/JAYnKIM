"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { Reveal, RevealLine } from "@/components/ui/RevealAnimations";
import { ScribbleButton } from "@/components/ui/ScribbleButton";

const projects = [
  {
    id: "001",
    slug: "archv",
    title: "Archv",
    description: "Founded AI document review startup for regulated industries. 40+ user interviews. Chose RAG over fine-tuning for built-in citations. Targeted law students as the entry point into institutional adoption. Review time dropped 71%. NVIDIA Inception accepted.",
    tags: ["Python", "PyTorch", "CUDA", "TypeScript", "React", "AWS"],
    status: "Active",
    year: "2025 – Present",
  },
  {
    id: "002",
    slug: "optum",
    title: "Optum, UnitedHealth Group",
    description: "The business receives tens of thousands of RFPs. I build the platform that automates them: AI document parsing that turns dense RFP documents into structured, answerable questions, and one workspace where every team communicates and completes responses together. Improving parsing accuracy is the core ongoing work.",
    tags: ["Python", "AI/ML", "Document Parsing", "Healthcare"],
    status: "Current",
    year: "Feb 2026 – Present",
  },
  {
    id: "003",
    slug: "medvanta",
    title: "MedVanta Platform",
    description: "Built VantaStat to collapse the timeline from orthopaedic injury to specialist consultation from days to minutes. Shipped analytics dashboards, HIPAA-compliant backend, and workflow automation saving ~5 hours of admin time per week per practice.",
    tags: ["React", "Python", "FastAPI", "Figma", "HIPAA"],
    status: "Shipped",
    year: "2024 – 2025",
  },
  {
    id: "004",
    slug: "cactus",
    title: "Cactus",
    description: "Built the event pipeline, analytics dashboards, and experimentation infrastructure for a growth platform. Events process in under a second. Dashboard queries that took 12 seconds now take 200ms. The team stopped debating what happened and started debating what to do about it.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "D3.js"],
    status: "Active",
    year: "2025 – Present",
  },
];

export default function ProjectsContent() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-16">
          {/* Header */}
          <section className="px-5 md:px-8 pt-16 pb-12 border-b border-border-light">
            <Reveal>
              <div className="flex items-baseline justify-between">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-text-black">
                  Work
                </h1>
                <span className="font-mono text-xs text-text-light tracking-wider">
                  {projects.length.toString().padStart(3, "0")} Entries
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm text-text-mid mt-4 max-w-xl">
                Select a role to view details.
              </p>
            </Reveal>
          </section>

          <RevealLine delay={0.2} />

          {/* Table header */}
          <div className="hidden md:grid grid-cols-[50px_1fr_1fr_100px_80px] gap-4 px-5 md:px-8 py-4 border-b border-border-light">
            <span className="font-mono text-[11px] tracking-[0.2em] text-text-light uppercase">No</span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-text-light uppercase">Name</span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-text-light uppercase">Description</span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-text-light uppercase">Status</span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-text-light uppercase text-right">Year</span>
          </div>

          {/* Project rows */}
          {projects.map((project, i) => (
            <TransitionLink key={project.id} href={`/projects/${project.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="group grid grid-cols-1 md:grid-cols-[50px_1fr_1fr_100px_80px] gap-2 md:gap-4 px-5 md:px-8 py-8 border-b border-border-light hover:bg-bg-light transition-colors"
              >
                <span className="font-mono text-xs text-text-light">
                  {project.id}
                </span>

                <div>
                  <span className="text-lg font-semibold text-text-black group-hover:text-text-dark transition-colors inline-flex items-center gap-2">
                    {project.title}
                    <span className="text-text-light group-hover:text-text-black transition-colors text-xs">&#8599;</span>
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2 md:hidden">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[11px] text-text-light">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block">
                  <p className="text-base text-text-mid leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[11px] text-text-light">
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
            transition={{ delay: 0.6, duration: 0.5 }}
            className="px-5 md:px-8 pt-24 pb-16 flex justify-center"
          >
            <ScribbleButton href="/lab" text="VISIT PROJECTS" />
          </motion.div>
        </main>
      </PageTransition>
      <Footer compact />
    </>
  );
}
