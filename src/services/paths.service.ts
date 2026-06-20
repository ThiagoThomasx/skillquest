import { mockFetch } from "./api";
import type { LearningPath } from "@/types";

const MOCK_PATHS: LearningPath[] = [
  {
    id: "p01",
    title: "Desenvolvedor Frontend",
    description: "Domine React, TypeScript e o ecossistema moderno de frontend.",
    totalMissions: 24,
    completedMissions: 11,
    xpReward: 4_800,
    status: "active",
    tags: ["React", "TypeScript", "CSS"],
    progress: 45,
  },
  {
    id: "p02",
    title: "Engenharia Backend",
    description: "APIs REST, bancos de dados, autenticação e arquitetura de sistemas.",
    totalMissions: 32,
    completedMissions: 0,
    xpReward: 6_400,
    status: "locked",
    tags: ["Node.js", "SQL", "Docker"],
    progress: 0,
  },
  {
    id: "p03",
    title: "Fundamentos Web",
    description: "HTML, CSS e JavaScript — a base de tudo.",
    totalMissions: 16,
    completedMissions: 16,
    xpReward: 3_200,
    status: "completed",
    tags: ["HTML", "CSS", "JavaScript"],
    progress: 100,
  },
];

export const pathsService = {
  async getAll(): Promise<LearningPath[]> {
    return mockFetch(MOCK_PATHS);
  },

  async getById(id: string): Promise<LearningPath | undefined> {
    return mockFetch(MOCK_PATHS.find((p) => p.id === id));
  },
};
