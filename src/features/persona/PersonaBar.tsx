// src/features/persona/PersonaBar.tsx
"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { getPersona, type PersonaKey } from "./personas";
import { PersonaSwitch, type TabSize } from "./PersonaSwitch";

export const TAB_SIZE_KEY = "jaykim.tabs.large";

// localStorage can be blocked by the browser. The toggle still works for the
// page in hand, it just will not be remembered.
function readLarge(): boolean {
  try {
    return window.localStorage.getItem(TAB_SIZE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeLarge(large: boolean): void {
  try {
    window.localStorage.setItem(TAB_SIZE_KEY, large ? "1" : "0");
  } catch {
    return;
  }
}

function useTabSize(): [TabSize, () => void] {
  const [large, setLarge] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setLarge(readLarge()));
  }, []);
  const toggle = () => {
    const next = !large;
    setLarge(next);
    writeLarge(next);
  };
  return [large ? "lg" : "sm", toggle];
}

// The A+ / A- control next to the tabs. It enlarges the persona tabs for
// readers who find the small mono labels hard to see, and remembers the choice.
function SizeToggle({ size, onToggle, fg }: { size: TabSize; onToggle: () => void; fg: string }) {
  const large = size === "lg";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={large}
      aria-label={large ? "Shrink the tabs" : "Enlarge the tabs"}
      title={large ? "Shrink the tabs" : "Enlarge the tabs"}
      className={`font-mono text-[12px] tracking-[0.1em] opacity-60 transition-opacity hover:opacity-100 ${fg}`}
    >
      {large ? "A−" : "A+"}
    </button>
  );
}

export function PersonaBar({ persona }: { persona: PersonaKey }) {
  const { navigateTo } = usePageTransition();
  const p = getPersona(persona);
  const fg = p.ground === "black" ? "text-white" : "text-black";
  const bg = p.ground === "black" ? "bg-[#0a0a0a]/85 border-white/10" : "bg-white/85 border-black/10";
  const [size, toggleSize] = useTabSize();

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
      <div className="flex items-center gap-4 md:gap-6">
        <PersonaSwitch value={persona} onChange={() => {}} ground={p.ground} asLinks size={size} />
        <SizeToggle size={size} onToggle={toggleSize} fg={fg} />
      </div>
    </header>
  );
}
