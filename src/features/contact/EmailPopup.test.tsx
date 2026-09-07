// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EMAIL } from "@/data/contact";
import { EmailPopup } from "./EmailPopup";

afterEach(cleanup);

describe("EmailPopup", () => {
  it("opens a composer addressed to Jay and closes on Escape", () => {
    render(<EmailPopup />);
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "email" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain(EMAIL);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("turns what the visitor types into a mailto link for their own mail app", () => {
    render(<EmailPopup />);
    fireEvent.click(screen.getByRole("button", { name: "email" }));
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Ward demo" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Can we talk?" } });
    const send = screen.getByRole("link", { name: /send from your mail app/i });
    const href = send.getAttribute("href") ?? "";
    expect(href.startsWith(`mailto:${EMAIL}?`)).toBe(true);
    const query = new URLSearchParams(href.split("?")[1]);
    expect(query.get("subject")).toBe("Ward demo");
    expect(query.get("body")).toBe("Can we talk?\n\nAda");
  });

  it("closes from the Close button and from a click outside the card", () => {
    render(<EmailPopup />);
    fireEvent.click(screen.getByRole("button", { name: "email" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "email" }));
    const backdrop = screen.getByRole("dialog").parentElement;
    if (!backdrop) throw new Error("backdrop missing");
    fireEvent.click(backdrop);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
