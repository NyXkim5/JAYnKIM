"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { GridReveal } from "@/components/ui/GridReveal";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { RevealUp, RevealBlur, RevealLine } from "@/components/ui/RevealAnimations";
import { LiveClock } from "@/components/ui/LiveClock";
import { StatusIndicator, SecurityBadge, HexCode, SectionScanLine } from "@/components/ui/CyberAccents";

const projects = [
  {
    id: "001",
    slug: "optum",
    title: "Optum — AI/ML Systems",
    description: "Building ML-powered healthcare systems at UnitedHealth Group. Working on AI infrastructure at enterprise scale — processing millions of healthcare records with Python, cloud infrastructure, and ML pipelines.",
    tags: ["Python", "AI/ML", "AWS", "Healthcare", "Enterprise"],
    status: "Current",
    year: "2025",
  },
  {
    id: "002",
    slug: "cactus",
    title: "Cactus — Growth Platform",
    description: "Built UI components and analytics dashboards for a growth/marketing platform. Designed data visualizations, implemented A/B testing infrastructure, and created API integrations for marketing automation.",
    tags: ["UI Development", "React", "Data Viz", "Analytics", "APIs"],
    status: "Shipped",
    year: "2024",
  },
  {
    id: "003",
    slug: "archv",
    title: "Archv",
    description: "Founded AI compliance startup. Designed the product end-to-end in Figma, built the full-stack platform (TypeScript/React/Node.js), and deployed ML inference pipelines on NVIDIA GPUs. Acquired paying law firm clients, reduced review time by ~50%.",
    tags: ["Product Design", "AI/ML", "TypeScript", "React", "CUDA", "Figma"],
    status: "Founded",
    year: "2024",
  },
  {
    id: "004",
    slug: "medvanta",
    title: "MedVanta Platform",
    description: "Designed and built analytics dashboards for clinical operations. Led UI/UX design in Figma, then implemented in React. HIPAA-compliant backend handling PHI. Workflow automation reducing admin time by hours/week per practice.",
    tags: ["UI/UX Design", "Figma", "React", "Python", "HIPAA"],
    status: "Shipped",
    year: "2024",
  },
  {
    id: "005",
    slug: "uav",
    title: "UAV Autonomous Flight System",
    description: "Flight control software in C/C++ integrated with PX4 autopilot via MAVLink protocol. Computer vision pipeline using Python and OpenCV for real-time object detection. Sensor fusion combining GPS, IMU, and camera data.",
    tags: ["C/C++", "Python", "OpenCV", "PX4", "MAVLink"],
    status: "Competition",
    year: "2023",
  },
];

export default function ProjectsPage() {
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
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-text-light border border-border-light px-2 py-0.5">
                  Operations Log
                </span>
                <StatusIndicator label="DB" status="SYNC" />
              </div>
              <div className="flex items-center gap-4">
                <HexCode />
                <span className="font-mono text-[9px] text-text-light tracking-wider uppercase">
                  <LiveClock className="text-[9px] text-text-light" />
                </span>
              </div>
            </motion.div>
            <RevealUp className="relative z-10">
              <div className="flex items-baseline justify-between">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-black">
                  <ScrambleText text="Work" delay={100} speed={35} stagger={40} />
                </h1>
                <span className="font-mono text-xs text-text-light tracking-wider">
                  {projects.length.toString().padStart(3, "0")} Roles
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
            <span className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase">No</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase">Project</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase">Description</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase">Status</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-text-light uppercase text-right">Year</span>
          </div>

          {/* Project rows */}
          {projects.map((project, i) => (
            <Link key={project.id} href={`/projects/${project.slug}`}>
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

                <span className="font-mono text-[11px] text-text-mid uppercase tracking-wider">
                  {project.status}
                </span>

                <span className="font-mono text-[11px] text-text-light text-right">
                  {project.year}
                </span>
              </motion.div>
            </Link>
          ))}

          {/* Cool button to Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="px-5 md:px-8 py-12 flex justify-center"
          >
            <Link href="/timeline">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 opacity-90" />

                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />

                {/* Content */}
                <div className="relative px-8 py-5 flex items-center gap-4">
                  <div>
                    <p className="text-white/70 text-xs font-mono uppercase tracking-wider mb-1">
                      Side Projects
                    </p>
                    <p className="text-white text-lg font-bold">
                      View my projects &amp; experiments
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
