// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { CaseStudy } from "@/data/caseStudies";
import { ProjectWindow } from "./ProjectWindow";
import { findProject } from "./projects";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("./CaseStudyPanel", () => ({
  CaseStudyPanel: ({ study }: { study: CaseStudy }) => <div data-testid="case-panel">{study.title}</div>,
}));

afterEach(cleanup);

function open(slug: string) {
  const project = findProject(slug);
  if (!project) throw new Error(`no project ${slug}`);
  return { project, ...render(<ProjectWindow project={project} onBack={() => {}} />) };
}

describe("ProjectWindow", () => {
  it("shows the overview body by default", () => {
    const { project } = open("siting-optimizer");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(project.title);
    expect(screen.getByText(project.claim)).toBeTruthy();
    expect(screen.queryByTestId("case-panel")).toBeNull();
  });

  it("switches to the case study tab and back", () => {
    open("siting-optimizer");
    fireEvent.click(screen.getByText("case study"));
    expect(screen.getByTestId("case-panel")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    fireEvent.click(screen.getByText("overview"));
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });

  it("offers no case tab and no case study link without a slug", () => {
    open("iris");
    expect(screen.getAllByRole("tab")).toHaveLength(1);
    expect(screen.queryByText(/case study/i)).toBeNull();
  });

  it("keeps the source link for public evidence and drops the old case study link", () => {
    open("role-index");
    expect(screen.getByText("Source").getAttribute("href")).toContain("github.com");
    cleanup();
    open("siting-optimizer");
    expect(screen.queryByRole("link", { name: /case study/i })).toBeNull();
  });
});
