// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { STEALTH_CLOSER_BEFORE, STEALTH_CLOSER_WORD, STEALTH_STATEMENT, StealthPage } from "./StealthPage";

vi.mock("@/features/persona/PersonaBar", () => ({ PersonaBar: () => <header data-testid="bar" /> }));

afterEach(cleanup);

const banned = /\b(signed|customers?|pilots?|early users|first users|active users|paying)\b/i;

describe("StealthPage", () => {
  it("centres the statement in pink on black with the bar on top", () => {
    const { container } = render(<StealthPage />);
    const main = container.querySelector("main");
    expect(main?.className).toContain("items-center");
    expect(main?.className).toContain("justify-center");
    expect(main?.className).toContain("bg-[#0a0a0a]");
    const statement = screen.getByText(STEALTH_STATEMENT);
    expect(statement.parentElement?.className).toContain("text-[#ff69b4]");
    expect(statement.parentElement?.className).toContain("text-center");
    expect(screen.getByTestId("bar")).toBeTruthy();
  });

  it("follows a blank line with the closer, WARD glowing, and the caret after the period", () => {
    const { container } = render(<StealthPage />);
    const glow = container.querySelector("[data-glow]");
    if (!(glow instanceof HTMLElement)) throw new Error("glow missing");
    expect(glow.textContent).toBe(STEALTH_CLOSER_WORD);
    expect(glow.style.textShadow).toContain("#ff69b4");
    const closer = glow.parentElement;
    if (!closer) throw new Error("closer missing");
    expect(closer.className).toMatch(/\bmt-/);
    expect(closer.textContent).toBe(`${STEALTH_CLOSER_BEFORE}${STEALTH_CLOSER_WORD}.`);
    const caret = container.querySelector("[data-caret]");
    if (!caret) throw new Error("caret missing");
    expect(caret.parentElement).toBe(closer);
    expect(closer.lastElementChild).toBe(caret);
  });

  it("blinks a pink caret that screen readers skip and reduced motion stills", () => {
    const { container } = render(<StealthPage />);
    const caret = container.querySelector("[data-caret]");
    if (!caret) throw new Error("caret missing");
    expect(caret.getAttribute("aria-hidden")).toBe("true");
    expect(caret.className).toContain("bg-[#ff69b4]");
    expect(caret.className).toContain("animate-[caret_");
    expect(caret.className).toContain("motion-reduce:animate-none");
  });

  it("puts the pink horse under the closer, inside the centred block", () => {
    const { container } = render(<StealthPage />);
    const video = container.querySelector("video[data-horse]");
    if (!video) throw new Error("horse video missing");
    const closer = container.querySelector("[data-glow]")?.parentElement;
    expect(closer?.nextElementSibling).toBe(video);
    expect(video.className).toContain("mx-auto");
  });

  it("keeps both lines clear of traction language", () => {
    expect(`${STEALTH_STATEMENT} ${STEALTH_CLOSER_BEFORE}${STEALTH_CLOSER_WORD}`).not.toMatch(banned);
  });
});
