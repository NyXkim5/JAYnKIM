import { cn } from "@/lib/utils";

interface TechBadgeProps {
  label: string;
  variant?: "blue" | "cyan" | "green";
}

const variantStyles = {
  blue: "border-accent-blue/40 text-accent-blue hover:border-accent-blue hover:shadow-[0_0_10px_rgba(14,165,233,0.2)]",
  cyan: "border-accent-cyan/40 text-accent-cyan hover:border-accent-cyan hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]",
  green: "border-accent-green/40 text-accent-green hover:border-accent-green hover:shadow-[0_0_10px_rgba(34,197,94,0.2)]",
};

export function TechBadge({ label, variant = "cyan" }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 rounded font-mono text-[10px] tracking-wider uppercase border transition-all duration-300",
        variantStyles[variant]
      )}
    >
      {label}
    </span>
  );
}
