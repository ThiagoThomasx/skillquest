import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Zap, Sword, Shield, TrendingUp, Flame, Trophy } from "lucide-react";

const stats = [
  { label: "XP Total", value: "2.450", icon: Zap, color: "text-gold", bg: "bg-gold/10 border-gold-border" },
  { label: "Missões", value: "12", icon: Sword, color: "text-violet", bg: "bg-violet/10 border-violet-border" },
  { label: "Insígnias", value: "5", icon: Shield, color: "text-emerald", bg: "bg-emerald/10 border-emerald/20" },
  { label: "Sequência", value: "7d", icon: Flame, color: "text-rose", bg: "bg-rose/10 border-rose-muted" },
];

const recentMissions = [
  { title: "Fundamentos de TypeScript", xp: 150, status: "completed", progress: 100 },
  { title: "React Hooks Avançado", xp: 200, status: "in-progress", progress: 65 },
  { title: "Next.js App Router", xp: 175, status: "in-progress", progress: 30 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-text">Bem-vindo de volta, Aventureiro</h2>
        <p className="text-text-muted mt-1">Continue sua jornada — você está a 550 XP do próximo nível.</p>
      </div>

      {/* Level card */}
      <Card variant="violet" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-text-muted">Nível atual</p>
            <p className="text-3xl font-bold text-text mt-0.5">Nível 7</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-violet/20 border border-violet-border flex items-center justify-center">
            <Trophy size={24} className="text-violet" />
          </div>
        </div>
        <ProgressBar value={2450} max={3000} variant="violet" size="md" />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-text-muted">2.450 XP</span>
          <span className="text-xs text-text-muted">3.000 XP</span>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-4">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border ${bg} mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-2xl font-bold text-text">{value}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Recent missions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text">Missões Recentes</h3>
          <Button variant="ghost" size="sm">Ver todas</Button>
        </div>
        <div className="space-y-2">
          {recentMissions.map((m) => (
            <Card key={m.title} hoverable className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-text truncate">{m.title}</p>
                    <Badge variant={m.status === "completed" ? "emerald" : "violet"}>
                      {m.status === "completed" ? "Completa" : "Em curso"}
                    </Badge>
                  </div>
                  <ProgressBar value={m.progress} variant={m.status === "completed" ? "emerald" : "violet"} size="sm" showLabel />
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Zap size={12} className="text-gold" />
                  <span className="text-sm font-semibold text-gold">{m.xp}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card variant="gold" className="p-5 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-gold" />
            <span className="text-sm font-semibold text-gold">Missão Diária</span>
          </div>
          <p className="text-text font-medium">Complete 1 missão hoje e ganhe bônus de 2x XP</p>
        </div>
        <Button variant="gold" className="shrink-0">Iniciar</Button>
      </Card>
    </div>
  );
}
