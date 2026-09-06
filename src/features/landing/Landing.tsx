// src/features/landing/Landing.tsx
"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { getPersona, PERSONAS, type Ground, type PersonaKey } from "@/features/persona/personas";
import { usePersona } from "@/features/persona/usePersona";
import { useScrambleText } from "@/features/persona/useScrambleText";
import { PersonaSwitch } from "@/features/persona/PersonaSwitch";
import { Readout } from "@/features/evidence/Readout";
import { Specimen } from "@/features/specimen/Specimen";
import { frameFor, snapshotFor } from "@/features/specimen/adapters";
import type { SpecimenFrame } from "@/features/specimen/types";
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
      if (e.key === "Enter" && (e.target as HTMLElement | null)?.closest("a,button")) return;
      if (e.key === "Enter") enter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setPersona, enter]);
}

function LandingHeader({
  persona,
  setPersona,
  ground,
  fg,
}: {
  persona: PersonaKey;
  setPersona: (k: PersonaKey) => void;
  ground: Ground;
  fg: string;
}) {
  return (
    <header className="absolute left-5 right-5 top-5 flex items-start justify-between md:left-8 md:right-8 md:top-6">
      <span className={`font-mono text-[13px] font-bold tracking-[0.2em] uppercase ${fg}`}>Jay Kim</span>
      <div className="flex flex-col items-end gap-2">
        <PersonaSwitch value={persona} onChange={setPersona} ground={ground} />
        <Clock ground={ground} />
      </div>
    </header>
  );
}

function LandingStage({
  frame,
  ground,
  fg,
  black,
  claim,
  onEnter,
}: {
  frame: SpecimenFrame;
  ground: Ground;
  fg: string;
  black: boolean;
  claim: string;
  onEnter: () => void;
}) {
  return (
    <div className="absolute inset-x-0 top-[14vh] bottom-[22vh] flex flex-col items-center justify-center gap-8 px-5">
      <Specimen frame={frame} ground={ground} className="h-full w-full max-w-[min(80vh,900px)]" />
      <p className={`max-w-xl text-center font-mono text-[13px] leading-relaxed tracking-wide ${fg}`}>
        {claim}
      </p>
      <button
        type="button"
        onClick={onEnter}
        className={`font-mono text-[11px] tracking-[0.18em] uppercase px-1.5 py-0.5 ${black ? "bg-white text-black" : "bg-black text-white"}`}
      >
        [ENTER]
      </button>
    </div>
  );
}

function LandingFooter({
  persona,
  ground,
  dim,
}: {
  persona: PersonaKey;
  ground: Ground;
  dim: string;
}) {
  return (
    <footer className="absolute left-5 right-5 bottom-5 md:left-8 md:right-8 md:bottom-6">
      <Readout persona={persona} ground={ground} />
      <div className={`mt-2 flex justify-between font-mono text-[11px] tracking-[0.14em] uppercase ${dim}`}>
        <span>Orange County, CA</span>
        <span>{new Date().getUTCFullYear()}</span>
      </div>
    </footer>
  );
}

export function Landing() {
  const { persona, setPersona } = usePersona();
  const { navigateTo } = usePageTransition();
  const p = getPersona(persona);
  const frame = useMemo(() => frameFor(persona), [persona]);
  const snapshot = snapshotFor(persona);
  const scrambled = useScrambleText(p.claim, { speed: 30, staggerPerChar: 12 });
  const reduced = useReducedMotion() ?? false;
  const claim = reduced ? p.claim : scrambled;
  const enter = useCallback(() => navigateTo(`/${persona}`), [navigateTo, persona]);
  useLandingKeys(setPersona, enter);

  const black = p.ground === "black";
  const fg = black ? "text-white" : "text-black";
  const dim = black ? "text-white/60" : "text-black/60";

  return (
    <main
      className="fixed inset-0 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: black ? "#0a0a0a" : "#ffffff" }}
      data-ground={p.ground}
    >
      <p className="sr-only">
        {snapshot
          ? `The figure is a dot matrix rendered from real data: ${snapshot.source.repo} ${snapshot.source.path}, ${snapshot.source.how}.`
          : "This persona is in progress. The figure is a placeholder, not data."}
      </p>

      <LandingHeader persona={persona} setPersona={setPersona} ground={p.ground} fg={fg} />
      <LandingStage frame={frame} ground={p.ground} fg={fg} black={black} claim={claim} onEnter={enter} />
      <LandingFooter persona={persona} ground={p.ground} dim={dim} />
    </main>
  );
}
