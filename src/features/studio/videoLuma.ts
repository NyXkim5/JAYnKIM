// Reads the film's average brightness so the grid can breathe with it.

export const SAMPLE_SIZE = 16;

// Rec. 601 luma over RGBA bytes, returned in 0..1.
export function meanLuma(rgba: Uint8ClampedArray): number {
  if (rgba.length < 4) return 0;
  let sum = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    sum += 0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2];
  }
  return sum / ((rgba.length / 4) * 255);
}

// Maps luma to a glow multiplier: dark frames dim the grid, bright frames lift it.
export function glowFor(luma: number): number {
  return 0.6 + Math.min(1, Math.max(0, luma)) * 0.9;
}

// Exponential smoothing so the glow never flickers frame to frame.
export function smooth(previous: number, next: number, factor = 0.15): number {
  return previous + (next - previous) * factor;
}

export function sampleVideoLuma(video: HTMLVideoElement, scratch: HTMLCanvasElement): number | null {
  if (video.readyState < 2 || video.videoWidth === 0) return null;
  const ctx = scratch.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  scratch.width = SAMPLE_SIZE;
  scratch.height = SAMPLE_SIZE;
  ctx.drawImage(video, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  return meanLuma(ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data);
}
