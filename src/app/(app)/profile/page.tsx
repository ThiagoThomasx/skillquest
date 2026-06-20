"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Zap, Target, Award, Flame, Calendar, Edit, Shield,
  Star, Trophy, Sword, BookOpen, Crown, ChevronRight,
  TrendingUp, MapPin, Sparkles, Clock, CheckCircle2,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const CHARACTER = {
  name: "Thiago Thomas",
  initials: "TT",
  class: "Frontend Mage",
  classIcon: Sparkles,
  title: "Aprendiz Avançado",
  level: 7,
  xp: 2450,
  xpToNext: 3000,
  streak: 7,
  rank: "#142",
  joinedAt: "Jun 2026",
  bio: "Desenvolvedor apaixonado por criar experiências visuais épicas. Em jornada rumo ao nível Lendário.",
};

const STATS = [
  { label: "XP Total", value: "2.450", icon: Zap, color: "text-amber", bg: "bg-amber/10", border: "border-amber-border" },
  { label: "Missões", value: "12", icon: Target, color: "text-blue", bg: "bg-blue/10", border: "border-blue-border" },
  { label: "Conquistas", value: "3", icon: Award, color: "text-emerald", bg: "bg-emerald/10", border: "border-emerald-border" },
  { label: "Sequência", value: "7d", icon: Flame, color: "text-rose", bg: "bg-rose/10", border: "border-rose-border" },
  { label: "Ranking", value: "#142", icon: Trophy, color: "text-amber", bg: "bg-amber/10", border: "border-amber-border" },
  { label: "Classes", value: "1", icon: Shield, color: "text-sky", bg: "bg-sky/10", border: "border-sky-border" },
];

const CAREER_STAGES = [
  { title: "Aprendiz", level: 1, icon: BookOpen, done: true },
  { title: "Aventureiro", level: 5, icon: Sword, done: true },
  { title: "Aprendiz Avançado", level: 7, icon: Shield, done: false, current: true },
  { title: "Especialista", level: 10, icon: Star, done: false },
  { title: "Mestre", level: 15, icon: Crown, done: false },
  { title: "Lenda", level: 20, icon: Trophy, done: false },
];

const TIMELINE = [
  { type: "mission", action: "Completou missão", title: "Variáveis CSS e Temas", xp: 100, date: "Hoje", icon: CheckCircle2, color: "text-emerald" },
  { type: "badge", action: "Conquista desbloqueada", title: "Sequência de Fogo", xp: 150, date: "Ontem", icon: Flame, color: "text-rose" },
  { type: "mission", action: "Completou missão", title: "Fundamentos de TypeScript", xp: 150, date: "19 Jun", icon: CheckCircle2, color: "text-emerald" },
  { type: "level", action: "Subiu para Nível 7", title: "Frontend Mage desbloqueado", xp: 0, date: "18 Jun", icon: TrendingUp, color: "text-amber" },
  { type: "badge", action: "Conquista desbloqueada", title: "TypeScript Expert", xp: 300, date: "15 Jun", icon: Award, color: "text-sky" },
  { type: "mission", action: "Completou missão", title: "React Hooks na Prática", xp: 200, date: "14 Jun", icon: CheckCircle2, color: "text-emerald" },
];

const ACTIVE_QUESTLINES = [
  { title: "React Avançado", progress: 45, missions: "11/24", xp: "2.160 / 4.800" },
];

