"use client";

import {
  Sprout, Map as MapIcon, Zap, Star, Trophy, Crown, Lock,
  Sword, Shield, Wand2, ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/stores/progress-store";
import { useMissionsStore } from "@/stores/missions-store";
import { CAREER_STAGES, getCareerStage, getNextCareerStage } from "@/engines/career-engine";

const STAGE_ICONS = [Sprout, MapIcon, Zap, Star, Trophy, Crown];

const classes = [
  { name: "Frontend Mage",    icon: Wand2,  color: "text-sky",     bg: "bg-sky/10 border-sky/25",     desc: "Encanta interfaces" },
  { name: "Backend Knight",   icon: Shield, color: "text-blue",    bg: "bg-blue/10 border-blue/25",   desc: "Forja servidores" },
  { name: "Full-Stack Ranger", icon: Sword, color: "text-emerald", bg: "bg-emerald/10 border-emerald/25", desc: "Percorre toda a stack" },
];

export function CareerClassCard() {
  const { currentLevel } = useProgressStore();
  const { missions } = useMissionsStore();
  const currentStage = getCareerStage(currentLevel);
  const nextStage = getNextCareerStage(currentLevel);

  // Group missions into questlines
  const questlineMap = new Map<string, { total: number; done: number }>();
  missions.forEach((m) => {
    const existing = questlineMap.get(m.pathTitle) ?? { total: 0, done: 0 };
    questlineMap.set(m.pathTitle, {
      total: existing.total + 1,
      done: existing.done + (m.status === "completed" ? 1 : 0),
    });
  });
  const questlines = Array.from(questlineMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .slice(0, 3);

  return (
    <Card className="p-5">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Classe &amp; Jornada de Carreira
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Column 1: Classes */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-3">Sua Classe</p>
          <div className="space-y-2">
            {classes.map((cls, i) => {
              const Icon = cls.icon;
              const active = i === 0;
              return (
                <div
                  key={cls.name}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all",
                    active ? "bg-sky/5 border-sky/30" : "bg-surface-overlay border-border opacity-60"
                  )}
                >
                  <div className={cn("w-7 h-7 rounded-lg border flex items-center justify-center shrink-0", cls.bg)}>
                    <Icon size={13} className={cls.color} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-xs font-bold truncate", active ? "text-text" : "text-text-dim")}>{cls.name}</p>
                    <p className="text-[10px] text-text-dim">{cls.desc}</p>
                  </div>
                  {active && (
                    <span className="ml-auto text-[9px] font-bold bg-sky/10 text-sky border border-sky/20 rounded-full px-1.5 py-0.5 shrink-0">
                      ativa
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Questlines */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-3">Questlines</p>
          <div className="space-y-2">
            {questlines.length === 0 ? (
              <p className="text-xs text-text-dim">Nenhuma questline ainda.</p>
            ) : (
              questlines.map((q, i) => {
                const pct = q.total > 0 ? Math.round((q.done / q.total) * 100) : 0;
                const active = i === 0;
                return (
                  <div
                    key={q.name}
                    className={cn("px-3 py-2.5 rounded-xl border", active ? "bg-amber/5 border-amber/25" : "bg-surface-overlay border-border")}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className={cn("text-xs font-semibold truncate", active ? "text-amber" : "text-text-muted")}>{q.name}</p>
                      <span className="text-[10px] text-text-dim shrink-0 ml-1">{q.done}/{q.total}</span>
                    </div>
                    <div className="h-1 bg-surface rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", active ? "bg-amber" : "bg-border-strong")} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Career Journey */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-3">Jornada</p>
          <div className="relative">
            <div className="absolute left-[14px] top-3 bottom-3 w-px bg-border" />
            <div className="space-y-2">
              {CAREER_STAGES.map((stage, i) => {
                const Icon = STAGE_ICONS[i];
                const isCurrent = stage.id === currentStage.id;
                const isDone = currentLevel > stage.minLevel && !isCurrent;
                const isLocked = !isDone && !isCurrent;
                return (
                  <div key={stage.id} className="flex items-center gap-2.5 relative">
                    <div className={cn(
                      "relative w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 z-10",
                      isCurrent ? "bg-amber/10 border-amber/30" : isDone ? "bg-emerald/10 border-emerald/30" : "bg-surface border-border"
                    )}>
                      {isLocked ? (
                        <Lock size={11} className="text-text-dim" />
                      ) : (
                        <Icon size={12} className={cn(isCurrent ? "text-amber" : isDone ? "text-emerald" : "text-text-dim")} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-semibold", isCurrent ? "text-amber" : isDone ? "text-text" : "text-text-dim")}>
                        {stage.title}
                      </p>
                      <p className="text-[10px] text-text-dim">Nível {stage.minLevel}+</p>
                    </div>
                    {isCurrent && <ChevronRight size={12} className="text-amber shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-[11px] text-text-muted">
          {nextStage ? (
            <>Próxima classe: <span className="text-text font-semibold">{nextStage.title}</span> — Nível {nextStage.minLevel}</>
          ) : (
            <span className="text-amber font-semibold">Nível máximo atingido!</span>
          )}
        </p>
        <p className="text-[11px] text-text-muted">
          Estágio: <span className="text-amber font-semibold">{currentStage.title}</span>
        </p>
      </div>
    </Card>
  );
}
