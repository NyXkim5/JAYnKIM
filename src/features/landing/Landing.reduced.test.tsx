// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { stubCanvas, stubMediaPlayback, stubReducedMotion, stubResizeObserver } from "@/test/motion";
import { STUDIO_CLAIM } from "@/features/persona/personas";
import { ConstellationScene } from "@/features/studio/ConstellationScene";
import { Landing } from "./Landing";

// framer-motion reads the media query once per module instance, so this file
// runs the whole landing with reduced motion on.
beforeAll(() => {
  stubReducedMotion(true);
  stubCanvas();
  stubResizeObserver();
  stubMediaPlayback();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const claimOf = (container: HTMLElement) => container.querySelector("h1 + p")?.textContent;

describe("Landing under reduced motion", () => {
  // The server renders the claim empty because the scramble starts blank. If
  // the reduced client paints the full sentence on its first render, React
  // throws hydration error 418 and rebuilds the whole landing.
  it("paints the claim empty on the first render so it matches the server, then fills it in", async () => {
    const { container } = render(<Landing />);
    expect(claimOf(container)).toBe("");
    await act(async () => {});
    expect(claimOf(container)).toBe(STUDIO_CLAIM);
  });

  it("keeps the studio film autoplaying", () => {
    const { container } = render(<Landing />);
    expect(container.querySelector("video")?.hasAttribute("autoplay")).toBe(true);
  });

  it("keeps the constellation loop running", () => {
    const start = vi.spyOn(ConstellationScene.prototype, "start").mockReturnValue(() => undefined);
    render(<Landing />);
    expect(start).toHaveBeenCalledTimes(1);
  });
});
