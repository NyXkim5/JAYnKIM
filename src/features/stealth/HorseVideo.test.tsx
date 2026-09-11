// @vitest-environment jsdom
import { existsSync, readFileSync } from "node:fs";
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

describe("the horse sources actually carry alpha", () => {
  // The bug this guards: HorseVideo offers the HEVC first because Safari cannot
  // play the alpha WebM. The generator built that HEVC with the same
  // black-compositing filter as the no-alpha mp4 fallback, so every iPhone got
  // an opaque rectangle while desktop Chrome, which falls through to the WebM,
  // looked perfect. Ordering and MIME types were already asserted and both were
  // correct, which is why the old tests passed.
  const generator = readFileSync(join(process.cwd(), "scripts/stealth/horse.py"), "utf8");

  function encodeCall(outfile: string): string {
    const at = generator.indexOf(outfile);
    expect(at, `${outfile} is not produced by the generator`).toBeGreaterThan(-1);
    // The subprocess.run( that precedes this output path.
    const start = generator.lastIndexOf("subprocess.run(", at);
    expect(start).toBeGreaterThan(-1);
    return generator.slice(start, at);
  }

  it("encodes the WebM with an alpha pixel format", () => {
    expect(encodeCall("horse.webm")).toContain("yuva420p");
  });

  it("encodes the HEVC with alpha and never composites it", () => {
    const call = encodeCall("horse-hevc.mov");
    expect(call).toContain("bgra");
    expect(call).toContain("alpha_quality");
    // The composite is what silently removed the transparency.
    expect(call).not.toContain("overlay");
    expect(call).not.toContain("format=yuv420p");
  });

  it("composites only the mp4 fallback, and onto the page ground", () => {
    // The compositing filter is built once into on_ground and used by the mp4
    // call alone, so assert the wiring rather than expecting it inline.
    expect(encodeCall("horse.mp4")).toContain("on_ground");
    expect(generator).toContain("overlay=shortest=1");
    // Pure black would show as a darker box against the page's own ground.
    expect(generator).toContain('GROUND = "#0a0a0a"');
    expect(generator).not.toContain("color=black");
  });
});
