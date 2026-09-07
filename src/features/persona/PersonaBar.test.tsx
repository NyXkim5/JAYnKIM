// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { PersonaBar, TAB_SIZE_KEY } from "./PersonaBar";

vi.mock("@/components/transitions/TransitionLink", () => ({
  TransitionLink: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

async function renderBar() {
  render(<PersonaBar persona="work" />);
  // The stored size is applied in a microtask after mount.
  await act(async () => {
    await Promise.resolve();
  });
}

describe("PersonaBar", () => {
  it("starts with small tabs and enlarges them from the A+ toggle, remembering the choice", async () => {
    await renderBar();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    for (const t of tabs) expect(t.className).toContain("text-[11px]");
    const toggle = screen.getByRole("button", { name: "Enlarge the tabs" });
    fireEvent.click(toggle);
    for (const t of screen.getAllByRole("tab")) expect(t.className).toContain("text-[15px]");
    expect(window.localStorage.getItem(TAB_SIZE_KEY)).toBe("1");
    expect(screen.getByRole("button", { name: "Shrink the tabs" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("restores large tabs when the choice was stored", async () => {
    window.localStorage.setItem(TAB_SIZE_KEY, "1");
    await renderBar();
    for (const t of screen.getAllByRole("tab")) expect(t.className).toContain("text-[15px]");
  });

  it("brackets the current persona and links the wordmark home", async () => {
    await renderBar();
    const work = screen.getAllByRole("tab")[2];
    expect(work.textContent).toBe("[WORK]");
    expect(screen.getByText("Jay Kim").getAttribute("href")).toBe("/");
  });
});
