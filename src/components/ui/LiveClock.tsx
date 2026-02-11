"use client";

import { useEffect, useState } from "react";

/**
 * Real-time clock readout — military 24hr format.
 * Shows current time ticking live.
 */
export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const s = now.getSeconds().toString().padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {time}
    </span>
  );
}
