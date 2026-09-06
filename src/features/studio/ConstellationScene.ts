import type { Ground } from "@/features/persona/personas";
import {
  drawFrame,
  hitTest,
  initNodes,
  paletteFor,
  seedEvidence,
  stepNodes,
  MOUSE_RADIUS,
  OFFSCREEN,
  type EvidenceMark,
  type GridNode,
  type Mouse,
  type Palette,
} from "./constellation";

type TrackedMouse = Mouse & { prevX: number; prevY: number };

function fitCanvas(canvas: HTMLCanvasElement, w: number, h: number): CanvasRenderingContext2D | null {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// Owns one canvas: sizing, the cursor in canvas space, the glow, and the clock.
export class ConstellationScene {
  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private nodes: GridNode[] = [];
  private marks: EvidenceMark[] = [];
  private glow = 1;
  private readonly palette: Palette;
  private readonly mouse: TrackedMouse = {
    x: OFFSCREEN,
    y: OFFSCREEN,
    prevX: OFFSCREEN,
    prevY: OFFSCREEN,
    speed: 0,
    radius: MOUSE_RADIUS,
  };

  constructor(private readonly canvas: HTMLCanvasElement, ground: Ground) {
    this.palette = paletteFor(ground);
  }

  seed(marks: EvidenceMark[]): void {
    this.marks = marks;
    if (this.nodes.length) seedEvidence(this.nodes, this.marks);
  }

  setGlow(glow: number): void {
    this.glow = glow;
  }

  resize(w: number, h: number): void {
    this.width = Math.floor(w);
    this.height = Math.floor(h);
    if (this.width === 0 || this.height === 0) return;
    this.ctx = fitCanvas(this.canvas, this.width, this.height);
    this.nodes = initNodes(this.width, this.height);
    seedEvidence(this.nodes, this.marks);
    this.draw();
  }

  private toLocal(clientX: number, clientY: number): { x: number; y: number } | null {
    const r = this.canvas.getBoundingClientRect();
    const inside = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    return inside ? { x: clientX - r.left, y: clientY - r.top } : null;
  }

  // Cursor in canvas space; anything outside the canvas counts as away.
  pointer(clientX: number, clientY: number): void {
    const local = this.toLocal(clientX, clientY);
    this.mouse.x = local ? local.x : OFFSCREEN;
    this.mouse.y = local ? local.y : OFFSCREEN;
  }

  // The evidence mark under a click, if any.
  pick(clientX: number, clientY: number): EvidenceMark | null {
    const local = this.toLocal(clientX, clientY);
    return local ? hitTest(this.nodes, local.x, local.y) : null;
  }

  draw(): void {
    if (this.ctx) drawFrame(this.ctx, this.nodes, this.mouse, this.palette, this.width, this.height, this.glow);
  }

  private tick(dt: number): void {
    const m = this.mouse;
    m.speed = Math.hypot(m.x - m.prevX, m.y - m.prevY) / (dt * 1000 || 1);
    m.prevX = m.x;
    m.prevY = m.y;
    stepNodes(this.nodes, m, dt);
    this.draw();
  }

  // Starts the loop and returns the function that stops it.
  start(): () => void {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      this.tick(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }
}
