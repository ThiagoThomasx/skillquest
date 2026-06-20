import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max?: number;
  variant?: "violet" | "gold" | "emerald";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
};

const trackColors = {
  violet: "bg-violet/10",
  gold: "bg-gold/10",
  emerald: "bg-emerald/10",
};

const fillColors = {
  violet: "bg-violet",
  gold: "bg-gold",
  emerald: "bg-emerald",
};

const heights = {
  sm: "h-1",
  md: "h-2",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "violet",
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
