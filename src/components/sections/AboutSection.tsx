"use client";

import { Section } from "@/components/layout/Section";
import { TechBadge } from "@/components/ui/TechBadge";

const skills = [
  { category: "Languages", items: ["TypeScript", "Python", "C++", "Rust", "Go"] },
  { category: "Frontend", items: ["React", "Next.js", "Three.js", "Tailwind"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "Redis", "Docker"] },
  { category: "Tools", items: ["Git", "AWS", "Linux", "Figma"] },
];

const stats = [
  { label: "Location", value: "San Francisco, CA" },
  { label: "Status", value: "Open to opportunities" },
  { label: "Focus", value: "Full Stack / Systems" },
  { label: "Education", value: "B.S. Computer Science" },
];

export function AboutSection() {
  return (
    <Section id="about" title="About" subtitle="Building systems that matter" grid>
      <div className="grid md:grid-cols-2 gap-16">
        {/* Bio */}
        <div className="section-reveal space-y-6">
          <p className="text-text-secondary leading-relaxed">
            I&apos;m a software engineer passionate about building high-performance systems
            and elegant interfaces. I thrive at the intersection of complex backend
            architecture and polished user experiences.
          </p>
          <p className="text-text-secondary leading-relaxed">
            My work spans full-stack development, systems programming, and
            infrastructure. I care deeply about writing clean, maintainable code
            that solves real problems.
          </p>

          {/* Data grid */}
          <div className="border border-border-default rounded-lg divide-y divide-border-default mt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex justify-between items-center px-4 py-3">
                <span className="font-mono text-[11px] tracking-wider uppercase text-text-tertiary">
                  {stat.label}
                </span>
                <span className="font-mono text-xs text-text-primary">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="section-reveal space-y-8">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="font-mono text-[11px] tracking-[0.2em] text-text-tertiary uppercase mb-3">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <TechBadge key={skill} label={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
