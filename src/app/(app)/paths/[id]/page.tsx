"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  useQuestlinesStore,
  type Questline,
  type QuestlineModule,
} from "@/stores/questlines-store";
import { useMissionsStore, type StoredMission } from "@/stores/missions-store";
import {
  calculateQuestlineProgress,
  calculateQuestlineEarnedXP,
  calculateQuestlineTotalXP,
  calculateModuleProgress,
  isModuleCompleted,
  countQuestlineMissions,
  countCompletedMissions,
} from "@/utils/questline-engine";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  Clock,
  Flame,
  Map,
  Skull,
  Star,
  Swords,
  Target,
  Trophy,
  Zap,
  Lock,
  BookOpen,
  Library,
  ExternalLink,
  FolderKanban,
  Plus,
  GitBranch,
} from "lucide-react";
import { useResourcesStore } from "@/stores/resources-store";
import type { Resource } from "@/stores/resources-store";
import { useProjectsStore } from "@/stores/projects-store";
import type { StudyProject } from "@/stores/projects-store";

// ── Difficulty / status helpers ───────────────────────────────────────────────

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
  legendary: "Lendário",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "text-emerald",
  medium: "text-amber",
  hard: "text-rose",
  legendary: "text-purple",
};

// ── Mission Row ───────────────────────────────────────────────────────────────

