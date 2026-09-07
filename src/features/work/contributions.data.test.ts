import { describe, expect, it } from "vitest";
import { findEvidence, sourceHref } from "@/features/evidence/registry";
import type { Contributions } from "./contributions";
import { COMMITS_EVIDENCE_ID, CONTRIBUTIONS_EVIDENCE_ID, RESTRICTED_EVIDENCE_ID } from "./contributions";
import data from "./data/contributions.json";

describe("contributions.json", () => {
  it("parses to the declared shape with 52 or 53 weeks of dated counts", () => {
    const d: Contributions = data;
    expect(d.login).toBe("NyXkim5");
    expect(d.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    expect(Number.isInteger(d.total) && d.total >= 0).toBe(true);
    expect(Number.isInteger(d.commits) && d.commits >= 0).toBe(true);
    expect(Number.isInteger(d.restricted) && d.restricted >= 0).toBe(true);
    expect(d.commits + d.restricted).toBeLessThanOrEqual(d.total);
    expect([52, 53]).toContain(d.weeks.length);
    let last = "";
    for (const week of d.weeks) {
      expect(week.length).toBeGreaterThan(0);
      expect(week.length).toBeLessThanOrEqual(7);
      for (const day of week) {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(day.date > last, day.date).toBe(true);
        expect(Number.isInteger(day.count) && day.count >= 0, day.date).toBe(true);
        last = day.date;
      }
    }
  });

  it("is cited by the evidence registry at the file that proves it, one id per number shown", () => {
    for (const id of [CONTRIBUTIONS_EVIDENCE_ID, COMMITS_EVIDENCE_ID, RESTRICTED_EVIDENCE_ID]) {
      const e = findEvidence(id);
      expect(e?.persona, id).toContain("work");
      expect(e?.path, id).toBe("src/features/work/data/contributions.json");
      expect(e?.how, id).toContain(".github/workflows/contributions.yml");
      expect(e && sourceHref(e), id).toBe("https://github.com/NyXkim5/JAYnKIM/blob/main/src/features/work/data/contributions.json");
    }
  });
});
