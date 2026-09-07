// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { addressText, WindowChrome } from "./WindowChrome";

afterEach(cleanup);

const base = { title: "Bamboo nutrition app", active: "overview" as const, onTab: () => {}, onBack: () => {} };

describe("WindowChrome", () => {
  it("renders both tabs and brackets the active one", () => {
    render(<WindowChrome {...base} tabs={["overview", "case"]} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual(["[overview]", "case study"]);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
  });

  it("hides the case tab when the project has no case study", () => {
    render(<WindowChrome {...base} tabs={["overview"]} />);
    expect(screen.getAllByRole("tab")).toHaveLength(1);
    expect(screen.queryByText(/case study/i)).toBeNull();
  });

  it("calls onTab with the clicked tab", () => {
    const onTab = vi.fn();
    render(<WindowChrome {...base} tabs={["overview", "case"]} onTab={onTab} />);
    fireEvent.click(screen.getByText("case study"));
    expect(onTab).toHaveBeenCalledWith("case");
  });

  it("calls onBack from the close dot and focuses it on mount", () => {
    const onBack = vi.fn();
    render(<WindowChrome {...base} tabs={["overview"]} onBack={onBack} />);
    const dot = screen.getByLabelText("Back to projects");
    expect(document.activeElement).toBe(dot);
    fireEvent.click(dot);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("keeps the Back label visible at rest instead of on hover only", () => {
    render(<WindowChrome {...base} tabs={["overview"]} />);
    const back = screen.getByLabelText("Back to projects");
    expect(back.textContent).toBe("Back");
    expect(back.innerHTML).not.toContain("opacity-0");
  });

  it("offers Enlarge only when the explorer can act on it, and flips to Shrink once enlarged", () => {
    render(<WindowChrome {...base} tabs={["overview"]} />);
    expect(screen.queryByLabelText(/the window$/)).toBeNull();
    cleanup();
    const onEnlarge = vi.fn();
    render(<WindowChrome {...base} tabs={["overview"]} onEnlarge={onEnlarge} />);
    const enlarge = screen.getByLabelText("Enlarge the window");
    expect(enlarge.getAttribute("aria-pressed")).toBe("false");
    expect(enlarge.className).toContain("max-md:hidden");
    fireEvent.click(enlarge);
    expect(onEnlarge).toHaveBeenCalledTimes(1);
    cleanup();
    render(<WindowChrome {...base} tabs={["overview"]} onEnlarge={onEnlarge} enlarged />);
    expect(screen.getByLabelText("Shrink the window").getAttribute("aria-pressed")).toBe("true");
  });

  it("shows the url without protocol and trailing slash", () => {
    render(<WindowChrome {...base} tabs={["overview"]} url="https://bamboonutrition.app/" />);
    expect(screen.getByText("bamboonutrition.app")).toBeTruthy();
  });

  it("sticks under the persona bar below md and stretches controls to their bar", () => {
    render(<WindowChrome {...base} tabs={["overview", "case"]} />);
    const back = screen.getByLabelText("Back to projects");
    const root = back.parentElement?.parentElement;
    if (!root) throw new Error("chrome root missing");
    expect(root.className).toContain("max-md:sticky");
    expect(root.className).toContain("max-md:top-12");
    expect(back.className).toContain("self-stretch");
    for (const tab of screen.getAllByRole("tab")) expect(tab.className).toContain("self-stretch");
  });

  it("falls back to the site path when there is no url", () => {
    expect(addressText(undefined, "IRIS RFP platform")).toBe("jaykim.studio/projects/iris-rfp-platform");
    expect(addressText("https://github.com/NyXkim5/DroneNexus", "x")).toBe("github.com/NyXkim5/DroneNexus");
  });
});
