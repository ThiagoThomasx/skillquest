"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, Calendar, Zap, BookOpen, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useReviewStore } from "@/stores/review-store";
import { useProgressStore } from "@/stores/progress-store";
import { useActivityStore } from "@/stores/activity-store";
import type { ReviewItem, ReviewDifficulty } from "@/stores/review-store";

const INTERVAL_LABEL: Record<number, string> = {
  1: "1 dia",
  7: "7 dias",
  30: "30 dias",
  90: "90 dias",
};

const DIFFICULTY_OPTIONS: { value: ReviewDifficulty; label: string; color: string }[] = [
  { value: "easy", label: "Fácil", color: "text-emerald" },
  { value: "medium", label: "Médio", color: "text-amber" },
  { value: "hard", label: "Difícil", color: "text-red-400" },
];

function formatDueDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function ReviewCard({ item, onComplete }: { item: ReviewItem; onComplete: (id: string, difficulty?: ReviewDifficulty) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ReviewDifficulty | undefined>(undefined);

  return (
    <Card className="p-4 flex flex-col gap-3 border-border bg-surface-raised">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue/10 border border-blue-border flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen size={14} className="text-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text truncate">{item.missionTitle}</p>
          {item.pathTitle && (
            <p className="text-xs text-text-muted mt-0.5">{item.pathTitle}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="default" className="text-[10px] px-1.5 py-0.5">
              Intervalo {INTERVAL_LABEL[item.interval]}
            </Badge>
            <span className="text-[10px] text-text-muted">
              Criada {formatDueDate(item.createdAt)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-text-muted hover:text-text transition-colors p-1"
        >
          <ChevronDown size={14} className={expanded ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 pt-1 border-t border-border">
          <p className="text-xs text-text-muted">Como foi lembrar desse conteúdo?</p>
          <div className="flex gap-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedDifficulty(opt.value)}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                  selectedDifficulty === opt.value
                    ? "border-blue bg-blue/10 text-text"
                    : "border-border text-text-muted hover:border-border/80"
                }`}
              >
                <span className={opt.color}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        size="sm"
        onClick={() => onComplete(item.id, selectedDifficulty)}
        className="w-full text-xs"
      >
        <CheckCircle2 size={13} className="mr-1.5" />
        Marcar como revisado · +10 XP
      </Button>
    </Card>
  );
}

function EmptySection({ label }: { label: string }) {
  return (
    <p className="text-xs text-text-muted text-center py-4 italic">
      Nenhuma revisão {label}.
    </p>
  );
}

export default function ReviewPage() {
  const { getOverdue, getToday, getUpcoming, completeReview, reviews } = useReviewStore();
  const { addXP } = useProgressStore();
  const { addEvent } = useActivityStore();

  const overdue = getOverdue();
  const today = getToday();
  const upcoming = getUpcoming();
  const completedAll = reviews.filter((r) => r.completedAt !== null);

  function handleComplete(id: string, difficulty?: ReviewDifficulty) {
    const xp = completeReview(id, difficulty);
    addXP(xp, "other");
    addEvent({
      type: "mission_started",
      title: "Revisão concluída",
      description: `+${xp} XP`,
      xpGained: xp,
    });
  }

  const pendingCount = overdue.length + today.length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-text">Revisão Inteligente</h1>
          <p className="text-sm text-text-muted mt-0.5">Revisão espaçada para melhorar retenção</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xl font-black text-text">{pendingCount}</p>
            <p className="text-[10px] text-text-muted">pendentes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-emerald">{completedAll.length}</p>
            <p className="text-[10px] text-text-muted">concluídas</p>
          </div>
        </div>
      </div>

      {/* Overdue */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={15} className="text-red-400" />
          <h2 className="text-sm font-bold text-text">Vencidas</h2>
          {overdue.length > 0 && (
            <Badge variant="rose" className="text-[10px] ml-auto">{overdue.length}</Badge>
          )}
        </div>
        {overdue.length === 0
          ? <EmptySection label="vencidas" />
          : overdue.map((item) => (
              <div key={item.id} className="mb-3">
                <ReviewCard item={item} onComplete={handleComplete} />
              </div>
            ))
        }
      </section>

      {/* Today */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={15} className="text-amber" />
          <h2 className="text-sm font-bold text-text">Para hoje</h2>
          {today.length > 0 && (
            <Badge variant="amber" className="text-[10px] ml-auto">{today.length}</Badge>
          )}
        </div>
        {today.length === 0
          ? <EmptySection label="para hoje" />
          : today.map((item) => (
              <div key={item.id} className="mb-3">
                <ReviewCard item={item} onComplete={handleComplete} />
              </div>
            ))
        }
      </section>

      {/* Upcoming */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={15} className="text-blue" />
          <h2 className="text-sm font-bold text-text">Próximas</h2>
        </div>
        {upcoming.length === 0
          ? <EmptySection label="próximas agendadas" />
          : (
            <div className="flex flex-col gap-2">
              {upcoming.map((item) => (
                <Card key={item.id} className="p-3 flex items-center gap-3 border-border bg-surface-raised opacity-70">
                  <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center shrink-0">
                    <Calendar size={12} className="text-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text truncate">{item.missionTitle}</p>
                    <p className="text-[10px] text-text-muted">
                      Intervalo {INTERVAL_LABEL[item.interval]} · vence {formatDueDate(item.dueAt)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )
        }
      </section>

      {/* Empty state */}
      {reviews.length === 0 && (
        <Card className="p-8 text-center border-border">
          <Zap size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm font-semibold text-text mb-1">Nenhuma revisão ainda</p>
          <p className="text-xs text-text-muted">
            Conclua uma sessão de estudo para criar revisões automáticas.
          </p>
        </Card>
      )}
    </div>
  );
}
