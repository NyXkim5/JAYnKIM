// src/features/landing/Clock.tsx
"use client";

import { useEffect, useState } from "react";
import type { Ground } from "@/features/persona/personas";

function utcNow(): string {
  return new Date().toISOString().slice(11, 19);
}

export function Clock({ ground }: { ground: Ground }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      queueMicrotask(() => setTime(utcNow()));
      id = setInterval(() => setTime(utcNow()), 1000);
    };
    const stop = () => {
      if (id) clearInterval(id);
      id = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const dim = ground === "black" ? "text-white/50" : "text-black/50";
  return (
    <span className={`font-mono text-[11px] tracking-[0.14em] ${dim}`} suppressHydrationWarning>
      {time ? `UTC ${time}` : "UTC"}
    </span>
  );
}
