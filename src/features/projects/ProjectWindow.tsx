"use client";

import { useState } from "react";
import Image from "next/image";
import { findStudy } from "@/data/caseStudies";
import { findEvidence, sourceHref } from "@/features/evidence/registry";
import { CaseStudyPanel } from "./CaseStudyPanel";
import type { Project, ProjectImage, ProjectSpec } from "./projects";
import { WindowChrome, type WindowTab } from "./WindowChrome";

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
    <figure>
      <div className="relative aspect-video w-full bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 1100px" loading="eager" className="object-contain" />
        </div>
        <Corners />
      </div>
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
  if (!first || !first.public) return null;
  const cls = "font-mono text-[11px] uppercase tracking-[0.18em] text-white underline underline-offset-4 hover:text-[#ff69b4]";
  return (
    <div className="flex flex-wrap gap-6 pt-2">
      <a href={sourceHref(first)} target="_blank" rel="noopener noreferrer" className={cls}>Source</a>
    </div>
  );
}

// The overview tab: status, title, claim, figures, spec rows, caveat, links.
function Overview({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff69b4]">{project.status}</span>
        <h2 id="project-title" className="text-3xl font-bold uppercase leading-none tracking-tight md:text-4xl" style={TIMES}>
          {project.title}
        </h2>
      </div>
      <p className="max-w-xl text-[15px] leading-relaxed" style={TIMES}>{project.claim}</p>
      {project.images.map((img) => <Figure key={img.src} img={img} />)}
      {project.specs.length > 0 && <div>{project.specs.map((s) => <SpecRow key={s.evidenceId} spec={s} />)}</div>}
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">caveat: {project.caveat}</p>
      {project.privateRepo && (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
          access: the repository is private. The address bar links to it, GitHub asks for access.
        </p>
      )}
      <Links project={project} />
    </div>
  );
}

function CaseTab({ slug }: { slug: string }) {
  const study = findStudy(slug);
  if (!study) {
    return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">case study not found: {slug}</p>;
  }
  return <CaseStudyPanel study={study} />;
}

function tabsFor(project: Project): readonly WindowTab[] {
  return project.caseStudySlug ? ["overview", "case"] : ["overview"];
}

type Props = { project: Project; onBack: () => void; enlarged?: boolean; onEnlarge?: () => void };

// A project's window: browser chrome on top, the body under it. From md up
// the window caps at 86vh and the body scrolls inside it. Below md the page
// scrolls the whole window and the chrome sticks under the persona bar.
// Motion and the enlarged layout live in the explorer, so the panel itself
// stays plain.
export function ProjectWindow({ project, onBack, enlarged = false, onEnlarge }: Props) {
  const [tab, setTab] = useState<WindowTab>("overview");
  const showCase = tab === "case" && project.caseStudySlug !== undefined;

  return (
    <div
      role="dialog"
      aria-label={project.title}
      className="flex flex-col border border-white/15 bg-[#0a0a0a] text-white md:max-h-[86vh]"
    >
      <WindowChrome
        url={project.url}
        title={project.title}
        tabs={tabsFor(project)}
        active={tab}
        onTab={setTab}
        onBack={onBack}
        isPrivate={project.privateRepo === true}
        enlarged={enlarged}
        onEnlarge={onEnlarge}
      />
      <div className="px-5 py-6 md:flex-1 md:overflow-y-auto md:overscroll-contain">
        {showCase && project.caseStudySlug ? <CaseTab slug={project.caseStudySlug} /> : <Overview project={project} />}
      </div>
    </div>
  );
}
