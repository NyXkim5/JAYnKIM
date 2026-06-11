import { describe, it, expect } from "vitest";
import { cafeRecs, foodRecs } from "./recs";

describe("recs", () => {
  it("has globally unique ids across cafes and food", () => {
    const ids = [...cafeRecs, ...foodRecs].map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only the allowed color tokens", () => {
    const allowed = new Set(["yellow", "pink", "blue", "green", "orange", "purple"]);
    for (const rec of [...cafeRecs, ...foodRecs]) {
      expect(allowed.has(rec.color)).toBe(true);
    }
  });

  it("uses only the allowed size tokens", () => {
    const allowed = new Set(["small", "medium", "large"]);
    for (const rec of [...cafeRecs, ...foodRecs]) {
      expect(allowed.has(rec.size)).toBe(true);
    }
  });
});
