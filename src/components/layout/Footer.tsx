"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";
import { SITE_ROUTES } from "@/data/routes";

interface FooterProps {
  variant?: "light" | "dark";
  compact?: boolean;
}

export function Footer({ variant = "light", compact = false }: FooterProps) {
  const isDark = variant === "dark";
  const textCls = isDark ? "text-white/30 hover:text-white/70" : "text-text-light hover:text-text-black";
  const mutedCls = isDark ? "text-white/40" : "text-text-light";
  const year = new Date().getFullYear();

  const socialLinks = (
    <div className="flex gap-5 shrink-0">
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
  );

  if (compact) {
    return (
      <footer
        className={
          isDark
            ? "relative z-10 border-t border-white/10 bg-transparent px-5 md:px-8"
            : "border-t border-border-light bg-bg-white px-5 md:px-8"
        }
      >
        <div className="flex items-center justify-center py-2">
          {socialLinks}
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={
        isDark
          ? "border-t border-border-dark bg-bg-dark px-5 md:px-8"
          : "border-t border-border-light bg-bg-white px-5 md:px-8"
      }
    >
      <div className="flex items-center justify-between py-4 gap-4">
        <p className={`font-mono text-[10px] tracking-wider ${mutedCls} shrink-0`}>
          &copy; {year} JAY KIM
        </p>

        <div className="hidden md:flex flex-wrap justify-center gap-x-6">
          {SITE_ROUTES.filter((r) => r.path !== "/contact").map((r) => ({ label: r.label, href: r.path })).map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${textCls}`}
            >
              {link.label}
            </TransitionLink>
          ))}
        </div>

        {socialLinks}
      </div>
    </footer>
  );
}
