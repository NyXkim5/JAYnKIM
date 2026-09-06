"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_VIEW, isLandingView, type LandingView } from "./personas";

export const STORAGE_KEY = "jaykim.persona";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export function parseView(raw: string | null | undefined): LandingView | null {
  if (!raw) return null;
  return isLandingView(raw) ? raw : null;
}

export function readStoredView(storage: StorageLike | null): LandingView {
  if (!storage) return DEFAULT_VIEW;
  try {
    return parseView(storage.getItem(STORAGE_KEY)) ?? DEFAULT_VIEW;
  } catch {
    return DEFAULT_VIEW;
  }
}

export function writeStoredView(storage: StorageLike | null, view: LandingView): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, view);
  } catch {
    // Storage can be blocked in private windows. The choice still applies for this visit.
  }
}

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function useLandingView(): { view: LandingView; setView: (v: LandingView) => void } {
  const [view, setState] = useState<LandingView>(DEFAULT_VIEW);

  useEffect(() => {
    queueMicrotask(() => setState(readStoredView(browserStorage())));
  }, []);

  const setView = useCallback((v: LandingView) => {
    setState(v);
    writeStoredView(browserStorage(), v);
  }, []);

  return { view, setView };
}
