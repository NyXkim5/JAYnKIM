// src/features/persona/PersonaBar.tsx
"use client";

import { useEffect } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { Clock } from "@/features/landing/Clock";
import { getPersona, type PersonaKey } from "./personas";
import { PersonaSwitch } from "./PersonaSwitch";

export function PersonaBar({ persona }: { persona: PersonaKey }) {
  const { navigateTo } = usePageTransition();
  const p = getPersona(persona);
  const fg = p.ground === "black" ? "text-white" : "text-black";
  const bg = p.ground === "black" ? "bg-[#0a0a0a]/85 border-white/10" : "bg-white/85 border-black/10";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigateTo("/");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigateTo]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b px-5 backdrop-blur-sm md:px-8 ${bg}`}>
      <TransitionLink href="/" className={`font-mono text-[13px] font-bold tracking-[0.2em] uppercase ${fg}`}>
        Jay Kim
      </TransitionLink>
      <div className="flex items-center gap-6">
        <PersonaSwitch value={persona} onChange={() => {}} ground={p.ground} asLinks />
        <Clock ground={p.ground} />
      </div>
    </header>
  );
}
