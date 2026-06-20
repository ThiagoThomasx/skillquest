import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Map, Lock, CheckCircle, Zap } from "lucide-react";

const paths = [
  {
    id: 1,
    title: "Desenvolvedor Frontend",
    description: "Domine React, TypeScript e o ecossistema moderno de frontend.",
    missions: 24,
    xp: 4800,
    progress: 45,
    status: "active",
    tags: ["React", "TypeScript", "CSS"],
  },
  {
    id: 2,
    title: "Engenharia Backend",
    description: "APIs REST, bancos de dados, autenticação e arquitetura de sistemas.",
    missions: 32,
    xp: 6400,
    progress: 0,
    status: "locked",
    tags: ["Node.js", "SQL", "Docker"],
  },
  {
    id: 3,
    title: "Fundamentos Web",
    description: "HTML, CSS e JavaScript — a base de tudo.",
    missions: 16,
    xp: 3200,
    progress: 100,
    status: "completed",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

export default function PathsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-text">Trilhas de Aprendizado</h2>
        <p className="text-text-muted mt-1">Escolha seu caminho e siga em frente na jornada.</p>
      </div>

      <div className="grid gap-4">
        {paths.map((path) => (
          <Card key={path.id} hoverable={path.status !== "locked"} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    path.status === "completed"
                      ? "bg-emerald/10 border-emerald/20"
                      : path.status === "locked"
                      ? "bg-surface-overlay border-border"
                      : "bg-violet/10 border-violet-border"
                  }`}>
                    {path.status === "completed" ? (
                      <CheckCircle size={18} className="text-emerald" />
                    ) : path.status === "locked" ? (
                      <Lock size={18} className="text-text-dim" />
                    ) : (
                      <Map size={18} className="text-violet" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{path.title}</h3>
                    <p className="text-sm text-text-muted mt-0.5">{path.description}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    path.status === "completed" ? "emerald" : path.status === "locked" ? "default" : "violet"
                  }
                >
                  {path.status === "completed" ? "Completa" : path.status === "locked" ? "Bloqueada" : "Ativa"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {path.tags.map((tag) => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
              </div>

              {path.status !== "locked" && (
                <ProgressBar
                  value={path.progress}
                  variant={path.status === "completed" ? "emerald" : "violet"}
                  showLabel
                />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span>{path.missions} missões</span>
                  <div className="flex items-center gap-1">
                    <Zap size={12} className="text-gold" />
                    <span className="text-gold font-medium">{path.xp.toLocaleString()} XP</span>
                  </div>
                </div>
                <Button
                  variant={path.status === "locked" ? "secondary" : path.status === "completed" ? "ghost" : "primary"}
                  size="sm"
                  disabled={path.status === "locked"}
                >
                  {path.status === "completed" ? "Revisar" : path.status === "locked" ? "Bloqueada" : "Continuar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
