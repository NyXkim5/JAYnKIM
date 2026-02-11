"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  video?: string;
  year: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Telemetry\nDashboard",
    subtitle: "React + WebSockets + D3.js",
    description: "Real-time data visualization for IoT sensors. Custom D3.js charts with WebSocket streaming.",
    tags: ["React", "WebSockets", "D3.js", "Node.js"],
    github: "https://github.com/NyXkim5",
    demo: "#",
    year: "2024",
  },
  {
    id: "02",
    title: "iOS\nScheduler",
    subtitle: "Swift + Core Data",
    description: "Native iOS productivity app with intelligent scheduling and calendar sync.",
    tags: ["Swift", "iOS", "Core Data", "UIKit"],
    github: "https://github.com/NyXkim5",
    year: "2024",
  },
  {
    id: "03",
    title: "Document\nEditor",
    subtitle: "React + Slate.js",
    description: "Collaborative rich text editor with real-time sync and multiple cursors.",
    tags: ["React", "Slate.js", "TypeScript", "WebSockets"],
    github: "https://github.com/NyXkim5",
    demo: "#",
    year: "2023",
  },
  {
    id: "04",
    title: "Component\nLibrary",
    subtitle: "React + Storybook",
    description: "Design system with 40+ accessible components. WCAG 2.1 AA compliant.",
    tags: ["React", "Storybook", "TypeScript", "CSS"],
    github: "https://github.com/NyXkim5",
    demo: "#",
    year: "2023",
  },
  {
    id: "05",
    title: "CV\nPipeline",
    subtitle: "Python + OpenCV + CUDA",
    description: "Computer vision pipeline for real-time object detection at 60fps.",
    tags: ["Python", "OpenCV", "CUDA", "PyTorch"],
    github: "https://github.com/NyXkim5",
    video: "#",
    year: "2023",
  },
  {
    id: "06",
    title: "Flight\nController",
    subtitle: "C++ + PX4 + MAVLink",
    description: "Autonomous flight control with Kalman filtering and waypoint navigation.",
    tags: ["C++", "Embedded", "PX4", "MAVLink"],
    github: "https://github.com/NyXkim5",
    video: "#",
    year: "2022",
  },
];

