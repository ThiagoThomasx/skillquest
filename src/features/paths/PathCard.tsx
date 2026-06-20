import { BookOpen, Lock, CheckCircle, Zap } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { LearningPath } from "@/types";

interface PathCardProps {
  path: LearningPath;
  onAction?: (id: string) => void;
}

export function PathCard({ path, onAction }: PathCardProps) {
  const { id, title, description, totalMissions, xpReward, status, tags, progress } = path;

  const iconClass = status === "completed" ? "text-emerald" : status === "locked" ? "text-text-dim" : "text-blue";
  const iconBg = status === "completed" ? "bg-emerald/10 border-emerald-border" : status === "locked" ? "bg-surface-overlay border-border" : "bg-blue/10 border-blue-border";

  return (
    <Card hoverable={status !== "locked"} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${iconBg}`}>
              {status === "completed" ? <CheckCircle size={16} className={iconClass} /> :
               status === "locked" ? <Lock size={16} className={iconClass} /> :
               <BookOpen size={16} className={iconClass} />}
            </div>
            <div>
              <h3 className="font-semibold text-text">{title}</h3>
              <p className="text-sm text-text-muted mt-0.5">{description}</p>
            </div>
          </div>
          <Badge variant={status === "completed" ? "emerald" : status === "locked" ? "default" : "blue"}>
            {status === "completed" ? "Completa" : status === "locked" ? "Bloqueada" : "Ativa"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => <Badge key={tag} variant="default">{tag}</Badge>)}
        </div>

        {status !== "locked" && (
          <ProgressBar value={progress} variant={status === "completed" ? "emerald" : "blue"} showLabel />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span>{totalMissions} missões</span>
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-amber" />
              <span className="text-amber font-medium">{xpReward.toLocaleString()} XP</span>
            </div>
          </div>
          <Button
            variant={status === "locked" ? "secondary" : status === "completed" ? "ghost" : "primary"}
            size="sm"
            disabled={status === "locked"}
            onClick={() => onAction?.(id)}
          >
            {status === "completed" ? "Revisar" : status === "locked" ? "Bloqueada" : "Continuar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
