"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";
import { SITE_ROUTES } from "@/data/routes";

interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact = false }: FooterProps) {
  const year = new Date().getFullYear();
  const linkCls =
    "font-mono text-[11px] tracking-wider uppercase transition-colors text-text-light hover:text-text-black";

  const socialLinks = (
    <div className="flex gap-5 shrink-0">
      <a
        href="https://github.com/NyXkim5"
        target="_blank"
        rel="noopener noreferrer"
        className={linkCls}
      >
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/joonhyuknkim/"
        target="_blank"
        rel="noopener noreferrer"
        className={linkCls}
      >
        LinkedIn
      </a>
      <a href="mailto:joonhyuknkim@gmail.com" className={linkCls}>
        Email
      </a>
    </div>
  );

  if (compact) {
    return (
      <footer className="border-t border-border-light bg-bg-white px-5 md:px-8">
        <div className="flex items-center justify-center py-2">
          {socialLinks}
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border-light bg-bg-white px-5 md:px-8">
      <div className="flex items-center justify-between py-4 gap-4">
        <p className="font-mono text-[11px] tracking-wider text-text-light shrink-0">
          &copy; {year} JAY KIM
        </p>

        <div className="hidden md:flex flex-wrap justify-center gap-x-6">
          {SITE_ROUTES.filter((r) => r.path !== "/contact").map((r) => ({ label: r.label, href: r.path })).map((link) => (
            <TransitionLink key={link.href} href={link.href} className={linkCls}>
              {link.label}
            </TransitionLink>
          ))}
        </div>

        {socialLinks}
      </div>
    </footer>
  );
}
