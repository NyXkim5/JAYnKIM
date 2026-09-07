"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { cn } from "@/lib/utils";
import { GlitchLabel } from "./GlitchLabel";
import { PERSONAS, type Ground, type PersonaKey } from "./personas";

type Props = {
  value: PersonaKey | null;
  onChange: (key: PersonaKey) => void;
  ground: Ground;
  asLinks?: boolean;
};

// The current page is marked by pink brackets and full-strength text, no box.
const BRACKET = "text-[#ff69b4]";

// One size everywhere the switch appears, the landing included: 14px from md
// up, 11px on phones so the four tabs still fit beside the wordmark.
const TAB = "font-mono text-[11px] md:text-[14px] tracking-[0.18em] uppercase px-1.5 py-0.5 md:px-2 transition-colors";

function tabClass(active: boolean, ground: Ground): string {
  if (ground === "black") {
    return cn(TAB, active ? "text-white" : "text-white/60 hover:text-white");
  }
  return cn(TAB, active ? "text-black" : "text-black/60 hover:text-black");
}

export function PersonaSwitch({ value, onChange, ground, asLinks = false }: Props) {
  const [hover, setHover] = useState<PersonaKey | null>(null);
  return (
    <div role="tablist" aria-label="Persona" className="flex items-center gap-2 md:gap-3">
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
            <TransitionLink key={p.key} href={`/${p.key}`} role="tab" aria-selected={active} className={tabClass(active, ground)} {...hoverProps}>
              {label}
            </TransitionLink>
          );
        }
        return (
          <button key={p.key} type="button" role="tab" aria-selected={active} onClick={() => onChange(p.key)} className={tabClass(active, ground)} {...hoverProps}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
