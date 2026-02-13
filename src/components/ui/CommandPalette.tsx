"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { SITE_ROUTES } from "@/data/routes";

interface Command {
  id: string;
  label: string;
  category: "page" | "action";
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigateTo } = usePageTransition();

  const commands: Command[] = [
    ...SITE_ROUTES.map((r) => ({
      id: r.label.toLowerCase(),
      label: r.label,
      category: "page" as const,
      action: () => navigateTo(r.path),
    })),
    { id: "resume", label: "Download Resume", category: "action", action: () => { window.open("/resume.pdf", "_blank"); } },
    { id: "github", label: "GitHub", category: "action", action: () => { window.open("https://github.com/NyXkim5", "_blank"); } },
    { id: "linkedin", label: "LinkedIn", category: "action", action: () => { window.open("https://www.linkedin.com/in/joonhyuknkim/", "_blank"); } },
    { id: "email", label: "Send Email", category: "action", action: () => { window.open("mailto:joonhyuknkim@gmail.com", "_self"); } },
  ];

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const execute = useCallback((cmd: Command) => {
    setOpen(false);
    setQuery("");
    cmd.action();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    queueMicrotask(() => setSelected(0));
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[selected]) {
      e.preventDefault();
      execute(filtered[selected]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9990] flex items-start justify-center pt-[20vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Palette */}
          <motion.div
            className="relative w-[90vw] max-w-[520px] bg-[#0a0a0a] border border-green-500/20 rounded-lg overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
            initial={{ scale: 0.95, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <span className="font-mono text-[11px] text-green-400/60">&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command..."
                className="flex-1 bg-transparent font-mono text-sm text-white/90 placeholder:text-white/30 outline-none focus-visible:ring-2 focus-visible:ring-accent-green/50 focus-visible:ring-offset-0"
              />
              <kbd className="font-mono text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center font-mono text-xs text-white/30">
                  No results found
                </div>
              )}
              {/* Pages */}
              {filtered.some((c) => c.category === "page") && (
                <div className="px-3 pt-2 pb-1">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/20 px-1">
                    Pages
                  </span>
                </div>
              )}
              {filtered
                .filter((c) => c.category === "page")
                .map((cmd, i) => {
                  const globalIdx = filtered.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => execute(cmd)}
                      onMouseEnter={() => setSelected(globalIdx)}
                      className={`w-full text-left px-4 py-2 flex items-center gap-3 font-mono text-sm transition-colors ${
                        selected === globalIdx ? "bg-white/10 text-white" : "text-white/60"
                      }`}
                    >
                      <span className="text-[10px] text-white/20 w-4">{(i + 1).toString().padStart(2, "0")}</span>
                      {cmd.label}
                    </button>
                  );
                })}
              {/* Actions */}
              {filtered.some((c) => c.category === "action") && (
                <div className="px-3 pt-3 pb-1">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/20 px-1">
                    Actions
                  </span>
                </div>
              )}
              {filtered
                .filter((c) => c.category === "action")
                .map((cmd) => {
                  const globalIdx = filtered.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => execute(cmd)}
                      onMouseEnter={() => setSelected(globalIdx)}
                      className={`w-full text-left px-4 py-2 flex items-center gap-3 font-mono text-sm transition-colors ${
                        selected === globalIdx ? "bg-white/10 text-white" : "text-white/60"
                      }`}
                    >
                      <span className="text-[10px] text-green-400/40">&#8599;</span>
                      {cmd.label}
                    </button>
                  );
                })}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-white/10 flex gap-4">
              <span className="font-mono text-[10px] text-white/20">
                <kbd className="border border-white/10 rounded px-1 mr-1">&uarr;&darr;</kbd> navigate
              </span>
              <span className="font-mono text-[10px] text-white/20">
                <kbd className="border border-white/10 rounded px-1 mr-1">&crarr;</kbd> select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
