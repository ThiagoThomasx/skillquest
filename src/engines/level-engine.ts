// XP required to go from level N to N+1: 25·N·(N+3)
// Derived from sprint spec: L1→100, L2→250, L3→450, L4→700, L5→1000

export function xpRequiredForLevel(level: number): number {
  return 25 * level * (level + 3);
}

// Total cumulative XP to reach a given level (level 1 = 0 XP)
export function totalXPToReachLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return Math.round((25 * n * (n + 1) * (n + 5)) / 3);
}

export function getLevelFromTotalXP(totalXP: number): number {
  let level = 1;
  while (totalXPToReachLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

export function getXPInCurrentLevel(totalXP: number): number {
  const level = getLevelFromTotalXP(totalXP);
  return totalXP - totalXPToReachLevel(level);
}

export function getXPRequiredForCurrentLevel(totalXP: number): number {
  return xpRequiredForLevel(getLevelFromTotalXP(totalXP));
}

export function getLevelProgress(totalXP: number): number {
  const xpIn = getXPInCurrentLevel(totalXP);
  const xpReq = getXPRequiredForCurrentLevel(totalXP);
  return (xpIn / xpReq) * 100;
}
