import type { Cell, DrawCall, Layout, SpecimenFrame } from "./types";
import type { Ground } from "@/features/persona/personas";

const FLOOR = 0.02;
const BREATHE_FRACTION = 0.01;
const BREATHE_AMOUNT = 0.04;

export function layout(frame: SpecimenFrame, width: number, height: number): Layout {
  const cell = Math.max(1, Math.floor(Math.min(width / frame.cols, height / frame.rows)));
  const gap = Math.max(1, Math.round(cell * 0.12));
  const ox = Math.floor((width - cell * frame.cols) / 2);
  const oy = Math.floor((height - cell * frame.rows) / 2);
  return { cell, gap, ox, oy };
}

function grayFor(v: number, ground: Ground): number {
  const t = Math.min(1, Math.max(0, v));
  return ground === "black" ? 0.12 + t * 0.8 : 0.88 - t * 0.8;
}

function inverse(ground: Ground): number {
  return ground === "black" ? 1 : 0;
}

function cellCalls(c: Cell, x: number, y: number, size: number, ground: Ground): DrawCall[] {
  if (c.label !== undefined) {
    return [
      { kind: "rect", x, y, w: size, h: size, gray: inverse(ground) },
      { kind: "text", x: x + size / 2, y: y + size / 2, text: c.label, size: size * 0.6, gray: 1 - inverse(ground) },
    ];
  }
  if (c.v <= FLOOR) return [];
  return [{ kind: "rect", x, y, w: size, h: size, gray: grayFor(c.v, ground) }];
}

export function render(frame: SpecimenFrame, width: number, height: number, ground: Ground): DrawCall[] {
  const l = layout(frame, width, height);
  const size = l.cell - l.gap;
  const calls: DrawCall[] = [];
  for (let r = 0; r < frame.rows; r++) {
    for (let c = 0; c < frame.cols; c++) {
      const cell = frame.cells[r * frame.cols + c];
      const x = l.ox + c * l.cell + l.gap / 2;
      const y = l.oy + r * l.cell + l.gap / 2;
      calls.push(...cellCalls(cell, x, y, size, ground));
    }
  }
  return calls;
}

function grayCss(g: number): string {
  const n = Math.round(g * 255);
  return `rgb(${n},${n},${n})`;
}

export function paint(ctx: CanvasRenderingContext2D, calls: DrawCall[], ground: Ground, fontFamily: string): void {
  ctx.fillStyle = ground === "black" ? "#0a0a0a" : "#ffffff";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (const call of calls) {
    ctx.fillStyle = grayCss(call.gray);
    if (call.kind === "rect") {
      ctx.fillRect(call.x, call.y, call.w, call.h);
      continue;
    }
    ctx.save();
    ctx.translate(call.x, call.y);
    ctx.rotate(-Math.PI / 2);
    ctx.font = `${call.size}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(call.text, 0, 0);
    ctx.restore();
  }
}

export function emptyFrame(cols: number, rows: number): SpecimenFrame {
  return { cols, rows, cells: Array.from({ length: cols * rows }, () => ({ v: 0 })) };
}

export function interpolate(a: SpecimenFrame, b: SpecimenFrame, t: number): SpecimenFrame {
  if (a.cols !== b.cols || a.rows !== b.rows) {
    throw new Error("interpolate needs frames of equal dimensions");
  }
  const n = a.cells.length;
  const resolved = Math.round(Math.min(1, Math.max(0, t)) * n);
  const cells = a.cells.map((cell, i) => (i < resolved ? b.cells[i] : cell));
  return { cols: a.cols, rows: a.rows, cells };
}

function lcg(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function breathe(frame: SpecimenFrame, seed: number, tick: number): SpecimenFrame {
  const rnd = lcg(seed * 7919 + tick * 104729);
  const n = frame.cells.length;
  const count = Math.max(1, Math.floor(n * BREATHE_FRACTION));
  const cells = frame.cells.slice();
  for (let k = 0; k < count; k++) {
    const i = Math.floor(rnd() * n);
    const cell = cells[i];
    if (cell.label !== undefined) continue;
    const delta = (rnd() * 2 - 1) * BREATHE_AMOUNT;
    cells[i] = { v: Math.min(1, Math.max(0, cell.v + delta)) };
  }
  return { cols: frame.cols, rows: frame.rows, cells };
}
