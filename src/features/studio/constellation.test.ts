import { describe, it, expect } from "vitest";
import { initNodes, stepNodes, paletteFor, OFFSCREEN, MOUSE_RADIUS, type Mouse } from "./constellation";

const still = (): Mouse => ({ x: OFFSCREEN, y: OFFSCREEN, speed: 0, radius: MOUSE_RADIUS });
const half = () => 0.5;

describe("initNodes", () => {
  it("lays a grid one cell wider and taller than the box", () => {
    const nodes = initNodes(110, 55, half, 55);
    expect(nodes).toHaveLength(3 * 2);
    expect(nodes[0]).toMatchObject({ x: 0, y: 0, baseX: 0, baseY: 0, vx: 0, vy: 0 });
  });

  it("gives every node a hex label and a radius in range", () => {
    for (const n of initNodes(200, 200, half)) {
      expect(n.label).toMatch(/^[0-9A-F]+:[0-9A-F]+$/);
      expect(n.radius).toBeGreaterThanOrEqual(1.2);
      expect(n.radius).toBeLessThanOrEqual(2.4);
    }
  });
});

describe("stepNodes", () => {
  it("pulls a displaced node back toward home with the cursor away", () => {
    const [n] = initNodes(1, 1, half);
    n.x = 30;
    n.y = -20;
    const before = Math.hypot(n.x - n.baseX, n.y - n.baseY);
    for (let i = 0; i < 30; i++) stepNodes([n], still(), 1 / 60);
    const after = Math.hypot(n.x - n.baseX, n.y - n.baseY);
    expect(after).toBeLessThan(before);
  });

  it("pushes a node away from a nearby cursor", () => {
    const [n] = initNodes(1, 1, half);
    const mouse: Mouse = { x: 40, y: 0, speed: 0, radius: MOUSE_RADIUS };
    stepNodes([n], mouse, 1 / 60);
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
