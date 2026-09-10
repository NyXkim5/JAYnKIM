// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { stubCanvas, stubFrames, stubReducedMotion } from "@/test/motion";
import { StealthGrid } from "./StealthGrid";

beforeAll(() => {
  stubReducedMotion(true);
  stubCanvas();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("StealthGrid under reduced motion", () => {
  // Reduced motion should calm the grid to its breathing, not freeze it: the
  // frame loop keeps running and the light-gathering sweep never picks a point.
  it("keeps breathing without choosing a point", () => {
    const frames = stubFrames();
    const { container } = render(<StealthGrid />);
    act(() => frames.drain(40, 500));
    expect(frames.requested()).toBeGreaterThan(20);
    expect(container.querySelector("[data-focus-label]")).toBeNull();
  });
});
