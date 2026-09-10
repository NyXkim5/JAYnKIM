// Test doubles for the browser features the motion code depends on and jsdom
// lacks: the reduced-motion media query, a 2d canvas, ResizeObserver, media
// playback, and a frame queue the test drains by hand.
import { vi } from "vitest";

const noop = () => undefined;

export function stubReducedMotion(reduce: boolean): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: noop,
      removeListener: noop,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: () => false,
    }),
  });
}

// A 2d context whose every method is a no-op and every property is writable.
export function stubCanvas(): void {
  const ctx = new Proxy({} as Record<string, unknown>, {
    get: (target, key) => (key in target ? target[key as string] : noop),
    set: (target, key, value) => {
      target[key as string] = value;
      return true;
    },
  });
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    writable: true,
    value: () => ctx,
  });
}

export function stubResizeObserver(): void {
  Object.defineProperty(window, "ResizeObserver", {
    configurable: true,
    writable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
}

export function stubMediaPlayback(): void {
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    writable: true,
    value: () => Promise.resolve(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, writable: true, value: noop });
}

export type FrameQueue = { drain: (frames: number, stepMs: number) => void; requested: () => number };

// Replaces requestAnimationFrame with a queue so a test can advance the clock
// frame by frame without the loop recursing forever.
export function stubFrames(): FrameQueue {
  let queue: FrameCallback[] = [];
  let now = 0;
  let count = 0;
  type FrameCallback = (t: number) => void;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameCallback) => {
    queue.push(cb);
    count += 1;
    return count;
  });
  vi.stubGlobal("cancelAnimationFrame", noop);
  return {
    drain: (frames, stepMs) => {
      for (let i = 0; i < frames; i++) {
        const pending = queue;
        queue = [];
        now += stepMs;
        pending.forEach((cb) => cb(now));
      }
    },
    requested: () => count,
  };
}

// jsdom advertises touch support on window, which the cursor reads as a phone.
export function stubMouseOnly(): void {
  delete (window as Window & { ontouchstart?: unknown }).ontouchstart;
}
