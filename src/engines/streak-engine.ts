export function isSameDay(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

export function isConsecutiveDay(prev: string, next: string): boolean {
  const d1 = new Date(prev);
  const d2 = new Date(next);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
  return diff === 1;
}

export function isStreakBroken(lastActivityDate: string | null, now: string): boolean {
  if (!lastActivityDate) return false;
  const d1 = new Date(lastActivityDate);
  const d2 = new Date(now);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 1;
}
