import {
  COMMITS_EVIDENCE_ID,
  CONTRIBUTIONS_EVIDENCE_ID,
  formatCount,
  GITHUB_URL,
  LEVEL_COLORS,
  levelFor,
  maxCount,
  monthLabels,
  padWeek,
  RESTRICTED_EVIDENCE_ID,
  updatedDate,
  type ContributionDay,
  type Contributions,
} from "./contributions";
import { ScrollToEnd } from "./ScrollToEnd";
import { MONO } from "./style";

const CELL = 14;
const GAP = 4;
const WEEKDAYS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

function cellTitle(day: ContributionDay): string {
  const noun = day.count === 1 ? "contribution" : "contributions";
  return `${formatCount(day.count)} ${noun} on ${day.date}`;
}

function Cell({ day, col, row, max }: { day: ContributionDay | null; col: number; row: number; max: number }) {
  const place = { gridColumn: col + 2, gridRow: row + 2 };
  if (!day) return <div aria-hidden style={place} />;
  const level = levelFor(day.count, max);
  return <div data-level={level} title={cellTitle(day)} style={{ ...place, backgroundColor: LEVEL_COLORS[level] }} />;
}

function Cells({ weeks }: { weeks: ContributionDay[][] }) {
  const max = maxCount(weeks);
  return weeks.map((week, col) =>
    padWeek(week).map((day, row) => <Cell key={`${col}-${row}`} day={day} col={col} row={row} max={max} />),
  );
}

function Labels({ weeks }: { weeks: ContributionDay[][] }) {
  return (
    <>
      {monthLabels(weeks).map((m) => (
        <span key={m.col} className={`${MONO} whitespace-nowrap text-left leading-none text-white/55`} style={{ gridColumn: m.col + 2, gridRow: 1 }}>
          {m.label}
        </span>
      ))}
      {[1, 3, 5].map((row) => (
        <span
          key={row}
          className="sticky left-0 bg-[#0a0a0a] pr-1.5 text-right font-mono text-[11px] uppercase tracking-[0.1em] text-white/55"
          style={{ gridColumn: 1, gridRow: row + 2, lineHeight: `${CELL}px` }}
        >
          {WEEKDAYS[row]}
        </span>
      ))}
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span>
      <span className="text-[15px] text-white">{formatCount(value)}</span> {label}
    </span>
  );
}

// Three numbers, three registry ids. `commits` is public repositories only,
// GitHub reports private activity as one restricted count without a type.
function Caption({ data }: { data: Contributions }) {
  return (
    <div className={`${MONO} mt-6 space-y-2 text-white/55`}>
      <p className="flex flex-wrap justify-center gap-x-6 gap-y-1">
        <Stat value={data.total} label="contributions in the last year" />
        <Stat value={data.commits} label="commits in public repos" />
        <Stat value={data.restricted} label="in private repos" />
      </p>
      <p className="flex flex-wrap justify-center gap-x-6 gap-y-1">
        <span>updated {updatedDate(data.fetchedAt)}</span>
        <span>{CONTRIBUTIONS_EVIDENCE_ID}</span>
        <span>{COMMITS_EVIDENCE_ID}</span>
        <span>{RESTRICTED_EVIDENCE_ID}</span>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">
          github.com/{data.login}
        </a>
      </p>
    </div>
  );
}

// GitHub's 53 by 7 heat grid on white, five pink steps, most recent week on the
// right, centred under the timeline. The data is the committed JSON, never a
// browser fetch.
export function ContributionGraph({ data }: { data: Contributions }) {
  const cols = data.weeks.length;
  return (
    <section id={CONTRIBUTIONS_EVIDENCE_ID} className="mx-auto max-w-6xl px-5 pb-24 pt-24 text-center md:px-8">
      <h2 className={`${MONO} text-white/55`}>GitHub</h2>
      <ScrollToEnd className="mt-8 overflow-x-auto pb-2">
        <div
          role="img"
          aria-label={`${formatCount(data.total)} GitHub contributions in the last year, ${formatCount(data.commits)} commits in public repos`}
          className="inline-grid pr-6 text-left"
          style={{ gridTemplateColumns: `2.5rem repeat(${cols}, ${CELL}px)`, gridTemplateRows: `1rem repeat(7, ${CELL}px)`, gap: GAP }}
        >
          <Labels weeks={data.weeks} />
          <Cells weeks={data.weeks} />
        </div>
      </ScrollToEnd>
      <Caption data={data} />
    </section>
  );
}
