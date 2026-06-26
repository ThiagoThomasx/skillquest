"use client";

import { useEffect, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  NowCard,
  PixelScene,
  CareerClassCard,
  ThemeOptionCard,
  BadgeCard,
  StudyMetricsPanel,
} from "@/features/dashboard";
import Link from "next/link";
import {
  Zap, Target, Award, Flame, TrendingUp, ArrowRight,
  CheckCircle2, Clock, ChevronRight, Star, Trophy,
  Sparkles, BarChart3, Skull, Sword, Wand2, Swords,
  BookOpen, PackageOpen, RefreshCw, Play, Timer,
  CalendarDays, Layers, Map, Lock, Compass, Briefcase, Plus,
} from "lucide-react";
import { useProgressStore } from "@/stores/progress-store";
import { useMissionsStore } from "@/stores/missions-store";
import { useReviewStore } from "@/stores/review-store";
import { useBadgesStore } from "@/stores/badges-store";
import { useStreakStore } from "@/stores/streak-store";
import { useActivityStore } from "@/stores/activity-store";
import { useQuestlinesStore } from "@/stores/questlines-store";
import { useDailyQuestStore } from "@/stores/daily-quest-store";
import { useStudySessionStore } from "@/stores/study-session-store";
import { useWeeklyGoalStore } from "@/stores/weekly-goal-store";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { generateReadmeDraft, generateLinkedInDraft } from "@/utils/portfolio-generators";
import { BADGE_DEFINITIONS } from "@/engines/badge-engine";
import { getCareerStage } from "@/engines/career-engine";
import { formatXP, formatRelativeTime } from "@/utils/format";
import { DIFFICULTY_LABEL } from "@/constants";
import { buildHeatmapData } from "@/utils/session-metrics";
import { ConsistencyCalendar } from "@/components/ConsistencyCalendar";
import {
  calculateQuestlineProgress,
  calculateQuestlineEarnedXP,
  calculateQuestlineTotalXP,
  countQuestlineMissions,
  countCompletedMissions,
  calculateRemainingMinutes,
  getNextModule,
  getNextMission,
  countModulesCompleted,
  calculateModuleProgress,
} from "@/utils/questline-engine";

const themes = [
  { name: "Moderno", themeKey: "modern" as const, colors: ["#081120", "#0F1A2D", "#3B82F6", "#F59E0B"], description: "Navy premium — padrão" },
  { name: "Pixel Quest", themeKey: "pixel-quest" as const, colors: ["#0d0d1a", "#1a0d2e", "#7c3aed", "#22C55E"], description: "Cyberpunk roxo-neón" },
  { name: "Fantasy RPG", themeKey: "fantasy-rpg" as const, colors: ["#120808", "#2d1212", "#c2410c", "#ca8a04"], description: "Fogo e ouro épico" },
];

const PRIORITY_REASON_ICON: Record<number, React.ElementType> = {
  1: Timer, 2: BookOpen, 3: Target, 4: Skull, 5: Clock, 6: Zap,
};

