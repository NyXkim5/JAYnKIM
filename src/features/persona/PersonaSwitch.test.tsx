// src/features/persona/PersonaSwitch.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { PersonaSwitch } from "./PersonaSwitch";

afterEach(cleanup);

describe("PersonaSwitch", () => {
  it("renders four tabs with bracket labels and marks the active one", () => {
    render(<PersonaSwitch value="software" onChange={() => {}} ground="black" />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].textContent).toBe("[HARDWARE]");
  });

  it("calls onChange with the key when a tab is clicked", () => {
    const onChange = vi.fn();
    render(<PersonaSwitch value="hardware" onChange={onChange} ground="black" />);
    fireEvent.click(screen.getByText("[PRODUCT]"));
    expect(onChange).toHaveBeenCalledWith("product");
  });
});
