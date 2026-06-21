"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, Target, Award, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/explore", label: "Explorar", icon: Compass },
  { href: "/missions", label: "Missões", icon: Target },
  { href: "/badges", label: "Conquistas", icon: Award },
  { href: "/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 h-14 flex items-center border-t border-border bg-surface/95 backdrop-blur-md px-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-colors",
              active ? "text-blue" : "text-text-muted"
            )}
          >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
