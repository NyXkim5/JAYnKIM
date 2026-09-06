import { describe, it, expect } from "vitest";
import { layout, render, emptyFrame, interpolate, breathe } from "./renderer";
import type { SpecimenFrame } from "./types";

function frame(cols: number, rows: number, v = 0.5): SpecimenFrame {
  return { cols, rows, cells: Array.from({ length: cols * rows }, () => ({ v })) };
}

describe("layout", () => {
  it("fits the grid inside the box and centres it", () => {
    const l = layout(frame(4, 2), 400, 400);
    expect(l.cell).toBe(100);
    expect(l.ox).toBe(0);
    expect(l.oy).toBe(100);
  });

  it("keeps a gap of at least one pixel", () => {
    expect(layout(frame(100, 100), 50, 50).gap).toBeGreaterThanOrEqual(1);
  });
});

describe("render", () => {
  it("skips cells at or below the floor", () => {
    const f = frame(2, 1, 0);
    f.cells[1] = { v: 1 };
    const calls = render(f, 200, 100, "black");
    expect(calls.filter((c) => c.kind === "rect")).toHaveLength(1);
  });

  it("is deterministic", () => {
    const f = frame(3, 3, 0.7);
    expect(render(f, 300, 300, "black")).toEqual(render(f, 300, 300, "black"));
  });

  it("draws a labelled cell as an inverse rect plus text", () => {
    const f = frame(1, 1, 0.3);
    f.cells[0] = { v: 0.3, label: "7" };
    const calls = render(f, 100, 100, "black");
    const rect = calls.find((c) => c.kind === "rect");
    const text = calls.find((c) => c.kind === "text");
    expect(rect && rect.gray).toBe(1);
    expect(text && text.text).toBe("7");
    expect(text && text.gray).toBe(0);
  });

  it("maps brighter values to lighter gray on black and darker gray on white", () => {
    const f = frame(1, 1, 1);
    const onBlack = render(f, 10, 10, "black")[0];
    const onWhite = render(f, 10, 10, "white")[0];
    expect(onBlack.kind === "rect" && onBlack.gray).toBeGreaterThan(0.8);
    expect(onWhite.kind === "rect" && onWhite.gray).toBeLessThan(0.2);
  });
});

describe("interpolate", () => {
  it("returns a at t=0 and b at t=1", () => {
    const a = frame(4, 4, 0.2);
    const b = frame(4, 4, 0.9);
    expect(interpolate(a, b, 0)).toEqual(a);
    expect(interpolate(a, b, 1)).toEqual(b);
  });

  it("resolves cells in reading order", () => {
    const a = frame(4, 1, 0);
    const b = frame(4, 1, 1);
    const mid = interpolate(a, b, 0.5);
    expect(mid.cells.map((c) => c.v)).toEqual([1, 1, 0, 0]);
  });

  it("throws on mismatched dimensions", () => {
    expect(() => interpolate(frame(2, 2), frame(3, 3), 0.5)).toThrow();
  });
});

describe("breathe", () => {
  it("changes at most one percent of cells", () => {
    const f = frame(50, 50, 0.5);
    const out = breathe(f, 7, 3);
    const changed = out.cells.filter((c, i) => c.v !== f.cells[i].v).length;
    expect(changed).toBeLessThanOrEqual(25);
    expect(changed).toBeGreaterThan(0);
  });

  it("stays within range and is deterministic for the same seed and tick", () => {
    const f = frame(20, 20, 0.98);
    const a = breathe(f, 1, 9);
    const b = breathe(f, 1, 9);
    expect(a).toEqual(b);
    for (const c of a.cells) {
      expect(c.v).toBeGreaterThanOrEqual(0);
      expect(c.v).toBeLessThanOrEqual(1);
    }
  });

  it("never touches labelled cells", () => {
    const f = frame(10, 10, 0.5);
    f.cells[0] = { v: 0.5, label: "3" };
    for (let t = 0; t < 50; t++) {
      expect(breathe(f, 4, t).cells[0]).toEqual(f.cells[0]);
    }
  });
});

describe("emptyFrame", () => {
  it("builds a zeroed frame of the right size", () => {
    const e = emptyFrame(3, 2);
    expect(e.cells).toHaveLength(6);
    expect(e.cells.every((c) => c.v === 0 && c.label === undefined)).toBe(true);
  });
});
