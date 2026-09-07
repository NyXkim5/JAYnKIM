// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { findStudy } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/caseStudies";
import { findEvidence } from "@/features/evidence/registry";
import { CaseStudyPanel } from "./CaseStudyPanel";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

afterEach(cleanup);

function archv(): CaseStudy {
  const study = findStudy("archv");
  if (!study) throw new Error("archv study missing");
  return study;
}

describe("CaseStudyPanel", () => {
  it("renders the masthead, meta strip, approach and design decisions for archv", () => {
    const study = archv();
    render(<CaseStudyPanel study={study} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(study.title);
    expect(screen.getByText(study.subtitle)).toBeTruthy();
    expect(screen.getByText(study.role)).toBeTruthy();
    expect(screen.getByText(study.duration)).toBeTruthy();
    expect(screen.getByText(study.team)).toBeTruthy();
    for (const step of study.approach) expect(screen.getByText(step)).toBeTruthy();
    for (const d of study.designDecisions) {
      expect(screen.getByText(d.title)).toBeTruthy();
      expect(screen.getByText(d.outcome)).toBeTruthy();
    }
  });

  it("hides reflections when the study has none", () => {
    const { reflections: _omit, ...rest } = archv();
    void _omit;
    render(<CaseStudyPanel study={rest} />);
    expect(screen.queryByText("worked")).toBeNull();
    expect(screen.queryByText("different")).toBeNull();
    expect(screen.queryByText("reflections")).toBeNull();
  });

  it("shows registry values for impact rows and drops rows with unknown ids", () => {
    const base = archv();
    const known = base.impact[0];
    const study: CaseStudy = {
      ...base,
      impact: [known, { metric: "Ghost metric", value: "999", description: "never shown", evidenceId: "nope.missing" }],
    };
    const e = findEvidence(known.evidenceId);
    if (!e) throw new Error("archv evidence missing from registry");
    render(<CaseStudyPanel study={study} />);
    expect(screen.getByText(e.value)).toBeTruthy();
    expect(screen.queryByText(known.evidenceId)).toBeNull();
    expect(screen.queryByText("Ghost metric")).toBeNull();
    expect(screen.queryByText("999")).toBeNull();
    expect(screen.queryByText("nope.missing")).toBeNull();
  });

  it("opens the project link in a new tab", () => {
    const study: CaseStudy = { ...archv(), link: { url: "https://example.com/archv", label: "Live site" } };
    render(<CaseStudyPanel study={study} />);
    const a = screen.getByRole("link", { name: /Live site/ });
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
  });
});
