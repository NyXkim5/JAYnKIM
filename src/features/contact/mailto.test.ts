import { describe, expect, it } from "vitest";
import { mailtoHref } from "./mailto";

describe("mailtoHref", () => {
  it("addresses the mail, encodes the subject and body, and signs with the sender", () => {
    const href = mailtoHref("someone@example.com", { from: "Ada", subject: "Hi there", message: "Line one\nLine two" });
    expect(href.startsWith("mailto:someone@example.com?")).toBe(true);
    const query = new URLSearchParams(href.split("?")[1]);
    expect(query.get("subject")).toBe("Hi there");
    expect(query.get("body")).toBe("Line one\nLine two\n\nAda");
    expect(href).not.toContain("+");
  });

  it("falls back to a default subject and skips the signature when the sender is blank", () => {
    const href = mailtoHref("someone@example.com", { from: "  ", subject: "", message: "Just this." });
    const query = new URLSearchParams(href.split("?")[1]);
    expect(query.get("subject")).toBe("Hello from jaykim.studio");
    expect(query.get("body")).toBe("Just this.");
  });
});
