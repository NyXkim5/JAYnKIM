"use client";

import React from "react";
import { useScrambleText } from "@/hooks/useScrambleText";

interface ScrambleTextProps {
  text: string;
  delay?: number;
  speed?: number;
  stagger?: number;
  className?: string;
  as?: React.ElementType;
}

/**
 * Renders text that scrambles from Korean characters to the final English text.
 * Uses a fixed-width approach so layout doesn't shift.
 */
export function ScrambleText({
  text,
  delay = 200,
  speed = 40,
  stagger = 30,
  className = "",
  as: Tag = "span",
}: ScrambleTextProps) {
  const display = useScrambleText(text, { delay, speed, staggerPerChar: stagger });

  return <Tag className={className}>{display || text}</Tag>;
}
