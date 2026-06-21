"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Zap, Target, Award, Flame, Calendar, Edit, Shield,
  Star, Trophy, Sword, BookOpen, Crown, ChevronRight,
  TrendingUp, MapPin, Sparkles, Clock, CheckCircle2,
  Timer, BarChart3, Briefcase, Rocket, ArrowRight, Code2,
} from "lucide-react";

import { useProgressStore } from "@/stores/progress-store";
import { useMissionsStore } from "@/stores/missions-store";
import { useBadgesStore } from "@/stores/badges-store";
import { useStreakStore } from "@/stores/streak-store";
import { useActivityStore } from "@/stores/activity-store";
import { useQuestlinesStore } from "@/stores/questlines-store";
import { useStudySessionStore } from "@/stores/study-session-store";
import { usePortfolioStore } from "@/stores/portfolio-store";
import Link from "next/link";
import { BADGE_DEFINITIONS } from "@/engines/badge-engine";
import { getCareerStage } from "@/engines/career-engine";
import {
  calculateQuestlineProgress,
  calculateQuestlineTotalXP,
  calculateQuestlineEarnedXP,
  countQuestlineMissions,
} from "@/utils/questline-engine";
import { formatXP, formatRelativeTime } from "@/utils/format";

const CAREER_STAGES_DEF = [
  { title: "Aprendiz", minLevel: 1, maxLevel: 4, icon: BookOpen },
  { title: "Aventureiro", minLevel: 5, maxLevel: 6, icon: Sword },
  { title: "Aprendiz Avançado", minLevel: 7, maxLevel: 9, icon: Shield },
  { title: "Especialista", minLevel: 10, maxLevel: 14, icon: Star },
  { title: "Mestre", minLevel: 15, maxLevel: 19, icon: Crown },
  { title: "Lenda", minLevel: 20, maxLevel: 999, icon: Trophy },
];

const EVENT_ICON: Record<string, React.ElementType> = {
  mission_completed: CheckCircle2,
  mission_started: Target,
  badge_earned: Award,
  level_up: TrendingUp,
  streak_record: Flame,
  journey_reset: Shield,
};
const EVENT_COLOR: Record<string, string> = {
  mission_completed: "text-emerald",
  mission_started: "text-blue",
  badge_earned: "text-amber",
  level_up: "text-amber",
  streak_record: "text-rose",
  journey_reset: "text-text-dim",
};

