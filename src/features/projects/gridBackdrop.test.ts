import { describe, expect, it } from "vitest";
import {
  BREATH_MS,
  FADE_IN_MS,
  FADE_OUT_MS,
  LIFE_MS,
  MAX_BLIPS,
  SPAWN_MIN_MS,
  blipAlpha,
  breath,
  cellLabel,
  spawnBlip,
  stepBlips,
  type Blip,
} from "./gridBackdrop";

const seq = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe("breath", () => {
  it("stays inside 0..1 and repeats every BREATH_MS", () => {
    for (let t = 0; t < BREATH_MS * 2; t += 97) {
      const v = breath(t);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
      expect(breath(t + BREATH_MS)).toBeCloseTo(v, 6);
    }
    expect(breath(BREATH_MS / 4)).toBeCloseTo(1, 6);
  });
});

describe("blipAlpha", () => {
  const b: Blip = { col: 3, row: 4, born: 1000, life: LIFE_MS };
  it("rises, holds at one, then falls to zero at end of life", () => {
    expect(blipAlpha(b, 999)).toBe(0);
    expect(blipAlpha(b, 1000)).toBe(0);
    expect(blipAlpha(b, 1000 + FADE_IN_MS / 2)).toBeCloseTo(0.5, 6);
    expect(blipAlpha(b, 1000 + FADE_IN_MS + 10)).toBe(1);
    expect(blipAlpha(b, 1000 + LIFE_MS - FADE_OUT_MS / 2)).toBeCloseTo(0.5, 6);
    expect(blipAlpha(b, 1000 + LIFE_MS)).toBe(0);
  });
});

describe("spawnBlip", () => {
  it("never lands on the outer ring of cells", () => {
    for (const r of [0, 0.5, 0.999]) {
      const b = spawnBlip(10, 6, 0, () => r);
      expect(b.col).toBeGreaterThanOrEqual(1);
      expect(b.col).toBeLessThanOrEqual(8);
      expect(b.row).toBeGreaterThanOrEqual(1);
      expect(b.row).toBeLessThanOrEqual(4);
    }
  });
});

describe("stepBlips", () => {
  it("prunes dead blips and spawns only when the timer has elapsed", () => {
    const dead: Blip = { col: 1, row: 1, born: 0, life: LIFE_MS };
    const early = stepBlips([dead], LIFE_MS + 1, LIFE_MS + 500, 20, 20, seq([0.5]));
    expect(early.blips).toEqual([]);
    expect(early.spawnAt).toBe(LIFE_MS + 500);
    const due = stepBlips([], 5000, 5000, 20, 20, seq([0.5]));
    expect(due.blips).toHaveLength(1);
    expect(due.spawnAt).toBeGreaterThanOrEqual(5000 + SPAWN_MIN_MS);
  });

  it("caps concurrent blips at MAX_BLIPS", () => {
    const full = Array.from({ length: MAX_BLIPS }, (_, i) => ({ col: i + 1, row: 1, born: 9000, life: LIFE_MS }));
    const r = stepBlips(full, 9100, 9000, 20, 20, seq([0.5]));
    expect(r.blips).toHaveLength(MAX_BLIPS);
    expect(r.spawnAt).toBeGreaterThan(9100);
  });
});

describe("cellLabel", () => {
  it("zero-pads the cell index", () => {
    expect(cellLabel({ col: 7, row: 12, born: 0, life: 1 })).toBe("07·12");
  });
});
