import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useProgressStore } from "./progress-store";
import { useStreakStore } from "./streak-store";
import { useActivityStore } from "./activity-store";
import { useBadgesStore } from "./badges-store";

export type MissionStatus = "locked" | "available" | "active" | "completed";
export type Difficulty = "easy" | "medium" | "hard" | "legendary";

export interface StoredMission {
  id: string;
  title: string;
  description: string;
  pathId: string;
  pathTitle: string;
  category: "Main Quest" | "Side Quest" | "Boss Quest" | "Daily";
  xpReward: number;
  estimatedMinutes: number;
  difficulty: Difficulty;
  status: MissionStatus;
  progress: number; // 0–100
  objectives: string[];
  rewards: string[];
  isMainQuest?: boolean;
  isDaily?: boolean;
  isBoss?: boolean;
  createdAt: string;
  completedAt: string | null;
}

const INITIAL_MISSIONS: StoredMission[] = [
  {
    id: "mission-intro",
    title: "Introdução ao React",
    description: "Primeiros passos com React. Componentes, JSX e props.",
    pathId: "path-react",
    pathTitle: "React Avançado",
    category: "Main Quest",
    xpReward: 100,
    estimatedMinutes: 20,
    difficulty: "easy",
    status: "available",
    progress: 0,
    objectives: ["Criar primeiro componente", "Entender JSX", "Usar props"],
    rewards: ["100 XP"],
    isMainQuest: true,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-css",
    title: "Variáveis CSS e Temas",
    description: "Sistema de design com CSS custom properties. Domine o dark mode e temas dinâmicos.",
    pathId: "path-css",
    pathTitle: "CSS Moderno",
    category: "Side Quest",
    xpReward: 100,
    estimatedMinutes: 20,
    difficulty: "easy",
    status: "available",
    progress: 0,
    objectives: ["Criar sistema de cores", "Implementar dark mode"],
    rewards: ["100 XP"],
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-git",
    title: "Git Flow Avançado",
    description: "Branches, merge, rebase e estratégias de versionamento em equipe.",
    pathId: "path-devops",
    pathTitle: "DevOps Essentials",
    category: "Side Quest",
    xpReward: 125,
    estimatedMinutes: 30,
    difficulty: "medium",
    status: "available",
    progress: 0,
    objectives: ["Criar feature branches", "Fazer merge com rebase", "Resolver conflitos"],
    rewards: ["125 XP"],
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-hooks",
    title: "React Hooks na Prática",
    description: "Domine useState, useEffect, useCallback e useMemo em projetos reais.",
    pathId: "path-react",
    pathTitle: "React Avançado",
    category: "Main Quest",
    xpReward: 200,
    estimatedMinutes: 45,
    difficulty: "medium",
    status: "available",
    progress: 0,
    objectives: ["Implementar useState para estado local", "Usar useEffect com cleanup", "Otimizar com useCallback"],
    rewards: ["200 XP", "Badge: Hook Master"],
    isMainQuest: true,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-router",
    title: "Next.js App Router",
    description: "Explore as rotas paralelas, interceptadas e layouts aninhados do App Router moderno.",
    pathId: "path-react",
    pathTitle: "React Avançado",
    category: "Main Quest",
    xpReward: 175,
    estimatedMinutes: 50,
    difficulty: "hard",
    status: "available",
    progress: 0,
    objectives: ["Configurar layouts aninhados", "Implementar loading states", "Usar route handlers"],
    rewards: ["175 XP"],
    isMainQuest: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-grid",
    title: "CSS Grid Épico",
    description: "Layouts complexos com CSS Grid. Responsividade avançada sem frameworks.",
    pathId: "path-css",
    pathTitle: "CSS Moderno",
    category: "Daily",
    xpReward: 150,
    estimatedMinutes: 15,
    difficulty: "easy",
    status: "available",
    progress: 0,
    objectives: ["Criar layout 3 colunas", "Adicionar responsividade", "Grid template areas"],
    rewards: ["150 XP (2×)", "Streak +1"],
    isDaily: true,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-ts",
    title: "Tipagem Avançada TypeScript",
    description: "Generics, utility types e conditional types. Transforme-se no mestre da tipagem.",
    pathId: "path-ts",
    pathTitle: "TypeScript Mestre",
    category: "Main Quest",
    xpReward: 150,
    estimatedMinutes: 30,
    difficulty: "medium",
    status: "available",
    progress: 0,
    objectives: ["Criar generic functions", "Usar utility types (Pick, Omit)", "Conditional types"],
    rewards: ["150 XP", "Badge: TypeScript Expert"],
    isMainQuest: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-zustand",
    title: "Context API vs Zustand",
    description: "Compare as duas abordagens de gerenciamento de estado e descubra quando usar cada uma.",
    pathId: "path-react",
    pathTitle: "React Avançado",
    category: "Side Quest",
    xpReward: 250,
    estimatedMinutes: 60,
    difficulty: "hard",
    status: "available",
    progress: 0,
    objectives: ["Implementar Context API", "Migrar para Zustand", "Benchmarcar performance"],
    rewards: ["250 XP", "Badge: State Wizard"],
    isMainQuest: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-api",
    title: "REST API com Node.js",
    description: "Construa uma API completa com Express, validação e autenticação JWT.",
    pathId: "path-backend",
    pathTitle: "Backend Essentials",
    category: "Main Quest",
    xpReward: 225,
    estimatedMinutes: 90,
    difficulty: "hard",
    status: "available",
    progress: 0,
    objectives: ["Criar endpoints CRUD", "Validar com Zod", "Autenticar com JWT"],
    rewards: ["225 XP"],
    isMainQuest: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "mission-boss",
    title: "O Arquimago das APIs — Boss Battle",
    description: "A batalha final da Questline Frontend. Construa uma aplicação completa do zero.",
    pathId: "path-react",
    pathTitle: "React Avançado",
    category: "Boss Quest",
    xpReward: 500,
    estimatedMinutes: 120,
    difficulty: "legendary",
    status: "locked",
    progress: 0,
    objectives: ["Construir app completo", "Integrar API REST", "Deploy em produção"],
    rewards: ["500 XP", "Badge: API Slayer", "Título: Mago Frontend"],
    isBoss: true,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
];

interface MissionsState {
  missions: StoredMission[];

  startMission: (id: string) => void;
  completeMission: (id: string) => void;
  resetMission: (id: string) => void;
  addMission: (mission: StoredMission) => void;
  deleteMission: (id: string) => void;
  clearAll: () => void;
}

function buildBadgeContext(missions: StoredMission[]) {
  const completed = missions.filter((m) => m.status === "completed");
  const streak = useStreakStore.getState();
  const progress = useProgressStore.getState();
  return {
    completedMissionIds: completed.map((m) => m.id),
    totalMissionsCompleted: completed.length,
    currentStreak: streak.currentStreak,
    bestStreak: streak.bestStreak,
    level: progress.currentLevel,
    totalXP: progress.totalXP,
  };
}

export const useMissionsStore = create<MissionsState>()(
  devtools(
    persist(
      (set, get) => ({
        missions: INITIAL_MISSIONS,

        startMission: (id) => {
          set((state) => ({
            missions: state.missions.map((m) =>
              m.id === id && m.status === "available"
                ? { ...m, status: "active" as MissionStatus }
                : m
            ),
          }));
          const mission = get().missions.find((m) => m.id === id);
          if (mission) {
            useActivityStore.getState().addEvent({
              type: "mission_started",
              title: `Missão iniciada: ${mission.title}`,
              description: mission.pathTitle,
              xpGained: 0,
            });
          }
        },

        completeMission: (id) => {
          const mission = get().missions.find((m) => m.id === id);
          if (!mission || mission.status === "completed") return;

          // Mark completed
          set((state) => ({
            missions: state.missions.map((m) =>
              m.id === id
                ? { ...m, status: "completed" as MissionStatus, progress: 100, completedAt: new Date().toISOString() }
                : m
            ),
          }));

          // Update streak
          const streakResult = useStreakStore.getState().checkAndUpdate();

          // Calculate XP (daily bonus if applicable)
          const baseXP = mission.xpReward;
          const xpEarned = mission.isDaily ? baseXP * 2 : baseXP;

          // Add XP (detects level up internally)
          const leveledUp = useProgressStore.getState().addXP(xpEarned);

          // Log activity
          useActivityStore.getState().addEvent({
            type: "mission_completed",
            title: `Missão concluída: ${mission.title}`,
            description: `${mission.pathTitle} · +${xpEarned} XP`,
            xpGained: xpEarned,
          });

          if (leveledUp) {
            const newLevel = useProgressStore.getState().currentLevel;
            useActivityStore.getState().addEvent({
              type: "level_up",
              title: `Subiu para o Nível ${newLevel}!`,
              description: "Parabéns pela evolução!",
              xpGained: 0,
            });
          }

          if (streakResult === "streak_continued" || streakResult === "streak_started") {
            const { currentStreak, bestStreak } = useStreakStore.getState();
            if (currentStreak === bestStreak && currentStreak > 1) {
              useActivityStore.getState().addEvent({
                type: "streak_record",
                title: `Novo recorde de sequência: ${currentStreak} dias!`,
                description: "Continue assim!",
                xpGained: 0,
              });
            }
          }

          // Evaluate badges with updated state
          const updatedMissions = get().missions;
          const ctx = buildBadgeContext(updatedMissions);
          useBadgesStore.getState().evaluate(ctx);
        },

        resetMission: (id) => {
          set((state) => ({
            missions: state.missions.map((m) =>
              m.id === id ? { ...m, status: "available" as MissionStatus, progress: 0, completedAt: null } : m
            ),
          }));
        },

        addMission: (mission) => {
          set((state) => ({ missions: [...state.missions, mission] }));
        },

        deleteMission: (id) => {
          set((state) => ({ missions: state.missions.filter((m) => m.id !== id) }));
        },

        clearAll: () => set({ missions: INITIAL_MISSIONS }),
      }),
      { name: "sq-missions" }
    ),
    { name: "missions-store" }
  )
);
