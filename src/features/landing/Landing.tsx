"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import {
  getPersona,
  PERSONAS,
  STUDIO,
  STUDIO_CLAIM,
  type Ground,
  type LandingView,
  type PersonaKey,
} from "@/features/persona/personas";
import { useLandingView } from "@/features/persona/usePersona";
import { useScrambleText } from "@/features/persona/useScrambleText";
import { PersonaSwitch } from "@/features/persona/PersonaSwitch";
import { Readout } from "@/features/evidence/Readout";
import { Specimen } from "@/features/specimen/Specimen";
import { frameFor, snapshotFor } from "@/features/specimen/adapters";
import type { SnapshotSource } from "@/features/specimen/snapshot";
import type { SpecimenFrame } from "@/features/specimen/types";
import { Clock } from "./Clock";

const STUDIO_VIDEO = "/studio/studiovid.mp4";

function isTypingTarget(e: KeyboardEvent): boolean {
  const tag = (e.target as HTMLElement | null)?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

function useLandingKeys(setView: (v: LandingView) => void, enter: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" || e.key === "0") return setView(STUDIO);
      const byIndex = PERSONAS.find((p) => String(p.index) === e.key);
      if (byIndex) return setView(byIndex.key);
      if (e.key === "Enter" && (e.target as HTMLElement | null)?.closest("a,button")) return;
      if (e.key === "Enter") enter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setView, enter]);
}

function srDescription(studio: boolean, source: SnapshotSource | null): string {
  if (studio) {
    return "Studio. A short looping film fills the right half of the screen. Press 1 to 4 to open a discipline.";
  }
  if (source) {
    return `The figure is a dot matrix rendered from real data: ${source.repo} ${source.path}, ${source.how}.`;
  }
  return "This persona is in progress. The figure is a placeholder, not data.";
}

function LandingHeader({
  view,
  setView,
  ground,
  fg,
}: {
  view: LandingView;
  setView: (v: LandingView) => void;
  ground: Ground;
  fg: string;
}) {
  const studio = view === STUDIO;
  const backdrop = studio ? "rounded bg-black/30 px-2 py-1 backdrop-blur-sm" : "";
  return (
    <header className="absolute left-5 right-5 top-5 z-10 flex items-start justify-between md:left-8 md:right-8 md:top-6">
      <button
        type="button"
        onClick={() => setView(STUDIO)}
        aria-label="Back to Studio"
        className={`font-mono text-[13px] font-bold tracking-[0.2em] uppercase ${fg}`}
      >
        Studio
      </button>
      <div className={`flex flex-col items-end gap-2 ${backdrop}`}>
        <PersonaSwitch value={studio ? null : view} onChange={setView} ground={ground} />
        <Clock ground={ground} />
      </div>
    </header>
  );
}

function StudioStage({ reduced, fg, claim }: { reduced: boolean; fg: string; claim: string }) {
  return (
    <>
      <video
        className="fixed right-0 top-0 h-screen w-1/2 object-cover"
        src={STUDIO_VIDEO}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute left-5 right-1/2 top-[14vh] bottom-[22vh] flex flex-col justify-center gap-6 pr-8 md:left-8">
        <p className={`max-w-md font-mono text-[13px] leading-relaxed tracking-wide ${fg}`}>{claim}</p>
        <p className={`font-mono text-[11px] tracking-[0.18em] uppercase opacity-60 ${fg}`}>Press 1 to 4</p>
      </div>
    </>
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

function LandingFooter({ view, ground, dim }: { view: LandingView; ground: Ground; dim: string }) {
  return (
    <footer className="absolute left-5 right-5 bottom-5 z-10 md:left-8 md:right-8 md:bottom-6">
      <Readout persona={view} ground={ground} />
      <div className={`mt-2 flex justify-between font-mono text-[11px] tracking-[0.14em] uppercase ${dim}`}>
        <span>Orange County, CA</span>
        <span>{new Date().getUTCFullYear()}</span>
      </div>
    </footer>
  );
}

export function Landing() {
  const { view, setView } = useLandingView();
  const { navigateTo } = usePageTransition();
  const personaKey: PersonaKey | null = view === STUDIO ? null : view;
  const p = personaKey ? getPersona(personaKey) : null;
  const ground: Ground = p ? p.ground : "black";
  const frame = useMemo(() => (personaKey ? frameFor(personaKey) : null), [personaKey]);
  const source = personaKey ? (snapshotFor(personaKey)?.source ?? null) : null;
  const target = p ? p.claim : STUDIO_CLAIM;
  const scrambled = useScrambleText(target, { speed: 30, staggerPerChar: 12 });
  const reduced = useReducedMotion() ?? false;
  const claim = reduced ? target : scrambled;
  const enter = useCallback(() => {
    if (personaKey) navigateTo(`/${personaKey}`);
  }, [navigateTo, personaKey]);
  useLandingKeys(setView, enter);

  const black = ground === "black";
  const fg = black ? "text-white" : "text-black";
  const dim = black ? "text-white/60" : "text-black/60";

  return (
    <main
      className="fixed inset-0 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: black ? "#0a0a0a" : "#ffffff" }}
      data-ground={ground}
      data-view={view}
    >
      <p className="sr-only">{srDescription(!personaKey, source)}</p>
      <LandingHeader view={view} setView={setView} ground={ground} fg={fg} />
      {frame ? (
        <LandingStage frame={frame} ground={ground} fg={fg} black={black} claim={claim} onEnter={enter} />
      ) : (
        <StudioStage reduced={reduced} fg={fg} claim={claim} />
      )}
      <LandingFooter view={view} ground={ground} dim={dim} />
    </main>
  );
}
