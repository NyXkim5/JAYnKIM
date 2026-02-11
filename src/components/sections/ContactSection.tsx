"use client";

import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

const terminalLines = [
  "$ whoami",
  "jay-kim",
  "",
  "$ cat contact.txt",
  "Email:    jay@example.com",
  "GitHub:   github.com/jaykim",
  "LinkedIn: linkedin.com/in/jaykim",
  "",
  "$ echo \"Let's build something.\"",
  "Let's build something.",
];

export function ContactSection() {
  return (
    <Section id="contact" title="Contact" subtitle="Get in touch">
      <div className="max-w-2xl mx-auto">
        {/* Terminal */}
        <div className="section-reveal rounded-lg border border-border-default bg-bg-secondary overflow-hidden mb-10">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default bg-bg-elevated">
            <div className="w-3 h-3 rounded-full bg-accent-red/70" />
            <div className="w-3 h-3 rounded-full bg-accent-amber/70" />
            <div className="w-3 h-3 rounded-full bg-accent-green/70" />
            <span className="ml-3 font-mono text-[10px] text-text-tertiary tracking-wider">
              terminal — zsh
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm leading-relaxed">
            {terminalLines.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-accent-green" : "text-text-secondary"}>
                {line || "\u00A0"}
              </div>
            ))}
            <div className="flex items-center mt-1">
              <span className="text-accent-green">$ </span>
              <span className="w-2 h-4 bg-accent-cyan animate-blink ml-1" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="section-reveal text-center space-y-6">
          <p className="text-text-secondary text-sm">
            Have a project in mind? I&apos;m always interested in hearing about new opportunities and ideas.
          </p>
          <div className="flex justify-center gap-4">
            <Button href="mailto:jay@example.com">Send Email</Button>
            <Button variant="ghost" href="#">Resume</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
