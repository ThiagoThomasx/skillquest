"use client";

import Link from "next/link";
import {
  BookOpen, Clock, Zap, Play, ArrowRight,
  Compass, Map, Layers, Target, Flame, Sword,
  Skull, AlertCircle, CheckCircle2, Plus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useQuestlinesStore } from "@/stores/questlines-store";
import { useMissionsStore } from "@/stores/missions-store";
import { useStudySessionStore } from "@/stores/study-session-store";
import { useDailyQuestStore } from "@/stores/daily-quest-store";
import { getNextMission, getNextModule, calculateQuestlineProgress } from "@/utils/questline-engine";
import { DIFFICULTY_LABEL } from "@/constants";
import type { StoredMission } from "@/stores/missions-store";
import type { QuestlineModule } from "@/stores/questlines-store";

type Priority = "critical" | "high" | "normal";

function derivePriority(mission: StoredMission, isBossAvailable: boolean): Priority {
  if (isBossAvailable && mission.isBoss) return "critical";
  if (mission.isDaily || mission.isMainQuest) return "high";
  return "normal";
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ElementType }> = {
  critical: { label: "Crítica", color: "text-rose",   bgColor: "bg-rose/10",   borderColor: "border-rose/30",   icon: Skull },
  high:     { label: "Alta",    color: "text-amber",  bgColor: "bg-amber/10",  borderColor: "border-amber/30",  icon: Flame },
  normal:   { label: "Normal",  color: "text-blue",   bgColor: "bg-blue/10",   borderColor: "border-blue/30",   icon: Target },
};

/* ─── Empty States ─────────────────────────────────────────────────── */

