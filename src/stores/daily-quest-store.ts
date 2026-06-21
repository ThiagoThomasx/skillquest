import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getDailyQuest, DailyQuest } from "@/utils/daily-quest-engine";
import { StoredMission } from "./missions-store";
import { Questline } from "./questlines-store";

interface DailyQuestState {
  dailyQuestId: string | null;
  generatedAt: string | null; // ISO date string (YYYY-MM-DD)
  completedToday: boolean;
  skippedToday: boolean;
  focusMinutes: number; // total minutes focused today
  dailyGoal: number; // minutes per day goal
  dailyNotes: string;

  generateDailyQuest: (missions: StoredMission[], questlines: Questline[]) => DailyQuest | null;
  refreshIfNeeded: (missions: StoredMission[], questlines: Questline[]) => DailyQuest | null;
  skipDailyQuest: (missions: StoredMission[], questlines: Questline[]) => DailyQuest | null;
  markCompleted: () => void;
  addFocusMinutes: (minutes: number) => void;
  setDailyGoal: (minutes: number) => void;
  setDailyNotes: (notes: string) => void;
  clearAll: () => void;
}

const TODAY = () => new Date().toISOString().slice(0, 10);

export const useDailyQuestStore = create<DailyQuestState>()(
  devtools(
    persist(
      (set, get) => ({
        dailyQuestId: null,
        generatedAt: null,
        completedToday: false,
        skippedToday: false,
        focusMinutes: 0,
        dailyGoal: 30,
        dailyNotes: "",

        generateDailyQuest: (missions, questlines) => {
          const result = getDailyQuest(missions, questlines);
          const today = TODAY();
          set({
            dailyQuestId: result?.missionId ?? null,
            generatedAt: today,
            completedToday: false,
            skippedToday: false,
          });
          return result;
        },

        refreshIfNeeded: (missions, questlines) => {
          const { generatedAt, dailyQuestId, generateDailyQuest } = get();
          const today = TODAY();
          // Reset focus minutes on new day
          if (generatedAt !== today) {
            set({ focusMinutes: 0, dailyNotes: "" });
            return generateDailyQuest(missions, questlines);
          }
          // Return existing quest info
          if (dailyQuestId) {
            const mission = missions.find((m) => m.id === dailyQuestId);
            if (mission && mission.status !== "completed") return null; // already loaded
          }
          return generateDailyQuest(missions, questlines);
        },

        skipDailyQuest: (missions, questlines) => {
          const { skippedToday } = get();
          if (skippedToday) return null; // only one skip per day
          // exclude current dailyQuestId from candidates
          const currentId = get().dailyQuestId;
          const filtered = missions.filter((m) => m.id !== currentId);
          const result = getDailyQuest(filtered, questlines);
          set({
            dailyQuestId: result?.missionId ?? null,
            skippedToday: true,
          });
          return result;
        },

        markCompleted: () => set({ completedToday: true }),
        addFocusMinutes: (minutes) => set((s) => ({ focusMinutes: s.focusMinutes + minutes })),
        setDailyGoal: (minutes) => set({ dailyGoal: minutes }),
        setDailyNotes: (notes) => set({ dailyNotes: notes }),
        clearAll: () =>
          set({
            dailyQuestId: null,
            generatedAt: null,
            completedToday: false,
            skippedToday: false,
            focusMinutes: 0,
            dailyGoal: 30,
            dailyNotes: "",
          }),
      }),
      { name: "sq-daily-quest" }
    ),
    { name: "daily-quest-store" }
  )
);
