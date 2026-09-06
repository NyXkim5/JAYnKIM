import type { PersonaKey } from "@/features/persona/personas";
import type { Cell, SpecimenFrame } from "./types";

export type SnapshotSource = {
  repo: string;
  commit: string;
  path: string;
  how: string;
  observedAt: string;
  note?: string;
};

export type SpecimenSnapshot = {
  persona: PersonaKey;
  cols: number;
  rows: number;
  values: number[];
  labels: Record<string, string>;
  source: SnapshotSource;
};

function checkValues(s: SpecimenSnapshot): void {
  const expected = s.cols * s.rows;
  if (s.values.length !== expected) {
    throw new Error(`snapshot length ${s.values.length} does not match ${s.cols}x${s.rows}`);
  }
  for (const v of s.values) {
    if (!Number.isFinite(v) || v < 0 || v > 1) throw new Error(`snapshot value out of range: ${v}`);
  }
}

function checkLabels(s: SpecimenSnapshot): void {
  const max = s.cols * s.rows;
  for (const key of Object.keys(s.labels)) {
    const i = Number(key);
    if (!Number.isInteger(i) || i < 0 || i >= max) throw new Error(`snapshot label index invalid: ${key}`);
  }
}

export function snapshotToFrame(s: SpecimenSnapshot): SpecimenFrame {
  checkValues(s);
  checkLabels(s);
  const cells: Cell[] = s.values.map((v, i) => {
    const label = s.labels[String(i)];
    return label === undefined ? { v } : { v, label };
  });
  return { cols: s.cols, rows: s.rows, cells };
}

export function upsample(frame: SpecimenFrame, factor: number): SpecimenFrame {
  const cols = frame.cols * factor;
  const rows = frame.rows * factor;
  const cells: Cell[] = new Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const src = frame.cells[Math.floor(r / factor) * frame.cols + Math.floor(c / factor)];
      const topLeft = r % factor === 0 && c % factor === 0;
      cells[r * cols + c] = topLeft && src.label !== undefined ? { v: src.v, label: src.label } : { v: src.v };
    }
  }
  return { cols, rows, cells };
}

export function placeholderFrame(cols: number, rows: number): SpecimenFrame {
  const cells: Cell[] = [];
  for (let i = 0; i < cols * rows; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const lit = (r + c) % 3 === 0 && (r * 7 + c * 13) % 5 < 2;
    cells.push({ v: lit ? 0.12 : 0 });
  }
  return { cols, rows, cells };
}
