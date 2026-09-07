"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PersonaBar } from "@/features/persona/PersonaBar";
import { cn } from "@/lib/utils";
import { leafId, TreeItem } from "./FileTree";
import { MapGrid } from "./MapGrid";
import { ProjectWindow } from "./ProjectWindow";
import type { WindowTab } from "./WindowChrome";
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
// stays centred. Enlarge hides the tree and gives the window the full width.
// Below md the window replaces the tree and the page scrolls it, so a tap
// shows the window at once with no scroll box inside a scroll. Back or Esc
// closes the window and the tree comes back.
export function ProjectsExplorer() {
  // ?open=<slug>&tab=case opens straight onto a window, which is how the Work
  // page and the old case study addresses reach a study.
  const params = useSearchParams();
  const asked = params?.get("open") ?? null;
  const [openSlug, setOpenSlug] = useState<string | null>(asked && findProject(asked) ? asked : null);
  const initialTab: WindowTab = params?.get("tab") === "case" ? "case" : "overview";
  const [enlarged, setEnlarged] = useState(false);
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
        <motion.div layout transition={SLIDE} className={cn("w-[min(92vw,400px)] shrink-0", project && "max-md:hidden", project && enlarged && "md:hidden")}>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            {PROJECTS.length} projects · click one to open it
          </p>
          <ul>
            <TreeItem node={tree} depth={0} openSlug={openSlug} onOpen={setOpenSlug} />
          </ul>
        </motion.div>
        {/* initial={false}: a window opened from the address shows at once,
            only windows opened by a click slide in. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {project && (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, x: 48, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.98 }}
              transition={SLIDE}
              className={cn("w-[min(92vw,680px)] shrink-0", enlarged ? "md:w-[min(92vw,1100px)]" : "md:w-[min(52vw,680px)]")}
            >
              <ProjectWindow project={project} onBack={close} enlarged={enlarged} onEnlarge={() => setEnlarged((v) => !v)} initialTab={initialTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
