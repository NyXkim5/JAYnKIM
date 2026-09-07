import { describe, it, expect } from "vitest";
import {
  initNodes,
  stepNodes,
  seedEvidence,
  hitTest,
  paletteFor,
  OFFSCREEN,
  MOUSE_RADIUS,
  type EvidenceMark,
  type Mouse,
} from "./constellation";
import { meanLuma, glowFor, smooth } from "./videoLuma";

const still = (): Mouse => ({ x: OFFSCREEN, y: OFFSCREEN, speed: 0, radius: MOUSE_RADIUS });
const half = () => 0.5;

function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const marks: EvidenceMark[] = [
  { id: "a", value: "3,800", unit: "tests", href: "/projects#a" },
  { id: "b", value: "0", unit: "false anchors", href: "/work#b" },
  { id: "c", value: "533", href: "https://github.com/x/y" },
];

describe("initNodes", () => {
  it("lays a grid one cell wider and taller than the box", () => {
    const nodes = initNodes(110, 55, half, 55);
    expect(nodes).toHaveLength(3 * 2);
    expect(nodes[0]).toMatchObject({ x: 0, y: 0, baseX: 0, baseY: 0, vx: 0, vy: 0 });
    expect(nodes[0].evidence).toBeUndefined();
  });

  it("gives every node a radius in range", () => {
    for (const n of initNodes(200, 200, half)) {
      expect(n.radius).toBeGreaterThanOrEqual(1.2);
      expect(n.radius).toBeLessThanOrEqual(2.4);
    }
  });
});

describe("seedEvidence", () => {
  it("assigns every mark to a distinct interior node", () => {
    const nodes = initNodes(300, 300, half);
    seedEvidence(nodes, marks, lcg(7));
    const carriers = nodes.filter((n) => n.evidence);
    expect(carriers).toHaveLength(3);
    expect(new Set(carriers.map((n) => n.evidence?.id)).size).toBe(3);
    for (const n of carriers) {
      expect(n.baseX).toBeGreaterThan(0);
      expect(n.baseY).toBeGreaterThan(0);
    }
  });

  it("is deterministic for the same rng seed and clears old marks on reseed", () => {
    const a = initNodes(300, 300, half);
    const b = initNodes(300, 300, half);
    seedEvidence(a, marks, lcg(3));
    seedEvidence(b, marks, lcg(3));
    expect(a.map((n) => n.evidence?.id)).toEqual(b.map((n) => n.evidence?.id));
    seedEvidence(a, [], lcg(3));
    expect(a.every((n) => n.evidence === undefined)).toBe(true);
  });
});

describe("hitTest", () => {
  it("returns the nearest mark within the radius and null otherwise", () => {
    const nodes = initNodes(300, 300, half);
    seedEvidence(nodes, marks, lcg(11));
    const carrier = nodes.find((n) => n.evidence)!;
    expect(hitTest(nodes, carrier.x + 5, carrier.y - 5)).toBe(carrier.evidence);
    expect(hitTest(nodes, carrier.x + 40, carrier.y + 40, 16)).toBeNull();
  });
});

describe("stepNodes", () => {
  it("pulls a displaced node back toward home with the cursor away", () => {
    const [n] = initNodes(1, 1, half);
    n.x = 30;
    n.y = -20;
    const before = Math.hypot(n.x - n.baseX, n.y - n.baseY);
    for (let i = 0; i < 30; i++) stepNodes([n], still(), 1 / 60);
    expect(Math.hypot(n.x - n.baseX, n.y - n.baseY)).toBeLessThan(before);
  });

  it("never overshoots home on the way back, so nothing bounces", () => {
    const [n] = initNodes(1, 1, half);
    n.x = 30;
    n.y = -20;
    for (let i = 0; i < 120; i++) {
      stepNodes([n], still(), 1 / 60);
      expect(n.x).toBeGreaterThanOrEqual(0);
      expect(n.y).toBeLessThanOrEqual(0);
    }
    expect(n.x).toBe(0);
    expect(n.y).toBe(0);
  });

  it("pushes a node away from a nearby cursor", () => {
    const [n] = initNodes(1, 1, half);
    stepNodes([n], { x: 40, y: 0, speed: 0, radius: MOUSE_RADIUS }, 1 / 60);
    expect(n.x).toBeLessThan(0);
  });

  it("leaves a resting node at home with the cursor away", () => {
    const [n] = initNodes(1, 1, half);
    stepNodes([n], still(), 1 / 60);
    expect(n.x).toBe(0);
    expect(n.y).toBe(0);
  });

  it("advances pulse with time", () => {
    const [n] = initNodes(1, 1, half);
    const start = n.pulse;
    stepNodes([n], still(), 0.5);
    expect(n.pulse).toBeCloseTo(start + 1.5);
  });
});

describe("paletteFor", () => {
  it("uses the site ground colours with a hot pink field and deep pink accent", () => {
    expect(paletteFor("black").bg).toBe("#0a0a0a");
    expect(paletteFor("white").bg).toBe("#ffffff");
    expect(paletteFor("black").node).toBe("255, 105, 180");
    expect(paletteFor("black").accent).toBe("255, 20, 147");
  });
});

describe("videoLuma", () => {
  it("reads black as 0 and white as 1", () => {
    expect(meanLuma(new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255]))).toBe(0);
    expect(meanLuma(new Uint8ClampedArray([255, 255, 255, 255]))).toBeCloseTo(1, 5);
  });

  it("maps luma into a bounded glow and eases toward it", () => {
    expect(glowFor(0)).toBeCloseTo(0.6);
    expect(glowFor(1)).toBeCloseTo(1.5);
    expect(glowFor(5)).toBeCloseTo(1.5);
    expect(smooth(1, 2, 0.5)).toBe(1.5);
  });
});
