"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PersonaBar } from "@/features/persona/PersonaBar";
import { cn } from "@/lib/utils";
import { leafId, TreeItem } from "./FileTree";
import { MapGrid } from "./MapGrid";
import { ProjectWindow } from "./ProjectWindow";
import { findProject, projectTree, PROJECTS } from "./projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE = { duration: 0.45, ease: EASE } as const;

function useEscape(onEscape: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onEscape();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [onEscape, active]);
}

// After a window closes, focus goes back to the leaf that opened it. This
// runs as an effect so the leaf is visible again first: below md the tree
// is hidden while a window is open, and a hidden element cannot take focus.
function useReturnFocus(openSlug: string | null) {
  const lastSlug = useRef<string | null>(null);
  useEffect(() => {
    if (openSlug) {
      lastSlug.current = openSlug;
      return;
    }
    const slug = lastSlug.current;
    lastSlug.current = null;
    if (slug) document.getElementById(leafId(slug))?.focus();
  }, [openSlug]);
}

// The Projects tab. The tree sits centred on black. From md up, opening a
// project slides the tree left and the window in from the right, so the pair
// stays centred. Below md the window replaces the tree and the page scrolls
// it, so a tap shows the window at once with no scroll box inside a scroll.
// Back or Esc closes the window and the tree comes back.
export function ProjectsExplorer() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const tree = useMemo(() => projectTree(), []);
  const project = openSlug ? findProject(openSlug) : undefined;
  const close = () => setOpenSlug(null);
  useEscape(close, project !== undefined);
  useReturnFocus(openSlug);

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] pt-12 text-white">
      <MapGrid className="fixed inset-0 z-0 h-full w-full" />
      <PersonaBar persona="projects" />
      <section className="relative z-10 flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-10 px-5 py-16 md:flex-row md:items-center md:gap-16">
        <motion.div layout transition={SLIDE} className={cn("w-[min(92vw,400px)] shrink-0", project && "max-md:hidden")}>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            {PROJECTS.length} projects · click one to open it
          </p>
          <ul>
            <TreeItem node={tree} depth={0} openSlug={openSlug} onOpen={setOpenSlug} />
          </ul>
        </motion.div>
        <AnimatePresence mode="popLayout">
          {project && (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, x: 48, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.98 }}
              transition={SLIDE}
              className="w-[min(92vw,680px)] shrink-0 md:w-[min(52vw,680px)]"
            >
              <ProjectWindow project={project} onBack={close} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
