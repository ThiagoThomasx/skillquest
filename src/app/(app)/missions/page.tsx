"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Target, Clock, Zap, CheckCircle2, Skull, Sword,
  Star, BookOpen, Filter, Search, ChevronRight,
  Trophy, Flame, ArrowRight, Lock,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const quests = [
  {
    id: 1,
    title: "React Hooks na Prática",
    description: "Domine useState, useEffect, useCallback e useMemo em projetos reais. A arte dos Hooks aguarda.",
    category: "Main Quest",
    path: "React Avançado",
    xp: 200,
    time: "45 min",
    progress: 65,
    status: "active" as const,
    difficulty: "Médio" as const,
    objectives: ["Implementar useState para estado local", "Usar useEffect com cleanup", "Otimizar com useCallback"],
    rewards: ["200 XP", "Badge: Hook Master"],
    isMainQuest: true,
  },
  {
    id: 2,
    title: "Desafio Diário: CSS Grid Épico",
    description: "Complete o layout de grid em 15 minutos para ganhar bônus de XP duplo. Tempo é tudo, aventureiro.",
    category: "Side Quest",
    path: "CSS Moderno",
    xp: 250,
    time: "15 min",
    progress: 0,
    status: "available" as const,
    difficulty: "Fácil" as const,
    objectives: ["Criar layout 3 colunas", "Adicionar responsividade"],
    rewards: ["250 XP (2×)", "Streak +1"],
    isDaily: true,
  },
  {
    id: 3,
    title: "Next.js App Router",
    description: "Explore as rotas paralelas, interceptadas e layouts aninhados do App Router moderno.",
    category: "Main Quest",
    path: "React Avançado",
    xp: 175,
    time: "50 min",
    progress: 30,
    status: "active" as const,
    difficulty: "Difícil" as const,
    objectives: ["Configurar layouts aninhados", "Implementar loading states", "Usar route handlers"],
    rewards: ["175 XP"],
    isMainQuest: false,
  },
  {
    id: 4,
    title: "Tipagem Avançada TypeScript",
    description: "Generics, utility types e conditional types. Transforme-se no mestre da tipagem.",
    category: "Main Quest",
    path: "TypeScript Mestre",
    xp: 150,
    time: "30 min",
    progress: 0,
    status: "available" as const,
    difficulty: "Fácil" as const,
    objectives: ["Criar generic functions", "Usar utility types (Pick, Omit)"],
    rewards: ["150 XP"],
    isMainQuest: false,
  },
  {
    id: 5,
    title: "Context API vs Zustand",
    description: "Compare as duas abordagens de gerenciamento de estado e descubra quando usar cada uma.",
    category: "Side Quest",
    path: "Frontend",
    xp: 250,
    time: "60 min",
    progress: 0,
    status: "available" as const,
    difficulty: "Avançado" as const,
    objectives: ["Implementar Context API", "Migrar para Zustand", "Benchmarcar performance"],
    rewards: ["250 XP", "Badge: State Wizard"],
    isMainQuest: false,
  },
  {
    id: 6,
    title: "O Arquimago das APIs — Boss Battle",
    description: "A batalha final da Questline Frontend. Construa uma aplicação completa do zero para provar seu valor.",
    category: "Boss Quest",
    path: "React Avançado",
    xp: 500,
    time: "120 min",
    progress: 0,
    status: "locked" as const,
    difficulty: "Lendário" as const,
    objectives: ["Construir app completo", "Integrar API REST", "Deploy em produção"],
    rewards: ["500 XP", "Badge: API Slayer", "Título: Mago Frontend"],
    isMainQuest: false,
    isBoss: true,
  },
  {
    id: 7,
    title: "Variáveis CSS e Temas",
    description: "Sistema de design com CSS custom properties. Já completado com maestria.",
    category: "Side Quest",
    path: "CSS Moderno",
    xp: 100,
    time: "20 min",
    progress: 100,
    status: "completed" as const,
    difficulty: "Fácil" as const,
    objectives: ["Criar sistema de cores", "Implementar dark mode"],
    rewards: ["100 XP"],
    isMainQuest: false,
  },
  {
    id: 8,
    title: "Otimização com useMemo",
    description: "Performance React com memoização avançada.",
    category: "Main Quest",
    path: "React Avançado",
    xp: 175,
    time: "35 min",
    progress: 100,
    status: "completed" as const,
    difficulty: "Médio" as const,
    objectives: ["Identificar gargalos", "Aplicar useMemo e useCallback"],
    rewards: ["175 XP"],
    isMainQuest: false,
  },
];

const difficultyConfig: Record<string, { variant: "blue" | "amber" | "rose" | "sky"; label: string }> = {
  Fácil: { variant: "blue", label: "Fácil" },
  Médio: { variant: "amber", label: "Médio" },
  Difícil: { variant: "rose", label: "Difícil" },
  Avançado: { variant: "rose", label: "Avançado" },
  Lendário: { variant: "sky", label: "Lendário" },
};

const categoryConfig: Record<string, { icon: React.FC<{ size?: number; className?: string }>; label: string; color: string }> = {
  "Main Quest": { icon: Target, label: "Main Quest", color: "text-blue" },
  "Side Quest": { icon: BookOpen, label: "Side Quest", color: "text-amber" },
  "Boss Quest": { icon: Skull, label: "Boss Battle", color: "text-rose" },
};

