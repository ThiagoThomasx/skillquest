"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Star, Zap, Flame, Trophy, Lock, Award, Crown,
  Shield, Sword, Code, MapPin, Search,
} from "lucide-react";
import { useBadgesStore } from "@/stores/badges-store";
import { BADGE_DEFINITIONS } from "@/engines/badge-engine";

type Rarity = "common" | "rare" | "epic" | "legendary";

const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bg: string; border: string; glow: string }> = {
  common:    { label: "Comum",    color: "text-text-muted", bg: "bg-surface-overlay", border: "border-border",      glow: "" },
  rare:      { label: "Raro",     color: "text-blue",       bg: "bg-blue/10",         border: "border-blue-border", glow: "shadow-[0_0_12px_rgba(59,130,246,0.2)]" },
  epic:      { label: "Épico",    color: "text-sky",        bg: "bg-sky/10",          border: "border-sky-border",  glow: "shadow-[0_0_16px_rgba(56,189,248,0.25)]" },
  legendary: { label: "Lendário", color: "text-amber",      bg: "bg-amber/10",        border: "border-amber-border",glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]" },
};

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Star, Flame, Trophy, Crown, Award, Shield, Sword, Code, MapPin, Zap,
};

const RARITIES: Array<"" | Rarity> = ["", "common", "rare", "epic", "legendary"];

const FILTER_LABELS: Record<string, string> = {
  "": "Todas", common: "Comum", rare: "Raro", epic: "Épico", legendary: "Lendário",
};

export default function BadgesPage() {
  const [rarityFilter, setRarityFilter] = useState<"" | Rarity>("");
  const [earnedFilter, setEarnedFilter] = useState<"all" | "earned" | "locked">("all");
  const [search, setSearch] = useState("");

  const { earned } = useBadgesStore();

  const badges = useMemo(() => {
    return BADGE_DEFINITIONS.map((def) => {
      const stored = earned.find((e) => e.id === def.id);
      return { ...def, isEarned: stored?.earned ?? false, earnedAt: stored?.earnedAt ?? null };
    }).filter((b) => {
      if (rarityFilter && b.rarity !== rarityFilter) return false;
      if (earnedFilter === "earned" && !b.isEarned) return false;
      if (earnedFilter === "locked" && b.isEarned) return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [earned, rarityFilter, earnedFilter, search]);

  const totalEarned = earned.filter((b) => b.earned).length;
  const totalXPFromBadges = BADGE_DEFINITIONS
    .filter((b) => earned.find((e) => e.id === b.id && e.earned))
    .reduce((sum, b) => sum + b.xpReward, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-raised via-surface to-surface-raised p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber/5 via-transparent to-sky/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-amber text-xs font-semibold uppercase tracking-widest mb-2">
            <Trophy size={13} />
            Salão de Conquistas
          </div>
          <h1 className="text-3xl font-bold text-text mb-3">Conquistas</h1>
          <div className="flex flex-wrap gap-4">
            {(["common", "rare", "epic", "legendary"] as Rarity[]).map((r) => {
              const count = earned.filter((b) => b.earned && BADGE_DEFINITIONS.find((d) => d.id === b.id)?.rarity === r).length;
              const total = BADGE_DEFINITIONS.filter((d) => d.rarity === r).length;
              const cfg = RARITY_CONFIG[r];
              return (
                <div key={r} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                  <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-xs text-text-muted">{count}/{total}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-1 ml-auto">
              <Zap size={13} className="text-amber" />
              <span className="text-sm font-bold text-amber">+{totalXPFromBadges} XP conquistados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conquista..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface-raised border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-blue"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {RARITIES.map((r) => (
            <button
              key={r}
              onClick={() => setRarityFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                rarityFilter === r ? "bg-blue text-white" : "bg-surface-raised border border-border text-text-muted hover:text-text"
              }`}
            >
              {FILTER_LABELS[r]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {(["all", "earned", "locked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setEarnedFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                earnedFilter === f ? "bg-emerald text-white" : "bg-surface-raised border border-border text-text-muted hover:text-text"
              }`}
            >
              {f === "all" ? "Todas" : f === "earned" ? "Desbloqueadas" : "Bloqueadas"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-text-muted">{totalEarned} de {BADGE_DEFINITIONS.length} conquistadas</p>

      {/* Grid */}
      {badges.length === 0 ? (
        <div className="text-center py-16">
          <Award size={36} className="text-text-dim mx-auto mb-3" />
          <p className="text-sm font-semibold text-text">Nenhuma conquista encontrada</p>
          <p className="text-xs text-text-muted mt-1">Tente outro filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((b) => {
            const cfg = RARITY_CONFIG[b.rarity as Rarity];
            const Icon = ICON_MAP[b.icon] ?? Star;
            return (
              <Card
                key={b.id}
                className={`p-4 transition-all ${b.isEarned ? cfg.glow : "opacity-60"}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${b.isEarned ? `${cfg.bg} ${cfg.border}` : "bg-surface-overlay border-border"}`}>
                    {b.isEarned ? (
                      <Icon size={20} className={cfg.color} />
                    ) : (
                      <Lock size={18} className="text-text-dim" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-text">{b.title}</p>
                      <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-text-muted">{b.isEarned ? b.description : b.howToUnlock}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Zap size={10} className="text-amber" />
                        <span className="text-xs font-bold text-amber">+{b.xpReward} XP</span>
                      </div>
                      {b.isEarned && b.earnedAt && (
                        <span className="text-[10px] text-text-dim">
                          {new Date(b.earnedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
