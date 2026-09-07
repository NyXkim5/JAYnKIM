import { describe, expect, it } from "vitest";
import { findStudy } from "@/data/caseStudies";
import { assignLanes, buildRail, EDUCATION, formatMonth, monthIndex, ROLES, sortNewestFirst } from "./roles";

const banned = /\b(signed|customers?|pilots?|early users|first users|active users|paying)\b/i;
const NOW = "2026-09";

describe("timeline data", () => {
  it("lists roles newest first", () => {
    expect(sortNewestFirst(ROLES).map((r) => r.key)).toEqual(ROLES.map((r) => r.key));
    for (let i = 1; i < ROLES.length; i++) {
      expect(monthIndex(ROLES[i - 1].start)).toBeGreaterThanOrEqual(monthIndex(ROLES[i].start));
    }
  });

  it("keeps every string clear of traction language", () => {
    const strings = ROLES.flatMap((r) => [r.role, r.company, r.summary, ...r.meta]).concat(Object.values(EDUCATION));
    expect(strings.length).toBeGreaterThan(10);
    for (const s of strings) expect(s).not.toMatch(banned);
  });

  it("points every case study slug at a real study and dates every role as YYYY-MM", () => {
    for (const r of ROLES) {
      if (r.study) expect(findStudy(r.study), r.key).toBeDefined();
      expect(r.start, r.key).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      if (r.end) expect(monthIndex(r.end), r.key).toBeGreaterThanOrEqual(monthIndex(r.start));
    }
  });

  it("formats months for the mono labels", () => {
    expect(formatMonth("2026-08")).toBe("Aug 2026");
    expect(monthIndex("2026-09") - monthIndex("2026-02")).toBe(7);
  });
});

describe("rail geometry", () => {
  it("puts overlapping roles in different lanes and lone roles in lane zero", () => {
    const lanes = assignLanes(ROLES, NOW);
    expect(lanes.get("stealth")).not.toBe(lanes.get("optum"));
    expect(lanes.get("archv")).not.toBe(lanes.get("optum"));
    expect(lanes.get("archv")).not.toBe(lanes.get("cactus"));
    expect(lanes.get("medvanta")).toBe(0);
  });

  it("spans from the end month down to the start month, row zero being now", () => {
    const rail = buildRail(ROLES, NOW);
    expect(rail.rows).toBe(monthIndex(NOW) - monthIndex("2024-05") + 1);
    for (const s of rail.spans) {
      expect(s.rowStart).toBeGreaterThanOrEqual(0);
      expect(s.rowStart).toBeLessThanOrEqual(s.rowEnd);
    }
    expect(rail.spans.find((s) => s.key === "optum")).toMatchObject({ rowStart: 0, rowEnd: 7, current: true });
    expect(rail.spans.find((s) => s.key === "cactus")).toMatchObject({ rowStart: 5, rowEnd: 9, current: false });
  });

  it("clamps a span whose end is after now instead of going negative", () => {
    const rail = buildRail(ROLES, "2026-03");
    for (const s of rail.spans) expect(s.rowStart).toBeGreaterThanOrEqual(0);
  });
});
