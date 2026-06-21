"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Target, Clock, Zap, CheckCircle2, Skull, Sword,
  Star, BookOpen, ChevronRight, Flame, ArrowRight, Lock, PackageOpen,
  ExternalLink, FileText, Video, Code2, FlaskConical, FolderOpen, Lightbulb, Trophy,
} from "lucide-react";
import { useMissionsStore, type StoredMission, type MissionResource } from "@/stores/missions-store";

const RESOURCE_ICONS: Record<MissionResource["type"], React.ReactNode> = {
  article:       <FileText size={11} />,
  video:         <Video size={11} />,
  documentation: <BookOpen size={11} />,
  practice:      <Code2 size={11} />,
  lab:           <FlaskConical size={11} />,
  project:       <FolderOpen size={11} />,
};

const RESOURCE_LABELS: Record<MissionResource["type"], string> = {
  article:       "Artigo",
  video:         "Vídeo",
  documentation: "Docs",
  practice:      "Prática",
  lab:           "Lab",
  project:       "Projeto",
};

const DIFFICULTY_CONFIG: Record<string, { variant: "blue" | "amber" | "rose" | "sky"; label: string }> = {
  easy:      { variant: "blue", label: "Fácil" },
  medium:    { variant: "amber", label: "Médio" },
  hard:      { variant: "rose", label: "Difícil" },
  legendary: { variant: "sky", label: "Lendário" },
};

const FILTERS = ["Todas", "Ativas", "Disponíveis", "Concluídas", "Boss"] as const;
type Filter = typeof FILTERS[number];

