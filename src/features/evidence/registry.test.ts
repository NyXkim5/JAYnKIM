import { describe, it, expect } from "vitest";
import { EVIDENCE, findEvidence, evidenceFor, sourceHref } from "./registry";

describe("evidence registry", () => {
  it("has unique ids", () => {
    const ids = EVIDENCE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires how and observedAt on every entry", () => {
    for (const e of EVIDENCE) {
      expect(e.how.length, e.id).toBeGreaterThan(5);
      expect(e.observedAt, e.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("assigns every entry to at least one persona", () => {
    for (const e of EVIDENCE) {
      expect(e.persona.length, e.id).toBeGreaterThan(0);
    }
  });

  it("finds by id and returns undefined for unknown", () => {
    expect(findEvidence("dronenexus.tests.collected")?.value).toBe("3,800");
    expect(findEvidence("nope")).toBeUndefined();
  });

  it("filters by persona", () => {
    const hw = evidenceFor("hardware");
    expect(hw.length).toBeGreaterThan(2);
    for (const e of hw) expect(e.persona).toContain("hardware");
  });

  it("links public repos to GitHub and private ones to the depth page anchor", () => {
    const pub = EVIDENCE.find((e) => e.public);
    const priv = EVIDENCE.find((e) => !e.public);
    expect(pub && sourceHref(pub)).toMatch(/^https:\/\/github\.com\//);
    expect(priv && sourceHref(priv)).toMatch(/^\/[a-z]+#/);
  });

  it("flags entries older than 90 days without failing", () => {
    const now = Date.now();
    const cutoff = now - 90 * 24 * 3600 * 1000;
    for (const e of EVIDENCE) {
      const t = new Date(e.observedAt).getTime();
      expect(Number.isNaN(t), e.id).toBe(false);
      expect(t, e.id).toBeLessThanOrEqual(now);
    }
    const stale = EVIDENCE.filter((e) => new Date(e.observedAt).getTime() < cutoff);
    if (stale.length > 0) {
      console.warn(`stale evidence: ${stale.map((e) => e.id).join(", ")}`);
    }
  });
});
