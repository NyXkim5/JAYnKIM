"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeNode } from "./projects";

type ItemProps = {
  node: TreeNode;
  depth: number;
  openSlug: string | null;
  onOpen: (slug: string) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Leaf({ node, active, onOpen }: { node: TreeNode; active: boolean; onOpen: (slug: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => node.slug && onOpen(node.slug)}
      className={cn(
        "ml-[22px] flex items-center gap-2 py-1 font-mono text-[12px] tracking-wide transition-colors",
        active ? "text-[#ff69b4]" : "text-white/70 hover:text-white",
      )}
    >
      <FileText className="size-4 shrink-0" />
      <span className="text-left">{node.name}</span>
    </button>
  );
}

// One row of the tree. Folders open and close; leaves open a project window.
export function TreeItem({ node, depth, openSlug, onOpen }: ItemProps) {
  const [open, setOpen] = useState(depth <= 1);
  const children = node.nodes;
  if (!children) return <li><Leaf node={node} active={openSlug === node.slug} onOpen={onOpen} /></li>;

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 py-1 font-mono text-[12px] uppercase tracking-[0.18em] text-white hover:text-[#ff69b4] transition-colors"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.25, ease: EASE }} className="flex">
          <ChevronRight className="size-4 text-white/50" />
        </motion.span>
        <Folder className="size-4 text-[#ff69b4]" fill="#ff69b4" />
        {node.name}/
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col overflow-hidden pl-6"
          >
            {children.map((child) => (
              <TreeItem key={child.slug ?? child.name} node={child} depth={depth + 1} openSlug={openSlug} onOpen={onOpen} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