function NoQuestlineState() {
  return (
    <Card className="p-7 flex flex-col sm:flex-row items-center gap-5 border-border-strong bg-surface-raised">
      <div className="w-16 h-16 rounded-2xl bg-surface-overlay border border-border flex items-center justify-center shrink-0">
        <Compass size={28} className="text-text-dim" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">Agora</p>
        <p className="text-lg font-bold text-text">Nenhuma trilha ativa</p>
        <p className="text-sm text-text-muted mt-1">
          Escolha uma trilha de aprendizado para saber exatamente o que estudar agora.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
        <Link href="/explore">
          <Button variant="primary" size="sm">
            Explorar trilhas <ArrowRight size={13} />
          </Button>
        </Link>
        <Link href="/paths">
          <Button variant="ghost" size="sm">
            Minhas trilhas
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function NoMissionState({ questlineTitle }: { questlineTitle: string }) {
  return (
    <Card className="p-7 flex flex-col sm:flex-row items-center gap-5 border-emerald/20 bg-emerald/[0.02]">
      <div className="w-16 h-16 rounded-2xl bg-emerald/10 border border-emerald/25 flex items-center justify-center shrink-0">
        <CheckCircle2 size={28} className="text-emerald" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">Agora · {questlineTitle}</p>
        <p className="text-lg font-bold text-text">Nenhuma missão pendente</p>
        <p className="text-sm text-text-muted mt-1">
          Você está em dia! Adicione novas missões ou revise seu roadmap.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
        <Link href="/missions">
          <Button variant="primary" size="sm">
            <Plus size={13} className="mr-1" /> Adicionar missão
          </Button>
        </Link>
        <Link href="/paths">
          <Button variant="ghost" size="sm">
            Revisar roadmap
          </Button>
        </Link>
      </div>
    </Card>
  );
}

/* ─── Main Card ─────────────────────────────────────────────────────── */

export function NowCard() {
  const { questlines } = useQuestlinesStore();
  const { missions } = useMissionsStore();
  const { openSession } = useStudySessionStore();
  const { dailyQuestId, completedToday } = useDailyQuestStore();

  const activeQuestline = questlines.find((q) => q.status === "active") ?? null;

  if (!activeQuestline) return <NoQuestlineState />;

  const nextMission: StoredMission | null = getNextMission(activeQuestline, missions);
  const nextModule: QuestlineModule | null = getNextModule(activeQuestline, missions);

  // Prefer the daily quest if it's not completed yet, then fall back to next in questline
  const dailyMission = missions.find((m) => m.id === dailyQuestId && !completedToday) ?? null;
  const recommendedMission = dailyMission ?? nextMission;

  if (!recommendedMission) return <NoMissionState questlineTitle={activeQuestline.title} />;

  const isBossAvailable = activeQuestline.bossBattle.status === "available";
  const priority = derivePriority(recommendedMission, isBossAvailable);
  const pCfg = PRIORITY_CONFIG[priority];
  const PriorityIcon = pCfg.icon;

  const xpDisplay = recommendedMission.isDaily
    ? recommendedMission.xpReward * 2
    : recommendedMission.xpReward;

  const isLocked = recommendedMission.status === "locked";
  const isDaily = recommendedMission.id === dailyQuestId;

  const questlineProgress = calculateQuestlineProgress(activeQuestline, missions);

  function handleStart() {
    if (isLocked || !recommendedMission) return;
    if (recommendedMission.status === "available") {
      useMissionsStore.getState().startMission(recommendedMission.id);
    }
    openSession(recommendedMission.id, recommendedMission.title);
  }

  return (
    <Card className="relative overflow-hidden border-border-strong bg-surface-raised">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-amber/3 pointer-events-none" />

      <div className="relative p-5 sm:p-6">

        {/* ── Header row ────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
              <Zap size={10} className="text-amber" /> Agora
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-text mt-0.5 leading-tight">
              O que estudar agora
            </h2>
          </div>

          {/* Priority badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${pCfg.bgColor} ${pCfg.borderColor}`}>
            <PriorityIcon size={11} className={pCfg.color} />
            <span className={`text-xs font-bold ${pCfg.color}`}>Prioridade {pCfg.label}</span>
          </div>
        </div>

        {/* ── Main content grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left: Questline + Module context (2 cols on lg) */}
          <div className="lg:col-span-1 space-y-3">

            {/* Questline */}
            <div className="rounded-xl bg-surface-overlay border border-border p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Map size={11} className="text-sky" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Trilha Ativa</p>
              </div>
              <p className="text-sm font-bold text-text leading-snug">{activeQuestline.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1">
                  <ProgressBar value={questlineProgress} variant="sky" size="xs" />
                </div>
                <span className="text-[11px] font-semibold text-sky tabular-nums shrink-0">{questlineProgress}%</span>
              </div>
            </div>

            {/* Current Module */}
            {nextModule && (
              <div className="rounded-xl bg-surface-overlay border border-border p-3.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Layers size={11} className="text-blue" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Módulo Atual</p>
                </div>
                <p className="text-sm font-semibold text-text leading-snug line-clamp-2">{nextModule.title}</p>
                <p className="text-[11px] text-text-dim mt-0.5 line-clamp-1">{nextModule.missionIds.length} miss{nextModule.missionIds.length !== 1 ? "ões" : "ão"}</p>
              </div>
            )}
          </div>

          {/* Right: Mission card (2 cols on lg) */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl border p-4 h-full flex flex-col ${
              isLocked
                ? "bg-surface-overlay border-border opacity-70"
                : isDaily
                ? "bg-amber/5 border-amber/25"
                : "bg-blue/5 border-blue/20"
            }`}>

              {/* Mission header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                  isLocked   ? "bg-surface-overlay border-border" :
                  isDaily    ? "bg-amber/15 border-amber/30" :
                  recommendedMission.isMainQuest ? "bg-sky/15 border-sky/30" :
                  "bg-blue/15 border-blue/30"
                }`}>
                  {isLocked
                    ? <Target size={16} className="text-text-dim" />
                    : isDaily
                    ? <Flame size={16} className="text-amber" />
                    : recommendedMission.isMainQuest
                    ? <Sword size={16} className="text-sky" />
                    : <BookOpen size={16} className="text-blue" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-base font-bold text-text leading-tight">{recommendedMission.title}</p>
                    {isDaily && (
                      <span className="text-[10px] font-bold bg-amber/10 text-amber border border-amber/20 rounded-full px-2 py-0.5 shrink-0">
                        Quest Diária · 2× XP
                      </span>
                    )}
                    {recommendedMission.isMainQuest && !isDaily && (
                      <span className="text-[10px] font-bold bg-sky/10 text-sky border border-sky/20 rounded-full px-2 py-0.5 shrink-0">
                        Quest Principal
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2">{recommendedMission.description}</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 flex-wrap text-xs mb-4">
                <div className="flex items-center gap-1 text-text-muted">
                  <Clock size={11} />
                  <span className="font-medium">~{recommendedMission.estimatedMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={11} className="text-amber" />
                  <span className="font-bold text-amber">{xpDisplay} XP</span>
                </div>
                <Badge variant={
                  recommendedMission.difficulty === "easy" ? "blue" :
                  recommendedMission.difficulty === "medium" ? "amber" : "rose"
                }>
                  {DIFFICULTY_LABEL[recommendedMission.difficulty] ?? recommendedMission.difficulty}
                </Badge>
                <span className="text-text-dim flex items-center gap-1 ml-auto">
                  <BookOpen size={10} />
                  {recommendedMission.pathTitle}
                </span>
              </div>

              {/* Lock warning */}
              {isLocked && (
                <div className="flex items-center gap-2 text-xs text-text-dim bg-surface-overlay rounded-lg px-3 py-2 mb-3 border border-border">
                  <AlertCircle size={12} className="text-text-dim shrink-0" />
                  <span>Complete o módulo anterior para desbloquear esta missão.</span>
                </div>
              )}

              {/* CTA */}
              <div className="mt-auto flex items-center gap-2 flex-wrap">
                <Button
                  variant={isLocked ? "ghost" : "primary"}
                  size="sm"
                  onClick={handleStart}
                  disabled={isLocked}
                  className="flex-1 sm:flex-none"
                >
                  <Play size={13} className="mr-1.5" />
                  {isLocked ? "Missão bloqueada" : "Começar estudo"}
                </Button>

                <Link href="/missions" className="ml-auto">
                  <Button variant="ghost" size="sm" className="text-xs text-text-muted">
                    Ver todas as missões <ArrowRight size={12} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
