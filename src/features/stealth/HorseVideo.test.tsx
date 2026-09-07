// @vitest-environment jsdom
import { existsSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { HORSE_ALT, HORSE_SOURCES, HorseVideo } from "./HorseVideo";

afterEach(cleanup);

describe("HorseVideo", () => {
  it("offers HEVC alpha first for Safari, WebM alpha second, and the black-backed mp4 last", () => {
    expect(HORSE_SOURCES.map((s) => s.src)).toEqual(["/stealth/horse-hevc.mov", "/stealth/horse.webm", "/stealth/horse.mp4"]);
    expect(HORSE_SOURCES[0].type).toContain("hvc1");
    expect(HORSE_SOURCES[1].type).toContain("vp9");
  });

  it("ships every file it points at", () => {
    for (const s of HORSE_SOURCES) expect(existsSync(join(process.cwd(), "public", s.src)), s.src).toBe(true);
  });

  it("renders a muted, looping, inline video with all three sources in order", () => {
    const { container } = render(<HorseVideo />);
    const video = container.querySelector("video");
    if (!video) throw new Error("video missing");
    expect(video.muted).toBe(true);
    expect(video.hasAttribute("loop")).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.getAttribute("aria-label")).toBe(HORSE_ALT);
    const sources = Array.from(video.querySelectorAll("source")).map((s) => s.getAttribute("src"));
    expect(sources).toEqual(HORSE_SOURCES.map((s) => s.src));
  });
});
