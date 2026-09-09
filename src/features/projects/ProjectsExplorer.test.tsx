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

// Folders start closed, so tests open every folder first to reach the leaves.
function renderExpanded() {
  render(<ProjectsExplorer />);
  for (const folder of screen.getAllByRole("button", { expanded: false })) fireEvent.click(folder);
}

function leafButton(name: string): HTMLButtonElement {
  const button = screen.getByText(name).closest("button");
  if (!button) throw new Error(`no leaf button for ${name}`);
  return button;
}

describe("ProjectsExplorer", () => {
  it("opens a project window from the tree and closes it with back", () => {
    renderExpanded();
    fireEvent.click(screen.getByText("Sensor siting optimizer"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByText(/back/i));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape without letting the key reach page-level listeners", () => {
    const pageLevel = vi.fn();
    window.addEventListener("keydown", pageLevel);
    renderExpanded();
    fireEvent.click(screen.getByText("Bamboo nutrition app"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(pageLevel).not.toHaveBeenCalled();
    window.removeEventListener("keydown", pageLevel);
  });

  it("lets Escape through when no window is open", () => {
    const pageLevel = vi.fn();
    window.addEventListener("keydown", pageLevel);
    renderExpanded();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(pageLevel).toHaveBeenCalledTimes(1);
    window.removeEventListener("keydown", pageLevel);
  });

  it("returns focus to the leaf that opened the window after Escape", () => {
    renderExpanded();
    const leaf = leafButton("Sensor siting optimizer");
    fireEvent.click(leaf);
    expect(document.activeElement).toBe(screen.getByLabelText("Back to projects"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.activeElement).toBe(leaf);
  });

  it("returns focus to the leaf after the back control", () => {
    renderExpanded();
    const leaf = leafButton("Bamboo nutrition app");
    fireEvent.click(leaf);
    fireEvent.click(screen.getByLabelText("Back to projects"));
    expect(document.activeElement).toBe(leaf);
  });

  it("moves focus to the new window when a second leaf opens over the first", () => {
    renderExpanded();
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
    renderExpanded();
    const tree = screen.getByText(/projects · click one/).parentElement;
    if (!tree) throw new Error("tree wrapper missing");
    expect(tree.className).not.toContain("max-md:hidden");
    fireEvent.click(leafButton("Bamboo nutrition app"));
    expect(tree.className).toContain("max-md:hidden");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(tree.className).not.toContain("max-md:hidden");
  });

  it("enlarges the window to the full width and hides the tree from md up, then shrinks back", () => {
    renderExpanded();
    const tree = screen.getByText(/projects · click one/).parentElement;
    if (!tree) throw new Error("tree wrapper missing");
    fireEvent.click(leafButton("Sensor siting optimizer"));
    const wrapper = screen.getByRole("dialog").parentElement;
    if (!wrapper) throw new Error("window wrapper missing");
    expect(wrapper.className).toContain("md:w-[min(52vw,680px)]");
    // "max-md:hidden" also contains the substring, so check the exact token.
    const classes = () => tree.className.split(/\s+/);
    expect(classes()).not.toContain("md:hidden");
    fireEvent.click(screen.getByLabelText("Enlarge the window"));
    expect(classes()).toContain("md:hidden");
    expect(wrapper.className).toContain("md:w-[min(92vw,1100px)]");
    fireEvent.click(screen.getByLabelText("Shrink the window"));
    expect(classes()).not.toContain("md:hidden");
    expect(wrapper.className).toContain("md:w-[min(52vw,680px)]");
  });

  it("opens on the four folders closed, with no leaf showing until one is clicked", () => {
    render(<ProjectsExplorer />);
    const folders = screen.getAllByRole("button", { expanded: false });
    expect(folders.map((b) => b.textContent)).toEqual(["defense/", "software/", "mobile/", "school contributions/"]);
    expect(screen.queryByText("Sensor siting optimizer")).toBeNull();
    expect(screen.getByRole("button", { expanded: true }).textContent).toBe("projects/");
    fireEvent.click(folders[0]);
    expect(screen.getByText("Sensor siting optimizer")).toBeTruthy();
  });
});
