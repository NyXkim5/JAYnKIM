import { TransitionLink } from "@/components/transitions/TransitionLink";
import { studyHref } from "@/data/caseStudies";
import { buildAxis, formatMonth, sortNewestFirst, type Axis, type AxisSpan, type Education, type Role } from "./roles";
import { ScrollToEnd } from "./ScrollToEnd";
import { MONO, PINK, TIMES } from "./style";

const CARD = "relative w-60 shrink-0 border-t border-black/15 pt-4 md:w-auto md:min-w-44 md:flex-1";

function pct(n: number, of: number): string {
  return `${(n / of) * 100}%`;
}

function Present() {
  return (
    <span data-present className="whitespace-nowrap">
      <span style={{ color: PINK }}>[</span>present<span style={{ color: PINK }}>]</span>
    </span>
  );
}

function DateLabel({ role, className = "" }: { role: Role; className?: string }) {
  return (
    <p className={`${MONO} ${className}`}>
      {formatMonth(role.start)} <span aria-hidden>→</span> {role.end ? formatMonth(role.end) : <Present />}
    </p>
  );
}

// The rail, now horizontal: the first month at the left, present at the right,
// a pink hairline at every January and at the present edge.
function AxisHeader({ axis }: { axis: Axis }) {
  return (
    <div className={`${MONO} relative h-5 text-black/55`}>
      <span className="absolute left-0 hidden md:inline">{formatMonth(axis.from)}</span>
      {axis.years.map((y) => (
        <span key={y.col} className="absolute -translate-x-1/2" style={{ left: pct(y.col, axis.cols) }}>
          {y.label}
        </span>
      ))}
      <span className="absolute right-0 text-black">
        <Present />
      </span>
    </div>
  );
}

function LaneBar({ span, axis, label }: { span: AxisSpan; axis: Axis; label: string }) {
  const style = { left: pct(span.colStart, axis.cols), width: pct(span.colEnd - span.colStart + 1, axis.cols) };
  const anchor = span.current ? "right-0 text-right" : "left-0";
  return (
    <div aria-hidden className="absolute bottom-0 h-6" style={style}>
      <span className={`absolute bottom-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-black/55 ${anchor}`}>{label}</span>
      <div className="absolute bottom-0 left-0 h-px w-full bg-black" />
      <div className="absolute bottom-0 left-0 h-2 w-px" style={{ backgroundColor: PINK }} />
    </div>
  );
}

function Lanes({ axis, roles }: { axis: Axis; roles: readonly Role[] }) {
  const labels = new Map(roles.map((r) => [r.key, r.short]));
  const ticks = [...axis.years.map((y) => pct(y.col, axis.cols)), "100%"];
  return (
    <div className="relative mt-2 border-t border-black/15">
      {ticks.map((left) => (
        <div key={left} aria-hidden className="absolute inset-y-0 w-px -translate-x-full" style={{ left, backgroundColor: PINK }} />
      ))}
      {Array.from({ length: axis.lanes }, (_, lane) => (
        <div key={lane} className="relative h-8">
          {axis.spans
            .filter((s) => s.lane === lane)
            .map((s) => <LaneBar key={s.key} span={s} axis={axis} label={labels.get(s.key) ?? s.key} />)}
        </div>
      ))}
    </div>
  );
}

function EntryLinks({ role }: { role: Role }) {
  if (!role.study && !role.projects) return null;
  const link = "underline underline-offset-4 decoration-black/30 hover:decoration-black";
  return (
    <p className={`${MONO} mt-4 flex gap-5`}>
      {role.study && <TransitionLink href={studyHref(role.study)} className={link}>Case study</TransitionLink>}
      {role.projects && <TransitionLink href="/projects" className={link}>Projects</TransitionLink>}
    </p>
  );
}

function Tick() {
  return <span aria-hidden className="absolute -top-px left-0 h-px w-6" style={{ backgroundColor: PINK }} />;
}

function Entry({ role }: { role: Role }) {
  return (
    <li className={CARD}>
      <Tick />
      <DateLabel role={role} className="text-black/70" />
      <h3 style={TIMES} className="mt-3 text-xl font-bold leading-tight">{role.role}</h3>
      <p style={TIMES} className="mt-0.5 text-base leading-snug">{role.company}</p>
      {role.meta.length > 0 && <p className={`${MONO} mt-2 text-black/55`}>{role.meta.join(" · ")}</p>}
      <p style={TIMES} className="mt-3 text-[15px] leading-relaxed">{role.summary}</p>
      <EntryLinks role={role} />
    </li>
  );
}

function EducationEntry({ education }: { education: Education }) {
  return (
    <li className={CARD}>
      <Tick />
      <p className={`${MONO} text-black/70`}>Education</p>
      <h3 style={TIMES} className="mt-3 text-xl font-bold leading-tight">{education.school}</h3>
      <p style={TIMES} className="mt-0.5 text-base leading-snug">
        {education.degree}, {education.field}
      </p>
    </li>
  );
}

// A horizontal timeline. The axis on top is proportional, one column per
// month, with overlapping roles on separate lanes. The cards below run in the
// same direction, education at the far left as the earliest entry and the
// newest role at the right, and the strip opens scrolled to that newest card
// on narrow screens.
export function Timeline({ roles, education, now }: { roles: readonly Role[]; education: Education; now: string }) {
  const ordered = sortNewestFirst(roles).reverse();
  const axis = buildAxis(roles, now);
  return (
    <div>
      <AxisHeader axis={axis} />
      <Lanes axis={axis} roles={roles} />
      <ScrollToEnd className="mt-10 overflow-x-auto pb-4">
        <ol className="flex gap-6 md:gap-8">
          <EducationEntry education={education} />
          {ordered.map((role) => <Entry key={role.key} role={role} />)}
        </ol>
      </ScrollToEnd>
    </div>
  );
}
