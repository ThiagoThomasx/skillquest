import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Target, Clock, Zap, Filter, CheckCircle2 } from "lucide-react";

const missions = [
  { id: 1, title: "React Hooks na prática", path: "Frontend", xp: 200, time: "45 min", progress: 65, status: "active", difficulty: "Médio" },
  { id: 2, title: "Tipagem avançada com TypeScript", path: "Frontend", xp: 150, time: "30 min", progress: 0, status: "available", difficulty: "Fácil" },
  { id: 3, title: "Context API vs Zustand", path: "Frontend", xp: 250, time: "60 min", progress: 0, status: "available", difficulty: "Avançado" },
  { id: 4, title: "Variáveis CSS e temas", path: "Frontend", xp: 100, time: "20 min", progress: 100, status: "completed", difficulty: "Fácil" },
  { id: 5, title: "Otimização com useMemo", path: "Frontend", xp: 175, time: "35 min", progress: 100, status: "completed", difficulty: "Médio" },
];

const difficultyBadge: Record<string, "blue" | "amber" | "rose"> = {
  "Fácil": "blue",
  "Médio": "amber",
  "Avançado": "rose",
};

export default function MissionsPage() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">Missões</h2>
          <p className="text-sm text-text-muted mt-0.5">5 missões — 2 completas, 1 em andamento</p>
        </div>
        <Button variant="secondary" size="sm">
          <Filter size={13} />
          Filtrar
        </Button>
      </div>

      <div className="space-y-2">
        {missions.map((m) => (
          <Card key={m.id} hoverable={m.status !== "completed"} className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border ${
                m.status === "completed"
                  ? "bg-emerald/10 border-emerald-border"
                  : m.status === "active"
                  ? "bg-blue/10 border-blue-border"
                  : "bg-surface-overlay border-border"
              }`}>
                {m.status === "completed"
                  ? <CheckCircle2 size={15} className="text-emerald" />
                  : <Target size={15} className={m.status === "active" ? "text-blue" : "text-text-dim"} />
                }
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-text">{m.title}</p>
                  <Badge variant={difficultyBadge[m.difficulty]}>{m.difficulty}</Badge>
                  {m.status === "completed" && <Badge variant="emerald">Completa</Badge>}
                  {m.status === "active" && <Badge variant="blue">Em andamento</Badge>}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{m.path}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{m.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={10} className="text-amber" />
                    <span className="text-amber font-medium">{m.xp} XP</span>
                  </div>
                </div>
                {m.status === "active" && (
                  <ProgressBar value={m.progress} variant="blue" size="xs" showLabel />
                )}
              </div>

              <Button
                variant={m.status === "completed" ? "ghost" : m.status === "active" ? "primary" : "secondary"}
                size="sm"
                className="shrink-0"
              >
                {m.status === "completed" ? "Revisar" : m.status === "active" ? "Continuar" : "Iniciar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
