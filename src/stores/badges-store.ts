import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BADGE_DEFINITIONS, evaluateBadges, type BadgeContext } from "@/engines/badge-engine";
import { useProgressStore } from "./progress-store";
import { useActivityStore } from "./activity-store";

export interface StoredBadge {
  id: string;
  earned: boolean;
  earnedAt: string | null; // ISO
}

interface BadgesState {
  earned: StoredBadge[];

  evaluate: (ctx: BadgeContext) => string[]; // returns newly unlocked badge ids
  clearAll: () => void;
}

const initialEarned: StoredBadge[] = BADGE_DEFINITIONS.map((b) => ({
  id: b.id,
  earned: false,
  earnedAt: null,
}));

export const useBadgesStore = create<BadgesState>()(
  devtools(
    persist(
      (set, get) => ({
        earned: initialEarned,

        evaluate: (ctx) => {
          const { earned } = get();
          const alreadyEarned = earned.filter((b) => b.earned).map((b) => b.id);
          const newlyUnlocked = evaluateBadges(ctx, alreadyEarned);

          if (newlyUnlocked.length === 0) return [];

          const now = new Date().toISOString();
          set((state) => ({
            earned: state.earned.map((b) =>
              newlyUnlocked.includes(b.id) ? { ...b, earned: true, earnedAt: now } : b
            ),
          }));

          // Award XP for each new badge and log activity
          newlyUnlocked.forEach((badgeId) => {
            const def = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
            if (!def) return;
            useProgressStore.getState().addXP(def.xpReward);
            useActivityStore.getState().addEvent({
              type: "badge_earned",
              title: `Badge desbloqueada: ${def.title}`,
              description: def.description,
              xpGained: def.xpReward,
            });
          });

          return newlyUnlocked;
        },

        clearAll: () => set({ earned: initialEarned }),
      }),
      { name: "sq-badges" }
    ),
    { name: "badges-store" }
  )
);
