// src/features/landing/Landing.tsx
"use client";

import { useEffect, useMemo } from "react";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { getPersona, PERSONAS, type PersonaKey } from "@/features/persona/personas";
import { usePersona } from "@/features/persona/usePersona";
import { useScrambleText } from "@/features/persona/useScrambleText";
import { PersonaSwitch } from "@/features/persona/PersonaSwitch";
import { Readout } from "@/features/evidence/Readout";
import { Specimen } from "@/features/specimen/Specimen";
import { frameFor, snapshotFor } from "@/features/specimen/adapters";
import { Clock } from "./Clock";

function isTypingTarget(e: KeyboardEvent): boolean {
  const tag = (e.target as HTMLElement | null)?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

function useLandingKeys(setPersona: (k: PersonaKey) => void, enter: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      const byIndex = PERSONAS.find((p) => String(p.index) === e.key);
      if (byIndex) return setPersona(byIndex.key);
      if (e.key === "Enter") enter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setPersona, enter]);
}

export function Landing() {
  const { persona, setPersona } = usePersona();
  const { navigateTo } = usePageTransition();
  const p = getPersona(persona);
  const frame = useMemo(() => frameFor(persona), [persona]);
  const snapshot = snapshotFor(persona);
  const claim = useScrambleText(p.claim, { speed: 30, staggerPerChar: 12 });
  const enter = () => navigateTo(`/${persona}`);
  useLandingKeys(setPersona, enter);

  const black = p.ground === "black";
  const fg = black ? "text-white" : "text-black";
  const dim = black ? "text-white/50" : "text-black/50";

  return (
    <main
      className="fixed inset-0 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: black ? "#0a0a0a" : "#ffffff" }}
      data-ground={p.ground}
    >
      <p className="sr-only">
        The figure is a dot matrix rendered from real data. {snapshot ? `${snapshot.source.repo} ${snapshot.source.path}, ${snapshot.source.how}.` : "This persona is in progress."}
      </p>

      <header className="absolute left-5 right-5 top-5 flex items-start justify-between md:left-8 md:right-8 md:top-6">
        <span className={`font-mono text-[13px] font-bold tracking-[0.2em] uppercase ${fg}`}>Jay Kim</span>
        <div className="flex flex-col items-end gap-2">
          <PersonaSwitch value={persona} onChange={setPersona} ground={p.ground} />
          <Clock ground={p.ground} />
        </div>
      </header>

      <div className="absolute inset-x-0 top-[14vh] bottom-[22vh] flex flex-col items-center justify-center gap-8 px-5">
        <Specimen frame={frame} ground={p.ground} className="h-full w-full max-w-[min(80vh,900px)]" />
        <p className={`max-w-xl text-center font-mono text-[13px] leading-relaxed tracking-wide ${fg}`} aria-live="polite">
          {claim}
        </p>
        <button
          type="button"
          onClick={enter}
          className={`font-mono text-[11px] tracking-[0.18em] uppercase px-1.5 py-0.5 ${black ? "bg-white text-black" : "bg-black text-white"}`}
        >
          [ENTER]
        </button>
      </div>

      <footer className="absolute left-5 right-5 bottom-5 md:left-8 md:right-8 md:bottom-6">
        <Readout persona={persona} ground={p.ground} />
        <div className={`mt-2 flex justify-between font-mono text-[11px] tracking-[0.14em] uppercase ${dim}`}>
          <span>Orange County, CA</span>
          <span>{new Date().getUTCFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