export default function DashboardPage() {
  const { totalXP, currentLevel, xpInCurrentLevel, xpRequiredForCurrentLevel, username } = useProgressStore();
  const { missions } = useMissionsStore();
  const { earned } = useBadgesStore();
  const { currentStreak, bestStreak } = useStreakStore();
  const { events } = useActivityStore();
  const { questlines } = useQuestlinesStore();
  const { sessions, openSession } = useStudySessionStore();
  const { missionsGoal, minutesGoal, xpGoal } = useWeeklyGoalStore();
  const { projects: portfolioProjects, addProject: addPortfolioProject } = usePortfolioStore();
  const { getOverdue, getToday } = useReviewStore();

  const {
    dailyQuestId, completedToday, skippedToday, focusMinutes, dailyGoal,
    refreshIfNeeded, skipDailyQuest,
  } = useDailyQuestStore();

  const career = getCareerStage(currentLevel);
  const completedMissions = missions.filter((m) => m.status === "completed");
  const activeMissions = missions.filter((m) => m.status === "active").slice(0, 3);

  // Active questline
  const activeQuestline = questlines.find((q) => q.status === "active") ?? null;
  const qlProgress = activeQuestline ? calculateQuestlineProgress(activeQuestline, missions) : 0;
  const qlEarnedXP = activeQuestline ? calculateQuestlineEarnedXP(activeQuestline, missions) : 0;
  const qlTotalXP = activeQuestline ? calculateQuestlineTotalXP(activeQuestline, missions) : 0;
  const qlTotalMissions = activeQuestline ? countQuestlineMissions(activeQuestline) : 0;
  const qlCompletedMissions = activeQuestline ? countCompletedMissions(activeQuestline, missions) : 0;
  const qlRemainingMinutes = activeQuestline ? calculateRemainingMinutes(activeQuestline, missions) : 0;
  const qlRemainingXP = qlTotalXP - qlEarnedXP;
  const nextModule = activeQuestline ? getNextModule(activeQuestline, missions) : null;
  const nextMission = activeQuestline ? getNextMission(activeQuestline, missions) : null;
  const qlModulesTotal = activeQuestline?.modules.length ?? 0;
  const qlModulesCompleted = activeQuestline ? countModulesCompleted(activeQuestline, missions) : 0;
  const nextModuleProgress = nextModule ? calculateModuleProgress(nextModule, missions) : 0;
  const modulesUntilBoss = activeQuestline ? qlModulesTotal - qlModulesCompleted : 0;
  const activeBoss = questlines.find((q) => q.bossBattle.status === "available") ?? activeQuestline;
  const earnedBadges = earned.filter((b) => b.earned);
  const recentActivity = events.slice(0, 5);

  // Weekly XP from last 7 days
  const weeklyXPData = useMemo(() => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dayKey = d.toISOString().slice(0, 10);
      const xp = events
        .filter((e) => e.timestamp.slice(0, 10) === dayKey)
        .reduce((sum, e) => sum + e.xpGained, 0);
      return { day: days[d.getDay()], xp };
    });
  }, [events]);

  const maxWeeklyXP = Math.max(...weeklyXPData.map((d) => d.xp), 1);
  const weeklyTotalXP = weeklyXPData.reduce((sum, d) => sum + d.xp, 0);

  // Weekly stats
  const weekStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  }, []);

  const weeklyMissionsCompleted = useMemo(
    () => completedMissions.filter((m) => m.completedAt && m.completedAt.slice(0, 10) >= weekStart).length,
    [completedMissions, weekStart]
  );

  const weeklyMinutes = useMemo(
    () => sessions
      .filter((s) => s.startedAt.slice(0, 10) >= weekStart)
      .reduce((sum, s) => sum + Math.ceil(s.durationSeconds / 60), 0),
    [sessions, weekStart]
  );

  // Next badge to unlock — prefer common/rare over epic/legendary to show attainable goal
  const nextBadge = useMemo(() => {
    const alreadyEarned = earned.filter((b) => b.earned).map((b) => b.id);
    const unearnedDefs = BADGE_DEFINITIONS.filter((b) => !alreadyEarned.includes(b.id));
    if (unearnedDefs.length === 0) return null;
    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    return unearnedDefs.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity])[0];
  }, [earned]);

  const recentBadges = useMemo(() => {
    return BADGE_DEFINITIONS
      .filter((b) => earned.find((e) => e.id === b.id && e.earned))
      .slice(0, 6);
  }, [earned]);

  // Daily Quest — refresh whenever missions or questlines change (e.g. after daily reset)
  useEffect(() => {
    refreshIfNeeded(missions, questlines);
  }, [missions, questlines, refreshIfNeeded]);

  const dailyMission = missions.find((m) => m.id === dailyQuestId) ?? null;

  // Days remaining in week (Mon–Sun, BR standard). getDay(): 0=Sun,1=Mon,...,6=Sat
  const daysRemainingInWeek = useMemo(() => {
    const day = new Date().getDay(); // 0 (Sun) – 6 (Sat)
    const dayOfWeekMon = day === 0 ? 7 : day; // convert to 1 (Mon) – 7 (Sun)
    return 7 - dayOfWeekMon + 1; // days left including today
  }, []);

  function handleStartSession() {
    if (!dailyMission) return;
    if (dailyMission.status === "available") {
      useMissionsStore.getState().startMission(dailyMission.id);
    }
    openSession(dailyMission.id, dailyMission.title);
  }

  function handleSkipQuest() {
    skipDailyQuest(missions, questlines);
  }

  const reviewsOverdue = getOverdue();
  const reviewsToday = getToday();
  const reviewsDue = [...reviewsOverdue, ...reviewsToday];

  const heatmapData = useMemo(() => buildHeatmapData(sessions, 91), [sessions]);

  return (
    <div className="space-y-5 max-w-[1600px]">

      {/* ── Agora ──────────────────────────────────────────────── */}
      <NowCard />

      {/* ── Revisões pendentes ─────────────────────────────────── */}
      {reviewsDue.length > 0 && (
        <Card className="border-amber/30 bg-amber/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw size={15} className="text-amber" />
              <p className="text-sm font-bold text-text">
                Revisões de hoje
                <span className="ml-2 text-xs font-normal text-amber">
                  {reviewsDue.length} pendente{reviewsDue.length !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
            <Link
              href="/review"
              className="text-xs font-semibold text-amber hover:text-amber/80 flex items-center gap-1 transition-colors"
            >
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            {reviewsDue.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-xs text-text-muted"
              >
                <BookOpen size={11} className="text-amber shrink-0" />
                <span className="truncate">{item.missionTitle}</span>
                {item.interval && (
                  <span className="ml-auto shrink-0 text-[10px] opacity-60">
                    {item.interval === 1 ? "1d" : item.interval === 7 ? "7d" : item.interval === 30 ? "30d" : "90d"}
                  </span>
                )}
              </div>
            ))}
            {reviewsDue.length > 3 && (
              <p className="text-[10px] text-text-muted opacity-60 pl-[19px]">
                + {reviewsDue.length - 3} mais…
              </p>
            )}
          </div>
        </Card>
      )}

      {/* ── Quest Diária + Meta Semanal (ação principal) ─────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Daily Quest Card */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text flex items-center gap-2">
              <Flame size={14} className="text-amber" /> Quest Diária
            </h2>
          </div>

          {dailyMission ? (
            <Card className={`p-5 relative overflow-hidden ${
              completedToday ? "border-emerald/30 bg-emerald/[0.02]" : "border-amber/20 bg-amber/[0.02]"
            }`}>
              {completedToday && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold bg-emerald/10 text-emerald border border-emerald/20 rounded-full px-2 py-0.5">
                    Concluída hoje!
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                  completedToday ? "bg-emerald/10 border-emerald/30" : "bg-amber/10 border-amber/30"
                }`}>
                  {completedToday
                    ? <CheckCircle2 size={22} className="text-emerald" />
                    : <Flame size={22} className="text-amber" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-base font-bold text-text">{dailyMission.title}</p>
                    {dailyMission.isDaily && (
                      <span className="text-[10px] font-bold bg-amber/10 text-amber border border-amber/20 rounded-full px-2 py-0.5">
                        Bônus 2×
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mb-3">{dailyMission.description}</p>

                  <div className="flex items-center gap-4 flex-wrap text-xs text-text-dim">
                    <span className="flex items-center gap-1 text-blue font-medium">
                      <BookOpen size={10} />
                      {dailyMission.pathTitle}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> ~{dailyMission.estimatedMinutes} min
                    </span>
                    <span className="flex items-center gap-1 text-amber font-semibold">
                      <Zap size={10} />
                      {dailyMission.isDaily ? dailyMission.xpReward * 2 : dailyMission.xpReward} XP
                    </span>
                    <span className="capitalize">{DIFFICULTY_LABEL[dailyMission.difficulty] ?? dailyMission.difficulty}</span>
                  </div>

                  {focusMinutes > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
                        <span>{focusMinutes} / {dailyGoal} min estudados hoje</span>
                        <span>{Math.min(Math.round((focusMinutes / dailyGoal) * 100), 100)}%</span>
                      </div>
                      <ProgressBar value={focusMinutes} max={dailyGoal} variant="amber" size="sm" />
                    </div>
                  )}
                </div>
              </div>

              {!completedToday && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="amber"
                    size="sm"
                    onClick={handleStartSession}
                    className="flex-1 sm:flex-none"
                  >
                    <Play size={13} className="mr-1.5" /> Iniciar Sessão
                  </Button>
                  {!skippedToday && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkipQuest}
                      title="Trocar quest (1× por dia)"
                    >
                      <RefreshCw size={13} className="mr-1.5" /> Trocar Quest
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                <Flame size={20} className="text-amber/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">Sem quest para hoje</p>
                <p className="text-xs text-text-muted mt-0.5">Comece uma trilha de aprendizado para receber quests diárias.</p>
              </div>
              <Link href="/explore">
                <Button size="sm" variant="primary">Explorar trilhas</Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Meta Semanal */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-blue" />
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Meta Semanal</p>
            </div>
            <span className="text-[11px] text-text-dim">{daysRemainingInWeek}d restantes</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-muted flex items-center gap-1"><Target size={10} /> Missões</span>
                <span className="font-semibold text-text">{weeklyMissionsCompleted}/{missionsGoal}</span>
              </div>
              <ProgressBar value={weeklyMissionsCompleted} max={missionsGoal} variant="blue" size="sm" />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-muted flex items-center gap-1"><Clock size={10} /> Minutos</span>
                <span className="font-semibold text-text">{weeklyMinutes}/{minutesGoal}</span>
              </div>
              <ProgressBar value={weeklyMinutes} max={minutesGoal} variant="emerald" size="sm" />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-muted flex items-center gap-1"><Zap size={10} /> XP</span>
                <span className="font-semibold text-amber">{weeklyTotalXP}/{xpGoal}</span>
              </div>
              <ProgressBar value={weeklyTotalXP} max={xpGoal} variant="amber" size="sm" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[11px] text-text-dim">
              {weeklyMissionsCompleted >= missionsGoal && weeklyMinutes >= minutesGoal
                ? "🎯 Meta semanal atingida!"
                : `${missionsGoal - weeklyMissionsCompleted > 0 ? `${missionsGoal - weeklyMissionsCompleted} missões` : "Missões ✓"} · ${minutesGoal - weeklyMinutes > 0 ? `${minutesGoal - weeklyMinutes} min` : "Tempo ✓"}`}
            </p>
          </div>
        </Card>
      </div>

      {/* ── Active Questline Panel (contexto da jornada) ──────── */}
      {activeQuestline ? (
        <Card className="relative overflow-hidden border-sky/20">
          <div className="absolute inset-0 bg-gradient-to-br from-sky/5 via-transparent to-rose/3 pointer-events-none" />
          <div className="relative p-5">

            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky/10 border border-sky/25 flex items-center justify-center shrink-0">
                  <Map size={16} className="text-sky" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Questline Ativa</p>
                    <span className="text-[10px] font-bold bg-sky/10 text-sky border border-sky/20 rounded-full px-2 py-0.5">
                      {activeQuestline.className}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text leading-tight">{activeQuestline.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs shrink-0 flex-wrap">
                <div className="text-center">
                  <p className="font-bold text-text text-base tabular-nums">{qlCompletedMissions}<span className="text-text-muted font-normal">/{qlTotalMissions}</span></p>
                  <p className="text-text-dim">missões</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="font-bold text-emerald text-base tabular-nums">{qlProgress}%</p>
                  <p className="text-text-dim">completo</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] text-text-muted mb-1.5">
                <span>{qlModulesCompleted}/{qlModulesTotal} módulos</span>
                <span>{qlEarnedXP.toLocaleString()} / {qlTotalXP.toLocaleString()} XP</span>
              </div>
              <ProgressBar value={qlProgress} variant="sky" size="md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <div className="rounded-xl bg-surface-raised border border-border p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers size={12} className="text-blue" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Próximo Módulo</p>
                </div>
                {nextModule ? (
                  <>
                    <p className="text-sm font-bold text-text mb-0.5">{nextModule.title}</p>
                    <p className="text-xs text-text-muted mb-2 line-clamp-2">{nextModule.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
                      <span>{nextModule.missionIds.length} missões</span>
                      <span>{nextModuleProgress}%</span>
                    </div>
                    <ProgressBar value={nextModuleProgress} variant="blue" size="xs" />
                  </>
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <CheckCircle2 size={14} className="text-emerald" />
                    <p className="text-xs text-emerald font-semibold">Todos módulos completos!</p>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-surface-raised border border-border p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Target size={12} className="text-amber" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Próxima Missão</p>
                </div>
                {nextMission ? (
                  <>
                    <p className="text-sm font-bold text-text mb-0.5 line-clamp-1">{nextMission.title}</p>
                    <p className="text-xs text-text-muted mb-2 line-clamp-2">{nextMission.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-text-muted">
                      <span className="flex items-center gap-1"><Clock size={10} />~{nextMission.estimatedMinutes}min</span>
                      <span className="flex items-center gap-1 text-amber font-semibold"><Zap size={10} />{nextMission.xpReward} XP</span>
                    </div>
                    {nextMission.status === "locked" && (
                      <div className="flex items-center gap-1 mt-2 text-[11px] text-text-dim">
                        <Lock size={10} />
                        <span>Complete o módulo anterior primeiro</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <Trophy size={14} className="text-amber" />
                    <p className="text-xs text-amber font-semibold">Pronto para o Boss!</p>
                  </div>
                )}
              </div>

              <div className={`rounded-xl border p-3.5 ${
                activeQuestline.bossBattle.status === "available"
                  ? "bg-amber/5 border-amber/25"
                  : activeQuestline.bossBattle.status === "completed"
                  ? "bg-emerald/5 border-emerald/25"
                  : "bg-rose/5 border-rose/20"
              }`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Skull size={12} className={
                    activeQuestline.bossBattle.status === "available" ? "text-amber" :
                    activeQuestline.bossBattle.status === "completed" ? "text-emerald" : "text-rose"
                  } />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Boss Battle</p>
                </div>
                <p className="text-sm font-bold text-text mb-0.5 line-clamp-1">{activeQuestline.bossBattle.title}</p>
                {activeQuestline.bossBattle.status === "completed" ? (
                  <p className="text-xs text-emerald font-semibold mt-1">Boss derrotado!</p>
                ) : activeQuestline.bossBattle.status === "available" ? (
                  <>
                    <p className="text-xs text-amber font-semibold mt-1">Disponível agora!</p>
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-amber font-semibold">
                      <Zap size={10} />{activeQuestline.bossBattle.xpReward} XP de recompensa
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-text-muted mb-2 line-clamp-2">{activeQuestline.bossBattle.description.slice(0, 80)}…</p>
                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span className="flex items-center gap-1"><Layers size={10} />{modulesUntilBoss} módulo{modulesUntilBoss !== 1 ? "s" : ""} restante{modulesUntilBoss !== 1 ? "s" : ""}</span>
                      <span className="flex items-center gap-1 text-amber font-semibold"><Zap size={10} />{activeQuestline.bossBattle.xpReward} XP</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-overlay border border-border flex items-center justify-center shrink-0">
              <Compass size={20} className="text-text-dim" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-text">Nenhuma trilha ativa</p>
              <p className="text-xs text-text-muted mt-0.5">Explore o marketplace e escolha uma trilha de aprendizado para começar sua jornada.</p>
            </div>
            <Link href="/explore">
              <Button variant="primary" size="sm">
                Explorar <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* ── Hero Principal ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        <Card className="xl:col-span-2 relative overflow-hidden border-border-strong bg-surface-raised">
          <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 size={12} className="text-sky" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                    {career.title} · Bem-vindo de volta, {username}
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-black text-text tracking-tight">Nível {currentLevel}</h1>
                  <Badge variant="blue">{career.title}</Badge>
                </div>

                <p className="text-sm text-text-muted mb-5">
                  <span className="text-amber font-semibold">{xpRequiredForCurrentLevel - xpInCurrentLevel} XP</span> para o próximo nível
                </p>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-muted">{formatXP(xpInCurrentLevel)} XP</span>
                    <span className="text-xs text-text-muted">{formatXP(xpRequiredForCurrentLevel)} XP</span>
                  </div>
                  <ProgressBar value={xpInCurrentLevel} max={xpRequiredForCurrentLevel} variant="amber" size="md" />
                </div>

                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">XP (7d)</p>
                    <p className="text-sm font-bold text-text mt-0.5">+{weeklyTotalXP} XP</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Concluídas</p>
                    <p className="text-sm font-bold text-text mt-0.5">{completedMissions.length} missões</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">XP Total</p>
                    <p className="text-sm font-bold text-text mt-0.5">{formatXP(totalXP)}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1 text-emerald text-xs font-semibold">
                      <TrendingUp size={12} />
                      <span>Nível {currentLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block h-44">
                <PixelScene />
              </div>
            </div>
          </div>
        </Card>

        {/* Próxima Conquista */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Próxima Conquista</p>
            <Star size={14} className="text-amber" />
          </div>

          {nextBadge ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber-border flex items-center justify-center shrink-0">
                  <Award size={20} className="text-amber" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text">{nextBadge.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{nextBadge.howToUnlock}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-text-muted capitalize">{nextBadge.rarity}</span>
                <div className="flex items-center gap-1">
                  <Zap size={11} className="text-amber" />
                  <span className="text-xs font-bold text-amber">+{nextBadge.xpReward} XP</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <Trophy size={28} className="text-amber mb-2" />
              <p className="text-sm font-bold text-text">Todas desbloqueadas!</p>
              <p className="text-xs text-text-muted mt-1">Você é uma lenda.</p>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-border">
            <Link href="/badges" className="block">
              <Button variant="amber" size="sm" className="w-full">
                Ver conquistas <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* ── Métricas ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "XP Total", value: formatXP(totalXP), delta: `+${weeklyTotalXP} esta semana`, icon: Zap, color: "text-amber", bg: "bg-amber/10 border-amber-border" },
          { label: "Missões", value: String(completedMissions.length), delta: `${activeMissions.length} em andamento`, icon: Target, color: "text-blue", bg: "bg-blue/10 border-blue-border" },
          { label: "Conquistas", value: String(earnedBadges.length), delta: nextBadge ? "1 próxima" : "Todas desbloqueadas!", icon: Award, color: "text-emerald", bg: "bg-emerald/10 border-emerald-border" },
          { label: "Sequência", value: `${currentStreak}d`, delta: `Recorde: ${bestStreak}d`, icon: Flame, color: "text-rose", bg: "bg-rose/10 border-rose-border" },
        ].map(({ label, value, delta, icon: Icon, color, bg }) => (
          <Card key={label} className="p-5 hover:border-border-strong transition-colors cursor-default">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-4 ${bg}`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-3xl font-black text-text tabular-nums">{value}</p>
            <p className="text-sm font-medium text-text-muted mt-0.5">{label}</p>
            <p className="text-[11px] text-text-dim mt-1">{delta}</p>
          </Card>
        ))}
      </div>

      {/* ── Métricas de Estudo ────────────────────────────────── */}
      <StudyMetricsPanel
        sessions={sessions}
        activeQuestlineTitle={activeQuestline?.title}
        activeQuestlineEstimatedHours={activeQuestline?.estimatedHours}
        activeQuestlineProgress={qlProgress}
      />

      {/* ── Consistência ─────────────────────────────────────── */}
      <ConsistencyCalendar data={heatmapData} />

      {/* ── Missões em Andamento + Atividade Recente ──────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Quests em Andamento</h2>
            <Link href="/missions">
              <Button variant="ghost" size="sm">Ver todas <ChevronRight size={13} /></Button>
            </Link>
          </div>

          {activeMissions.length === 0 ? (
            <Card className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0">
                <Target size={18} className="text-blue/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">Sem quests em andamento</p>
                <p className="text-xs text-text-muted mt-0.5">Acesse Missões para escolher e iniciar uma quest.</p>
              </div>
              <Link href="/missions">
                <Button size="sm" variant="ghost">Ver missões</Button>
              </Link>
            </Card>
          ) : (
            activeMissions.map((m) => (
              <Card key={m.id} hoverable className={`p-4 ${m.isMainQuest ? "border-amber/20 bg-amber/[0.02]" : ""}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    m.isDaily ? "bg-amber/10 border border-amber-border" :
                    m.isMainQuest ? "bg-sky/10 border border-sky/30" :
                    "bg-blue/10 border border-blue-border"
                  }`}>
                    {m.isDaily ? <Flame size={14} className="text-amber" /> :
                     m.isMainQuest ? <Sword size={14} className="text-sky" /> :
                     <Target size={14} className="text-blue" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-text truncate">{m.title}</p>
                      {m.isMainQuest && (
                        <span className="text-[10px] font-bold bg-sky/10 text-sky border border-sky/20 rounded-full px-2 py-0.5 shrink-0">
                          Quest Principal
                        </span>
                      )}
                      {m.isDaily && (
                        <span className="text-[10px] font-bold bg-amber/10 text-amber border border-amber/20 rounded-full px-2 py-0.5 shrink-0">
                          Bônus 2×
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] text-text-dim">📜 {m.pathTitle}</span>
                      <span className="text-text-dim">·</span>
                      <div className="flex items-center gap-1 text-text-muted">
                        <Clock size={10} />
                        <span className="text-xs">~{m.estimatedMinutes} min</span>
                      </div>
                      <span className="text-text-dim">·</span>
                      <div className="flex items-center gap-1">
                        <Zap size={10} className="text-amber" />
                        <span className="text-xs font-semibold text-amber">{m.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant={m.difficulty === "easy" ? "blue" : m.difficulty === "medium" ? "amber" : "rose"}>
                    {DIFFICULTY_LABEL[m.difficulty]}
                  </Badge>
                </div>

                {m.progress > 0 && (
                  <ProgressBar value={m.progress} variant={m.isDaily ? "amber" : m.isMainQuest ? "sky" : "blue"} size="sm" showLabel />
                )}
              </Card>
            ))
          )}
        </div>

        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Atividade Recente</h2>
          </div>

          {recentActivity.length === 0 ? (
            <Card className="p-5 text-center">
              <PackageOpen size={22} className="text-text-dim mx-auto mb-2" />
              <p className="text-sm font-semibold text-text">Nenhuma atividade ainda</p>
              <p className="text-xs text-text-muted mt-0.5">Conclua sua primeira quest para ver o histórico aqui.</p>
            </Card>
          ) : (
            <Card className="divide-y divide-border">
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <CheckCircle2 size={14} className="text-emerald shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{a.title}</p>
                    <span className="text-[10px] text-text-dim">{formatRelativeTime(new Date(a.timestamp))}</span>
                  </div>
                  {a.xpGained > 0 && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap size={10} className="text-amber" />
                      <span className="text-xs font-bold text-amber">+{a.xpGained}</span>
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>

      {/* ── Conquistas + Estatísticas ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Conquistas Recentes</p>
            <Link href="/badges">
              <Button variant="ghost" size="sm">Ver todas <ChevronRight size={13} /></Button>
            </Link>
          </div>
          {recentBadges.length === 0 ? (
            <div className="text-center py-6">
              <Award size={24} className="text-text-dim mx-auto mb-2" />
              <p className="text-xs text-text-muted">Nenhuma conquista ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {recentBadges.map((b) => (
                <BadgeCard key={b.id} title={b.title} icon={Star} rarity={b.rarity} earned />
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} className="text-blue" />
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">XP esta semana</p>
            </div>
            <span className="text-xs font-bold text-blue">{weeklyTotalXP} XP</span>
          </div>

          <div className="flex items-end gap-1.5 h-24 mb-3">
            {weeklyXPData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-blue/25 hover:bg-blue/50 transition-colors min-h-[4px]"
                  style={{ height: `${Math.max((d.xp / maxWeeklyXP) * 88, 4)}px` }}
                />
                <span className="text-[9px] text-text-dim">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-[10px] text-text-muted">Média diária</p>
              <p className="text-sm font-bold text-text">{Math.round(weeklyTotalXP / 7)} XP</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-text-muted">Melhor dia</p>
              <p className="text-sm font-bold text-amber">{Math.max(...weeklyXPData.map((d) => d.xp))} XP</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Classe e Carreira + Boss Battle ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CareerClassCard />
        </div>

        <Card className={`p-5 relative overflow-hidden ${activeBoss?.bossBattle.status === "available" ? "border-amber/30" : "border-rose/20"}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-rose/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Swords size={14} className={activeBoss?.bossBattle.status === "available" ? "text-amber" : "text-rose"} />
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Boss Battle</p>
            </div>
            {activeBoss ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${
                    activeBoss.bossBattle.status === "available" ? "bg-amber/10 border-amber/25" :
                    activeBoss.bossBattle.status === "completed" ? "bg-emerald/10 border-emerald/25" :
                    "bg-rose/10 border-rose/25"
                  }`}>
                    <Skull size={24} className={
                      activeBoss.bossBattle.status === "available" ? "text-amber" :
                      activeBoss.bossBattle.status === "completed" ? "text-emerald" : "text-rose"
                    } />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{activeBoss.bossBattle.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{activeBoss.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap size={10} className="text-amber" />
                      <span className="text-[11px] font-bold text-amber">+{activeBoss.bossBattle.xpReward} XP</span>
                    </div>
                  </div>
                </div>
                {activeBoss.bossBattle.status === "available" ? (
                  <p className="text-xs text-amber font-semibold">Disponível! Acesse Questlines para batalhar.</p>
                ) : activeBoss.bossBattle.status === "completed" ? (
                  <div className="space-y-2">
                    <p className="text-xs text-emerald font-semibold">Boss derrotado! Questline concluída.</p>
                    {!portfolioProjects.some((p) => p.sourceId === activeBoss.bossBattle.id) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full flex items-center gap-1.5 text-xs border border-blue/20 hover:bg-blue/5"
                        onClick={() => {
                          const now = new Date().toISOString();
                          const base = {
                            title: activeBoss.bossBattle.title,
                            description: activeBoss.bossBattle.description,
                            category: activeBoss.category,
                            sourceType: "boss_battle" as const,
                            sourceId: activeBoss.bossBattle.id,
                            questlineId: activeBoss.id,
                            status: "completed" as const,
                            difficulty: activeBoss.difficulty,
                            skills: [],
                            deliverables: activeBoss.bossBattle.requirements,
                            repositoryUrl: "",
                            liveUrl: "",
                            notes: "",
                            readmeDraft: "",
                            linkedinDraft: "",
                            completedAt: activeBoss.bossBattle.completedAt,
                          };
                          addPortfolioProject({
                            ...base,
                            readmeDraft: generateReadmeDraft({ ...base, id: "", createdAt: now, updatedAt: now }),
                            linkedinDraft: generateLinkedInDraft({ ...base, id: "", createdAt: now, updatedAt: now }),
                          });
                        }}
                      >
                        <Briefcase size={12} />
                        Adicionar ao Portfólio
                      </Button>
                    )}
                    {portfolioProjects.some((p) => p.sourceId === activeBoss.bossBattle.id) && (
                      <Link href="/portfolio">
                        <Button size="sm" variant="ghost" className="w-full text-xs text-emerald border border-emerald/20">
                          <CheckCircle2 size={12} />
                          No portfólio ✓
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    <ProgressBar value={calculateQuestlineProgress(activeBoss, missions)} variant="rose" size="sm" className="mb-2" />
                    <p className="text-[11px] text-text-muted">Complete todos os módulos para desafiar o boss.</p>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-text-dim">Nenhum boss disponível no momento.</p>
            )}
          </div>
        </Card>
      </div>

      {/* ── Portfolio Progress ────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-text-muted" />
            <h2 className="text-sm font-bold text-text">Portfolio Builder</h2>
          </div>
          <Link href="/portfolio">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
              Ver portfólio <ArrowRight size={11} />
            </Button>
          </Link>
        </div>

        {portfolioProjects.length === 0 ? (
          <Card className="p-5 flex items-center gap-4 border-dashed border-border/60">
            <div className="w-10 h-10 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0">
              <Briefcase size={18} className="text-blue" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">Comece seu portfólio</p>
              <p className="text-xs text-text-muted">Transforme missões e Boss Battles em evidências reais de aprendizado.</p>
            </div>
            <Link href="/portfolio">
              <Button size="sm" className="flex items-center gap-1.5 shrink-0">
                <Plus size={13} />
                Criar projeto
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Em andamento", value: portfolioProjects.filter(p => p.status === "in_progress").length, color: "text-amber" },
              { label: "Concluídos",   value: portfolioProjects.filter(p => p.status === "completed" || p.status === "published").length, color: "text-emerald" },
              { label: "Publicados",   value: portfolioProjects.filter(p => p.status === "published").length, color: "text-sky" },
              { label: "Skills",       value: Array.from(new Set(portfolioProjects.flatMap(p => p.skills))).length, color: "text-blue" },
            ].map(({ label, value, color }) => (
              <Card key={label} className="p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{label}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── Tema Visual ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-text-muted" />
          <h2 className="text-sm font-bold text-text">Tema do Aventureiro</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((t) => (
            <ThemeOptionCard key={t.name} name={t.name} themeKey={t.themeKey} colors={t.colors} description={t.description} />
          ))}
        </div>
      </div>

    </div>
  );
}
