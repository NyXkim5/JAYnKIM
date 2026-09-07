import { describe, expect, it } from "vitest";
import { CELL, MAJOR_EVERY } from "@/features/projects/gridBackdrop";
import {
  BASE_ALPHA,
  MAJOR,
  breath,
  chooseFocus,
  coordsLabel,
  CYCLE_MS,
  cycleIndex,
  dimAlpha,
  DURATIONS,
  focusAlpha,
  focusPulse,
  ORDER,
  phaseAt,
  pull,
  SAYINGS,
  SPACING,
  stageFor,
} from "./grid";

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

  it("breathes once per rest, full at both ends and dipping to 70 percent in the middle", () => {
    expect(breath(0)).toBeCloseTo(1);
    expect(breath(1)).toBeCloseTo(1);
    expect(breath(0.5)).toBeCloseTo(0.7);
    for (const t of [0.1, 0.3, 0.6, 0.9]) {
      expect(breath(t)).toBeGreaterThanOrEqual(0.7);
      expect(breath(t)).toBeLessThanOrEqual(1);
    }
  });

  it("dims the rest of the grid as the focus takes hold and brightens the focus with the pull", () => {
    expect(dimAlpha(0, 1)).toBeCloseTo(BASE_ALPHA);
    expect(dimAlpha(1, 1)).toBeCloseTo(BASE_ALPHA * 0.22);
    expect(dimAlpha(0, 0.7)).toBeCloseTo(BASE_ALPHA * 0.7);
    const climb = [0, 0.5, 1].map((k) => focusAlpha(k, 1));
    expect(climb[0]).toBeCloseTo(BASE_ALPHA);
    expect(climb[1]).toBeGreaterThan(climb[0]);
    expect(climb[2]).toBeGreaterThan(climb[1]);
    expect(focusAlpha(1, 1)).toBeLessThanOrEqual(0.85);
    for (const ms of [0, 325, 650, 975, 1300]) {
      expect(focusPulse(ms)).toBeGreaterThanOrEqual(0.6);
      expect(focusPulse(ms)).toBeLessThanOrEqual(1);
    }
  });

  it("shares its cell and major-line cadence with the Projects backdrop", () => {
    expect(SPACING).toBe(CELL);
    expect(MAJOR).toBe(MAJOR_EVERY);
    expect(SPACING).toBeGreaterThanOrEqual(80);
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
