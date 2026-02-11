import { cn } from "@/lib/utils";

interface GlowTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  color?: "blue" | "cyan" | "green";
  className?: string;
}

const glowMap = {
  blue: "text-glow-blue",
  cyan: "text-glow-cyan",
  green: "text-glow-green",
};

export function GlowText({
  children,
  as: Tag = "h2",
  color = "cyan",
  className,
}: GlowTextProps) {
  return (
    <Tag className={cn("font-mono font-bold", glowMap[color], className)}>
      {children}
    </Tag>
  );
}
