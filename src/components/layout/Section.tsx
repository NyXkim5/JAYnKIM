"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap-config";

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  grid?: boolean;
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
  grid = false,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      gsap.from(ref.current.querySelectorAll(".section-reveal"), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative py-24 md:py-32",
        grid && "bg-defense-grid",
        className
      )}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {title && (
          <div className="section-reveal mb-16">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-8 bg-accent-cyan" />
              <h2 className="font-mono text-xs tracking-[0.2em] text-accent-cyan uppercase">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-2xl md:text-3xl font-light text-text-primary">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
