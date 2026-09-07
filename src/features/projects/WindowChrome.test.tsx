// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { addressText, PRIVATE_NOTE, WindowChrome } from "./WindowChrome";

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

  it("shows the url without protocol and trailing slash, as a link that opens in a new tab", () => {
    render(<WindowChrome {...base} tabs={["overview"]} url="https://bamboonutrition.app/" />);
    expect(screen.getByText("bamboonutrition.app")).toBeTruthy();
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("https://bamboonutrition.app/");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(screen.queryByText("private")).toBeNull();
  });

  it("keeps a private repository linked and says that it is private", () => {
    render(<WindowChrome {...base} tabs={["overview"]} url="https://github.com/NyXkim5/DroneNexus" isPrivate />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("https://github.com/NyXkim5/DroneNexus");
    expect(link.getAttribute("title")).toBe(PRIVATE_NOTE);
    expect(screen.getByText("private")).toBeTruthy();
  });

  it("renders no link when the project has no url", () => {
    render(<WindowChrome {...base} tabs={["overview"]} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("jaykim.studio/projects/bamboo-nutrition-app")).toBeTruthy();
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
