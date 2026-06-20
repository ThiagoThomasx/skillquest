"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Star, Zap, Flame, Trophy, Lock, Award, Crown,
  Search, Filter, Shield, Sword, BookOpen, Target,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

type Rarity = "common" | "rare" | "epic" | "legendary";

const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bg: string; border: string; glow: string }> = {
  common: {
    label: "Comum",
    color: "text-text-muted",
    bg: "bg-surface-overlay",
    border: "border-border",
    glow: "",
  },
  rare: {
    label: "Raro",
    color: "text-blue",
    bg: "bg-blue/10",
    border: "border-blue-border",
    glow: "shadow-[0_0_12px_rgba(59,130,246,0.2)]",
  },
  epic: {
    label: "Épico",
    color: "text-sky",
    bg: "bg-sky/10",
    border: "border-sky-border",
    glow: "shadow-[0_0_16px_rgba(56,189,248,0.25)]",
  },
  legendary: {
    label: "Lendário",
    color: "text-amber",
    bg: "bg-amber/10",
    border: "border-amber-border",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  },
};

const allBadges = [
  {
    id: 1,
    title: "Primeiro Passo",
    description: "Completou sua primeira missão.",
    howToUnlock: "Complete qualquer missão.",
    icon: Star,
    rarity: "common" as Rarity,
    earned: true,
    date: "12 Jun 2026",
    xp: 50,
    category: "Progressão",
  },
  {
    id: 2,
    title: "Sequência de Fogo",
    description: "Manteve 7 dias consecutivos de estudo.",
    howToUnlock: "Estude por 7 dias seguidos.",
    icon: Flame,
    rarity: "rare" as Rarity,
    earned: true,
    date: "18 Jun 2026",
    xp: 150,
    category: "Dedicação",
  },
  {
    id: 3,
    title: "TypeScript Expert",
    description: "Completou toda a trilha TypeScript.",
    howToUnlock: "Complete todas as missões de TypeScript.",
    icon: Zap,
    rarity: "epic" as Rarity,
    earned: true,
    date: "15 Jun 2026",
    xp: 300,
    category: "Trilhas",
  },
  {
    id: 4,
    title: "Campeão Frontend",
    description: "Completou integralmente a trilha de Frontend.",
    howToUnlock: "Finalize a Questline Desenvolvedor Frontend.",
    icon: Trophy,
    rarity: "epic" as Rarity,
    earned: false,
    date: null,
    xp: 400,
    category: "Trilhas",
  },
  {
    id: 5,
    title: "Precisão Perfeita",
    description: "Zero erros em 10 missões consecutivas.",
    howToUnlock: "Complete 10 missões seguidas sem erros.",
    icon: Target,
    rarity: "rare" as Rarity,
    earned: false,
    date: null,
    xp: 200,
    category: "Habilidade",
  },
  {
    id: 6,
    title: "Guardião do Código",
    description: "Ajudou 5 outros aventureiros em suas jornadas.",
    howToUnlock: "Complete 5 desafios colaborativos.",
    icon: Shield,
    rarity: "rare" as Rarity,
    earned: false,
    date: null,
    xp: 175,
    category: "Social",
  },
  {
    id: 7,
    title: "Mestre das Artes",
    description: "Completou missões em 4 trilhas diferentes.",
    howToUnlock: "Tenha progresso em pelo menos 4 Questlines.",
    icon: BookOpen,
    rarity: "epic" as Rarity,
    earned: false,
    date: null,
    xp: 350,
    category: "Diversidade",
  },
  {
    id: 8,
    title: "O Lendário",
    description: "Alcançou o nível máximo. Poucos chegaram até aqui.",
    howToUnlock: "Alcance o Nível 20.",
    icon: Crown,
    rarity: "legendary" as Rarity,
    earned: false,
    date: null,
    xp: 1000,
    category: "Progressão",
  },
  {
    id: 9,
    title: "Caçador de Bosses",
    description: "Derrotou seu primeiro boss em uma Questline.",
    howToUnlock: "Conclua qualquer Boss Battle.",
    icon: Sword,
    rarity: "legendary" as Rarity,
    earned: false,
    date: null,
    xp: 750,
    category: "Combate",
  },
  {
    id: 10,
    title: "Explorador",
    description: "Desbloqueou uma nova Questline.",
    howToUnlock: "Desbloqueie qualquer Questline adicional.",
    icon: Award,
    rarity: "common" as Rarity,
    earned: false,
    date: null,
    xp: 75,
    category: "Progressão",
  },
];

const RARITIES: Array<Rarity | "all"> = ["all", "common", "rare", "epic", "legendary"];
const CATEGORIES = ["Todas", ...Array.from(new Set(allBadges.map((b) => b.category)))];

// ── Badge Card ────────────────────────────────────────────────────────────────

