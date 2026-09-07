import { describe, expect, it } from "vitest";
import { BANDS, bandTop, COVER_MS, glitchLayout, GLYPHS, MAX_BLOCKS, MAX_JITTER, REVEAL_MS } from "./glitchLayout";

describe("glitchLayout", () => {
  it("fills the screen: band heights sum to one and each band's block widths sum to one", () => {
    const { bands } = glitchLayout(42);
    expect(bands).toHaveLength(BANDS);
    expect(bands.reduce((a, b) => a + b.height, 0)).toBeCloseTo(1, 9);
    for (const b of bands) {
      expect(b.blocks.length).toBeGreaterThanOrEqual(1);
      expect(b.blocks.length).toBeLessThanOrEqual(MAX_BLOCKS);
      expect(b.blocks.reduce((a, k) => a + k.width, 0)).toBeCloseTo(1, 9);
    }
  });

  it("keeps every block's timing inside the phase budget", () => {
    const { bands } = glitchLayout(7);
    for (const b of bands) {
      for (const k of b.blocks) {
        expect(["left", "right"]).toContain(k.from);
        expect(k.coverDelay).toBeGreaterThanOrEqual(0);
        expect((k.coverDelay + k.coverDuration) * 1000).toBeLessThanOrEqual(COVER_MS);
        expect(k.revealDelay).toBeGreaterThanOrEqual(0);
        expect((k.revealDelay + k.revealDuration) * 1000).toBeLessThanOrEqual(REVEAL_MS);
      }
    }
  });

  it("names the block that finishes last in each phase", () => {
    const { bands, lastCover, lastReveal } = glitchLayout(3);
    const coverEnd = (b: { band: number; block: number }) => {
      const k = bands[b.band].blocks[b.block];
      return k.coverDelay + k.coverDuration;
    };
    const revealEnd = (b: { band: number; block: number }) => {
      const k = bands[b.band].blocks[b.block];
      return k.revealDelay + k.revealDuration;
    };
    bands.forEach((bd, bi) =>
      bd.blocks.forEach((_, ki) => {
        expect(coverEnd({ band: bi, block: ki })).toBeLessThanOrEqual(coverEnd(lastCover));
        expect(revealEnd({ band: bi, block: ki })).toBeLessThanOrEqual(revealEnd(lastReveal));
      }),
    );
  });

  it("jitters some blocks a little, flashes letter-only glyph noise on a few, and tags a middle band", () => {
    const layout = glitchLayout(5);
    const blocks = layout.bands.flatMap((b) => b.blocks);
    for (const k of blocks) {
      expect(Math.abs(k.jitter)).toBeLessThanOrEqual(MAX_JITTER);
      expect(Number.isInteger(k.jitter)).toBe(true);
      if (k.glyphs !== null) {
        expect(k.glyphs.length).toBeGreaterThanOrEqual(5);
        expect(k.glyphs.length).toBeLessThanOrEqual(12);
        for (const ch of k.glyphs) expect(GLYPHS).toContain(ch);
        expect(k.glyphs).not.toMatch(/[0-9]/);
      }
    }
    expect(blocks.some((k) => k.jitter !== 0)).toBe(true);
    expect(blocks.some((k) => k.jitter === 0)).toBe(true);
    expect(blocks.some((k) => k.glyphs !== null)).toBe(true);
    const third = Math.floor(BANDS / 3);
    expect(layout.tagBand).toBeGreaterThanOrEqual(third);
    expect(layout.tagBand).toBeLessThan(2 * third);
    expect(bandTop(layout.bands, 0)).toBe(0);
    expect(bandTop(layout.bands, BANDS)).toBeCloseTo(1, 9);
    expect(bandTop(layout.bands, layout.tagBand)).toBeGreaterThan(0.2);
  });

  it("is deterministic for a seed, varies between seeds, and mixes sides and flicker", () => {
    expect(glitchLayout(1)).toEqual(glitchLayout(1));
    expect(glitchLayout(1)).not.toEqual(glitchLayout(2));
    const blocks = glitchLayout(11).bands.flatMap((b) => b.blocks);
    expect(blocks.some((k) => k.from === "left")).toBe(true);
    expect(blocks.some((k) => k.from === "right")).toBe(true);
    expect(blocks.some((k) => k.flicker)).toBe(true);
    expect(blocks.some((k) => !k.flicker)).toBe(true);
  });
});
