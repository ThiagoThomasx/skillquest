import { Target, Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DIFFICULTY_LABEL } from "@/constants";
import { formatDuration } from "@/utils/format";
import type { Mission } from "@/types";

const difficultyVariant: Record<string, "blue" | "amber" | "rose"> = {
  easy: "blue",
  medium: "amber",
  hard: "rose",
};

const statusIconColor: Record<string, string> = {
  completed: "text-emerald",
  active: "text-blue",
  available: "text-text-dim",
  locked: "text-text-dim",
};

interface MissionCardProps {
  mission: Mission;
  onStart?: (id: string) => void;
  onContinue?: (id: string) => void;
}

export function MissionCard({ mission, onStart, onContinue }: MissionCardProps) {
  const { id, title, pathTitle, xpReward, estimatedMinutes, difficulty, status, progress } = mission;

  const actionLabel = status === "completed" ? "Revisar" : status === "active" ? "Continuar" : "Iniciar";
  const handleAction = () => {
    if (status === "active") onContinue?.(id);
    else onStart?.(id);
  };

  return (
    <Card hoverable={status !== "completed"} className="p-4">
      <div className="flex items-center gap-4">
        <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border ${
          status === "completed" ? "bg-emerald/10 border-emerald-border" :
          status === "active" ? "bg-blue/10 border-blue-border" :
          "bg-surface-overlay border-border"
        }`}>
          <Target size={15} className={statusIconColor[status]} />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-text">{title}</p>
            <Badge variant={difficultyVariant[difficulty]}>{DIFFICULTY_LABEL[difficulty]}</Badge>
            {status === "completed" && <Badge variant="emerald">Completa</Badge>}
            {status === "active" && <Badge variant="blue">Em andamento</Badge>}
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{pathTitle}</span>
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>{formatDuration(estimatedMinutes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={10} className="text-amber" />
              <span className="text-amber font-medium">{xpReward} XP</span>
            </div>
          </div>
          {status === "active" && (
            <ProgressBar value={progress} variant="blue" size="sm" showLabel />
          )}
        </div>

        <Button
          variant={status === "completed" ? "ghost" : status === "active" ? "primary" : "secondary"}
          size="sm"
          className="shrink-0"
          onClick={handleAction}
          disabled={status === "locked"}
        >
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}
