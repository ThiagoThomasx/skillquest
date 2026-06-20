import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  title: string;
  icon: LucideIcon;
  rarity?: "common" | "rare" | "epic" | "legendary";
  earned?: boolean;
}

const rarityStyles = {
  common: { icon: "text-text-muted", bg: "bg-surface-raised border-border" },
  rare: { icon: "text-blue", bg: "bg-blue/10 border-blue/20" },
  epic: { icon: "text-sky", bg: "bg-sky/10 border-sky/20" },
  legendary: { icon: "text-amber", bg: "bg-amber/10 border-amber/25" },
};

export function BadgeCard({ title, icon: Icon, rarity = "common", earned = true }: BadgeCardProps) {
  const styles = rarityStyles[rarity];
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
        earned ? styles.bg : "bg-surface-raised border-border opacity-50"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          earned ? styles.bg : "bg-surface border-border"
        )}
      >
        <Icon size={18} className={earned ? styles.icon : "text-text-dim"} />
      </div>
      <p className={cn("text-[11px] font-semibold text-center leading-tight", earned ? "text-text" : "text-text-dim")}>
        {title}
      </p>
    </div>
  );
}
