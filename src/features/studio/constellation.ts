import type { Ground } from "@/features/persona/personas";

// A spring-mass grid of points. The cursor pushes points away with a force
// that grows with cursor speed; a Hooke spring pulls each point back home.
// Some points carry a real evidence entry and reveal its value near the
// cursor. No point ever shows invented data. Pure functions only.

export type EvidenceMark = { id: string; value: string; unit?: string; href: string };

export type GridNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  pulse: number;
  evidence?: EvidenceMark;
};

export type Mouse = { x: number; y: number; speed: number; radius: number };

export type Palette = { bg: string; node: string; accent: string; lineAlpha: number };

export const SPACING = 55;
export const OFFSCREEN = -1000;
export const MOUSE_RADIUS = 220;
export const HIT_RADIUS = 16;
// Heavy damping plus a home-crossing clamp: nodes glide back with no bounce.
const SPRING_K = 18;
const DAMPING = 0.45;
const PUSH_BASE = 2400;
const MAX_CONN_DIST = 75;
const HIGHLIGHT_DIST = 90;

// Hot pink field, deep pink where the cursor lives. Jay's call, 2026-09-06.
export function paletteFor(ground: Ground): Palette {
  if (ground === "black") {
    return { bg: "#0a0a0a", node: "255, 105, 180", accent: "255, 20, 147", lineAlpha: 0.3 };
  }
  return { bg: "#ffffff", node: "219, 39, 119", accent: "190, 24, 93", lineAlpha: 0.1 };
}

export function initNodes(width: number, height: number, rng: () => number = Math.random, spacing = SPACING): GridNode[] {
  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;
  const nodes: GridNode[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * spacing;
      const y = j * spacing;
      nodes.push({ x, y, vx: 0, vy: 0, baseX: x, baseY: y, radius: rng() * 1.2 + 1.2, pulse: rng() * Math.PI * 2 });
    }
  }
  return nodes;
}

// Hands each mark to a distinct interior node, spread by the rng.
export function seedEvidence(nodes: GridNode[], marks: EvidenceMark[], rng: () => number = Math.random): void {
  for (const n of nodes) n.evidence = undefined;
  const maxX = Math.max(...nodes.map((n) => n.baseX));
  const maxY = Math.max(...nodes.map((n) => n.baseY));
  const interior = nodes.filter((n) => n.baseX > 0 && n.baseY > 0 && n.baseX < maxX && n.baseY < maxY);
  const pool = interior.length >= marks.length ? interior : nodes.slice();
  for (const mark of marks) {
    if (pool.length === 0) return;
    const pick = Math.floor(rng() * pool.length);
    pool[pick].evidence = mark;
    pool.splice(pick, 1);
  }
}

export function hitTest(nodes: GridNode[], x: number, y: number, radius = HIT_RADIUS): EvidenceMark | null {
  let best: EvidenceMark | null = null;
  let bestDist = radius;
  for (const n of nodes) {
    if (!n.evidence) continue;
    const d = Math.hypot(n.x - x, n.y - y);
    if (d < bestDist) {
      bestDist = d;
      best = n.evidence;
    }
  }
  return best;
}

function repel(n: GridNode, mouse: Mouse, dt: number): void {
  const dx = mouse.x - n.x;
  const dy = mouse.y - n.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= mouse.radius || dist === 0) return;
  const force = (1 - dist / mouse.radius) * (PUSH_BASE + mouse.speed * 150);
  const angle = Math.atan2(dy, dx);
  n.vx -= Math.cos(angle) * force * dt;
  n.vy -= Math.sin(angle) * force * dt;
}

// Settles one axis: if the step would carry the node past home, land on home.
function settle(pos: number, vel: number, base: number, dt: number): [number, number] {
  const next = pos + vel * dt * 60;
  const crossed = (pos - base) * (next - base) < 0;
  return crossed ? [base, 0] : [next, vel];
}

export function stepNodes(nodes: GridNode[], mouse: Mouse, dt: number): void {
  for (const n of nodes) {
    n.pulse += dt * 3;
    const pushed = Math.hypot(mouse.x - n.x, mouse.y - n.y) < mouse.radius;
    repel(n, mouse, dt);
    n.vx += (n.baseX - n.x) * SPRING_K * dt;
    n.vy += (n.baseY - n.y) * SPRING_K * dt;
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    if (pushed) {
      n.x += n.vx * dt * 60;
      n.y += n.vy * dt * 60;
      continue;
    }
    [n.x, n.vx] = settle(n.x, n.vx, n.baseX, dt);
    [n.y, n.vy] = settle(n.y, n.vy, n.baseY, dt);
  }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function drawConnections(ctx: CanvasRenderingContext2D, nodes: GridNode[], p: Palette, glow: number): void {
  const maxSq = MAX_CONN_DIST * MAX_CONN_DIST;
  ctx.lineWidth = 0.7;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distSq = dx * dx + dy * dy;
      if (distSq >= maxSq) continue;
      const alpha = clamp01((1 - Math.sqrt(distSq) / MAX_CONN_DIST) * p.lineAlpha * glow);
      ctx.strokeStyle = `rgba(${p.node}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

function drawRing(ctx: CanvasRenderingContext2D, n: GridNode, p: Palette): void {
  const ring = ((n.pulse * 20) % 30) + 4;
  ctx.strokeStyle = `rgba(${p.accent}, ${(1 - ring / 34) * 0.4})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(n.x, n.y, ring, 0, Math.PI * 2);
  ctx.stroke();
}

function drawReadout(ctx: CanvasRenderingContext2D, n: GridNode, mark: EvidenceMark, p: Palette): void {
  ctx.font = "11px ui-monospace, SFMono-Regular, Consolas, monospace";
  ctx.fillStyle = `rgba(${p.accent}, 0.95)`;
  const text = mark.unit ? `${mark.value} ${mark.unit}` : mark.value;
  ctx.fillText(text.toUpperCase(), n.x + 12, n.y - 10);
}

function drawMarker(ctx: CanvasRenderingContext2D, n: GridNode, p: Palette, glow: number): void {
  ctx.strokeStyle = `rgba(${p.accent}, ${clamp01(0.45 * glow)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(n.x, n.y, n.radius + 5, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawNodes(ctx: CanvasRenderingContext2D, nodes: GridNode[], mouse: Mouse, p: Palette, glow: number): void {
  for (const n of nodes) {
    const dist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
    const near = dist < mouse.radius;
    const alpha = clamp01((near ? 0.95 : 0.5 + Math.sin(n.pulse) * 0.12) * glow);
    const radius = near ? n.radius * 2.2 : n.radius + Math.sin(n.pulse) * 0.3;
    ctx.fillStyle = near ? `rgba(${p.accent}, ${alpha})` : `rgba(${p.node}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, Math.max(0.5, radius), 0, Math.PI * 2);
    ctx.fill();
    if (n.evidence) drawMarker(ctx, n, p, glow);
    if (dist < HIGHLIGHT_DIST) drawRing(ctx, n, p);
    if (n.evidence && dist < HIGHLIGHT_DIST) drawReadout(ctx, n, n.evidence, p);
  }
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  nodes: GridNode[],
  mouse: Mouse,
  p: Palette,
  width: number,
  height: number,
  glow = 1,
): void {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, width, height);
  drawConnections(ctx, nodes, p, glow);
  drawNodes(ctx, nodes, mouse, p, glow);
}
