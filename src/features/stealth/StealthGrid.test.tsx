// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { StealthGrid } from "./StealthGrid";

afterEach(cleanup);

describe("StealthGrid", () => {
  // jsdom has no 2d canvas, so the component must bail out cleanly and still
  // leave a hidden, click-through layer with no label until a point is chosen.
  it("renders a hidden click-through canvas layer with no label before the first point", () => {
    const { container } = render(<StealthGrid />);
    const layer = container.firstElementChild;
    if (!layer) throw new Error("layer missing");
    expect(layer.getAttribute("aria-hidden")).toBe("true");
    expect(layer.className).toContain("pointer-events-none");
    expect(container.querySelector("canvas")).toBeTruthy();
    expect(container.querySelector("[data-focus-label]")).toBeNull();
  });
});
