"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  PixelScene,
  CareerClassCard,
  ThemeOptionCard,
  BadgeCard,
} from "@/features/dashboard";
import {
  Zap, Target, Award, Flame, TrendingUp, ArrowRight,
  CheckCircle2, Clock, ChevronRight, Star, Trophy,
  Sparkles, BarChart3, Skull, Sword, Wand2, Swords,
  BookOpen, PackageOpen,
} from "lucide-react";
import { useProgressStore } from "@/stores/progress-store";
import { useMissionsStore } from "@/stores/missions-store";
import { useBadgesStore } from "@/stores/badges-store";
import { useStreakStore } from "@/stores/streak-store";
import { useActivityStore } from "@/stores/activity-store";
import { BADGE_DEFINITIONS } from "@/engines/badge-engine";
import { getCareerStage } from "@/engines/career-engine";
import { formatXP, formatRelativeTime } from "@/utils/format";

const themes = [
  { name: "Moderno", themeKey: "modern" as const, colors: ["#081120", "#0F1A2D", "#3B82F6", "#F59E0B"], description: "Navy premium — padrão" },
  { name: "Pixel Quest", themeKey: "pixel-quest" as const, colors: ["#0d0d1a", "#1a0d2e", "#7c3aed", "#22C55E"], description: "Cyberpunk roxo-neón" },
  { name: "Fantasy RPG", themeKey: "fantasy-rpg" as const, colors: ["#120808", "#2d1212", "#c2410c", "#ca8a04"], description: "Fogo e ouro épico" },
];

const DIFFICULTY_LABEL: Record<string, string> = { easy: "Fácil", medium: "Médio", hard: "Difícil", legendary: "Lendário" };

export default function DashboardPage() {
  const { totalXP, currentLevel, xpInCurrentLevel, xpRequiredForCurrentLevel, username } = useProgressStore();
  const { missions } = useMissionsStore();
  const { earned } = useBadgesStore();
  const { currentStreak, bestStreak } = useStreakStore();
  const { events } = useActivityStore();

  const career = getCareerStage(currentLevel);
  const completedMissions = missions.filter((m) => m.status === "completed");
  const activeMissions = missions.filter((m) => m.status === "active").slice(0, 3);
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

  // Next badge to unlock
  const nextBadge = useMemo(() => {
    const alreadyEarned = earned.filter((b) => b.earned).map((b) => b.id);
    return BADGE_DEFINITIONS.find((b) => !alreadyEarned.includes(b.id)) ?? null;
  }, [earned]);

  // Recent badges for display
  const recentBadges = useMemo(() => {
    return BADGE_DEFINITIONS
      .filter((b) => earned.find((e) => e.id === b.id && e.earned))
      .slice(0, 6);
  }, [earned]);

  // Active questline
  const reactPath = missions.filter((m) => m.pathId === "path-react");
  const reactDone = reactPath.filter((m) => m.status === "completed").length;

  return (
    <div className="space-y-5 max-w-[1600px]">

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
                  <Badge variant="blue">Frontend Developer</Badge>
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
            <Button variant="amber" size="sm" className="w-full">
              Ver conquistas <ArrowRight size={13} />
            </Button>
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

      {/* ── Missões em Andamento + Atividade Recente ──────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Quests em Andamento</h2>
            <Button variant="ghost" size="sm">Ver todas <ChevronRight size={13} /></Button>
          </div>

          {activeMissions.length === 0 ? (
            <Card className="p-8 text-center">
              <Target size={28} className="text-text-dim mx-auto mb-3" />
              <p className="text-sm font-semibold text-text">Nenhuma quest ativa</p>
              <p className="text-xs text-text-muted mt-1">Vá para Missões e inicie uma quest!</p>
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
            <Card className="p-8 text-center">
              <PackageOpen size={28} className="text-text-dim mx-auto mb-3" />
              <p className="text-sm font-semibold text-text">Sem atividade ainda</p>
              <p className="text-xs text-text-muted mt-1">Complete missões para ver o histórico.</p>
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

      {/* ── Questline + Conquistas + Estatísticas ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky/10 border border-sky-border flex items-center justify-center">
                <BookOpen size={14} className="text-sky" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Questline Ativa</p>
            </div>

            {reactPath.length > 0 ? (
              <>
                <h3 className="text-base font-bold text-text mb-1">React Avançado</h3>
                <p className="text-xs text-text-muted mb-4">{reactPath.length} quests · Nível Intermediário</p>
                <div className="rounded-lg bg-surface-overlay border border-border h-20 mb-4 flex items-center justify-center">
                  <p className="text-xs text-text-dim">Arte da trilha em breve</p>
                </div>
                <ProgressBar value={reactDone} max={reactPath.length} variant="sky" size="sm" className="mb-2" />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-text-muted">{reactDone} de {reactPath.length} quests</p>
                  <Button variant="outline" size="sm">Continuar <ArrowRight size={12} /></Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-text-dim">Nenhuma questline ativa.</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Conquistas Recentes</p>
            <Button variant="ghost" size="sm">Ver todas <ChevronRight size={13} /></Button>
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

        <Card className="p-5 relative overflow-hidden border-rose/20">
          <div className="absolute inset-0 bg-gradient-to-br from-rose/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Swords size={14} className="text-rose" />
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Boss Battle</p>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-rose/10 border border-rose/25 flex items-center justify-center shrink-0">
                <Skull size={24} className="text-rose" />
              </div>
              <div>
                <p className="text-sm font-bold text-text">Arquimago das APIs</p>
                <p className="text-xs text-text-muted mt-0.5">Boss Lendário · Nível 18</p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap size={10} className="text-amber" />
                  <span className="text-[11px] font-bold text-amber">+1.000 XP</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Derrote este boss para desbloquear a classe <span className="text-rose font-semibold">Lenda</span>.
            </p>
            <ProgressBar value={currentLevel} max={18} variant="rose" size="sm" className="mb-2" />
            <p className="text-[11px] text-text-muted">Nível {currentLevel} de 18{currentLevel >= 18 ? " — Disponível!" : " — Bloqueado"}</p>
          </div>
        </Card>
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
