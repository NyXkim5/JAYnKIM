import { describe, it, expect } from "vitest";
import { snapshotToFrame, upsample, placeholderFrame, type SpecimenSnapshot } from "./snapshot";

function snap(overrides: Partial<SpecimenSnapshot> = {}): SpecimenSnapshot {
  return {
    persona: "hardware",
    cols: 2,
    rows: 2,
    values: [0, 0.5, 1, 0.25],
    labels: { "3": "1" },
    source: {
      repo: "NyXkim5/DroneNexus",
      commit: "abc",
      path: "services/core/siting/",
      how: "python3 scripts/specimen/hardware.py",
      observedAt: "2026-09-05",
    },
    ...overrides,
  };
}

describe("snapshotToFrame", () => {
  it("builds a frame with labels at the right indices", () => {
    const f = snapshotToFrame(snap());
    expect(f.cols).toBe(2);
    expect(f.cells[3]).toEqual({ v: 0.25, label: "1" });
    expect(f.cells[0]).toEqual({ v: 0 });
  });

  it("rejects a value outside 0..1", () => {
    expect(() => snapshotToFrame(snap({ values: [0, 0.5, 1.5, 0.25] }))).toThrow(/range/);
  });

  it("rejects a length mismatch", () => {
    expect(() => snapshotToFrame(snap({ values: [0, 0.5] }))).toThrow(/length/);
  });

  it("rejects a label index outside the grid", () => {
    expect(() => snapshotToFrame(snap({ labels: { "9": "x" } }))).toThrow(/label/);
  });
});

describe("upsample", () => {
  it("repeats each cell into a factor x factor block and keeps the label top-left", () => {
    const f = snapshotToFrame(snap());
    const up = upsample(f, 2);
    expect(up.cols).toBe(4);
    expect(up.rows).toBe(4);
    expect(up.cells[0].v).toBe(0);
    expect(up.cells[1].v).toBe(0);
    expect(up.cells[2].v).toBe(0.5);
    expect(up.cells[10]).toEqual({ v: 0.25, label: "1" });
    expect(up.cells[11]).toEqual({ v: 0.25 });
  });

  it("rejects a factor that is not a positive integer", () => {
    const f = snapshotToFrame(snap());
    expect(() => upsample(f, 0)).toThrow(/factor/);
    expect(() => upsample(f, -1)).toThrow(/factor/);
    expect(() => upsample(f, 1.5)).toThrow(/factor/);
  });
});

describe("placeholderFrame", () => {
  it("is a dim sparse grid with no labels", () => {
    const p = placeholderFrame(8, 8);
    expect(p.cells).toHaveLength(64);
    const lit = p.cells.filter((c) => c.v > 0);
    expect(lit.length).toBeGreaterThan(4);
    expect(lit.length).toBeLessThan(32);
    expect(p.cells.every((c) => c.label === undefined && c.v <= 0.2)).toBe(true);
  });
});
