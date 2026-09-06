// src/features/evidence/Readout.tsx
"use client";

import { useEffect, useState } from "react";
import type { Ground, PersonaKey } from "@/features/persona/personas";
import { evidenceFor, sourceHref } from "./registry";

type Props = { persona: PersonaKey; ground: Ground; intervalMs?: number };

export function Readout({ persona, ground, intervalMs = 6000 }: Props) {
  const entries = evidenceFor(persona);
  const [i, setI] = useState(0);

  useEffect(() => {
    queueMicrotask(() => setI(0));
    if (intervalMs <= 0 || entries.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % entries.length), intervalMs);
    return () => clearInterval(id);
  }, [persona, intervalMs, entries.length]);

  const e = entries[i];
  if (!e) return null;
  const fg = ground === "black" ? "text-white" : "text-black";
  const dim = ground === "black" ? "text-white/50" : "text-black/50";
  const linkCls =
    ground === "black"
      ? "text-white/50 hover:text-white underline-offset-4 hover:underline"
      : "text-black/50 hover:text-black underline-offset-4 hover:underline";

  return (
    <div className="pointer-events-auto flex w-full items-end justify-between gap-6 font-mono text-[11px] tracking-[0.14em] uppercase">
      <div className={fg}>
        <span className="text-[13px]">{e.value}</span>
        {e.unit && <span className={`ml-2 ${dim}`}>{e.unit}</span>}
      </div>
      <a href={sourceHref(e)} className={linkCls} aria-label={`Source: ${e.repo} ${e.path}`}>
        {e.path}
      </a>
    </div>
  );
}
