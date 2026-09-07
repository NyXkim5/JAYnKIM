// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { studyHref } from "@/data/caseStudies";
import { EDUCATION, ROLES } from "./roles";
import { Timeline } from "./Timeline";

vi.mock("@/components/transitions/TransitionLink", () => ({
  TransitionLink: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));

afterEach(cleanup);

const NOW = "2026-09";

describe("Timeline", () => {
  it("runs the cards oldest to newest left to right, education first as the earliest entry", () => {
    render(<Timeline roles={ROLES} education={EDUCATION} now={NOW} />);
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    const oldestFirst = [...ROLES].reverse().map((r) => r.role);
    expect(headings).toEqual([EDUCATION.school, ...oldestFirst]);
    expect(screen.getByText(`${EDUCATION.degree}, ${EDUCATION.field}`)).toBeTruthy();
  });

  it("links every role that has a case study to studyHref, and Cactus to Projects", () => {
    render(<Timeline roles={ROLES} education={EDUCATION} now={NOW} />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const r of ROLES) {
      if (r.study) expect(hrefs, r.key).toContain(studyHref(r.study));
    }
    expect(hrefs).toContain("/projects");
    const studyLinks = hrefs.filter((h) => ROLES.some((r) => r.study && studyHref(r.study) === h));
    expect(studyLinks.length).toBe(ROLES.filter((r) => r.study).length);
  });

  it("brackets present on the current roles' cards and once at the axis end", () => {
    const { container } = render(<Timeline roles={ROLES} education={EDUCATION} now={NOW} />);
    const current = ROLES.filter((r) => r.end === null).length;
    expect(current).toBeGreaterThan(0);
    expect(container.querySelectorAll("ol [data-present]").length).toBe(current);
    expect(container.querySelectorAll("[data-present]").length).toBe(current + 1);
  });

  it("draws one lane bar per role with its short label, plus the axis years", () => {
    render(<Timeline roles={ROLES} education={EDUCATION} now={NOW} />);
    for (const r of ROLES) expect(screen.getAllByText(r.short).length).toBeGreaterThan(0);
    expect(screen.getByText("2025")).toBeTruthy();
    expect(screen.getByText("2026")).toBeTruthy();
    expect(screen.getByText("May 2024")).toBeTruthy();
  });

  it("renders the company, the mono meta, and the one-line summary for each role", () => {
    render(<Timeline roles={ROLES} education={EDUCATION} now={NOW} />);
    for (const r of ROLES) {
      expect(screen.getAllByText(r.company).length).toBeGreaterThan(0);
      expect(screen.getAllByText(r.summary).length).toBeGreaterThan(0);
      if (r.meta.length) expect(screen.getAllByText(r.meta.join(" · ")).length).toBeGreaterThan(0);
    }
  });
});
