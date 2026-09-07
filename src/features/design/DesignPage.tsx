"use client";

import { useEffect, useRef } from "react";
import { PersonaBar } from "@/features/persona/PersonaBar";

export const DESIGN_VIDEO = "/design/prototype.mp4";
export const DESIGN_VIDEO_ALT = "Prototype render, a stack of textured discs on a diagonal rod with panels floating beside it";

// The Design tab while the work is unfinished. The render fills the screen on
// pure black, the same black as the clip, so its frame edges vanish and the
// rod runs off the top and bottom of the viewport instead of ending at a box.
// One pink line at the foot says where things stand. The clip is muted, which
// is what lets it autoplay.
export function DesignPage() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React does not put `muted` in the server HTML, so set it before play.
    video.muted = true;
    // play() returns a promise in browsers and nothing in jsdom. A browser may
    // still refuse autoplay, in which case the first frame stays on screen.
    const playing: Promise<void> | undefined = video.play();
    if (playing) playing.catch(() => undefined);
  }, []);

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <PersonaBar persona="design" />
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover md:object-contain"
        src={DESIGN_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        aria-label={DESIGN_VIDEO_ALT}
      />
      <p className="absolute inset-x-0 bottom-8 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff69b4]">
        in progress
      </p>
    </main>
  );
}
