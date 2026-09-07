// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ProjectsExplorer } from "./ProjectsExplorer";
import { projectHref } from "./projects";

// ?open=archv-ink&tab=case, the address the Work page's "Case study" links use.
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("open=archv-ink&tab=case"),
}));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("@/features/persona/PersonaBar", () => ({ PersonaBar: () => null }));
vi.mock("@/components/transitions/TransitionLink", () => ({
  TransitionLink: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("./CaseStudyPanel", () => ({
  CaseStudyPanel: ({ study }: { study: { title: string } }) => <div data-testid="case-panel">{study.title}</div>,
}));

afterEach(cleanup);

describe("ProjectsExplorer deep link", () => {
  it("opens the asked-for window on its case study tab straight from the address", () => {
    render(<ProjectsExplorer />);
    expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("Archv Ink legal AI");
    expect(screen.getByTestId("case-panel").textContent).toBe("Archv");
    const tabs = screen.getAllByRole("tab").filter((t) => t.closest("[role=dialog]"));
    expect(tabs.map((t) => [t.textContent, t.getAttribute("aria-selected")])).toEqual([["overview", "false"], ["[case study]", "true"]]);
  });

  it("builds the addresses the rest of the site uses", () => {
    expect(projectHref("archv-ink", "case")).toBe("/projects?open=archv-ink&tab=case");
    expect(projectHref("bamboo")).toBe("/projects?open=bamboo");
  });
});
