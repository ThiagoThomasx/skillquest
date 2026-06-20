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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border bg-surface min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-12 border-b border-border">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue text-white">
          <TrendingUp size={13} />
        </div>
        <span className="font-semibold text-text tracking-tight text-sm">SkillQuest</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue/10 text-blue"
                  : "text-text-muted hover:text-text hover:bg-surface-raised"
              )}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-2 py-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-raised cursor-pointer transition-colors">
          <div className="w-6 h-6 rounded-full bg-blue flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            T
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text truncate">Thiago Thomas</p>
            <p className="text-[11px] text-text-muted">Nível 7 · 2.450 XP</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
