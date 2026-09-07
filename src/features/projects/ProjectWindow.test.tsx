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

  // jsdom has no layout, so scroll ownership is checked by class: no height
  // cap or inner scroll below md, both from md up.
  it("caps height and scrolls inside the window only from md up", () => {
    open("siting-optimizer");
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("md:max-h-[86vh]");
    expect(dialog.className).not.toMatch(/(^|\s)max-h-/);
    const body = dialog.lastElementChild;
    if (!body) throw new Error("window body missing");
    expect(body.className).toContain("md:overflow-y-auto");
    expect(body.className).not.toMatch(/(^|\s)overflow-y-auto/);
  });

  it("plays the Archv Ink demo clip from a poster frame, never autoplaying", () => {
    const { container, project } = open("archv-ink");
    const video = container.querySelector("video");
    if (!video || !project.video) throw new Error("archv-ink video missing");
    expect(video.getAttribute("poster")).toBe(project.video.poster);
    expect(video.hasAttribute("controls")).toBe(true);
    expect(video.hasAttribute("autoplay")).toBe(false);
    expect(video.querySelector("source")?.getAttribute("src")).toBe(project.video.src);
    expect(screen.getByText(project.video.alt)).toBeTruthy();
    cleanup();
    const { container: plain } = open("iris");
    expect(plain.querySelector("video")).toBeNull();
  });

  it("links the address bar to the repository and discloses when it is private", () => {
    open("siting-optimizer");
    const address = screen.getByRole("link", { name: /github\.com\/NyXkim5\/DroneNexus/ });
    expect(address.getAttribute("href")).toBe("https://github.com/NyXkim5/DroneNexus");
    expect(address.textContent).toContain("private");
    expect(screen.getByText(/access: the repository is private/i)).toBeTruthy();
    cleanup();
    open("role-index");
    const publicAddress = screen.getByRole("link", { name: /github\.com\/NyXkim5\/summer-2027-role-index/ });
    expect(publicAddress.textContent).not.toContain("private");
    expect(screen.queryByText(/access: the repository is private/i)).toBeNull();
  });

  it("keeps the source link for public evidence and drops the old case study link", () => {
    open("role-index");
    expect(screen.getByText("Source").getAttribute("href")).toContain("github.com");
    cleanup();
    open("siting-optimizer");
    expect(screen.queryByRole("link", { name: /case study/i })).toBeNull();
  });
});
