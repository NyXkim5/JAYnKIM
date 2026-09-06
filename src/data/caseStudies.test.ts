import { describe, it, expect } from "vitest";
import { caseStudies, findStudy } from "./caseStudies";
import { findEvidence } from "@/features/evidence/registry";
import { PERSONA_KEYS } from "@/features/persona/personas";
import { studiesFor } from "./caseStudies";

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

describe("caseStudies content rules", () => {
  it("assigns every study to at least one persona", () => {
    for (const s of caseStudies) {
      expect(s.personas.length, s.slug).toBeGreaterThan(0);
      for (const p of s.personas) expect(PERSONA_KEYS).toContain(p);
    }
  });

  it("backs every impact metric with a registry entry", () => {
    for (const s of caseStudies) {
      for (const item of s.impact) {
        expect(findEvidence(item.evidenceId), `${s.slug}: ${item.metric}`).toBeDefined();
      }
    }
  });

  it("never claims traction", () => {
    const banned = /\b(signed|customers?|pilots?|users?)\b/i;
    for (const s of caseStudies) {
      for (const item of s.impact) {
        expect(`${item.metric} ${item.value} ${item.description}`, s.slug).not.toMatch(banned);
      }
    }
  });

  it("filters by persona", () => {
    expect(studiesFor("hardware").map((s) => s.slug)).toEqual(["drone-dashboard", "drone-virtual-env"]);
  });
});
