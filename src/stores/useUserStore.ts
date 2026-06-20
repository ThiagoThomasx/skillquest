import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User, ActivityEntry } from "@/types";
import { getLevelFromXP, getXPToNextLevel } from "@/utils/xp";

// Stub data — replace with Supabase fetch later
const MOCK_USER: User = {
  id: "usr_01",
  name: "Aventureiro",
  email: "aventureiro@skillquest.com",
  level: 7,
  xp: 2_450,
  xpToNextLevel: 550,
  streak: 7,
  joinedAt: new Date("2026-06-01"),
};

interface UserState {
  user: User | null;
  activity: ActivityEntry[];
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;

  // Bootstrap
  initMockUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      user: null,
      activity: [],
      isLoading: false,

      setUser: (user) => set({ user }),

      addXP: (amount) => {
        const { user } = get();
        if (!user) return;
        const newXP = user.xp + amount;
        set({
          user: {
            ...user,
            xp: newXP,
            level: getLevelFromXP(newXP),
            xpToNextLevel: getXPToNextLevel(newXP),
          },
        });
      },

      incrementStreak: () => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, streak: user.streak + 1 } });
      },

      resetStreak: () => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, streak: 0 } });
      },

      addActivity: (entry) => {
        const newEntry: ActivityEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set((state) => ({ activity: [newEntry, ...state.activity].slice(0, 50) }));
      },

      initMockUser: () => set({ user: MOCK_USER }),
    }),
    { name: "user-store" }
  )
);
