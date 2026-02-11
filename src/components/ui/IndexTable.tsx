"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface IndexEntry {
  id: string;
  title: string;
  detail?: string;
  meta?: string;
  year?: string;
  href?: string;
}

interface IndexTableProps {
  entries: IndexEntry[];
  columns?: {
    title: string;
    detail?: string;
    meta?: string;
    year?: string;
  };
  className?: string;
}

export function IndexTable({ entries, columns, className }: IndexTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      {columns && (
        <div className="grid grid-cols-[40px_1fr_120px_60px] md:grid-cols-[50px_1fr_180px_80px] gap-4 pb-3 mb-1 border-b border-border-default">
          <span className="font-mono text-[9px] tracking-[0.2em] text-text-tertiary uppercase">
            No
          </span>
          <span className="font-mono text-[9px] tracking-[0.2em] text-text-tertiary uppercase">
            {columns.title}
          </span>
          {columns.meta && (
            <span className="font-mono text-[9px] tracking-[0.2em] text-text-tertiary uppercase hidden md:block">
              {columns.meta}
            </span>
          )}
          {columns.year && (
            <span className="font-mono text-[9px] tracking-[0.2em] text-text-tertiary uppercase text-right">
              {columns.year}
            </span>
          )}
        </div>
      )}

      {/* Rows */}
      {entries.map((entry, i) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
        >
          <a
            href={entry.href || "#"}
            className="group grid grid-cols-[40px_1fr_120px_60px] md:grid-cols-[50px_1fr_180px_80px] gap-4 py-3 border-b border-border-subtle hover:border-accent-cyan/20 transition-all duration-300 items-baseline"
          >
            <span className="font-mono text-[11px] text-text-tertiary group-hover:text-accent-cyan transition-colors">
              {entry.id}
            </span>

            <div>
              <span className="text-sm text-text-primary group-hover:text-accent-cyan transition-colors">
                {entry.title}
              </span>
              {entry.detail && (
                <span className="block text-[11px] text-text-tertiary mt-0.5 font-mono">
                  {entry.detail}
                </span>
              )}
            </div>

            <span className="font-mono text-[11px] text-text-secondary hidden md:block">
              {entry.meta}
            </span>

            <span className="font-mono text-[11px] text-text-tertiary text-right group-hover:text-accent-cyan transition-colors">
              {entry.year || "↗"}
            </span>
          </a>
        </motion.div>
      ))}
    </div>
  );
}
