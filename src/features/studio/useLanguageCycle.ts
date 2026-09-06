"use client";

import { useEffect, useState } from "react";
import { useScrambleText } from "@/features/persona/useScrambleText";

// Alternates one line between its English and Korean forms. Each switch
// resolves through the site's character scramble. Reduced motion pins English.
export function useLanguageCycle(english: string, korean: string, holdMs: number, reduced: boolean): string {
  const [showKorean, setShowKorean] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setShowKorean((k) => !k), holdMs);
    return () => clearInterval(id);
  }, [holdMs, reduced]);

  const scrambled = useScrambleText(showKorean ? korean : english, { speed: 40, staggerPerChar: 70 });
  return reduced ? english : scrambled;
}
