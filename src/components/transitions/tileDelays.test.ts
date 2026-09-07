import { describe, it, expect } from "vitest";
import { tileDelays, GRID_COLS, GRID_ROWS } from "./tileDelays";

describe("tileDelays", () => {
  it("returns one delay per tile inside 0..1", () => {
    const d = tileDelays(GRID_COLS, GRID_ROWS, 42);
    expect(d).toHaveLength(GRID_COLS * GRID_ROWS);
    for (const v of d) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("sweeps from the top-left corner toward the bottom-right", () => {
    const d = tileDelays(GRID_COLS, GRID_ROWS, 7);
    expect(d[0]).toBeLessThan(d[d.length - 1]);
    expect(d[0]).toBeLessThan(0.25);
    expect(d[d.length - 1]).toBeGreaterThan(0.75);
  });

  it("is deterministic for a seed and varies between seeds", () => {
    expect(tileDelays(6, 4, 1)).toEqual(tileDelays(6, 4, 1));
    expect(tileDelays(6, 4, 1)).not.toEqual(tileDelays(6, 4, 2));
  });
});
