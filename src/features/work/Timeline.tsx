import { TransitionLink } from "@/components/transitions/TransitionLink";
import { studyHref } from "@/data/caseStudies";
import { buildRail, formatMonth, sortNewestFirst, type Education, type RailSpan, type Role } from "./roles";
import { MONO, PINK, TIMES } from "./style";

const LANE_GAP = 6;
const RAIL = "col-start-1 md:col-start-2";
const BODY = "col-start-2 md:col-start-3";

function Present() {
  return (
    <span data-present className="whitespace-nowrap">
      <span style={{ color: PINK }}>[</span>present<span style={{ color: PINK }}>]</span>
    </span>
  );
}

function DateLabel({ role, className }: { role: Role; className: string }) {
  return (
    <p className={`${MONO} whitespace-nowrap ${className}`}>
      {formatMonth(role.start)} <span aria-hidden>→</span> {role.end ? formatMonth(role.end) : <Present />}
    </p>
  );
}

function SpanBar({ span }: { span: RailSpan }) {
  return (
    <div
      aria-hidden
      className={`${RAIL} w-px justify-self-start bg-black`}
      style={{ gridRow: `${span.rowStart + 1} / ${span.rowEnd + 2}`, marginLeft: span.lane * LANE_GAP }}
    />
  );
}

function Tick({ row }: { row: number }) {
  return <div aria-hidden className={`${RAIL} h-px self-start`} style={{ gridRow: row + 1, backgroundColor: PINK }} />;
}

function EntryLinks({ role }: { role: Role }) {
  if (!role.study && !role.projects) return null;
  const link = "underline underline-offset-4 decoration-black/30 hover:decoration-black";
  return (
    <p className={`${MONO} mt-4 flex gap-6`}>
      {role.study && <TransitionLink href={studyHref(role.study)} className={link}>Case study</TransitionLink>}
      {role.projects && <TransitionLink href="/projects" className={link}>Projects</TransitionLink>}
    </p>
  );
}

function Entry({ role, row }: { role: Role; row: number }) {
  return (
    <>
      <div className="col-start-1 hidden pr-6 pt-[7px] text-right md:block" style={{ gridRow: row + 1 }}>
        <DateLabel role={role} className="" />
      </div>
      <Tick row={row} />
      <article className={`${BODY} pb-12 pl-5 md:pl-7`} style={{ gridRow: row + 1 }}>
        <DateLabel role={role} className="mb-2 md:hidden" />
        <h3 style={TIMES} className="text-2xl font-bold leading-tight">{role.role}</h3>
        <p style={TIMES} className="mt-0.5 text-lg leading-snug">{role.company}</p>
        {role.meta.length > 0 && <p className={`${MONO} mt-2 text-black/55`}>{role.meta.join(" · ")}</p>}
        <p style={TIMES} className="mt-3 max-w-xl text-[17px] leading-relaxed">{role.summary}</p>
        <EntryLinks role={role} />
      </article>
    </>
  );
}

function EducationEntry({ education, row }: { education: Education; row: number }) {
  return (
    <>
      <p className={`${MONO} col-start-1 hidden pr-6 pt-[7px] text-right md:block`} style={{ gridRow: row + 1 }}>
        Education
      </p>
      <Tick row={row} />
      <article className={`${BODY} pl-5 md:pl-7`} style={{ gridRow: row + 1 }}>
        <p className={`${MONO} mb-2 md:hidden`}>Education</p>
        <h3 style={TIMES} className="text-2xl font-bold leading-tight">{education.school}</h3>
        <p style={TIMES} className="mt-0.5 text-lg leading-snug">
          {education.degree}, {education.field}
        </p>
      </article>
    </>
  );
}

// A month-per-row grid. Column one holds the mono dates from md up, the rail
// sits beside it, and the entries fill the rest. Rows without an entry stay
// thin, so the rail reads as a compressed calendar rather than a scale.
export function Timeline({ roles, education, now }: { roles: readonly Role[]; education: Education; now: string }) {
  const ordered = sortNewestFirst(roles);
  const rail = buildRail(ordered, now);
  const rows = rail.rows + 1;
  return (
    <div className="grid grid-cols-[1.25rem_1fr] md:grid-cols-[14rem_1.75rem_1fr]" style={{ gridAutoRows: "minmax(0.5rem, auto)" }}>
      <div aria-hidden className={`${RAIL} w-px justify-self-start bg-black/10`} style={{ gridRow: `1 / ${rows + 1}` }} />
      <Tick row={0} />
      {rail.spans.map((span) => <SpanBar key={span.key} span={span} />)}
      {ordered.map((role, i) => <Entry key={role.key} role={role} row={rail.spans[i].rowEnd} />)}
      <EducationEntry education={education} row={rail.rows} />
    </div>
  );
}