function QuestCard({
  m,
  expanded,
  onToggle,
  onStart,
  onComplete,
}: {
  m: StoredMission;
  expanded: boolean;
  onToggle: () => void;
  onStart: () => void;
  onComplete: () => void;
}) {
  const diff = DIFFICULTY_CONFIG[m.difficulty] ?? { variant: "blue" as const, label: m.difficulty };
  const isCompleted = m.status === "completed";
  const isActive    = m.status === "active";
  const isLocked    = m.status === "locked";

  return (
    <Card
      hoverable={!isLocked}
      className={`overflow-hidden transition-all ${
        m.isBoss    ? "border-rose/30 bg-gradient-to-r from-rose/5 via-surface to-surface" :
        isActive    ? "border-blue/20" :
        isCompleted ? "border-emerald/10 opacity-70" : ""
      }`}
    >
      <div className="p-4 lg:p-5">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
            isCompleted ? "bg-emerald/10 border-emerald-border" :
            m.isBoss    ? "bg-rose/10 border-rose-border" :
            isActive    ? "bg-blue/10 border-blue-border" :
            "bg-surface-overlay border-border"
          }`}>
            {isCompleted ? <CheckCircle2 size={18} className="text-emerald" /> :
             m.isBoss    ? <Skull size={18} className="text-rose" /> :
             isLocked    ? <Lock size={18} className="text-text-dim" /> :
             m.isDaily   ? <Flame size={18} className="text-amber" /> :
             <Target size={18} className="text-blue" />}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {m.isMainQuest && <Badge variant="blue">Main Quest</Badge>}
                  {m.isDaily     && <Badge variant="amber">🔥 Diária 2×</Badge>}
                  {m.isBoss      && <Badge variant="rose">⚔️ Boss</Badge>}
                </div>
                <h3 className="font-bold text-text">{m.title}</h3>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{m.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={diff.variant}>{diff.label}</Badge>
                {isCompleted && <Badge variant="emerald">Concluída</Badge>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1"><BookOpen size={11} />{m.pathTitle}</span>
              <span className="flex items-center gap-1"><Clock size={11} />~{m.estimatedMinutes} min</span>
              <span className="flex items-center gap-1 text-amber font-semibold">
                <Zap size={11} className="text-amber" />{m.isDaily ? m.xpReward * 2 : m.xpReward} XP
              </span>
            </div>

            {isActive && m.progress > 0 && (
              <ProgressBar value={m.progress} variant="blue" size="xs" showLabel />
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onToggle}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
              >
                <ChevronRight size={12} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
                {expanded ? "Ocultar" : "Ver"} detalhes
              </button>

              <div className="flex items-center gap-2">
                {isActive && (
                  <Button variant="amber" size="sm" onClick={onComplete}>
                    Concluir <CheckCircle2 size={12} />
                  </Button>
                )}
                <Button
                  variant={isLocked ? "secondary" : isCompleted ? "ghost" : m.isBoss ? "amber" : isActive ? "primary" : "secondary"}
                  size="sm"
                  disabled={isLocked}
                  onClick={!isActive && !isCompleted && !isLocked ? onStart : undefined}
                >
                  {isCompleted ? "Revisar" :
                   isLocked ? <><Lock size={12} />Bloqueada</> :
                   isActive  ? <>Continuar <ArrowRight size={12} /></> :
                   "Iniciar Quest"}
                </Button>
              </div>
            </div>

            {expanded && (
              <div className="pt-3 space-y-4 border-t border-border mt-2">

                {/* Objetivos + Recompensas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Objetivos</p>
                    <ul className="space-y-1.5">
                      {m.objectives.map((obj, i) => (
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
                      {m.rewards.map((reward, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-amber font-medium">
                          <Star size={10} className="text-amber shrink-0" />{reward}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Checklist */}
                {m.checklist && m.checklist.length > 0 && (
                  <div className="rounded-xl bg-surface-raised border border-border p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle2 size={12} className="text-emerald" />
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Checklist</p>
                    </div>
                    <ul className="space-y-1.5">
                      {m.checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                          <div className="w-3.5 h-3.5 rounded border border-border bg-surface shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tip */}
                {m.tips && (
                  <div className="flex items-start gap-2 rounded-xl bg-amber/5 border border-amber/15 p-3">
                    <Lightbulb size={13} className="text-amber shrink-0 mt-0.5" />
                    <p className="text-xs text-text-muted leading-relaxed"><span className="font-semibold text-amber">Dica: </span>{m.tips}</p>
                  </div>
                )}

                {/* Critério de Conclusão */}
                {m.completionCriteria && (
                  <div className="flex items-start gap-2 rounded-xl bg-emerald/5 border border-emerald/15 p-3">
                    <Trophy size={13} className="text-emerald shrink-0 mt-0.5" />
                    <p className="text-xs text-text-muted leading-relaxed"><span className="font-semibold text-emerald">Conclusão: </span>{m.completionCriteria}</p>
                  </div>
                )}

                {/* Recursos de Aprendizado */}
                {m.resources && m.resources.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Recursos</p>
                    <div className="space-y-1.5">
                      {m.resources.map((r, i) => (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-raised px-3 py-2 hover:border-blue/30 hover:bg-blue/5 transition-colors group"
                        >
                          <span className="text-text-muted group-hover:text-blue transition-colors">
                            {RESOURCE_ICONS[r.type]}
                          </span>
                          <span className="flex-1 min-w-0 text-xs text-text truncate">{r.title}</span>
                          <span className="text-[10px] text-text-dim bg-surface px-1.5 py-0.5 rounded border border-border shrink-0">
                            {RESOURCE_LABELS[r.type]}
                          </span>
                          <span className="text-[10px] text-text-dim shrink-0">~{r.estimatedMinutes}min</span>
                          <ExternalLink size={10} className="text-text-dim group-hover:text-blue transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function MissionsPage() {
  const [filter, setFilter] = useState<Filter>("Todas");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { missions, startMission, completeMission } = useMissionsStore();

  const filtered = missions.filter((m) => {
    if (filter === "Ativas")      return m.status === "active";
    if (filter === "Disponíveis") return m.status === "available";
    if (filter === "Concluídas")  return m.status === "completed";
    if (filter === "Boss")        return m.isBoss;
    return true;
  });

  const activeCount    = missions.filter((m) => m.status === "active").length;
  const completedCount = missions.filter((m) => m.status === "completed").length;
  const hasDaily       = missions.some((m) => m.isDaily && m.status !== "completed");

  return (
    <div className="space-y-6 max-w-[1400px]">
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
              <span className="text-text-muted">{missions.length} no total</span>
            </p>
          </div>
          {hasDaily && (
            <div className="px-3 py-1.5 rounded-lg bg-amber/10 border border-amber-border flex items-center gap-1.5">
              <Flame size={13} className="text-amber" />
              <span className="text-xs font-semibold text-amber">Bônus Diário Ativo</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? "bg-blue text-white" : "bg-surface-raised border border-border text-text-muted hover:text-text"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <PackageOpen size={36} className="text-text-dim mx-auto mb-3" />
            <p className="text-sm font-semibold text-text">Nenhuma quest aqui</p>
            <p className="text-xs text-text-muted mt-1">
              {filter === "Concluídas" ? "Complete missões para vê-las aqui." : "Mude o filtro para ver outras quests."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((m) => (
              <QuestCard
                key={m.id}
                m={m}
                expanded={expandedId === m.id}
                onToggle={() => setExpandedId(expandedId === m.id ? null : m.id)}
                onStart={() => startMission(m.id)}
                onComplete={() => completeMission(m.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
