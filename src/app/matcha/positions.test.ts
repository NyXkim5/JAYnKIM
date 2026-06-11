import { describe, it, expect } from "vitest";
import { generatePositions } from "./positions";

describe("generatePositions", () => {
  it("returns one position per item", () => {
    expect(generatePositions(0, 42)).toHaveLength(0);
    expect(generatePositions(7, 42)).toHaveLength(7);
  });

  it("is deterministic for the same count and seed", () => {
    expect(generatePositions(13, 42)).toEqual(generatePositions(13, 42));
  });

  it("produces different layouts for different seeds", () => {
    expect(generatePositions(13, 42)).not.toEqual(generatePositions(13, 73));
  });

  it("lays items out in a 5-column grid", () => {
    const pos = generatePositions(12, 42);
    // Row index advances every 5 items, so item 0 and item 5 differ by one row (220px base).
    expect(pos[5].y - pos[0].y).toBeCloseTo(220 + jitterY(42, 6) - jitterY(42, 1), 5);
  });

  it("keeps rotation within the +/-8 degree jitter band", () => {
    for (const p of generatePositions(50, 73)) {
      expect(p.rotate).toBeGreaterThanOrEqual(-8);
      expect(p.rotate).toBeLessThanOrEqual(7);
    }
  });
});

// Mirrors the randomY term in generatePositions for the grid-spacing assertion.
function jitterY(seed: number, oneBasedIndex: number): number {
  return ((seed * oneBasedIndex * 17) % 30) - 15;
}
