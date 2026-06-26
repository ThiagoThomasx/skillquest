import { StudySession } from "@/stores/study-session-store";

// ── date helpers ─────────────────────────────────────────────────────────────

function sessionDateKey(s: StudySession): string {
  return (s.endedAt ?? s.startedAt).slice(0, 10);
}

function cutoffTimestamp(daysBack: number): number {
  const d = new Date();
  d.setDate(d.getDate() - (daysBack - 1));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function sessionsInLastNDays(sessions: StudySession[], days: number): StudySession[] {
  const cutoff = cutoffTimestamp(days);
  return sessions.filter(
    (s) => new Date(s.endedAt ?? s.startedAt).getTime() >= cutoff
  );
}

// ── formatting ────────────────────────────────────────────────────────────────

export function formatSeconds(seconds: number): string {
  if (seconds <= 0) return "0min";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return m % 60 > 0 ? `${h}h ${m % 60}min` : `${h}h`;
  return `${m}min`;
}

// ── metrics ───────────────────────────────────────────────────────────────────

export function getStudyTimeToday(sessions: StudySession[]): number {
  const today = new Date().toISOString().slice(0, 10);
  return sessions
    .filter((s) => sessionDateKey(s) === today)
    .reduce((sum, s) => sum + s.durationSeconds, 0);
}

export function getStudyTimeLastNDays(sessions: StudySession[], days: number): number {
  return sessionsInLastNDays(sessions, days).reduce(
    (sum, s) => sum + s.durationSeconds,
    0
  );
}

export function getStudyDaysLastNDays(sessions: StudySession[], days: number): number {
  const keys = new Set<string>();
  for (const s of sessionsInLastNDays(sessions, days)) {
    keys.add(sessionDateKey(s));
  }
  return keys.size;
}

export function getDailyAverageSeconds(sessions: StudySession[], days: number): number {
  const studyDays = getStudyDaysLastNDays(sessions, days);
  if (studyDays === 0) return 0;
  return Math.round(getStudyTimeLastNDays(sessions, days) / studyDays);
}

export function getMostStudiedSubject(sessions: StudySession[]): string | null {
  if (sessions.length === 0) return null;
  const totals = new Map<string, number>();
  for (const s of sessions) {
    const key = s.missionTitle || "Sem título";
    totals.set(key, (totals.get(key) ?? 0) + s.durationSeconds);
  }
  let best = "";
  let bestTime = 0;
  for (const [k, v] of totals) {
    if (v > bestTime) { bestTime = v; best = k; }
  }
  return best || null;
}

// ── heatmap ───────────────────────────────────────────────────────────────────

export type HeatmapIntensity = "none" | "light" | "medium" | "strong";

export interface DayData {
  date: string; // YYYY-MM-DD
  totalSeconds: number;
  sessionCount: number;
  missionTitles: string[];
  intensity: HeatmapIntensity;
}

function intensityFromSeconds(seconds: number): HeatmapIntensity {
  if (seconds === 0) return "none";
  const minutes = seconds / 60;
  if (minutes < 30) return "light";
  if (minutes < 60) return "medium";
  return "strong";
}

export function buildHeatmapData(sessions: StudySession[], days: number): DayData[] {
  // Build map of dateKey → aggregated data
  const map = new Map<string, { totalSeconds: number; sessionCount: number; missionTitles: Set<string> }>();
  const cutoff = cutoffTimestamp(days);

  for (const s of sessions) {
    const ts = new Date(s.endedAt ?? s.startedAt).getTime();
    if (ts < cutoff) continue;
    const key = (s.endedAt ?? s.startedAt).slice(0, 10);
    if (!map.has(key)) map.set(key, { totalSeconds: 0, sessionCount: 0, missionTitles: new Set() });
    const entry = map.get(key)!;
    entry.totalSeconds += s.durationSeconds;
    entry.sessionCount += 1;
    if (s.missionTitle) entry.missionTitles.add(s.missionTitle);
  }

  // Generate one DayData per calendar day in the range
  const result: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = map.get(key);
    const totalSeconds = entry?.totalSeconds ?? 0;
    result.push({
      date: key,
      totalSeconds,
      sessionCount: entry?.sessionCount ?? 0,
      missionTitles: entry ? Array.from(entry.missionTitles) : [],
      intensity: intensityFromSeconds(totalSeconds),
    });
  }

  return result;
}

// ── projection ────────────────────────────────────────────────────────────────

export type ProjectionType = "ahead" | "on_track" | "behind" | "no_goal" | "no_data";

export interface StudyProjection {
  type: ProjectionType;
  message: string;
  detail: string;
}

export function getStudyProjection(
  sessions: StudySession[],
  activeQuestlineTitle?: string,
  activeQuestlineEstimatedHours?: number,
  activeQuestlineProgress?: number,
): StudyProjection {
  const studyDays = getStudyDaysLastNDays(sessions, 30);
  const avgDaily = getDailyAverageSeconds(sessions, 30);

  if (studyDays === 0) {
    return {
      type: "no_data",
      message: "Nenhuma sessão registrada ainda.",
      detail: "Comece a estudar para ver sua projeção de progresso.",
    };
  }

  const avgMinutes = Math.round(avgDaily / 60);

  if (!activeQuestlineEstimatedHours || activeQuestlineProgress === undefined) {
    return {
      type: "no_goal",
      message: `Média de ${avgMinutes}min por dia ativo (últimos 30 dias).`,
      detail: "Ative uma trilha para ver a projeção de conclusão.",
    };
  }

  const totalSeconds = activeQuestlineEstimatedHours * 3600;
  const remainingSeconds = totalSeconds * Math.max(0, 1 - activeQuestlineProgress / 100);

  if (avgDaily === 0 || remainingSeconds <= 0) {
    return {
      type: "on_track",
      message: `Trilha "${activeQuestlineTitle ?? "ativa"}" praticamente concluída!`,
      detail: "Continue o ótimo trabalho.",
    };
  }

  const daysToComplete = Math.ceil(remainingSeconds / avgDaily);
  const title = activeQuestlineTitle ?? "Trilha ativa";

  if (daysToComplete <= 7) {
    return {
      type: "ahead",
      message: `"${title}" concluída em ~${daysToComplete} dia${daysToComplete !== 1 ? "s" : ""} neste ritmo.`,
      detail: "Você está acima da meta! Continue assim.",
    };
  }
  if (daysToComplete <= 30) {
    return {
      type: "on_track",
      message: `"${title}" concluída em ~${daysToComplete} dias neste ritmo.`,
      detail: `Média atual: ${avgMinutes}min/dia. Bom andamento!`,
    };
  }
  return {
    type: "behind",
    message: `"${title}" concluída em ~${daysToComplete} dias neste ritmo.`,
    detail: `Aumente para ${Math.ceil(remainingSeconds / (30 * 60))}min/dia para concluir em 30 dias.`,
  };
}
