"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { studyHref } from "@/data/caseStudies";
import { findEvidence, sourceHref } from "@/features/evidence/registry";
import type { Project, ProjectImage, ProjectSpec } from "./projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const TIMES = { fontFamily: '"Times New Roman", Times, serif' } as const;

function Corners() {
  const c = "absolute size-3 border-[#ff69b4]";
  return (
    <>
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

function Figure({ img }: { img: ProjectImage }) {
  return (
    <figure className="relative">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 720px" className="object-contain" />
      </div>
      <Corners />
      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">{img.alt}</figcaption>
    </figure>
  );
}

function SpecRow({ spec }: { spec: ProjectSpec }) {
  const e = findEvidence(spec.evidenceId);
  if (!e) return null;
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-white/10 py-2 font-mono text-[12px] tracking-wide">
      <span className="uppercase text-white/50">{spec.label}</span>
      <span className="text-right text-white">
        {e.value}
        {e.unit && <span className="ml-2 text-white/50">{e.unit}</span>}
      </span>
    </div>
  );
}

function Links({ project }: { project: Project }) {
  const first = project.specs[0] && findEvidence(project.specs[0].evidenceId);
  const cls = "font-mono text-[11px] uppercase tracking-[0.18em] text-white underline underline-offset-4 hover:text-[#ff69b4]";
  return (
    <div className="flex flex-wrap gap-6 pt-2">
      {project.caseStudySlug && <TransitionLink href={studyHref(project.caseStudySlug)} className={cls}>Case study</TransitionLink>}
      {first && first.public && (
        <a href={sourceHref(first)} target="_blank" rel="noopener noreferrer" className={cls}>Source</a>
      )}
    </div>
  );
}

type Props = { project: Project; onBack: () => void };

// A project opened as a window over the tree: scrolls inside, closes on back.
export function ProjectWindow({ project, onBack }: Props) {
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    backRef.current?.focus();
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 8 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="fixed left-1/2 top-1/2 z-50 flex max-h-[86vh] w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2 flex-col border border-white/15 bg-[#0a0a0a] text-white"
    >
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
        <button ref={backRef} type="button" onClick={onBack} className="font-mono text-[11px] uppercase tracking-[0.18em] text-white outline-none hover:text-[#ff69b4] focus-visible:text-[#ff69b4]">
          <span className="text-[#ff69b4]">[</span>← back<span className="text-[#ff69b4]">]</span>
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff69b4]">{project.status}</span>
      </header>
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        <h2 id="project-title" className="text-3xl font-bold uppercase leading-none tracking-tight md:text-4xl" style={TIMES}>
          {project.title}
        </h2>
        <p className="max-w-xl text-[15px] leading-relaxed" style={TIMES}>{project.claim}</p>
        {project.images.map((img) => <Figure key={img.src} img={img} />)}
        {project.specs.length > 0 && <div>{project.specs.map((s) => <SpecRow key={s.evidenceId} spec={s} />)}</div>}
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">caveat: {project.caveat}</p>
        <Links project={project} />
      </div>
    </motion.div>
  );
}
