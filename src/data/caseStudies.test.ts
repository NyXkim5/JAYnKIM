import { describe, it, expect } from "vitest";
import { caseStudies, findStudy } from "./caseStudies";

describe("caseStudies", () => {
  it("has at least one study", () => {
    expect(caseStudies.length).toBeGreaterThan(0);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = caseStudies.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("findStudy returns the matching study", () => {
    const slug = caseStudies[0].slug;
    expect(findStudy(slug)?.slug).toBe(slug);
  });

  it("findStudy returns undefined for an unknown slug", () => {
    expect(findStudy("does-not-exist")).toBeUndefined();
  });
});
