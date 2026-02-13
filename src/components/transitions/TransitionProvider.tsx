"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { TransitionOverlay } from "./TransitionOverlay";

type TransitionContextType = {
  navigateTo: (href: string) => void;
  isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [transition, setTransition] = useState<{
    phase: "cover" | "reveal";
    target: string;
  } | null>(null);
  const lockRef = useRef(false);
  const waitingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const navigateTo = useCallback(
    (href: string) => {
      const clean = (p: string) => p.split("?")[0].split("#")[0];
      if (clean(href) === clean(pathname) || lockRef.current) return;
      lockRef.current = true;
      setTransition({ phase: "cover", target: href });
    },
    [pathname]
  );

  const handleCoverDone = useCallback(() => {
    if (!transition) return;
    router.push(transition.target);
    waitingRef.current = true;

    // Fallback: reveal after 300ms even if pathname hasn't updated
    timeoutRef.current = setTimeout(() => {
      if (waitingRef.current) {
        waitingRef.current = false;
        setTransition((prev) =>
          prev ? { ...prev, phase: "reveal" } : null
        );
      }
    }, 300);
  }, [router, transition]);

  // Detect route change to trigger reveal
  useEffect(() => {
    if (waitingRef.current) {
      waitingRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      requestAnimationFrame(() => {
        setTransition((prev) =>
          prev ? { ...prev, phase: "reveal" } : null
        );
      });
    }
  }, [pathname]);

  const handleRevealDone = useCallback(() => {
    setTransition(null);
    lockRef.current = false;
  }, []);

  return (
    <TransitionContext.Provider
      value={{ navigateTo, isTransitioning: !!transition }}
    >
      {children}
      {transition && (
        <TransitionOverlay
          target={transition.target}
          phase={transition.phase}
          onCoverDone={handleCoverDone}
          onRevealDone={handleRevealDone}
        />
      )}
    </TransitionContext.Provider>
  );
}
