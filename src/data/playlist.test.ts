import { describe, it, expect } from "vitest";
import { playlist } from "./playlist";

describe("playlist", () => {
  it("has unique song ids", () => {
    const ids = playlist.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every song at least one lyric line", () => {
    for (const song of playlist) {
      expect(song.lyrics.length).toBeGreaterThan(0);
    }
  });

  it("uses mm:ss durations", () => {
    for (const song of playlist) {
      expect(song.duration).toMatch(/^\d+:\d{2}$/);
    }
  });
});
