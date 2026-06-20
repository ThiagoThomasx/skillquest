"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Award,
  User,
  Settings,
  TrendingUp,
  Zap,
  Flame,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paths", label: "Trilhas", icon: BookOpen },
  { href: "/missions", label: "Missões", icon: Target },
  { href: "/badges", label: "Conquistas", icon: Award },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-surface min-h-screen overflow-y-auto">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue/10 border border-blue-border">
          <TrendingUp size={15} className="text-blue" />
        </div>
        <div>
          <p className="text-sm font-bold text-text leading-none tracking-tight">SkillQuest</p>
          <p className="text-[10px] text-text-muted mt-0.5">Level up your career</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-3 shrink-0">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue/10 text-blue border border-blue/10"
                  : "text-text-muted hover:text-text hover:bg-surface-raised border border-transparent"
              )}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Cards de Jornada */}
      <div className="px-3 pb-2 space-y-2">

        {/* Sua Jornada */}
        <div className="rounded-xl bg-surface-raised border border-border p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">
            Sua Jornada
          </p>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue to-blue/40 flex items-center justify-center text-sm font-bold text-white shrink-0">
              TT
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text truncate">Thiago Thomas</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-blue font-semibold">Nível 7</span>
                <span className="text-text-dim text-[10px]">·</span>
                <span className="text-[10px] text-text-muted">Frontend Dev</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Zap size={10} className="text-amber" />
                <span className="text-[11px] font-semibold text-amber">2.450 XP</span>
              </div>
              <span className="text-[10px] text-text-muted">/ 3.000</span>
            </div>
            <ProgressBar value={2450} max={3000} variant="amber" size="sm" />
            <p className="text-[10px] text-text-muted">550 XP para o Nível 8</p>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-xl bg-surface-raised border border-border p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose/10 border border-rose-border flex items-center justify-center shrink-0">
            <Flame size={14} className="text-rose" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-text">7</span>
              <span className="text-[11px] text-text-muted">dias seguidos</span>
            </div>
            <p className="text-[10px] text-text-muted">Recorde: 14 dias</p>
          </div>
        </div>

        {/* Próxima Recompensa */}
        <div className="rounded-xl bg-surface-raised border border-border p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Star size={11} className="text-amber" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Próxima Recompensa
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber/10 border border-amber-border flex items-center justify-center shrink-0">
              <Award size={13} className="text-amber" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text truncate">TypeScript Expert</p>
              <p className="text-[10px] text-text-muted">550 XP restantes</p>
            </div>
          </div>
        </div>

        {/* Desafio Diário */}
        <div className="rounded-xl bg-blue/5 border border-blue/15 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Target size={11} className="text-blue" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Desafio Diário
            </p>
          </div>
          <p className="text-xs font-medium text-text mb-1.5">Complete uma missão hoje</p>
          <div className="flex items-center gap-1">
            <Zap size={10} className="text-amber" />
            <span className="text-[10px] font-semibold text-amber">Bônus 2× XP</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-3 py-3 border-t border-border shrink-0">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-raised cursor-pointer transition-colors text-text-muted hover:text-text"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue to-blue/40 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            TT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text truncate">Thiago Thomas</p>
            <p className="text-[10px] text-text-muted">Ver configurações</p>
          </div>
          <Settings size={12} className="shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
