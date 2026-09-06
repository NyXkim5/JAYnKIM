"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { glitchTail, GLITCH_TAIL, GLITCH_TICKS, GLITCH_TICK_MS } from "./glitch";

type Props = { text: string; active: boolean };

// Renders a tab label whose last three letters glitch briefly when `active`
// flips on. At rest it renders the plain text, so its textContent is exact.
export function GlitchLabel({ text, active }: Props) {
  const [tick, setTick] = useState(-1);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (!active || reduced) return;
    const id = setTimeout(() => setTick(0), 0);
    return () => clearTimeout(id);
  }, [active, reduced]);

  useEffect(() => {
    if (tick < 0) return;
    const next = tick + 1 >= GLITCH_TICKS ? -1 : tick + 1;
    const id = setTimeout(() => setTick(next), GLITCH_TICK_MS);
    return () => clearTimeout(id);
  }, [tick]);

  const shown = tick >= 0 ? glitchTail(text, tick) : text;
  const head = shown.slice(0, -GLITCH_TAIL);
  const tail = shown.slice(-GLITCH_TAIL);
  return (
    <>
      {head}
      <span className={tick >= 0 ? "inline-block animate-[tab-glitch_0.11s_steps(2)_infinite]" : ""}>{tail}</span>
    </>
  );
}
