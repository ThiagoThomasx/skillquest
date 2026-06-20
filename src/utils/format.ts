// ── Number & XP formatting ───────────────────────────────────────────────────

export function formatXP(xp: number): string {
  if (xp >= 1_000) {
    return `${(xp / 1_000).toFixed(xp % 1_000 === 0 ? 0 : 1)}k`;
  }
  return xp.toLocaleString("pt-BR");
}

export function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR");
}

// ── Date formatting ──────────────────────────────────────────────────────────

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export function formatRelativeTime(date: Date): string {
  let duration = (date.getTime() - Date.now()) / 1_000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
  return date.toLocaleDateString("pt-BR");
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

// ── Duration formatting ───────────────────────────────────────────────────────

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
