"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play, Pause, RotateCcw, CheckCircle2, X, Timer,
  Zap, Clock, FileText, BookOpen, AlertTriangle, Check,
  Map, Layers, Brain, Battery, Link2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useStudySessionStore } from "@/stores/study-session-store";
import { useMissionsStore } from "@/stores/missions-store";
import { useDailyQuestStore } from "@/stores/daily-quest-store";
import { useActivityStore } from "@/stores/activity-store";
import { useProgressStore } from "@/stores/progress-store";
import { useQuestlinesStore } from "@/stores/questlines-store";
import { getNextModule } from "@/utils/questline-engine";
import type { SessionReflection } from "@/stores/study-session-store";

function formatTime(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const EMPTY_REFLECTION: SessionReflection = {
  whatILearned: "",
  difficulty: "",
  energyFocus: "",
  links: "",
};

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
  const { addXP } = useProgressStore();
  const { questlines } = useQuestlinesStore();

  const mission = missions.find((m) => m.id === activeMissionId) ?? null;
  const activeQuestline = questlines.find((q) => q.status === "active") ?? null;
  const currentModule = activeQuestline && mission
    ? getNextModule(activeQuestline, missions)
    : null;

  const [elapsed, setElapsed] = useState(0);
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(new Set());
  const [showAbandoning, setShowAbandoning] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [reflection, setReflection] = useState<SessionReflection>(EMPTY_REFLECTION);
  const [sessionXPEarned, setSessionXPEarned] = useState(0);
  const [missionCompleted, setMissionCompleted] = useState(false);
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
      setShowReflection(false);
      setSessionDone(false);
      setReflection(EMPTY_REFLECTION);
      setSessionXPEarned(0);
      setMissionCompleted(false);
    }
  }, [isSessionOpen, activeMissionId]);

  if (!isSessionOpen || !mission) return null;

  const estimatedSeconds = mission.estimatedMinutes * 60;
  const progress = Math.min((elapsed / estimatedSeconds) * 100, 100);
  const allObjectivesDone = completedObjectives.size === mission.objectives.length;

  function handleOpenReflection() {
    if (!isPaused) pauseTimer();
    setShowReflection(true);
  }

  function handleSaveSession() {
    const minutesStudied = Math.ceil(elapsed / 60);
    addFocusMinutes(minutesStudied);

    const wasCompleted = allObjectivesDone;
    completeSession(wasCompleted, reflection);

    let xpEarned = 0;
    if (wasCompleted) {
      completeMission(mission!.id);
      markCompleted();
      xpEarned = mission!.isDaily ? mission!.xpReward * 2 : mission!.xpReward;
      addEvent({
        type: "mission_completed",
        title: `Missão concluída: ${mission!.title}`,
        description: `${minutesStudied} min estudados`,
        xpGained: xpEarned,
      });
    } else {
      // Award partial XP for time invested
      xpEarned = Math.max(5, Math.min(minutesStudied * 2, Math.floor(mission!.xpReward / 3)));
      addXP(xpEarned, "other");
      addEvent({
        type: "mission_started",
        title: `Sessão registrada: ${mission!.title}`,
        description: `${minutesStudied} min estudados · +${xpEarned} XP`,
        xpGained: xpEarned,
      });
    }

    setSessionXPEarned(xpEarned);
    setMissionCompleted(wasCompleted);
    setShowReflection(false);
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

  function updateReflection<K extends keyof SessionReflection>(key: K, value: SessionReflection[K]) {
    setReflection((prev) => ({ ...prev, [key]: value }));
  }

  /* ─── Done Screen ─────────────────────────────────────────────────── */
  if (sessionDone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <Card className="w-full max-w-md p-8 text-center border-emerald/30 bg-surface-raised">
          <div className="w-16 h-16 rounded-full bg-emerald/10 border border-emerald/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald" />
          </div>
          <h2 className="text-xl font-black text-text mb-2">Sessão Salva!</h2>
          <p className="text-sm text-text-muted mb-1">
            {formatTime(elapsed)} de estudo registrados
          </p>
          {sessionXPEarned > 0 && (
            <p className="text-sm font-bold text-amber mb-1">+{sessionXPEarned} XP ganhos</p>
          )}
          {missionCompleted ? (
            <p className="text-sm text-emerald font-semibold mb-6">
              Missão concluída! 🎯
            </p>
          ) : (
            <p className="text-xs text-text-muted mb-6">
              Progresso salvo. Continue depois para concluir a missão.
            </p>
          )}
          <Button variant="primary" className="w-full" onClick={closeSession}>
            Fechar
          </Button>
        </Card>
      </div>
    );
  }

  /* ─── Abandon Confirm ─────────────────────────────────────────────── */
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

  /* ─── Reflection Form ─────────────────────────────────────────────── */
  if (showReflection) {
    const minutesStudied = Math.ceil(elapsed / 60);

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
        <div className="w-full sm:max-w-lg bg-surface border border-border-strong rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-blue" />
              <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Reflexão da Sessão</span>
            </div>
            <button onClick={() => setShowReflection(false)} className="text-text-dim hover:text-text transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-5">

            {/* Time summary */}
            <div className="bg-canvas rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0">
                <Timer size={20} className="text-blue" />
              </div>
              <div>
                <p className="text-2xl font-black text-text tabular-nums">{formatTime(elapsed)}</p>
                <p className="text-xs text-text-muted">{minutesStudied} min · {activeMissionTitle}</p>
              </div>
              {allObjectivesDone && (
                <div className="ml-auto">
                  <span className="text-xs font-bold bg-emerald/10 text-emerald border border-emerald/20 rounded-full px-3 py-1">
                    Missão concluída!
                  </span>
                </div>
              )}
            </div>

            {/* What I learned */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-2">
                <FileText size={12} /> O que aprendi
              </label>
              <textarea
                value={reflection.whatILearned}
                onChange={(e) => updateReflection("whatILearned", e.target.value)}
                placeholder="Descreva os principais conceitos ou habilidades que você absorveu nesta sessão..."
                className="w-full h-28 bg-canvas border border-border rounded-lg p-3 text-sm text-text placeholder:text-text-dim resize-none focus:outline-none focus:border-blue/50"
              />
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
                Dificuldade percebida
              </p>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as const).map((d) => {
                  const labels = { easy: "Fácil", medium: "Médio", hard: "Difícil" };
                  const colors = {
                    easy: reflection.difficulty === d ? "bg-emerald/15 border-emerald/40 text-emerald" : "border-border text-text-muted hover:border-emerald/30",
                    medium: reflection.difficulty === d ? "bg-amber/15 border-amber/40 text-amber" : "border-border text-text-muted hover:border-amber/30",
                    hard: reflection.difficulty === d ? "bg-rose/15 border-rose/40 text-rose" : "border-border text-text-muted hover:border-rose/30",
                  };
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => updateReflection("difficulty", reflection.difficulty === d ? "" : d)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${colors[d]}`}
                    >
                      {labels[d]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy / Focus */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                <Battery size={12} /> Energia / Foco
              </p>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((e) => {
                  const labels = { low: "Baixo", medium: "Médio", high: "Alto" };
                  const isSelected = reflection.energyFocus === e;
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => updateReflection("energyFocus", reflection.energyFocus === e ? "" : e)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                        isSelected
                          ? "bg-blue/15 border-blue/40 text-blue"
                          : "border-border text-text-muted hover:border-blue/30"
                      }`}
                    >
                      {labels[e]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Links / Observations */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-2">
                <Link2 size={12} /> Links ou observações <span className="font-normal normal-case text-text-dim">(opcional)</span>
              </label>
              <input
                type="text"
                value={reflection.links}
                onChange={(e) => updateReflection("links", e.target.value)}
                placeholder="Links de referência, observações extras..."
                className="w-full bg-canvas border border-border rounded-lg p-3 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-blue/50"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-border flex gap-3">
            <Button variant="outline" onClick={() => setShowReflection(false)} className="flex-1">
              Voltar
            </Button>
            <Button variant="primary" onClick={handleSaveSession} className="flex-1">
              <CheckCircle2 size={14} className="mr-1.5" />
              Salvar Sessão
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Active Session ──────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-surface border border-border-strong rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen size={16} className="text-blue shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Sessão de Estudo</span>
          </div>
          <button onClick={closeSession} className="text-text-dim hover:text-text transition-colors p-1 shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Mission / path / module context */}
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              {mission.pathTitle && (
                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <Map size={10} className="text-sky" />
                  {mission.pathTitle}
                </span>
              )}
              {currentModule && (
                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <Layers size={10} className="text-blue" />
                  {currentModule.title}
                </span>
              )}
            </div>
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
              <div className="w-9" />
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

          {/* Rewards */}
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
            onClick={handleOpenReflection}
          >
            <CheckCircle2 size={14} className="mr-1.5" />
            {allObjectivesDone ? "Concluir Missão" : "Registrar Sessão"}
          </Button>
        </div>
      </div>
    </div>
  );
}
