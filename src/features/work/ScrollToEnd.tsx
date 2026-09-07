"use client";

import { useEffect, useRef, type ReactNode } from "react";

// A horizontal scroll box that opens scrolled to its right edge, so a narrow
// screen shows the most recent weeks of the contribution graph first.
export function ScrollToEnd({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
