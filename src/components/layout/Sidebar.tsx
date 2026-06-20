"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Sword,
  Shield,
  User,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paths", label: "Trilhas", icon: Map },
  { href: "/missions", label: "Missões", icon: Sword },
  { href: "/badges", label: "Insígnias", icon: Shield },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/settings", label: "Config.", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-surface min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet/20 border border-violet-border">
          <Zap size={14} className="text-violet" />
        </div>
        <span className="font-semibold text-text tracking-tight">SkillQuest</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-violet/10 text-violet border border-violet-border"
                  : "text-text-muted hover:text-text hover:bg-surface-raised"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User stub */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-raised cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-violet/20 border border-violet-border flex items-center justify-center text-xs font-bold text-violet">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">Aventureiro</p>
            <p className="text-xs text-text-muted">Nível 7</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
