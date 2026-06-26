"use client";

import { useMemo, useState } from "react";
import { Clock, CalendarDays, TrendingUp, BarChart3, BookOpen, Zap, AlertCircle, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
import { StudySession } from "@/stores/study-session-store";
import {
  formatSeconds,
  getStudyTimeToday,
  getStudyTimeLastNDays,
  getStudyDaysLastNDays,
  getDailyAverageSeconds,
  getMostStudiedSubject,
  getStudyProjection,
  ProjectionType,
} from "@/utils/session-metrics";
import { cn } from "@/lib/utils";

// ── metric card ───────────────────────────────────────────────────────────────

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "blue" | "amber" | "emerald" | "violet";
  empty?: boolean;
};

function MetricCard({ icon, label, value, sub, accent = "blue", empty }: MetricCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue/10 border-blue/20 text-blue",
    amber: "bg-amber/10 border-amber/20 text-amber",
    emerald: "bg-emerald/10 border-emerald/20 text-emerald",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  };

  return (
    <div className="rounded-xl bg-surface border border-border p-4 flex items-start gap-3 min-w-0">
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border", colors[accent])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted truncate">{label}</p>
        <p className={cn("text-xl font-bold leading-tight", empty ? "text-text-muted" : "text-text")}>{value}</p>
        {sub && <p className="text-[11px] text-text-muted mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ── projection card ───────────────────────────────────────────────────────────

const PROJECTION_STYLES: Record<ProjectionType, { bg: string; border: string; icon: React.ReactNode; label: string }> = {
  ahead: {
    bg: "bg-emerald/5",
    border: "border-emerald/20",
    icon: <ChevronUp size={14} className="text-emerald" />,
    label: "Acima do ritmo",
  },
  on_track: {
    bg: "bg-blue/5",
    border: "border-blue/20",
    icon: <CheckCircle2 size={14} className="text-blue" />,
    label: "No ritmo certo",
  },
  behind: {
    bg: "bg-amber/5",
    border: "border-amber/20",
    icon: <AlertCircle size={14} className="text-amber" />,
    label: "Abaixo do ritmo",
  },
  no_goal: {
    bg: "bg-surface-raised",
    border: "border-border",
    icon: <TrendingUp size={14} className="text-text-muted" />,
    label: "Sem trilha ativa",
  },
  no_data: {
    bg: "bg-surface-raised",
    border: "border-border",
    icon: <BarChart3 size={14} className="text-text-muted" />,
    label: "Sem dados",
  },
};

// ── panel ─────────────────────────────────────────────────────────────────────

type StudyMetricsPanelProps = {
  sessions: StudySession[];
  activeQuestlineTitle?: string;
  activeQuestlineEstimatedHours?: number;
  activeQuestlineProgress?: number;
};

export function StudyMetricsPanel({
  sessions,
  activeQuestlineTitle,
  activeQuestlineEstimatedHours,
  activeQuestlineProgress,
}: StudyMetricsPanelProps) {
  const metrics = useMemo(() => {
    const todaySeconds = getStudyTimeToday(sessions);
    const weekSeconds = getStudyTimeLastNDays(sessions, 7);
    const monthSeconds = getStudyTimeLastNDays(sessions, 30);
    const avgDailySeconds = getDailyAverageSeconds(sessions, 30);
    const studyDays30 = getStudyDaysLastNDays(sessions, 30);
    const topSubject = getMostStudiedSubject(sessions);

    return { todaySeconds, weekSeconds, monthSeconds, avgDailySeconds, studyDays30, topSubject };
  }, [sessions]);

  const projection = useMemo(
    () =>
      getStudyProjection(
        sessions,
        activeQuestlineTitle,
        activeQuestlineEstimatedHours,
        activeQuestlineProgress,
      ),
    [sessions, activeQuestlineTitle, activeQuestlineEstimatedHours, activeQuestlineProgress]
  );

  const projStyle = PROJECTION_STYLES[projection.type];
  const isEmpty = sessions.length === 0;
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="space-y-3">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 w-full text-left group"
        aria-expanded={expanded}
      >
        <BarChart3 size={14} className="text-text-muted" />
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide flex-1">Métricas de Estudo</h2>
        {expanded
          ? <ChevronUp size={13} className="text-text-dim group-hover:text-text-muted transition-colors" />
          : <ChevronDown size={13} className="text-text-dim group-hover:text-text-muted transition-colors" />
        }
      </button>

      {/* Metrics grid — 2 cols mobile, 3 cols md, 6 cols xl */}
      {!expanded ? null : <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard
          icon={<Clock size={16} />}
          label="Hoje"
          value={isEmpty ? "—" : formatSeconds(metrics.todaySeconds)}
          sub="tempo estudado"
          accent="blue"
          empty={isEmpty || metrics.todaySeconds === 0}
        />
        <MetricCard
          icon={<CalendarDays size={16} />}
          label="Esta semana"
          value={isEmpty ? "—" : formatSeconds(metrics.weekSeconds)}
          sub="últimos 7 dias"
          accent="amber"
          empty={isEmpty || metrics.weekSeconds === 0}
        />
        <MetricCard
          icon={<TrendingUp size={16} />}
          label="Este mês"
          value={isEmpty ? "—" : formatSeconds(metrics.monthSeconds)}
          sub="últimos 30 dias"
          accent="violet"
          empty={isEmpty || metrics.monthSeconds === 0}
        />
        <MetricCard
          icon={<Zap size={16} />}
          label="Média diária"
          value={isEmpty ? "—" : formatSeconds(metrics.avgDailySeconds)}
          sub="por dia ativo (30d)"
          accent="emerald"
          empty={isEmpty || metrics.avgDailySeconds === 0}
        />
        <MetricCard
          icon={<CheckCircle2 size={16} />}
          label="Dias ativos"
          value={isEmpty ? "—" : String(metrics.studyDays30)}
          sub="nos últimos 30 dias"
          accent="blue"
          empty={isEmpty || metrics.studyDays30 === 0}
        />
        <MetricCard
          icon={<BookOpen size={16} />}
          label="Mais estudado"
          value={isEmpty || !metrics.topSubject ? "—" : metrics.topSubject}
          sub="assunto com mais horas"
          accent="amber"
          empty={isEmpty || !metrics.topSubject}
        />
      </div>}

      {expanded && (
        <div className={cn("rounded-xl border p-4 flex items-start gap-3", projStyle.bg, projStyle.border)}>
          <div className="w-6 h-6 rounded-lg bg-surface/60 border border-border/50 flex items-center justify-center shrink-0 mt-0.5">
            {projStyle.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{projStyle.label}</span>
            </div>
            <p className="text-sm font-semibold text-text mt-0.5 leading-snug">{projection.message}</p>
            <p className="text-[12px] text-text-muted mt-1 leading-relaxed">{projection.detail}</p>
          </div>
        </div>
      )}
    </section>
  );
}
