"use client";

import { useRef } from "react";
import { Section } from "@/components/layout/Section";
import { gsap, useGSAP } from "@/lib/gsap-config";
import { TechBadge } from "@/components/ui/TechBadge";

const events = [
  {
    date: "2025",
    title: "Software Engineer",
    org: "Tech Company",
    description: "Building scalable distributed systems and high-performance APIs.",
    type: "work" as const,
    tags: ["TypeScript", "Go", "AWS"],
  },
  {
    date: "2024",
    title: "Software Engineering Intern",
    org: "Startup",
    description: "Developed real-time data processing pipeline handling millions of events daily.",
    type: "work" as const,
    tags: ["Python", "Kafka", "Docker"],
  },
  {
    date: "2023",
    title: "B.S. Computer Science",
    org: "University",
    description: "Focus on systems programming, machine learning, and distributed computing.",
    type: "education" as const,
    tags: ["Systems", "ML", "Algorithms"],
  },
  {
    date: "2022",
    title: "Hackathon - First Place",
    org: "Major Hackathon",
    description: "Built an AI-powered tool for automated code review in 48 hours.",
    type: "award" as const,
    tags: ["AI", "React", "Python"],
  },
];

const typeColors = {
  work: "bg-accent-blue",
  education: "bg-accent-cyan",
  project: "bg-accent-green",
  award: "bg-accent-amber",
};

export function TimelineSection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!timelineRef.current) return;
      const nodes = timelineRef.current.querySelectorAll(".timeline-node");

      gsap.from(nodes, {
        x: (i) => (i % 2 === 0 ? -40 : 40),
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: timelineRef }
  );

  return (
    <Section id="timeline" title="Timeline" subtitle="Journey so far" grid>
      <div ref={timelineRef} className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border-default hidden md:block" />

        <div className="space-y-12">
          {events.map((event, i) => (
            <div
              key={event.date + event.title}
              className={`timeline-node relative flex items-start gap-8 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                <span className="font-mono text-xs text-accent-cyan tracking-wider">
                  {event.date}
                </span>
                <h3 className="font-mono text-base font-semibold text-text-primary mt-1">
                  {event.title}
                </h3>
                <p className="text-text-tertiary text-sm font-mono mt-0.5">
                  {event.org}
                </p>
                <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                  {event.description}
                </p>
                <div className={`flex flex-wrap gap-1.5 mt-3 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                  {event.tags.map((tag) => (
                    <TechBadge key={tag} label={tag} variant="blue" />
                  ))}
                </div>
              </div>

              {/* Node dot */}
              <div className="hidden md:flex flex-col items-center shrink-0">
                <div className={`w-3 h-3 rounded-full ${typeColors[event.type]} shadow-[0_0_8px_rgba(34,211,238,0.3)]`} />
              </div>

              {/* Spacer for the other side */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
