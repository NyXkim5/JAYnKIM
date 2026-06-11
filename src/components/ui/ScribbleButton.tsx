"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";

interface ScribbleButtonProps {
  href: string;
  text: string;
}

export function ScribbleButton({ href, text }: ScribbleButtonProps) {
  return (
    <TransitionLink href={href} className="scribble-button">
      <div className="scribble-line" />
      <div className="scribble-line" />
      <span className="scribble-text">{text}</span>
      <div className="scribble-drow1" />
      <div className="scribble-drow2" />
    </TransitionLink>
  );
}
