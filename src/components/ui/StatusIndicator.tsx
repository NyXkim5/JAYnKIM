import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "active" | "deployed" | "archived" | "in-progress";
  label: string;
}

const statusColors = {
  active: "bg-accent-green",
  deployed: "bg-accent-blue",
  archived: "bg-text-tertiary",
  "in-progress": "bg-accent-amber",
};

const statusGlow = {
  active: "shadow-[0_0_6px_rgba(34,197,94,0.6)]",
  deployed: "shadow-[0_0_6px_rgba(14,165,233,0.6)]",
  archived: "",
  "in-progress": "shadow-[0_0_6px_rgba(245,158,11,0.6)]",
};

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {status !== "archived" && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              statusColors[status]
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            statusColors[status],
            statusGlow[status]
          )}
        />
      </span>
      <span className="font-mono text-[10px] tracking-wider uppercase text-text-secondary">
        {label}
      </span>
    </div>
  );
}
