"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { cn } from "@/lib/utils";
import { GlitchLabel } from "./GlitchLabel";
import { PERSONAS, type Ground, type PersonaKey } from "./personas";

export type TabSize = "sm" | "lg";

type Props = {
  value: PersonaKey | null;
  onChange: (key: PersonaKey) => void;
  ground: Ground;
  asLinks?: boolean;
  size?: TabSize;
};

// The current page is marked by pink brackets and full-strength text, no box.
const BRACKET = "text-[#ff69b4]";

// "lg" is the reader-chosen size from the bar's toggle, for people who find
// the 11px mono labels too small to read.
const SCALE: Record<TabSize, string> = {
  sm: "text-[11px] tracking-[0.18em] px-1.5 py-0.5",
  lg: "text-[15px] tracking-[0.16em] px-2 py-1",
};

function tabClass(active: boolean, ground: Ground, size: TabSize): string {
  const base = cn("font-mono uppercase transition-colors", SCALE[size]);
  if (ground === "black") {
    return cn(base, active ? "text-white" : "text-white/60 hover:text-white");
  }
  return cn(base, active ? "text-black" : "text-black/60 hover:text-black");
}

export function PersonaSwitch({ value, onChange, ground, asLinks = false, size = "sm" }: Props) {
  const [hover, setHover] = useState<PersonaKey | null>(null);
  return (
    <div role="tablist" aria-label="Persona" className={cn("flex items-center", size === "lg" ? "gap-4" : "gap-2")}>
      {PERSONAS.map((p) => {
        const active = p.key === value;
        const hoverProps = { onMouseEnter: () => setHover(p.key), onMouseLeave: () => setHover(null) };
        // Brackets mark the current page only.
        const label = active ? (
          <>
            <span className={BRACKET}>[</span>
            <GlitchLabel text={p.short} active={hover === p.key} />
            <span className={BRACKET}>]</span>
          </>
        ) : (
          <GlitchLabel text={p.short} active={hover === p.key} />
        );
        if (asLinks) {
          return (
            <TransitionLink key={p.key} href={`/${p.key}`} role="tab" aria-selected={active} className={tabClass(active, ground, size)} {...hoverProps}>
              {label}
            </TransitionLink>
          );
        }
        return (
          <button key={p.key} type="button" role="tab" aria-selected={active} onClick={() => onChange(p.key)} className={tabClass(active, ground, size)} {...hoverProps}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
