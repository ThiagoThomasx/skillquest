"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  BookOpen, Lock, CheckCircle, Zap, Star, Skull, Map,
  ChevronRight, Swords, Shield, Crown, Sparkles, Trophy,
  Clock, Target, ArrowRight, Flame,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const questlines = [
  {
    id: 1,
    title: "Desenvolvedor Frontend",
    description: "Domine React, TypeScript e o ecossistema moderno de frontend. Uma jornada épica pela arte do código visual.",
    class: "Frontend Mage",
    classIcon: Sparkles,
    recommendedLevel: 5,
    progress: 45,
    xpTotal: 4800,
    xpEarned: 2160,
    missions: 24,
    missionsCompleted: 11,
    status: "active" as const,
    boss: "Arquimago das APIs",
    bossDefeated: false,
    tags: ["React", "TypeScript", "CSS", "Next.js"],
    color: "blue" as const,
    chapters: [
      { name: "Fundamentos React", missions: 6, completed: 6, status: "done" },
      { name: "Hooks Avançados", missions: 6, completed: 5, status: "active" },
      { name: "TypeScript Mestre", missions: 6, completed: 0, status: "locked" },
      { name: "Batalha Final", missions: 6, completed: 0, status: "locked" },
    ],
  },
  {
    id: 2,
    title: "Fundamentos Web",
    description: "HTML, CSS e JavaScript — a trilogia sagrada. A pedra fundamental de todo aventureiro digital.",
    class: "Artesão Web",
    classIcon: Shield,
    recommendedLevel: 1,
    progress: 100,
    xpTotal: 3200,
    xpEarned: 3200,
    missions: 16,
    missionsCompleted: 16,
    status: "completed" as const,
    boss: "O Dragão do DOM",
    bossDefeated: true,
    tags: ["HTML", "CSS", "JavaScript"],
    color: "emerald" as const,
    chapters: [
      { name: "HTML Semântico", missions: 4, completed: 4, status: "done" },
      { name: "CSS Moderno", missions: 4, completed: 4, status: "done" },
      { name: "JavaScript Core", missions: 4, completed: 4, status: "done" },
      { name: "O Dragão do DOM", missions: 4, completed: 4, status: "done" },
    ],
  },
  {
    id: 3,
    title: "Engenharia Backend",
    description: "APIs REST, bancos de dados, autenticação e arquitetura de sistemas. Para os corajosos que ousam enfrentar o servidor.",
    class: "Arquiteto de Sistemas",
    classIcon: Crown,
    recommendedLevel: 10,
    progress: 0,
    xpTotal: 6400,
    xpEarned: 0,
    missions: 32,
    missionsCompleted: 0,
    status: "locked" as const,
    boss: "O Deus do Banco de Dados",
    bossDefeated: false,
    tags: ["Node.js", "SQL", "Docker", "Auth"],
    color: "blue" as const,
    chapters: [
      { name: "APIs REST", missions: 8, completed: 0, status: "locked" },
      { name: "Banco de Dados", missions: 8, completed: 0, status: "locked" },
      { name: "Autenticação", missions: 8, completed: 0, status: "locked" },
      { name: "Arquitetura Final", missions: 8, completed: 0, status: "locked" },
    ],
  },
  {
    id: 4,
    title: "DevOps & Cloud",
    description: "CI/CD, containers, cloud e infraestrutura como código. O caminho do Senhor das Nuvens.",
    class: "Senhor das Nuvens",
    classIcon: Star,
    recommendedLevel: 15,
    progress: 0,
    xpTotal: 8000,
    xpEarned: 0,
    missions: 40,
    missionsCompleted: 0,
    status: "locked" as const,
    boss: "O Titã da Infraestrutura",
    bossDefeated: false,
    tags: ["Docker", "K8s", "AWS", "CI/CD"],
    color: "blue" as const,
    chapters: [],
  },
];

const recommended = questlines.filter((q) => q.status === "locked").slice(0, 2);

// ── Sub-components ────────────────────────────────────────────────────────────

