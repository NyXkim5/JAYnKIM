"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { Section } from "@/components/layout/Section";

const achievements = [
  { label: "Projects Built", value: 12, suffix: "+" },
  { label: "Commits This Year", value: 2400, suffix: "+" },
  { label: "Hackathon Wins", value: 5, suffix: "" },
  { label: "Stars Earned", value: 340, suffix: "+" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [inView, value, count]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${v}${suffix}`;
      }
    });
    return unsubscribe;
  }, [rounded, suffix]);

  return (
    <span ref={ref} className="font-mono text-4xl md:text-5xl font-bold text-glow-cyan text-accent-cyan">
      0{suffix}
    </span>
  );
}

export function AchievementsSection() {
  return (
    <Section id="achievements" title="Metrics" subtitle="By the numbers">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {achievements.map((item) => (
          <motion.div
            key={item.label}
            className="section-reveal text-center p-6 border border-border-default rounded-lg bg-bg-elevated/50"
            whileHover={{ borderColor: "rgba(34, 211, 238, 0.3)" }}
          >
            <Counter value={item.value} suffix={item.suffix} />
            <p className="font-mono text-[10px] tracking-[0.2em] text-text-tertiary uppercase mt-3">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
