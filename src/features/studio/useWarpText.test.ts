import { describe, it, expect } from "vitest";
import { warpFrame, WARP_DURATION, WARP_POOL } from "./useWarpText";

const EN = "Jay Kim";
const KO = "김준혁";
const inPool = (ch: string) => WARP_POOL.includes(ch) || ch === " ";

describe("warpFrame", () => {
  it("starts as pool glyphs at the source length and ends as the target", () => {
    const first = warpFrame(EN, KO, 0);
    expect(first).toHaveLength(EN.length);
    expect([...first].every(inPool)).toBe(true);
    expect(warpFrame(EN, KO, WARP_DURATION)).toBe(KO);
    expect(warpFrame(EN, KO, WARP_DURATION + 500)).toBe(KO);
  });

  it("draws from digits, symbols, and jamo", () => {
    expect(WARP_POOL).toMatch(/[0-9]/);
    expect(WARP_POOL).toMatch(/[#%&*+=]/);
    expect(WARP_POOL).toMatch(/[ㄱ-ㅎ]/);
  });

  it("eases the slot count toward the target length", () => {
    const lengths = [0, 200, 400, 560, 700].map((t) => warpFrame(EN, KO, t).length);
    for (let i = 1; i < lengths.length; i++) expect(lengths[i]).toBeLessThanOrEqual(lengths[i - 1]);
    expect(lengths[lengths.length - 1]).toBe(KO.length);
  });

  it("resolves characters from left to right", () => {
    const mid = warpFrame(KO, EN, 800);
    const resolved = [...mid].map((ch, i) => ch === EN[i]);
    const firstUnresolved = resolved.indexOf(false);
    expect(resolved[0]).toBe(true);
    if (firstUnresolved !== -1) expect(resolved.slice(firstUnresolved).some((r) => r)).toBe(false);
  });

  it("keeps spaces as spaces and only emits pool or target glyphs", () => {
    for (const t of [0, 300, 600, 900, 1200]) {
      const frame = warpFrame(KO, EN, t);
      for (let i = 0; i < frame.length; i++) {
        const ch = frame[i];
        if (EN[i] === " " && i < frame.length) expect(ch).toBe(" ");
        expect(inPool(ch) || ch === EN[i]).toBe(true);
      }
    }
  });

  it("changes glyphs on the tick, not every millisecond", () => {
    expect(warpFrame(EN, KO, 10)).toBe(warpFrame(EN, KO, 50));
    expect(warpFrame(EN, KO, 10)).not.toBe(warpFrame(EN, KO, 130));
  });
});
