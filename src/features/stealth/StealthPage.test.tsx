// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { STEALTH_STATEMENT, StealthPage } from "./StealthPage";

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
    expect(statement.className).toContain("text-[#ff69b4]");
    expect(statement.className).toContain("text-center");
    expect(screen.getByTestId("bar")).toBeTruthy();
  });

  it("ends with a blinking pink caret that screen readers skip and reduced motion stills", () => {
    const { container } = render(<StealthPage />);
    const caret = container.querySelector("[data-caret]");
    if (!caret) throw new Error("caret missing");
    expect(caret.getAttribute("aria-hidden")).toBe("true");
    expect(caret.className).toContain("bg-[#ff69b4]");
    expect(caret.className).toContain("animate-[caret_");
    expect(caret.className).toContain("motion-reduce:animate-none");
    expect(caret.parentElement?.textContent).toBe(STEALTH_STATEMENT);
  });

  it("keeps the statement clear of traction language", () => {
    expect(STEALTH_STATEMENT).not.toMatch(banned);
  });
});
