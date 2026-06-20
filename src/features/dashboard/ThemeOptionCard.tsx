import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeOptionCardProps {
  name: string;
  colors: string[];
  active?: boolean;
}

export function ThemeOptionCard({ name, colors, active = false }: ThemeOptionCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 cursor-pointer transition-all",
        active
          ? "bg-blue/5 border-blue/30"
          : "bg-surface-raised border-border hover:border-border-strong"
      )}
    >
      {/* Color preview */}
      <div className="rounded-lg overflow-hidden mb-3 h-16 flex gap-px">
        {colors.map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-sm font-semibold",
            active ? "text-blue" : "text-text"
          )}
        >
          {name}
        </p>
        {active && (
          <div className="w-5 h-5 rounded-full bg-blue flex items-center justify-center">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {active && (
        <p className="text-[10px] text-text-muted mt-0.5">Tema ativo</p>
      )}
    </div>
  );
}
