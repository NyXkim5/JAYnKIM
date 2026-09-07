// @vitest-environment jsdom
import { existsSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { DESIGN_VIDEO, DesignPage } from "./DesignPage";

vi.mock("@/features/persona/PersonaBar", () => ({ PersonaBar: () => <header data-testid="bar" /> }));

afterEach(cleanup);

describe("DesignPage", () => {
  it("fills the screen with the muted, looping prototype render on black", () => {
    const { container } = render(<DesignPage />);
    const video = container.querySelector("video");
    if (!video) throw new Error("video missing");
    expect(video.getAttribute("src")).toBe(DESIGN_VIDEO);
    expect(video.hasAttribute("autoplay")).toBe(true);
    expect(video.hasAttribute("loop")).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.className).toContain("object-cover");
    expect(video.className).toContain("md:object-contain");
    // Pure black, matching the clip's own background, so its edges disappear.
    expect(container.querySelector("main")?.className).toContain("bg-black");
    expect(screen.getByTestId("bar")).toBeTruthy();
  });

  it("says in progress in pink at the foot of the screen", () => {
    render(<DesignPage />);
    const label = screen.getByText("in progress");
    expect(label.className).toContain("text-[#ff69b4]");
    expect(label.className).toContain("bottom-8");
    expect(label.className).toContain("text-center");
  });

  it("ships the video file it points at", () => {
    expect(existsSync(join(process.cwd(), "public", DESIGN_VIDEO))).toBe(true);
  });
});
