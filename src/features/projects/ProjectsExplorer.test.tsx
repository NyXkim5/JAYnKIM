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

function leafButton(name: string): HTMLButtonElement {
  const button = screen.getByText(name).closest("button");
  if (!button) throw new Error(`no leaf button for ${name}`);
  return button;
}

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

  it("returns focus to the leaf that opened the window after Escape", () => {
    render(<ProjectsExplorer />);
    const leaf = leafButton("Sensor siting optimizer");
    fireEvent.click(leaf);
    expect(document.activeElement).toBe(screen.getByLabelText("Back to projects"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.activeElement).toBe(leaf);
  });

  it("returns focus to the leaf after the back control", () => {
    render(<ProjectsExplorer />);
    const leaf = leafButton("Bamboo nutrition app");
    fireEvent.click(leaf);
    fireEvent.click(screen.getByLabelText("Back to projects"));
    expect(document.activeElement).toBe(leaf);
  });

  it("moves focus to the new window when a second leaf opens over the first", () => {
    render(<ProjectsExplorer />);
    fireEvent.click(leafButton("Bamboo nutrition app"));
    const second = leafButton("IRIS RFP platform");
    fireEvent.click(second);
    expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("IRIS RFP platform");
    expect(document.activeElement).toBe(screen.getByLabelText("Back to projects"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.activeElement).toBe(second);
  });

  // jsdom has no layout, so the below-md contract is checked by class: the
  // tree hides while a window is open and comes back when it closes.
  it("hides the tree below md only while a window is open", () => {
    render(<ProjectsExplorer />);
    const tree = screen.getByText(/projects · click one/).parentElement;
    if (!tree) throw new Error("tree wrapper missing");
    expect(tree.className).not.toContain("max-md:hidden");
    fireEvent.click(leafButton("Bamboo nutrition app"));
    expect(tree.className).toContain("max-md:hidden");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(tree.className).not.toContain("max-md:hidden");
  });
});
