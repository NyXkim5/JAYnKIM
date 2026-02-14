"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/components/transitions/TransitionProvider";
import { SITE_ROUTES } from "@/data/routes";

// Derive terminal pages from shared routes + add aliases
const PAGES: Record<string, { path: string; desc: string }> = {
  ...Object.fromEntries(
    SITE_ROUTES.map((r) => [r.label.toLowerCase(), { path: r.path, desc: r.label }])
  ),
  // Aliases for terminal UX
  home: { path: "/", desc: "About & bio" },
  about: { path: "/", desc: "About & bio (alias)" },
  matcha: { path: "/matcha", desc: "Food & drink recs" },
};

const HELP_TEXT = [
  "Available commands:",
  "  cd <page>    Navigate to a page",
  "  ls           List all pages",
  "  whoami       About me",
  "  clear        Clear terminal",
  "  help         Show this message",
  "  exit         Close terminal",
  "",
  "Pages: home, work, writing, lab,",
  "       recs, music, contact",
];

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>(["Welcome to jay@portfolio. Type 'help' for commands.", ""]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { navigateTo } = usePageTransition();

  const addLines = useCallback((...newLines: string[]) => {
    setLines((prev) => [...prev, ...newLines, ""]);
  }, []);

  const execute = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistIdx(-1);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    setLines((prev) => [...prev, `jay@portfolio ~ $ ${trimmed}`]);

    switch (command) {
      case "cd": {
        const page = PAGES[arg];
        if (!arg) {
          addLines("Usage: cd <page>");
        } else if (page) {
          addLines(`Navigating to /${arg}...`);
          setTimeout(() => {
            setOpen(false);
            navigateTo(page.path);
          }, 400);
        } else {
          addLines(`cd: ${arg}: page not found. Type 'ls' to see pages.`);
        }
        break;
      }
      case "ls":
        addLines(
          "Pages:",
          ...Object.entries(PAGES)
            .filter(([k]) => !["about", "matcha"].includes(k))

            .map(([name, { desc }]) => `  ${name.padEnd(12)} ${desc}`)
        );
        break;
      case "whoami":
        addLines(
          "Jay Kim",
          "Software Engineer, AI/ML",
          "Orange County, CA",
          "github.com/NyXkim5",
        );
        break;
      case "help":
        addLines(...HELP_TEXT);
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        setOpen(false);
        break;
      default:
        addLines(`command not found: ${command}. Type 'help' for available commands.`);
    }
  }, [addLines, navigateTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !open) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx >= 0) {
        const newIdx = histIdx + 1;
        if (newIdx >= history.length) {
          setHistIdx(-1);
          setInput("");
        } else {
          setHistIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9991] bg-[#050505]/95 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="w-full max-w-2xl h-[60vh] bg-[#0a0a0a] border border-green-500/20 rounded-lg overflow-hidden flex flex-col shadow-[0_0_60px_rgba(34,197,94,0.05)]"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="font-mono text-[10px] text-white/40 tracking-wider uppercase">
                  Terminal // jay@portfolio
                </span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close terminal" className="font-mono text-xs text-white/30 hover:text-white/60">
                [ESC]
              </button>
            </div>

            {/* Output */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[12px] leading-[1.7] text-green-400/70">
              {lines.map((line, i) => (
                <div key={i}>{line || "\u00A0"}</div>
              ))}

              {/* Input line */}
              <div className="flex items-center gap-2">
                <span className="text-green-400/50 shrink-0">jay@portfolio ~ $</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Terminal command input"
                  className="flex-1 bg-transparent text-green-400/90 outline-none focus-visible:ring-1 focus-visible:ring-green-400/50 caret-green-400"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
