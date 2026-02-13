"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { CaseStudy, findStudy } from "@/data/caseStudies";

export function NewspaperLayout({
  study,
  openDecision,
  setOpenDecision,
  onImageClick,
}: {
  study: CaseStudy;
  openDecision: number | null;
  setOpenDecision: (v: number | null) => void;
  onImageClick: (src: string) => void;
}) {
  return (
    <section className="px-5 md:px-8 lg:px-12 py-10 max-w-6xl mx-auto">
      {/* Full-width: Overview + media */}
      <div className="mb-12">
        <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
          Overview
        </h2>
        <p className="text-base text-text-dark leading-relaxed max-w-3xl">
          {study.overview}
        </p>

        {study.images.length > 0 && (
          <div className="mt-8 space-y-6">
            {study.images.map((img, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={study.slug === "archv" && i === 0 ? "flex flex-col items-center" : ""}
              >
                <div
                  className={
                    study.slug === "archv" && i === 0
                      ? "relative w-48 md:w-56 aspect-square"
                      : "relative w-full aspect-[16/9] cursor-zoom-in"
                  }
                  onClick={() => study.slug !== "archv" || i !== 0 ? onImageClick(img.src) : undefined}
                >
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    sizes={study.slug === "archv" && i === 0 ? "224px" : "(max-width: 768px) 100vw, 900px"}
                    className={study.slug === "archv" && i === 0 ? "object-contain" : "object-cover"}
                  />
                </div>
                <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
                  {img.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}

        {study.video && (
          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-col items-center"
          >
            <video
              src={study.video.src}
              autoPlay
              loop
              muted
              playsInline
              className="max-w-xs md:max-w-sm rounded-sm"
            />
            <figcaption className="font-mono text-[10px] text-text-light tracking-wider mt-3">
              {study.video.caption}
            </figcaption>
          </motion.figure>
        )}
      </div>

      {/* Newspaper two-column grid */}
      <div className="grid md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-0">
        {/* LEFT COLUMN */}
        <div>
          {/* Problem */}
          <div className="mb-12 border-t border-border-light pt-6">
            <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
              Problem
            </h2>
            <p className="text-[15px] text-text-dark leading-[1.75]">
              {study.problem}
            </p>
          </div>

          {/* Approach */}
          <div className="mb-12 border-t border-border-light pt-6">
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
                  className="flex gap-3 text-[14px] text-text-dark leading-relaxed"
                >
                  <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Architecture */}
          {study.architecture && (
            <div className="mb-12 border-t border-border-light pt-6">
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light">
                  Architecture
                </h2>
                <span className="font-mono text-[10px] tracking-wider text-text-light/60 uppercase">
                  V1 · Early Design
                </span>
              </div>
              <div className="mb-8">
                <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-3">
                  Data Flow
                </p>
                <pre className="font-mono text-[10px] leading-relaxed text-text-dark bg-bg-light border border-border-light p-5 overflow-x-auto">
                  {study.architecture.dataFlow}
                </pre>
              </div>
              <div className="space-y-6">
                {study.architecture.sections.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="border-l-2 border-border-light pl-5"
                  >
                    <h3 className="text-sm font-bold text-text-black mb-2">
                      {section.title}
                    </h3>
                    <div className="text-[13px] text-text-dark leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>
              {study.architecture.writeupLink && (
                <div className="mt-6 pt-4 border-t border-border-light">
                  <Link
                    href={study.architecture.writeupLink}
                    className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-text-mid hover:text-text-black transition-colors"
                  >
                    Read the full technical writeup
                    <span className="group-hover:translate-x-1 transition-transform">&#8599;</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Reflections */}
          {study.reflections && (
            <div className="mb-12 border-t border-border-light pt-6">
              <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                Reflections
              </h2>
              <div className="space-y-8">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                    What Worked
                  </p>
                  <div className="space-y-3">
                    {study.reflections.worked.map((item, i) => (
                      <div key={i} className="flex gap-3 text-[13px] text-text-dark leading-relaxed">
                        <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                    What I Would Do Differently
                  </p>
                  <div className="space-y-3">
                    {study.reflections.different.map((item, i) => (
                      <div key={i} className="flex gap-3 text-[13px] text-text-dark leading-relaxed">
                        <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Brand & Typography */}
          {study.brandPhilosophy && (
            <div className="mb-12 border-t border-border-light pt-6">
              <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                Design & Typography
              </h2>
              <p className="text-[15px] text-text-dark leading-[1.75] mb-8">
                {study.brandPhilosophy.intro}
              </p>

              {/* Typography */}
              <div className="mb-8">
                <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                  Typography
                </p>
                <div className="space-y-5">
                  <div className="border-l-2 border-border-light pl-5">
                    <h3 className="text-sm font-bold text-text-black mb-2">Headings</h3>
                    <p className="text-[13px] text-text-dark leading-relaxed">
                      {study.brandPhilosophy.typography.heading}
                    </p>
                  </div>
                  <div className="border-l-2 border-border-light pl-5">
                    <h3 className="text-sm font-bold text-text-black mb-2">Body</h3>
                    <p className="text-[13px] text-text-dark leading-relaxed">
                      {study.brandPhilosophy.typography.body}
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="mb-8">
                <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-4">
                  Color Palette
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {study.brandPhilosophy.palette.map((color) => (
                    <motion.div
                      key={color.name}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="border border-border-light"
                    >
                      <div className="h-14 w-full" style={{ backgroundColor: color.hex }} />
                      <div className="p-2.5">
                        <div className="flex items-baseline justify-between mb-0.5">
                          <p className="text-[11px] font-bold text-text-black">{color.name}</p>
                          <p className="font-mono text-[10px] text-text-light">{color.hex}</p>
                        </div>
                        <p className="text-[10px] text-text-mid leading-snug">{color.usage}</p>
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
                <div className="space-y-3">
                  {study.brandPhilosophy.principles.map((principle, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 text-[13px] text-text-dark leading-relaxed"
                    >
                      <span className="font-mono text-[10px] text-text-light mt-0.5 shrink-0">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      {principle}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Design Decisions */}
          <div className="mb-12 border-t border-border-light pt-6">
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
                  className="border-t border-border-light py-5"
                >
                  <button
                    onClick={() => setOpenDecision(openDecision === i ? null : i)}
                    aria-expanded={openDecision === i}
                    className="w-full text-left flex items-start gap-3"
                  >
                    <span className="font-mono text-[10px] text-text-light mt-1 shrink-0">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-text-black mb-1">
                        {decision.title}
                      </h3>
                      <p className="text-[13px] text-text-mid leading-relaxed">
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
                        <div className="mt-3 ml-8 pl-4 border-l-2 border-border-light">
                          <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-2">
                            Outcome
                          </p>
                          <p className="text-[13px] text-text-dark leading-relaxed">
                            {decision.outcome}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="mb-12 border-t border-border-light pt-6">
            <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
              Technology Stack
            </h2>
            <div className="space-y-5">
              {study.stack.map((group) => (
                <div key={group.category}>
                  <p className="font-mono text-[10px] tracking-wider text-text-mid uppercase mb-2">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 rounded-sm border border-border-light font-mono text-[10px] tracking-wider text-text-dark uppercase"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-width: Impact */}
      <div className="border-t border-border-light pt-6 mb-12">
        <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
          Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-t border-l border-border-light">
          {study.impact.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-r border-b border-border-light p-5"
            >
              <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-2">
                {item.metric}
              </p>
              <p className="text-3xl font-bold text-text-black tracking-tight mb-1">
                {item.value}
              </p>
              <p className="text-[11px] text-text-mid leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next project */}
      {study.nextProject && (
        <div className="border-t border-border-light pt-10">
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
        </div>
      )}
    </section>
  );
}
