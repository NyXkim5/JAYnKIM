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
  const transitionRef = useRef<ViewTransition | null>(null);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  useEffect(() => {
    transitionRef.current = transition;
  }, [transition]);

  const requestView = useCallback(
    (v: LandingView) => {
      if (v === viewRef.current || transitionRef.current) return;
      if (reduced) return setView(v);
      const next = { to: v, phase: "cover" as const, seed: Date.now() };
      transitionRef.current = next;
      setTransition(next);
    },
    [reduced, setView],
  );

  const onCoverDone = useCallback(() => {
    const t = transitionRef.current;
    if (!t || t.phase !== "cover") return;
    setView(t.to);
    setTransition({ ...t, phase: "reveal" });
  }, [setView]);

  const onRevealDone = useCallback(() => {
    transitionRef.current = null;
    setTransition(null);
  }, []);

  return { transition, requestView, onCoverDone, onRevealDone };
}
