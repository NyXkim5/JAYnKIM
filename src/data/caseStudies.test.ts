import { describe, it, expect } from "vitest";
import { caseStudies, findStudy, studiesFor } from "./caseStudies";
import { findEvidence } from "@/features/evidence/registry";
import { PERSONA_KEYS } from "@/features/persona/personas";

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
    expect(studiesFor("projects").map((s) => s.slug)).toEqual(["archv", "drone-dashboard", "drone-virtual-env", "va-gov-mvp"]);
  });

  it("never claims traction in body prose", () => {
    const banned = /\b(signed|customers?|pilots?|early users|first users|active users|paying)\b/i;
    for (const s of caseStudies) {
      const fields: { label: string; text: string }[] = [
        { label: "overview", text: s.overview },
        { label: "problem", text: s.problem },
        ...s.approach.map((text, i) => ({ label: `approach[${i}]`, text })),
        ...s.designDecisions.flatMap((d, i) => [
          { label: `designDecisions[${i}].title`, text: d.title },
          { label: `designDecisions[${i}].description`, text: d.description },
          { label: `designDecisions[${i}].outcome`, text: d.outcome },
        ]),
        ...(s.reflections?.worked.map((text, i) => ({ label: `reflections.worked[${i}]`, text })) ?? []),
        ...(s.reflections?.different.map((text, i) => ({ label: `reflections.different[${i}]`, text })) ?? []),
      ];
      for (const { label, text } of fields) {
        expect(text, `${s.slug}: ${label}`).not.toMatch(banned);
      }
    }
  });
});

type StringField = { path: string; text: string };

// Collects every string leaf in a study so the prose rules apply to captions,
// changelogs, and brand copy, not only the fields the panel renders today.
function walkStrings(value: unknown, path: string, out: StringField[]): void {
  if (typeof value === "string") {
    out.push({ path, text: value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walkStrings(v, `${path}[${i}]`, out));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) walkStrings(v, path ? `${path}.${k}` : k, out);
  }
}

function stringFields(study: (typeof caseStudies)[number]): StringField[] {
  const out: StringField[] = [];
  walkStrings(study, "", out);
  return out;
}

describe("caseStudies prose rules", () => {
  it("uses no em dash or en dash in any string field", () => {
    // U+2012 figure dash through U+2015 horizontal bar, which covers en (U+2013) and em (U+2014).
    const dash = /[‒-―]/;
    for (const s of caseStudies) {
      for (const { path, text } of stringFields(s)) {
        expect(text, `${s.slug}: ${path}`).not.toMatch(dash);
      }
    }
  });

  it("never links to a placeholder url", () => {
    for (const s of caseStudies) {
      if (!s.link) continue;
      expect(s.link.url, s.slug).not.toBe("#");
      expect(s.link.url, s.slug).toMatch(/^https?:\/\//);
    }
  });

  it("never claims traction in any string field", () => {
    const banned = /\b(signed|customers?|pilots?|early users|first users|active users|paying)\b/i;
    for (const s of caseStudies) {
      for (const { path, text } of stringFields(s)) {
        expect(text, `${s.slug}: ${path}`).not.toMatch(banned);
      }
    }
  });

  it("states the drone-dashboard test count from the registry, not the old 76+ figure", () => {
    const study = findStudy("drone-dashboard");
    if (!study) throw new Error("drone-dashboard study missing");
    for (const { path, text } of stringFields(study)) {
      expect(text, path).not.toContain("76+");
    }
    const collected = findEvidence("dronenexus.tests.collected");
    const hud = findEvidence("overwatch.tests.passed");
    if (!collected || !hud) throw new Error("drone-dashboard test evidence missing from registry");
    expect(study.overview).toContain(collected.value);
    expect(study.overview).toContain(hud.value);
  });
});