const RECENT_BADGES = [
  { title: "Primeiro Passo", icon: Star, color: "text-amber", rarity: "Comum" },
  { title: "Sequência de Fogo", icon: Flame, color: "text-rose", rarity: "Raro" },
  { title: "TypeScript Expert", icon: Zap, color: "text-sky", rarity: "Épico" },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const xpPercent = Math.round((CHARACTER.xp / CHARACTER.xpToNext) * 100);
  const ClassIcon = CHARACTER.classIcon;

  const timelineItems = timelineExpanded ? TIMELINE : TIMELINE.slice(0, 3);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* ── Character Header ──────────────────────────────────── */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-blue/30 via-blue/10 to-sky/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue/20 via-transparent to-amber/10" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue/10 rounded-full translate-x-10 translate-y-10" />
          {/* Class badge on banner */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/80 backdrop-blur border border-blue/30">
              <ClassIcon size={13} className="text-blue" />
              <span className="text-xs font-semibold text-text">{CHARACTER.class}</span>
            </div>
          </div>
        </div>

        <CardContent className="relative pt-0">
          {/* Avatar row */}
          <div className="flex items-end gap-4 -mt-10 mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue to-blue-hover flex items-center justify-center text-2xl font-black text-white shadow-xl border-4 border-canvas shrink-0">
              {CHARACTER.initials}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-black text-text">{CHARACTER.name}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="blue">Nível {CHARACTER.level}</Badge>
                    <Badge variant="default">{CHARACTER.title}</Badge>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin size={11} />
                      Desde {CHARACTER.joinedAt}
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

          {/* Bio */}
          <p className="text-sm text-text-muted mb-5 leading-relaxed">{CHARACTER.bio}</p>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Progresso para Nível {CHARACTER.level + 1}</span>
              <span className="text-amber font-semibold">
                {CHARACTER.xp.toLocaleString()} / {CHARACTER.xpToNext.toLocaleString()} XP
              </span>
            </div>
            <ProgressBar value={CHARACTER.xp} max={CHARACTER.xpToNext} variant="amber" size="sm" />
            <div className="flex justify-between text-xs">
              <span className="text-text-dim">{xpPercent}% concluído</span>
              <span className="text-text-dim">{(CHARACTER.xpToNext - CHARACTER.xp).toLocaleString()} XP restantes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {STATS.map(({ label, value, icon: Icon, color, bg, border }) => (
          <Card key={label} className={`p-3 text-center border ${border} ${bg}`}>
            <Icon size={16} className={`${color} mx-auto mb-1.5`} />
            <p className="text-lg font-black text-text tabular-nums leading-none">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </Card>
        ))}
      </div>

      {/* ── Bottom two-col layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Left (3/5) */}
        <div className="xl:col-span-3 space-y-5">
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
                {/* Line */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                <div className="space-y-1">
                  {CAREER_STAGES.map((stage, i) => {
                    const Icon = stage.icon;
                    const isCurrent = "current" in stage && stage.current;
                    return (
                      <div
                        key={i}
                        className={`relative flex items-center gap-4 p-3 rounded-xl transition-all ${
                          isCurrent ? "bg-blue/5 border border-blue/20" :
                          stage.done ? "opacity-60" : "opacity-40"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                          isCurrent ? "bg-blue border-blue-border shadow-[0_0_12px_rgba(59,130,246,0.4)]" :
                          stage.done ? "bg-emerald/20 border-emerald-border" :
                          "bg-surface-raised border-border"
                        }`}>
                          <Icon size={14} className={isCurrent ? "text-white" : stage.done ? "text-emerald" : "text-text-dim"} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${isCurrent ? "text-blue" : stage.done ? "text-text" : "text-text-dim"}`}>
                            {stage.title}
                          </p>
                          <p className="text-xs text-text-dim">Nível {stage.level}</p>
                        </div>
                        {isCurrent && (
                          <Badge variant="blue">Atual</Badge>
                        )}
                        {stage.done && !isCurrent && (
                          <CheckCircle2 size={14} className="text-emerald" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg border border-amber/20 bg-amber/5">
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={13} className="text-amber" />
                  <p className="text-xs font-semibold text-text">Próxima classe: Especialista</p>
                </div>
                <p className="text-xs text-text-muted">Alcance o Nível 10 para desbloquear o título de Especialista.</p>
                <ProgressBar value={7} max={10} variant="amber" size="xs" className="mt-2" />
                <p className="text-xs text-text-dim mt-1">Nível 7/10</p>
              </div>
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
                <span className="text-xs text-text-muted">3 de 10</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-3">
                {RECENT_BADGES.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.title} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-surface-raised">
                      <div className="w-10 h-10 rounded-xl border border-border bg-surface-overlay flex items-center justify-center">
                        <Icon size={18} className={b.color} />
                      </div>
                      <p className="text-xs font-medium text-text text-center leading-tight">{b.title}</p>
                      <span className="text-xs text-text-dim">{b.rarity}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right (2/5) */}
        <div className="xl:col-span-2 space-y-5">
          {/* Active Questlines */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-text-muted" />
                <h3 className="text-sm font-semibold text-text">Questlines Ativas</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {ACTIVE_QUESTLINES.map((q) => (
                <div key={q.title} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text">{q.title}</p>
                    <span className="text-xs text-text-muted">{q.missions}</span>
                  </div>
                  <ProgressBar value={q.progress} variant="blue" size="sm" showLabel />
                  <p className="text-xs text-amber font-medium">⚡ {q.xp} XP</p>
                </div>
              ))}
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
              {timelineItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3 py-2 border-t border-border first:border-0 first:pt-0">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 bg-surface-overlay border-border`}>
                      <Icon size={12} className={item.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-muted">{item.action}</p>
                      <p className="text-sm font-medium text-text leading-tight">{item.title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {item.xp > 0 && (
                        <span className="text-xs font-semibold text-amber">+{item.xp}</span>
                      )}
                      <p className="text-xs text-text-dim mt-0.5">{item.date}</p>
                    </div>
                  </div>
                );
              })}

              {TIMELINE.length > 3 && (
                <button
                  onClick={() => setTimelineExpanded(!timelineExpanded)}
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors pt-1"
                >
                  <ChevronRight size={12} className={`transition-transform ${timelineExpanded ? "rotate-90" : ""}`} />
                  {timelineExpanded ? "Ver menos" : `Ver mais (${TIMELINE.length - 3})`}
                </button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
