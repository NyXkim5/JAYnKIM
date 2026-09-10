// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { stubFrames, stubMouseOnly, stubReducedMotion } from "@/test/motion";
import { Cursor } from "./Cursor";

beforeAll(() => {
  stubReducedMotion(true);
  stubMouseOnly();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Cursor under reduced motion", () => {
  // The arrow only ever sits where the pointer is, so it is not motion the
  // visitor did not cause. Only the trailing particles are decorative.
  it("still follows the pointer", () => {
    stubFrames();
    const { container } = render(<Cursor />);
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 100, clientY: 200 }));
    });
    const arrow = container.querySelector<HTMLElement>("[data-cursor]");
    expect(arrow?.style.transform).toBe("translate(100px, 200px)");
  });

  it("shows no trail", () => {
    const frames = stubFrames();
    const { container } = render(<Cursor />);
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 100, clientY: 200 }));
      frames.drain(10, 16);
    });
    const trail = container.querySelectorAll<HTMLElement>("[data-cursor-trail]");
    expect(trail.length).toBeGreaterThan(0);
    trail.forEach((dot) => expect(dot.style.opacity).toBe("0"));
  });
});
