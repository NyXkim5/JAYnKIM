import { PersonaBar } from "@/features/persona/PersonaBar";

export const STEALTH_STATEMENT =
  "Make every battlefield an American battlefield. Manifest destiny did not stop at California, it will wrap this world as many times as we choose to.";

// The Stealth tab: one pink statement in the middle of a black screen with a
// terminal caret blinking after the last word. The caret is decorative, so it
// is hidden from screen readers and holds still for readers who prefer less motion.
export function StealthPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 pt-12 text-white">
      <PersonaBar persona="stealth" />
      <p className="max-w-2xl text-center font-mono text-[15px] leading-relaxed tracking-[0.04em] text-[#ff69b4] md:text-[19px]">
        {STEALTH_STATEMENT}
        <span
          aria-hidden
          data-caret
          className="ml-1 inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] animate-[caret_1.1s_steps(1)_infinite] bg-[#ff69b4] motion-reduce:animate-none"
        />
      </p>
    </main>
  );
}