function QuestlineCard({ q, expanded, onToggle }: {
  q: typeof questlines[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  const ClassIcon = q.classIcon;
  const isActive = q.status === "active";
  const isCompleted = q.status === "completed";
  const isLocked = q.status === "locked";

  const statusLabel = isCompleted ? "Concluída" : isActive ? "Ativa" : "Bloqueada";
  const statusVariant = isCompleted ? "emerald" : isActive ? "blue" : "default";

  return (
    <Card
      hoverable={!isLocked}
      className={`overflow-hidden transition-all duration-200 ${
        isActive ? "border-blue/30 ring-1 ring-blue/10" : ""
      } ${isCompleted ? "border-emerald/20" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
            isCompleted ? "bg-emerald/10 border-emerald-border" :
            isLocked ? "bg-surface-overlay border-border" :
            "bg-blue/10 border-blue-border"
          }`}>
            {isLocked ? <Lock size={20} className="text-text-dim" /> :
             isCompleted ? <CheckCircle size={20} className="text-emerald" /> :
             <ClassIcon size={20} className="text-blue" />}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-text text-base">{q.title}</h3>
                  {isActive && (
                    <span className="flex items-center gap-1 text-xs text-amber font-medium">
                      <Flame size={11} className="text-amber" />
                      Ativa
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{q.description}</p>
              </div>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Shield size={11} />
                Classe: <span className="text-text font-medium ml-1">{q.class}</span>
              </span>
              <span className="flex items-center gap-1">
                <Star size={11} />
                Nível {q.recommendedLevel}+
              </span>
              <span className="flex items-center gap-1">
                <Target size={11} />
                {q.missionsCompleted}/{q.missions} missões
              </span>
              <span className="flex items-center gap-1 text-amber font-medium">
                <Zap size={11} className="text-amber" />
                {q.xpEarned.toLocaleString()}/{q.xpTotal.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {q.tags.map((tag) => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>

        {/* Progress */}
        {!isLocked && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Progresso geral</span>
              <span className={isCompleted ? "text-emerald font-medium" : ""}>{q.progress}%</span>
            </div>
            <ProgressBar
              value={q.progress}
              variant={isCompleted ? "emerald" : "blue"}
              size="sm"
            />
          </div>
        )}

        {/* Boss */}
        <div className={`flex items-center justify-between p-3 rounded-lg border ${
          q.bossDefeated
            ? "bg-emerald/5 border-emerald/20"
            : isLocked
            ? "bg-surface-overlay border-border opacity-50"
            : "bg-rose/5 border-rose/20"
        }`}>
          <div className="flex items-center gap-2">
            <Skull size={14} className={q.bossDefeated ? "text-emerald" : isLocked ? "text-text-dim" : "text-rose"} />
            <span className="text-xs font-medium text-text">Boss Final: {q.boss}</span>
          </div>
          {q.bossDefeated ? (
            <Badge variant="emerald">Derrotado</Badge>
          ) : (
            <Badge variant={isLocked ? "default" : "rose"}>
              {isLocked ? "Bloqueado" : "Aguardando"}
            </Badge>
          )}
        </div>

        {/* Expandable chapters */}
        {q.chapters.length > 0 && (
          <>
            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
            >
              <Map size={12} />
              {expanded ? "Ocultar" : "Ver"} roadmap ({q.chapters.length} capítulos)
              <ChevronRight size={12} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>

            {expanded && (
              <div className="space-y-2 pt-1">
                {q.chapters.map((ch, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                    ch.status === "done" ? "bg-emerald/5 border-emerald/20" :
                    ch.status === "active" ? "bg-blue/5 border-blue/20" :
                    "bg-surface-overlay border-border opacity-60"
                  }`}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
                      ch.status === "done" ? "bg-emerald/20 text-emerald" :
                      ch.status === "active" ? "bg-blue/20 text-blue" :
                      "bg-surface-raised text-text-dim"
                    }`}>
                      {ch.status === "done" ? "✓" : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text">{ch.name}</p>
                      <p className="text-xs text-text-muted">{ch.completed}/{ch.missions} missões</p>
                    </div>
                    {ch.status === "active" && (
                      <div className="w-20">
                        <ProgressBar value={(ch.completed / ch.missions) * 100} variant="blue" size="xs" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Action */}
        <div className="flex justify-end pt-1">
          <Button
            variant={isLocked ? "secondary" : isCompleted ? "ghost" : "primary"}
            size="sm"
            disabled={isLocked}
          >
            {isCompleted ? (
              <><Trophy size={13} />Revisar Trilha</>
            ) : isLocked ? (
              <><Lock size={13} />Desbloqueie no Nível {q.recommendedLevel}</>
            ) : (
              <>Continuar Jornada<ArrowRight size={13} /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PathsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const active = questlines.filter((q) => q.status === "active");
  const available = questlines.filter((q) => q.status !== "locked" && q.status !== "active");
  const locked = questlines.filter((q) => q.status === "locked");

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-blue/20 bg-gradient-to-br from-blue/10 via-surface to-surface-raised p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-blue text-xs font-semibold uppercase tracking-widest mb-3">
            <Map size={14} />
            Mapa de Aventuras
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Questlines</h1>
          <p className="text-text-muted text-base">Escolha sua próxima jornada.</p>

          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue" />
              <span className="text-text-muted">{active.length} ativa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald" />
              <span className="text-text-muted">{available.length} concluída</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-border-strong" />
              <span className="text-text-muted">{locked.length} bloqueadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Questline */}
      {active.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Swords size={15} className="text-amber" />
            <h2 className="text-sm font-semibold text-text uppercase tracking-widest">Questline Ativa</h2>
          </div>
          {active.map((q) => (
            <QuestlineCard
              key={q.id}
              q={q}
              expanded={expandedId === q.id}
              onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
            />
          ))}
        </section>
      )}

      {/* Completed */}
      {available.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald" />
            <h2 className="text-sm font-semibold text-text uppercase tracking-widest">Concluídas</h2>
          </div>
          {available.map((q) => (
            <QuestlineCard
              key={q.id}
              q={q}
              expanded={expandedId === q.id}
              onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
            />
          ))}
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-text-muted" />
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest">Bloqueadas</h2>
          </div>

          {/* Recommended banner */}
          {recommended.length > 0 && (
            <div className="p-4 rounded-xl border border-amber/20 bg-amber/5 flex items-center gap-3">
              <Star size={16} className="text-amber shrink-0" />
              <div>
                <p className="text-sm font-medium text-text">Recomendado para você</p>
                <p className="text-xs text-text-muted">Complete a trilha ativa para desbloquear: <span className="text-amber font-medium">{recommended[0].title}</span></p>
              </div>
            </div>
          )}

          {locked.map((q) => (
            <QuestlineCard
              key={q.id}
              q={q}
              expanded={expandedId === q.id}
              onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
            />
          ))}
        </section>
      )}
    </div>
  );
}
