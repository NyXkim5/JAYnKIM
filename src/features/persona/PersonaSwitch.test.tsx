// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { PersonaSwitch } from "./PersonaSwitch";

afterEach(cleanup);

describe("PersonaSwitch", () => {
  it("renders four tabs and brackets only the active one", () => {
    render(<PersonaSwitch value="design" onChange={() => {}} ground="black" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].textContent).toBe("PROJECTS");
    expect(tabs[1].textContent).toBe("[DESIGN]");
    expect(tabs[3].textContent).toBe("STEALTH");
  });

  it("calls onChange with the key when a tab is clicked", () => {
    const onChange = vi.fn();
    render(<PersonaSwitch value="projects" onChange={onChange} ground="black" />);
    const work = screen.getAllByRole("tab")[2];
    expect(work.textContent).toBe("WORK");
    fireEvent.click(work);
    expect(onChange).toHaveBeenCalledWith("work");
  });
});
