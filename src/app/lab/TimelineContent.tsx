"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
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
  const [cardWidth, setCardWidth] = useState(560);
  const [cardHeight, setCardHeight] = useState(660);
  const [imageHeight, setImageHeight] = useState(340);
  const [topOffset, setTopOffset] = useState(200);
  const [cardGap, setCardGap] = useState(32);

  useEffect(() => {
    const updateSizes = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 400) {
        setCardWidth(w - 32);
        setCardHeight(Math.min(h - 180, 480));
        setImageHeight(180);
        setTopOffset(40);
        setCardGap(16);
      } else if (w < 640) {
        setCardWidth(w - 48);
        setCardHeight(Math.min(h - 180, 520));
        setImageHeight(200);
        setTopOffset(60);
        setCardGap(20);
      } else if (w < 1024) {
        setCardWidth(480);
        setCardHeight(600);
        setImageHeight(280);
        setTopOffset(120);
        setCardGap(28);
      } else {
        setCardWidth(560);
        setCardHeight(660);
        setImageHeight(340);
        setTopOffset(200);
        setCardGap(32);
      }
    };
    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);
  const totalCardWidth = cardWidth + cardGap;

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
    <div className="relative min-h-screen flex flex-col">
      {/* Background — covers entire page including footer */}
      <div className="absolute inset-0 z-0">
        <Image src="/prjbackground.webp" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-white/5" />
      </div>

      <Navbar />
      <PageTransition>
      <main className="flex-1 flex items-center relative overflow-hidden" style={{ paddingTop: `calc(4rem + ${topOffset}px)`, paddingBottom: "60px" }}>

        {/* Carousel */}
        <div className="relative z-10 flex items-center w-full">
          {/* Arrows */}
          <button
            onClick={prevProject}
            className="absolute left-2 sm:left-4 md:left-10 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-full sm:rounded-none text-neutral-500 hover:text-black transition-colors"
            aria-label="Previous project"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={nextProject}
            className="absolute right-2 sm:right-4 md:right-10 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-full sm:rounded-none text-neutral-500 hover:text-black transition-colors"
            aria-label="Next project"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Track that slides */}
          <div className="w-full overflow-hidden">
            <motion.div
              className="flex items-center"
              style={{
                x: trackX,
                paddingLeft: `calc(50% - ${cardWidth / 2}px)`,
              }}
            >
              {projects.map((project, index) => {
                const isCenter = index === currentIndex;

                return (
                  <motion.div
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    aria-label={isCenter ? `View ${project.title.replace("\n", " ")} project` : `Select ${project.title.replace("\n", " ")}`}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (isCenter) navigateTo(`/projects/${project.slug}`); else animateTo(index); } }}
                    className="flex-shrink-0 cursor-pointer"
                    style={{ width: cardWidth, marginRight: cardGap }}
                    animate={{
                      scale: isCenter ? 1 : 0.9,
                      opacity: isCenter ? 1 : 0.5,
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    onClick={() => {
                      if (isCenter) navigateTo(`/projects/${project.slug}`);
                      else animateTo(index);
                    }}
                  >
                    {/* Editorial Card */}
                    <motion.div
                      className="w-full bg-white flex flex-col relative group overflow-hidden"
                      style={{ height: cardHeight }}
                      style={{
                        boxShadow: isCenter ? "0 20px 60px -20px rgba(0,0,0,0.3)" : "0 10px 40px -20px rgba(0,0,0,0.1)",
                      }}
                      whileHover={isCenter ? { y: -8 } : {}}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {/* Image */}
                      <div className="relative w-full bg-neutral-100" style={{ height: imageHeight }}>
                        <Image
                          src={project.image}
                          alt={project.title.replace("\n", " ")}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 p-4 sm:p-6 flex flex-col">
                        {/* Top row */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-light text-black leading-tight whitespace-pre-line">
                              {project.title}
                            </h2>
                          </div>
                          <span className="text-xl font-light text-neutral-300">{project.id}.</span>
                        </div>

                        {/* Description */}
                        <p className="text-[13px] text-neutral-500 leading-relaxed mt-3 flex-1">
                          {project.description}
                        </p>

                        {/* Bottom row */}
                        <div className="flex justify-between items-end border-t border-neutral-100 pt-3 mt-3">
                          <p className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
                            {project.subtitle}
                          </p>
                          <p className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
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

      </main>
      </PageTransition>
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-neutral-200 px-5 md:px-8">
        <div className="flex items-center justify-center py-3 gap-5">
          <a href="https://github.com/NyXkim5" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/joonhyuknkim/" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors">LinkedIn</a>
          <a href="mailto:joonhyuknkim@gmail.com" className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 hover:text-black transition-colors">Email</a>
        </div>
      </footer>
    </div>
  );
}
