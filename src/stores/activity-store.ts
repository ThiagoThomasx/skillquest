import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ActivityEventType =
  | "mission_started"
  | "mission_completed"
  | "badge_earned"
  | "level_up"
  | "streak_record"
  | "journey_reset";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  xpGained: number;
  timestamp: string; // ISO
}

interface ActivityState {
  events: ActivityEvent[];
  addEvent: (event: Omit<ActivityEvent, "id" | "timestamp">) => void;
  clearAll: () => void;
}

export const useActivityStore = create<ActivityState>()(
  devtools(
    persist(
      (set) => ({
        events: [],

        addEvent: (event) => {
          const newEvent: ActivityEvent = {
            ...event,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            events: [newEvent, ...state.events].slice(0, 100),
          }));
        },

        clearAll: () => set({ events: [] }),
      }),
      { name: "sq-activity" }
    ),
    { name: "activity-store" }
  )
);
