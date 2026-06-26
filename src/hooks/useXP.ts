"use client";

import { useProgressStore } from "@/stores/progress-store";

export function useXP() {
  const { currentLevel, xpInCurrentLevel, levelProgress, xpRequiredForCurrentLevel, addXP } =
    useProgressStore();

  return {
    level: currentLevel,
    xp: xpInCurrentLevel,
    progress: levelProgress,
    xpToNextLevel: xpRequiredForCurrentLevel,
    addXP,
  };
}
