import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WeeklyGoalState {
  missionsGoal: number;
  minutesGoal: number;
  xpGoal: number;

  setGoals: (goals: Partial<{ missionsGoal: number; minutesGoal: number; xpGoal: number }>) => void;
  clearAll: () => void;
}

export const useWeeklyGoalStore = create<WeeklyGoalState>()(
  devtools(
    persist(
      (set) => ({
        missionsGoal: 5,
        minutesGoal: 150,
        xpGoal: 500,

        setGoals: (goals) => set((s) => ({ ...s, ...goals })),
        clearAll: () => set({ missionsGoal: 5, minutesGoal: 150, xpGoal: 500 }),
      }),
      { name: "sq-weekly-goals" }
    ),
    { name: "weekly-goal-store" }
  )
);
