import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Zap,
  Target,
  Award,
  Flame,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  Star,
} from "lucide-react";

const stats = [
  { label: "XP Total", value: "2.450", delta: "+150 esta semana", icon: Zap, color: "text-amber", bg: "bg-amber/10 border-amber-border" },
  { label: "Missões", value: "12", delta: "3 em andamento", icon: Target, color: "text-blue", bg: "bg-blue/10 border-blue-border" },
  { label: "Conquistas", value: "5", delta: "1 próxima", icon: Award, color: "text-emerald", bg: "bg-emerald/10 border-emerald-border" },
  { label: "Sequência", value: "7d", delta: "Recorde pessoal", icon: Flame, color: "text-rose", bg: "bg-rose/10 border-rose-border" },
];

const currentMissions = [
  { title: "React Hooks na Prática", path: "Frontend", xp: 200, progress: 65, timeLeft: "~20 min" },
  { title: "Next.js App Router", path: "Frontend", xp: 175, progress: 30, timeLeft: "~35 min" },
];

const recentCompleted = [
  { title: "Fundamentos de TypeScript", xp: 150, path: "Frontend" },
  { title: "Variáveis CSS e Temas", xp: 100, path: "Frontend" },
  { title: "Git Flow Avançado", xp: 120, path: "DevOps" },
];

const nextBadge = {
  name: "TypeScript Expert",
  description: "Complete 3 missões de TypeScript",
  progress: 2,
  total: 3,
  xpReward: 500,
};

export default function DashboardPage() {
  return (
    <div className="space-y-5">

      {/* ── Hero: Nível + Progressão ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Level card — ocupa 2/3 no ultrawide */}
        <Card className="xl:col-span-2 p-5 bg-surface-raised border-border-strong">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-widest mb-1">Sua Progressão</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-text">Nível 7</span>
                <Badge variant="blue">Frontend Developer</Badge>
              </div>
              <p className="text-sm text-text-muted mt-1">
                <span className="text-amber font-semibold">550 XP</span> para o próximo nível
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-text-muted">2.450 / 3.000 XP</span>
              <div className="flex items-center gap-1 text-amber">
                <TrendingUp size={13} />
                <span className="text-xs font-semibold">+8% esta semana</span>
              </div>
            </div>
          </div>

          <ProgressBar value={2450} max={3000} variant="blue" size="md" className="mb-1" />

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-5">
              <div>
                <p className="text-xs text-text-muted">XP Ganho (7d)</p>
                <p className="text-sm font-semibold text-text mt-0.5">+850 XP</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-xs text-text-muted">Missões (7d)</p>
                <p className="text-sm font-semibold text-text mt-0.5">4 completas</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-xs text-text-muted">Ranking</p>
                <p className="text-sm font-semibold text-text mt-0.5">#34 global</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Ver histórico <ChevronRight size={13} />
            </Button>
          </div>
        </Card>

        {/* Próxima Conquista */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-text-muted uppercase tracking-widest">Próxima Conquista</p>
            <Star size={14} className="text-amber" />
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber-border flex items-center justify-center shrink-0">
              <Award size={18} className="text-amber" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{nextBadge.name}</p>
              <p className="text-xs text-text-muted mt-0.5">{nextBadge.description}</p>
            </div>
          </div>

          <ProgressBar value={nextBadge.progress} max={nextBadge.total} variant="amber" size="sm" className="mb-2" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">{nextBadge.progress} de {nextBadge.total} missões</span>
            <div className="flex items-center gap-1">
              <Zap size={11} className="text-amber" />
              <span className="text-xs font-semibold text-amber">+{nextBadge.xpReward} XP</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="amber" size="sm" className="w-full">
              Continuar trilha <ArrowRight size={13} />
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, delta, icon: Icon, color, bg }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border ${bg}`}>
                <Icon size={14} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-text tabular-nums">{value}</p>
            <p className="text-xs font-medium text-text-muted mt-0.5">{label}</p>
            <p className="text-[11px] text-text-dim mt-1">{delta}</p>
          </Card>
        ))}
      </div>

      {/* ── Missões Atuais + Atividade Recente ───────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Current Quests — destaque principal */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Missões em Andamento</h3>
            <Button variant="ghost" size="sm">
              Ver todas <ChevronRight size={13} />
            </Button>
          </div>

          {currentMissions.map((m) => (
            <Card key={m.title} hoverable className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue/10 border border-blue-border flex items-center justify-center shrink-0">
                  <Target size={14} className="text-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{m.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-muted">{m.path}</span>
                    <span className="text-text-dim">·</span>
                    <div className="flex items-center gap-1 text-text-muted">
                      <Clock size={10} />
                      <span className="text-xs">{m.timeLeft}</span>
                    </div>
                    <span className="text-text-dim">·</span>
                    <div className="flex items-center gap-1">
                      <Zap size={10} className="text-amber" />
                      <span className="text-xs font-medium text-amber">{m.xp} XP</span>
                    </div>
                  </div>
                </div>
                <Button variant="primary" size="sm" className="shrink-0">
                  Continuar
                </Button>
              </div>
              <ProgressBar value={m.progress} variant="blue" size="sm" showLabel />
            </Card>
          ))}

          {/* Daily CTA */}
          <Card variant="blue" className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue/20 border border-blue-border flex items-center justify-center">
                <Flame size={14} className="text-blue" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Desafio Diário</p>
                <p className="text-xs text-text-muted">Complete uma missão hoje · bônus 2× XP</p>
              </div>
            </div>
            <Button variant="primary" size="sm" className="shrink-0">Iniciar</Button>
          </Card>
        </div>

        {/* Activity feed */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Atividade Recente</h3>
            <Button variant="ghost" size="sm">
              Tudo <ChevronRight size={13} />
            </Button>
          </div>

          <Card className="divide-y divide-border">
            {recentCompleted.map((m) => (
              <div key={m.title} className="flex items-center gap-3 px-4 py-3">
                <CheckCircle2 size={14} className="text-emerald shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text truncate">{m.title}</p>
                  <p className="text-[11px] text-text-muted">{m.path}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Zap size={10} className="text-amber" />
                  <span className="text-xs font-semibold text-amber">+{m.xp}</span>
                </div>
              </div>
            ))}
          </Card>

          {/* Trilha recomendada */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={13} className="text-sky" />
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Trilha Recomendada</p>
            </div>
            <p className="text-sm font-semibold text-text mb-1">React Full-Stack</p>
            <p className="text-xs text-text-muted mb-3">8 missões · Nível Intermediário</p>
            <ProgressBar value={37} max={100} variant="sky" size="xs" className="mb-2" />
            <p className="text-[11px] text-text-muted">3 de 8 missões completas</p>
          </Card>
        </div>

      </div>
    </div>
  );
}
