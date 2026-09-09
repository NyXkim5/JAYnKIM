"use client";

import { useRef, useCallback, useState, createElement } from "react";
import { motion } from "framer-motion";
import { GlitchReveal } from "./GlitchReveal";
import { getPersona, isPersonaKey } from "@/features/persona/personas";

// ─── Types ──────────────────────────────────────────────────────────
type EffectProps = {
  phase: "cover" | "reveal";
  color: string;
  target: string;
  onCoverDone: () => void;
  onRevealDone: () => void;
};

type OverlayProps = {
  target: string;
  phase: "cover" | "reveal";
  onCoverDone: () => void;
  onRevealDone: () => void;
};

// ─── Helpers ────────────────────────────────────────────────────────

/** Tracks cover/reveal completion so the right callback fires. */
function usePhaseCallback(
  onCoverDone: () => void,
  onRevealDone: () => void
) {
  const coverCalledRef = useRef(false);
  return useCallback(() => {
    if (!coverCalledRef.current) {
      coverCalledRef.current = true;
      onCoverDone();
    } else {
      onRevealDone();
    }
  }, [onCoverDone, onRevealDone]);
}

const EASE = [0.76, 0, 0.24, 1] as const;

// ─── Route → Effect map ─────────────────────────────────────────────

// The four discipline routes take their ground from the persona definition,
// so a persona that changes colour never needs a change here.
function personaGround(route: string): "black" | "white" | null {
  const key = route.split("/")[1] ?? "";
  return isPersonaKey(key) ? getPersona(key).ground : null;
}

function getEffect(route: string): React.ComponentType<EffectProps> {
  if (route === "/") return HorizontalBlinds;
  if (personaGround(route)) return BlockGlitch;
  return ColumnWipe;
}

function getOverlayColor(route: string): string {
  if (personaGround(route) === "white") return "#ffffff";
  return "#0a0a0a";
}

// 0. Block Glitch — the four discipline pages
// Strips of the next page's ground tear in over the old view, then tear back
// out block by block, some stuttering, so the new page shows through.
function BlockGlitch({ phase, color, target, onCoverDone, onRevealDone }: EffectProps) {
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const [seed] = useState(() => Date.now());
  const ground = color === "#ffffff" ? "white" : "black";
  const key = target.split("/")[1] ?? "";
  const label = isPersonaKey(key) ? getPersona(key).short : undefined;
  return <GlitchReveal phase={phase} ground={ground} seed={seed} onDone={onDone} label={label} />;
}

// ═════════════════════════════════════════════════════════════════════
// EFFECTS — All use clipPath (proven to work with framer-motion)
// ═════════════════════════════════════════════════════════════════════

// 1. Horizontal Blinds — Home (/)
// 8 horizontal strips wipe in from alternating sides
function HorizontalBlinds({ phase, color, onCoverDone, onRevealDone }: EffectProps) {
  const count = 8;
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col pointer-events-auto">
      {Array.from({ length: count }).map((_, i) => {
        const fromLeft = i % 2 === 0;
        return (
          <motion.div
            key={i}
            style={{ flex: 1, background: color }}
            initial={{
              clipPath: fromLeft
                ? "inset(0% 100% 0% 0%)"
                : "inset(0% 0% 0% 100%)",
            }}
            animate={{
              clipPath: isReveal
                ? fromLeft
                  ? "inset(0% 0% 0% 100%)"
                  : "inset(0% 100% 0% 0%)"
                : "inset(0% 0% 0% 0%)",
            }}
            transition={{
              duration: 0.45,
              delay: i * 0.04,
              ease: EASE,
            }}
            onAnimationComplete={() => {
              if (i === count - 1) onDone();
            }}
          />
        );
      })}
    </div>
  );
}

// 2. Column Wipe — any route that is not home or a discipline page
// 6 vertical columns wipe down staggered left-to-right
function ColumnWipe({ phase, color, onCoverDone, onRevealDone }: EffectProps) {
  const count = 6;
  const onDone = usePhaseCallback(onCoverDone, onRevealDone);
  const isReveal = phase === "reveal";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-row pointer-events-auto">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          style={{ flex: 1, background: color }}
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{
            clipPath: isReveal
              ? "inset(100% 0% 0% 0%)"
              : "inset(0% 0% 0% 0%)",
          }}
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: EASE,
          }}
          onAnimationComplete={() => {
            if (i === count - 1) onDone();
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Overlay ───────────────────────────────────────────────────

export function TransitionOverlay({
  target,
  phase,
  onCoverDone,
  onRevealDone,
}: OverlayProps) {
  return createElement(getEffect(target), {
    phase,
    color: getOverlayColor(target),
    target,
    onCoverDone,
    onRevealDone,
  });
}
