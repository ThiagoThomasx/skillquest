"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, RefreshCw, Award, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReviewStore } from "@/stores/review-store";

export function BottomNav() {
  const pathname = usePathname();
  const { getOverdue, getToday } = useReviewStore();
  const reviewCount = getOverdue().length + getToday().length;

  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard, badge: 0 },
    { href: "/missions", label: "Missões", icon: Target, badge: 0 },
    { href: "/review", label: "Revisões", icon: RefreshCw, badge: reviewCount },
    { href: "/badges", label: "Conquistas", icon: Award, badge: 0 },
    { href: "/profile", label: "Perfil", icon: User, badge: 0 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 h-16 flex items-center border-t border-border bg-surface/95 backdrop-blur-md px-1">
      {navItems.map(({ href, label, icon: Icon, badge }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors relative",
              active ? "text-blue" : "text-text-muted"
            )}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-amber text-[9px] font-bold text-white px-1 leading-none">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