// Expanded project modal
function ExpandedProject({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative z-10 w-full max-w-5xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-[300px] md:h-[500px] bg-neutral-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[120px] font-light text-neutral-200">{project.id}</span>
            </div>
            {project.video && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full border border-black flex items-center justify-center cursor-pointer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </motion.div>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">Project</span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">{project.year}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-black mb-2 whitespace-pre-line leading-tight">
                {project.title}
              </h2>
              <p className="font-mono text-xs text-neutral-400 uppercase tracking-wider mb-8">
                {project.subtitle}
              </p>

              <p className="text-base text-neutral-600 leading-relaxed mb-8">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-neutral-200 mt-8">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="flex-1 font-mono text-xs uppercase tracking-wider text-center py-3 border border-neutral-300 text-black hover:bg-black hover:text-white hover:border-black transition-colors">
                  View Code
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  className="flex-1 font-mono text-xs uppercase tracking-wider text-center py-3 bg-black text-white hover:bg-neutral-800 transition-colors">
                  Live Demo
                </a>
              )}
              {project.video && (
                <a href={project.video} target="_blank" rel="noopener noreferrer"
                  className="flex-1 font-mono text-xs uppercase tracking-wider text-center py-3 bg-black text-white hover:bg-neutral-800 transition-colors">
                  Watch Video
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

  const trackX = useMotionValue(0);
  const cardWidth = 280;
  const cardGap = 40;
  const totalCardWidth = cardWidth + cardGap;

  const currentProject = projects[currentIndex];

  // Smooth animate to new position
  const animateTo = useCallback((newIndex: number) => {
    const targetX = -newIndex * totalCardWidth;
    animate(trackX, targetX, {
      type: "spring",
      stiffness: 60,
      damping: 20,
      mass: 1,
    });
    setCurrentIndex(newIndex);
  }, [trackX, totalCardWidth]);

  const nextProject = useCallback(() => {
    const newIndex = (currentIndex + 1) % projects.length;
    animateTo(newIndex);
  }, [currentIndex, animateTo]);

  const prevProject = useCallback(() => {
    const newIndex = (currentIndex - 1 + projects.length) % projects.length;
    animateTo(newIndex);
  }, [currentIndex, animateTo]);

  // Initialize
  useEffect(() => {
    trackX.set(-currentIndex * totalCardWidth);
  }, []);

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedProject) return;
      if (e.key === "ArrowRight") nextProject();
      if (e.key === "ArrowLeft") prevProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextProject, prevProject, expandedProject]);

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image src="/prjbackground.png" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-white/5" />
        </div>

        {/* Header */}
        <div className="relative z-10 text-center pt-12 pb-6">
          <h1 className="font-mono text-[10px] tracking-[0.4em] uppercase text-neutral-500">
            Side Projects
          </h1>
        </div>

        {/* Carousel */}
        <div className="relative z-10 h-[72vh] flex items-center">
          {/* Arrows */}
          <button
            onClick={prevProject}
            className="absolute left-4 md:left-10 z-20 w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={nextProject}
            className="absolute right-4 md:right-10 z-20 w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Track that slides */}
          <div className="w-full overflow-hidden">
            <motion.div
              className="flex items-center"
              style={{
                x: trackX,
                paddingLeft: "calc(50vw - 140px)",
              }}
            >
              {projects.map((project, index) => {
                const isCenter = index === currentIndex;

                return (
                  <motion.div
                    key={project.id}
                    className="flex-shrink-0 cursor-pointer"
                    style={{ width: cardWidth, marginRight: cardGap }}
                    animate={{
                      scale: isCenter ? 1 : 0.85,
                      opacity: isCenter ? 1 : 0.4,
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    onClick={() => {
                      if (isCenter) setExpandedProject(project);
                      else animateTo(index);
                    }}
                  >
                    {/* Editorial Card */}
                    <motion.div
                      className="w-full h-[420px] bg-white p-6 flex flex-col relative group"
                      style={{
                        boxShadow: isCenter ? "0 20px 60px -20px rgba(0,0,0,0.3)" : "0 10px 40px -20px rgba(0,0,0,0.1)",
                      }}
                      whileHover={isCenter ? { y: -8 } : {}}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {/* Top row */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-light text-black leading-tight whitespace-pre-line">
                            {project.title}
                          </h3>
                          <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider mt-1">
                            project
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-light text-black">{project.id}.</span>
                          <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider mt-1">
                            no.
                          </p>
                        </div>
                      </div>

                      {/* Middle - description */}
                      <div className="flex-1 flex items-center py-6">
                        <div>
                          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                            {project.description}
                          </p>
                          {/* Plus icon */}
                          <div className="w-8 h-8 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-300">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Bottom row */}
                      <div className="flex justify-between items-end border-t border-neutral-100 pt-4">
                        <div>
                          <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider mb-1">
                            stack
                          </p>
                          <p className="text-sm font-light text-black">
                            {project.subtitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider mb-1">
                            year
                          </p>
                          <p className="text-xl font-light text-black leading-none">
                            {project.year.slice(2)}
                          </p>
                        </div>
                      </div>

                      {/* Expand indicator */}
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-300 group-hover:text-black transition-colors">
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="21" y1="3" x2="14" y2="10" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex justify-center items-center gap-8 pb-8">
          <div className="flex gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => animateTo(i)}
                className="p-1"
              >
                <motion.div
                  className="bg-neutral-300"
                  animate={{
                    width: i === currentIndex ? 20 : 6,
                    height: 6,
                    backgroundColor: i === currentIndex ? "#000" : "#d4d4d4",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </button>
            ))}
          </div>
          <span className="font-mono text-[9px] tracking-wider uppercase text-neutral-400">
            ← → Navigate
          </span>
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {expandedProject && (
          <ExpandedProject project={expandedProject} onClose={() => setExpandedProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
