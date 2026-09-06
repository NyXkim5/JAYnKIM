export type Cell = { v: number; label?: string };

export type SpecimenFrame = {
  cols: number;
  rows: number;
  cells: Cell[]; // row-major, length cols * rows
};

export type Layout = { cell: number; gap: number; ox: number; oy: number };

export type DrawCall =
  | { kind: "rect"; x: number; y: number; w: number; h: number; gray: number }
  | { kind: "text"; x: number; y: number; text: string; size: number; gray: number };
