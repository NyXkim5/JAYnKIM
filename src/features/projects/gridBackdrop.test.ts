import { describe, expect, it } from "vitest";
import {
  BASE_ALPHA,
  FADE_IN_MS,
  FADE_OUT_MS,
  LIFE_MS,
  MAX_BLIPS,
  PULSES,
  SPAWN_MIN_MS,
  blipAlpha,
  cellLabel,
  glowAt,
  pulseBreath,
  pulseCentre,
  segmentAlpha,
  spawnBlip,
  stepBlips,
  type Blip,
} from "./gridBackdrop";

const seq = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

const W = 1600;
const H = 1000;

describe("pulses", () => {
  it("drift but stay inside the canvas", () => {
    for (const p of PULSES) {
      for (let t = 0; t < 200000; t += 1370) {
        const c = pulseCentre(p, t, W, H);
        expect(c.x).toBeGreaterThan(0);
        expect(c.x).toBeLessThan(W);
        expect(c.y).toBeGreaterThan(0);
        expect(c.y).toBeLessThan(H);
      }
    }
  });

  it("swell between 0 and 1 and do not all peak together", () => {
    const peaks = PULSES.map((p) => {
      let best = 0;
      let at = 0;
      for (let t = 0; t < p.breathMs; t += 10) {
        const v = pulseBreath(p, t);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
        if (v > best) {
          best = v;
          at = t;
        }
      }
      return at / p.breathMs;
    });
    expect(new Set(peaks.map((x) => x.toFixed(1))).size).toBe(PULSES.length);
  });
});

describe("glowAt", () => {
  it("is brightest at a pulse centre at its peak and falls off with distance", () => {
    const p = PULSES[0];
    const t = ((Math.PI / 2 - p.phase) / (Math.PI * 2)) * p.breathMs;
    const c = pulseCentre(p, t, W, H);
    const centre = glowAt(c.x, c.y, t, W, H);
    const near = glowAt(c.x + 120, c.y, t, W, H);
    const far = glowAt(c.x + 400, c.y, t, W, H);
    expect(centre).toBeCloseTo(1, 3);
    expect(near).toBeLessThan(centre);
    expect(far).toBeLessThan(near);
    expect(far).toBeLessThan(0.25);
  });

  it("changes over time at a fixed point, so the grid visibly breathes", () => {
    const p = PULSES[0];
    const c = pulseCentre(p, 0, W, H);
    const bright = glowAt(c.x, c.y, ((Math.PI / 2 - p.phase) / (Math.PI * 2)) * p.breathMs, W, H);
    const dim = glowAt(c.x, c.y, ((-Math.PI / 2 - p.phase) / (Math.PI * 2)) * p.breathMs, W, H);
    expect(bright - dim).toBeGreaterThan(0.5);
  });
});

describe("segmentAlpha", () => {
  it("never drops below the base and majors are brighter than minors", () => {
    const minor = segmentAlpha(10, 10, 12345, W, H, false);
    const major = segmentAlpha(10, 10, 12345, W, H, true);
    expect(minor).toBeGreaterThanOrEqual(BASE_ALPHA);
    expect(major).toBeGreaterThan(minor);
    expect(major).toBeLessThanOrEqual(1);
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
