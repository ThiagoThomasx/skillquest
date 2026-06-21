"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play, Pause, RotateCcw, CheckCircle2, X, Timer,
  Zap, Clock, FileText, BookOpen, AlertTriangle, Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useStudySessionStore } from "@/stores/study-session-store";
import { useMissionsStore } from "@/stores/missions-store";
import { useDailyQuestStore } from "@/stores/daily-quest-store";
import { useActivityStore } from "@/stores/activity-store";

function formatTime(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function StudySessionModal() {
  const {
    isSessionOpen, closeSession, activeMissionId, activeMissionTitle,
    isPaused, startTimer, pauseTimer, resetTimer,
    sessionNotes, setSessionNotes, completeSession, abandonSession,
    getElapsedSeconds,
  } = useStudySessionStore();

  const { missions, completeMission } = useMissionsStore();
  const { addFocusMinutes, markCompleted } = useDailyQuestStore();
  const { addEvent } = useActivityStore();

  const mission = missions.find((m) => m.id === activeMissionId) ?? null;
  const [elapsed, setElapsed] = useState(0);
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(new Set());
  const [showAbandoning, setShowAbandoning] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live timer
  useEffect(() => {
    if (!isSessionOpen) return;
    const tick = () => setElapsed(Math.floor(getElapsedSeconds()));
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isSessionOpen, isPaused, getElapsedSeconds]);

  // Reset local state when modal opens for a new mission
  useEffect(() => {
    if (isSessionOpen) {
      setCompletedObjectives(new Set());
      setShowAbandoning(false);
      setSessionDone(false);
    }
  }, [isSessionOpen, activeMissionId]);

  if (!isSessionOpen || !mission) return null;

  const estimatedSeconds = mission.estimatedMinutes * 60;
  const progress = Math.min((elapsed / estimatedSeconds) * 100, 100);
  const allObjectivesDone = completedObjectives.size === mission.objectives.length;

  function handleComplete() {
    const minutesStudied = Math.ceil(elapsed / 60);
    addFocusMinutes(minutesStudied);

    const missionWasCompleted = allObjectivesDone;
    completeSession(missionWasCompleted);

    if (missionWasCompleted) {
      completeMission(mission!.id);
      markCompleted();
      addEvent({
        type: "mission_completed",
        title: `Sessão concluída: ${mission!.title}`,
        description: `${minutesStudied} min estudados`,
        xpGained: 0,
      });
    } else {
      addEvent({
        type: "mission_started",
        title: `Sessão parcial: ${mission!.title}`,
        description: `${minutesStudied} min estudados`,
        xpGained: 0,
      });
    }
    setSessionDone(true);
  }

  function handleAbandon() {
    abandonSession();
    setShowAbandoning(false);
  }

  function toggleObjective(i: number) {
    setCompletedObjectives((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  if (sessionDone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <Card className="w-full max-w-md p-8 text-center border-emerald/30 bg-surface-raised">
          <div className="w-16 h-16 rounded-full bg-emerald/10 border border-emerald/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald" />
          </div>
          <h2 className="text-xl font-black text-text mb-2">Sessão Registrada!</h2>
          <p className="text-sm text-text-muted mb-1">
            {formatTime(elapsed)} de estudo
          </p>
          {allObjectivesDone && (
            <p className="text-sm text-emerald font-semibold mb-4">
              Missão concluída! XP concedido.
            </p>
          )}
          {!allObjectivesDone && (
            <p className="text-xs text-text-muted mb-4">
              Progresso salvo. Continue depois para concluir a missão.
            </p>
          )}
          <Button variant="primary" className="w-full" onClick={() => setSessionDone(false)}>
            Fechar
          </Button>
        </Card>
      </div>
    );
  }

  if (showAbandoning) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <Card className="w-full max-w-sm p-6 border-rose/30 bg-surface-raised">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} className="text-rose" />
            <h3 className="text-base font-bold text-text">Abandonar sessão?</h3>
          </div>
          <p className="text-sm text-text-muted mb-5">
            O tempo cronometrado não será salvo. A missão permanece em andamento.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowAbandoning(false)}>
              Continuar
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleAbandon}>
              Abandonar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-surface border border-border-strong rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-blue" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Sessão de Estudo</span>
          </div>
          <button onClick={closeSession} className="text-text-dim hover:text-text transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Mission info */}
          <div>
            <h2 className="text-lg font-black text-text mb-0.5">{activeMissionTitle}</h2>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1"><Clock size={11} />~{mission.estimatedMinutes} min estimados</span>
              <span className="flex items-center gap-1"><Zap size={11} className="text-amber" />{mission.isDaily ? mission.xpReward * 2 : mission.xpReward} XP</span>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-canvas rounded-xl border border-border p-5 text-center">
            <div className="text-5xl font-black tabular-nums text-text mb-3 tracking-tight">
              {formatTime(elapsed)}
            </div>
            <ProgressBar value={progress} variant="blue" size="sm" className="mb-4" />
            <div className="flex items-center justify-center gap-3">
              <Button variant="ghost" size="sm" onClick={resetTimer} title="Resetar">
                <RotateCcw size={14} />
              </Button>
              {isPaused ? (
                <Button variant="primary" onClick={startTimer} className="px-8">
                  <Play size={15} className="mr-1.5" /> Iniciar
                </Button>
              ) : (
                <Button variant="amber" onClick={pauseTimer} className="px-8">
                  <Pause size={15} className="mr-1.5" /> Pausar
                </Button>
              )}
              <div className="w-9" /> {/* spacer */}
            </div>
          </div>

          {/* Objectives checklist */}
          {mission.objectives.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                <Check size={12} /> Objetivos
                <span className="ml-auto text-text-dim normal-case font-normal">{completedObjectives.size}/{mission.objectives.length}</span>
              </h3>
              <div className="space-y-2">
                {mission.objectives.map((obj, i) => (
                  <button
                    key={i}
                    onClick={() => toggleObjective(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                      completedObjectives.has(i)
                        ? "bg-emerald/5 border-emerald/20 text-text-muted line-through"
                        : "bg-surface-raised border-border hover:border-border-strong text-text"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      completedObjectives.has(i) ? "bg-emerald border-emerald" : "border-border-strong"
                    }`}>
                      {completedObjectives.has(i) && <Check size={11} className="text-white" />}
                    </div>
                    <span className="text-sm">{obj}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-2">
              <FileText size={12} /> Notas Rápidas
            </h3>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Anote dúvidas, insights ou próximos passos..."
              className="w-full h-24 bg-canvas border border-border rounded-lg p-3 text-sm text-text placeholder:text-text-dim resize-none focus:outline-none focus:border-blue/50"
            />
          </div>

          {/* Resources */}
          {mission.rewards.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">Recompensas</h3>
              <div className="flex flex-wrap gap-2">
                {mission.rewards.map((r, i) => (
                  <span key={i} className="text-xs bg-amber/10 text-amber border border-amber/20 rounded-full px-3 py-1">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-border flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => setShowAbandoning(true)} className="text-rose hover:text-rose">
            <X size={14} className="mr-1" /> Abandonar
          </Button>
          <Button variant="outline" size="sm" onClick={closeSession} className="ml-auto">
            Pausar e Fechar
          </Button>
          <Button
            variant={allObjectivesDone ? "amber" : "primary"}
            size="sm"
            onClick={handleComplete}
          >
            <CheckCircle2 size={14} className="mr-1.5" />
            {allObjectivesDone ? "Concluir Missão" : "Registrar Sessão"}
          </Button>
        </div>
      </div>
    </div>
  );
}
