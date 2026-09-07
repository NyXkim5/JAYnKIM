// Every string here is verbatim from Jay's LinkedIn card, read 2026-09-06.
// No dates, descriptions, or outcomes beyond what the card says. Newest
// start first, which sortNewestFirst and the tests both enforce.

export type Role = {
  key: string;
  role: string;
  company: string;
  short: string;
  start: string;
  end: string | null;
  meta: readonly string[];
  summary: string;
  study?: string;
  projects?: boolean;
};

export type Education = { school: string; degree: string; field: string };

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export const ROLES: readonly Role[] = [
  {
    key: "stealth",
    role: "Forward Deployed Engineer",
    company: "Stealth Startup",
    short: "Stealth",
    start: "2026-08",
    end: null,
    meta: ["Washington DC-Baltimore Area", "Hybrid"],
    summary: "Technical strategy, proposal development, government systems architecture.",
  },
  {
    key: "optum",
    role: "AI/ML Software Engineer",
    company: "Optum",
    short: "Optum",
    start: "2026-02",
    end: null,
    meta: ["Full-time"],
    summary: "AI/ML, RFP automation.",
    study: "optum",
  },
  {
    key: "cactus",
    role: "Open Source Contributor",
    company: "Cactus (YC S25)",
    short: "Cactus",
    start: "2025-12",
    end: "2026-04",
    meta: [],
    summary: "On-device AI inference engine.",
    study: "cactus",
    projects: true,
  },
  {
    key: "archv",
    role: "AI/ML Software Engineer",
    company: "Archv AI",
    short: "Archv AI",
    start: "2025-08",
    end: "2026-07",
    meta: ["Irvine, California", "Hybrid", "Full-time"],
    summary: "Full stack.",
    study: "archv",
  },
  {
    key: "medvanta",
    role: "Software Engineer",
    company: "MedVanta",
    short: "MedVanta",
    start: "2024-05",
    end: "2025-07",
    meta: ["Full-time"],
    summary: "Software development.",
    study: "medvanta",
  },
];

export const EDUCATION: Education = {
  school: "UC Irvine",
  degree: "BS/BA",
  field: "Computer Engineering and Philosophy",
};

export function monthIndex(ym: string): number {
  const [year, month] = ym.split("-").map(Number);
  return year * 12 + (month - 1);
}

export function formatMonth(ym: string): string {
  const [year, month] = ym.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

export function sortNewestFirst(roles: readonly Role[]): Role[] {
  return [...roles].sort((a, b) => monthIndex(b.start) - monthIndex(a.start));
}

function endIndex(role: Role, now: string): number {
  return monthIndex(role.end ?? now);
}

function overlaps(a: Role, b: Role, now: string): boolean {
  return monthIndex(a.start) <= endIndex(b, now) && monthIndex(b.start) <= endIndex(a, now);
}

// First-fit lanes, so roles that overlap in time sit on separate rows of the axis.
export function assignLanes(roles: readonly Role[], now: string): Map<string, number> {
  const lanes: Role[][] = [];
  const out = new Map<string, number>();
  for (const role of roles) {
    let lane = lanes.findIndex((held) => held.every((h) => !overlaps(h, role, now)));
    if (lane === -1) lane = lanes.push([]) - 1;
    lanes[lane].push(role);
    out.set(role.key, lane);
  }
  return out;
}

export type AxisSpan = { key: string; lane: number; colStart: number; colEnd: number; current: boolean };
export type AxisYear = { col: number; label: string };
export type Axis = { spans: AxisSpan[]; cols: number; lanes: number; years: AxisYear[]; from: string };

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

// One column per January after the first month, labelled with its year.
function januaries(first: number, last: number): AxisYear[] {
  const out: AxisYear[] = [];
  for (let i = first + 1; i <= last; i++) {
    if (i % 12 === 0) out.push({ col: i - first, label: String(i / 12) });
  }
  return out;
}

// Column 0 is the earliest start month and the last column is the month of
// `now`, so time runs left to right. A span covers a role's start column
// through its end column, or through the last column while it is current.
export function buildAxis(roles: readonly Role[], now: string): Axis {
  const last = monthIndex(now);
  const first = roles.length ? Math.min(...roles.map((r) => monthIndex(r.start))) : last;
  const cols = Math.max(1, last - first + 1);
  const lanes = assignLanes(sortNewestFirst(roles), now);
  const spans = roles.map((role) => ({
    key: role.key,
    lane: lanes.get(role.key) ?? 0,
    colStart: clamp(monthIndex(role.start) - first, 0, cols - 1),
    colEnd: clamp(endIndex(role, now) - first, 0, cols - 1),
    current: role.end === null,
  }));
  const [year, month] = [Math.floor(first / 12), (first % 12) + 1];
  return {
    spans,
    cols,
    lanes: Math.max(0, ...spans.map((s) => s.lane)) + 1,
    years: januaries(first, last),
    from: `${year}-${String(month).padStart(2, "0")}`,
  };
}
