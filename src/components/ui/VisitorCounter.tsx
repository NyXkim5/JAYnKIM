"use client";

import { useEffect, useState } from "react";

export function VisitorCounter({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const key = "jk-visit-count";
    const stored = parseInt(localStorage.getItem(key) || "0", 10);
    const next = stored + 1;
    localStorage.setItem(key, next.toString());
    // Use a microtask to avoid synchronous setState warning
    queueMicrotask(() => setCount(next));
  }, []);

  if (count === null) return null;

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      VISITS: {count.toString().padStart(6, "0")}
    </span>
  );
}
