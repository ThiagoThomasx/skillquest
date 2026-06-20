import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { isSameDay, isStreakBroken } from "@/engines/streak-engine";

interface StreakState {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string | null; // ISO date

  checkAndUpdate: () => "same_day" | "streak_continued" | "streak_broken" | "streak_started";
  resetStreak: () => void;
  clearAll: () => void;
}

export const useStreakStore = create<StreakState>()(
  devtools(
    persist(
      (set, get) => ({
        currentStreak: 0,
        bestStreak: 0,
        lastActivityDate: null,

        checkAndUpdate: () => {
          const { currentStreak, bestStreak, lastActivityDate } = get();
          const now = new Date().toISOString();

          if (lastActivityDate && isSameDay(lastActivityDate, now)) {
            return "same_day";
          }

          if (lastActivityDate && isStreakBroken(lastActivityDate, now)) {
            set({ currentStreak: 1, lastActivityDate: now });
            return "streak_broken";
          }

          const newStreak = currentStreak + 1;
          const newBest = Math.max(newStreak, bestStreak);
          set({ currentStreak: newStreak, bestStreak: newBest, lastActivityDate: now });
          return lastActivityDate ? "streak_continued" : "streak_started";
        },

        resetStreak: () => set({ currentStreak: 0, lastActivityDate: null }),

        clearAll: () => set({ currentStreak: 0, bestStreak: 0, lastActivityDate: null }),
      }),
      { name: "sq-streak" }
    ),
    { name: "streak-store" }
  )
);