function MissionItem({
  mission,
  isNext,
  onComplete,
}: {
  mission: StoredMission;
  isNext: boolean;
  onComplete: () => void;
}) {
  const isCompleted = mission.status === "completed";
  const isLocked = mission.status === "locked";

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
        isCompleted
          ? "border-emerald/20 bg-emerald/[0.03]"
          : isNext
          ? "border-blue/30 bg-blue/[0.04] ring-1 ring-blue/10"
          : isLocked
          ? "border-border/50 bg-surface-overlay/50 opacity-60"
          : "border-border bg-surface-overlay"
      }`}
    >
      {/* Status Icon */}
      <button
        onClick={isCompleted || isLocked ? undefined : onComplete}
        disabled={isLocked}
        className={`shrink-0 mt-0.5 transition-all ${
          isCompleted
            ? "text-emerald cursor-default"
            : isLocked
            ? "text-text-dim cursor-not-allowed"
            : "text-text-dim hover:text-blue cursor-pointer"
        }`}
        title={isCompleted ? "Concluída" : isLocked ? "Bloqueada" : "Marcar como concluída"}
      >
        {isCompleted ? (
          <CheckCircle size={18} />
        ) : isLocked ? (
          <Lock size={16} />
        ) : (
          <Circle size={18} />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={`text-sm font-medium truncate ${
              isCompleted ? "text-text-muted line-through" : "text-text"
            }`}
          >
            {mission.title}
          </p>
          {isNext && (
            <Badge variant="blue" className="text-[10px] shrink-0">
              Próxima
            </Badge>
          )}
          {isCompleted && (
            <Badge variant="emerald" className="text-[10px] shrink-0">
              Feita
            </Badge>
          )}
        </div>
        {mission.description && (
          <p className="text-xs text-text-dim mt-0.5 line-clamp-1">
            {mission.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1 text-[10px] text-text-muted">
          <span className="flex items-center gap-0.5">
            <Clock size={9} />
            {mission.estimatedMinutes}min
          </span>
          <span
            className={`font-medium ${
              DIFFICULTY_COLOR[mission.difficulty] ?? "text-text-muted"
            }`}
          >
            {DIFFICULTY_LABEL[mission.difficulty] ?? mission.difficulty}
          </span>
          <span className="flex items-center gap-0.5 text-amber font-medium">
            <Zap size={9} />
            {mission.xpReward} XP
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Module Section ────────────────────────────────────────────────────────────

function ModuleSection({
  mod,
  questlineId,
  allMissions,
  isCurrentModule,
  nextMissionId,
  defaultOpen,
}: {
  mod: QuestlineModule;
  questlineId: string;
  allMissions: StoredMission[];
  isCurrentModule: boolean;
  nextMissionId: string | null;
  defaultOpen: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const { completeMission } = useMissionsStore();
  const { recalculateProgress } = useQuestlinesStore();

  const progress = calculateModuleProgress(mod, allMissions);
  const completed = isModuleCompleted(mod, allMissions);

  const modMissions = mod.missionIds
    .map((id) => allMissions.find((m) => m.id === id))
    .filter((m): m is StoredMission => Boolean(m));

  function handleComplete(missionId: string) {
    completeMission(missionId);
    recalculateProgress(questlineId);
  }

  return (
    <div
      className={`rounded-xl border transition-all overflow-hidden ${
        completed
          ? "border-emerald/20"
          : isCurrentModule
          ? "border-blue/25 ring-1 ring-blue/10"
          : "border-border"
      }`}
    >
      {/* Module Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-overlay/50 transition-colors"
      >
        {/* Order badge */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
            completed
              ? "bg-emerald/15 text-emerald"
              : isCurrentModule
              ? "bg-blue/15 text-blue"
              : "bg-surface-raised text-text-dim"
          }`}
        >
          {completed ? <CheckCircle size={16} /> : mod.order}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold text-sm ${
                completed ? "text-text-muted" : "text-text"
              }`}
            >
              {mod.title}
            </h3>
            {isCurrentModule && !completed && (
              <Badge variant="blue" className="text-[10px]">
                <Flame size={9} /> Em andamento
              </Badge>
            )}
            {completed && <Badge variant="emerald" className="text-[10px]">Concluído</Badge>}
          </div>

          {mod.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
              {mod.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1.5">
            {modMissions.length > 0 && (
              <div className="flex-1 max-w-32">
                <ProgressBar
                  value={progress}
                  variant={completed ? "emerald" : isCurrentModule ? "blue" : undefined}
                  size="xs"
                />
              </div>
            )}
            <span className="text-[10px] text-text-dim">
              {modMissions.filter((m) => m.status === "completed").length}/{modMissions.length} missões
            </span>
            {mod.xpReward > 0 && (
              <span className="text-[10px] text-amber font-medium flex items-center gap-0.5">
                <Zap size={9} />+{mod.xpReward} XP
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          size={14}
          className={`text-text-dim shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Missions */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-border">
          {modMissions.length === 0 ? (
            <p className="text-xs text-text-dim italic pt-3">
              Nenhuma missão neste módulo.
            </p>
          ) : (
            <div className="pt-3 space-y-2">
              {modMissions.map((m) => (
                <MissionItem
                  key={m.id}
                  mission={m}
                  isNext={m.id === nextMissionId}
                  onComplete={() => handleComplete(m.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { questlines, completeBossBattle } = useQuestlinesStore();
  const { missions } = useMissionsStore();
  const { resources } = useResourcesStore();
  const { projects } = useProjectsStore();

  const q: Questline | undefined = questlines.find((ql) => ql.id === id);

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Map size={36} className="text-text-dim" />
        <p className="text-text-muted">Trilha não encontrada.</p>
        <Button variant="ghost" size="sm" onClick={() => router.push("/paths")}>
          <ArrowLeft size={14} /> Voltar
        </Button>
      </div>
    );
  }

  const progress = calculateQuestlineProgress(q, missions);
  const earnedXP = calculateQuestlineEarnedXP(q, missions);
  const totalXP = calculateQuestlineTotalXP(q, missions);
  const totalMissions = countQuestlineMissions(q);
  const completedMissions = countCompletedMissions(q, missions);
  const sortedModules = [...q.modules].sort((a, b) => a.order - b.order);

  // Find current module (first incomplete) and next mission
  const currentModule = sortedModules.find((m) => !isModuleCompleted(m, missions));

  let nextMissionId: string | null = null;
  if (currentModule) {
    const nextMission = currentModule.missionIds
      .map((id) => missions.find((m) => m.id === id))
      .find((m) => m && m.status !== "completed");
    nextMissionId = nextMission?.id ?? null;
  }

  const isCompleted = q.status === "completed";
  const pathResources = resources.filter((r) => r.questlineId === q.id);
  const pathProjects = projects.filter((p) => p.questlineId === q.id);
  const bossAvailable = q.bossBattle.status === "available";
  const bossCompleted = q.bossBattle.status === "completed";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => router.push("/paths")} className="w-fit">
        <ArrowLeft size={14} /> Trilhas
      </Button>

      {/* Header */}
      <div
        className={`rounded-2xl border p-6 ${
          isCompleted
            ? "border-emerald/20 bg-gradient-to-br from-emerald/10 via-surface to-surface-raised"
            : "border-blue/20 bg-gradient-to-br from-blue/10 via-surface to-surface-raised"
        }`}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-2 text-text-muted">
              <Map size={12} />
              {q.category} · {q.className}
            </div>
            <h1 className="text-2xl font-bold text-text mb-1">{q.title}</h1>
            {q.description && (
              <p className="text-sm text-text-muted">{q.description}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-3 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                {completedMissions}/{totalMissions} missões
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {q.estimatedHours}h estimado
              </span>
              <span className="flex items-center gap-1 text-amber font-medium">
                <Zap size={11} />
                {earnedXP}/{totalXP} XP
              </span>
            </div>
          </div>

          {isCompleted && (
            <Trophy size={32} className="text-emerald shrink-0" />
          )}
        </div>

        {/* Overall progress */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-text-muted">
            <span>Progresso geral</span>
            <span className={`font-semibold ${isCompleted ? "text-emerald" : "text-text"}`}>
              {progress}%
            </span>
          </div>
          <ProgressBar value={progress} variant={isCompleted ? "emerald" : "blue"} size="md" />
        </div>
      </div>

      {/* "Where am I" indicator */}
      {!isCompleted && currentModule && (
        <Card className="border-blue/20 bg-blue/[0.03]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue/15 flex items-center justify-center shrink-0">
              <Target size={16} className="text-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-0.5">
                Você está aqui
              </p>
              <p className="text-sm font-semibold text-text truncate">
                Módulo {currentModule.order}: {currentModule.title}
              </p>
              {nextMissionId && (
                <p className="text-xs text-text-muted mt-0.5 truncate">
                  Próxima missão:{" "}
                  <span className="text-blue font-medium">
                    {missions.find((m) => m.id === nextMissionId)?.title}
                  </span>
                </p>
              )}
            </div>
            <ChevronRight size={16} className="text-blue shrink-0" />
          </CardContent>
        </Card>
      )}

      {/* Module list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star size={13} className="text-text-muted" />
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Módulos ({q.modules.length})
          </h2>
        </div>

        {sortedModules.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen size={24} className="text-text-dim mx-auto mb-2" />
              <p className="text-sm text-text-muted">
                Esta trilha ainda não tem módulos.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedModules.map((mod) => (
            <ModuleSection
              key={mod.id}
              mod={mod}
              questlineId={q.id}
              allMissions={missions}
              isCurrentModule={mod.id === currentModule?.id}
              nextMissionId={nextMissionId}
              defaultOpen={mod.id === currentModule?.id}
            />
          ))
        )}
      </div>

      {/* Resources linked to this path */}
      {pathResources.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Library size={13} className="text-text-muted" />
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Recursos da Trilha ({pathResources.length})
            </h2>
          </div>
          <div className="space-y-2">
            {pathResources.map((r) => {
              const modName = q.modules.find((m) => m.id === r.moduleId)?.title ?? "";
              return (
                <div key={r.id} className="rounded-lg border border-border bg-surface-overlay p-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-text-muted capitalize">{r.type}</span>
                      {modName && <span className="text-[10px] text-blue/80">· {modName}</span>}
                      <span className="text-[10px] text-text-muted">
                        {r.status === "concluido" ? "✓ Concluído" : r.status === "estudando" ? "↗ Estudando" : "· Quero estudar"}
                      </span>
                    </div>
                  </div>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1 rounded text-text-muted hover:text-text transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects linked to this path */}
      <div className="rounded-xl border border-border bg-surface-overlay p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban size={15} className="text-blue" />
            <span className="text-sm font-semibold text-text">Projetos desta Trilha</span>
            {pathProjects.length > 0 && (
              <span className="text-[10px] bg-blue/10 text-blue px-1.5 py-0.5 rounded-full font-medium">
                {pathProjects.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/projects`)}
            className="text-xs"
          >
            <Plus size={12} className="mr-1" />
            Novo
          </Button>
        </div>

        {pathProjects.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-text-muted">Nenhum projeto vinculado a esta trilha.</p>
            <button
              onClick={() => router.push("/projects")}
              className="text-xs text-blue hover:underline mt-1"
            >
              Criar projeto →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {pathProjects.map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border bg-surface"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text truncate">{proj.name}</p>
                  {proj.moduleTitle && (
                    <p className="text-[10px] text-text-muted mt-0.5">{proj.moduleTitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-blue">
                      <GitBranch size={12} />
                    </a>
                  )}
                  {proj.deployUrl && (
                    <a href={proj.deployUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-emerald">
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    proj.status === "concluido" ? "bg-emerald/10 text-emerald"
                    : proj.status === "em_andamento" ? "bg-amber/10 text-amber"
                    : "bg-surface-raised text-text-muted"
                  }`}>
                    {proj.status === "em_andamento" ? "Em andamento"
                      : proj.status === "concluido" ? "Concluído"
                      : proj.status === "planejado" ? "Planejado"
                      : proj.status === "pausado" ? "Pausado"
                      : "Ideia"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Boss Battle */}
      <div
        className={`rounded-xl border p-4 flex items-center justify-between gap-3 ${
          bossCompleted
            ? "border-emerald/20 bg-emerald/[0.03]"
            : bossAvailable
            ? "border-amber/30 bg-amber/[0.03]"
            : "border-border bg-surface-overlay opacity-70"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              bossCompleted ? "bg-emerald/15" : bossAvailable ? "bg-amber/15" : "bg-surface-raised"
            }`}
          >
            <Skull
              size={18}
              className={
                bossCompleted ? "text-emerald" : bossAvailable ? "text-amber" : "text-text-dim"
              }
            />
          </div>
          <div>
            <p className="text-sm font-bold text-text">{q.bossBattle.title}</p>
            <p className="text-xs text-text-muted mt-0.5">{q.bossBattle.description}</p>
            <p className="text-xs text-amber font-medium mt-1">
              +{q.bossBattle.xpReward} XP de recompensa
            </p>
          </div>
        </div>

        {bossCompleted ? (
          <Badge variant="emerald">
            <Trophy size={11} /> Derrotado!
          </Badge>
        ) : bossAvailable ? (
          <Button variant="amber" size="sm" onClick={() => completeBossBattle(q.id)}>
            <Swords size={13} /> Batalhar!
          </Button>
        ) : (
          <Badge>
            <Lock size={11} /> Bloqueado
          </Badge>
        )}
      </div>
    </div>
  );
}
