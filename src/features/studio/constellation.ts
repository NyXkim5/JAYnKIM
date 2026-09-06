import type { Ground } from "@/features/persona/personas";

// A spring-mass grid of points. The cursor pushes points away with a force
// that grows with cursor speed; a Hooke spring pulls each point back home.
// Pure functions only. The scene wrapper owns the canvas and the clock.

export type GridNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  label: string;
  pulse: number;
};

export type Mouse = { x: number; y: number; speed: number; radius: number };

export type Palette = { bg: string; node: string; accent: string; lineAlpha: number };

export const SPACING = 55;
export const OFFSCREEN = -1000;
export const MOUSE_RADIUS = 220;
const SPRING_K = 18;
const DAMPING = 0.82;
const MAX_CONN_DIST = 75;
const HIGHLIGHT_DIST = 90;

export function paletteFor(ground: Ground): Palette {
  if (ground === "black") {
    return { bg: "#0a0a0a", node: "255, 255, 255", accent: "34, 197, 94", lineAlpha: 0.18 };
  }
  return { bg: "#ffffff", node: "17, 17, 17", accent: "22, 163, 74", lineAlpha: 0.08 };
}

function hexLabel(i: number, j: number): string {
  return `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`;
}

export function initNodes(width: number, height: number, rng: () => number = Math.random, spacing = SPACING): GridNode[] {
  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;
  const nodes: GridNode[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * spacing;
      const y = j * spacing;
      nodes.push({
        x,
        y,
        vx: 0,
        vy: 0,
        baseX: x,
        baseY: y,
        radius: rng() * 1.2 + 1.2,
        label: hexLabel(i, j),
        pulse: rng() * Math.PI * 2,
      });
    }
  }
  return nodes;
}

function repel(n: GridNode, mouse: Mouse, dt: number): void {
  const dx = mouse.x - n.x;
  const dy = mouse.y - n.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= mouse.radius || dist === 0) return;
  const force = (1 - dist / mouse.radius) * (1500 + mouse.speed * 150);
  const angle = Math.atan2(dy, dx);
  n.vx -= Math.cos(angle) * force * dt;
  n.vy -= Math.sin(angle) * force * dt;
}

export function stepNodes(nodes: GridNode[], mouse: Mouse, dt: number): void {
  for (const n of nodes) {
    n.pulse += dt * 3;
    repel(n, mouse, dt);
    n.vx += (n.baseX - n.x) * SPRING_K * dt;
    n.vy += (n.baseY - n.y) * SPRING_K * dt;
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    n.x += n.vx * dt * 60;
    n.y += n.vy * dt * 60;
  }
}

export function drawConnections(ctx: CanvasRenderingContext2D, nodes: GridNode[], p: Palette): void {
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
      const alpha = (1 - Math.sqrt(distSq) / MAX_CONN_DIST) * p.lineAlpha;
      ctx.strokeStyle = `rgba(${p.node}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

function drawHighlight(ctx: CanvasRenderingContext2D, n: GridNode, p: Palette): void {
  const ring = ((n.pulse * 20) % 30) + 4;
  ctx.strokeStyle = `rgba(${p.accent}, ${(1 - ring / 34) * 0.4})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(n.x, n.y, ring, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = "8px ui-monospace, SFMono-Regular, Consolas, monospace";
  ctx.fillStyle = `rgba(${p.accent}, 0.85)`;
  ctx.fillText(n.label, n.x + 10, n.y - 10);
}

export function drawNodes(ctx: CanvasRenderingContext2D, nodes: GridNode[], mouse: Mouse, p: Palette): void {
  for (const n of nodes) {
    const dist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
    const near = dist < mouse.radius;
    const alpha = near ? 0.95 : 0.25 + Math.sin(n.pulse) * 0.1;
    const radius = near ? n.radius * 2.2 : n.radius + Math.sin(n.pulse) * 0.3;
    ctx.fillStyle = near ? `rgba(${p.accent}, ${alpha})` : `rgba(${p.node}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, Math.max(0.5, radius), 0, Math.PI * 2);
    ctx.fill();
    if (dist < HIGHLIGHT_DIST) drawHighlight(ctx, n, p);
  }
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  nodes: GridNode[],
  mouse: Mouse,
  p: Palette,
  width: number,
  height: number,
): void {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, width, height);
  drawConnections(ctx, nodes, p);
  drawNodes(ctx, nodes, mouse, p);
}
