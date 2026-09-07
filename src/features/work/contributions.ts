import { MONTHS } from "./roles";

export type ContributionDay = { date: string; count: number };

// Shape of src/features/work/data/contributions.json, written by
// scripts/work/fetch_contributions.py and refreshed by the contributions workflow.
export type Contributions = {
  login: string;
  fetchedAt: string;
  total: number;
  commits: number;
  weeks: ContributionDay[][];
};

export const GITHUB_URL = "https://github.com/NyXkim5";
export const CONTRIBUTIONS_EVIDENCE_ID = "github.contributions.total";

// White ground for zero, then #ff69b4 at 25, 50, 75 and 100 percent over white.
export const LEVEL_COLORS = ["#ebebeb", "#ffdaec", "#ffb4da", "#ff8fc7", "#ff69b4"] as const;
export type Level = 0 | 1 | 2 | 3 | 4;

export function levelFor(count: number, max: number): Level {
  if (count <= 0 || max <= 0) return 0;
  return Math.min(4, Math.ceil((count / max) * 4)) as Level;
}

export function maxCount(weeks: ContributionDay[][]): number {
  return weeks.reduce((m, week) => week.reduce((n, d) => Math.max(n, d.count), m), 0);
}

function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

// Seven slots per week, Sunday first, null where the calendar has no day.
export function padWeek(week: ContributionDay[]): (ContributionDay | null)[] {
  const slots: (ContributionDay | null)[] = Array.from({ length: 7 }, () => null);
  for (const day of week) slots[weekday(day.date)] = day;
  return slots;
}

export type MonthLabel = { col: number; label: string };

// One label per month change, dropping any label within two columns of the next
// so the first partial month never collides with the month after it.
export function monthLabels(weeks: ContributionDay[][]): MonthLabel[] {
  const changes: MonthLabel[] = [];
  let prev = "";
  weeks.forEach((week, col) => {
    const first = week[0];
    if (!first) return;
    const month = first.date.slice(5, 7);
    if (month !== prev) changes.push({ col, label: MONTHS[Number(month) - 1] });
    prev = month;
  });
  return changes.filter((c, i) => i === changes.length - 1 || changes[i + 1].col - c.col >= 3);
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

export function updatedDate(fetchedAt: string): string {
  return fetchedAt.slice(0, 10);
}

export function currentMonth(fetchedAt: string): string {
  return fetchedAt.slice(0, 7);
}
