// Every string here is verbatim from Jay's LinkedIn card, read 2026-09-06.
// No dates, descriptions, or outcomes beyond what the card says. Newest
// start first, which sortNewestFirst and the tests both enforce.

export type Role = {
  key: string;
  role: string;
  company: string;
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
    start: "2026-08",
    end: null,
    meta: ["Washington DC-Baltimore Area", "Hybrid"],
    summary: "Technical strategy, proposal development, government systems architecture.",
  },
  {
    key: "optum",
    role: "AI/ML Software Engineer",
    company: "Optum",
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

// First-fit lanes, so roles that overlap in time sit side by side on the rail.
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

export type RailSpan = { key: string; lane: number; rowStart: number; rowEnd: number; current: boolean };
export type Rail = { spans: RailSpan[]; rows: number; lanes: number };

// Row 0 is the month of `now`, each row below it one month older. A span runs
// from the month a role ended (or now) down to the month it started, which is
// also the row its entry sits in.
export function buildRail(roles: readonly Role[], now: string): Rail {
  const top = monthIndex(now);
  const lanes = assignLanes(roles, now);
  const spans = roles.map((role) => ({
    key: role.key,
    lane: lanes.get(role.key) ?? 0,
    rowStart: Math.max(0, top - endIndex(role, now)),
    rowEnd: Math.max(0, top - monthIndex(role.start)),
    current: role.end === null,
  }));
  return {
    spans,
    rows: Math.max(0, ...spans.map((s) => s.rowEnd)) + 1,
    lanes: Math.max(0, ...spans.map((s) => s.lane)) + 1,
  };
}
