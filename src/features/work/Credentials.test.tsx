// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Credentials } from "./Credentials";

vi.mock("@/data/credentials", async () => {
  const actual = await vi.importActual<typeof import("@/data/credentials")>("@/data/credentials");
  return { ...actual, earnedCredentials: vi.fn(actual.earnedCredentials) };
});

const { earnedCredentials } = await import("@/data/credentials");
const mocked = vi.mocked(earnedCredentials);

afterEach(() => {
  cleanup();
  mocked.mockReset();
});

describe("Credentials", () => {
  it("renders nothing while no credential has been earned", () => {
    mocked.mockReturnValue([]);
    const { container } = render(<Credentials />);
    // Not an empty heading, nothing at all.
    expect(container.firstChild).toBeNull();
  });

  it("renders an earned credential with its issuer and date", () => {
    mocked.mockReturnValue([
      {
        id: "fema.is100c",
        name: "IS-100.c: Introduction to the Incident Command System, ICS 100",
        issuer: "FEMA Emergency Management Institute",
        issuedOn: "2026-09-15",
        status: "earned",
        rationale: "The command structure every US emergency response is organised under.",
      },
    ]);
    render(<Credentials />);
    expect(screen.getByText(/IS-100.c/)).toBeTruthy();
    expect(screen.getByText("FEMA Emergency Management Institute")).toBeTruthy();
    expect(screen.getByText(/2026-09-15/)).toBeTruthy();
  });

  it("links a credential that carries a verification url", () => {
    mocked.mockReturnValue([
      {
        id: "palantir.builder-foundations",
        name: "Foundry & AIP Builder Foundations",
        issuer: "Palantir Technologies",
        issuedOn: "2026-09-20",
        verifyUrl: "https://example.invalid/badge",
        status: "earned",
        rationale: "The Ontology model underneath the platform.",
      },
    ]);
    render(<Credentials />);
    const link = screen.getByRole("link", { name: "Verify" });
    expect(link.getAttribute("href")).toBe("https://example.invalid/badge");
  });

  it("shows no verify link when the issuer provides none", () => {
    mocked.mockReturnValue([
      {
        id: "fema.is700b",
        name: "IS-700.b: An Introduction to the National Incident Management System",
        issuer: "FEMA Emergency Management Institute",
        issuedOn: "2026-09-16",
        status: "earned",
        rationale: "Resource management and the coordination structures above the incident.",
      },
    ]);
    render(<Credentials />);
    expect(screen.queryByRole("link", { name: "Verify" })).toBeNull();
  });
});
