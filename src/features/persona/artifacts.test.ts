import { describe, it, expect } from "vitest";
import { artifactsFor, ARTIFACTS } from "./artifacts";
import { findEvidence } from "@/features/evidence/registry";
import { findStudy } from "@/data/caseStudies";

describe("artifacts", () => {
  it("gives projects and work three to five cards each", () => {
    expect(artifactsFor("projects").length).toBeGreaterThanOrEqual(3);
    expect(artifactsFor("projects").length).toBeLessThanOrEqual(5);
    expect(artifactsFor("work").length).toBeGreaterThanOrEqual(3);
    expect(artifactsFor("work").length).toBeLessThanOrEqual(5);
  });

  it("gives design and stealth no cards yet", () => {
    expect(artifactsFor("design")).toEqual([]);
    expect(artifactsFor("stealth")).toEqual([]);
  });

  it("resolves every evidence id and case study slug it references", () => {
    for (const a of ARTIFACTS) {
      if (a.evidenceId) expect(findEvidence(a.evidenceId), a.title).toBeDefined();
      if (a.caseStudySlug) {
        const study = findStudy(a.caseStudySlug);
        expect(study, a.title).toBeDefined();
        expect(study?.personas, a.title).toContain(a.persona);
      }
    }
  });

  it("never presents the sonicfly clone or the cactus fork as Jay's work", () => {
    for (const a of ARTIFACTS) {
      expect(a.file).not.toMatch(/sonicfly-patched/);
      expect(a.file).not.toMatch(/cactus/);
    }
  });
});
