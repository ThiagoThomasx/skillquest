import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Zap, Target, Award, Flame, Calendar, Edit } from "lucide-react";

const stats = [
  { label: "XP Total", value: "2.450", icon: Zap, color: "text-amber" },
  { label: "Missões", value: "12", icon: Target, color: "text-blue" },
  { label: "Conquistas", value: "3", icon: Award, color: "text-emerald" },
  { label: "Sequência", value: "7d", icon: Flame, color: "text-rose" },
];

const recentActivity = [
  { action: "Completou missão", title: "Variáveis CSS e temas", xp: 100, date: "Hoje" },
  { action: "Conquista desbloqueada", title: "Sequência de Fogo", xp: 50, date: "Ontem" },
  { action: "Completou missão", title: "Fundamentos de TypeScript", xp: 150, date: "19 Jun" },
];

export default function ProfilePage() {
  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header card */}
      <Card className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-blue/20 via-blue/5 to-transparent border-b border-border" />
        <CardContent className="relative pt-0">
          <div className="flex items-end gap-4 -mt-7 mb-4">
            <div className="w-14 h-14 rounded-xl bg-blue flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0">
              T
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-text">Thiago Thomas</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="blue">Nível 7</Badge>
                <Badge variant="default">Frontend Developer</Badge>
                <span className="text-xs text-text-muted">Membro desde Jun 2026</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="ml-auto">
              <Edit size={13} />
              Editar
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-muted">
              <span>2.450 / 3.000 XP para Nível 8</span>
              <span>82%</span>
            </div>
            <ProgressBar value={2450} max={3000} variant="blue" />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4 text-center">
            <Icon size={16} className={`${color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-text tabular-nums">{value}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-text-muted" />
            <h3 className="text-sm font-semibold text-text">Atividade Recente</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-t border-border first:border-0 first:pt-0">
              <div>
                <p className="text-xs text-text-muted">{item.action}</p>
                <p className="text-sm font-medium text-text">{item.title}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Zap size={11} className="text-amber" />
                  <span className="text-sm font-semibold text-amber">+{item.xp}</span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
