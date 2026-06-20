import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useProgressStore } from "./progress-store";
import { useActivityStore } from "./activity-store";
import { useMissionsStore } from "./missions-store";

// ── Types ─────────────────────────────────────────────────────────────────────

export type QuestlineStatus = "active" | "available" | "completed" | "archived";
export type ModuleStatus = "locked" | "available" | "in_progress" | "completed";
export type BossBattleStatus = "locked" | "available" | "completed";
export type QuestlineDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface BossBattle {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: BossBattleStatus;
  requirements: string[];
  completedAt: string | null;
}

export interface QuestlineModule {
  id: string;
  questlineId: string;
  title: string;
  description: string;
  order: number;
  status: ModuleStatus;
  xpReward: number;
  missionIds: string[];
}

export interface Questline {
  id: string;
  title: string;
  description: string;
  category: string;
  className: string;
  difficulty: QuestlineDifficulty;
  status: QuestlineStatus;
  estimatedHours: number;
  modules: QuestlineModule[];
  bossBattle: BossBattle;
  createdAt: string;
  updatedAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// ── Default questline (wraps the 10 existing seed missions) ───────────────────

const DEFAULT_QUESTLINE: Questline = {
  id: "ql-react-avancado",
  title: "React Avançado",
  description:
    "Domine React, Hooks, App Router e TypeScript. A jornada completa do desenvolvedor frontend moderno.",
  category: "Frontend",
  className: "Frontend Mage",
  difficulty: "intermediate",
  status: "active",
  estimatedHours: 20,
  modules: [
    {
      id: "mod-fundamentos",
      questlineId: "ql-react-avancado",
      title: "Fundamentos",
      description: "Conceitos base do ecossistema frontend moderno.",
      order: 1,
      status: "available",
      xpReward: 50,
      missionIds: ["mission-intro", "mission-css", "mission-git"],
    },
    {
      id: "mod-hooks",
      questlineId: "ql-react-avancado",
      title: "Hooks Avançados",
      description: "useState, useEffect, useCallback, useMemo e gerenciamento de estado.",
      order: 2,
      status: "available",
      xpReward: 75,
      missionIds: ["mission-hooks", "mission-zustand"],
    },
    {
      id: "mod-app-router",
      questlineId: "ql-react-avancado",
      title: "App Router e TypeScript",
      description: "Next.js App Router, rotas aninhadas e tipagem avançada.",
      order: 3,
      status: "available",
      xpReward: 75,
      missionIds: ["mission-router", "mission-ts", "mission-grid"],
    },
    {
      id: "mod-projeto-final",
      questlineId: "ql-react-avancado",
      title: "Projeto Final",
      description: "Integração completa com APIs REST.",
      order: 4,
      status: "available",
      xpReward: 100,
      missionIds: ["mission-api"],
    },
  ],
  bossBattle: {
    id: "boss-arquimago",
    title: "O Arquimago das APIs",
    description:
      "A batalha final. Construa uma aplicação React completa com integração de APIs REST, gerenciamento de estado e deploy.",
    xpReward: 500,
    status: "locked",
    requirements: ["Completar todos os módulos", "Completar todas as missões"],
    completedAt: null,
  },
  createdAt: new Date("2024-01-01").toISOString(),
  updatedAt: new Date("2024-01-01").toISOString(),
};

// ── Store ─────────────────────────────────────────────────────────────────────

interface QuestlinesState {
  questlines: Questline[];

  addQuestline: (q: Omit<Questline, "id" | "createdAt" | "updatedAt">) => string;
  updateQuestline: (id: string, updates: Partial<Omit<Questline, "id" | "modules" | "bossBattle" | "createdAt">>) => void;
  deleteQuestline: (id: string) => void;
  archiveQuestline: (id: string) => void;
  duplicateQuestline: (id: string) => string;

  addModule: (questlineId: string, mod: Omit<QuestlineModule, "id" | "questlineId">) => string;
  updateModule: (questlineId: string, moduleId: string, updates: Partial<Omit<QuestlineModule, "id" | "questlineId">>) => void;
  deleteModule: (questlineId: string, moduleId: string) => void;
  addMissionToModule: (questlineId: string, moduleId: string, missionId: string) => void;
  removeMissionFromModule: (questlineId: string, moduleId: string, missionId: string) => void;

