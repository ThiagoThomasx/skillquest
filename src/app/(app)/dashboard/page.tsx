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
  Trophy,
  MapPin,
  Sparkles,
  BarChart3,
  Skull,
  Sword,
  Wand2,
  Swords,
} from "lucide-react";

// ── Mock data ────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "XP Total",
    value: "2.450",
    delta: "+150 esta semana",
    icon: Zap,
    color: "text-amber",
    bg: "bg-amber/10 border-amber-border",
  },
  {
    label: "Missões",
    value: "12",
    delta: "3 em andamento",
    icon: Target,
    color: "text-blue",
    bg: "bg-blue/10 border-blue-border",
  },
  {
    label: "Conquistas",
    value: "5",
    delta: "1 próxima",
    icon: Award,
    color: "text-emerald",
    bg: "bg-emerald/10 border-emerald-border",
  },
  {
    label: "Sequência",
    value: "7d",
    delta: "Recorde pessoal",
    icon: Flame,
    color: "text-rose",
    bg: "bg-rose/10 border-rose-border",
  },
];

const currentMissions = [
  {
    title: "React Hooks na Prática",
    category: "Frontend",
    xp: 200,
    progress: 65,
    timeLeft: "~20 min",
    difficulty: "Médio",
    mainQuest: true,
    questline: "React Avançado",
  },
  {
    title: "Next.js App Router",
    category: "Frontend",
    xp: 175,
    progress: 30,
    timeLeft: "~35 min",
    difficulty: "Difícil",
    questline: "React Avançado",
  },
  {
    title: "Desafio Diário: CSS Grid",
    category: "Frontend",
    xp: 250,
    progress: 0,
    timeLeft: "~15 min",
    difficulty: "Fácil",
    daily: true,
  },
];

const recentActivity = [
  { title: "Fundamentos de TypeScript", xp: 150, category: "Frontend", time: "há 2h" },
  { title: "Variáveis CSS e Temas", xp: 100, category: "Frontend", time: "ontem" },
  { title: "Git Flow Avançado", xp: 120, category: "DevOps", time: "há 3d" },
  { title: "Badge: Semana Dedicada", xp: 200, category: "Conquista", time: "há 5d" },
];

const nextBadge = {
  name: "TypeScript Expert",
  description: "Complete 3 missões de TypeScript",
  progress: 2,
  total: 3,
  xpReward: 500,
};

const weeklyStats = [
  { day: "Seg", xp: 120 },
  { day: "Ter", xp: 85 },
  { day: "Qua", xp: 200 },
  { day: "Qui", xp: 150 },
  { day: "Sex", xp: 175 },
  { day: "Sáb", xp: 90 },
  { day: "Dom", xp: 30 },
];
const maxWeeklyXP = 200;

const recentBadges = [
  { title: "Primeira Missão", icon: Star, rarity: "common" as const },
  { title: "Semana Dedicada", icon: Flame, rarity: "rare" as const },
  { title: "Aprendiz Dedicado", icon: BookOpen, rarity: "rare" as const },
  { title: "Explorador", icon: MapPin, rarity: "epic" as const },
  { title: "React Developer", icon: Zap, rarity: "epic" as const },
  { title: "Lenda Viva", icon: Trophy, rarity: "legendary" as const },
];

