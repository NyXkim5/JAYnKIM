"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { usePageTransition } from "@/components/transitions/TransitionProvider";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  slug: string;
  github?: string;
  demo?: string;
  year: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "DroneNexus\nSwarm Dashboard",
    subtitle: "React + TypeScript + Mapbox",
    description: "Real-time drone swarm management dashboard with live map visualization, formation controls, telemetry monitoring, and mission planning for up to 6 autonomous drones.",
    tags: ["React", "TypeScript", "WebSocket", "Mapbox"],
    image: "/drone-dashboard.webp",
    slug: "drone-dashboard",
    github: "https://github.com/NyXkim5/DroneNexus",
    year: "2025",
  },
  {
    id: "02",
    title: "DroneNexus\nVirtual Environment",
    subtitle: "React + Three.js + TypeScript",
    description: "Ground Control Station with 3D equipment preview, sensor noise modeling, flight operations, and real-time performance calculations for drone hardware configuration.",
    tags: ["React", "Three.js", "TypeScript", "3D"],
    image: "/drone-virtual-env.webp",
    slug: "drone-virtual-env",
    github: "https://github.com/NyXkim5/DroneNexus",
    year: "2025",
  },
  {
    id: "03",
    title: "VA.gov\nMVP Redesign",
    subtitle: "Next.js + TypeScript + Tailwind",
    description: "Conceptual MVP redesign of VA.gov for an RFI bid. Modernized veteran portal with benefits dashboard, claims tracking, AI-powered smart insights, and accessibility-first design.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Gov Tech"],
    image: "/va-gov-mvp.webp",
    slug: "va-gov-mvp",
    demo: "https://va-gov-mvp-v1.vercel.app/",
    year: "2025",
  },
];

export default function TimelineContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { navigateTo } = usePageTransition();

  const trackX = useMotionValue(0);
  const cardWidth = 360;
  const cardGap = 48;
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
    trackX.set(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextProject();
      if (e.key === "ArrowLeft") prevProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextProject, prevProject]);

  return (
    <>
      <Navbar />
      <PageTransition>
      <main className="pt-14 min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image src="/prjbackground.webp" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-white/5" />
        </div>

        {/* Header */}
        <div className="relative z-10 text-center pt-12 pb-6">
          <h1 className="font-mono text-[10px] tracking-[0.4em] uppercase text-neutral-500">
            Lab
          </h1>
        </div>

        {/* Carousel */}
        <div className="relative z-10 h-[72vh] flex items-center">
          {/* Arrows */}
          <button
            onClick={prevProject}
            className="absolute left-2 sm:left-4 md:left-10 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-full sm:rounded-none text-neutral-500 hover:text-black transition-colors"
            aria-label="Previous project"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={nextProject}
            className="absolute right-2 sm:right-4 md:right-10 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-full sm:rounded-none text-neutral-500 hover:text-black transition-colors"
            aria-label="Next project"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Track that slides */}
          <div className="w-full overflow-hidden">
            <motion.div
              className="flex items-center"
              style={{
                x: trackX,
                paddingLeft: "calc(50% - 180px)",
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
                      if (isCenter) navigateTo(`/projects/${project.slug}`);
                      else animateTo(index);
                    }}
                  >
                    {/* Editorial Card */}
                    <motion.div
                      className="w-full h-[500px] bg-white flex flex-col relative group overflow-hidden"
                      style={{
                        boxShadow: isCenter ? "0 20px 60px -20px rgba(0,0,0,0.3)" : "0 10px 40px -20px rgba(0,0,0,0.1)",
                      }}
                      whileHover={isCenter ? { y: -8 } : {}}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {/* Image */}
                      <div className="relative w-full h-[250px] bg-neutral-100">
                        <Image
                          src={project.image}
                          alt={project.title.replace("\n", " ")}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 p-6 flex flex-col">
                        {/* Top row */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-light text-black leading-tight whitespace-pre-line">
                              {project.title}
                            </h3>
                          </div>
                          <span className="text-lg font-light text-neutral-300">{project.id}.</span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-neutral-500 leading-relaxed mt-3 flex-1">
                          {project.description}
                        </p>

                        {/* Bottom row */}
                        <div className="flex justify-between items-end border-t border-neutral-100 pt-3 mt-3">
                          <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                            {project.subtitle}
                          </p>
                          <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                            {project.year}
                          </p>
                        </div>
                      </div>

                      {/* Expand indicator */}
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center bg-black/40 rounded-full"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
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
        <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 pb-8">
          <div className="flex gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => animateTo(i)}
                className="p-1"
                aria-label={`Go to project ${i + 1}: ${projects[i].title.replace("\n", " ")}`}
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
          <span className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 hidden sm:inline">
            ← → Navigate
          </span>
        </div>
      </main>
      </PageTransition>
      <Footer />
    </>
  );
}
