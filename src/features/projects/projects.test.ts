import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { PROJECTS, FOLDERS, FOLDER_LABELS, findProject, projectTree } from "./projects";
import { findEvidence } from "@/features/evidence/registry";
import { findStudy } from "@/data/caseStudies";

const banned = /\b(signed|customers?|pilots?|early users|first users|active users|paying)\b/i;

describe("projects", () => {
  it("has unique slugs and a known folder for every project", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of PROJECTS) expect(FOLDERS).toContain(p.folder);
  });

  it("backs every spec with a registry entry", () => {
    for (const p of PROJECTS) {
      expect(p.specs.length).toBeLessThanOrEqual(3);
      for (const s of p.specs) expect(findEvidence(s.evidenceId), `${p.slug}: ${s.label}`).toBeDefined();
    }
  });

  it("points every image and demo clip at a file that exists in public", () => {
    for (const p of PROJECTS) {
      for (const img of p.images) {
        expect(existsSync(join(process.cwd(), "public", img.src)), `${p.slug}: ${img.src}`).toBe(true);
        expect(img.alt.length).toBeGreaterThan(10);
      }
      if (p.video) {
        for (const file of [p.video.src, p.video.poster]) {
          expect(existsSync(join(process.cwd(), "public", file)), `${p.slug}: ${file}`).toBe(true);
        }
        expect(p.video.alt.length).toBeGreaterThan(10);
      }
    }
  });

  it("resolves every case study link", () => {
    for (const p of PROJECTS) {
      if (p.caseStudySlug) expect(findStudy(p.caseStudySlug), p.slug).toBeDefined();
    }
  });

  it("never claims traction and never presents third-party work as Jay's", () => {
    for (const p of PROJECTS) {
      expect(`${p.claim} ${p.caveat}`, p.slug).not.toMatch(banned);
      if (p.slug === "sonicfly-regression") expect(p.status).toBe("THIRD-PARTY");
    }
  });

  it("builds a tree with every folder populated and every leaf findable", () => {
    const tree = projectTree();
    expect(tree.nodes?.map((n) => n.name)).toEqual(FOLDERS.map((f) => FOLDER_LABELS[f]));
    for (const folder of tree.nodes ?? []) {
      expect(folder.nodes?.length ?? 0).toBeGreaterThan(0);
      for (const leaf of folder.nodes ?? []) expect(findProject(leaf.slug ?? "")).toBeDefined();
    }
  });
});
