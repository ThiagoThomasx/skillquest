"use client";

import { useUserStore } from "@/stores/useUserStore";
import { getLevelProgress, getLevelFromXP, getXPToNextLevel } from "@/utils/xp";

export function useXP() {
  const user = useUserStore((s) => s.user);
  const addXP = useUserStore((s) => s.addXP);

  if (!user) {
    return { level: 1, xp: 0, progress: 0, xpToNextLevel: 3000, addXP };
  }

  return {
    level: getLevelFromXP(user.xp),
    xp: user.xp,
    progress: getLevelProgress(user.xp),
    xpToNextLevel: getXPToNextLevel(user.xp),
    addXP,
  };
}
