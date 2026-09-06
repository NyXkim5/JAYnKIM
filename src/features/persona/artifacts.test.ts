import { describe, it, expect } from "vitest";
import { artifactsFor, ARTIFACTS } from "./artifacts";
import { findEvidence } from "@/features/evidence/registry";
import { findStudy } from "@/data/caseStudies";

describe("artifacts", () => {
  it("gives hardware and software three to five cards each", () => {
    expect(artifactsFor("hardware").length).toBeGreaterThanOrEqual(3);
    expect(artifactsFor("hardware").length).toBeLessThanOrEqual(5);
    expect(artifactsFor("software").length).toBeGreaterThanOrEqual(3);
    expect(artifactsFor("software").length).toBeLessThanOrEqual(5);
  });

  it("gives product and business no cards yet", () => {
    expect(artifactsFor("product")).toEqual([]);
    expect(artifactsFor("business")).toEqual([]);
  });

  it("resolves every evidence id and case study slug it references", () => {
    for (const a of ARTIFACTS) {
      if (a.evidenceId) expect(findEvidence(a.evidenceId), a.title).toBeDefined();
      if (a.caseStudySlug) expect(findStudy(a.caseStudySlug), a.title).toBeDefined();
    }
  });

  it("never presents the sonicfly clone or the cactus fork as Jay's work", () => {
    for (const a of ARTIFACTS) {
      expect(a.file).not.toMatch(/sonicfly-patched/);
      expect(a.file).not.toMatch(/cactus/);
    }
  });
});
