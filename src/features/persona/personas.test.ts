import { describe, it, expect } from "vitest";
import {
  PERSONAS,
  PERSONA_KEYS,
  DEFAULT_PERSONA,
  DEFAULT_VIEW,
  STUDIO_CLAIM,
  isPersonaKey,
  isLandingView,
  getPersona,
} from "./personas";

describe("personas", () => {
  it("defines exactly four personas in keyboard order", () => {
    expect(PERSONA_KEYS).toEqual(["projects", "design", "work", "stealth"]);
    expect(PERSONAS.map((p) => p.index)).toEqual([1, 2, 3, 4]);
  });

  it("puts projects and stealth on black, design and work on white", () => {
    expect(getPersona("projects").ground).toBe("black");
    expect(getPersona("stealth").ground).toBe("black");
    expect(getPersona("design").ground).toBe("black");
    expect(getPersona("work").ground).toBe("black");
  });

  it("marks only projects and work live in this phase", () => {
    expect(PERSONAS.filter((p) => p.live).map((p) => p.key)).toEqual(["projects", "work"]);
  });

  it("defaults to projects", () => {
    expect(DEFAULT_PERSONA).toBe("projects");
  });

  it("guards unknown keys", () => {
    expect(isPersonaKey("projects")).toBe(true);
    expect(isPersonaKey("hardware")).toBe(false);
    expect(isPersonaKey("")).toBe(false);
  });

  it("gives every persona a one-sentence claim with no em dash", () => {
    for (const p of PERSONAS) {
      expect(p.claim.length).toBeGreaterThan(20);
      expect(p.claim).not.toContain("—");
    }
  });

  it("treats studio as the default landing view but not a persona", () => {
    expect(DEFAULT_VIEW).toBe("studio");
    expect(isLandingView("studio")).toBe(true);
    expect(isLandingView("work")).toBe(true);
    expect(isLandingView("war")).toBe(false);
    expect(isPersonaKey("studio")).toBe(false);
    expect(STUDIO_CLAIM).not.toContain("—");
  });
});
