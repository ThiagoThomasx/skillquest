"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, type AppTheme } from "@/stores/useUIStore";

interface ThemeOptionCardProps {
  name: string;
  themeKey: AppTheme;
  colors: string[];
  description: string;
}

export function ThemeOptionCard({ name, themeKey, colors, description }: ThemeOptionCardProps) {
  const { theme, setTheme } = useUIStore();
  const active = theme === themeKey;

  return (
    <div
      onClick={() => setTheme(themeKey)}
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
        <p className={cn("text-sm font-semibold", active ? "text-blue" : "text-text")}>
          {name}
        </p>
        {active && (
          <div className="w-5 h-5 rounded-full bg-blue flex items-center justify-center">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      <p className={cn("text-[10px] mt-0.5", active ? "text-blue/70" : "text-text-muted")}>
        {description}
      </p>
    </div>
  );
}
