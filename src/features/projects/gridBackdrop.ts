// Pure logic for the map-grid backdrop: a breathing grid plus short-lived
// coordinate blips. The label on a blip is its own cell index, real data
// about the screen, not a made-up position.

export type Blip = { col: number; row: number; born: number; life: number };

export const CELL = 48;
export const BREATH_MS = 7000;
export const LIFE_MS = 2600;
export const FADE_IN_MS = 320;
export const FADE_OUT_MS = 720;
export const SPAWN_MIN_MS = 650;
export const SPAWN_JITTER_MS = 900;
export const MAX_BLIPS = 6;

export const PINK = "255, 105, 180";

// Slow sine between 0 and 1, one full breath every BREATH_MS.
export function breath(t: number): number {
  return 0.5 + 0.5 * Math.sin((t / BREATH_MS) * Math.PI * 2);
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

function drawLines(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil(h / CELL);
  for (let c = 0; c <= cols; c++) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${c % 4 === 0 ? alpha * 1.8 : alpha})`;
    ctx.beginPath();
    ctx.moveTo(c * CELL + 0.5, 0);
    ctx.lineTo(c * CELL + 0.5, h);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${r % 4 === 0 ? alpha * 1.8 : alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, r * CELL + 0.5);
    ctx.lineTo(w, r * CELL + 0.5);
    ctx.stroke();
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

// One frame. `t` drives the breath, `now` drives the blips.
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
  drawLines(ctx, w, h, 0.035 + 0.03 * breath(t));
  ctx.font = `9px ${font}`;
  ctx.textBaseline = "alphabetic";
  for (const b of blips) drawBlip(ctx, b, blipAlpha(b, t));
}
