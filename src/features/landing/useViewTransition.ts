"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LandingView } from "@/features/persona/personas";
import type { RevealPhase } from "./GridReveal";

export type ViewTransition = { to: LandingView; phase: RevealPhase; seed: number };

type Controls = {
  transition: ViewTransition | null;
  requestView: (v: LandingView) => void;
  onCoverDone: () => void;
  onRevealDone: () => void;
};

// Runs the cover, swap, reveal sequence around a landing view change.
// Reduced motion skips straight to the swap.
export function useViewTransition(
  view: LandingView,
  setView: (v: LandingView) => void,
  reduced: boolean,
): Controls {
  const [transition, setTransition] = useState<ViewTransition | null>(null);
  const viewRef = useRef(view);
  const busyRef = useRef(false);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const requestView = useCallback(
    (v: LandingView) => {
      if (v === viewRef.current || busyRef.current) return;
      if (reduced) return setView(v);
      busyRef.current = true;
      setTransition({ to: v, phase: "cover", seed: Date.now() });
    },
    [reduced, setView],
  );

  const onCoverDone = useCallback(() => {
    setTransition((t) => {
      if (!t) return t;
      setView(t.to);
      return { ...t, phase: "reveal" };
    });
  }, [setView]);

  const onRevealDone = useCallback(() => {
    busyRef.current = false;
    setTransition(null);
  }, []);

  return { transition, requestView, onCoverDone, onRevealDone };
}
