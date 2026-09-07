// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { PersonaBar } from "./PersonaBar";

vi.mock("@/components/transitions/TransitionLink", () => ({
  TransitionLink: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

describe("PersonaBar", () => {
  it("renders the four tabs at the bar's larger size with no size control", () => {
    render(<PersonaBar persona="work" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    for (const t of tabs) expect(t.className).toContain("md:text-[13px]");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("brackets the current persona and links the wordmark home", () => {
    render(<PersonaBar persona="work" />);
    const work = screen.getAllByRole("tab")[2];
    expect(work.textContent).toBe("[WORK]");
    expect(screen.getByText("Jay Kim").getAttribute("href")).toBe("/");
  });
});
