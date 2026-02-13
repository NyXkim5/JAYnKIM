"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { cn } from "@/lib/utils";
import { findStudy } from "@/data/caseStudies";
import { NewspaperLayout } from "@/components/projects/NewspaperLayout";

export default function CaseStudyContent({ slug }: { slug: string }) {
  const study = findStudy(slug);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [openDecision, setOpenDecision] = useState<number | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  useEffect(() => {
    if (!lightboxSrc) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxSrc, closeLightbox]);

  if (!study) {
    return (
      <>
        <Navbar />
        <main className="pt-14 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="font-mono text-xs text-text-light tracking-wider mb-4">404</p>
            <h1 className="text-3xl font-bold text-text-black mb-6">Case study not found</h1>
            <TransitionLink
              href="/projects"
              className="font-mono text-[11px] tracking-wider text-text-mid hover:text-text-black transition-colors"
            >
              &larr; Back to Work
            </TransitionLink>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "approach", label: "Approach" },
    ...(study.architecture ? [{ id: "architecture", label: "Architecture" }] : []),
    { id: "design", label: "Design Decisions" },
    ...(study.brandPhilosophy ? [{ id: "brand", label: "Brand & Typography" }] : []),
    { id: "impact", label: "Impact" },
    { id: "stack", label: "Stack" },
    ...(study.reflections ? [{ id: "reflections", label: "Reflections" }] : []),
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-14 relative overflow-hidden">
          {/* Side SVGs */}
          <div className="hidden md:block pointer-events-none absolute inset-0" aria-hidden="true">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ left: "-570px" }}
              className="absolute top-[250px] w-[1200px] select-none"
            >
              <Image src="/writing-2.svg" alt="" width={1200} height={800} unoptimized />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ right: "-550px" }}
              className="absolute top-[1200px] w-[1140px] select-none"
            >
              <Image src="/writing-3.svg" alt="" width={1140} height={800} unoptimized />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{ left: "-530px" }}
              className="absolute top-[2400px] w-[1320px] select-none"
            >
              <Image src="/writing-1.svg" alt="" width={1320} height={800} unoptimized />
            </motion.div>
          </div>

          {/* Hero header */}
          <section className="px-5 md:px-8 pt-16 pb-10 border-b border-border-light">
            <TransitionLink
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider text-text-light hover:text-text-black transition-colors uppercase mb-8"
            >
              <span>&larr;</span> Back to Work
            </TransitionLink>

            <div className="flex items-baseline gap-3 mb-3">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-xs text-text-light"
              >
                {study.id}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-text-black"
              >
                {study.title}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-lg text-text-mid max-w-2xl mb-8"
            >
              {study.subtitle}
            </motion.p>

            {/* Metadata grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { label: "Role", value: study.role },
                { label: "Duration", value: study.duration },
                { label: "Team", value: study.team },
                { label: "Status", value: study.status },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-text-dark">{item.value}</p>
                </div>
              ))}
            </motion.div>

            {study.link && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                {study.link.url === "#" ? (
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-text-light border border-border-light px-4 py-2">
                    {study.link.label}
                  </span>
                ) : (
                  <a
                    href={study.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-text-dark hover:text-text-black border border-border-light px-4 py-2 hover:bg-bg-light transition-colors"
                  >
                    {study.link.label}
                    <span>&#8599;</span>
                  </a>
                )}
              </motion.div>
            )}
          </section>

          {study.layout === "newspaper" ? (
            <NewspaperLayout study={study} openDecision={openDecision} setOpenDecision={setOpenDecision} onImageClick={setLightboxSrc} />
          ) : (
          /* Default two-column layout */
          <section className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-0">
            {/* Left — sticky nav */}
            <div className="hidden md:block border-r border-border-light">
              <nav className="sticky top-14 py-8 px-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                  Sections
                </p>
                <ul className="space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={cn(
                          "block py-1.5 font-mono text-[11px] tracking-wider transition-colors",
                          activeSection === s.id
                            ? "text-text-black font-bold"
                            : "text-text-light hover:text-text-mid"
                        )}
                        onClick={() => setActiveSection(s.id)}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right — content */}
            <div className="px-5 md:px-8 py-10 max-w-3xl">
              {/* Overview */}
              <section id="overview" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                  Overview
                </h2>
                <p className="text-base text-text-dark leading-relaxed">
                  {study.overview}
                </p>

                {/* Hero image */}
                {study.images[0] && (
                  <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                  >
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={study.images[0].src}
                        alt={study.images[0].caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
                      {study.images[0].caption}
                    </figcaption>
                  </motion.figure>
                )}

                {/* Video */}
                {study.video && (
                  <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                  >
                    <video
                      src={study.video.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full rounded-sm"
                    />
                    <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
                      {study.video.caption}
                    </figcaption>
                  </motion.figure>
                )}
              </section>

              {/* Problem */}
              <section id="problem" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                  Problem
                </h2>
                <p className="text-base text-text-dark leading-relaxed">
                  {study.problem}
                </p>
              </section>

              {/* Approach */}
              <section id="approach" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                  Approach
                </h2>
                <ul className="space-y-3">
                  {study.approach.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 text-sm text-text-dark leading-relaxed"
                    >
                      <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      {step}
                    </motion.li>
                  ))}
                </ul>

                {/* Secondary image */}
                {study.images[1] && (
                  <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                  >
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={study.images[1].src}
                        alt={study.images[1].caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
                      {study.images[1].caption}
                    </figcaption>
                  </motion.figure>
                )}
              </section>

              {/* Architecture */}
              {study.architecture && (
                <section id="architecture" className="mb-14">
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                    Architecture
                  </h2>

                  <div className="mb-8">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-3">
                      Data Flow
                    </p>
                    <pre className="font-mono text-[11px] leading-relaxed text-text-dark bg-bg-light border border-border-light p-6 overflow-x-auto">
                      {study.architecture.dataFlow}
                    </pre>
                  </div>

                  <div className="space-y-8">
                    {study.architecture.sections.map((section, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="border-l-2 border-border-light pl-6"
                      >
                        <h3 className="text-sm font-bold text-text-black mb-3">
                          {section.title}
                        </h3>
                        <div className="text-sm text-text-dark leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {study.architecture.writeupLink && (
                    <div className="mt-8 pt-6 border-t border-border-light">
                      <Link
                        href={study.architecture.writeupLink}
                        className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-text-mid hover:text-text-black transition-colors"
                      >
                        Read the full technical writeup
                        <span className="group-hover:translate-x-1 transition-transform">&#8599;</span>
                      </Link>
                    </div>
                  )}
                </section>
              )}

              {/* Design Decisions */}
              <section id="design" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                  Design Decisions
                </h2>
                <div className="space-y-0">
                  {study.designDecisions.map((decision, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="border-t border-border-light py-6"
                    >
                      <button
                        onClick={() =>
                          setOpenDecision(
                            openDecision === i ? null : i
                          )
                        }
                        aria-expanded={openDecision === i}
                        className="w-full text-left flex items-start gap-4"
                      >
                        <span className="font-mono text-[10px] text-text-light mt-1 shrink-0">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-text-black mb-1">
                            {decision.title}
                          </h3>
                          <p className="text-sm text-text-mid leading-relaxed">
                            {decision.description}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-text-light shrink-0 mt-1">
                          {openDecision === i ? "−" : "+"}
                        </span>
                      </button>
                      <AnimatePresence>
                        {openDecision === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 ml-10 pl-4 border-l-2 border-border-light">
                              <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-2">
                                Outcome
                              </p>
                              <p className="text-sm text-text-dark leading-relaxed">
                                {decision.outcome}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Third image if exists */}
                {study.images[2] && (
                  <motion.figure
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                  >
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={study.images[2].src}
                        alt={study.images[2].caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
                      {study.images[2].caption}
                    </figcaption>
                  </motion.figure>
                )}
              </section>

              {/* Brand & Typography */}
              {study.brandPhilosophy && (
                <section id="brand" className="mb-14">
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                    Brand & Typography
                  </h2>

                  <p className="text-base text-text-dark leading-relaxed mb-10">
                    {study.brandPhilosophy.intro}
                  </p>

                  {/* Typography */}
                  <div className="mb-10">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                      Typography
                    </p>
                    <div className="space-y-6">
                      <div className="border-l-2 border-border-light pl-6">
                        <h3 className="text-sm font-bold text-text-black mb-2">Headings</h3>
                        <p className="text-sm text-text-dark leading-relaxed">
                          {study.brandPhilosophy.typography.heading}
                        </p>
                      </div>
                      <div className="border-l-2 border-border-light pl-6">
                        <h3 className="text-sm font-bold text-text-black mb-2">Body</h3>
                        <p className="text-sm text-text-dark leading-relaxed">
                          {study.brandPhilosophy.typography.body}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="mb-10">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                      Color Palette
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {study.brandPhilosophy.palette.map((color) => (
                        <motion.div
                          key={color.name}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="border border-border-light"
                        >
                          <div
                            className="h-16 w-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="p-3">
                            <div className="flex items-baseline justify-between mb-1">
                              <p className="text-xs font-bold text-text-black">{color.name}</p>
                              <p className="font-mono text-[10px] text-text-light">{color.hex}</p>
                            </div>
                            <p className="text-[11px] text-text-mid leading-snug">{color.usage}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Design Principles */}
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                      Design Principles
                    </p>
                    <div className="space-y-4">
                      {study.brandPhilosophy.principles.map((principle, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="flex gap-4 text-sm text-text-dark leading-relaxed"
                        >
                          <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                            {(i + 1).toString().padStart(2, "0")}
                          </span>
                          {principle}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Impact */}
              <section id="impact" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                  Impact
                </h2>
                <div className="grid grid-cols-2 gap-0 border-t border-l border-border-light">
                  {study.impact.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border-r border-b border-border-light p-6"
                    >
                      <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-2">
                        {item.metric}
                      </p>
                      <p className="text-3xl md:text-4xl font-bold text-text-black tracking-tight mb-2">
                        {item.value}
                      </p>
                      <p className="text-xs text-text-mid leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Stack */}
              <section id="stack" className="mb-14">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                  Technology Stack
                </h2>
                <div className="space-y-6">
                  {study.stack.map((group) => (
                    <div key={group.category}>
                      <p className="font-mono text-[10px] tracking-wider text-text-mid uppercase mb-3">
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-3 py-1.5 rounded-sm border border-border-light font-mono text-[10px] tracking-wider text-text-dark uppercase hover:bg-bg-light transition-colors"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reflections */}
              {study.reflections && (
                <section id="reflections" className="mb-14">
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                    Reflections
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                        What Worked
                      </p>
                      <div className="space-y-4">
                        {study.reflections.worked.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="flex gap-4 text-sm text-text-dark leading-relaxed"
                          >
                            <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                              {(i + 1).toString().padStart(2, "0")}
                            </span>
                            {item}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                        What I Would Do Differently
                      </p>
                      <div className="space-y-4">
                        {study.reflections.different.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="flex gap-4 text-sm text-text-dark leading-relaxed"
                          >
                            <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                              {(i + 1).toString().padStart(2, "0")}
                            </span>
                            {item}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Next project */}
              {study.nextProject && (
                <section className="border-t border-border-light pt-10">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                    Next Case Study
                  </p>
                  <TransitionLink
                    href={`/projects/${study.nextProject}`}
                    className="group inline-flex items-center gap-3"
                  >
                    <span className="text-2xl md:text-3xl font-bold text-text-black group-hover:text-text-mid transition-colors">
                      {findStudy(study.nextProject)?.title}
                    </span>
                    <span className="text-text-light group-hover:text-text-black transition-colors">
                      &#8599;
                    </span>
                  </TransitionLink>
                </section>
              )}
            </div>
          </section>
          )}
        </main>
      </PageTransition>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 cursor-zoom-out"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              aria-label="Close image preview"
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white font-mono text-sm bg-black/40 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-full max-h-full w-full h-full"
            >
              <Image
                src={lightboxSrc}
                alt="Expanded project image"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
