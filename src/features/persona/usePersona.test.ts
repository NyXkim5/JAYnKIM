import { describe, it, expect } from "vitest";
import { parseView, readStoredView, writeStoredView, STORAGE_KEY } from "./usePersona";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

function throwingStorage() {
  return {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };
}

describe("parseView", () => {
  it("accepts studio and persona keys and rejects everything else", () => {
    expect(parseView("studio")).toBe("studio");
    expect(parseView("work")).toBe("work");
    expect(parseView("war")).toBeNull();
    expect(parseView(null)).toBeNull();
    expect(parseView(undefined)).toBeNull();
  });
});

describe("readStoredView", () => {
  it("returns the stored view when valid", () => {
    expect(readStoredView(memoryStorage({ [STORAGE_KEY]: "design" }))).toBe("design");
    expect(readStoredView(memoryStorage({ [STORAGE_KEY]: "studio" }))).toBe("studio");
  });

  it("falls back to studio when missing, invalid, null, or throwing", () => {
    expect(readStoredView(memoryStorage())).toBe("studio");
    expect(readStoredView(memoryStorage({ [STORAGE_KEY]: "nope" }))).toBe("studio");
    expect(readStoredView(null)).toBe("studio");
    expect(readStoredView(throwingStorage())).toBe("studio");
  });
});

describe("writeStoredView", () => {
  it("writes and survives a throwing storage", () => {
    const s = memoryStorage();
    writeStoredView(s, "work");
    expect(s.getItem(STORAGE_KEY)).toBe("work");
    writeStoredView(s, "studio");
    expect(s.getItem(STORAGE_KEY)).toBe("studio");
    expect(() => writeStoredView(throwingStorage(), "work")).not.toThrow();
    expect(() => writeStoredView(null, "work")).not.toThrow();
  });
});
