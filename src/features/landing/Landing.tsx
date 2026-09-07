"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { PERSONAS, STUDIO_CLAIM } from "@/features/persona/personas";
import { useScrambleText } from "@/features/persona/useScrambleText";
import { PersonaSwitch } from "@/features/persona/PersonaSwitch";
import { EVIDENCE, sourceHref } from "@/features/evidence/registry";
import { ConstellationGrid } from "@/features/studio/ConstellationGrid";
import type { EvidenceMark } from "@/features/studio/constellation";
import { useLanguageHover } from "@/features/studio/useLanguageHover";

const STUDIO_VIDEO = "/studio/studiovid.mp4";
const NAME_EN = "Jay Kim";
const NAME_KO = "김준혁";
import { STUDIO_QUOTE } from "@/features/studio/quote";
const TIMES = { fontFamily: '"Times New Roman", Times, serif' } as const;
const NAME_FACE = { fontFamily: '"Times New Roman", Times, var(--font-hangul-display), sans-serif' } as const;
const SR_TEXT =
  "Studio. A short looping film fills the right half of the screen. Press 1 to 4 to open a discipline.";

function isTypingTarget(e: KeyboardEvent): boolean {
  const tag = (e.target as HTMLElement | null)?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

// Keys 1 to 4 go straight to a discipline page. There is no stage in between.
function useLandingKeys(navigateTo: (href: string) => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      const byIndex = PERSONAS.find((p) => String(p.index) === e.key);
      if (byIndex) navigateTo(`/${byIndex.key}`);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigateTo]);
}

// Every registry entry becomes a node in the grid. Hovering reveals the value,
// clicking goes to its source. Nothing in the grid is invented.
const STUDIO_MARKS: EvidenceMark[] = EVIDENCE.map((e) => ({
  id: e.id,
  value: e.value,
  unit: e.unit,
  href: sourceHref(e),
}));

function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 flex h-12 items-center justify-between px-5 md:px-8">
      <span className="font-mono text-[13px] font-bold tracking-[0.2em] uppercase text-white">
        <span className="text-[#ff69b4]">[</span>Studio<span className="text-[#ff69b4]">]</span>
      </span>
      <div>
        <PersonaSwitch value={null} onChange={() => undefined} ground="black" asLinks />
      </div>
    </header>
  );
}

function StudioStage({
  reduced,
  claim,
  onSelect,
}: {
  reduced: boolean;
  claim: string;
  onSelect: (mark: EvidenceMark) => void;
}) {
  const title = useLanguageHover(NAME_EN, NAME_KO, reduced);
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <>
      <div className="absolute left-0 top-0 h-full w-1/2">
        <ConstellationGrid
          ground="black"
          marks={STUDIO_MARKS}
          videoRef={videoRef}
          onSelect={onSelect}
          className="absolute inset-0"
        />
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-5 text-white mix-blend-difference md:px-8"
          style={TIMES}
        >
          <h1
            className="pointer-events-auto inline-block text-5xl font-bold uppercase leading-none tracking-tight md:text-8xl"
            style={NAME_FACE}
            aria-label={NAME_EN}
            onMouseEnter={title.onEnter}
            onMouseLeave={title.onLeave}
          >
            {title.text}
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed">{claim}</p>
          <p className="mt-6 max-w-md text-[15px] italic leading-relaxed opacity-70">&ldquo;{STUDIO_QUOTE}&rdquo;</p>
        </div>
      </div>
      <video
        ref={videoRef}
        className="fixed right-0 top-0 h-screen w-1/2 object-cover"
        src={STUDIO_VIDEO}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </>
  );
}

export function Landing() {
  const { navigateTo } = usePageTransition();
  const reduced = useReducedMotion() ?? false;
  const scrambled = useScrambleText(STUDIO_CLAIM, { speed: 30, staggerPerChar: 12 });
  const claim = reduced ? STUDIO_CLAIM : scrambled;
  const openMark = useCallback(
    (m: EvidenceMark) => {
      if (m.href.startsWith("http")) window.open(m.href, "_blank", "noopener,noreferrer");
      else navigateTo(m.href);
    },
    [navigateTo],
  );
  useLandingKeys(navigateTo);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0a0a0a]" data-ground="black" data-view="studio">
      <p className="sr-only">{SR_TEXT}</p>
      <LandingHeader />
      <StudioStage reduced={reduced} claim={claim} onSelect={openMark} />
    </main>
  );
}
