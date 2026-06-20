import { XP_PER_LEVEL, STREAK_BONUS_MULTIPLIER, DAILY_MISSION_BONUS_MULTIPLIER } from "@/constants";

export function getLevelFromXP(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function getXPForCurrentLevel(totalXP: number): number {
  return totalXP % XP_PER_LEVEL;
}

export function getXPToNextLevel(totalXP: number): number {
  return XP_PER_LEVEL - getXPForCurrentLevel(totalXP);
}

export function getLevelProgress(totalXP: number): number {
  return (getXPForCurrentLevel(totalXP) / XP_PER_LEVEL) * 100;
}

export function applyStreakBonus(baseXP: number, streakDays: number): number {
  if (streakDays < 3) return baseXP;
  return Math.round(baseXP * STREAK_BONUS_MULTIPLIER);
}

export function applyDailyBonus(baseXP: number): number {
  return Math.round(baseXP * DAILY_MISSION_BONUS_MULTIPLIER);
}
