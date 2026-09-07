import { PersonaBar } from "@/features/persona/PersonaBar";
import { StealthGrid } from "./StealthGrid";

export const STEALTH_STATEMENT =
  "Make every battlefield an American battlefield. Manifest destiny did not stop at California, it will wrap this world as many times as we choose to.";
export const STEALTH_CLOSER_BEFORE = "Let the world be lit with ";
export const STEALTH_CLOSER_WORD = "WARD";

// The one word that glows: a hot core with two soft pink halos around it.
const GLOW = {
  textShadow: "0 0 6px #ff69b4, 0 0 18px rgba(255, 105, 180, 0.7), 0 0 44px rgba(255, 105, 180, 0.4)",
} as const;

// A terminal caret after the last word. Decorative, so hidden from screen
// readers, and it holds still for readers who prefer less motion.
function Caret() {
  return (
    <span
      aria-hidden
      data-caret
      className="ml-1 inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] animate-[caret_1.1s_steps(1)_infinite] bg-[#ff69b4] motion-reduce:animate-none"
    />
  );
}

// The Stealth tab: a breathing grid behind, the statement in the middle of a
// black screen, a blank line, then the closer with WARD glowing and the caret
// blinking after the period.
export function StealthPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 pt-12 text-white">
      <StealthGrid />
      <PersonaBar persona="stealth" />
      <div className="relative z-10 max-w-2xl text-center font-mono text-[15px] leading-relaxed tracking-[0.04em] text-[#ff69b4] md:text-[19px]">
        <p>{STEALTH_STATEMENT}</p>
        <p className="mt-[1.6em]">
          {STEALTH_CLOSER_BEFORE}
          <span data-glow style={GLOW}>{STEALTH_CLOSER_WORD}</span>.
          <Caret />
        </p>
      </div>
    </main>
  );
}
