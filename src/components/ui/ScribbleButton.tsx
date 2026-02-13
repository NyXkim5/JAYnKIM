"use client";

import styles from "./ScribbleButton.module.css";
import { TransitionLink } from "@/components/transitions/TransitionLink";

interface ScribbleButtonProps {
  href: string;
  text: string;
}

export function ScribbleButton({ href, text }: ScribbleButtonProps) {
  return (
    <TransitionLink href={href} className={styles.button}>
      <div className={styles.line} />
      <div className={styles.line} />
      <span className={styles.text}>{text}</span>
      <div className={styles.drow1} />
      <div className={styles.drow2} />
    </TransitionLink>
  );
}
