// src/features/evidence/Readout.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Readout } from "./Readout";
import { evidenceFor } from "./registry";

afterEach(cleanup);

describe("Readout", () => {
  it("shows the first hardware entry's value and its source path", () => {
    const first = evidenceFor("hardware")[0];
    render(<Readout persona="hardware" ground="black" intervalMs={0} />);
    expect(screen.getByText(first.value)).toBeTruthy();
    expect(screen.getByText(first.path)).toBeTruthy();
  });

  it("links private sources to the depth page anchor", () => {
    render(<Readout persona="hardware" ground="black" intervalMs={0} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toMatch(/^\/hardware#/);
  });
});