const themes = [
  {
    name: "Moderno",
    themeKey: "modern" as const,
    colors: ["#081120", "#0F1A2D", "#3B82F6", "#F59E0B"],
    description: "Navy premium — padrão",
  },
  {
    name: "Pixel Quest",
    themeKey: "pixel-quest" as const,
    colors: ["#0d0d1a", "#1a0d2e", "#7c3aed", "#22C55E"],
    description: "Cyberpunk roxo-neón",
  },
  {
    name: "Fantasy RPG",
    themeKey: "fantasy-rpg" as const,
    colors: ["#120808", "#2d1212", "#c2410c", "#ca8a04"],
    description: "Fogo e ouro épico",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-[1600px]">

      {/* ── Hero Principal ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Hero content — 2/3 */}
        <Card className="xl:col-span-2 relative overflow-hidden border-border-strong bg-surface-raised">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

              {/* Left: Level + XP */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 size={12} className="text-sky" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                    Frontend Mage · Bem-vindo de volta
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-black text-text tracking-tight">Nível 7</h1>
                  <Badge variant="blue">Frontend Developer</Badge>
                </div>

                <p className="text-sm text-text-muted mb-5">
                  <span className="text-amber font-semibold">550 XP</span> para o próximo nível
                </p>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-muted">2.450 XP</span>
                    <span className="text-xs text-text-muted">3.000 XP</span>
                  </div>
                  <ProgressBar value={2450} max={3000} variant="amber" size="md" />
                </div>

                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">XP (7d)</p>
                    <p className="text-sm font-bold text-text mt-0.5">+850 XP</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Missões</p>
                    <p className="text-sm font-bold text-text mt-0.5">4 esta semana</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Ranking</p>
                    <p className="text-sm font-bold text-text mt-0.5">#34 global</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1 text-emerald text-xs font-semibold">
                      <TrendingUp size={12} />
                      <span>+8% esta semana</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Decorative scene */}
              <div className="hidden lg:block h-44">
                <PixelScene />
              </div>
            </div>
          </div>
        </Card>

        {/* Próxima Conquista — 1/3 */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Próxima Conquista
            </p>
            <Star size={14} className="text-amber" />
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber-border flex items-center justify-center shrink-0">
              <Award size={20} className="text-amber" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">{nextBadge.name}</p>
              <p className="text-xs text-text-muted mt-0.5">{nextBadge.description}</p>
            </div>
          </div>

          <ProgressBar value={nextBadge.progress} max={nextBadge.total} variant="amber" size="sm" className="mb-2" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-text-muted">{nextBadge.progress} de {nextBadge.total} missões</span>
            <div className="flex items-center gap-1">
              <Zap size={11} className="text-amber" />
              <span className="text-xs font-bold text-amber">+{nextBadge.xpReward} XP</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border">
            <Button variant="amber" size="sm" className="w-full">
              Continuar trilha <ArrowRight size={13} />
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Cards de Métricas ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, delta, icon: Icon, color, bg }) => (
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

        {/* Missions — 3/5 */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Quests em Andamento</h2>
            <Button variant="ghost" size="sm">
              Ver todas <ChevronRight size={13} />
            </Button>
          </div>

          {currentMissions.map((m) => (
            <Card key={m.title} hoverable className={`p-4 ${m.mainQuest ? "border-amber/20 bg-amber/[0.02]" : ""}`}>
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    m.daily
                      ? "bg-amber/10 border border-amber-border"
                      : m.mainQuest
                        ? "bg-sky/10 border border-sky/30"
                        : "bg-blue/10 border border-blue-border"
                  }`}
                >
                  {m.daily ? (
                    <Flame size={14} className="text-amber" />
                  ) : m.mainQuest ? (
                    <Sword size={14} className="text-sky" />
                  ) : (
                    <Target size={14} className="text-blue" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-text truncate">{m.title}</p>
                    {m.mainQuest && (
                      <span className="text-[10px] font-bold bg-sky/10 text-sky border border-sky/20 rounded-full px-2 py-0.5 shrink-0">
                        Quest Principal
                      </span>
                    )}
                    {m.daily && (
                      <span className="text-[10px] font-bold bg-amber/10 text-amber border border-amber/20 rounded-full px-2 py-0.5 shrink-0">
                        Bônus 2×
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {"questline" in m && m.questline && (
                      <>
                        <span className="text-[10px] text-text-dim">📜 {m.questline}</span>
                        <span className="text-text-dim">·</span>
                      </>
                    )}
                    <span className="text-xs text-text-muted">{m.category}</span>
                    <span className="text-text-dim">·</span>
                    <div className="flex items-center gap-1 text-text-muted">
                      <Clock size={10} />
                      <span className="text-xs">{m.timeLeft}</span>
                    </div>
                    <span className="text-text-dim">·</span>
                    <div className="flex items-center gap-1">
                      <Zap size={10} className="text-amber" />
                      <span className="text-xs font-semibold text-amber">{m.xp} XP</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant={m.daily ? "amber" : "primary"}
                  size="sm"
                  className="shrink-0"
                >
                  {m.progress > 0 ? "Continuar" : "Iniciar"}
                </Button>
              </div>

              {m.progress > 0 && (
                <ProgressBar value={m.progress} variant={m.daily ? "amber" : m.mainQuest ? "sky" : "blue"} size="sm" showLabel />
              )}
            </Card>
          ))}
        </div>

        {/* Activity — 2/5 */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Atividade Recente</h2>
            <Button variant="ghost" size="sm">
              Tudo <ChevronRight size={13} />
            </Button>
          </div>

          <Card className="divide-y divide-border">
            {recentActivity.map((a) => (
              <div key={a.title} className="flex items-center gap-3 px-4 py-3">
                <CheckCircle2 size={14} className="text-emerald shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text truncate">{a.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-text-muted">{a.category}</span>
                    <span className="text-text-dim text-[10px]">·</span>
                    <span className="text-[10px] text-text-dim">{a.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Zap size={10} className="text-amber" />
                  <span className="text-xs font-bold text-amber">+{a.xp}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ── Trilha Recomendada + Conquistas Recentes + Estatísticas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Questline Ativa */}
        <Card className="p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky/10 border border-sky-border flex items-center justify-center">
                <BookOpen size={14} className="text-sky" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Questline Ativa
              </p>
            </div>

            <h3 className="text-base font-bold text-text mb-1">React Avançado</h3>
            <p className="text-xs text-text-muted mb-4">8 quests · Nível Intermediário</p>

            {/* Path progress placeholder */}
            <div className="rounded-lg bg-surface-overlay border border-border h-20 mb-4 flex items-center justify-center">
              <p className="text-xs text-text-dim">Arte da trilha em breve</p>
            </div>

            <ProgressBar value={37} max={100} variant="sky" size="sm" className="mb-2" />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-text-muted">3 de 8 quests</p>
              <Button variant="outline" size="sm">
                Continuar <ArrowRight size={12} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Conquistas Recentes */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Conquistas Recentes
            </p>
            <Button variant="ghost" size="sm">
              Ver todas <ChevronRight size={13} />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {recentBadges.map((b) => (
              <BadgeCard
                key={b.title}
                title={b.title}
                icon={b.icon}
                rarity={b.rarity}
                earned
              />
            ))}
          </div>
        </Card>

        {/* Estatísticas */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} className="text-blue" />
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                XP esta semana
              </p>
            </div>
            <span className="text-xs font-bold text-blue">850 XP</span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-1.5 h-24 mb-3">
            {weeklyStats.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-blue/25 hover:bg-blue/50 transition-colors min-h-[4px]"
                  style={{ height: `${(d.xp / maxWeeklyXP) * 88}px` }}
                />
                <span className="text-[9px] text-text-dim">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-[10px] text-text-muted">Média diária</p>
              <p className="text-sm font-bold text-text">121 XP</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-text-muted">Melhor dia</p>
              <p className="text-sm font-bold text-amber">200 XP</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Classe e Carreira + Próxima conquista ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CareerClassCard />
        </div>

        {/* Boss Battle */}
        <Card className="p-5 relative overflow-hidden border-rose/20">
          <div className="absolute inset-0 bg-gradient-to-br from-rose/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Swords size={14} className="text-rose" />
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Boss Battle
              </p>
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
              Derrote este boss para desbloquear a classe <span className="text-rose font-semibold">Lenda</span> e conquistas épicas.
            </p>

            <ProgressBar value={7} max={18} variant="rose" size="sm" className="mb-2" />
            <p className="text-[11px] text-text-muted">Nível 7 de 18 — Bloqueado</p>
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
            <ThemeOptionCard
              key={t.name}
              name={t.name}
              themeKey={t.themeKey}
              colors={t.colors}
              description={t.description}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
