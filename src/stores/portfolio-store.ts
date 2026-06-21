import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PortfolioSourceType = "mission" | "module" | "boss_battle" | "custom";
export type PortfolioStatus = "idea" | "in_progress" | "completed" | "published";

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  sourceType: PortfolioSourceType;
  sourceId: string;
  questlineId?: string;
  moduleId?: string;
  missionId?: string;
  status: PortfolioStatus;
  difficulty: string;
  skills: string[];
  deliverables: string[];
  repositoryUrl: string;
  liveUrl: string;
  notes: string;
  readmeDraft: string;
  linkedinDraft: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

interface PortfolioState {
  projects: PortfolioProject[];

  addProject: (p: Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">) => string;
  updateProject: (id: string, updates: Partial<Omit<PortfolioProject, "id" | "createdAt">>) => void;
  deleteProject: (id: string) => void;
  clearAll: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export const usePortfolioStore = create<PortfolioState>()(
  devtools(
    persist(
      (set) => ({
        projects: [],

        addProject: (p) => {
          const id = "pf-" + uid();
          const now = new Date().toISOString();
          set((s) => ({
            projects: [{ ...p, id, createdAt: now, updatedAt: now }, ...s.projects],
          }));
          return id;
        },

        updateProject: (id, updates) => {
          set((s) => ({
            projects: s.projects.map((p) =>
              p.id === id
                ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                : p
            ),
          }));
        },

        deleteProject: (id) => {
          set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
        },

        clearAll: () => set({ projects: [] }),
      }),
      { name: "sq-portfolio" }
    ),
    { name: "portfolio-store" }
  )
);
