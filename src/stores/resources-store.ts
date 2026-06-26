import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ResourceType =
  | "curso"
  | "video"
  | "artigo"
  | "livro"
  | "documentacao"
  | "ferramenta"
  | "outro";

export type ResourceStatus =
  | "quero_estudar"
  | "estudando"
  | "concluido"
  | "arquivado";

export type ResourcePriority = "baixa" | "media" | "alta";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  questlineId: string;
  moduleId: string;
  status: ResourceStatus;
  priority: ResourcePriority;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourcesState {
  resources: Resource[];

  addResource: (r: Omit<Resource, "id" | "createdAt" | "updatedAt">) => string;
  updateResource: (
    id: string,
    updates: Partial<Omit<Resource, "id" | "createdAt">>
  ) => void;
  deleteResource: (id: string) => void;
  clearAll: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export const useResourcesStore = create<ResourcesState>()(
  devtools(
    persist(
      (set) => ({
        resources: [],

        addResource: (r) => {
          const id = "res-" + uid();
          const now = new Date().toISOString();
          set((s) => ({
            resources: [{ ...r, id, createdAt: now, updatedAt: now }, ...s.resources],
          }));
          return id;
        },

        updateResource: (id, updates) => {
          set((s) => ({
            resources: s.resources.map((r) =>
              r.id === id
                ? { ...r, ...updates, updatedAt: new Date().toISOString() }
                : r
            ),
          }));
        },

        deleteResource: (id) => {
          set((s) => ({ resources: s.resources.filter((r) => r.id !== id) }));
        },

        clearAll: () => set({ resources: [] }),
      }),
      { name: "sq-resources" }
    ),
    { name: "resources-store" }
  )
);
