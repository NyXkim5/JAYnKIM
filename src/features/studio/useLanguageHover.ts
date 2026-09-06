"use client";

import { useCallback, useEffect, useState } from "react";
import { useScrambleText } from "@/features/persona/useScrambleText";

export const WARP_MS = 1500;

type LanguageHover = {
  text: string;
  warping: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

// Shows the English form at rest and warps into the Korean form while the
// cursor is over it. The switch is a slow character scramble; `warping` is
// true for its duration so the caller can add a letterform warp. Reduced
// motion swaps the text instantly with no scramble and no warp.
export function useLanguageHover(english: string, korean: string, reduced: boolean): LanguageHover {
  const [hover, setHover] = useState(false);
  const [warping, setWarping] = useState(false);
  const target = hover ? korean : english;
  const scrambled = useScrambleText(target, { speed: 80, staggerPerChar: 140 });

  useEffect(() => {
    if (reduced) return;
    queueMicrotask(() => setWarping(true));
    const id = setTimeout(() => setWarping(false), WARP_MS);
    return () => clearTimeout(id);
  }, [target, reduced]);

  const onEnter = useCallback(() => setHover(true), []);
  const onLeave = useCallback(() => setHover(false), []);
  return { text: reduced ? target : scrambled, warping: reduced ? false : warping, onEnter, onLeave };
}
