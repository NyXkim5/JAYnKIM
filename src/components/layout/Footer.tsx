"use client";

import Link from "next/link";
import { VisitorCounter } from "@/components/ui/VisitorCounter";

interface FooterProps {
  variant?: "light" | "dark";
}

export function Footer({ variant = "light" }: FooterProps) {
  const isDark = variant === "dark";
  const textCls = isDark ? "text-white/30 hover:text-white/70" : "text-text-light hover:text-text-black";
  const mutedCls = isDark ? "text-white/40" : "text-text-light";

  return (
    <footer
      className={
        isDark
          ? "border-t border-border-dark bg-bg-dark px-5 md:px-8"
          : "border-t border-border-light bg-bg-white px-5 md:px-8"
      }
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 gap-6">
        <div className="flex flex-col gap-1">
          <p className={`font-mono text-[11px] tracking-wider ${mutedCls}`}>
            &copy; {new Date().getFullYear()} JAY KIM
          </p>
          <VisitorCounter className={`text-[9px] tracking-wider ${isDark ? "text-white/20" : "text-text-light/50"}`} />
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {[
            { label: "About", href: "/about" },
            { label: "Projects", href: "/projects" },
            { label: "Gallery", href: "/gallery" },
            { label: "Timeline", href: "/timeline" },
            { label: "Recs", href: "/matcha" },
            { label: "Music", href: "/music" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${textCls}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-6">
            <a
              href="https://github.com/NyXkim5"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${textCls}`}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/joonhyuknkim/"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${textCls}`}
            >
              LinkedIn
            </a>
            <a
              href="mailto:joonhyuknkim@gmail.com"
              className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${textCls}`}
            >
              Email
            </a>
          </div>
          <p className={`font-mono text-[9px] tracking-wider ${isDark ? "text-white/15" : "text-text-light/30"}`}>
            &larr; &rarr; Navigate &middot; ⌘K Search &middot; / Terminal
          </p>
        </div>
      </div>
    </footer>
  );
}