function BadgeCard({ b, selected, onSelect }: {
  b: typeof allBadges[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const r = RARITY_CONFIG[b.rarity];
  const Icon = b.icon;

  return (
    <button
      onClick={onSelect}
      className={`text-left w-full transition-all duration-200 ${!b.earned ? "opacity-50 hover:opacity-70" : ""}`}
    >
      <Card
        hoverable={b.earned}
        className={`p-4 h-full flex flex-col gap-3 transition-all ${
          selected ? `${r.border} ${r.glow}` : ""
        } ${b.rarity === "legendary" && b.earned ? r.glow : ""}`}
      >
        {/* Icon + Rarity */}
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${r.bg} ${r.border} ${
            b.earned && b.rarity !== "common" ? r.glow : ""
          }`}>
            {b.earned ? (
              <Icon size={22} className={r.color} />
            ) : (
              <Lock size={18} className="text-text-dim" />
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${r.bg} ${r.border} ${r.color}`}>
              {r.label}
            </span>
            {b.earned && (
              <span className="flex items-center gap-0.5 text-xs text-amber font-medium">
                <Zap size={10} className="text-amber" />
                +{b.xp} XP
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-semibold text-sm text-text">{b.title}</p>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            {b.earned ? b.description : b.howToUnlock}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <span className="text-xs text-text-dim">{b.category}</span>
          {b.earned && b.date ? (
            <Badge variant="emerald" className="text-xs">{b.date}</Badge>
          ) : (
            <span className="text-xs text-text-dim">Bloqueado</span>
          )}
        </div>
      </Card>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BadgesPage() {
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showEarned, setShowEarned] = useState<"all" | "earned" | "locked">("all");

  const earned = allBadges.filter((b) => b.earned);
  const totalXP = earned.reduce((sum, b) => sum + b.xp, 0);

  const filtered = useMemo(() => {
    return allBadges.filter((b) => {
      if (rarityFilter !== "all" && b.rarity !== rarityFilter) return false;
      if (categoryFilter !== "Todas" && b.category !== categoryFilter) return false;
      if (showEarned === "earned" && !b.earned) return false;
      if (showEarned === "locked" && b.earned) return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [rarityFilter, categoryFilter, search, showEarned]);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-amber/20 bg-gradient-to-br from-amber/10 via-surface to-surface-raised p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-amber text-xs font-semibold uppercase tracking-widest mb-3">
            <Trophy size={14} />
            Salão da Fama
          </div>
          <h1 className="text-3xl font-bold text-text mb-1">Conquistas</h1>
          <p className="text-text-muted text-sm mb-5">Seus troféus de batalha. Cada um conta uma história.</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {(["common", "rare", "epic", "legendary"] as Rarity[]).map((r) => {
              const count = earned.filter((b) => b.rarity === r).length;
              const total = allBadges.filter((b) => b.rarity === r).length;
              const cfg = RARITY_CONFIG[r];
              return (
                <div key={r} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                  <span className={`text-sm font-bold ${cfg.color}`}>{count}/{total}</span>
                  <span className="text-xs text-text-muted">{cfg.label}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-border bg-amber/10">
              <Zap size={14} className="text-amber" />
              <span className="text-sm font-bold text-amber">{totalXP.toLocaleString()} XP</span>
              <span className="text-xs text-text-muted">de conquistas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conquistas..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-raised border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Rarity filter */}
          {RARITIES.map((r) => {
            const cfg = r === "all" ? null : RARITY_CONFIG[r];
            return (
              <button
                key={r}
                onClick={() => setRarityFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  rarityFilter === r
                    ? r === "all" ? "bg-blue text-white border-blue" : `${cfg!.bg} ${cfg!.color} ${cfg!.border}`
                    : "bg-surface-raised border-border text-text-muted hover:text-text"
                }`}
              >
                {r === "all" ? "Todas raridades" : cfg!.label}
              </button>
            );
          })}
          <div className="w-px bg-border mx-1" />
          {["all", "earned", "locked"].map((s) => (
            <button
              key={s}
              onClick={() => setShowEarned(s as "all" | "earned" | "locked")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                showEarned === s
                  ? "bg-blue text-white border-blue"
                  : "bg-surface-raised border-border text-text-muted hover:text-text"
              }`}
            >
              {s === "all" ? "Todas" : s === "earned" ? "Conquistadas" : "Bloqueadas"}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                categoryFilter === c
                  ? "bg-surface-overlay text-text border border-border-strong"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-text-muted text-sm">
            Nenhuma conquista encontrada.
          </div>
        )}
        {filtered.map((b) => (
          <BadgeCard
            key={b.id}
            b={b}
            selected={selectedId === b.id}
            onSelect={() => setSelectedId(selectedId === b.id ? null : b.id)}
          />
        ))}
      </div>
    </div>
  );
}
