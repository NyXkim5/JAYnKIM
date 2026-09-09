// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { stubCanvas, stubFrames, stubReducedMotion } from "@/test/motion";

const stepBlips = vi.hoisted(() => vi.fn());
vi.mock("./gridBackdrop", async (importOriginal) => {
  const real = await importOriginal<typeof import("./gridBackdrop")>();
  return { ...real, stepBlips: stepBlips.mockImplementation(real.stepBlips) };
});

import { MapGrid } from "./MapGrid";

beforeAll(() => {
  stubReducedMotion(true);
  stubCanvas();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  stepBlips.mockClear();
});

describe("MapGrid under reduced motion", () => {
  // The grid keeps its slow breathing; only the crosshair blips stay away.
  it("keeps the frame loop running but spawns no blips", () => {
    const frames = stubFrames();
    render(<MapGrid />);
    act(() => frames.drain(30, 100));
    expect(frames.requested()).toBeGreaterThan(20);
    expect(stepBlips).not.toHaveBeenCalled();
  });
});
