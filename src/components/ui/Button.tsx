import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
  onClick?: () => void;
}

const variants = {
  primary:
    "border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
  ghost:
    "border-transparent text-text-secondary hover:border-border-hover hover:text-text-primary",
};

export function Button({
  children,
  variant = "primary",
  href,
  className,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-2 px-5 py-2.5 rounded font-mono text-xs tracking-wider uppercase border transition-all duration-300",
    variants[variant],
    className
  );

  if (href) {
    return (
      <a href={href} className={classes} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
