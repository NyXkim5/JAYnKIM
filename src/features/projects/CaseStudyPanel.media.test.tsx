// @vitest-environment jsdom
import { existsSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { caseStudies, findStudy } from "@/data/caseStudies";
import { CaseStudyPanel } from "./CaseStudyPanel";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

afterEach(cleanup);

function study(slug: string) {
  const s = findStudy(slug);
  if (!s) throw new Error(`${slug} study missing`);
  return s;
}

describe("CaseStudyPanel media and design language", () => {
  it("renders the design language with its type pairing, palette swatches and principles", () => {
    const s = study("archv");
    if (!s.brandPhilosophy) throw new Error("archv has no brand philosophy");
    render(<CaseStudyPanel study={s} />);
    expect(screen.getByRole("region", { name: "design language" })).toBeTruthy();
    expect(screen.getByText(s.brandPhilosophy.typography.heading)).toBeTruthy();
    for (const c of s.brandPhilosophy.palette) expect(screen.getByText(c.hex)).toBeTruthy();
    for (const p of s.brandPhilosophy.principles) expect(screen.getByText(p)).toBeTruthy();
  });

  it("renders the study's clip with controls and no autoplay", () => {
    const s = study("archv");
    if (!s.video) throw new Error("archv has no video");
    const { container } = render(<CaseStudyPanel study={s} />);
    const video = container.querySelector("video");
    if (!video) throw new Error("video missing");
    expect(video.getAttribute("src")).toBe(s.video.src);
    expect(video.hasAttribute("controls")).toBe(true);
    expect(video.hasAttribute("autoplay")).toBe(false);
  });

  it("renders both versions and the changelog when a study has them", () => {
    const s = study("drone-dashboard");
    if (!s.versionImages) throw new Error("drone-dashboard has no versions");
    render(<CaseStudyPanel study={s} />);
    expect(screen.getByRole("region", { name: "versions" })).toBeTruthy();
    // The v1 frame can double as a figure, so the same alt may appear twice.
    expect(screen.getAllByAltText(s.versionImages.v1.caption).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByAltText(s.versionImages.v2.caption).length).toBeGreaterThanOrEqual(1);
    for (const line of s.versionImages.changelog) expect(screen.getByText(line)).toBeTruthy();
  });

  it("ships every picture and clip the studies point at", () => {
    for (const s of caseStudies) {
      const files = [
        ...s.images.map((i) => i.src),
        ...(s.video ? [s.video.src] : []),
        ...(s.versionImages ? [s.versionImages.v1.src, s.versionImages.v2.src] : []),
      ];
      for (const f of files) expect(existsSync(join(process.cwd(), "public", f)), `${s.slug}: ${f}`).toBe(true);
    }
  });
});
