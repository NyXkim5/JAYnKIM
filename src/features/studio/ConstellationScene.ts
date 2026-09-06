import type { Ground } from "@/features/persona/personas";
import {
  drawFrame,
  initNodes,
  paletteFor,
  stepNodes,
  MOUSE_RADIUS,
  OFFSCREEN,
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

// Owns one canvas: sizing, the cursor in canvas space, and the frame clock.
export class ConstellationScene {
  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private nodes: GridNode[] = [];
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

  resize(w: number, h: number): void {
    this.width = Math.floor(w);
    this.height = Math.floor(h);
    if (this.width === 0 || this.height === 0) return;
    this.ctx = fitCanvas(this.canvas, this.width, this.height);
    this.nodes = initNodes(this.width, this.height);
    this.draw();
  }

  // Cursor in canvas space; anything outside the canvas counts as away.
  pointer(clientX: number, clientY: number): void {
    const r = this.canvas.getBoundingClientRect();
    const inside = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    this.mouse.x = inside ? clientX - r.left : OFFSCREEN;
    this.mouse.y = inside ? clientY - r.top : OFFSCREEN;
  }

  draw(): void {
    if (this.ctx) drawFrame(this.ctx, this.nodes, this.mouse, this.palette, this.width, this.height);
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
