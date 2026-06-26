"use client";

import { useMemo } from "react";
import { Clock, Calendar, BookOpen, Target, Brain, Zap, BarChart2, CheckCircle2, Circle, Link2, ChevronDown } from "lucide-react";
import { useStudySessionStore, StudySession } from "@/stores/study-session-store";
import { useMissionsStore } from "@/stores/missions-store";
import { cn } from "@/lib/utils";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}min`;
  return `${m}min`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10); // "YYYY-MM-DD"
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function weekAgoTs(): number {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
  "": "",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "text-emerald bg-emerald/10 border-emerald/20",
  medium: "text-amber bg-amber/10 border-amber/20",
  hard: "text-rose bg-rose/10 border-rose/20",
  "": "",
};

// ─── sub-components ─────────────────────────────────────────────────────────

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
};

function StatCard({ icon, label, value, sub, accent = "text-blue" }: StatCardProps) {
  return (
    <div className="rounded-xl bg-surface border border-border p-4 flex items-start gap-3">
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue/10 border border-blue/20", accent === "text-amber" && "bg-amber/10 border-amber/20", accent === "text-emerald" && "bg-emerald/10 border-emerald/20")}>
        <span className={accent}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-text-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-text leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

type SessionCardProps = {
  session: StudySession;
  pathTitle: string;
};

function SessionCard({ session, pathTitle }: SessionCardProps) {
  const diffLabel = DIFFICULTY_LABEL[session.difficulty] || "";
  const diffColor = DIFFICULTY_COLOR[session.difficulty] || "";
  const duration = formatDuration(session.durationSeconds);
  const time = session.endedAt ? formatTime(session.endedAt) : formatTime(session.startedAt);

  return (
    <div className="rounded-xl bg-surface border border-border p-4 space-y-3 hover:border-blue/30 transition-colors">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", session.completed ? "bg-emerald/10 border border-emerald/20" : "bg-surface-raised border border-border")}>
            {session.completed
              ? <CheckCircle2 size={13} className="text-emerald" />
              : <Circle size={13} className="text-text-muted" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text truncate">{session.missionTitle || "Missão sem título"}</p>
            {pathTitle && <p className="text-[11px] text-text-muted truncate">{pathTitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {diffLabel && (
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", diffColor)}>
              {diffLabel}
            </span>
          )}
          <span className="text-[11px] text-text-muted">{time}</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-4 text-[11px] text-text-muted">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {duration}
        </span>
        {session.completed && (
          <span className="flex items-center gap-1 text-emerald">
            <CheckCircle2 size={11} />
            Concluída
          </span>
        )}
      </div>

      {/* What I learned */}
      {session.whatILearned && (
        <div className="rounded-lg bg-surface-raised border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Brain size={11} className="text-blue shrink-0" />
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">O que aprendi</span>
          </div>
          <p className="text-xs text-text leading-relaxed">{session.whatILearned}</p>
        </div>
      )}

      {/* Notes */}
      {session.notes && (
        <div className="rounded-lg bg-surface-raised border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen size={11} className="text-text-muted shrink-0" />
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">Notas</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">{session.notes}</p>
        </div>
      )}

      {/* Links */}
      {session.links && (
        <div className="flex items-center gap-1.5">
          <Link2 size={11} className="text-blue shrink-0" />
          <span className="text-[11px] text-blue truncate">{session.links}</span>
        </div>
      )}
    </div>
  );
}

// ─── empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center mb-4">
        <Calendar size={28} className="text-blue" />
      </div>
      <h2 className="text-lg font-bold text-text mb-2">Nenhuma sessão ainda</h2>
      <p className="text-sm text-text-muted max-w-xs leading-relaxed">
        Inicie uma missão e registre seu estudo. Tudo o que você aprender aparecerá aqui.
      </p>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { sessions } = useStudySessionStore();
  const { missions } = useMissionsStore();

  // Build missionId → pathTitle lookup
  const pathByMission = useMemo(() => {
    const map: Record<string, string> = {};
    for (const m of missions) {
      map[m.id] = m.pathTitle ?? "";
    }
    return map;
  }, [missions]);

  // Summary stats
  const { todaySeconds, weekSeconds, totalSessions } = useMemo(() => {
    const today = todayKey();
    const weekAgo = weekAgoTs();
    let todayS = 0;
    let weekS = 0;

    for (const s of sessions) {
      const key = toDateKey(s.endedAt ?? s.startedAt);
      if (key === today) todayS += s.durationSeconds;
      if (new Date(s.endedAt ?? s.startedAt).getTime() >= weekAgo) weekS += s.durationSeconds;
    }

    return { todaySeconds: todayS, weekSeconds: weekS, totalSessions: sessions.length };
  }, [sessions]);

  // Group sessions by date, descending
  const grouped = useMemo(() => {
    const map = new Map<string, StudySession[]>();
    for (const s of sessions) {
      const key = toDateKey(s.endedAt ?? s.startedAt);
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [sessions]);

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Page title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0">
          <BarChart2 size={16} className="text-blue" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-text">Histórico de Estudos</h1>
          <p className="text-[12px] text-text-muted">Suas sessões de aprendizado registradas</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Clock size={16} />}
          label="Hoje"
          value={formatDuration(todaySeconds)}
          sub="tempo estudado"
          accent="text-blue"
        />
        <StatCard
          icon={<Zap size={16} />}
          label="Semana"
          value={formatDuration(weekSeconds)}
          sub="últimos 7 dias"
          accent="text-amber"
        />
        <StatCard
          icon={<Target size={16} />}
          label="Sessões"
          value={String(totalSessions)}
          sub="no total"
          accent="text-emerald"
        />
      </div>

      {/* Timeline */}
      {sessions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {grouped.map(([dateKey, daySessions]) => {
            const isoForFormat = (daySessions[0].endedAt ?? daySessions[0].startedAt);
            const dayTotal = daySessions.reduce((acc, s) => acc + s.durationSeconds, 0);
            const isToday = dateKey === todayKey();

            return (
              <section key={dateKey} className="space-y-3">
                {/* Date header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-3 bg-border" />
                    <span className="text-xs font-semibold text-text-muted capitalize">
                      {isToday ? "Hoje" : formatDate(isoForFormat)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-text-muted">
                    <Clock size={10} />
                    {formatDuration(dayTotal)}
                    <span className="ml-1 text-border">·</span>
                    <span>{daySessions.length} sessão{daySessions.length !== 1 ? "ões" : ""}</span>
                  </div>
                </div>

                {/* Session cards */}
                {daySessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    pathTitle={pathByMission[session.missionId] ?? ""}
                  />
                ))}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
