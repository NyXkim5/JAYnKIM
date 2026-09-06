"use client";

import { useCallback, useState } from "react";
import { useWarpText } from "./useWarpText";

type LanguageHover = {
  text: string;
  warping: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

// Shows the English form at rest and warps into the Korean form while the
// cursor is over it. Reduced motion swaps the text instantly with no warp.
export function useLanguageHover(english: string, korean: string, reduced: boolean): LanguageHover {
  const [hover, setHover] = useState(false);
  const { text, active } = useWarpText(hover ? korean : english, reduced);
  const onEnter = useCallback(() => setHover(true), []);
  const onLeave = useCallback(() => setHover(false), []);
  return { text, warping: active, onEnter, onLeave };
}
