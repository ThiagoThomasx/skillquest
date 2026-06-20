import { mockFetch } from "./api";
import type { Mission } from "@/types";

const MOCK_MISSIONS: Mission[] = [
  {
    id: "m01",
    title: "Fundamentos de TypeScript",
    description: "Tipos, interfaces, generics e utilitários.",
    pathId: "p01",
    pathTitle: "Frontend",
    xpReward: 150,
    estimatedMinutes: 30,
    difficulty: "easy",
    status: "completed",
    progress: 100,
    completedAt: new Date("2026-06-19"),
  },
  {
    id: "m02",
    title: "React Hooks Avançado",
    description: "useCallback, useMemo, useRef e hooks customizados.",
    pathId: "p01",
    pathTitle: "Frontend",
    xpReward: 200,
    estimatedMinutes: 45,
    difficulty: "medium",
    status: "active",
    progress: 65,
  },
  {
    id: "m03",
    title: "Next.js App Router",
    description: "Layouts, Server Components e streaming.",
    pathId: "p01",
    pathTitle: "Frontend",
    xpReward: 175,
    estimatedMinutes: 35,
    difficulty: "medium",
    status: "active",
    progress: 30,
  },
  {
    id: "m04",
    title: "Context API vs Zustand",
    description: "Gerenciamento de estado global.",
    pathId: "p01",
    pathTitle: "Frontend",
    xpReward: 250,
    estimatedMinutes: 60,
    difficulty: "hard",
    status: "available",
    progress: 0,
  },
];

export const missionsService = {
  async getAll(): Promise<Mission[]> {
    return mockFetch(MOCK_MISSIONS);
  },

  async getById(id: string): Promise<Mission | undefined> {
    return mockFetch(MOCK_MISSIONS.find((m) => m.id === id));
  },

  async getByPath(pathId: string): Promise<Mission[]> {
    return mockFetch(MOCK_MISSIONS.filter((m) => m.pathId === pathId));
  },
};
