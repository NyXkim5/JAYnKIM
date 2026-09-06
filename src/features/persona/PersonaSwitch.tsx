// src/features/persona/PersonaSwitch.tsx
"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";
import { cn } from "@/lib/utils";
import { PERSONAS, type Ground, type PersonaKey } from "./personas";

type Props = {
  value: PersonaKey | null;
  onChange: (key: PersonaKey) => void;
  ground: Ground;
  asLinks?: boolean;
};

function tabClass(active: boolean, ground: Ground): string {
  const base = "font-mono text-[11px] tracking-[0.18em] uppercase px-1.5 py-0.5 transition-colors";
  if (ground === "black") {
    return cn(base, active ? "bg-white text-black" : "text-white/60 hover:text-white");
  }
  return cn(base, active ? "bg-black text-white" : "text-black/60 hover:text-black");
}

export function PersonaSwitch({ value, onChange, ground, asLinks = false }: Props) {
  return (
    <div role="tablist" aria-label="Persona" className="flex items-center gap-2">
      {PERSONAS.map((p) => {
        const active = p.key === value;
        const label = `[${p.short}]`;
        if (asLinks) {
          return (
            <TransitionLink
              key={p.key}
              href={`/${p.key}`}
              role="tab"
              aria-selected={active}
              className={tabClass(active, ground)}
            >
              {label}
            </TransitionLink>
          );
        }
        return (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(p.key)}
            className={tabClass(active, ground)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