const FILTERS = ["Todas", "Ativas", "Disponíveis", "Concluídas", "Boss"];

// ── Quest Card ────────────────────────────────────────────────────────────────

function QuestCard({ q, expanded, onToggle }: {
  q: typeof quests[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  const CatIcon = categoryConfig[q.category]?.icon ?? Target;
  const catColor = categoryConfig[q.category]?.color ?? "text-blue";
  const diff = difficultyConfig[q.difficulty];
  const isBoss = "isBoss" in q && q.isBoss;
  const isCompleted = q.status === "completed";
  const isActive = q.status === "active";
  const isLocked = q.status === "locked";

  return (
    <Card
      hoverable={!isLocked}
      className={`overflow-hidden transition-all ${
        isBoss ? "border-rose/30 bg-gradient-to-r from-rose/5 via-surface to-surface" :
        isActive ? "border-blue/20" :
        isCompleted ? "border-emerald/10 opacity-70" : ""
      }`}
    >
      <div className="p-4 lg:p-5">
        <div className="flex items-start gap-4">
          {/* Status icon */}
          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
            isCompleted ? "bg-emerald/10 border-emerald-border" :
            isBoss ? "bg-rose/10 border-rose-border" :
            isActive ? "bg-blue/10 border-blue-border" :
            isLocked ? "bg-surface-overlay border-border" :
            "bg-surface-overlay border-border"
          }`}>
            {isCompleted ? <CheckCircle2 size={18} className="text-emerald" /> :
             isBoss ? <Skull size={18} className="text-rose" /> :
             isLocked ? <Lock size={18} className="text-text-dim" /> :
             <CatIcon size={18} className={catColor} />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {q.isMainQuest && <Badge variant="blue">Main Quest</Badge>}
                  {"isDaily" in q && q.isDaily && <Badge variant="amber">🔥 Diária 2×</Badge>}
                  {isBoss && <Badge variant="rose">⚔️ Boss</Badge>}
                </div>
                <h3 className="font-bold text-text">{q.title}</h3>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{q.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={diff.variant}>{diff.label}</Badge>
                {isCompleted && <Badge variant="emerald">Concluída</Badge>}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                {q.path}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {q.time}
              </span>
              <span className="flex items-center gap-1 text-amber font-semibold">
                <Zap size={11} className="text-amber" />
                {q.xp} XP
              </span>
            </div>

            {/* Progress */}
            {isActive && q.progress > 0 && (
              <div className="space-y-1">
                <ProgressBar value={q.progress} variant="blue" size="xs" showLabel />
              </div>
            )}

            {/* Expandable objectives */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onToggle}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
              >
                <ChevronRight size={12} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
                {expanded ? "Ocultar" : "Ver"} detalhes
              </button>

              <Button
                variant={isLocked ? "secondary" : isCompleted ? "ghost" : isBoss ? "amber" : isActive ? "primary" : "secondary"}
                size="sm"
                disabled={isLocked}
              >
                {isCompleted ? "Revisar" :
                 isLocked ? <><Lock size={12} />Bloqueada</> :
                 isActive ? <>Continuar <ArrowRight size={12} /></> :
                 "Iniciar Quest"}
              </Button>
            </div>

            {/* Expanded details */}
            {expanded && (
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border mt-2">
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Objetivos</p>
                  <ul className="space-y-1.5">
                    {q.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                        <div className="w-1 h-1 rounded-full bg-blue mt-1.5 shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Recompensas</p>
                  <ul className="space-y-1.5">
                    {q.rewards.map((reward, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-amber font-medium">
                        <Star size={10} className="text-amber shrink-0" />
                        {reward}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MissionsPage() {
  const [filter, setFilter] = useState("Todas");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = quests.filter((q) => {
    if (filter === "Ativas") return q.status === "active";
    if (filter === "Disponíveis") return q.status === "available";
    if (filter === "Concluídas") return q.status === "completed";
    if (filter === "Boss") return "isBoss" in q && q.isBoss;
    return true;
  });

  const activeCount = quests.filter((q) => q.status === "active").length;
  const completedCount = quests.filter((q) => q.status === "completed").length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-raised via-surface to-surface-raised p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue/5 via-transparent to-rose/5 pointer-events-none" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue text-xs font-semibold uppercase tracking-widest mb-2">
              <Sword size={13} />
              Sala de Quests
            </div>
            <h1 className="text-3xl font-bold text-text mb-1">Missões</h1>
            <p className="text-text-muted text-sm">
              <span className="text-blue font-medium">{activeCount} em andamento</span>
              {" · "}
              <span className="text-emerald font-medium">{completedCount} concluídas</span>
              {" · "}
              <span className="text-text-muted">{quests.length} no total</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-amber/10 border border-amber-border flex items-center gap-1.5">
              <Flame size={13} className="text-amber" />
              <span className="text-xs font-semibold text-amber">Bônus Diário Ativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? "bg-blue text-white"
                : "bg-surface-raised border border-border text-text-muted hover:text-text"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Quest list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">
            Nenhuma quest nesta categoria.
          </div>
        )}
        {filtered.map((q) => (
          <QuestCard
            key={q.id}
            q={q}
            expanded={expandedId === q.id}
            onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
          />
        ))}
      </div>
    </div>
  );
}
