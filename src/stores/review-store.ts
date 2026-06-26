import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ReviewInterval = 1 | 7 | 30 | 90;
export type ReviewDifficulty = "easy" | "medium" | "hard";

export interface ReviewItem {
  id: string;
  missionId: string;
  missionTitle: string;
  pathTitle: string;
  sessionId: string;
  createdAt: string;
  dueAt: string;
  interval: ReviewInterval;
  completedAt: string | null;
  difficulty: ReviewDifficulty | null;
  xpEarned: number;
}

const REVIEW_INTERVALS: ReviewInterval[] = [1, 7, 30, 90];
const REVIEW_XP = 10;

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10);
}

interface ReviewState {
  reviews: ReviewItem[];
  createReviews: (missionId: string, missionTitle: string, pathTitle: string, sessionId: string) => void;
  completeReview: (id: string, difficulty?: ReviewDifficulty) => number;
  getOverdue: () => ReviewItem[];
  getToday: () => ReviewItem[];
  getUpcoming: () => ReviewItem[];
  clearAll: () => void;
}

export const useReviewStore = create<ReviewState>()(
  devtools(
    persist(
      (set, get) => ({
        reviews: [],

        createReviews: (missionId, missionTitle, pathTitle, sessionId) => {
          const now = new Date().toISOString();
          const existingForSession = get().reviews.filter((r) => r.sessionId === sessionId);
          if (existingForSession.length > 0) return;

          const newItems: ReviewItem[] = REVIEW_INTERVALS.map((interval) => ({
            id: uid(),
            missionId,
            missionTitle,
            pathTitle,
            sessionId,
            createdAt: now,
            dueAt: addDays(now, interval),
            interval,
            completedAt: null,
            difficulty: null,
            xpEarned: 0,
          }));

          set((s) => ({ reviews: [...s.reviews, ...newItems] }));
        },

        completeReview: (id, difficulty) => {
          set((s) => ({
            reviews: s.reviews.map((r) =>
              r.id === id
                ? { ...r, completedAt: new Date().toISOString(), difficulty: difficulty ?? null, xpEarned: REVIEW_XP }
                : r
            ),
          }));
          return REVIEW_XP;
        },

        getOverdue: () => {
          const todayKey = toDateKey(new Date().toISOString());
          return get().reviews.filter(
            (r) => !r.completedAt && toDateKey(r.dueAt) < todayKey
          );
        },

        getToday: () => {
          const todayKey = toDateKey(new Date().toISOString());
          return get().reviews.filter(
            (r) => !r.completedAt && toDateKey(r.dueAt) === todayKey
          );
        },

        getUpcoming: () => {
          const todayKey = toDateKey(new Date().toISOString());
          return get().reviews.filter(
            (r) => !r.completedAt && toDateKey(r.dueAt) > todayKey
          );
        },

        clearAll: () => set({ reviews: [] }),
      }),
      { name: "sq-reviews" }
    ),
    { name: "review-store" }
  )
);
