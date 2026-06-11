export interface NotePosition {
  x: number;
  y: number;
  rotate: number;
}

/**
 * Deterministic scatter layout for the matcha board. The same count and seed
 * always produce the same positions, so the board is stable across renders and
 * safe to compute without state.
 */
export function generatePositions(count: number, seed: number): NotePosition[] {
  const positions: NotePosition[] = [];
  const cols = 5;
  const cellWidth = 100 / cols;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    // Add randomness within grid cell
    const randomX = ((seed * (i + 1) * 13) % 40) - 20;
    const randomY = ((seed * (i + 1) * 17) % 30) - 15;
    const randomRotate = ((seed * (i + 1) * 7) % 16) - 8;

    positions.push({
      x: col * cellWidth + cellWidth / 2 + randomX / 5,
      y: row * 220 + 20 + randomY,
      rotate: randomRotate,
    });
  }
  return positions;
}
