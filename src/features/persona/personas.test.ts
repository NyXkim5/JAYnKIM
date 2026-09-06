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
    expect(PERSONA_KEYS).toEqual(["hardware", "software", "product", "business"]);
    expect(PERSONAS.map((p) => p.index)).toEqual([1, 2, 3, 4]);
  });

  it("puts hardware and software on black, product and business on white", () => {
    expect(getPersona("hardware").ground).toBe("black");
    expect(getPersona("software").ground).toBe("black");
    expect(getPersona("product").ground).toBe("white");
    expect(getPersona("business").ground).toBe("white");
  });

  it("marks only hardware and software live in phase 1", () => {
    expect(PERSONAS.filter((p) => p.live).map((p) => p.key)).toEqual(["hardware", "software"]);
  });

  it("defaults to hardware", () => {
    expect(DEFAULT_PERSONA).toBe("hardware");
  });

  it("guards unknown keys", () => {
    expect(isPersonaKey("hardware")).toBe(true);
    expect(isPersonaKey("war")).toBe(false);
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
    expect(isLandingView("software")).toBe(true);
    expect(isLandingView("war")).toBe(false);
    expect(isPersonaKey("studio")).toBe(false);
    expect(STUDIO_CLAIM).not.toContain("—");
  });
});
