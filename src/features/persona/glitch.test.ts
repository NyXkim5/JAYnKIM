import { describe, it, expect } from "vitest";
import { glitchTail, GLITCH_TAIL } from "./glitch";

describe("glitchTail", () => {
  it("keeps the head and length and swaps only the last three letters", () => {
    const out = glitchTail("HARDWARE", 0);
    expect(out).toHaveLength("HARDWARE".length);
    expect(out.startsWith("HARDW")).toBe(true);
    expect(out.slice(-GLITCH_TAIL)).not.toBe("ARE");
    expect(out.slice(-GLITCH_TAIL)).toMatch(/^[#%&/<>0-9]{3}$/);
  });

  it("changes between ticks and leaves short labels alone", () => {
    expect(glitchTail("SOFTWARE", 1)).not.toBe(glitchTail("SOFTWARE", 2));
    expect(glitchTail("ABC", 3)).toBe("ABC");
  });
});
