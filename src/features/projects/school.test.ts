import { describe, it, expect } from "vitest";
import { SCHOOL } from "./school";

// Image files are checked by projects.test.ts, not here. This file guards
// the content rules for the school folder only.

const banned = /\b(signed|customers?|pilots?|early users|first users|active users|paying)\b/i;
const roleWords = /\b(Logistics|Graphics|President)\b/i;
const expectedSlugs = ["hack-at-uci", "cyber-at-uci", "uav-at-uci", "vfs-at-uci", "ai-at-uci"];

describe("school contributions", () => {
  it("lists exactly the five organisations from the education card", () => {
    expect(SCHOOL.map((p) => p.slug)).toEqual(expectedSlugs);
    expect(new Set(SCHOOL.map((p) => p.slug)).size).toBe(SCHOOL.length);
  });

  it("files every entry under school as community work with no specs", () => {
    for (const p of SCHOOL) {
      expect(p.folder, p.slug).toBe("school");
      expect(p.status, p.slug).toBe("COMMUNITY");
      expect(p.specs, p.slug).toEqual([]);
      expect(p.caseStudySlug, p.slug).toBeUndefined();
    }
  });

  it("uses one screenshot per entry named after its slug", () => {
    for (const p of SCHOOL) {
      expect(p.images, p.slug).toHaveLength(1);
      expect(p.images[0].src, p.slug).toBe(`/projects/school/${p.slug}.jpg`);
      expect(p.images[0].alt, p.slug).toContain(p.title);
    }
  });

  it("points every url at an https address", () => {
    for (const p of SCHOOL) {
      if (p.url !== undefined) expect(p.url, p.slug).toMatch(/^https:\/\//);
    }
  });

  it("names the role from the card and never claims traction", () => {
    for (const p of SCHOOL) {
      expect(p.claim, p.slug).toMatch(roleWords);
      expect(`${p.claim} ${p.caveat}`, p.slug).not.toMatch(banned);
      expect(`${p.claim} ${p.caveat}`, p.slug).not.toMatch(/\d/);
    }
  });

  it("gives UAV at UCI the President role and the others their card roles", () => {
    const byRole = Object.fromEntries(SCHOOL.map((p) => [p.slug, p.claim]));
    expect(byRole["uav-at-uci"]).toMatch(/\bPresident\b/i);
    expect(byRole["hack-at-uci"]).toMatch(/\bLogistics\b/);
    for (const slug of ["cyber-at-uci", "vfs-at-uci", "ai-at-uci"]) {
      expect(byRole[slug], slug).toMatch(/\bGraphics\b/);
    }
  });
});
