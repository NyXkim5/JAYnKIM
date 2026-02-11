"use client";

import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { TechBadge } from "@/components/ui/TechBadge";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Button } from "@/components/ui/Button";

const projects = [
  {
    title: "Project Alpha",
    description: "Real-time data processing pipeline with advanced visualization dashboard. Handles 10k+ events/sec.",
    tags: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    status: "deployed" as const,
    links: { github: "#", live: "#" },
  },
  {
    title: "Project Beta",
    description: "Machine learning inference engine optimized for edge deployment. Sub-10ms latency on consumer hardware.",
    tags: ["Python", "C++", "ONNX", "Docker"],
    status: "active" as const,
    links: { github: "#" },
  },
  {
    title: "Project Gamma",
    description: "Distributed task orchestration system with fault tolerance and automatic recovery mechanisms.",
    tags: ["Go", "gRPC", "Redis", "Kubernetes"],
    status: "in-progress" as const,
    links: { github: "#" },
  },
  {
    title: "Project Delta",
    description: "Cross-platform mobile application with offline-first architecture and real-time sync capabilities.",
    tags: ["React Native", "TypeScript", "SQLite"],
    status: "deployed" as const,
    links: { github: "#", live: "#" },
  },
];

export function ProjectsSection() {
  return (
    <Section id="projects" title="Projects" subtitle="Selected work">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.title} className="section-reveal">
            <Card>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-mono text-lg font-semibold text-text-primary">
                  {project.title}
                </h3>
                <StatusIndicator status={project.status} label={project.status} />
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tags.map((tag) => (
                  <TechBadge key={tag} label={tag} variant="blue" />
                ))}
              </div>

              <div className="flex gap-3">
                {project.links.github && (
                  <Button variant="ghost" href={project.links.github}>
                    Source
                  </Button>
                )}
                {project.links.live && (
                  <Button href={project.links.live}>
                    Live Demo
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}
