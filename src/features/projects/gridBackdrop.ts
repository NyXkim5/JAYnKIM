// Pure logic for the map-grid backdrop: a sparse grid that breathes in
// patches, plus short-lived coordinate blips. The label on a blip is its own
// cell index, real data about the screen, not a made-up position.

export type Blip = { col: number; row: number; born: number; life: number };

export const CELL = 96;
export const MAJOR_EVERY = 4;
export const LIFE_MS = 2600;
export const FADE_IN_MS = 320;
export const FADE_OUT_MS = 720;
export const SPAWN_MIN_MS = 650;
export const SPAWN_JITTER_MS = 900;
export const MAX_BLIPS = 5;

export const PINK = "255, 105, 180";
export const BASE_ALPHA = 0.028;
export const GLOW_ALPHA = 0.3;

// A pulse is a soft patch of light that drifts slowly and swells on its own
// period. Centres are fractions of the canvas so they scale with the screen.
export type Pulse = {
  cx: number;
  cy: number;
  driftX: number;
  driftY: number;
  driftMs: number;
  breathMs: number;
  phase: number;
  radius: number;
};

export const PULSES: readonly Pulse[] = [
  { cx: 0.28, cy: 0.35, driftX: 0.12, driftY: 0.08, driftMs: 41000, breathMs: 6800, phase: 0.0, radius: 0.22 },
  { cx: 0.72, cy: 0.6, driftX: 0.1, driftY: 0.12, driftMs: 53000, breathMs: 9100, phase: 2.1, radius: 0.26 },
  { cx: 0.5, cy: 0.85, driftX: 0.18, driftY: 0.05, driftMs: 67000, breathMs: 7700, phase: 4.2, radius: 0.2 },
];

export function pulseCentre(p: Pulse, t: number, w: number, h: number): { x: number; y: number } {
  const a = (t / p.driftMs) * Math.PI * 2;
  return { x: (p.cx + p.driftX * Math.sin(a)) * w, y: (p.cy + p.driftY * Math.cos(a * 0.7)) * h };
}

// 0..1 swell of one pulse, offset so the three never peak together.
export function pulseBreath(p: Pulse, t: number): number {
  return 0.5 + 0.5 * Math.sin((t / p.breathMs) * Math.PI * 2 + p.phase);
}

// Light at a point: the strongest pulse wins, so patches read as distinct.
export function glowAt(x: number, y: number, t: number, w: number, h: number): number {
  let best = 0;
  const scale = Math.max(w, h);
  for (const p of PULSES) {
    const c = pulseCentre(p, t, w, h);
    const d = Math.hypot(x - c.x, y - c.y) / (p.radius * scale);
    const g = Math.exp(-d * d * 1.6) * pulseBreath(p, t);
    if (g > best) best = g;
  }
  return Math.min(1, best);
}

// Opacity envelope: rise, hold, fall. Zero outside the blip's life.
export function blipAlpha(b: Blip, now: number): number {
  const age = now - b.born;
  if (age < 0 || age >= b.life) return 0;
  if (age < FADE_IN_MS) return age / FADE_IN_MS;
  const left = b.life - age;
  if (left < FADE_OUT_MS) return left / FADE_OUT_MS;
  return 1;
}

export function spawnBlip(cols: number, rows: number, now: number, rand: () => number): Blip {
  const col = 1 + Math.floor(rand() * Math.max(1, cols - 2));
  const row = 1 + Math.floor(rand() * Math.max(1, rows - 2));
  return { col, row, born: now, life: LIFE_MS };
}

export function nextSpawnAt(now: number, rand: () => number): number {
  return now + SPAWN_MIN_MS + rand() * SPAWN_JITTER_MS;
}

// Drops dead blips and adds one when it is time and there is room.
export function stepBlips(
  blips: Blip[],
  now: number,
  spawnAt: number,
  cols: number,
  rows: number,
  rand: () => number,
): { blips: Blip[]; spawnAt: number } {
  const alive = blips.filter((b) => now - b.born < b.life);
  if (now < spawnAt) return { blips: alive, spawnAt };
  if (alive.length >= MAX_BLIPS) return { blips: alive, spawnAt: nextSpawnAt(now, rand) };
  return { blips: [...alive, spawnBlip(cols, rows, now, rand)], spawnAt: nextSpawnAt(now, rand) };
}

export function cellLabel(b: Blip): string {
  return `${String(b.col).padStart(2, "0")}·${String(b.row).padStart(2, "0")}`;
}

// Alpha for one grid segment whose midpoint is (x, y).
export function segmentAlpha(x: number, y: number, t: number, w: number, h: number, major: boolean): number {
  const a = BASE_ALPHA + GLOW_ALPHA * glowAt(x, y, t, w, h);
  return major ? Math.min(1, a * 1.5) : a;
}

function strokeSegment(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, a: number) {
  ctx.strokeStyle = `rgba(255, 255, 255, ${a.toFixed(3)})`;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Lines are drawn one cell segment at a time so each can carry its own light.
function drawLines(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil(h / CELL);
  for (let c = 0; c <= cols; c++) {
    const x = c * CELL + 0.5;
    for (let r = 0; r < rows; r++) {
      const a = segmentAlpha(x, (r + 0.5) * CELL, t, w, h, c % MAJOR_EVERY === 0);
      strokeSegment(ctx, x, r * CELL, x, (r + 1) * CELL, a);
    }
  }
  for (let r = 0; r <= rows; r++) {
    const y = r * CELL + 0.5;
    for (let c = 0; c < cols; c++) {
      const a = segmentAlpha((c + 0.5) * CELL, y, t, w, h, r % MAJOR_EVERY === 0);
      strokeSegment(ctx, c * CELL, y, (c + 1) * CELL, y, a);
    }
  }
}

function drawBlip(ctx: CanvasRenderingContext2D, b: Blip, a: number) {
  const x = b.col * CELL + 0.5;
  const y = b.row * CELL + 0.5;
  const gap = 5;
  const arm = 9;
  ctx.strokeStyle = `rgba(${PINK}, ${0.75 * a})`;
  ctx.beginPath();
  ctx.moveTo(x - gap - arm, y);
  ctx.lineTo(x - gap, y);
  ctx.moveTo(x + gap, y);
  ctx.lineTo(x + gap + arm, y);
  ctx.moveTo(x, y - gap - arm);
  ctx.lineTo(x, y - gap);
  ctx.moveTo(x, y + gap);
  ctx.lineTo(x, y + gap + arm);
  ctx.stroke();
  ctx.fillStyle = `rgba(${PINK}, ${0.9 * a})`;
  ctx.fillRect(x - 1, y - 1, 2, 2);
  ctx.fillStyle = `rgba(${PINK}, ${0.6 * a})`;
  ctx.fillText(cellLabel(b), x + gap + arm + 4, y + 3);
}

// One frame. `t` drives the light and the blips together.
export function drawMapGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  blips: Blip[],
  font: string,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1;
  drawLines(ctx, w, h, t);
  ctx.font = `9px ${font}`;
  ctx.textBaseline = "alphabetic";
  for (const b of blips) drawBlip(ctx, b, blipAlpha(b, t));
}
