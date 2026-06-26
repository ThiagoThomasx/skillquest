import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface LearningNote {
  id: string;
  title: string;
  content: string;
  pathTitle: string;
  moduleTitle: string;
  missionTitle: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  sessionId?: string;
}

export type NoteFormData = Omit<LearningNote, "id" | "createdAt" | "updatedAt">;

interface NotesState {
  notes: LearningNote[];
  addNote: (data: NoteFormData) => LearningNote;
  updateNote: (id: string, data: Partial<NoteFormData>) => void;
  deleteNote: (id: string) => void;
  clearAll: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export const useNotesStore = create<NotesState>()(
  devtools(
    persist(
      (set) => ({
        notes: [],

        addNote: (data) => {
          const note: LearningNote = {
            ...data,
            id: uid(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((s) => ({ notes: [note, ...s.notes] }));
          return note;
        },

        updateNote: (id, data) => {
          set((s) => ({
            notes: s.notes.map((n) =>
              n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n
            ),
          }));
        },

        deleteNote: (id) => {
          set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
        },

        clearAll: () => set({ notes: [] }),
      }),
      { name: "sq-notes" }
    ),
    { name: "notes-store" }
  )
);
