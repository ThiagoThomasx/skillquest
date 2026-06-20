import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max?: number;
  variant?: "blue" | "amber" | "emerald" | "sky" | "rose";
  size?: "xs" | "sm" | "md";
  showLabel?: boolean;
  className?: string;
};

const trackColors = {
  blue: "bg-blue/10",
  amber: "bg-amber/10",
  emerald: "bg-emerald/10",
  sky: "bg-sky/10",
  rose: "bg-rose/10",
};

const fillColors = {
  blue: "bg-blue",
  amber: "bg-amber",
  emerald: "bg-emerald",
  sky: "bg-sky",
  rose: "bg-rose",
};

const heights = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-1.5",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "blue",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("flex-1 rounded-full overflow-hidden", heights[size], trackColors[variant])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", fillColors[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-muted tabular-nums w-10 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
