"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArrowLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "large" | "minimal";
  className?: string;
}

export function ArrowLink({
  children,
  href,
  onClick,
  variant = "default",
  className,
}: ArrowLinkProps) {
  const content = (
    <motion.span
      className={cn(
        "group inline-flex items-center gap-2 font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer",
        variant === "default" &&
          "text-xs text-text-secondary hover:text-accent-cyan border-b border-border-default hover:border-accent-cyan/50 pb-1",
        variant === "large" &&
          "text-2xl md:text-4xl font-bold text-text-primary hover:text-accent-cyan",
        variant === "minimal" &&
          "text-[11px] text-text-tertiary hover:text-text-primary",
        className
      )}
      whileHover="hover"
    >
      {children}
      <motion.span
        className="inline-block"
        variants={{
          hover: { x: 3, y: -3 },
        }}
        transition={{ duration: 0.2 }}
      >
        &#8599;
      </motion.span>
    </motion.span>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="no-underline"
      >
        {content}
      </a>
    );
  }

  return <button onClick={onClick}>{content}</button>;
}
