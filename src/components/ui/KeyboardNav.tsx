"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { SITE_ROUTES } from "@/data/routes";

const PAGES = SITE_ROUTES;

export function KeyboardNav() {
  const { navigateTo } = usePageTransition();
  const pathname = usePathname();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input or terminal/palette is open
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      // Don't intercept if modifier keys are held
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const currentIdx = PAGES.findIndex((p) => p.path === pathname);
      if (currentIdx < 0) return;

      // Don't handle arrow keys on /lab - let the project carousel use them
      if (pathname === "/lab" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        return;
      }

      let nextIdx = -1;
      if (e.key === "ArrowRight" || e.key === "l") {
        nextIdx = (currentIdx + 1) % PAGES.length;
      } else if (e.key === "ArrowLeft" || e.key === "h") {
        nextIdx = (currentIdx - 1 + PAGES.length) % PAGES.length;
      }

      if (nextIdx >= 0 && nextIdx !== currentIdx) {
        const next = PAGES[nextIdx];
        setToast(next.label);
        setTimeout(() => setToast(null), 800);
        navigateTo(next.path);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pathname, navigateTo]);

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {toast && <span>Navigating to {toast}</span>}
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9995] pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg px-5 py-2.5">
              <p className="font-mono text-sm text-white/80 tracking-wider">
                {toast}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