  completeBossBattle: (questlineId: string) => void;
  recalculateProgress: (questlineId: string) => void;
  recalculateAll: () => void;
  clearAll: () => void;
}

export const useQuestlinesStore = create<QuestlinesState>()(
  devtools(
    persist(
      (set, get) => ({
        questlines: [DEFAULT_QUESTLINE],

        // ── Questline CRUD ──────────────────────────────────────────────────

        addQuestline: (q) => {
          const id = "ql-" + uid();
          const now = new Date().toISOString();
          set((s) => ({ questlines: [...s.questlines, { ...q, id, createdAt: now, updatedAt: now }] }));
          return id;
        },

        updateQuestline: (id, updates) => {
          set((s) => ({
            questlines: s.questlines.map((q) =>
              q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
            ),
          }));
        },

        deleteQuestline: (id) => {
          set((s) => ({ questlines: s.questlines.filter((q) => q.id !== id) }));
        },

        archiveQuestline: (id) => {
          set((s) => ({
            questlines: s.questlines.map((q) =>
              q.id === id
                ? { ...q, status: "archived" as QuestlineStatus, updatedAt: new Date().toISOString() }
                : q
            ),
          }));
        },

        duplicateQuestline: (id) => {
          const original = get().questlines.find((q) => q.id === id);
          if (!original) return "";
          const newId = "ql-" + uid();
          const now = new Date().toISOString();
          const dupe: Questline = {
            ...original,
            id: newId,
            title: original.title + " (Cópia)",
            status: "available" as QuestlineStatus,
            modules: original.modules.map((m) => ({
              ...m,
              id: "mod-" + uid(),
              questlineId: newId,
              status: "available" as ModuleStatus,
              missionIds: [],
            })),
            bossBattle: {
              ...original.bossBattle,
              id: "boss-" + uid(),
              status: "locked" as BossBattleStatus,
              completedAt: null,
            },
            createdAt: now,
            updatedAt: now,
          };
          set((s) => ({ questlines: [...s.questlines, dupe] }));
          return newId;
        },

        // ── Module CRUD ─────────────────────────────────────────────────────

        addModule: (questlineId, mod) => {
          const id = "mod-" + uid();
          set((s) => ({
            questlines: s.questlines.map((q) =>
              q.id === questlineId
                ? {
                    ...q,
                    modules: [...q.modules, { ...mod, id, questlineId }],
                    updatedAt: new Date().toISOString(),
                  }
                : q
            ),
          }));
          return id;
        },

        updateModule: (questlineId, moduleId, updates) => {
          set((s) => ({
            questlines: s.questlines.map((q) =>
              q.id === questlineId
                ? {
                    ...q,
                    modules: q.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)),
                    updatedAt: new Date().toISOString(),
                  }
                : q
            ),
          }));
        },

        deleteModule: (questlineId, moduleId) => {
          set((s) => ({
            questlines: s.questlines.map((q) =>
              q.id === questlineId
                ? {
                    ...q,
                    modules: q.modules.filter((m) => m.id !== moduleId),
                    updatedAt: new Date().toISOString(),
                  }
                : q
            ),
          }));
        },

        addMissionToModule: (questlineId, moduleId, missionId) => {
          set((s) => ({
            questlines: s.questlines.map((q) =>
              q.id === questlineId
                ? {
                    ...q,
                    modules: q.modules.map((m) =>
                      m.id === moduleId && !m.missionIds.includes(missionId)
                        ? { ...m, missionIds: [...m.missionIds, missionId] }
                        : m
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : q
            ),
          }));
        },

        removeMissionFromModule: (questlineId, moduleId, missionId) => {
          set((s) => ({
            questlines: s.questlines.map((q) =>
              q.id === questlineId
                ? {
                    ...q,
                    modules: q.modules.map((m) =>
                      m.id === moduleId
                        ? { ...m, missionIds: m.missionIds.filter((mid) => mid !== missionId) }
                        : m
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : q
            ),
          }));
        },

        // ── Boss Battle ─────────────────────────────────────────────────────

        completeBossBattle: (questlineId) => {
          const questline = get().questlines.find((q) => q.id === questlineId);
          if (!questline || questline.bossBattle.status !== "available") return;

          const xp = questline.bossBattle.xpReward;
          const now = new Date().toISOString();

          set((s) => ({
            questlines: s.questlines.map((q) =>
              q.id === questlineId
                ? {
                    ...q,
                    status: "completed" as QuestlineStatus,
                    bossBattle: { ...q.bossBattle, status: "completed" as BossBattleStatus, completedAt: now },
                    updatedAt: now,
                  }
                : q
            ),
          }));

          useProgressStore.getState().addXP(xp);
          useActivityStore.getState().addEvent({
            type: "mission_completed",
            title: `Boss derrotado: ${questline.bossBattle.title}`,
            description: `${questline.title} concluída! +${xp} XP bônus`,
            xpGained: xp,
          });
        },

        // ── Progress Recalculation ──────────────────────────────────────────

        recalculateProgress: (questlineId) => {
          const questline = get().questlines.find((q) => q.id === questlineId);
          if (!questline || questline.status === "completed" || questline.status === "archived") return;

          const missions = useMissionsStore.getState().missions;
          const allModulesDone =
            questline.modules.length > 0 &&
            questline.modules.every(
              (mod) =>
                mod.missionIds.length > 0 &&
                mod.missionIds.every((mid) => missions.find((m) => m.id === mid)?.status === "completed")
            );

          if (allModulesDone && questline.bossBattle.status === "locked") {
            set((s) => ({
              questlines: s.questlines.map((q) =>
                q.id === questlineId
                  ? {
                      ...q,
                      bossBattle: { ...q.bossBattle, status: "available" as BossBattleStatus },
                      updatedAt: new Date().toISOString(),
                    }
                  : q
              ),
            }));
          }
        },

        recalculateAll: () => {
          const { questlines, recalculateProgress } = get();
          questlines
            .filter((q) => q.status !== "completed" && q.status !== "archived")
            .forEach((q) => recalculateProgress(q.id));
        },

        clearAll: () => set({ questlines: [DEFAULT_QUESTLINE] }),
      }),
      { name: "sq-questlines" }
    ),
    { name: "questlines-store" }
  )
);
