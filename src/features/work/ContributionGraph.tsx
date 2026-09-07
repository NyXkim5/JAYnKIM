import {
  CONTRIBUTIONS_EVIDENCE_ID,
  formatCount,
  GITHUB_URL,
  LEVEL_COLORS,
  levelFor,
  maxCount,
  monthLabels,
  padWeek,
  updatedDate,
  type ContributionDay,
  type Contributions,
} from "./contributions";
import { ScrollToEnd } from "./ScrollToEnd";
import { MONO } from "./style";

const CELL = 11;
const GAP = 3;
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
        <span key={m.col} className={`${MONO} whitespace-nowrap leading-none text-black/55`} style={{ gridColumn: m.col + 2, gridRow: 1 }}>
          {m.label}
        </span>
      ))}
      {[1, 3, 5].map((row) => (
        <span key={row} className="sticky left-0 bg-white pr-1 text-right font-mono text-[10px] uppercase leading-[11px] tracking-[0.1em] text-black/55" style={{ gridColumn: 1, gridRow: row + 2 }}>
          {WEEKDAYS[row]}
        </span>
      ))}
    </>
  );
}

function Caption({ data }: { data: Contributions }) {
  return (
    <div className={`${MONO} mt-5 space-y-2 text-black/55`}>
      <p className="flex flex-wrap gap-x-6 gap-y-1">
        <span>
          <span className="text-black">{formatCount(data.total)}</span> contributions in the last year
        </span>
        <span>updated {updatedDate(data.fetchedAt)}</span>
      </p>
      <p className="flex flex-wrap gap-x-6 gap-y-1">
        <span>{CONTRIBUTIONS_EVIDENCE_ID}</span>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-4 decoration-black/30 hover:decoration-black">
          github.com/{data.login}
        </a>
      </p>
    </div>
  );
}

// GitHub's 53 by 7 heat grid on white, five pink steps, most recent week on the
// right. The data is the committed JSON, never a browser fetch.
export function ContributionGraph({ data }: { data: Contributions }) {
  const cols = data.weeks.length;
  return (
    <section id={CONTRIBUTIONS_EVIDENCE_ID} className="max-w-4xl px-5 pb-20 pt-24 md:px-8">
      <h2 className={`${MONO} text-black/55`}>GitHub</h2>
      <ScrollToEnd className="mt-6 overflow-x-auto pb-2">
        <div
          role="img"
          aria-label={`${formatCount(data.total)} GitHub contributions in the last year`}
          className="inline-grid pr-6"
          style={{ gridTemplateColumns: `2.25rem repeat(${cols}, ${CELL}px)`, gridTemplateRows: `1rem repeat(7, ${CELL}px)`, gap: GAP }}
        >
          <Labels weeks={data.weeks} />
          <Cells weeks={data.weeks} />
        </div>
      </ScrollToEnd>
      <Caption data={data} />
    </section>
  );
}
