"use client";

import { useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlitchText } from "@/components/ui/GlitchText";
import { PRIMARY_ROUTES, SECONDARY_ROUTES } from "@/data/routes";

const primaryLinks = PRIMARY_ROUTES.map((r) => ({ label: r.label, href: r.path }));
const moreLinks = SECONDARY_ROUTES.map((r) => ({ label: r.label, href: r.path }));
const allLinks = [...primaryLinks.slice(0, 3), ...moreLinks, primaryLinks[3]];

interface NavbarProps {
  variant?: "light" | "dark";
}

export function Navbar({ variant = "light" }: NavbarProps) {
  const pathname = usePathname();
  const isDark = variant === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setMoreOpen(false);
      moreButtonRef.current?.focus();
      return;
    }
    if (e.key === "Tab" && dropdownRef.current) {
      const focusable = dropdownRef.current.querySelectorAll<HTMLElement>("a, button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        setMoreOpen(false);
        moreButtonRef.current?.focus();
      }
    }
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        isDark
          ? "bg-transparent"
          : "bg-bg-white/80 backdrop-blur-sm border-b border-border-light"
      )}
    >
      <nav className="flex items-center justify-between px-5 md:px-8 h-16">
        <TransitionLink
          href="/"
          className={cn(
            "font-mono text-sm font-bold tracking-widest uppercase",
            isDark ? "text-white hover:text-accent-cyan" : "text-text-black hover:text-text-mid",
            "transition-colors"
          )}
        >
          <GlitchText text="Jay Kim" interval={6000} />
        </TransitionLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {/* Primary links */}
          {primaryLinks.slice(0, 3).map((link) => {
            const isActive = pathname === link.href;
            return (
              <TransitionLink
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "font-mono text-[13px] tracking-wider uppercase transition-colors",
                  isDark
                    ? isActive ? "text-accent-cyan" : "text-white/60 hover:text-white"
                    : isActive ? "text-text-black" : "text-text-mid hover:text-text-black"
                )}
              >
                {link.label}
              </TransitionLink>
            );
          })}

          {/* More dropdown - hover + keyboard accessible */}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              ref={moreButtonRef}
              onClick={() => setMoreOpen(!moreOpen)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setMoreOpen(false);
              }}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className={cn(
                "font-mono text-[13px] tracking-wider uppercase transition-colors flex items-center gap-1 bg-transparent border-none p-0",
                isDark
                  ? moreOpen ? "text-accent-cyan" : "text-white/60 hover:text-white"
                  : moreOpen ? "text-text-black" : "text-text-mid hover:text-text-black"
              )}
            >
              More
              <svg width="10" height="10" viewBox="0 0 10 10" className={cn("transition-transform duration-200", moreOpen && "rotate-180")}>
                <path d="M2 4L5 7L8 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

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
                  ref={dropdownRef}
                  onKeyDown={handleDropdownKeyDown}
                >
                  {moreLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <TransitionLink
                        key={link.href}
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "block px-4 py-2.5 font-mono text-[13px] tracking-wider uppercase transition-colors rounded",
                          isDark
                            ? isActive ? "text-accent-cyan bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"
                            : isActive ? "text-text-black bg-bg-light" : "text-text-mid hover:text-text-black hover:bg-bg-light"
                        )}
                      >
                        {link.label}
                      </TransitionLink>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact link */}
          <TransitionLink
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={cn(
              "font-mono text-[13px] tracking-wider uppercase transition-colors",
              isDark
                ? pathname === "/contact" ? "text-accent-cyan" : "text-white/60 hover:text-white"
                : pathname === "/contact" ? "text-text-black" : "text-text-mid hover:text-text-black"
            )}
          >
            Contact
          </TransitionLink>

          {/* Resume button - prominent */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-mono text-[12px] tracking-wider uppercase px-4 py-2 rounded transition-all",
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
                    <TransitionLink
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block py-3 border-b font-mono text-sm tracking-wider uppercase transition-colors",
                        isDark
                          ? `border-border-dark ${isActive ? "text-accent-cyan" : "text-white/70"}`
                          : `border-border-light ${isActive ? "text-text-black" : "text-text-mid"}`
                      )}
                    >
                      {link.label}
                    </TransitionLink>
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
