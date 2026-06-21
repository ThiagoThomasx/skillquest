import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface StudySession {
  id: string;
  missionId: string;
  missionTitle: string;
  startedAt: string; // ISO
  endedAt: string | null; // ISO
  durationSeconds: number;
  notes: string;
  completed: boolean; // true = mission was completed
}

interface StudySessionState {
  // Active session timer
  activeMissionId: string | null;
  activeMissionTitle: string;
  sessionStartedAt: string | null; // ISO when timer started
  accumulatedSeconds: number; // seconds before last pause
  isPaused: boolean;
  sessionNotes: string;
  isSessionOpen: boolean; // modal open

  // Completed sessions history
  sessions: StudySession[];

  // Actions
  openSession: (missionId: string, missionTitle: string) => void;
  closeSession: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setSessionNotes: (notes: string) => void;
  completeSession: (missionCompleted: boolean) => StudySession;
  abandonSession: () => void;
  getElapsedSeconds: () => number;
  clearAll: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export const useStudySessionStore = create<StudySessionState>()(
  devtools(
    persist(
      (set, get) => ({
        activeMissionId: null,
        activeMissionTitle: "",
        sessionStartedAt: null,
        accumulatedSeconds: 0,
        isPaused: true,
        sessionNotes: "",
        isSessionOpen: false,
        sessions: [],

        openSession: (missionId, missionTitle) => {
          const current = get();
          // If switching to a different mission, save current and reset
          if (current.activeMissionId && current.activeMissionId !== missionId) {
            set({
              accumulatedSeconds: 0,
              sessionStartedAt: null,
              isPaused: true,
              sessionNotes: "",
            });
          }
          set({
            activeMissionId: missionId,
            activeMissionTitle: missionTitle,
            isSessionOpen: true,
          });
        },

        closeSession: () => set({ isSessionOpen: false }),

        startTimer: () => {
          const { isPaused } = get();
          if (!isPaused) return;
          set({ sessionStartedAt: new Date().toISOString(), isPaused: false });
        },

        pauseTimer: () => {
          const { isPaused, sessionStartedAt, accumulatedSeconds } = get();
          if (isPaused || !sessionStartedAt) return;
          const elapsed = (Date.now() - new Date(sessionStartedAt).getTime()) / 1000;
          set({
            accumulatedSeconds: accumulatedSeconds + elapsed,
            sessionStartedAt: null,
            isPaused: true,
          });
        },

        resetTimer: () => {
          set({ accumulatedSeconds: 0, sessionStartedAt: null, isPaused: true });
        },

        setSessionNotes: (notes) => set({ sessionNotes: notes }),

        completeSession: (missionCompleted) => {
          const { activeMissionId, activeMissionTitle, accumulatedSeconds, sessionStartedAt, sessionNotes } = get();
          let totalSeconds = accumulatedSeconds;
          if (sessionStartedAt) {
            totalSeconds += (Date.now() - new Date(sessionStartedAt).getTime()) / 1000;
          }
          const session: StudySession = {
            id: uid(),
            missionId: activeMissionId ?? "",
            missionTitle: activeMissionTitle,
            startedAt: sessionStartedAt ?? new Date().toISOString(),
            endedAt: new Date().toISOString(),
            durationSeconds: Math.round(totalSeconds),
            notes: sessionNotes,
            completed: missionCompleted,
          };
          set((s) => ({
            sessions: [session, ...s.sessions].slice(0, 200),
            activeMissionId: null,
            activeMissionTitle: "",
            sessionStartedAt: null,
            accumulatedSeconds: 0,
            isPaused: true,
            sessionNotes: "",
            isSessionOpen: false,
          }));
          return session;
        },

        abandonSession: () => {
          set({
            activeMissionId: null,
            activeMissionTitle: "",
            sessionStartedAt: null,
            accumulatedSeconds: 0,
            isPaused: true,
            sessionNotes: "",
            isSessionOpen: false,
          });
        },

        getElapsedSeconds: () => {
          const { accumulatedSeconds, sessionStartedAt, isPaused } = get();
          if (isPaused || !sessionStartedAt) return accumulatedSeconds;
          return accumulatedSeconds + (Date.now() - new Date(sessionStartedAt).getTime()) / 1000;
        },

        clearAll: () =>
          set({
            activeMissionId: null,
            activeMissionTitle: "",
            sessionStartedAt: null,
            accumulatedSeconds: 0,
            isPaused: true,
            sessionNotes: "",
            isSessionOpen: false,
            sessions: [],
          }),
      }),
      { name: "sq-study-sessions" }
    ),
    { name: "study-session-store" }
  )
);
