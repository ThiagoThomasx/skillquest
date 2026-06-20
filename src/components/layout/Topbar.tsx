"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, TrendingUp, Zap } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/paths": "Trilhas de Aprendizado",
  "/missions": "Missões",
  "/badges": "Conquistas",
  "/profile": "Perfil",
  "/settings": "Configurações",
};

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "SkillQuest";

  return (
    <header className="h-12 flex items-center justify-between px-4 lg:px-5 border-b border-border bg-surface shrink-0">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue text-white">
          <TrendingUp size={13} />
        </div>
        <span className="font-semibold text-text tracking-tight text-sm">SkillQuest</span>
      </div>

      {/* Desktop title */}
      <h1 className="hidden lg:block text-sm font-semibold text-text">{title}</h1>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text hover:bg-surface-raised transition-colors">
          <Search size={14} />
        </button>
        <button className="relative flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text hover:bg-surface-raised transition-colors">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue" />
        </button>

        {/* XP chip */}
        <div className="hidden sm:flex items-center gap-1.5 ml-1.5 px-2.5 py-1 rounded-lg bg-amber/10 border border-amber-border">
          <Zap size={11} className="text-amber" />
          <span className="text-xs font-semibold text-amber">2.450 XP</span>
        </div>
      </div>
    </header>
  );
}
