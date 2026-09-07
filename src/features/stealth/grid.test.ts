import { describe, expect, it } from "vitest";
import { breath, chooseFocus, coordsLabel, CYCLE_MS, cycleIndex, DURATIONS, ORDER, phaseAt, pull, SAYINGS, stageFor, warp } from "./grid";

const banned = /\b(signed|customers?|pilots?|early users|first users|active users|paying)\b/i;

describe("stealth grid cycle", () => {
  it("walks breathe, converge, hold, release and wraps around", () => {
    expect(phaseAt(0)).toEqual({ phase: "breathe", t: 0 });
    let offset = 0;
    for (const phase of ORDER) {
      expect(phaseAt(offset + 1).phase).toBe(phase);
      expect(phaseAt(offset + DURATIONS[phase] - 1).phase).toBe(phase);
      offset += DURATIONS[phase];
    }
    expect(offset).toBe(CYCLE_MS);
    expect(phaseAt(CYCLE_MS + 5).phase).toBe("breathe");
    expect(phaseAt(-5).phase).toBe("release");
  });

  it("pulls nothing while breathing, everything while holding, and eases in and out between", () => {
    expect(pull("breathe", 0.5)).toBe(0);
    expect(pull("hold", 0.5)).toBe(1);
    const rising = [0, 0.25, 0.5, 0.75, 1].map((t) => pull("converge", t));
    for (let i = 1; i < rising.length; i++) expect(rising[i]).toBeGreaterThanOrEqual(rising[i - 1]);
    expect(rising[0]).toBe(0);
    expect(rising[4]).toBeCloseTo(1);
    expect(pull("release", 0)).toBeCloseTo(1);
    expect(pull("release", 1)).toBeCloseTo(0);
  });

  it("bends grid points toward the focus, near ones most, far ones barely, none at rest", () => {
    const focus = { x: 500, y: 300, saying: SAYINGS[0] };
    expect(warp(100, 100, focus, 0, 300)).toEqual([100, 100]);
    const [nx, ny] = warp(540, 320, focus, 1, 300);
    expect(Math.hypot(nx - focus.x, ny - focus.y)).toBeLessThan(Math.hypot(40, 20) * 0.2);
    const [fx, fy] = warp(2000, 1500, focus, 1, 300);
    expect(Math.hypot(fx - 2000, fy - 1500)).toBeLessThan(1);
    for (const [x, y] of [[300, 300], [700, 100], [500, 600]] as const) {
      const [wx, wy] = warp(x, y, focus, 0.5, 300);
      expect(Math.hypot(wx - focus.x, wy - focus.y)).toBeLessThan(Math.hypot(x - focus.x, y - focus.y));
    }
  });

  it("breathes gently around full strength and unit scale", () => {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const { alpha, scale } = breath(t);
      expect(alpha).toBeGreaterThanOrEqual(0.6);
      expect(alpha).toBeLessThanOrEqual(1);
      expect(Math.abs(scale - 1)).toBeLessThanOrEqual(0.012 + 1e-9);
    }
  });

  it("chooses a focus inside the safe margins with a fresh saying, and labels it with four digits", () => {
    const seq = [0, 0.999, 0.5];
    let i = 0;
    const random = () => seq[i++ % seq.length];
    const first = chooseFocus(1000, 800, random);
    expect(first.x).toBeGreaterThanOrEqual(180);
    expect(first.y).toBeLessThanOrEqual(640);
    expect(SAYINGS).toContain(first.saying);
    const second = chooseFocus(1000, 800, () => 0.1, first);
    expect(second.saying).not.toBe(first.saying);
    expect(coordsLabel({ x: 412.4, y: 33, saying: "" })).toBe("0412 · 0033");
  });

  it("derives the label stage and the cycle number from time alone", () => {
    expect(stageFor("breathe")).toBeNull();
    expect(stageFor("converge")).toBe("coords");
    expect(stageFor("hold")).toBe("saying");
    expect(stageFor("release")).toBe("fading");
    expect(cycleIndex(0)).toBe(0);
    expect(cycleIndex(CYCLE_MS - 1)).toBe(0);
    expect(cycleIndex(CYCLE_MS)).toBe(1);
    expect(cycleIndex(CYCLE_MS * 3 + 10)).toBe(3);
  });

  it("keeps every saying short and clear of traction language", () => {
    expect(SAYINGS.length).toBeGreaterThanOrEqual(6);
    for (const s of SAYINGS) {
      expect(s.length).toBeLessThanOrEqual(60);
      expect(s).not.toMatch(banned);
    }
  });
});
