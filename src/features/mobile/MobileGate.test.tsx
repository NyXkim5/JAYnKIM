// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LINKEDIN_LABEL, LINKEDIN_URL } from "@/data/contact";
import { QUOTE_BY, STUDIO_QUOTE } from "@/features/studio/quote";
import { GATE_FOOTER, MobileGate } from "./MobileGate";

afterEach(cleanup);

describe("MobileGate", () => {
  it("covers the screen below md with the grid, the horse, the studio line and the desktop pointer", () => {
    const { container } = render(<MobileGate />);
    const gate = container.querySelector("[data-mobile-gate]");
    if (!gate) throw new Error("gate missing");
    expect(gate.className).toContain("md:hidden");
    expect(gate.className).toContain("fixed");
    expect(gate.className).toContain("bg-[#0a0a0a]");
    expect(container.querySelector("canvas")).toBeTruthy();
    expect(container.querySelector("video[data-horse]")).toBeTruthy();
    expect(screen.getByText(`“${STUDIO_QUOTE}”`)).toBeTruthy();
    expect(screen.getByText(QUOTE_BY)).toBeTruthy();
    const footer = screen.getByText(GATE_FOOTER);
    expect(footer.className).toContain("text-[#ff69b4]");
    expect(footer.parentElement?.className).toContain("bottom-8");
  });

  it("shows nothing else but a LinkedIn link under the desktop pointer", () => {
    const { container } = render(<MobileGate />);
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe(LINKEDIN_URL);
    expect(links[0].textContent).toBe(LINKEDIN_LABEL);
    expect(screen.getByText(GATE_FOOTER).parentElement).toBe(links[0].parentElement);
    expect(container.querySelector("h1, h2, h3")).toBeNull();
    expect(container.querySelector("[role='tablist']")).toBeNull();
  });
});
