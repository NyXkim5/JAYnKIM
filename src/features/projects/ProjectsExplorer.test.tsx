// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ProjectsExplorer } from "./ProjectsExplorer";

// jsdom never finishes an exit animation, so presence is stubbed to unmount at once.
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("@/features/persona/PersonaBar", () => ({ PersonaBar: () => null }));
vi.mock("@/components/transitions/TransitionLink", () => ({
  TransitionLink: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

afterEach(cleanup);

describe("ProjectsExplorer", () => {
  it("opens a project window from the tree and closes it with back", () => {
    render(<ProjectsExplorer />);
    fireEvent.click(screen.getByText("Sensor siting optimizer"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByText(/back/i));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape without letting the key reach page-level listeners", () => {
    const pageLevel = vi.fn();
    window.addEventListener("keydown", pageLevel);
    render(<ProjectsExplorer />);
    fireEvent.click(screen.getByText("Bamboo nutrition app"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(pageLevel).not.toHaveBeenCalled();
    window.removeEventListener("keydown", pageLevel);
  });

  it("lets Escape through when no window is open", () => {
    const pageLevel = vi.fn();
    window.addEventListener("keydown", pageLevel);
    render(<ProjectsExplorer />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(pageLevel).toHaveBeenCalledTimes(1);
    window.removeEventListener("keydown", pageLevel);
  });
});
