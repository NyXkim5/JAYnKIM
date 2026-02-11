"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative rounded-lg border border-border-default bg-bg-elevated p-6 transition-all duration-300",
        hover && "hover:border-accent-cyan/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.06)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
