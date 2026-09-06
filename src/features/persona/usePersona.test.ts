import { describe, it, expect } from "vitest";
import { parsePersona, readStoredPersona, writeStoredPersona, STORAGE_KEY } from "./usePersona";

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

describe("parsePersona", () => {
  it("accepts known keys and rejects everything else", () => {
    expect(parsePersona("software")).toBe("software");
    expect(parsePersona("war")).toBeNull();
    expect(parsePersona(null)).toBeNull();
    expect(parsePersona(undefined)).toBeNull();
  });
});

describe("readStoredPersona", () => {
  it("returns the stored key when valid", () => {
    expect(readStoredPersona(memoryStorage({ [STORAGE_KEY]: "product" }))).toBe("product");
  });

  it("falls back to the default when missing, invalid, null, or throwing", () => {
    expect(readStoredPersona(memoryStorage())).toBe("hardware");
    expect(readStoredPersona(memoryStorage({ [STORAGE_KEY]: "nope" }))).toBe("hardware");
    expect(readStoredPersona(null)).toBe("hardware");
    expect(readStoredPersona(throwingStorage())).toBe("hardware");
  });
});

describe("writeStoredPersona", () => {
  it("writes and survives a throwing storage", () => {
    const s = memoryStorage();
    writeStoredPersona(s, "business");
    expect(s.getItem(STORAGE_KEY)).toBe("business");
    expect(() => writeStoredPersona(throwingStorage(), "business")).not.toThrow();
    expect(() => writeStoredPersona(null, "business")).not.toThrow();
  });
});
