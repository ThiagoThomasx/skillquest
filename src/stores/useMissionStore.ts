import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Mission, MissionId } from "@/types";

interface MissionState {
  missions: Mission[];
  activeMissionId: MissionId | null;
  isLoading: boolean;

  // Actions
  setMissions: (missions: Mission[]) => void;
  updateMissionProgress: (id: MissionId, progress: number) => void;
  completeMission: (id: MissionId) => void;
  setActiveMission: (id: MissionId | null) => void;
}

export const useMissionStore = create<MissionState>()(
  devtools(
    (set) => ({
      missions: [],
      activeMissionId: null,
      isLoading: false,

      setMissions: (missions) => set({ missions }),

      updateMissionProgress: (id, progress) =>
        set((state) => ({
          missions: state.missions.map((m) =>
            m.id === id ? { ...m, progress, status: "active" } : m
          ),
        })),

      completeMission: (id) =>
        set((state) => ({
          missions: state.missions.map((m) =>
            m.id === id
              ? { ...m, progress: 100, status: "completed", completedAt: new Date() }
              : m
          ),
        })),

      setActiveMission: (id) => set({ activeMissionId: id }),
    }),
    { name: "mission-store" }
  )
);
