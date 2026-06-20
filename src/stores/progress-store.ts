import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  getLevelFromTotalXP,
  getXPInCurrentLevel,
  getXPRequiredForCurrentLevel,
  getLevelProgress,
} from "@/engines/level-engine";

interface ProgressState {
  totalXP: number;
  currentLevel: number;
  xpInCurrentLevel: number;
  xpRequiredForCurrentLevel: number;
  levelProgress: number; // 0–100
  username: string;
  joinedAt: string; // ISO

  // Level-up modal state
  pendingLevelUp: boolean;
  levelUpData: { newLevel: number; xpGained: number } | null;

  // Actions
  addXP: (amount: number) => boolean; // returns true if leveled up
  setUsername: (name: string) => void;
  dismissLevelUp: () => void;
  clearAll: () => void;
}

function deriveFromXP(totalXP: number) {
  return {
    currentLevel: getLevelFromTotalXP(totalXP),
    xpInCurrentLevel: getXPInCurrentLevel(totalXP),
    xpRequiredForCurrentLevel: getXPRequiredForCurrentLevel(totalXP),
    levelProgress: getLevelProgress(totalXP),
  };
}

export const useProgressStore = create<ProgressState>()(
  devtools(
    persist(
      (set, get) => ({
        totalXP: 0,
        currentLevel: 1,
        xpInCurrentLevel: 0,
        xpRequiredForCurrentLevel: 100,
        levelProgress: 0,
        username: "Aventureiro",
        joinedAt: new Date().toISOString(),

        pendingLevelUp: false,
        levelUpData: null,

        addXP: (amount) => {
          const { totalXP, currentLevel } = get();
          const newTotalXP = totalXP + amount;
          const derived = deriveFromXP(newTotalXP);
          const leveledUp = derived.currentLevel > currentLevel;

          set({
            totalXP: newTotalXP,
            ...derived,
            ...(leveledUp
              ? {
                  pendingLevelUp: true,
                  levelUpData: { newLevel: derived.currentLevel, xpGained: amount },
                }
              : {}),
          });

          return leveledUp;
        },

        setUsername: (name) => set({ username: name }),

        dismissLevelUp: () => set({ pendingLevelUp: false, levelUpData: null }),

        clearAll: () => {
          const derived = deriveFromXP(0);
          set({
            totalXP: 0,
            ...derived,
            pendingLevelUp: false,
            levelUpData: null,
            joinedAt: new Date().toISOString(),
          });
        },
      }),
      { name: "sq-progress" }
    ),
    { name: "progress-store" }
  )
);
