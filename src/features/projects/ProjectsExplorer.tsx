"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PersonaBar } from "@/features/persona/PersonaBar";
import { TreeItem } from "./FileTree";
import { ProjectWindow } from "./ProjectWindow";
import { findProject, projectTree, PROJECTS } from "./projects";

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

// The Projects tab: a file tree centred on black. A leaf opens its project as
// a window; back or Esc returns to the tree with the same folders open.
export function ProjectsExplorer() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const tree = useMemo(() => projectTree(), []);
  const project = openSlug ? findProject(openSlug) : undefined;
  const close = () => setOpenSlug(null);
  useEscape(close, project !== undefined);

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-12 text-white">
      <PersonaBar persona="projects" />
      <section className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center px-5 py-16">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          {PROJECTS.length} projects · click one to open it
        </p>
        <ul className="w-[min(92vw,520px)]">
          <TreeItem node={tree} depth={0} openSlug={openSlug} onOpen={setOpenSlug} />
        </ul>
      </section>
      {/* Presence needs keyed motion children directly under it, never a fragment. */}
      <AnimatePresence>
        {project && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
        )}
        {project && <ProjectWindow key={project.slug} project={project} onBack={close} />}
      </AnimatePresence>
    </main>
  );
}