function formatHours(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}min`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function ProfilePage() {
  const { totalXP, currentLevel, xpInCurrentLevel, xpRequiredForCurrentLevel, username, joinedAt } = useProgressStore();
  const { missions } = useMissionsStore();
  const { earned } = useBadgesStore();
  const { currentStreak, bestStreak } = useStreakStore();
  const { events } = useActivityStore();
  const { questlines } = useQuestlinesStore();
  const { sessions } = useStudySessionStore();
  const { projects: portfolioProjects } = usePortfolioStore();

  const [timelineExpanded, setTimelineExpanded] = useState(false);

  const career = getCareerStage(currentLevel);
  const completedMissions = missions.filter((m) => m.status === "completed");
  const earnedBadges = earned.filter((b) => b.earned);
  const activeQuestlines = questlines.filter((q) => q.status === "active" || q.status === "available");

  // Study session stats
  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + Math.ceil(s.durationSeconds / 60), 0),
    [sessions]
  );

  const bestWeekMinutes = useMemo(() => {
    if (sessions.length === 0) return 0;
    const byWeek: Record<string, number> = {};
    sessions.forEach((s) => {
      const d = new Date(s.startedAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      byWeek[key] = (byWeek[key] ?? 0) + Math.ceil(s.durationSeconds / 60);
    });
    return Math.max(...Object.values(byWeek));
  }, [sessions]);

  const dailyAverageMinutes = useMemo(() => {
    if (sessions.length === 0) return 0;
    const days = new Set(sessions.map((s) => s.startedAt.slice(0, 10)));
    return Math.round(totalMinutes / days.size);
  }, [sessions, totalMinutes]);

  // Recent earned badges with definitions
  const recentEarnedBadges = useMemo(() => {
    return BADGE_DEFINITIONS
      .filter((b) => earned.find((e) => e.id === b.id && e.earned))
      .slice(0, 6);
  }, [earned]);

  // Timeline from activity events
  const recentEvents = events.slice(0, 6);
  const visibleEvents = timelineExpanded ? recentEvents : recentEvents.slice(0, 3);

  // Career stages with current
  const careerStages = CAREER_STAGES_DEF.map((s) => ({
    ...s,
    done: currentLevel >= s.minLevel,
    current: currentLevel >= s.minLevel && currentLevel <= s.maxLevel,
  }));
  const nextStage = CAREER_STAGES_DEF.find((s) => currentLevel < s.minLevel);

  const xpPercent = Math.round((xpInCurrentLevel / xpRequiredForCurrentLevel) * 100);
  const joinedDate = joinedAt
    ? new Date(joinedAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
    : "—";

  const initials = username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5 max-w-[1400px]">

      {/* ── Character Header ──────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-blue/30 via-blue/10 to-sky/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue/20 via-transparent to-amber/10" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue/10 rounded-full translate-x-10 translate-y-10" />
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/80 backdrop-blur border border-blue/30">
              <Sparkles size={13} className="text-blue" />
              <span className="text-xs font-semibold text-text">{career.title}</span>
            </div>
          </div>
        </div>

        <CardContent className="relative pt-0">
          <div className="flex items-end gap-4 -mt-10 mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue to-blue-hover flex items-center justify-center text-2xl font-black text-white shadow-xl border-4 border-canvas shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-black text-text">{username}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="blue">Nível {currentLevel}</Badge>
                    <Badge variant="default">{career.title}</Badge>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin size={11} />
                      Desde {joinedDate}
                    </span>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Edit size={13} />
                  Editar
                </Button>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Progresso para Nível {currentLevel + 1}</span>
              <span className="text-amber font-semibold">
                {xpInCurrentLevel.toLocaleString("pt-BR")} / {xpRequiredForCurrentLevel.toLocaleString("pt-BR")} XP
              </span>
            </div>
            <ProgressBar value={xpInCurrentLevel} max={xpRequiredForCurrentLevel} variant="amber" size="sm" />
            <div className="flex justify-between text-xs">
              <span className="text-text-dim">{xpPercent}% concluído</span>
              <span className="text-text-dim">{(xpRequiredForCurrentLevel - xpInCurrentLevel).toLocaleString("pt-BR")} XP restantes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Stats + Study Stats numa linha densa ──────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "XP Total", value: formatXP(totalXP), icon: Zap, color: "text-amber", bg: "bg-amber/10", border: "border-amber-border" },
          { label: "Missões", value: String(completedMissions.length), icon: Target, color: "text-blue", bg: "bg-blue/10", border: "border-blue-border" },
          { label: "Conquistas", value: String(earnedBadges.length), icon: Award, color: "text-emerald", bg: "bg-emerald/10", border: "border-emerald-border" },
          { label: "Sequência", value: `${currentStreak}d`, icon: Flame, color: "text-rose", bg: "bg-rose/10", border: "border-rose-border" },
          { label: "Total estudado", value: formatHours(totalMinutes), icon: Clock, color: "text-sky", bg: "bg-sky/10", border: "border-sky-border" },
          { label: "Sessões", value: String(sessions.length), icon: Timer, color: "text-blue", bg: "bg-blue/10", border: "border-blue-border" },
          { label: "Melhor semana", value: formatHours(bestWeekMinutes), icon: BarChart3, color: "text-emerald", bg: "bg-emerald/10", border: "border-emerald-border" },
          { label: "Média diária", value: formatHours(dailyAverageMinutes), icon: TrendingUp, color: "text-amber", bg: "bg-amber/10", border: "border-amber-border" },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <Card key={label} className={`p-3 text-center border ${border} ${bg}`}>
            <Icon size={14} className={`${color} mx-auto mb-1.5`} />
            <p className="text-base font-black text-text tabular-nums leading-none">{value}</p>
            <p className="text-[10px] text-text-muted mt-1 leading-tight">{label}</p>
          </Card>
        ))}
      </div>

      {/* ── Bottom three-col layout ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {/* Left (3/5) */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-5">
          {/* Career Journey */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-text-muted" />
                <h3 className="text-sm font-semibold text-text">Jornada de Carreira</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                <div className="space-y-1">
                  {careerStages.map((stage, i) => {
                    const Icon = stage.icon;
                    return (
                      <div
                        key={i}
                        className={`relative flex items-center gap-4 p-3 rounded-xl transition-all ${
                          stage.current ? "bg-blue/5 border border-blue/20" :
                          stage.done ? "opacity-60" : "opacity-40"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                          stage.current ? "bg-blue border-blue-border shadow-[0_0_12px_rgba(59,130,246,0.4)]" :
                          stage.done ? "bg-emerald/20 border-emerald-border" :
                          "bg-surface-raised border-border"
                        }`}>
                          <Icon size={14} className={stage.current ? "text-white" : stage.done ? "text-emerald" : "text-text-dim"} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${stage.current ? "text-blue" : stage.done ? "text-text" : "text-text-dim"}`}>
                            {stage.title}
                          </p>
                          <p className="text-xs text-text-dim">Nível {stage.minLevel}{stage.minLevel !== stage.maxLevel && stage.maxLevel < 999 ? `–${stage.maxLevel}` : "+"}</p>
                        </div>
                        {stage.current && <Badge variant="blue">Atual</Badge>}
                        {stage.done && !stage.current && <CheckCircle2 size={14} className="text-emerald" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {nextStage && (
                <div className="mt-4 p-3 rounded-lg border border-amber/20 bg-amber/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={13} className="text-amber" />
                    <p className="text-xs font-semibold text-text">Próxima classe: {nextStage.title}</p>
                  </div>
                  <p className="text-xs text-text-muted">Alcance o Nível {nextStage.minLevel} para desbloquear.</p>
                  <ProgressBar value={currentLevel} max={nextStage.minLevel} variant="amber" size="xs" className="mt-2" />
                  <p className="text-xs text-text-dim mt-1">Nível {currentLevel}/{nextStage.minLevel}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-text-muted" />
                  <h3 className="text-sm font-semibold text-text">Conquistas Recentes</h3>
                </div>
                <span className="text-xs text-text-muted">{earnedBadges.length} de {BADGE_DEFINITIONS.length}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {recentEarnedBadges.length === 0 ? (
                <div className="py-8 text-center">
                  <Award size={24} className="text-text-dim mx-auto mb-2" />
                  <p className="text-sm text-text-muted">Complete missões para ganhar conquistas.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {recentEarnedBadges.map((b) => (
                    <div key={b.id} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-surface-raised">
                      <div className="w-10 h-10 rounded-xl border border-border bg-surface-overlay flex items-center justify-center">
                        <Star size={18} className="text-amber" />
                      </div>
                      <p className="text-xs font-medium text-text text-center leading-tight">{b.title}</p>
                      <span className="text-xs text-text-dim capitalize">{b.rarity}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right (2/5) */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-5">

          {/* Active Questlines */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-text-muted" />
                <h3 className="text-sm font-semibold text-text">Questlines Ativas</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {activeQuestlines.length === 0 ? (
                <p className="text-sm text-text-dim py-2">Nenhuma questline ativa.</p>
              ) : (
                activeQuestlines.map((q) => {
                  const progress = calculateQuestlineProgress(q, missions);
                  const earned = calculateQuestlineEarnedXP(q, missions);
                  const total = calculateQuestlineTotalXP(q, missions);
                  const missionCount = countQuestlineMissions(q);
                  const completedCount = q.modules.flatMap((m) => m.missionIds).filter(
                    (mid) => missions.find((m) => m.id === mid)?.status === "completed"
                  ).length;
                  return (
                    <div key={q.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text">{q.title}</p>
                        <span className="text-xs text-text-muted">{completedCount}/{missionCount}</span>
                      </div>
                      <ProgressBar value={progress} variant="blue" size="sm" showLabel />
                      <p className="text-xs text-amber font-medium">⚡ {earned.toLocaleString("pt-BR")} / {total.toLocaleString("pt-BR")} XP</p>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Portfolio Showcase */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-text-muted" />
                  <h3 className="text-sm font-semibold text-text">Portfolio Showcase</h3>
                </div>
                <Link href="/portfolio">
                  <button className="flex items-center gap-1 text-xs text-text-muted hover:text-blue transition-colors">
                    Ver tudo <ArrowRight size={11} />
                  </button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {portfolioProjects.length === 0 ? (
                <div className="py-4 text-center">
                  <Briefcase size={24} className="text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted">Nenhum projeto no portfólio ainda.</p>
                  <Link href="/portfolio">
                    <button className="text-xs text-blue hover:underline mt-1">Criar primeiro projeto →</button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 pb-3 border-b border-border">
                    {[
                      { label: "Projetos",  value: portfolioProjects.length,                                                       color: "text-blue" },
                      { label: "Concluídos", value: portfolioProjects.filter(p => p.status === "completed" || p.status === "published").length, color: "text-emerald" },
                      { label: "Skills",    value: Array.from(new Set(portfolioProjects.flatMap(p => p.skills))).length,           color: "text-amber" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center">
                        <p className={`text-lg font-bold ${color}`}>{value}</p>
                        <p className="text-[10px] text-text-muted">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent projects */}
                  {portfolioProjects.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 py-1.5 border-t border-border first:border-0 first:pt-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        p.status === "published" ? "bg-sky/10 border border-sky/20" :
                        p.status === "completed" ? "bg-emerald/10 border border-emerald/20" :
                        "bg-blue/10 border border-blue/20"
                      }`}>
                        {p.status === "published" ? <Rocket size={12} className="text-sky" /> :
                         p.status === "completed" ? <CheckCircle2 size={12} className="text-emerald" /> :
                         <Code2 size={12} className="text-blue" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text truncate">{p.title}</p>
                        {p.skills.length > 0 && (
                          <p className="text-[10px] text-text-muted truncate">{p.skills.slice(0, 3).join(", ")}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* All skills */}
                  {Array.from(new Set(portfolioProjects.flatMap(p => p.skills))).length > 0 && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-[10px] text-text-muted mb-2">Skills demonstradas</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(portfolioProjects.flatMap(p => p.skills))).slice(0, 10).map((skill) => (
                          <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue/10 text-blue border border-blue/15">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-text-muted" />
                <h3 className="text-sm font-semibold text-text">Atividade Recente</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {recentEvents.length === 0 ? (
                <p className="text-sm text-text-dim py-2">Nenhuma atividade ainda.</p>
              ) : (
                <>
                  {visibleEvents.map((item) => {
                    const Icon = EVENT_ICON[item.type] ?? CheckCircle2;
                    const color = EVENT_COLOR[item.type] ?? "text-text-dim";
                    return (
                      <div key={item.id} className="flex items-start gap-3 py-2 border-t border-border first:border-0 first:pt-0">
                        <div className="w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 bg-surface-overlay border-border">
                          <Icon size={12} className={color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-text-muted">{item.type.replace("_", " ")}</p>
                          <p className="text-sm font-medium text-text leading-tight truncate">{item.title}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {item.xpGained > 0 && (
                            <span className="text-xs font-semibold text-amber">+{item.xpGained}</span>
                          )}
                          <p className="text-xs text-text-dim mt-0.5">{formatRelativeTime(new Date(item.timestamp))}</p>
                        </div>
                      </div>
                    );
                  })}

                  {recentEvents.length > 3 && (
                    <button
                      onClick={() => setTimelineExpanded(!timelineExpanded)}
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors pt-1"
                    >
                      <ChevronRight size={12} className={`transition-transform ${timelineExpanded ? "rotate-90" : ""}`} />
                      {timelineExpanded ? "Ver menos" : `Ver mais (${recentEvents.length - 3})`}
                    </button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
