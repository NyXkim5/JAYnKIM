import { HorseVideo } from "@/features/stealth/HorseVideo";
import { StealthGrid } from "@/features/stealth/StealthGrid";
import { QUOTE_BY, STUDIO_QUOTE } from "@/features/studio/quote";

const TIMES = { fontFamily: '"Times New Roman", Times, serif' } as const;
export const GATE_FOOTER = "for more go desktop";

// On phones the site is this and nothing else: the breathing grid, the pink
// horse, the studio line, and a pointer to the desktop. It is pure CSS, so
// there is no flash of the full site before it appears. From md up it is gone.
export function MobileGate() {
  return (
    <div data-mobile-gate className="fixed inset-0 z-[10000] bg-[#0a0a0a] text-white md:hidden">
      <StealthGrid quiet />
      <main className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <HorseVideo />
        <p style={TIMES} className="mt-10 max-w-xs text-[17px] italic leading-relaxed text-white/80">
          &ldquo;{STUDIO_QUOTE}&rdquo;
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">{QUOTE_BY}</p>
      </main>
      <p className="absolute inset-x-0 bottom-8 z-10 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff69b4]">
        {GATE_FOOTER}
      </p>
    </div>
  );
}
