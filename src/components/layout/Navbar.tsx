"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlitchText } from "@/components/ui/GlitchText";

// Primary nav links - most important for employers
const primaryLinks = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

// Secondary links - in dropdown
const moreLinks = [
  { label: "Projects", href: "/timeline" },
  { label: "Recs", href: "/matcha" },
  { label: "Music", href: "/music" },
];

const allLinks = [...primaryLinks.slice(0, 2), ...moreLinks, primaryLinks[2]];

interface NavbarProps {
  variant?: "light" | "dark";
}

export function Navbar({ variant = "light" }: NavbarProps) {
  const pathname = usePathname();
  const isDark = variant === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        isDark
          ? "bg-transparent"
          : "bg-bg-white/80 backdrop-blur-sm border-b border-border-light"
      )}
    >
      <nav className="flex items-center justify-between px-5 md:px-8 h-14">
        <Link
          href="/"
          className={cn(
            "font-mono text-sm font-bold tracking-widest uppercase",
            isDark ? "text-white hover:text-accent-cyan" : "text-text-black hover:text-text-mid",
            "transition-colors"
          )}
        >
          <GlitchText text="Jay Kim" interval={6000} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {/* Primary links */}
          {primaryLinks.slice(0, 2).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-[11px] tracking-wider uppercase transition-colors",
                  isDark
                    ? isActive ? "text-accent-cyan" : "text-white/60 hover:text-white"
                    : isActive ? "text-text-black" : "text-text-mid hover:text-text-black"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More dropdown - hover triggered */}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <span
              className={cn(
                "font-mono text-[11px] tracking-wider uppercase transition-colors flex items-center gap-1 cursor-default",
                isDark
                  ? moreOpen ? "text-accent-cyan" : "text-white/60 hover:text-white"
                  : moreOpen ? "text-text-black" : "text-text-mid hover:text-text-black"
              )}
            >
              More
              <svg width="10" height="10" viewBox="0 0 10 10" className={cn("transition-transform duration-200", moreOpen && "rotate-180")}>
                <path d="M2 4L5 7L8 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute top-full left-1/2 -translate-x-1/2 mt-2 py-2 px-1 rounded-lg border min-w-[120px]",
                    isDark
                      ? "bg-bg-dark-elevated border-border-dark"
                      : "bg-bg-white border-border-light shadow-lg"
                  )}
                >
                  {moreLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "block px-3 py-2 font-mono text-[11px] tracking-wider uppercase transition-colors rounded",
                          isDark
                            ? isActive ? "text-accent-cyan bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"
                            : isActive ? "text-text-black bg-bg-light" : "text-text-mid hover:text-text-black hover:bg-bg-light"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact link */}
          <Link
            href="/contact"
            className={cn(
              "font-mono text-[11px] tracking-wider uppercase transition-colors",
              isDark
                ? pathname === "/contact" ? "text-accent-cyan" : "text-white/60 hover:text-white"
                : pathname === "/contact" ? "text-text-black" : "text-text-mid hover:text-text-black"
            )}
          >
            Contact
          </Link>

          {/* Resume button - prominent */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded transition-all",
              isDark
                ? "bg-accent-green/20 text-accent-green border border-accent-green/30 hover:bg-accent-green/30"
                : "bg-text-black text-white hover:bg-text-dark"
            )}
          >
            Resume
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className={cn("block w-5 h-[1.5px] origin-center", isDark ? "bg-white" : "bg-text-black")}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className={cn("block w-5 h-[1.5px]", isDark ? "bg-white" : "bg-text-black")}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className={cn("block w-5 h-[1.5px] origin-center", isDark ? "bg-white" : "bg-text-black")}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              "md:hidden overflow-hidden border-t",
              isDark ? "bg-bg-dark border-border-dark" : "bg-bg-white border-border-light"
            )}
          >
            <div className="px-5 py-4 space-y-1">
              {allLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block py-3 border-b font-mono text-sm tracking-wider uppercase transition-colors",
                        isDark
                          ? `border-border-dark ${isActive ? "text-accent-cyan" : "text-white/70"}`
                          : `border-border-light ${isActive ? "text-text-black" : "text-text-mid"}`
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile resume button */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: allLinks.length * 0.05 }}
                className="pt-3"
              >
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block py-3 font-mono text-sm tracking-wider uppercase text-center rounded",
                    isDark
                      ? "bg-accent-green/20 text-accent-green border border-accent-green/30"
                      : "bg-text-black text-white"
                  )}
                >
                  Download Resume
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
