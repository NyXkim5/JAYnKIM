"use client";

import { useEffect, useState } from "react";

export function VisitorCounter({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const key = "jk-visit-count";
      const stored = parseInt(localStorage.getItem(key) || "0", 10);
      const next = stored + 1;
      localStorage.setItem(key, next.toString());
      queueMicrotask(() => setCount(next));
    } catch {
      queueMicrotask(() => setCount(1));
    }
  }, []);

  if (count === null) return null;

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      VISITS: {count.toString().padStart(6, "0")}
    </span>
  );
}
