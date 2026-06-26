import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ProjectStatus =
  | "ideia"
  | "planejado"
  | "em_andamento"
  | "concluido"
  | "pausado";

export type ProjectDifficulty = "iniciante" | "intermediario" | "avancado" | "expert";

export interface ProjectTask {
  id: string;
  title: string;
  done: boolean;
}

export interface StudyProject {
  id: string;
  name: string;
  description: string;
  questlineId: string;
  questlineTitle: string;
  moduleId: string;
  moduleTitle: string;
  status: ProjectStatus;
  difficulty: ProjectDifficulty;
  tasks: ProjectTask[];
  githubUrl: string;
  deployUrl: string;
  learnings: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProjectFormData = Omit<StudyProject, "id" | "createdAt" | "updatedAt">;

interface ProjectsState {
  projects: StudyProject[];
  addProject: (data: ProjectFormData) => StudyProject;
  updateProject: (id: string, data: Partial<ProjectFormData>) => void;
  deleteProject: (id: string) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  addTask: (projectId: string, title: string) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  clearAll: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export const useProjectsStore = create<ProjectsState>()(
  devtools(
    persist(
      (set) => ({
        projects: [],

        addProject: (data) => {
          const project: StudyProject = {
            ...data,
            id: uid(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((s) => ({ projects: [project, ...s.projects] }));
          return project;
        },

        updateProject: (id, data) => {
          set((s) => ({
            projects: s.projects.map((p) =>
              p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
            ),
          }));
        },

        deleteProject: (id) => {
          set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
        },

        toggleTask: (projectId, taskId) => {
          set((s) => ({
            projects: s.projects.map((p) => {
              if (p.id !== projectId) return p;
              const tasks = p.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              );
              return { ...p, tasks, updatedAt: new Date().toISOString() };
            }),
          }));
        },

        addTask: (projectId, title) => {
          const task: ProjectTask = { id: uid(), title, done: false };
          set((s) => ({
            projects: s.projects.map((p) => {
              if (p.id !== projectId) return p;
              return {
                ...p,
                tasks: [...p.tasks, task],
                updatedAt: new Date().toISOString(),
              };
            }),
          }));
        },

        deleteTask: (projectId, taskId) => {
          set((s) => ({
            projects: s.projects.map((p) => {
              if (p.id !== projectId) return p;
              return {
                ...p,
                tasks: p.tasks.filter((t) => t.id !== taskId),
                updatedAt: new Date().toISOString(),
              };
            }),
          }));
        },

        clearAll: () => set({ projects: [] }),
      }),
      { name: "sq-projects" }
    ),
    { name: "projects-store" }
  )
);
