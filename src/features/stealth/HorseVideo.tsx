"use client";

import { useEffect, useRef } from "react";

export const HORSE_SOURCES = [
  // Safari plays HEVC with alpha and refuses the WebM, Chrome and Firefox do
  // the reverse, so both carry real transparency over the grid.
  { src: "/stealth/horse-hevc.mov", type: 'video/quicktime; codecs="hvc1"' },
  { src: "/stealth/horse.webm", type: 'video/webm; codecs="vp9"' },
  // Last resort with no alpha: the horse on the page's own black.
  { src: "/stealth/horse.mp4", type: "video/mp4" },
] as const;
export const HORSE_ALT = "Muybridge's galloping horse and rider drawn in pink dots";

// The dotted horse under the statement: Eadweard Muybridge's "Sallie Gardner
// at a Gallop" (1878), public domain, rendered as pink dots on transparency by
// scripts/stealth/horse.py so only the dots sit over the grid. It is muted,
// which is what lets it autoplay.
export function HorseVideo() {
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
    <video ref={ref} className="mx-auto mt-6 h-32 w-auto md:h-40" autoPlay muted loop playsInline aria-label={HORSE_ALT} data-horse>
      {HORSE_SOURCES.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
