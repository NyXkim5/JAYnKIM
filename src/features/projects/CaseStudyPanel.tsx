import type { ReactNode } from "react";
import Image from "next/image";
import type { CaseStudy } from "@/data/caseStudies";
import { findEvidence, sourceHref } from "@/features/evidence/registry";

type Decision = CaseStudy["designDecisions"][number];
type Impact = CaseStudy["impact"][number];
type StackGroup = CaseStudy["stack"][number];
type Figure = CaseStudy["images"][number];
type Reflections = NonNullable<CaseStudy["reflections"]>;
type Architecture = NonNullable<CaseStudy["architecture"]>;

const TIMES = { fontFamily: '"Times New Roman", Times, serif' } as const;
const LABEL = "font-mono text-[11px] uppercase tracking-[0.18em]";
const PINK = "#ff69b4";

function Corners() {
  const c = "pointer-events-none absolute size-3 border-[#ff69b4]";
  return (
    <>
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

// Running header: a pink hairline, a zero-padded index and a mono label.
function SectionHead({ index, label }: { index: number; label: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-t border-[#ff69b4] pt-2">
      <span className={`${LABEL} text-[#ff69b4]`}>{String(index).padStart(2, "0")}</span>
      <span className={`${LABEL} text-white/60`}>{label}</span>
    </div>
  );
}

function Masthead({ study }: { study: CaseStudy }) {
  return (
    <header className="border-b border-[#ff69b4] pb-5">
      <div className={`${LABEL} flex justify-between text-white/50`}>
        <span>
          <span style={{ color: PINK }}>[</span>dossier {study.id}<span style={{ color: PINK }}>]</span>
        </span>
        <span>{study.status}</span>
      </div>
      <h2 className="mt-4 text-4xl font-bold uppercase leading-[0.9] tracking-tight md:text-6xl" style={TIMES}>
        {study.title}
      </h2>
      <p className="mt-3 text-lg italic leading-snug text-white/80 md:text-xl" style={TIMES}>{study.subtitle}</p>
    </header>
  );
}

function MetaStrip({ study }: { study: CaseStudy }) {
  const cells: [string, string][] = [
    ["year", study.year],
    ["role", study.role],
    ["status", study.status],
    ["duration", study.duration],
    ["team", study.team],
  ];
  return (
    <dl className="grid grid-cols-2 gap-y-4 border-b border-[#ff69b4] py-4 md:grid-cols-5 md:gap-y-0">
      {cells.map(([k, v]) => (
        <div key={k} className="border-l border-[#ff69b4] pl-3 md:first:border-l-0 md:first:pl-0">
          <dt className={`${LABEL} text-white/50`}>{k}</dt>
          <dd className="mt-1 text-[13px] leading-snug" style={TIMES}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// The overview opens with a printed drop cap, the problem sits beside it in a narrower measure.
function Lede({ overview, problem }: { overview: string; problem: string }) {
  const drop = "first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.75]";
  return (
    <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
      <p className={`${drop} text-[16px] leading-relaxed`} style={TIMES}>{overview}</p>
      <aside className="border-l border-white/15 pl-5">
        <p className={`${LABEL} mb-3 text-white/50`}>problem</p>
        <p className="text-[14px] leading-relaxed text-white/85" style={TIMES}>{problem}</p>
      </aside>
    </div>
  );
}

function Approach({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((step, i) => (
        <li key={step} className="grid grid-cols-[3rem_1fr] gap-3 border-t border-white/10 pt-3">
          <span className="font-mono text-[12px] tracking-wide text-[#ff69b4]">{String(i + 1).padStart(2, "0")}</span>
          <p className="text-[15px] leading-relaxed" style={TIMES}>{step}</p>
        </li>
      ))}
    </ol>
  );
}

function DecisionRow({ d }: { d: Decision }) {
  return (
    <div className="grid gap-3 border-t border-white/10 py-4 md:grid-cols-3 md:gap-6">
      <h4 className="text-[15px] font-bold leading-snug" style={TIMES}>{d.title}</h4>
      <p className="text-[14px] leading-relaxed text-white/85" style={TIMES}>{d.description}</p>
      <p className="text-[14px] leading-relaxed text-white/85" style={TIMES}>{d.outcome}</p>
    </div>
  );
}

function Decisions({ items }: { items: Decision[] }) {
  return (
    <div>
      <div className={`${LABEL} hidden grid-cols-3 gap-6 text-white/50 md:grid`}>
        <span>decision</span><span>why</span><span>outcome</span>
      </div>
      {items.map((d) => <DecisionRow key={d.title} d={d} />)}
    </div>
  );
}

// Every figure comes from the evidence registry. An unknown id renders nothing, never the raw string.
function ImpactRow({ row }: { row: Impact }) {
  const e = findEvidence(row.evidenceId);
  if (!e) return null;
  return (
    <div className="grid gap-2 border-t border-white/10 py-3 md:grid-cols-[10rem_1fr_2fr] md:gap-6">
      <span className={`${LABEL} text-white/50`}>{row.metric}</span>
      <span className="font-mono text-[13px] text-white">
        {e.value}
        {e.unit && <span className="ml-2 text-white/50">{e.unit}</span>}
      </span>
      <span className="text-[13px] leading-relaxed text-white/75" style={TIMES}>
        {row.description}{" "}
        <a href={sourceHref(e)} className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 underline underline-offset-4 hover:text-[#ff69b4]">source</a>
      </span>
    </div>
  );
}

function Stack({ groups }: { groups: StackGroup[] }) {
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.category} className="grid gap-2 md:grid-cols-[10rem_1fr]">
          <span className={`${LABEL} text-white/50`}>{g.category}</span>
          <div className="flex flex-wrap gap-1.5">
            {g.tools.map((t) => (
              <span key={t} className="border border-white/20 px-2 py-0.5 font-mono text-[11px] tracking-wide text-white/85">{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FigureBox({ img }: { img: Figure }) {
  return (
    <figure className="relative">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <Image src={img.src} alt={img.caption} fill sizes="(max-width: 768px) 100vw, 680px" className="object-contain" />
      </div>
      <Corners />
      <figcaption className={`${LABEL} mt-2 tracking-[0.14em] text-white/50`}>{img.caption}</figcaption>
    </figure>
  );
}

function ArchitectureBlock({ arch }: { arch: Architecture }) {
  return (
    <div className="space-y-5">
      <pre className="overflow-x-auto border border-white/15 p-4 font-mono text-[11px] leading-relaxed text-white/80">{arch.dataFlow}</pre>
      <div className="grid gap-5 md:grid-cols-3">
        {arch.sections.map((s) => (
          <div key={s.title}>
            <h4 className="text-[15px] font-bold" style={TIMES}>{s.title}</h4>
            <p className="mt-1 text-[13px] leading-relaxed text-white/80" style={TIMES}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReflectionColumn({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className={`${LABEL} mb-3 border-b border-[#ff69b4] pb-2 text-white/60`}>{label}</p>
      <ul className="space-y-3">
        {items.map((t) => <li key={t} className="text-[14px] leading-relaxed" style={TIMES}>{t}</li>)}
      </ul>
    </div>
  );
}

function ReflectionsBlock({ r }: { r: Reflections }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ReflectionColumn label="worked" items={r.worked} />
      <ReflectionColumn label="different" items={r.different} />
    </div>
  );
}

function ExternalLink({ link }: { link: NonNullable<CaseStudy["link"]> }) {
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${LABEL} inline-block text-white underline underline-offset-4 hover:text-[#ff69b4]`}>
      <span style={{ color: PINK }}>[</span>{link.label}<span style={{ color: PINK }}>]</span>
    </a>
  );
}

// Sections that exist in the study, in dossier order. The index is assigned after filtering so numbering never skips.
function buildSections(study: CaseStudy): { label: string; node: ReactNode }[] {
  const all: ({ label: string; node: ReactNode } | null)[] = [
    { label: "approach", node: <Approach items={study.approach} /> },
    study.designDecisions.length > 0 ? { label: "design decisions", node: <Decisions items={study.designDecisions} /> } : null,
    study.impact.some((r) => findEvidence(r.evidenceId)) ? { label: "impact", node: <div>{study.impact.map((r) => <ImpactRow key={r.evidenceId} row={r} />)}</div> } : null,
    study.architecture ? { label: "architecture", node: <ArchitectureBlock arch={study.architecture} /> } : null,
    study.images.length > 0 ? { label: "figures", node: <div className="space-y-6">{study.images.map((img) => <FigureBox key={img.src} img={img} />)}</div> } : null,
    study.stack.length > 0 ? { label: "stack", node: <Stack groups={study.stack} /> } : null,
    study.reflections ? { label: "reflections", node: <ReflectionsBlock r={study.reflections} /> } : null,
  ];
  return all.filter((s): s is { label: string; node: ReactNode } => s !== null);
}

// A case study laid out as a printed dossier. No navigation, the window around it owns scrolling.
export function CaseStudyPanel({ study }: { study: CaseStudy }) {
  const link = study.link && /^https?:/.test(study.link.url) ? study.link : undefined;
  return (
    <article className="space-y-10 text-white">
      <Masthead study={study} />
      <MetaStrip study={study} />
      <Lede overview={study.overview} problem={study.problem} />
      {buildSections(study).map((s, i) => (
        <section key={s.label} aria-label={s.label}>
          <SectionHead index={i + 1} label={s.label} />
          {s.node}
        </section>
      ))}
      {link && <ExternalLink link={link} />}
    </article>
  );
}
