"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, TrendingUp, Zap } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { useProgressStore } from "@/stores/progress-store";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/paths": "Trilhas de Aprendizado",
  "/missions": "Missões",
  "/badges": "Conquistas",
  "/profile": "Perfil",
  "/settings": "Configurações",
  "/knowledge": "Conhecimento",
  "/library": "Biblioteca",
  "/history": "Histórico",
  "/review": "Revisões",
  "/projects": "Projetos",
  "/portfolio": "Portfólio",
};

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "SkillQuest";
  const openSearch = useUIStore((s) => s.openCommandPalette);
  const totalXP = useProgressStore((s) => s.totalXP);

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
        {/* Search button */}
        <button
          type="button"
          onClick={openSearch}
          className="flex items-center gap-2 h-8 rounded-lg text-text-muted hover:text-text hover:bg-surface-raised transition-colors px-2"
          aria-label="Abrir busca global (Ctrl+K)"
          title="Busca global (Ctrl+K)"
        >
          <Search size={14} />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-surface-raised text-text-muted border border-border font-mono leading-none">
            Ctrl K
          </kbd>
        </button>

        <button
          type="button"
          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text hover:bg-surface-raised transition-colors"
          aria-label="Notificações"
        >
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue" />
        </button>

        {/* XP chip — live from store */}
        <div className="flex items-center gap-1 ml-1 px-2 py-1 rounded-lg bg-amber/10 border border-amber-border">
          <Zap size={11} className="text-amber" />
          <span className="text-xs font-semibold text-amber tabular-nums">
            {totalXP.toLocaleString("pt-BR")}
            <span className="hidden sm:inline"> XP</span>
          </span>
        </div>
      </div>
    </header>
  );
}
