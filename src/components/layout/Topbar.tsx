"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Zap } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/paths": "Trilhas de Aprendizado",
  "/missions": "Missões",
  "/badges": "Insígnias",
  "/profile": "Perfil",
  "/settings": "Configurações",
};

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "SkillQuest";

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-surface shrink-0">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet/20 border border-violet-border">
          <Zap size={14} className="text-violet" />
        </div>
        <span className="font-semibold text-text tracking-tight">SkillQuest</span>
      </div>

      {/* Desktop title */}
      <h1 className="hidden lg:block text-base font-semibold text-text">{title}</h1>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="flex items-center justify-center w-9 h-9 rounded-lg text-text-muted hover:text-text hover:bg-surface-raised transition-colors">
          <Search size={16} />
        </button>
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg text-text-muted hover:text-text hover:bg-surface-raised transition-colors">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet" />
        </button>

        {/* XP chip */}
        <div className="hidden sm:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold-border">
          <Zap size={12} className="text-gold" />
          <span className="text-xs font-semibold text-gold">2.450 XP</span>
        </div>
      </div>
    </header>
  );
}
