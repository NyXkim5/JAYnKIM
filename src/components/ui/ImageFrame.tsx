"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageFrameProps {
  src: string;
  alt: string;
  index?: string;
  caption?: string;
  aspect?: "portrait" | "landscape" | "square";
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const aspectClasses = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

const sizeClasses = {
  sm: "max-w-[280px]",
  md: "max-w-[400px]",
  lg: "max-w-[560px]",
  full: "w-full",
};

export function ImageFrame({
  src,
  alt,
  index,
  caption,
  aspect = "portrait",
  size = "md",
  className,
}: ImageFrameProps) {
  return (
    <motion.figure
      className={cn("group relative", sizeClasses[size], className)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Index number */}
      {index && (
        <span className="absolute -top-6 -left-1 font-mono text-[10px] text-text-tertiary tracking-wider z-10">
          {index}
        </span>
      )}

      {/* Image container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-sm bg-bg-elevated",
          aspectClasses[aspect]
        )}
      >
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
          whileHover={{ scale: 1.05 }}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Corner markers */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-accent-cyan/0 group-hover:border-accent-cyan/40 transition-all duration-500" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-accent-cyan/0 group-hover:border-accent-cyan/40 transition-all duration-500" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-accent-cyan/0 group-hover:border-accent-cyan/40 transition-all duration-500" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-accent-cyan/0 group-hover:border-accent-cyan/40 transition-all duration-500" />
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
