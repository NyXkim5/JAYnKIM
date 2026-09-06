// src/features/depth/PersonaDepth.tsx
"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";
import { studiesFor, type CaseStudy } from "@/data/caseStudies";
import { SECONDARY_ROUTES } from "@/data/routes";
import { evidenceFor, findEvidence, sourceHref, type Evidence } from "@/features/evidence/registry";
import { artifactsFor, type Artifact } from "@/features/persona/artifacts";
import { PersonaBar } from "@/features/persona/PersonaBar";
import { getPersona, type Ground, type Persona, type PersonaKey } from "@/features/persona/personas";
import { frameFor, snapshotFor } from "@/features/specimen/adapters";
import { Specimen } from "@/features/specimen/Specimen";

type Tone = ReturnType<typeof tone>;
type Snapshot = ReturnType<typeof snapshotFor>;

function tone(ground: Ground) {
  const black = ground === "black";
  return {
    bg: black ? "#0a0a0a" : "#ffffff",
    fg: black ? "text-white" : "text-black",
    dim: black ? "text-white/50" : "text-black/50",
    line: black ? "border-white/10" : "border-black/10",
  };
}

function ArtifactCard({ a, ground }: { a: Artifact; ground: Ground }) {
  const t = tone(ground);
  const e = a.evidenceId ? findEvidence(a.evidenceId) : undefined;
  return (
    <article className={`border-t py-6 ${t.line}`}>
      <p className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.dim}`}>{a.file}</p>
      <h3 className={`mt-2 text-lg font-semibold ${t.fg}`}>{a.title}</h3>
      <p className={`mt-2 max-w-2xl text-[15px] leading-relaxed ${t.fg}`}>{a.what}</p>
      {e && (
        <p className={`mt-3 font-mono text-[12px] tracking-wide ${t.fg}`}>
          <span className="text-[14px]">{e.value}</span>
          {e.unit && <span className={`ml-2 ${t.dim}`}>{e.unit}</span>}
          <span className={`ml-3 ${t.dim}`}>via {e.how}</span>
          {e.public && (
            <a href={sourceHref(e)} className="ml-3 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              source
            </a>
          )}
        </p>
      )}
      {a.caseStudySlug && (
        <TransitionLink href={`/${a.persona}/${a.caseStudySlug}`} className={`mt-3 inline-block font-mono text-[11px] tracking-[0.18em] uppercase underline underline-offset-4 ${t.fg}`}>
          Case study
        </TransitionLink>
      )}
    </article>
  );
}

function ClaimSection({ persona, t }: { persona: Persona; t: Tone }) {
  return (
    <section className="px-5 pb-10 pt-16 md:px-8">
      <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>{String(persona.index).padStart(2, "0")} / {persona.label}</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">{persona.claim}</h1>
    </section>
  );
}

function SpecimenSection({ persona, ground, snapshot, t }: { persona: PersonaKey; ground: Ground; snapshot: Snapshot; t: Tone }) {
  return (
    <section className="px-5 md:px-8">
      <Specimen frame={frameFor(persona)} ground={ground} idle={false} className="h-[50vh] w-full max-w-3xl" />
      <p className={`mt-3 font-mono text-[11px] tracking-[0.14em] uppercase ${t.dim}`}>
        {snapshot ? `${snapshot.source.repo} · ${snapshot.source.path} · ${snapshot.source.commit.slice(0, 7)} · ${snapshot.source.observedAt}` : "In progress. Nothing here is rendered from data yet."}
      </p>
    </section>
  );
}

function ArtifactsSection({ artifacts, ground, t }: { artifacts: Artifact[]; ground: Ground; t: Tone }) {
  return (
    <section className="px-5 pt-14 md:px-8">
      <h2 className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>Artifacts</h2>
      {artifacts.length === 0 && <p className={`mt-4 ${t.dim}`}>In progress.</p>}
      <div className="mt-4">{artifacts.map((a) => <ArtifactCard key={a.title} a={a} ground={ground} />)}</div>
    </section>
  );
}

function EvidenceRow({ e, t }: { e: Evidence; t: Tone }) {
  return (
    <li id={e.id} className={`scroll-mt-16 border-t py-4 ${t.line}`}>
      <p className={`font-mono text-[12px] tracking-wide ${t.fg}`}>
        <span className="text-[14px]">{e.value}</span>
        {e.unit && <span className={`ml-2 ${t.dim}`}>{e.unit}</span>}
      </p>
      <p className={`mt-1 font-mono text-[11px] tracking-[0.1em] ${t.dim}`}>
        {e.repo} · {e.path} · via {e.how} · {e.observedAt}
        {e.public && (
          <a href={sourceHref(e)} className="ml-3 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            source
          </a>
        )}
      </p>
    </li>
  );
}

function EvidenceSection({ persona, ground }: { persona: PersonaKey; ground: Ground }) {
  const t = tone(ground);
  const evidence = evidenceFor(persona);
  return (
    <section className="px-5 pt-14 md:px-8">
      <h2 className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>Evidence</h2>
      <ul className="mt-4">
        {evidence.map((e) => <EvidenceRow key={e.id} e={e} t={t} />)}
      </ul>
    </section>
  );
}

function CaseStudiesSection({ persona, studies, t }: { persona: PersonaKey; studies: CaseStudy[]; t: Tone }) {
  return (
    <section className="px-5 pt-14 md:px-8">
      <h2 className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>Case studies</h2>
      <ul className="mt-4">
        {studies.map((s) => (
          <li key={s.slug} className={`border-t py-4 ${t.line}`}>
            <TransitionLink href={`/${persona}/${s.slug}`} className="flex items-baseline justify-between gap-6">
              <span className="text-lg font-semibold">{s.title}</span>
              <span className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.dim}`}>{s.year}</span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OffDutyFooter({ t }: { t: Tone }) {
  return (
    <footer className={`mt-20 border-t px-5 py-6 md:px-8 ${t.line}`}>
      <span className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.dim}`}>Off duty</span>
      <div className="mt-2 flex gap-6">
        {SECONDARY_ROUTES.map((r) => (
          <TransitionLink key={r.path} href={r.path} className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.fg}`}>
            {r.label}
          </TransitionLink>
        ))}
        <TransitionLink href="/about" className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.fg}`}>About</TransitionLink>
        <TransitionLink href="/contact" className={`font-mono text-[11px] tracking-[0.14em] uppercase ${t.fg}`}>Contact</TransitionLink>
      </div>
    </footer>
  );
}

export function PersonaDepth({ persona }: { persona: PersonaKey }) {
  const p = getPersona(persona);
  const t = tone(p.ground);
  const artifacts = artifactsFor(persona);
  const studies = studiesFor(persona);
  const snapshot = snapshotFor(persona);

  return (
    <main className={`min-h-screen pt-12 ${t.fg}`} style={{ backgroundColor: t.bg }}>
      <PersonaBar persona={persona} />
      <ClaimSection persona={p} t={t} />
      <SpecimenSection persona={persona} ground={p.ground} snapshot={snapshot} t={t} />
      <ArtifactsSection artifacts={artifacts} ground={p.ground} t={t} />
      <EvidenceSection persona={persona} ground={p.ground} />
      <CaseStudiesSection persona={persona} studies={studies} t={t} />
      <OffDutyFooter t={t} />
    </main>
  );
}
