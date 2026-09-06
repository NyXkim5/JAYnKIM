import { describe, it, expect } from "vitest";
import { frameFor, snapshotFor } from "./adapters";
import { PERSONA_KEYS } from "@/features/persona/personas";

describe("adapters", () => {
  it("returns a 48x48 frame with four numbered sensors for hardware", () => {
    const f = frameFor("hardware");
    expect(f.cols).toBe(48);
    expect(f.rows).toBe(48);
    const labels = f.cells.filter((c) => c.label !== undefined).map((c) => c.label).sort();
    expect(labels).toEqual(["1", "2", "3", "4"]);
  });

  it("returns a 16x14 upsampled frame for software with the three headline labels", () => {
    const f = frameFor("software");
    expect(f.cols).toBe(16);
    expect(f.rows).toBe(14);
    const labels = f.cells.filter((c) => c.label !== undefined).map((c) => c.label);
    expect(labels).toEqual(["13", "18", "0"]);
  });

  it("returns a placeholder for personas that are not live", () => {
    for (const key of ["product", "business"] as const) {
      const f = frameFor(key);
      expect(f.cells.every((c) => c.label === undefined)).toBe(true);
      expect(snapshotFor(key)).toBeNull();
    }
  });

  it("carries a source with a commit for every live persona", () => {
    for (const key of PERSONA_KEYS) {
      const s = snapshotFor(key);
      if (!s) continue;
      expect(s.source.commit).toMatch(/^[0-9a-f]{7,40}$/);
      expect(s.source.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("fails loudly on a corrupted snapshot (mutation check)", async () => {
    const mod = await import("./data/hardware.json");
    const bad = { ...mod.default, values: [...mod.default.values] };
    bad.values[0] = 2;
    const { snapshotToFrame } = await import("./snapshot");
    expect(() => snapshotToFrame(bad as never)).toThrow(/range/);
  });
});
